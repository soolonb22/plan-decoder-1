import { REPORT_BANNER, SHORT_DISCLAIMER } from "@/lib/assessment/disclaimers";
import {
  PRACTICE_THRESHOLD,
  buildClinicalModel,
  historySeries,
  type ResultRow,
} from "@/lib/assessment/clinical";
import type { AssessmentDraft, AssessmentScore } from "@/lib/assessment/types";
import type { Client } from "@/lib/types";
import { OllieMark } from "@/components/mark";
import { DomainAverageBars, LongitudinalLines, PracticeIndexBars } from "./practice-charts";

function FlagCell({ yes }: { yes: boolean }) {
  return yes ? (
    <td className="clinical-yes">Yes</td>
  ) : (
    <td className="clinical-no">No</td>
  );
}

function ResultTable({ title, rows }: { title: string; rows: ResultRow[] }) {
  return (
    <section className="clinical-block">
      <h2>{title}</h2>
      <div className="clinical-table-wrap">
        <table className="clinical-table">
          <thead>
            <tr>
              <th>Scale</th>
              <th>Raw / average</th>
              <th>Above practice threshold?</th>
              <th>Practice index</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <th>
                  {r.title}
                  <span className="clinical-muted"> · {r.descriptor}</span>
                </th>
                <td>
                  {r.rawMax === 4 ? r.raw.toFixed(2) : r.raw.toFixed(1)} / {r.rawMax}
                </td>
                <FlagCell yes={r.aboveThreshold} />
                <td>{r.answered ? r.practiceIndex : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ClinicalReport({
  draft,
  score,
  client,
  history,
}: {
  draft: AssessmentDraft;
  score: AssessmentScore;
  client?: Client | null;
  history?: AssessmentDraft[];
}) {
  const model = buildClinicalModel(draft, score, client);
  const series = historySeries(history ?? []);
  const whoTable = [...model.whodasRows, model.overallWho];
  const supportShown = model.supportRows.filter((r) => r.answered);

  return (
    <article className="clinical-doc">
      <header className="clinical-brand">
        <OllieMark className="clinical-logo size-14" />
        <div>
          <p className="clinical-powered">Practice assessment</p>
          <p className="clinical-brand-name">Plan Decoder</p>
        </div>
      </header>

      <h1 className="clinical-title">{model.title}</h1>

      <dl className="clinical-meta">
        <div>
          <dt>Client name</dt>
          <dd>{model.clientName}</dd>
        </div>
        <div>
          <dt>Date administered</dt>
          <dd>{model.administered}</dd>
        </div>
        <div>
          <dt>Completed by</dt>
          <dd>{model.respondent}</dd>
        </div>
        <div>
          <dt>Coverage</dt>
          <dd>{model.answeredLine}</dd>
        </div>
      </dl>

      <p className="clinical-banner">{SHORT_DISCLAIMER} Independent of the NDIA, NDIS, WHO, and any official I-CAN tool. Not a diagnosis. Not a funding quote.</p>

      <ResultTable title="Results — WHODAS-inspired function" rows={whoTable} />
      {supportShown.length ? (
        <ResultTable title="Results — support rehearsal" rows={[...supportShown, model.overallSupport]} />
      ) : null}

      <DomainAverageBars rows={model.whodasRows.filter((r) => r.answered)} />
      <PracticeIndexBars rows={[...model.whodasRows.filter((r) => r.answered), model.overallWho]} />
      <LongitudinalLines series={series.map((s) => ({ date: s.date, total: s.total, support: s.support }))} />

      <section className="clinical-block">
        <h2>Interpretation</h2>
        <p className="clinical-note">
          Practice index is a simple 0–100 transform of answered items. It is not a normative percentile and not official WHODAS IRT scoring. The practice threshold is a rehearsal line at Moderate (average {PRACTICE_THRESHOLD.toFixed(1)} / 4).
        </p>
        {model.narratives.map((n) => (
          <div key={n.id} className="clinical-narrative">
            <h3>{n.title}</h3>
            <p className="clinical-raw">{n.rawLine}</p>
            <p>{n.body}</p>
            {n.endorsed.length ? (
              <ul>
                {n.endorsed.slice(0, 8).map((e) => (
                  <li key={e.text}>
                    {e.text} ({e.label})
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      <section className="clinical-block">
        <h2>Everyday impact</h2>
        <p>{model.impairment}</p>
        {model.extra.length ? (
          <ul className="clinical-extra">
            {model.extra.map((e) => (
              <li key={e.label}>
                <strong>{e.label}:</strong> {e.value}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="clinical-block">
        <h2>Scoring and interpretation information</h2>
        <ol className="clinical-ol">
          <li>Averages use only the items that were answered.</li>
          <li>Higher averages mean more difficulty (function) or more extra support (support rehearsal), as described in this rehearsal.</li>
          <li>Official WHODAS 2.0 IRT percentiles are not calculated.</li>
          <li>Support questions are original rehearsal items, not I-CAN v6.</li>
          <li>
            “Above practice threshold” means average ≥ {PRACTICE_THRESHOLD.toFixed(1)} on function items, or intensity ≥ 5.5 on support rehearsal. That is not an NDIA rule.
          </li>
        </ol>
      </section>

      {model.grids.map((grid) => (
        <section key={grid.title} className="clinical-block">
          <h2>{grid.title}</h2>
          <div className="clinical-table-wrap">
            <table className="clinical-grid">
              <thead>
                <tr>
                  <th className="clinical-grid-n">#</th>
                  <th className="clinical-grid-prompt">Item</th>
                  {grid.labels.map((lab) => (
                    <th key={lab}>{lab}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="clinical-grid-n">{row.n}</td>
                    <td className="clinical-grid-prompt">{row.prompt}</td>
                    {row.labels.map((_, i) => (
                      <td key={i} className={row.value === i ? "clinical-picked" : undefined}>
                        {row.value === i ? i : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <p className="clinical-end">
        {REPORT_BANNER} {model.roleLine}. You can edit or delete this on the device. Do not send it instead of seeing a qualified clinician.
      </p>
    </article>
  );
}
