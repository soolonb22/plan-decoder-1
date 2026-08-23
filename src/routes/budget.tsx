import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useOllie, useClientList } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { MembershipGate, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/budget")({ component: BudgetPage });

function money(n: number) {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

function BudgetPage() {
  const rows = useClientList("budgets");
  const upsert = useOllie((s) => s.upsertBudget);
  const remove = useOllie((s) => s.removeBudget);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"core" | "capacity" | "capital">("core");
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
        title="Budget helper"
        lede="A working picture of Core, Capacity Building and Capital. Not a payment system — check the my NDIS app for official balances."
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-muted">Allocated</p>
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
          <Field label="Category">
            <select
              className="h-11 w-full rounded-lg border border-line bg-card px-3"
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
            >
              <option value="core">Core</option>
              <option value="capacity">Capacity building</option>
              <option value="capital">Capital</option>
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
          return (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs uppercase tracking-wide text-muted">{r.category}</p>
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
