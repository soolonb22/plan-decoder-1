import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { DOMAINS } from "@/lib/content/language";
import { useOllie, useClientList } from "@/lib/store";
import { cn, formatDate, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Disclaimer, EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";
import { StoryStrip } from "@/components/story";
import type { EvidenceItem, EvidenceType, WhodasDomain } from "@/lib/types";

export const Route = createFileRoute("/wallet")({
  component: WalletPage,
  head: () => ({
    meta: [
      { title: "Evidence Wallet · Plan Decoder" },
      {
        name: "description",
        content:
          "A calm pocket for NDIS-style function notes. Dated, local, and in your words. Not an official NDIS record.",
      },
    ],
  }),
});

const KIND: { id: EvidenceType; label: string; hint: string }[] = [
  { id: "observation", label: "Everyday", hint: "What a usual or hard day looks like" },
  { id: "carer", label: "Carer / family", hint: "Unpaid hours and what you hold" },
  { id: "clinical", label: "Health", hint: "GP, OT, psych, hospital" },
  { id: "school", label: "School", hint: "Teacher, aide, learning" },
  { id: "letter", label: "Letter", hint: "Something already written" },
  { id: "plan", label: "Plan paper", hint: "NDIS plan, quotes, invoices" },
  { id: "photo-note", label: "Photo note", hint: "A picture you describe in words" },
  { id: "other", label: "Other", hint: "Anything that still matters" },
];

const STARTERS = [
  "On a typical hard day…",
  "This happens most days / weeks…",
  "Without this support…",
  "What already works is…",
];

function kindLabel(id: string) {
  return KIND.find((k) => k.id === id)?.label ?? id;
}

function domainTitle(id: string) {
  return DOMAINS.find((d) => d.id === id)?.title ?? "Unfiled";
}

function asLetter(item: EvidenceItem) {
  return [
    item.title,
    `${formatDate(item.date)}${item.source ? ` · ${item.source}` : ""} · ${kindLabel(item.type)}`,
    item.domain ? `Life area: ${domainTitle(item.domain)}` : "",
    "",
    item.body,
    "",
    "Written as a practice note in Plan Decoder. Not an official NDIS record.",
  ]
    .filter((l) => l !== undefined)
    .join("\n");
}

function WalletPage() {
  const add = useOllie((s) => s.addEvidence);
  const update = useOllie((s) => s.updateEvidence);
  const remove = useOllie((s) => s.removeEvidence);
  const items = useClientList("evidence");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [happened, setHappened] = useState("");
  const [often, setOften] = useState("");
  const [without, setWithout] = useState("");
  const [type, setType] = useState<EvidenceType>("observation");
  const [domain, setDomain] = useState<WhodasDomain | "">("");
  const [date, setDate] = useState(todayISO());
  const [source, setSource] = useState("");
  const [filter, setFilter] = useState<"all" | EvidenceType>("all");
  const [q, setQ] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function resetForm() {
    setEditing(null);
    setTitle("");
    setHappened("");
    setOften("");
    setWithout("");
    setType("observation");
    setDomain("");
    setDate(todayISO());
    setSource("");
  }

  function composeBody() {
    const parts = [
      happened.trim() && happened.trim(),
      often.trim() && `How often: ${often.trim()}`,
      without.trim() && `Without support: ${without.trim()}`,
    ].filter(Boolean);
    return parts.join("\n\n");
  }

  function startEdit(item: EvidenceItem) {
    setEditing(item.id);
    setOpen(true);
    setTitle(item.title);
    setHappened(item.body);
    setOften("");
    setWithout("");
    setType(item.type);
    setDomain(item.domain);
    setDate(item.date);
    setSource(item.source);
  }

  function save() {
    const body = composeBody();
    if (!title.trim() || !body) return;
    const payload = {
      title: title.trim(),
      body,
      type,
      domain,
      tags: domain ? [domain] : [],
      date,
      source: source.trim(),
    };
    if (editing) update(editing, payload);
    else add(payload);
    resetForm();
    setOpen(false);
  }

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((item) => {
      if (filter !== "all" && item.type !== filter) return false;
      if (!needle) return true;
      return `${item.title} ${item.body} ${item.source}`.toLowerCase().includes(needle);
    });
  }, [items, filter, q]);

  const groups = useMemo(() => {
    const map = new Map<string, EvidenceItem[]>();
    for (const item of filtered) {
      const key = item.date.slice(0, 7) || "undated";
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return [...map.entries()];
  }, [filtered]);

  const thisMonth = items.filter((i) => i.date.startsWith(todayISO().slice(0, 7))).length;
  const areas = new Set(items.map((i) => i.domain).filter(Boolean)).size;

  return (
    <MembershipGate need="core">
      <PageHeader
        title="Evidence Wallet"
        lede="A pocket for short, dated notes about everyday function. One slip per situation. It stays on this device."
        picture="/brand/story-wallet.jpg"
        actions={
          <Button
            onClick={() => {
              if (open) {
                resetForm();
                setOpen(false);
              } else setOpen(true);
            }}
          >
            <Plus />
            {open ? "Close slip" : "Add a slip"}
          </Button>
        }
      />

      <StoryStrip
        heading="How the wallet works"
        steps={[
          {
            src: "/brand/story-sit.jpg",
            title: "One moment",
            body: "Write what happened, how often, and what changes without support.",
          },
          {
            src: "/brand/story-tick.jpg",
            title: "Keep it small",
            body: "A few lines beat a long story. Date it. Say who saw it.",
          },
          {
            src: "/brand/story-together.jpg",
            title: "Take it with you",
            body: "Copy a slip for a GP or planner. Keep the original reports too.",
          },
        ]}
      />

      <Disclaimer>
        Keep originals of clinical reports. This wallet is your working file on this device — not an official NDIS
        record, and not sent to the NDIA.
      </Disclaimer>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-muted">Slips in the pocket</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{items.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">This month</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{thisMonth}</p>
        </Card>
        <Card>
          <p className="text-xs text-muted">Life areas touched</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{areas}</p>
        </Card>
      </div>

      {open ? (
        <Card className="mt-5 space-y-4 border-primary/30 bg-primary-soft/40">
          <p className="text-sm font-medium text-primary">{editing ? "Edit this slip" : "New slip"}</p>
          <Field label="A short name for this note">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Morning routine needs two people"
            />
          </Field>
          <div>
            <p className="mb-2 text-sm font-medium">What kind of slip?</p>
            <div className="flex flex-wrap gap-2">
              {KIND.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  className={cn(
                    "min-h-11 rounded-full border px-3 text-sm",
                    type === k.id ? "border-primary bg-card text-primary" : "border-line bg-card text-muted",
                  )}
                  onClick={() => setType(k.id)}
                >
                  {k.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">{KIND.find((k) => k.id === type)?.hint}</p>
          </div>
          <Field label="What happened (in plain words)">
            <Textarea
              value={happened}
              onChange={(e) => setHappened(e.target.value)}
              placeholder="Who was there, what was hard, what already worked."
              rows={4}
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                className="min-h-9 rounded-full border border-line bg-card px-3 text-xs text-muted"
                onClick={() => setHappened((v) => (v ? `${v.trim()} ${s} ` : `${s} `))}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="How often / how long">
              <Input value={often} onChange={(e) => setOften(e.target.value)} placeholder="Most mornings · 45 minutes" />
            </Field>
            <Field label="Without this support">
              <Input
                value={without}
                onChange={(e) => setWithout(e.target.value)}
                placeholder="Does not leave the house / missed medication"
              />
            </Field>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Life area (if you know)</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className={cn(
                  "min-h-11 rounded-full border px-3 text-sm",
                  domain === "" ? "border-primary bg-card text-primary" : "border-line bg-card text-muted",
                )}
                onClick={() => setDomain("")}
              >
                Not sure yet
              </button>
              {DOMAINS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={cn(
                    "min-h-11 rounded-full border px-3 text-sm",
                    domain === d.id ? "border-primary bg-card text-primary" : "border-line bg-card text-muted",
                  )}
                  onClick={() => setDomain(d.id)}
                >
                  {d.title}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="Who saw this">
              <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Carer / OT / school / me" />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={save}>{editing ? "Save changes" : "Save on this device"}</Button>
            <Button
              variant="ghost"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            className="pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a word in your slips"
            aria-label="Search evidence"
          />
        </label>
        {items.length ? (
          <Button
            variant="secondary"
            onClick={() => {
              const text = items.map(asLetter).join("\n\n———\n\n");
              const blob = new Blob([text], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `plan-decoder-wallet-${todayISO()}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download all as text
          </Button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Filter by kind">
        <button
          type="button"
          role="tab"
          aria-selected={filter === "all"}
          className={cn(
            "min-h-11 rounded-full border px-3 text-sm",
            filter === "all" ? "border-primary bg-primary-soft" : "border-line bg-card",
          )}
          onClick={() => setFilter("all")}
        >
          All ({items.length})
        </button>
        {KIND.map((k) => {
          const n = items.filter((i) => i.type === k.id).length;
          if (!n && filter !== k.id) return null;
          return (
            <button
              key={k.id}
              type="button"
              role="tab"
              aria-selected={filter === k.id}
              className={cn(
                "min-h-11 rounded-full border px-3 text-sm",
                filter === k.id ? "border-primary bg-primary-soft" : "border-line bg-card",
              )}
              onClick={() => setFilter(k.id)}
            >
              {k.label} ({n})
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-6">
        {filtered.length === 0 ? (
          <EmptyState
            title={items.length ? "Nothing matched" : "The pocket is empty"}
            body={
              items.length
                ? "Try All, or another word."
                : "Add one observation from this week. Frequency and what happens without support matter more than long stories."
            }
            action={
              !items.length ? (
                <Button onClick={() => setOpen(true)}>
                  <Plus />
                  Add a first slip
                </Button>
              ) : undefined
            }
          />
        ) : (
          groups.map(([month, rows]) => (
            <section key={month} aria-label={month}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-subtle">
                {month === "undated"
                  ? "No date"
                  : new Date(`${month}-01T00:00:00`).toLocaleDateString("en-AU", {
                      month: "long",
                      year: "numeric",
                    })}
              </p>
              <div className="space-y-3">
                {rows.map((item) => (
                  <Card key={item.id} className="relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden />
                    <div className="flex flex-wrap items-start justify-between gap-2 pl-2">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="mt-1 text-xs text-muted">
                          {formatDate(item.date)} · {kindLabel(item.type)}
                          {item.source ? ` · ${item.source}` : ""}
                        </p>
                      </div>
                      <Badge tone="primary">{item.domain ? domainTitle(item.domain) : "Unfiled"}</Badge>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap pl-2 text-sm leading-relaxed">{item.body}</p>
                    <div className="mt-3 flex flex-wrap gap-2 pl-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(asLetter(item));
                            setCopied(item.id);
                            window.setTimeout(() => setCopied(null), 2000);
                          } catch {
                            setCopied(null);
                          }
                        }}
                      >
                        <Copy />
                        {copied === item.id ? "Copied" : "Copy for a GP"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => startEdit(item)}>
                        <Pencil />
                        Edit
                      </Button>
                      {confirmId === item.id ? (
                        <>
                          <Button size="sm" variant="danger" onClick={() => remove(item.id)}>
                            Yes, remove
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                            Keep
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => setConfirmId(item.id)}>
                          <Trash2 />
                          Remove
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </MembershipGate>
  );
}
