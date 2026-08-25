import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { DOMAINS, IMPACT_PROMPTS, STRENGTH_PROMPTS, SWAP_PAIRS } from "@/lib/content/language";
import { SCRIPT_LIBRARY } from "@/lib/content/scripts";
import { functionalParagraph } from "@/lib/report-engine";
import { useOllie, useClientList } from "@/lib/store";
import { downloadText, formatDate, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";
import { DraftWithOllie } from "@/components/draft-with-ollie";
import { RoomTabs } from "@/components/room-tabs";

const TABS = [
  { id: "everyday", label: "Everyday" },
  { id: "impact", label: "Impact" },
  { id: "scripts", label: "Scripts" },
  { id: "clinical", label: "Clinical" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export const Route = createFileRoute("/words")({
  validateSearch: (raw: Record<string, unknown>): { tab: Tab } => {
    const tab = String(raw.tab ?? "");
    if (tab === "impact" || tab === "scripts" || tab === "clinical" || tab === "everyday") return { tab };
    return { tab: "everyday" };
  },
  component: WordsPage,
  head: () => ({
    meta: [
      { title: "Words · Plan Decoder" },
      {
        name: "description",
        content: "Everyday functional language, impact statements, advocacy scripts, and clinical notes. Practice only — not the NDIA.",
      },
    ],
  }),
});

function WordsPage() {
  const { tab } = Route.useSearch();
  return (
    <div>
      <PageHeader
        title="Words"
        lede="Describe function, not character. Everyday language, impact, scripts, and (for professionals) clinical notes."
        picture="/brand/story-words.jpg"
      />
      <RoomTabs to="/words" tab={tab} items={[...TABS]} label="Words" />
      {tab === "clinical" ? (
        <MembershipGate need="pro">
          <ClinicalPanel />
        </MembershipGate>
      ) : (
        <MembershipGate need="core">
          {tab === "everyday" ? <LanguagePanel /> : null}
          {tab === "impact" ? <ImpactPanel /> : null}
          {tab === "scripts" ? <ScriptsPanel /> : null}
        </MembershipGate>
      )}
    </div>
  );
}

function LanguagePanel() {
  const add = useOllie((s) => s.addEvidence);
  const [domain, setDomain] = useState<string>(DOMAINS[0].id);
  const [task, setTask] = useState("");
  const [without, setWithout] = useState("");
  const [frequency, setFrequency] = useState("");
  const [withSupport, setWithSupport] = useState("");
  const paragraph = functionalParagraph({ domain, task, without, frequency, withSupport });

  return (
    <div>
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
              Add to Evidence pocket
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
    </div>
  );
}

function ImpactPanel() {
  const drafts = useClientList("drafts").filter((d) => d.flowId === "impact");
  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        A short statement of what is hard, how often, and what support changes. Guided help writes the first draft.
      </p>
      <Button className="mb-4" asChild>
        <Link to="/guide">Write with guided help</Link>
      </Button>
      {drafts.length === 0 ? (
        <EmptyState
          title="No impact statements yet"
          body="Use Guided help → Write an impact statement. You can edit every word."
        />
      ) : (
        <div className="space-y-3">
          {drafts.map((d) => (
            <Card key={d.id}>
              <p className="text-xs text-muted">{formatDate(d.createdAt)}</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{d.output}</pre>
              <Button
                className="mt-3"
                size="sm"
                variant="secondary"
                onClick={() => downloadText("impact-statement.txt", d.output)}
              >
                Download
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ScriptsPanel() {
  const active = useOllie((s) => s.activeClientId);
  const saved = useOllie((s) => s.scripts).filter((s) => !s.clientId || s.clientId === active);
  const add = useOllie((s) => s.addScript);
  const remove = useOllie((s) => s.removeScript);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const filtered = useMemo(() => {
    const n = q.toLowerCase();
    return SCRIPT_LIBRARY.filter(
      (s) =>
        !n ||
        s.title.toLowerCase().includes(n) ||
        s.category.toLowerCase().includes(n) ||
        s.body.toLowerCase().includes(n),
    );
  }, [q]);

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Words for the moments that go too fast. Change names, dates, and anything that is not true for you. Saved copies
        stay with this person.
      </p>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search scripts" className="mb-4" />
      <div className="space-y-3">
        {filtered.map((s) => (
          <Card key={s.id}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{s.title}</p>
              <Badge>{s.category}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">{s.when}</p>
            <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{s.body}</pre>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => downloadText(`${s.id}.txt`, s.body)}>
                Download
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => add({ title: s.title, category: s.category, body: s.body, custom: false })}
              >
                Save a copy
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-6 space-y-3">
        <p className="font-semibold">Your words</p>
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Script">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} />
        </Field>
        <Button
          disabled={!title.trim() || !body.trim()}
          onClick={() => {
            add({ title, category: "Mine", body, custom: true });
            setTitle("");
            setBody("");
          }}
        >
          Save my script
        </Button>
        {saved.map((s) => (
          <div key={s.id} className="rounded-xl border border-line p-3 text-sm">
            <p className="font-medium">{s.title}</p>
            <Button size="sm" variant="ghost" onClick={() => remove(s.id)}>
              Remove
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ClinicalPanel() {
  const add = useOllie((s) => s.addEvidence);
  const [notes, setNotes] = useState("");
  const [domain, setDomain] = useState<string>(DOMAINS[0].id);
  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        For allied health and coordinators. Translate session notes into NDIS functional language without over-claiming.
      </p>
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
        <Field label="Clinical or session notes (your words)">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button
          disabled={!notes.trim()}
          onClick={() =>
            add({
              title: "Clinical working note",
              body: notes,
              type: "clinical",
              domain: domain as never,
              tags: ["clinical"],
              date: todayISO(),
              source: "Clinical language builder",
            })
          }
        >
          File in vault
        </Button>
      </Card>
      <div className="mt-4">
        <DraftWithOllie
          kind="clinical-language"
          notes={notes}
          prompt="Rewrite these notes as NDIS-ready functional language for a support letter. No diagnosis. No guarantee of funding. Include frequency if present. Use the life area as a heading. Australian English. Clinician-facing but still plain."
        />
      </div>
    </div>
  );
}
