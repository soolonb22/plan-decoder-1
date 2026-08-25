import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { FileUp, Sparkles } from "lucide-react";
import type { PlanRead } from "@/lib/plan-reader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <div className="mt-4">
        <PlanStructureDiagram compact />
      </div>
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
  const found = read.pieces.filter((p) => p.present);
  const extra = read.pieces.filter((p) => !p.present);
  return (
    <section className="mb-6 space-y-5" aria-labelledby="plan-explainer-h">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id="plan-explainer-h" className="text-lg font-semibold">
            Your plan, in pieces
          </h2>
          <p className="mt-1 text-sm text-muted">
            From {read.fileName}. Scraped on this device. Each section has a picture so the pots are easier to hold. The
            letter and the my NDIS app still win.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={mgmt.tone}>{mgmt.label}</Badge>
          <Button size="sm" variant="ghost" onClick={onClear}>
            Remove this reading
          </Button>
        </div>
      </div>

      <PlanStructureDiagram read={read} />

      {read.warnings.map((w) => (
        <p key={w} className="rounded-xl bg-warn-soft px-4 py-3 text-sm">
          {w}
        </p>
      ))}

      {read.dates.length ? (
        <p className="text-sm text-muted">
          <span className="font-medium text-ink">Dates noticed: </span>
          {read.dates.join(" · ")}
        </p>
      ) : null}

      {read.money.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {read.money.map((m) => (
            <Card key={m.label} className="flex gap-3">
              <img src="/brand/story-wallet.jpg" alt="" width={56} height={56} className="size-14 rounded-xl object-cover" />
              <div>
                <p className="text-xs text-muted">{m.label}</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">{m.amount}</p>
                {"note" in m && m.note ? <p className="mt-1 text-xs text-muted">{m.note}</p> : null}
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      <div className="space-y-4">
        <p className="text-sm font-medium">Sections we found in your file</p>
        {(found.length ? found : read.pieces).map((p) => (
          <article key={p.id} className="overflow-hidden rounded-2xl border border-line bg-card">
            <div className="flex flex-col sm:flex-row">
              <img src={p.image} alt="" className="h-36 w-full object-cover sm:h-auto sm:w-40" />
              <div className="p-4">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{p.easy}</p>
                {p.details?.length ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                    {p.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-3 text-sm text-primary-deep">{p.howToUse}</p>
                {p.found ? (
                  <p className="mt-3 rounded-lg bg-paper-2 px-3 py-2 text-xs text-muted">From the plan: {p.found}</p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {extra.length && found.length ? (
        <div className="space-y-3">
          <p className="text-sm font-medium">Also useful — even if the heading was not clear</p>
          {extra.map((p) => (
            <article key={p.id} className="flex gap-3 rounded-2xl border border-dashed border-line bg-card p-4">
              <img src={p.image} alt="" width={64} height={64} className="size-16 shrink-0 rounded-xl object-cover" />
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed">{p.easy}</p>
                <p className="mt-2 text-sm text-primary-deep">{p.howToUse}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <Card>
        <p className="flex items-center gap-2 font-semibold">
          <Sparkles className="size-4 text-primary" />
          Learn to self-manage this funding
        </p>
        <ol className="mt-4 space-y-4">
          {read.lessons.map((l) => (
            <li key={l.n} className="flex gap-3">
              <img
                src={l.image || "/brand/story-path.jpg"}
                alt=""
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-xl object-cover"
              />
              <div className="text-sm">
                <p className="font-medium">
                  {l.n}. {l.title}
                </p>
                <p className="mt-1 text-muted">{l.body}</p>
              </div>
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
