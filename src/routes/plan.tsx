import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FUNDING_BUDGETS } from "@/lib/content/funding";
import { PLAN_CHECKLIST } from "@/lib/content/checklist";
import { CLAIM_STATUSES, POTS, claimDue } from "@/lib/claims";
import { useOllie, useActiveClient, useClientList } from "@/lib/store";
import { daysUntil, formatDate, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Disclaimer, EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";
import { PlanStructureDiagram } from "@/components/plan-diagram";
import { FUNDING_VIDEO, IMPLEMENTATION_VIDEO, YoutubeEmbed } from "@/components/youtube-embed";
import { RoomTabs } from "@/components/room-tabs";
import { PeoplePanel } from "@/components/plan/people-panel";
import { FitPanel } from "@/components/plan/fit-panel";

const TABS = [
  { id: "pots", label: "Pots" },
  { id: "spend", label: "Spend" },
  { id: "claims", label: "Claims" },
  { id: "people", label: "People" },
  { id: "fit", label: "Fit" },
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
    if (
      tab === "spend" ||
      tab === "claims" ||
      tab === "people" ||
      tab === "fit" ||
      tab === "checklist" ||
      tab === "goals" ||
      tab === "pots"
    )
      return { tab };
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
        lede="The four pots, spend notes, a claiming book, a checklist, and a wish list. Official balances live in the my NDIS app."
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
      {tab === "claims" ? (
        <MembershipGate need="core">
          <ClaimsPanel />
        </MembershipGate>
      ) : null}
      {tab === "people" ? (
        <MembershipGate need="core">
          <PeoplePanel />
        </MembershipGate>
      ) : null}
      {tab === "fit" ? (
        <MembershipGate need="core">
          <FitPanel />
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
  const client = useActiveClient();
  const upsert = useOllie((s) => s.upsertClient);
  const letterDays = daysUntil(client?.letterReceived);
  const endDays = daysUntil(client?.planEnd);
  return (
    <div>
      <Disclaimer>
        Plan Decoder is not affiliated with the NDIA. Check your plan and ndis.gov.au before you spend.
      </Disclaimer>
      <Card className="mt-4 space-y-3">
        <p className="text-sm font-medium">Dates on this device</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Plan end">
            <Input
              type="date"
              value={client?.planEnd || ""}
              onChange={(e) => client && upsert({ id: client.id, planEnd: e.target.value })}
            />
          </Field>
          <Field label="Decision letter received">
            <Input
              type="date"
              value={client?.letterReceived || ""}
              onChange={(e) => client && upsert({ id: client.id, letterReceived: e.target.value })}
            />
          </Field>
        </div>
        {client?.planEnd ? (
          <p className="text-sm">
            Plan end {formatDate(client.planEnd)}
            {endDays != null ? ` · ${endDays >= 0 ? `${endDays} days away` : `${Math.abs(endDays)} days ago`}` : ""}
          </p>
        ) : null}
        {client?.letterReceived ? (
          <p className="text-sm">
            Letter received {formatDate(client.letterReceived)}
            {letterDays != null ? ` (${Math.abs(letterDays)} days ${letterDays > 0 ? "from now" : "ago"})` : ""}.
            Review clocks often start from when you received the letter — check your letter, not this note.
          </p>
        ) : (
          <p className="text-sm text-muted">Add the letter date if you want a reminder. This is not legal advice.</p>
        )}
      </Card>
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

function ClaimsPanel() {
  const add = useOllie((s) => s.upsertClaim);
  const remove = useOllie((s) => s.removeClaim);
  const items = useClientList("claims");
  const [date, setDate] = useState(todayISO());
  const [provider, setProvider] = useState("");
  const [description, setDescription] = useState("");
  const [pot, setPot] = useState<"core" | "capacity" | "capital" | "recurring">("core");
  const [stated, setStated] = useState(false);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"quote" | "invoice" | "claimed" | "paid">("invoice");
  const [notes, setNotes] = useState("");

  const open = items.filter((i) => i.status === "invoice" || i.status === "claimed");

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Quote, invoice, pot, date. A 90-day practice clock starts from the support date. Government claiming windows can
        change — check the current NDIA page. This is not a claim to the NDIS.
      </p>
      {open.length ? (
        <Card className="mb-4 border-warn">
          <p className="text-sm font-medium">Still to claim</p>
          <ul className="mt-2 space-y-1 text-sm">
            {open.map((i) => {
              const due = claimDue(i);
              return (
                <li key={i.id}>
                  {i.provider} · {money(i.amount)}
                  {due?.left != null
                    ? due.left >= 0
                      ? ` · ${due.left} days on the practice clock`
                      : ` · ${Math.abs(due.left)} days past the 90-day practice mark`
                    : ""}
                </li>
              );
            })}
          </ul>
        </Card>
      ) : null}
      <Card className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Support date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Provider">
            <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Who you paid" />
          </Field>
          <Field label="What it was">
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="4 hours community" />
          </Field>
          <Field label="Pot">
            <select
              className="h-11 w-full rounded-lg border border-line bg-card px-3"
              value={pot}
              onChange={(e) => setPot(e.target.value as typeof pot)}
            >
              {POTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Amount">
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field label="Status">
            <select
              className="h-11 w-full rounded-lg border border-line bg-card px-3"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
            >
              {CLAIM_STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primary" checked={stated} onChange={(e) => setStated(e.target.checked)} />
          This line is stated (named support only)
        </label>
        <Field label="Note">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button
          disabled={!provider.trim() || !description.trim()}
          onClick={() => {
            add({
              date,
              provider,
              description,
              pot,
              stated,
              amount: Number(amount) || 0,
              claimedOn: status === "claimed" || status === "paid" ? todayISO() : "",
              status,
              notes,
            });
            setProvider("");
            setDescription("");
            setAmount("");
            setNotes("");
          }}
        >
          Save in claiming book
        </Button>
      </Card>
      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState title="No invoices yet" body="Start with one quote or one invoice. Name the pot before you book." />
        ) : (
          items.map((i) => {
            const due = claimDue(i);
            return (
              <Card key={i.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{i.provider}</p>
                    <p className="text-sm">{i.description}</p>
                    <p className="mt-1 text-xs text-muted">
                      {formatDate(i.date)} · {POTS.find((p) => p.id === i.pot)?.label} · {i.status}
                      {i.stated ? " · stated" : " · flexible"}
                    </p>
                    {due?.left != null ? (
                      <p className={`mt-1 text-xs ${due.left < 14 ? "text-alert" : "text-muted"}`}>
                        Practice 90-day clock: {due.left >= 0 ? `${due.left} days left` : `${Math.abs(due.left)} days over`} (from
                        support date, not official).
                      </p>
                    ) : null}
                  </div>
                  <p className="text-sm font-medium tabular-nums">{money(i.amount)}</p>
                </div>
                {i.notes ? <p className="mt-2 text-sm text-muted">{i.notes}</p> : null}
                <Button className="mt-2" size="sm" variant="ghost" onClick={() => remove(i.id)}>
                  Remove
                </Button>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
