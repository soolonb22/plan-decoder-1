import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { FileUp } from "lucide-react";
import type { PlanRead } from "@/lib/plan-reader";
import { graphOrBuild, type PlanLine } from "@/lib/plan-graph";
import { friendlyFlag, matchGoalsToSupports, tidyExcerpt, type SupportRef } from "@/lib/plan-clean";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlanStructureDiagram } from "@/components/plan-diagram";

const MGMT: Record<PlanRead["management"], { label: string; tone: "primary" | "ok" | "warn" | "neutral" }> = {
  self: { label: "Looks self-managed", tone: "ok" },
  plan: { label: "Looks plan-managed", tone: "primary" },
  ndia: { label: "Looks NDIA-managed", tone: "warn" },
  mix: { label: "Looks mixed", tone: "primary" },
  unknown: { label: "Not clearly labelled", tone: "neutral" },
};

export function PlanUploadHero({
  onPick,
  onPaste,
  busy,
}: {
  onPick: () => void;
  onPaste?: (text: string) => void;
  busy: boolean;
}) {
  const [paste, setPaste] = useState("");
  const [sampleBusy, setSampleBusy] = useState(false);
  const [sampleNote, setSampleNote] = useState<string | null>(null);

  async function loadSample() {
    if (!onPaste) return;
    setSampleBusy(true);
    setSampleNote(null);
    try {
      const res = await fetch("/fixtures/dummy-ndis-plan.txt");
      if (!res.ok) throw new Error("missing");
      const text = await res.text();
      onPaste(text);
      setSampleNote("Loaded a fictional practice letter. Not a real plan. Not the NDIA.");
    } catch {
      setSampleNote("Could not load the sample. Try paste instead.");
    } finally {
      setSampleBusy(false);
    }
  }

  return (
    <Card className="mb-5 border-primary/30 bg-primary-soft/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-primary">Start here</p>
          <h2 className="mt-1 text-xl font-semibold">Upload your NDIS plan</h2>
          <p className="mt-2 text-sm text-muted">
            We read it on this device and break it into plain pieces — the money pots, who pays, and how to self-manage
            without mixing funds. Nothing is sent to the NDIA.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="lg" disabled={busy} onClick={onPick}>
            <FileUp />
            {busy ? "Reading…" : "Upload plan (PDF)"}
          </Button>
          {onPaste ? (
            <Button size="lg" variant="secondary" disabled={busy || sampleBusy} onClick={() => void loadSample()}>
              {sampleBusy ? "Loading sample…" : "Try a sample plan"}
            </Button>
          ) : null}
        </div>
      </div>
      {sampleNote ? <p className="mt-3 text-sm text-muted">{sampleNote}</p> : null}
      {onPaste ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium">Or paste text from the plan</summary>
          <textarea
            className="mt-2 min-h-28 w-full rounded-lg border border-line bg-card px-3 py-2 text-sm"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder="Paste headings, goals, and budget totals if the PDF is a photo."
          />
          <Button
            className="mt-2"
            size="sm"
            disabled={busy || paste.trim().length < 20}
            onClick={() => {
              onPaste(paste);
              setPaste("");
            }}
          >
            Explain this text
          </Button>
        </details>
      ) : null}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium">What is inside an NDIS plan?</summary>
        <div className="mt-3">
          <PlanStructureDiagram compact />
        </div>
      </details>
    </Card>
  );
}

const POT_NAME: Record<PlanLine["pot"], string> = {
  core: "Core",
  capacity: "Capacity Building",
  capital: "Capital",
  recurring: "Recurring",
  unknown: "Budget not clear",
};

const ITEM_NAME: Record<string, string> = {
  daily_living: "Help with daily life",
  community: "Social and community participation",
  consumables: "Consumables",
  transport: "Transport",
  idl: "Improved daily living (therapy)",
  coord: "Support coordination",
  work: "Finding and keeping a job",
  relationships: "Improved relationships",
  health: "Improved health and wellbeing",
  learning: "Improved learning",
  life_choices: "Improved life choices",
  at: "Assistive technology",
  home_mod: "Home modifications",
  vehicle_mod: "Vehicle modifications",
  sil: "Supported independent living",
  sda: "Specialist disability accommodation",
};

const CONFIDENCE: Record<string, string> = {
  high: "Read clearly",
  medium: "Mostly read — check the amounts",
  low: "Hard to read — check everything",
};

/** Who the person can pay, by how the plan is managed. Kept short on purpose. */
const WHO_CAN_PROVIDE: Record<PlanRead["management"], { title: string; body: string }> = {
  self: {
    title: "Self-managed: you choose",
    body: "You can use registered or unregistered providers, as long as the support is an NDIS support and fits the budget. You pay, then claim. Keep every invoice.",
  },
  plan: {
    title: "Plan-managed: registered or unregistered",
    body: "You can use registered or unregistered providers. Ask them to send invoices to your plan manager, who pays them.",
  },
  ndia: {
    title: "NDIA-managed: registered providers only",
    body: "Providers must be NDIS-registered. They claim from the NDIA directly. Ask “Are you registered?” before you book.",
  },
  mix: {
    title: "Mixed: it depends on the line",
    body: "Each budget can be managed a different way. Check who manages each line, then follow that rule: NDIA-managed lines need registered providers.",
  },
  unknown: {
    title: "Check how your plan is managed",
    body: "Your letter says who pays the bills. NDIA-managed lines need registered providers. Plan- and self-managed lines can use registered or unregistered providers.",
  },
};

const PROVIDER_TYPES: { pot: string; who: string }[] = [
  { pot: "Core", who: "Support workers, community access, cleaning and gardening (if disability-related), continence and other consumables." },
  { pot: "Capacity Building", who: "OTs, speech pathologists, psychologists, physios, support coordinators, employment supports." },
  { pot: "Capital", who: "Equipment suppliers and builders — usually after a quote or assessment." },
  { pot: "Recurring", who: "Transport — taxi, rideshare or kilometres, as the plan says." },
];

const THIRTY_DAYS = [
  "Find who manages each budget (you, a plan manager, or the NDIA).",
  "Save the plan PDF and the my NDIS app login somewhere safe.",
  "Read your goals. Mark which ones matter most right now.",
  "If you have support coordination, book a first meeting.",
  "Pick one provider for the most urgent goal and ask for a service agreement.",
  "Start a spend log in the Spend tab so you can see what is left.",
];

function cleanWarning(w: string): string | null {
  // Older saved readings stored raw parser flags (e.g. "old_three_pot_or_partial").
  if (/^[a-z_]+(:[a-z_]+)?$/.test(w)) return friendlyFlag(w);
  return w;
}

function money(n: number) {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

function Step({ n, title, children, open = false }: { n: number; title: string; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group rounded-2xl border border-line bg-card">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-fg">
          {n}
        </span>
        <span className="font-semibold">{title}</span>
        <span className="ml-auto text-xs text-muted group-open:hidden">Open</span>
      </summary>
      <div className="space-y-3 px-4 pb-4">{children}</div>
    </details>
  );
}

export function PlanExplainer({
  read,
  onClear,
  onReplace,
}: {
  read: PlanRead;
  onClear: () => void;
  onReplace?: () => void;
}) {
  const graph = graphOrBuild(read);
  const mgmt = MGMT[graph.management] ?? MGMT[read.management] ?? MGMT.unknown;
  const warnings = (read.warnings ?? []).map(cleanWarning).filter((w): w is string => Boolean(w));
  const pieces = read.pieces.filter((p) => p.present);

  // Budget totals for the at-a-glance bars.
  const byPot = new Map<PlanLine["pot"], number>();
  for (const l of graph.lines) byPot.set(l.pot, (byPot.get(l.pot) ?? 0) + l.amount);
  const total = [...byPot.values()].reduce((a, b) => a + b, 0);

  const supports: SupportRef[] = graph.lines.map((l) => ({
    key: l.item,
    label: ITEM_NAME[l.item] ?? l.label,
    pot: POT_NAME[l.pot],
  }));
  const map = matchGoalsToSupports(graph.goals, supports);
  const who = WHO_CAN_PROVIDE[graph.management] ?? WHO_CAN_PROVIDE.unknown;

  return (
    <section className="mb-6 space-y-4" aria-labelledby="plan-explainer-h">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 id="plan-explainer-h" className="text-lg font-semibold">
            Your plan
          </h2>
          <p className="text-sm text-muted">
            {read.fileName} · read on this device · {CONFIDENCE[graph.confidence]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onReplace ? (
            <Button size="sm" variant="secondary" onClick={onReplace}>
              Upload a different plan
            </Button>
          ) : null}
          <Button size="sm" variant="ghost" onClick={onClear}>
            Remove
          </Button>
        </div>
      </div>

      {warnings.map((w) => (
        <p key={w} className="rounded-xl bg-warn-soft px-4 py-3 text-sm">
          {w}
        </p>
      ))}

      <Step n={1} title="Your plan at a glance" open>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Plan start</dt>
            <dd className="font-medium">{graph.dates.start ?? "Not found"}</dd>
          </div>
          <div>
            <dt className="text-muted">Reassessment / end</dt>
            <dd className="font-medium">{graph.dates.end ?? "Not found"}</dd>
          </div>
          <div>
            <dt className="text-muted">Who pays the bills</dt>
            <dd>
              <Badge tone={mgmt.tone}>{mgmt.label}</Badge>
            </dd>
          </div>
        </dl>
        {total > 0 ? (
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-muted">Total we found: </span>
              <span className="font-semibold tabular-nums">{money(total)}</span>
            </p>
            {[...byPot.entries()].map(([pot, amt]) => (
              <div key={pot}>
                <div className="flex justify-between text-sm">
                  <span>{POT_NAME[pot]}</span>
                  <span className="tabular-nums">{money(amt)}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-paper-2">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((amt / total) * 100)}%` }} />
                </div>
              </div>
            ))}
            <ul className="mt-2 space-y-1 text-xs text-muted">
              {graph.lines.map((l) => (
                <li key={`${l.path}-${l.item}-${l.amountText}`}>
                  {ITEM_NAME[l.item] ?? l.label} · {l.amountText} ·{" "}
                  {l.lock === "unknown" ? "stated or flexible not shown — check your letter" : l.lock}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-muted">We could not read the amounts. Check the funding table in your letter or the my NDIS app.</p>
        )}
        <p className="text-xs text-muted">Wrong? Your letter and the my NDIS app are always right. This is a reading aid.</p>
      </Step>

      <Step n={2} title="Goals and the supports that match them">
        {map.matches.length ? (
          <ul className="space-y-3">
            {map.matches.map((m) => (
              <li key={m.goal} className="rounded-xl border border-line p-3">
                <p className="text-sm font-medium">{m.goal}</p>
                {m.supports.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.supports.map((s) => (
                      <Badge key={`${s.key}-${s.label}`} tone="ok">
                        {s.label}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-alert">No support clearly matches this goal. Ask your coordinator or raise it at review.</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">We could not find goals in this file. Add them yourself in the Goals tab.</p>
        )}
        {map.orphans.length ? (
          <p className="text-sm">
            <span className="font-medium">Not linked to a goal yet: </span>
            {map.orphans.map((o) => o.label).join(", ")}. At review, the NDIA asks how each support helps a goal — write one line for each.
          </p>
        ) : null}
        <p className="text-xs text-muted">Matched by keywords. You know your life best — change anything that is wrong.</p>
      </Step>

      <Step n={3} title="What each part of the plan means">
        <PlanStructureDiagram read={read} />
        <div className="space-y-2">
          {pieces.map((p) => (
            <details key={p.id} className="rounded-xl border border-line px-3 py-2">
              <summary className="cursor-pointer text-sm font-medium">{p.title}</summary>
              <p className="mt-2 text-sm">{p.easy}</p>
              <p className="mt-2 text-sm text-primary-deep">{p.howToUse}</p>
              {p.id === "goals" && graph.goals.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                  {graph.goals.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              ) : p.found ? (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-muted">Show your plan’s wording</summary>
                  <p className="mt-1 rounded-lg bg-paper-2 px-3 py-2 text-xs text-muted">{tidyExcerpt(p.found)}</p>
                </details>
              ) : null}
            </details>
          ))}
        </div>
      </Step>

      <Step n={4} title="How to start: your first 30 days">
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {THIRTY_DAYS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
        <ul className="space-y-1 text-sm text-muted">
          {read.lessons.map((l) => (
            <li key={l.n}>
              <span className="font-medium text-ink">{l.title}.</span> {l.body}
            </li>
          ))}
        </ul>
      </Step>

      <Step n={5} title="Who you can use">
        <div className="rounded-xl bg-primary-soft/50 px-3 py-2">
          <p className="text-sm font-medium">{who.title}</p>
          <p className="mt-1 text-sm">{who.body}</p>
        </div>
        <ul className="space-y-1 text-sm">
          {PROVIDER_TYPES.map((t) => (
            <li key={t.pot}>
              <span className="font-medium">{t.pot}:</span> {t.who}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" asChild>
            <Link to="/plan" search={{ tab: "people" }}>
              Save providers
            </Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link to="/funding">Funding categories</Link>
          </Button>
        </div>
      </Step>

      <p className="text-xs text-muted">{graph.disclaimer}</p>
    </section>
  );
}
