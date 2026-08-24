import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { FileUp, Sparkles } from "lucide-react";
import type { PlanRead } from "@/lib/plan-reader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <Button size="lg" disabled={busy} onClick={onPick}>
          <FileUp />
          {busy ? "Reading…" : "Upload plan (PDF)"}
        </Button>
      </div>
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
    </Card>
  );
}

export function PlanExplainer({
  read,
  onClear,
}: {
  read: PlanRead;
  onClear: () => void;
}) {
  const mgmt = MGMT[read.management];
  return (
    <section className="mb-6 space-y-4" aria-labelledby="plan-explainer-h">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="plan-explainer-h" className="text-lg font-semibold">
            Your plan, in pieces
          </h2>
          <p className="mt-1 text-sm text-muted">
            From {read.fileName}. This is a reading aid. The letter and the my NDIS app still win.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={mgmt.tone}>{mgmt.label}</Badge>
          <Button size="sm" variant="ghost" onClick={onClear}>
            Remove this reading
          </Button>
        </div>
      </div>

      {read.warnings.map((w) => (
        <p key={w} className="rounded-xl bg-warn-soft px-4 py-3 text-sm">
          {w}
        </p>
      ))}

      {read.money.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {read.money.map((m) => (
            <Card key={m.label}>
              <p className="text-xs text-muted">{m.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{m.amount}</p>
            </Card>
          ))}
        </div>
      ) : null}

      <div className="space-y-3">
        {read.pieces.map((p) => (
          <Card key={p.id}>
            <p className="font-semibold">{p.title}</p>
            <p className="mt-2 text-sm leading-relaxed">{p.easy}</p>
            <p className="mt-2 text-sm text-primary-deep">{p.howToUse}</p>
            {p.found ? (
              <p className="mt-3 rounded-lg bg-paper-2 px-3 py-2 text-xs text-muted">Words noticed: {p.found}</p>
            ) : null}
          </Card>
        ))}
      </div>

      <Card>
        <p className="flex items-center gap-2 font-semibold">
          <Sparkles className="size-4 text-primary" />
          Learn to self-manage this funding
        </p>
        <ol className="mt-3 space-y-3">
          {read.lessons.map((l) => (
            <li key={l.n} className="flex gap-3 text-sm">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-medium text-primary">
                {l.n}
              </span>
              <span>
                <span className="font-medium">{l.title}.</span> {l.body}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" asChild>
            <Link to="/funding">Funding categories</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/budget">Budget helper</Link>
          </Button>
        </div>
      </Card>
    </section>
  );
}
