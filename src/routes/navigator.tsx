import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ALWAYS,
  FUNDING_CHANGE_STEPS,
  NAVIGATOR_DISCLAIMER,
  NEEDS,
  SITUATIONS,
  needsByIds,
  type NavigatorNeedId,
  type NavigatorSituationId,
} from "@/lib/content/navigator";
import { useOllie, useClientList } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/navigator")({
  validateSearch: (raw: Record<string, unknown>): { tab: "walk" | "places" | "change" } => {
    const tab = String(raw.tab ?? "");
    if (tab === "places" || tab === "change") return { tab };
    return { tab: "walk" };
  },
  component: NavigatorPage,
  head: () => ({
    meta: [
      { title: "Community navigator · Plan Decoder" },
      {
        name: "description",
        content:
          "A calm walk to find health, housing, community and mainstream supports in Australia — for NDIS participants, self-managers, and people not on the scheme. Not an official NDIS Navigator.",
      },
    ],
  }),
});

const TABS = [
  { id: "walk" as const, label: "Walk with me" },
  { id: "change" as const, label: "If funding changed" },
  { id: "places" as const, label: "My places" },
];

function NavigatorPage() {
  const { tab } = Route.useSearch();
  return (
    <div>
      <PageHeader
        title="Community navigator"
        lede="A personal guide to the next door — NDIS, mainstream, or community. You are not meant to do this alone."
        picture="/brand/story-path.jpg"
      />
      <Disclaimer>{NAVIGATOR_DISCLAIMER}</Disclaimer>
      <div className="mb-5 mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Navigator">
        {TABS.map((t) => (
          <Link
            key={t.id}
            to="/navigator"
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
      {tab === "walk" ? <WalkPanel /> : null}
      {tab === "change" ? <ChangePanel /> : null}
      {tab === "places" ? <PlacesPanel /> : null}
    </div>
  );
}

function WalkPanel() {
  const [situation, setSituation] = useState<NavigatorSituationId | "">("");
  const [picked, setPicked] = useState<NavigatorNeedId[]>([]);
  const shown = useMemo(() => needsByIds(picked), [picked]);

  function toggle(id: NavigatorNeedId) {
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(0, 3)));
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">1. Where are you today?</h2>
      <p className="mt-1 text-sm text-muted">One is enough. You can change it.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {SITUATIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSituation(s.id)}
            className={cn(
              "rounded-2xl border p-4 text-left",
              situation === s.id ? "border-primary bg-primary-soft" : "border-line bg-card",
            )}
          >
            <p className="font-semibold">{s.title}</p>
            <p className="mt-1 text-sm text-muted">{s.lede}</p>
          </button>
        ))}
      </div>

      {situation ? (
        <>
          <h2 className="mt-8 text-lg font-semibold">2. What would help right now?</h2>
          <p className="mt-1 text-sm text-muted">Pick up to three. Skip anything that feels too much.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {NEEDS.map((n) => {
              const on = picked.includes(n.id);
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggle(n.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left",
                    on ? "border-primary bg-primary-soft" : "border-line bg-card",
                  )}
                >
                  <p className="font-semibold">{n.title}</p>
                  <p className="mt-1 text-sm text-muted">{n.lede}</p>
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      {shown.length ? (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">3. Next doors</h2>
          {situation === "funding-change" || situation === "not-eligible" ? (
            <Card>
              <p className="text-sm text-muted">
                {situation === "not-eligible"
                  ? "You still have health, housing, carers, and community systems. NDIS is one door, not the only one."
                  : "A smaller plan does not mean you have to figure out every replacement today. Start with one door."}
              </p>
            </Card>
          ) : null}
          {shown.map((n) => (
            <Card key={n.id}>
              <p className="font-semibold">{n.title}</p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
                {n.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="mt-3 text-sm font-medium">Words you can use</p>
              <p className="mt-1 rounded-xl bg-paper-2 px-3 py-2 text-sm">{n.say}</p>
              <ul className="mt-3 space-y-2">
                {n.doors.map((d) => (
                  <li key={d.href}>
                    <a
                      className="font-medium text-primary underline-offset-2 hover:underline"
                      href={d.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {d.name}
                    </a>
                    <span className="text-sm text-muted"> — {d.why}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : null}

      <Card className="mt-6">
        <p className="text-sm font-medium">Always here</p>
        <ul className="mt-2 space-y-1 text-sm">
          {ALWAYS.map((a) => (
            <li key={a.name}>
              <a className="text-primary underline-offset-2 hover:underline" href={a.href}>
                {a.name}
              </a>
              <span className="text-muted"> · {a.detail}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function ChangePanel() {
  return (
    <div>
      <Card>
        <p className="font-semibold">If your NDIS funding changed</p>
        <p className="mt-2 text-sm text-muted">
          Official Navigators are still being designed. Until then, these steps keep you safer than guessing from social media.
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
          {FUNDING_CHANGE_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </Card>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/navigator" search={{ tab: "walk" }}>
            Walk me to other supports
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/rights">Know your rights (preview)</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/art">Reviews and ART</Link>
        </Button>
      </div>
    </div>
  );
}

function PlacesPanel() {
  const places = useClientList("navigatorPlaces");
  const upsert = useOllie((s) => s.upsertNavigatorPlace);
  const remove = useOllie((s) => s.removeNavigatorPlace);
  const [name, setName] = useState("");
  const [kind, setKind] = useState("");
  const [suburb, setSuburb] = useState("");
  const [need, setNeed] = useState("");
  const [notes, setNotes] = useState("");
  const [welcome, setWelcome] = useState(0);
  const [access, setAccess] = useState(0);
  const [sensory, setSensory] = useState(0);
  const [honesty, setHonesty] = useState(0);
  const [goBack, setGoBack] = useState(0);

  function save() {
    if (!name.trim()) return;
    upsert({
      name: name.trim(),
      kind: kind.trim(),
      suburb: suburb.trim(),
      need,
      welcome,
      access,
      sensory,
      honesty,
      goBack,
      notes: notes.trim(),
      sourceUrl: "",
    });
    setName("");
    setKind("");
    setSuburb("");
    setNeed("");
    setNotes("");
    setWelcome(0);
    setAccess(0);
    setSensory(0);
    setHonesty(0);
    setGoBack(0);
  }

  return (
    <div>
      <Card>
        <p className="font-semibold">How a place felt — for you</p>
        <p className="mt-2 text-sm text-muted">
          Private notes on this device. Not a public review, not a complaint, not sent to the business or the NDIA. Skip any
          scale you do not want.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Name of the place">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Library, clinic, rec club…" />
          </Field>
          <Field label="Kind">
            <Input value={kind} onChange={(e) => setKind(e.target.value)} placeholder="GP, group, provider…" />
          </Field>
          <Field label="Suburb or area">
            <Input value={suburb} onChange={(e) => setSuburb(e.target.value)} />
          </Field>
          <Field label="Related to">
            <select
              className="h-11 w-full rounded-xl border border-line bg-card px-3 text-sm"
              value={need}
              onChange={(e) => setNeed(e.target.value)}
            >
              <option value="">Choose if you want</option>
              {NEEDS.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.title}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Scale label="I felt welcome" value={welcome} onChange={setWelcome} />
          <Scale label="I could get in and around" value={access} onChange={setAccess} />
          <Scale label="Sensory load was ok for me" value={sensory} onChange={setSensory} />
          <Scale label="They were clear and honest" value={honesty} onChange={setHonesty} />
          <Scale label="I would go back" value={goBack} onChange={setGoBack} />
        </div>
        <div className="mt-3">
          <Field label="A few lines (optional)">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </Field>
        </div>
        <Button className="mt-4" onClick={save}>
          Save on this device
        </Button>
      </Card>

      <ul className="mt-4 space-y-3">
        {places.length === 0 ? (
          <p className="text-sm text-muted">No places yet. You can add one after a visit, or skip this.</p>
        ) : (
          places.map((p) => (
            <li key={p.id}>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted">
                      {[p.kind, p.suburb].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>
                    Delete
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted">
                  Welcome {p.welcome || "—"} · Access {p.access || "—"} · Sensory {p.sensory || "—"} · Honest {p.honesty || "—"} ·
                  Return {p.goBack || "—"}
                </p>
                {p.notes ? <p className="mt-2 text-sm">{p.notes}</p> : null}
              </Card>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function Scale({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-1">
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "min-h-10 min-w-10 rounded-lg border text-sm",
              value === n ? "border-primary bg-primary text-primary-fg" : "border-line bg-card",
            )}
          >
            {n === 0 ? "Skip" : n}
          </button>
        ))}
      </div>
    </div>
  );
}
