import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FUNDING_BUDGETS } from "@/lib/content/funding";
import { useOllie, useClientList } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { MembershipGate, PageHeader } from "@/components/layout/page";
import { FUNDING_VIDEO, YoutubeEmbed } from "@/components/youtube-embed";

export const Route = createFileRoute("/budget")({
  component: BudgetPage,
  head: () => ({
    meta: [
      { title: "NDIS funding categories explained · Plan Decoder" },
      {
        name: "description",
        content:
          "Plain-language Core, Capacity Building, Capital and Recurring budgets. What your plan covers and how to use it. Not the NDIA.",
      },
    ],
  }),
});

type Cat = "core" | "capacity" | "capital" | "recurring";

function money(n: number) {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

function BudgetPage() {
  const rows = useClientList("budgets");
  const upsert = useOllie((s) => s.upsertBudget);
  const remove = useOllie((s) => s.removeBudget);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Cat>("core");
  const [allocated, setAllocated] = useState("0");
  const [spent, setSpent] = useState("0");

  const totals = useMemo(() => {
    const allocatedSum = rows.reduce((a, b) => a + b.allocated, 0);
    const spentSum = rows.reduce((a, b) => a + b.spent, 0);
    return { allocatedSum, spentSum, left: allocatedSum - spentSum };
  }, [rows]);

  return (
    <MembershipGate need="core">
      <PageHeader
        title="Funding categories — what your plan covers"
        lede="Four official support budgets (June 2026): Core, Capacity Building, Capital, and Recurring. This helper is your notes only — check the my NDIS app for official balances."
        picture="/brand/story-wallet.jpg"
      />
      <YoutubeEmbed id={FUNDING_VIDEO.id} title={FUNDING_VIDEO.title} credit={FUNDING_VIDEO.credit} />
      <p className="mt-3 text-sm text-muted">
        Official guide:{" "}
        <a
          className="text-primary underline-offset-4 hover:underline"
          href="https://www.ndis.gov.au/participants/using-your-funding/ndis-support-budgets/guide-ndis-support-budgets"
          target="_blank"
          rel="noreferrer"
        >
          Guide to NDIS support budgets
        </a>
        . Money does not move between the four budgets.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {FUNDING_BUDGETS.map((b) => (
          <Card key={b.id}>
            <p className="text-sm font-medium text-primary">{b.name}</p>
            <p className="mt-1 text-sm">{b.easy}</p>
            <p className="mt-2 text-sm text-muted">{b.body}</p>
          </Card>
        ))}
      </div>
      <div className="mb-5 mt-5 grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-muted">Allocated (your notes)</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{money(totals.allocatedSum)}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Recorded spent</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{money(totals.spentSum)}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Left (your notes)</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{money(totals.left)}</p>
        </Card>
      </div>
      <Card className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Line name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Daily living" />
          </Field>
          <Field label="Budget">
            <select
              className="h-11 w-full rounded-lg border border-line bg-card px-3"
              value={category}
              onChange={(e) => setCategory(e.target.value as Cat)}
            >
              {FUNDING_BUDGETS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Allocated">
            <Input type="number" value={allocated} onChange={(e) => setAllocated(e.target.value)} />
          </Field>
          <Field label="Spent (your estimate)">
            <Input type="number" value={spent} onChange={(e) => setSpent(e.target.value)} />
          </Field>
        </div>
        <Button
          onClick={() => {
            if (!name.trim()) return;
            upsert({
              name,
              category,
              allocated: Number(allocated) || 0,
              spent: Number(spent) || 0,
            });
            setName("");
          }}
        >
          Add line
        </Button>
      </Card>
      <div className="mt-5 space-y-3">
        {rows.map((r) => {
          const pct = r.allocated ? Math.min(100, Math.round((r.spent / r.allocated) * 100)) : 0;
          const label = FUNDING_BUDGETS.find((b) => b.id === r.category)?.name ?? r.category;
          return (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
                </div>
                <p className="text-sm tabular-nums">
                  {money(r.spent)} / {money(r.allocated)}
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper-2">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
              <Button className="mt-2" size="sm" variant="ghost" onClick={() => remove(r.id)}>
                Remove
              </Button>
            </Card>
          );
        })}
      </div>
    </MembershipGate>
  );
}
