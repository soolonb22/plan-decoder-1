import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DOMAINS, IMPACT_PROMPTS, STRENGTH_PROMPTS, SWAP_PAIRS } from "@/lib/content/language";
import { functionalParagraph } from "@/lib/report-engine";
import { useOllie } from "@/lib/store";
import { todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { MembershipGate, PageHeader } from "@/components/layout/page";
import { DraftWithOllie } from "@/components/draft-with-ollie";

export const Route = createFileRoute("/language")({ component: LanguagePage });

function LanguagePage() {
  const add = useOllie((s) => s.addEvidence);
  const [domain, setDomain] = useState<string>(DOMAINS[0].id);
  const [task, setTask] = useState("");
  const [without, setWithout] = useState("");
  const [frequency, setFrequency] = useState("");
  const [withSupport, setWithSupport] = useState("");
  const paragraph = functionalParagraph({ domain, task, without, frequency, withSupport });

  return (
    <MembershipGate need="core">
      <PageHeader
        title="Functional language builder"
        lede="Describe function, not character. Strengths can sit next to support needs."
        picture="/brand/story-words.jpg"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <Field label="Life area">
            <select
              className="h-11 w-full rounded-lg border border-line bg-card px-3"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              {DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
          </Field>
          {IMPACT_PROMPTS.map((p) => {
            const map: Record<string, [string, (v: string) => void]> = {
              task: [task, setTask],
              without: [without, setWithout],
              frequency: [frequency, setFrequency],
              support: [withSupport, setWithSupport],
            };
            const pair = map[p.id];
            if (!pair) return null;
            return (
              <Field key={p.id} label={p.label}>
                {p.id === "task" ? (
                  <Input value={pair[0]} onChange={(e) => pair[1](e.target.value)} placeholder={p.placeholder} />
                ) : (
                  <Textarea value={pair[0]} onChange={(e) => pair[1](e.target.value)} placeholder={p.placeholder} />
                )}
              </Field>
            );
          })}
        </Card>
        <div className="space-y-4">
          <Card>
            <p className="text-sm font-medium text-primary">Draft sentence</p>
            <p className="mt-3 text-sm leading-relaxed">{paragraph}</p>
            <Button
              className="mt-4"
              onClick={() =>
                add({
                  title: task || "Functional language",
                  body: paragraph,
                  type: "observation",
                  domain: domain as never,
                  tags: ["language"],
                  date: todayISO(),
                  source: "Functional language builder",
                })
              }
            >
              Add to Evidence Wallet
            </Button>
          </Card>
          <Card>
            <p className="font-semibold">Words to swap</p>
            <ul className="mt-3 space-y-3">
              {SWAP_PAIRS.map((s) => (
                <li key={s.avoid} className="text-sm">
                  <p className="text-alert">Avoid: {s.avoid}</p>
                  <p className="text-ok">Prefer: {s.prefer}</p>
                  <p className="text-muted">{s.why}</p>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <p className="font-semibold">Strength prompts</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
              {STRENGTH_PROMPTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <div className="mt-5">
        <DraftWithOllie
          kind="functional-language"
          notes={paragraph}
          prompt="Rewrite this functional paragraph in calm plain language. Keep facts. Add no diagnosis."
        />
      </div>
    </MembershipGate>
  );
}
