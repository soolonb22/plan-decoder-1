import { useMemo, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Copy, Download, HardDrive, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { DOMAINS } from "@/lib/content/language";
import { canAccess } from "@/lib/membership";
import { useOllie, useClientList } from "@/lib/store";
import { cn, formatDate, todayISO } from "@/lib/utils";
import {
  blobToDataUrl,
  dataUrlToBlob,
  deleteLocalFiles,
  downloadBlob,
  fileKindAllowed,
  getLocalFile,
  putLocalFile,
} from "@/lib/local-files";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Disclaimer, EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";
import { StoryStrip } from "@/components/story";
import { PlanExplainer, PlanUploadHero } from "@/components/plan-explainer";
import { fileToPlanText, parseNdisPlan, planSlipBody, guessEvidenceTypeFromPlan } from "@/lib/plan-reader";
import { DiaryPanel } from "@/components/pocket/diary-panel";
import { CarerPanel } from "@/components/pocket/carer-panel";
import { FlagsPanel } from "@/components/pocket/flags-panel";
import { ChartPanel } from "@/components/pocket/chart-panel";
import { GpPackButtons } from "@/components/gp-pack-buttons";
import type { EvidenceItem, EvidenceType, WhodasDomain } from "@/lib/types";

const WALLET_TABS = [
  { id: "slips", label: "Slips" },
  { id: "diary", label: "Diary" },
  { id: "carer", label: "Carer" },
  { id: "flags", label: "Flags" },
  { id: "chart", label: "Chart" },
] as const;
type WalletTab = (typeof WALLET_TABS)[number]["id"];

export const Route = createFileRoute("/wallet")({
  validateSearch: (raw: Record<string, unknown>): { tab: WalletTab } => {
    const tab = String(raw.tab ?? "");
    if (tab === "diary" || tab === "carer" || tab === "flags" || tab === "chart" || tab === "slips") {
      return { tab };
    }
    return { tab: "slips" };
  },
  component: WalletPage,
  head: () => ({
    meta: [
      { title: "Evidence pocket · Plan Decoder" },
      {
        name: "description",
        content:
          "A calm pocket for NDIS-style function notes: slips, diary, carer log, flags, and a weekly chart. Dated and local. Not an official NDIS record.",
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
  const { tab } = Route.useSearch();
  const membership = useOllie((s) => s.membership);
  const add = useOllie((s) => s.addEvidence);
  const update = useOllie((s) => s.updateEvidence);
  const remove = useOllie((s) => s.removeEvidence);
  const planRead = useOllie((s) => s.planRead);
  const setPlanRead = useOllie((s) => s.setPlanRead);
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
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [fileNote, setFileNote] = useState<string | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const loadRef = useRef<HTMLInputElement>(null);
  const slipUploadRef = useRef<HTMLInputElement>(null);
  const planRef = useRef<HTMLInputElement>(null);
  const [readingPlan, setReadingPlan] = useState(false);

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
    setPendingFiles([]);
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

  async function attachToItem(itemId: string, files: File[]) {
    const meta = [];
    for (const file of files) {
      if (!fileKindAllowed(file)) {
        setFileNote("Could not use that file.");
        continue;
      }
      try {
        meta.push(await putLocalFile(file, file.name, file.type));
      } catch (err) {
        setFileNote(err instanceof Error ? err.message : "Could not save that file on this device.");
      }
    }
    if (!meta.length) return;
    const item = useOllie.getState().evidence.find((x) => x.id === itemId);
    update(itemId, { files: [...(item?.files ?? []), ...meta] });
    setFileNote(`Saved ${meta.length} file${meta.length === 1 ? "" : "s"} on this device.`);
  }

  async function save() {
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
    const id = editing ?? add({ ...payload, files: [] });
    if (editing) update(editing, payload);
    if (pendingFiles.length) await attachToItem(id, pendingFiles);
    resetForm();
    setOpen(false);
  }

  async function savePocket() {
    try {
      const packFiles = [];
      for (const item of items) {
        for (const f of item.files ?? []) {
          const blob = await getLocalFile(f.id);
          if (!blob) continue;
          packFiles.push({
            id: f.id,
            name: f.name,
            type: f.type,
            dataUrl: await blobToDataUrl(blob),
          });
        }
      }
      const pack = {
        kind: "plan-decoder-wallet",
        version: 1,
        exportedAt: new Date().toISOString(),
        evidence: items,
        files: packFiles,
      };
      downloadBlob(
        new Blob([JSON.stringify(pack)], { type: "application/json" }),
        `plan-decoder-wallet-${todayISO()}.json`,
      );
      setFileNote("Pocket copy downloaded. Keep it somewhere you trust.");
    } catch {
      setFileNote("Could not build a copy. Try again, or download as text.");
    }
  }

  async function loadPocket(file: File) {
    try {
      const pack = JSON.parse(await file.text()) as {
        kind?: string;
        evidence?: EvidenceItem[];
        files?: { id: string; name: string; type: string; dataUrl: string }[];
      };
      if (pack.kind !== "plan-decoder-wallet" || !Array.isArray(pack.evidence)) {
        setFileNote("That file is not a Plan Decoder pocket copy.");
        return;
      }
      const remap = new Map<string, { id: string; name: string; type: string; size: number }>();
      for (const f of pack.files ?? []) {
        const blob = await dataUrlToBlob(f.dataUrl);
        const meta = await putLocalFile(blob, f.name, f.type || blob.type);
        remap.set(f.id, meta);
      }
      for (const item of pack.evidence) {
        add({
          title: item.title,
          body: item.body,
          type: item.type,
          domain: item.domain,
          tags: item.tags ?? [],
          date: item.date,
          source: item.source,
          files: (item.files ?? []).map((f) => remap.get(f.id)).filter((x): x is NonNullable<typeof x> => Boolean(x)),
        });
      }
      setFileNote("Loaded onto this device. Nothing was sent away.");
    } catch {
      setFileNote("Could not read that copy.");
    }
  }

  async function readPlanFile(file: File) {
    setReadingPlan(true);
    setFileNote(null);
    try {
      const text = await fileToPlanText(file);
      const read = parseNdisPlan(text, file.name);
      setPlanRead(read);
      const id = add({
        title: `NDIS plan — ${file.name}`,
        body: planSlipBody(read),
        type: guessEvidenceTypeFromPlan(),
        domain: "",
        tags: ["plan", "self-manage"],
        date: todayISO(),
        source: "Uploaded plan (read on this device)",
        files: [],
      });
      await attachToItem(id, [file]);
      setFileNote("Plan read on this device. Scroll to the pieces below. Not sent to the NDIA.");
    } catch {
      setFileNote("Could not read that file. Try a PDF with selectable text, or a .txt copy.");
    } finally {
      setReadingPlan(false);
    }
  }

  async function downloadFile(id: string, name: string) {
    const blob = await getLocalFile(id);
    if (!blob) {
      setFileNote("That file is not on this browser any more.");
      return;
    }
    downloadBlob(blob, name);
  }

  async function removeSlip(id: string) {
    const item = items.find((x) => x.id === id);
    await deleteLocalFiles((item?.files ?? []).map((f) => f.id));
    remove(id);
    setConfirmId(null);
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
    <div>
      <input
        ref={uploadRef}
        type="file"
        className="sr-only"
        multiple
        onChange={(e) => {
          const list = [...(e.target.files ?? [])];
          e.target.value = "";
          if (!list.length) return;
          void (async () => {
            for (const file of list) {
              const kind: EvidenceType = file.type.startsWith("image/") ? "photo-note" : "letter";
              const id = add({
                title: file.name.replace(/\.[^.]+$/, "") || "Uploaded file",
                body: "File stored on this device. Add a few lines about what it shows when you can.",
                type: kind,
                domain: "",
                tags: [],
                date: todayISO(),
                source: "",
                files: [],
              });
              await attachToItem(id, [file]);
            }
          })();
        }}
      />
      <input
        ref={loadRef}
        type="file"
        className="sr-only"
        accept="application/json,.json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void loadPocket(file);
        }}
      />
      <input
        ref={planRef}
        type="file"
        className="sr-only"
        accept=".pdf,.txt,.md,application/pdf,text/plain"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void readPlanFile(file);
        }}
      />
      <PageHeader
        title="Evidence pocket"
        lede="Slips, diary, carer notes, flags, and a weekly chart — one pocket. It stays on this device."
        picture="/brand/story-wallet.jpg"
        actions={
          tab === "slips" && canAccess(membership, "core") ? (
            <div className="flex flex-wrap gap-2">
            <GpPackButtons />
            <Button
              variant="secondary"
              onClick={() => uploadRef.current?.click()}
            >
              <Upload />
              Upload a file
            </Button>
            <Button variant="secondary" onClick={() => void savePocket()}>
              <HardDrive />
              Save local copy
            </Button>
            <Button variant="ghost" onClick={() => loadRef.current?.click()}>
              <Download />
              Load a copy
            </Button>
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
          </div>
          ) : undefined
        }
      />

      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Evidence pocket">
        {WALLET_TABS.map((t) => (
          <Link
            key={t.id}
            to="/wallet"
            search={{ tab: t.id }}
            role="tab"
            aria-selected={tab === t.id}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-3 text-sm",
              tab === t.id ? "border-primary bg-primary-soft" : "border-line bg-card",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "diary" ? <DiaryPanel /> : null}
      {tab === "carer" ? (
        <MembershipGate need="core">
          <CarerPanel />
        </MembershipGate>
      ) : null}
      {tab === "flags" ? (
        <MembershipGate need="core">
          <FlagsPanel />
        </MembershipGate>
      ) : null}
      {tab === "chart" ? (
        <MembershipGate need="core">
          <ChartPanel />
        </MembershipGate>
      ) : null}
      {tab === "slips" ? (
        <MembershipGate need="core">
      <PlanUploadHero
        busy={readingPlan}
        onPick={() => planRef.current?.click()}
        onPaste={(text) => {
          const read = parseNdisPlan(text, "pasted-plan.txt");
          setPlanRead(read);
          add({
            title: "NDIS plan (pasted text)",
            body: planSlipBody(read),
            type: guessEvidenceTypeFromPlan(),
            domain: "",
            tags: ["plan", "self-manage"],
            date: todayISO(),
            source: "Pasted on this device",
            files: [],
          });
          setFileNote("Pasted text explained on this device. Not sent to the NDIA.");
        }}
      />
      {planRead ? <PlanExplainer read={planRead} onClear={() => setPlanRead(null)} /> : null}

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
        Keep originals of clinical reports. Uploads and copies stay in this browser — they are not sent to Plan Decoder
        or the NDIA. Each file can be up to 8 MB.
      </Disclaimer>
      {fileNote ? (
        <p className="mt-3 rounded-xl bg-ok-soft px-4 py-3 text-sm text-ok" role="status">
          {fileNote}
        </p>
      ) : null}

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
          <div>
            <p className="mb-2 text-sm font-medium">Attach a file (stays on this device)</p>
            <input
              ref={slipUploadRef}
              type="file"
              className="sr-only"
              multiple
              onChange={(e) => {
                const list = [...(e.target.files ?? [])];
                e.target.value = "";
                setPendingFiles((cur) => [...cur, ...list]);
              }}
            />
            <Button type="button" variant="secondary" onClick={() => slipUploadRef.current?.click()}>
              <Upload />
              Upload from this device
            </Button>
            {pendingFiles.length ? (
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {pendingFiles.map((f) => (
                  <li key={f.name + f.size}>{f.name}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-xs text-muted">Any file type. Max 8 MB each. Stays on this device. Not sent away.</p>
            )}
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
              downloadBlob(new Blob([text], { type: "text/plain" }), `plan-decoder-wallet-${todayISO()}.txt`);
            }}
          >
            <Download />
            Download all as text
          </Button>
        ) : null}
        <Button variant="secondary" onClick={() => void savePocket()}>
          <HardDrive />
          Save local copy
        </Button>
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
                    {(item.files ?? []).length ? (
                      <ul className="mt-3 space-y-2 pl-2">
                        {(item.files ?? []).map((f) => (
                          <li key={f.id} className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="text-muted">{f.name}</span>
                            <Button size="sm" variant="secondary" onClick={() => void downloadFile(f.id, f.name)}>
                              <Download />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                void deleteLocalFiles([f.id]);
                                update(item.id, { files: (item.files ?? []).filter((x) => x.id !== f.id) });
                              }}
                            >
                              Remove file
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2 pl-2">
                      <Button size="sm" variant="secondary" onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.multiple = true;
                        input.onchange = () => {
                          const list = [...(input.files ?? [])];
                          if (list.length) void attachToItem(item.id, list);
                        };
                        input.click();
                      }}>
                        <Upload />
                        Upload
                      </Button>
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
                          <Button size="sm" variant="danger" onClick={() => void removeSlip(item.id)}>
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
      ) : null}
    </div>
  );
}
