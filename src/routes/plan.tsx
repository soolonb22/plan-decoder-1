import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FUNDING_BUDGETS } from "@/lib/content/funding";
import { PLAN_CHECKLIST } from "@/lib/content/checklist";
import { useOllie, useClientList } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Disclaimer, EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";
import { PlanStructureDiagram } from "@/components/plan-diagram";
import { FUNDING_VIDEO, IMPLEMENTATION_VIDEO, YoutubeEmbed } from "@/components/youtube-embed";
import { RoomTabs } from "@/components/room-tabs";

const TABS = [
  { id: "pots", label: "Pots" },
  { id: "spend", label: "Spend" },
  { id: "checklist", label: "Checklist" },
  { id: "goals", label: "Goals" },
] as const;
type Tab = (typeof TABS)[number]["id"];
type Cat = "core" | "capacity" | "capital" | "recurring";

function money(n: number) {
  return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}

export const Route = createFileRoute("/plan")({
  validateSearch: (raw: Record<string, unknown>): { tab: Tab } => {
    const tab = String(raw.tab ?? "");
    if (tab === "spend" || tab === "checklist" || tab === "goals" || tab === "pots") return { tab };
    return { tab: "pots" };
  },
  component: PlanPage,
  head: () => ({
    meta: [
      { title: "My plan · Plan Decoder" },
      {
        name: "description",
        content:
          "Understand NDIS plan pots, track spend notes, tick a checklist, and keep a wish list. Practice tool — not the NDIA.",
      },
    ],
  }),
});

function PlanPage() {
  const { tab } = Route.useSearch();
  return (
    <div>
      <PageHeader
        title="My plan"
        lede="The four pots, your spend notes, a checklist after approval, and a wish list. Official balances live in the my NDIS app."
        picture="/brand/story-wallet.jpg"
      />
      <RoomTabs to="/plan" tab={tab} items={[...TABS]} label="My plan" />
      {tab === "pots" ? <PotsPanel /> : null}
      {tab === "checklist" ? <ChecklistPanel /> : null}
      {tab === "spend" ? (
        <MembershipGate need="core">
          <SpendPanel />
        </MembershipGate>
      ) : null}
      {tab === "goals" ? (
        <MembershipGate need="core">
          <GoalsPanel />
        </MembershipGate>
      ) : null}
    </div>
  );
}

function PotsPanel() {
  return (
    <div>
      <Disclaimer>
        Plan Decoder is not affiliated with the NDIA. Check your plan and ndis.gov.au before you spend.
      </Disclaimer>
      <div className="mt-5">
        <PlanStructureDiagram />
      </div>
      <YoutubeEmbed id={FUNDING_VIDEO.id} title={FUNDING_VIDEO.title} credit={FUNDING_VIDEO.credit} />
      <h2 className="mt-8 text-lg font-semibold">The four support budgets</h2>
      <p className="mt-2 text-sm text-muted">
        NDIA guide, current 9 June 2026. You cannot pour one pot into another.
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
    </div>
  );
}

function SpendPanel() {
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
    <div>
      <p className="mb-3 text-sm text-muted">Your notes only — check the my NDIS app for official balances.</p>
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
            upsert({ name, category, allocated: Number(allocated) || 0, spent: Number(spent) || 0 });
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
    </div>
  );
}

function ChecklistPanel() {
  const rows = useClientList("checklist");
  const setItem = useOllie((s) => s.setChecklist);
  const doneCount = PLAN_CHECKLIST.flatMap((g) => g.items).filter((i) =>
    rows.find((r) => r.key === i.key && r.done),
  ).length;
  const total = PLAN_CHECKLIST.flatMap((g) => g.items).length;

  return (
    <div>
      <YoutubeEmbed id={IMPLEMENTATION_VIDEO.id} title={IMPLEMENTATION_VIDEO.title} credit={IMPLEMENTATION_VIDEO.credit} />
      <p className="mb-4 mt-4 text-sm text-muted tabular-nums">
        {doneCount} of {total} understood
      </p>
      <div className="space-y-4">
        {PLAN_CHECKLIST.map((group) => (
          <Card key={group.group}>
            <p className="font-semibold">{group.group}</p>
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => {
                const row = rows.find((r) => r.key === item.key);
                const checked = Boolean(row?.done);
                return (
                  <li key={item.key}>
                    <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-paper">
                      <input
                        type="checkbox"
                        className="mt-1 size-4 accent-primary"
                        checked={checked}
                        onChange={(e) => setItem(item.key, e.target.checked, row?.note)}
                      />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GoalsPanel() {
  const add = useOllie((s) => s.addGoal);
  const update = useOllie((s) => s.updateGoal);
  const remove = useOllie((s) => s.removeGoal);
  const items = useClientList("goals");
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [supports, setSupports] = useState("");

  return (
    <div>
      <p className="mb-3 text-sm text-muted">Goals that sound like a life. Pair each wish with the support that would make it possible.</p>
      <Card className="space-y-3">
        <Field label="Goal">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Leave the house three days a week" />
        </Field>
        <Field label="Why this matters">
          <Textarea value={why} onChange={(e) => setWhy(e.target.value)} />
        </Field>
        <Field label="Supports that would make it possible">
          <Textarea value={supports} onChange={(e) => setSupports(e.target.value)} />
        </Field>
        <Button
          disabled={!title.trim()}
          onClick={() => {
            add({ title, why, supports, domain: "", status: "wish" });
            setTitle("");
            setWhy("");
            setSupports("");
          }}
        >
          Add to wish list
        </Button>
      </Card>
      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState title="No goals yet" body="Start with one ordinary-life sentence." />
        ) : (
          items.map((g) => (
            <Card key={g.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold">{g.title}</p>
                <Badge tone={g.status === "active" ? "primary" : "neutral"}>{g.status}</Badge>
              </div>
              {g.why ? <p className="mt-2 text-sm text-muted">{g.why}</p> : null}
              {g.supports ? <p className="mt-2 text-sm">{g.supports}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {(["wish", "active", "paused", "done"] as const).map((st) => (
                  <Button key={st} size="sm" variant={g.status === st ? "primary" : "secondary"} onClick={() => update(g.id, { status: st })}>
                    {st}
                  </Button>
                ))}
                <Button size="sm" variant="ghost" onClick={() => remove(g.id)}>
                  Remove
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
