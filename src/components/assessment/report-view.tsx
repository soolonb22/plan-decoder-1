import { Download, FileText, Printer, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { downloadPracticePdf } from "@/lib/assessment/pdf";
import { SHORT_DISCLAIMER } from "@/lib/assessment/disclaimers";
import { BAND_COPY } from "@/lib/assessment/scoring";
import { writeAiPracticeReport } from "@/lib/ollie-assess";
import { digestForAi } from "@/lib/assessment/report";
import { stripIdentifiers } from "@/lib/strip-identifiers";
import { ONE_OFF, canViewFullReport } from "@/lib/membership";
import { useActiveClient, useOllie } from "@/lib/store";
import { downloadText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/layout/page";
import { OutcomeUnlock } from "@/components/outcome-paywall";
import type { AssessmentDraft } from "@/lib/assessment/types";
import { ClinicalReport } from "./clinical-report";

export function ReportView({
  draft,
  onDelete,
}: {
  draft: AssessmentDraft;
  onDelete: () => void;
}) {
  const membership = useOllie((s) => s.membership);
  const setBilling = useOllie((s) => s.setBilling);
  const upsert = useOllie((s) => s.upsertAssessment);
  const assessments = useOllie((s) => s.assessments);
  const client = useActiveClient();
  const open = canViewFullReport(membership, draft.unlocked);
  const score = draft.score;
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const body = draft.reportAi || draft.reportLocal;
  const history = assessments.filter((a) => a.clientId === draft.clientId);

  function unlockThisReport() {
    upsert({ id: draft.id, unlocked: true, score, status: "complete" });
  }

  function showPreview() {
    if (!score || !open) return;
    const stripped = stripIdentifiers(digestForAi(draft, score));
    if (!stripped.trim()) {
      setPreview(null);
      setError("Nothing left to send. Your notes are still on this device.");
      return;
    }
    setError(null);
    setPreview(stripped);
  }

  async function polish() {
    if (!score || !open || preview == null || busy) return;
    const outgoing = stripIdentifiers(preview);
    if (!outgoing.trim()) {
      setError("Nothing left to send. Your notes are still on this device.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await writeAiPracticeReport({
        data: { digest: outgoing, assessmentId: draft.id },
      });
      if (!res.ok) setError(res.error);
      else {
        upsert({ id: draft.id, reportAi: res.text, status: "complete", score, unlocked: true });
        if ("credits" in res && typeof res.credits === "number") {
          setBilling({ credits: res.credits });
        }
      }
    } catch {
      setError("Plan Decoder could not polish just now. Your structured report is still here.");
    } finally {
      setBusy(false);
      setPreview(null);
    }
  }

  async function pdf() {
    if (!open || !score) return;
    setSaving(true);
    setError(null);
    try {
      await downloadPracticePdf(draft, client);
    } catch {
      setError("The PDF could not be built in this browser. Try print, or download the text.");
    } finally {
      setSaving(false);
    }
  }

  if (!score) {
    return (
      <Card>
        <p className="font-medium">No scores yet</p>
        <Button className="mt-3" asChild>
          <Link to="/assessment" search={{ tab: "practice" }}>Back to practice</Link>
        </Button>
      </Card>
    );
  }

  const band = BAND_COPY[score.eligibilityBand];

  if (!open) {
    return (
      <div className="space-y-4">
        <Disclaimer>{SHORT_DISCLAIMER} The questions you answered stay on this device. The full report is optional.</Disclaimer>
        <Card>
          <div className="welcome-row">
            <img src="/brand/story-gp.jpg" alt="" width={56} height={56} />
            <div>
              <p className="text-sm font-medium text-primary">Questions are done</p>
              <h2 className="mt-1 text-xl font-semibold">Practice report — {ONE_OFF.price}</h2>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted">
          You can keep a simple scorecard for free with Core. The full clinical-style report and PDF uses 1 credit ($5).
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-paper-2 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Function average</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{score.whodas.avgOverall.toFixed(2)}</p>
              <p className="text-sm text-muted">{score.whodas.descriptor}</p>
            </div>
            <div className="rounded-xl bg-paper-2 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Practice index</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{score.whodas.simple100}</p>
              <p className="text-sm text-muted">simple 0–100 of answered items</p>
            </div>
            <div className="rounded-xl bg-paper-2 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Practice indicators</p>
              <p className="mt-1 text-lg font-semibold">{band.title}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">{band.body}</p>
        </Card>
        <OutcomeUnlock
          kind="practice_report"
          subjectId={draft.id}
          title={`Practice report — 1 credit (${ONE_OFF.price})`}
          body="Unlocks the results table, plots, interpretation, answer grid, and PDF for this rehearsal. Answering the questions is included with Core."
          onUnlock={unlockThisReport}
        />
        <Card>
          <p className="font-semibold">Gaps to look at (free)</p>
          <ul className="mt-3 space-y-2 text-sm">
            {score.gaps.slice(0, 4).map((g) => (
              <li key={g.title}>
                <span className="font-medium">{g.title}.</span> {g.detail}
              </li>
            ))}
            {!score.gaps.length ? <li className="text-muted">No extra gaps flagged beyond skipped items.</li> : null}
          </ul>
        </Card>
        <Card className="border-alert/40">
          <p className="font-semibold">Delete this practice</p>
          <p className="mt-1 text-sm text-muted">
            Removes this rehearsal from this browser immediately. It does not contact the NDIA.
          </p>
          <Button className="mt-3" variant="danger" onClick={onDelete}>
            <Trash2 className="size-4" /> Delete now
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="no-print space-y-3">
        <Disclaimer>{SHORT_DISCLAIMER} You can delete this report from this device at any time.</Disclaimer>
        <Card>
          <p className="font-semibold">Take this to a GP or allied health professional</p>
          <p className="mt-1 text-sm text-muted">
            The pages below follow a clinical-style layout: results table, threshold flags, plots, interpretation, and the answers you ticked. Still practice only.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => downloadText("plan-decoder-practice-report.txt", body)}
            >
              <FileText className="size-4" /> Download text
            </Button>
            <Button onClick={() => void pdf()} disabled={saving}>
              <Download className="size-4" /> {saving ? "Building PDF…" : "Download PDF"}
            </Button>
            <Button variant="ghost" onClick={() => window.print()}>
              <Printer className="size-4" /> Print
            </Button>
            <Button variant="secondary" disabled={busy} onClick={showPreview}>
              {draft.reportAi ? "Show rewrite text" : "Show what will be sent"}
            </Button>
          </div>
          {preview != null ? (
            <div className="mt-4">
              <p className="text-sm font-medium text-ink">This is what will leave this device</p>
              <textarea
                className="mt-2 min-h-32 w-full rounded-xl border border-border bg-paper p-3 text-sm leading-relaxed"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                aria-label="This is what will leave this device"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button disabled={busy || !preview.trim()} onClick={() => void polish()}>
                  {busy ? "Writing a draft…" : "Send this and use 1 credit"}
                </Button>
                <Button variant="secondary" disabled={busy} onClick={() => setPreview(null)}>
                  Keep it on this device
                </Button>
              </div>
            </div>
          ) : null}
          {error ? <p className="mt-3 text-sm text-alert">{error}</p> : null}
        </Card>
      </div>

      <ClinicalReport draft={draft} score={score} client={client} history={history} />

      {draft.reportAi ? (
        <Card className="no-print">
          <p className="font-semibold">Plan Decoder’s extra narrative</p>
          <pre className="mt-3 max-h-[20rem] overflow-auto whitespace-pre-wrap rounded-xl bg-paper p-4 text-sm leading-relaxed">
            {draft.reportAi}
          </pre>
        </Card>
      ) : null}

      <Card className="no-print border-alert/40">
        <p className="font-semibold">Delete this practice</p>
        <p className="mt-1 text-sm text-muted">
          Removes this rehearsal from this browser immediately. It does not contact the NDIA.
        </p>
        <Button className="mt-3" variant="danger" onClick={onDelete}>
          <Trash2 className="size-4" /> Delete now
        </Button>
      </Card>
    </div>
  );
}
