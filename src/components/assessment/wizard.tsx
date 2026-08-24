import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Pause, Trash2 } from "lucide-react";
import { SHORT_DISCLAIMER } from "@/lib/assessment/disclaimers";
import { localReport } from "@/lib/assessment/report";
import { scaleOptions, visibleScreens } from "@/lib/assessment/screens";
import { scoreAssessment } from "@/lib/assessment/scoring";
import type { AnswerVal, AssessmentDraft, Field, Respondent } from "@/lib/assessment/types";
import { fill } from "@/lib/assessment/voice";
import { useOllie } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/layout/page";
import { YoutubeEmbed } from "@/components/youtube-embed";
import { ReportView } from "./report-view";

const MODULE_PIC: Record<string, string> = {
  intro: "/brand/story-sit.jpg",
  who: "/brand/story-together.jpg",
  about: "/brand/story-sit.jpg",
  pace: "/brand/story-tick.jpg",
  whodas: "/brand/story-tick.jpg",
  needs: "/brand/story-together.jpg",
  environment: "/brand/story-device.jpg",
  permanency: "/brand/story-path.jpg",
  mainstream: "/brand/story-wallet.jpg",
  complex: "/brand/story-words.jpg",
  review: "/brand/story-gp.jpg",
};

function asList(v: AnswerVal): string[] {
  return Array.isArray(v) ? v : [];
}

function FieldControl({
  field,
  value,
  easy,
  onChange,
}: {
  field: Field;
  value: AnswerVal;
  easy: boolean;
  onChange: (v: AnswerVal) => void;
}) {
  const prompt = easy && field.easy ? field.easy : field.prompt;
  if (field.type === "text") {
    return (
      <label className="block">
        <span className="text-sm font-medium">{prompt}</span>
        {field.hint ? <span className="mt-1 block text-xs text-muted">{field.hint}</span> : null}
        <textarea
          className="mt-2 w-full rounded-lg border border-line bg-card px-3 py-2 text-base"
          rows={field.rows ?? 3}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    );
  }
  if (field.type === "multi") {
    const selected = asList(value);
    return (
      <fieldset>
        <legend className="text-sm font-medium">{prompt}</legend>
        {field.hint ? <p className="mt-1 text-xs text-muted">{field.hint}</p> : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {(field.options ?? []).map((o) => {
            const on = selected.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={on}
                className={cn(
                  "min-h-11 rounded-lg border px-3 text-sm",
                  on ? "border-primary bg-primary text-primary-fg" : "border-line bg-card hover:bg-primary-soft",
                )}
                onClick={() =>
                  onChange(on ? selected.filter((x) => x !== o.value) : [...selected, o.value])
                }
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }
  if (field.type === "choice") {
    return (
      <fieldset>
        <legend className="text-sm font-medium">{prompt}</legend>
        <div className="mt-3 grid gap-2">
          {(field.options ?? []).map((o) => {
            const on = value === o.value;
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={on}
                className={cn(
                  "min-h-12 rounded-xl border px-4 py-3 text-left text-sm",
                  on ? "border-primary bg-primary-soft text-primary-deep" : "border-line bg-card hover:bg-primary-soft",
                )}
                onClick={() => onChange(o.value)}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }
  const opts = scaleOptions(field.scale ?? "whodas");
  return (
    <fieldset>
      <legend className="text-sm font-medium">{prompt}</legend>
      {field.optional ? <p className="mt-1 text-xs text-muted">Optional — skip if it does not apply.</p> : null}
      {field.hint ? <p className="mt-1 text-xs text-muted">{field.hint}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {opts.map((o) => {
          const on = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              className={cn(
                "min-h-11 min-w-11 rounded-lg border px-3 text-sm",
                on ? "border-primary bg-primary text-primary-fg" : "border-line bg-card hover:bg-primary-soft",
              )}
              onClick={() => onChange(o.value)}
            >
              {o.label}
            </button>
          );
        })}
        <button
          type="button"
          className="min-h-11 rounded-lg px-3 text-sm text-muted hover:underline"
          onClick={() => onChange(null)}
        >
          Skip
        </button>
      </div>
    </fieldset>
  );
}

export function AssessmentWizard() {
  const navigate = useNavigate();
  const a11y = useOllie((s) => s.a11y);
  const setA11y = useOllie((s) => s.setA11y);
  const assessments = useOllie((s) => s.assessments);
  const activeId = useOllie((s) => s.activeAssessmentId);
  const upsert = useOllie((s) => s.upsertAssessment);
  const remove = useOllie((s) => s.removeAssessment);
  const setActive = useOllie((s) => s.setActiveAssessment);
  const clientId = useOllie((s) => s.activeClientId);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [rested, setRested] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useOllie.persist.onFinishHydration(() => setHydrated(true));
    if (useOllie.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const s = useOllie.getState();
    if (!s.assessments.length) {
      upsert({
        clientId: s.activeClientId,
        respondent: "participant",
        stepId: "welcome",
        answers: {},
        status: "in-progress",
      });
    } else if (!s.activeAssessmentId) {
      setActive(s.assessments[0].id);
    }
  }, [hydrated, setActive, upsert]);

  const draft: AssessmentDraft | undefined = assessments.find((a) => a.id === activeId) ?? assessments[0];

  useEffect(() => {
    if (draft?.status === "complete" && draft.score) setShowReport(true);
  }, [draft?.id, draft?.status, draft?.score]);

  const respondent: Respondent =
    (typeof draft?.answers.respondent === "string" ? (draft.answers.respondent as Respondent) : draft?.respondent) ||
    "participant";

  const screens = useMemo(
    () => visibleScreens(respondent, draft?.answers ?? {}),
    [respondent, draft?.answers],
  );
  const stepIndex = Math.max(
    0,
    screens.findIndex((s) => s.id === (draft?.stepId ?? "welcome")),
  );
  const screen = screens[stepIndex] ?? screens[0];
  const progress = screens.length ? Math.round((stepIndex / Math.max(1, screens.length - 1)) * 100) : 0;

  function ensureDraft(): string {
    if (draft) return draft.id;
    return upsert({
      clientId,
      respondent: "participant",
      stepId: "welcome",
      answers: {},
      status: "in-progress",
    });
  }

  function patchAnswers(patch: Record<string, AnswerVal>, extra?: Partial<AssessmentDraft>) {
    const id = ensureDraft();
    const current = useOllie.getState().assessments.find((a) => a.id === id);
    const answers = { ...(current?.answers ?? {}), ...patch };
    const nextRespondent =
      typeof answers.respondent === "string" ? (answers.respondent as Respondent) : current?.respondent ?? "participant";
    upsert({
      id,
      answers,
      respondent: nextRespondent,
      stepId: extra?.stepId ?? current?.stepId ?? screen?.id,
      ...extra,
    });
  }

  function go(delta: number) {
    const next = screens[stepIndex + delta];
    if (!next) return;
    patchAnswers({}, { stepId: next.id });
    setShowReport(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finish() {
    if (!draft) return;
    const score = scoreAssessment(respondent, draft.answers);
    const reportLocal = localReport({ ...draft, respondent, score }, score);
    upsert({
      id: draft.id,
      status: "complete",
      score,
      reportLocal,
      stepId: "review",
    });
    setShowReport(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteNow() {
    if (draft) remove(draft.id);
    setActive("");
    setConfirmDelete(false);
    navigate({ to: "/assessment" });
  }

  if (!hydrated || !draft) {
    return <p className="text-sm text-muted">Loading a saved practice from this device…</p>;
  }

  if (showReport && draft.score) {
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setShowReport(false)}>
            <ChevronLeft className="size-4" /> Back to questions
          </Button>
          <p className="text-xs text-muted">{SHORT_DISCLAIMER}</p>
        </div>
        <ReportView draft={draft} onDelete={deleteNow} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="flex min-h-11 items-center gap-2 rounded-lg bg-card px-3 text-sm">
          <span className="text-muted">Text</span>
          <select
            className="h-10 bg-transparent"
            value={a11y.fontScale}
            onChange={(e) => setA11y({ fontScale: e.target.value as "md" | "lg" | "xl" })}
            aria-label="Text size"
          >
            <option value="md">Usual</option>
            <option value="lg">Larger</option>
            <option value="xl">Largest</option>
          </select>
        </label>
        <button
          type="button"
          className={cn(
            "min-h-11 rounded-lg border px-3 text-sm",
            a11y.easyRead ? "border-primary bg-primary-soft" : "border-line bg-card",
          )}
          aria-pressed={a11y.easyRead}
          onClick={() => setA11y({ easyRead: !a11y.easyRead })}
        >
          {a11y.easyRead ? "Easy read on" : "Easy read"}
        </button>
        <button
          type="button"
          className={cn(
            "min-h-11 rounded-lg border px-3 text-sm",
            a11y.hide3d ? "border-primary bg-primary-soft" : "border-line bg-card",
          )}
          aria-pressed={a11y.hide3d}
          onClick={() => setA11y({ hide3d: !a11y.hide3d })}
        >
          {a11y.hide3d ? "3D off" : "3D on"}
        </button>
      </div>

      <Disclaimer>
        {SHORT_DISCLAIMER} Progress {progress}% · {stepIndex + 1} of {screens.length}. Autosaved on this device.
      </Disclaimer>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>

      <div className="mt-5">
        <Card>
          <div className="welcome-row">
            {MODULE_PIC[screen.module] ? (
              <img src={MODULE_PIC[screen.module]} alt="" width={56} height={56} />
            ) : null}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary">{screen.module}</p>
              <h2 className="mt-1 text-xl font-semibold">{fill(screen.title, respondent)}</h2>
              <p className="mt-2 text-sm text-muted">{fill(screen.lede, respondent)}</p>
            </div>
          </div>
          {screen.youtube ? (
            <YoutubeEmbed id={screen.youtube.id} title={screen.youtube.title} credit={screen.youtube.credit} />
          ) : null}
          <div className="mt-5 space-y-6">
            {screen.fields.map((field) => (
              <FieldControl
                key={field.id}
                field={{
                  ...field,
                  prompt: fill(field.prompt, respondent),
                  easy: field.easy ? fill(field.easy, respondent) : field.easy,
                  hint: field.hint ? fill(field.hint, respondent) : field.hint,
                }}
                easy={a11y.easyRead}
                value={draft.answers[field.id] ?? null}
                onChange={(v) => patchAnswers({ [field.id]: v })}
              />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button variant="secondary" disabled={stepIndex === 0} onClick={() => go(-1)}>
              <ChevronLeft className="size-4" /> Back
            </Button>
            {screen.id === "review" ? (
              <Button onClick={finish}>Build practice report</Button>
            ) : (
              <Button onClick={() => go(1)}>
                Next <ChevronRight className="size-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                patchAnswers({}, { stepId: screen.id });
                setRested(true);
              }}
            >
              <Pause className="size-4" /> Save and rest
            </Button>
            {rested ? <p className="text-sm text-ok">Saved on this device. You can close this tab.</p> : null}
          </div>
        </Card>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">
          Independent practice tool. Not used by NDIA assessors.
        </p>
        {confirmDelete ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="danger" onClick={deleteNow}>
              Yes, delete now
            </Button>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
              Keep it
            </Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="size-4" /> Delete this practice now
          </Button>
        )}
      </div>
    </div>
  );
}
