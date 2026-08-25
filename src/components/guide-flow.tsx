import { useMemo, useState } from "react";
import { FLOWS, type FlowDef } from "@/lib/content/flows";
import { draftFromFlow } from "@/lib/report-engine";
import { useOllie } from "@/lib/store";
import { downloadText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { DraftWithOllie } from "@/components/draft-with-ollie";

export function GuidePicker({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {FLOWS.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onPick(f.id)}
          className="rounded-2xl border border-line bg-card p-5 text-left shadow-[var(--shadow-card)] transition-colors hover:border-line-strong hover:bg-primary-soft"
        >
          <p className="font-semibold">{f.title}</p>
          <p className="mt-1 text-sm text-muted">{f.intro}</p>
        </button>
      ))}
    </div>
  );
}

export function GuideFlow({
  flowId,
  onExit,
}: {
  flowId: string;
  onExit?: () => void;
}) {
  const flow = FLOWS.find((f) => f.id === flowId) as FlowDef;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const saveDraft = useOllie((s) => s.saveDraft);
  const addEvidence = useOllie((s) => s.addEvidence);
  const upsertMeeting = useOllie((s) => s.upsertMeeting);
  const upsertAppointment = useOllie((s) => s.upsertAppointment);

  const field = flow.fields[step];
  const done = step >= flow.fields.length;
  const output = useMemo(
    () => (done ? draftFromFlow(flow, answers) : ""),
    [done, flow, answers],
  );

  if (done) {
    return (
      <div className="space-y-4">
        <Card>
          <p className="text-sm font-medium text-primary">Here is a calm draft</p>
          <h2 className="mt-1 text-xl font-semibold">Read it. Change anything that does not sound like you.</h2>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-paper p-4 text-sm leading-relaxed">
            {output}
          </pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                saveDraft({ flowId: flow.id, answers, output });
                if (flow.outputKind === "wallet" || flow.outputKind === "impact") {
                  addEvidence({
                    title: flow.title,
                    body: output,
                    type: "observation",
                    domain: "",
                    tags: [flow.id],
                    date: new Date().toISOString().slice(0, 10),
                    source: "Plan Decoder guided help",
                  });
                }
                if (flow.outputKind === "meeting") {
                  upsertMeeting({
                    title: "Planning meeting brief",
                    talkingPoints: output,
                    questions: answers.questions || "",
                    purpose: answers.purpose || "",
                  });
                }
                if (flow.id === "appointment") {
                  upsertAppointment({
                    title: answers.who || "Allied health appointment",
                    who: answers.who || "",
                    questions: answers.ask || "",
                    sensoryNeeds: answers.sensory || "",
                    notes: output,
                    date: new Date().toISOString().slice(0, 10),
                  });
                }
              }}
            >
              Save to this device
            </Button>
            <Button variant="secondary" onClick={() => downloadText(`${flow.id}.txt`, output)}>
              Download text
            </Button>
            <Button variant="ghost" onClick={() => setStep(0)}>
              Start again
            </Button>
            {onExit ? (
              <Button variant="ghost" onClick={onExit}>
                Choose another
              </Button>
            ) : null}
          </div>
        </Card>
        <DraftWithOllie
          kind={flow.outputKind}
          notes={output}
          prompt={`Turn these guided answers into a polished ${flow.title} in plain Australian English. Keep every fact. Do not invent.`}
        />
      </div>
    );
  }

  const value = answers[field.id] ?? "";
  const progress = `${step + 1} of ${flow.fields.length}`;

  return (
    <Card>
      <p className="text-sm text-muted">{flow.title} · {progress}</p>
      <h2 className="mt-2 text-xl font-semibold">{field.prompt}</h2>
      {field.help ? <p className="mt-1 text-sm text-muted">{field.help}</p> : null}
      <div className="mt-4">
        {field.kind === "choice" ? (
          <div className="grid gap-2">
            {field.options?.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, [field.id]: o.label }))}
                className={`min-h-12 rounded-xl border px-4 py-3 text-left text-sm ${
                  value === o.label
                    ? "border-primary bg-primary-soft"
                    : "border-line bg-card hover:bg-paper"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        ) : field.kind === "long" ? (
          <Textarea
            value={value}
            onChange={(e) => setAnswers((a) => ({ ...a, [field.id]: e.target.value }))}
            placeholder="A few sentences is enough."
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => setAnswers((a) => ({ ...a, [field.id]: e.target.value }))}
          />
        )}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={() => setStep((s) => s + 1)}>
          {step === flow.fields.length - 1 ? "See the draft" : "Next"}
        </Button>
        {step > 0 ? (
          <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        ) : null}
        <Button variant="ghost" onClick={() => setStep(flow.fields.length)}>
          Skip to draft
        </Button>
      </div>
    </Card>
  );
}
