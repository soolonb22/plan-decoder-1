import { useMemo, useState } from "react";
import { DOMAINS } from "@/lib/content/language";
import {
  SCALE,
  WHODAS_DISCLAIMER,
  WHODAS_ITEMS,
  descriptor,
  scoreWhodas,
} from "@/lib/whodas";
import type { WhodasDomain } from "@/lib/types";
import { PRACTICE_THRESHOLD, type ResultRow } from "@/lib/assessment/clinical";
import { DomainAverageBars, LongitudinalLines, PracticeIndexBars } from "@/components/assessment/practice-charts";
import { useOllie, useClientList } from "@/lib/store";
import { formatDate, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/layout/page";

function toRows(
  domains: { domain: WhodasDomain; avg: number; answered: number }[],
): ResultRow[] {
  return domains.map((d) => {
    const title = DOMAINS.find((x) => x.id === d.domain)?.title ?? d.domain;
    return {
      id: d.domain,
      title,
      raw: d.avg,
      rawMax: 4,
      practiceIndex: Math.round((d.avg / 4) * 100),
      aboveThreshold: d.answered > 0 && d.avg >= PRACTICE_THRESHOLD,
      descriptor: d.answered ? descriptor(d.avg) : "Not answered",
      answered: d.answered,
      elevated: 0,
      total: d.answered,
    };
  });
}

export function FunctionPanel() {
  const save = useOllie((s) => s.saveWhodas);
  const history = useClientList("whodas");
  const [items, setItems] = useState<Record<string, number | null>>({});
  const [notes, setNotes] = useState("");
  const [domainFilter, setDomainFilter] = useState<WhodasDomain | "all">("all");
  const score = useMemo(() => scoreWhodas(items), [items]);
  const rows = useMemo(() => toRows(score.domains), [score]);
  const series = useMemo(
    () =>
      [...history]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((h) => {
          const s = scoreWhodas(h.items);
          return { date: formatDate(h.date), total: s.avgOverall, support: 0 };
        }),
    [history],
  );
  const visible = WHODAS_ITEMS.filter((i) => domainFilter === "all" || i.domain === domainFilter);

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Inspired by WHODAS 2.0 life areas. Skip anything that does not apply. Average scores handle skipped items.
      </p>
      <Disclaimer>{WHODAS_DISCLAIMER}</Disclaimer>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant={domainFilter === "all" ? "primary" : "secondary"} onClick={() => setDomainFilter("all")}>
          All
        </Button>
        {DOMAINS.map((d) => (
          <Button
            key={d.id}
            size="sm"
            variant={domainFilter === d.id ? "primary" : "secondary"}
            onClick={() => setDomainFilter(d.id)}
          >
            {d.title}
          </Button>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {visible.map((item) => (
          <Card key={item.id}>
            <p className="text-sm font-medium">
              {item.text}
              {item.optional ? <span className="text-muted"> (optional)</span> : null}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SCALE.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`min-h-11 rounded-lg border px-3 text-sm ${
                    items[item.id] === s.value
                      ? "border-primary bg-primary text-primary-fg"
                      : "border-line bg-card hover:bg-primary-soft"
                  }`}
                  onClick={() => setItems((prev) => ({ ...prev, [item.id]: s.value }))}
                >
                  {s.label}
                </button>
              ))}
              <button
                type="button"
                className="min-h-11 rounded-lg px-3 text-sm text-muted hover:underline"
                onClick={() => setItems((prev) => ({ ...prev, [item.id]: null }))}
              >
                Skip
              </button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <p className="font-semibold">Average scores</p>
        <p className="mt-1 text-sm text-muted">
          Overall average {score.avgOverall.toFixed(2)} ({descriptor(score.avgOverall)}) · simple 0–100 transform{" "}
          {score.simple100} · {score.answered} items answered
        </p>
        {score.answered ? (
          <div className="mt-4">
            <DomainAverageBars rows={rows.filter((r) => r.answered)} />
            <PracticeIndexBars
              rows={[
                ...rows.filter((r) => r.answered),
                {
                  id: "total",
                  title: "Total average",
                  raw: score.avgOverall,
                  rawMax: 4,
                  practiceIndex: score.simple100,
                  aboveThreshold: score.avgOverall >= PRACTICE_THRESHOLD,
                  descriptor: descriptor(score.avgOverall),
                  answered: score.answered,
                  elevated: 0,
                  total: score.answered,
                },
              ]}
            />
          </div>
        ) : null}
        <textarea
          className="mt-4 min-h-20 w-full rounded-lg border border-line p-3 text-sm"
          placeholder="Notes for a clinician or coordinator"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button className="mt-3" onClick={() => save({ date: todayISO(), items, notes })} disabled={score.answered === 0}>
          Save snapshot
        </Button>
        {history.length ? (
          <p className="mt-3 text-xs text-muted">
            {history.length} saved snapshot{history.length === 1 ? "" : "s"} on this device.
          </p>
        ) : null}
      </Card>
      {series.length > 1 ? (
        <Card className="mt-4">
          <p className="font-semibold">Change over time</p>
          <p className="mt-1 text-sm text-muted">
            Later snapshots show whether the total average moved. This is a practice plot, not a treatment outcome.
          </p>
          <LongitudinalLines series={series} />
        </Card>
      ) : null}
    </div>
  );
}
