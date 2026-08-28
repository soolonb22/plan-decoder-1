import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ALWAYS,
  FUNDING_CHANGE_STEPS,
  NAVIGATOR_DISCLAIMER,
  NEEDS,
  SMALL_GOALS,
  SITUATIONS,
  doorsForGoal,
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
  validateSearch: (raw: Record<string, unknown>): { tab: "walk" | "places" | "change" | "goals" } => {
    const tab = String(raw.tab ?? "");
    if (tab === "places" || tab === "change" || tab === "goals") return { tab };
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
  { id: "goals" as const, label: "My small goals" },
  { id: "change" as const, label: "If funding changed" },
  { id: "places" as const, label: "My places" },
];

function NavigatorPage() {
  const { tab } = Route.useSearch();
  return (
    <div>
      <PageHeader
        title="Community navigator"
        lede="Pick a few small goals. We will suggest supports near you. Not an official NDIS Navigator."
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
      {tab === "goals" ? <GoalsPanel /> : null}
      {tab === "change" ? <ChangePanel /> : null}
      {tab === "places" ? <PlacesPanel /> : null}
    </div>
  );
}

function WalkPanel() {
  const saveGoal = useOllie((s) => s.upsertNavigatorGoal);
  const [situation, setSituation] = useState<NavigatorSituationId | "">("");
  const [goalIds, setGoalIds] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [area, setArea] = useState("");
  const [savedNote, setSavedNote] = useState("");

  function toggleGoal(id: string) {
    setGoalIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(0, 3)));
  }

  const chosen = useMemo(() => {
    const fromList = SMALL_GOALS.filter((g) => goalIds.includes(g.id));
    const extra =
      custom.trim() && fromList.length < 3
        ? [{ id: "custom", title: custom.trim(), lede: "Your words.", need: "community" as NavigatorNeedId, query: custom.trim() }]
        : [];
    return [...fromList, ...extra].slice(0, 3);
  }, [goalIds, custom]);

  function saveChosen() {
    if (!chosen.length) return;
    for (const g of chosen) {
      saveGoal({
        title: g.title,
        need: g.need,
        area: area.trim(),
        query: g.query,
        done: false,
      });
    }
    setSavedNote("Saved on this device. Open My small goals any time.");
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">1. Where are you today?</h2>
      <p className="mt-1 text-sm text-muted">One is enough.</p>
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
          <h2 className="mt-8 text-lg font-semibold">2. A few small goals</h2>
          <p className="mt-1 text-sm text-muted">Pick up to three. Small enough to try this month — not a whole life plan.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {SMALL_GOALS.map((g) => {
              const on = goalIds.includes(g.id);
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => toggleGoal(g.id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left",
                    on ? "border-primary bg-primary-soft" : "border-line bg-card",
                  )}
                >
                  <p className="font-semibold">{g.title}</p>
                  <p className="mt-1 text-sm text-muted">{g.lede}</p>
                </button>
              );
            })}
          </div>
          <Field label="Or write one in your own words" hint="Optional. Counts toward the three.">
            <Input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="e.g. Find a quiet art group on a Tuesday"
            />
          </Field>
        </>
      ) : null}

      {chosen.length ? (
        <>
          <h2 className="mt-8 text-lg font-semibold">3. Your area</h2>
          <p className="mt-1 text-sm text-muted">Suburb, town, or postcode. We only use it to build search links. It stays on this device.</p>
          <Field label="Suburb or postcode">
            <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Mackay 4740" />
          </Field>
        </>
      ) : null}

      {chosen.length ? (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">4. Suggested supports {area.trim() ? `near ${area.trim()}` : ""}</h2>
          <p className="text-sm text-muted">
            These are starting points from public directories. Plan Decoder does not recommend a business, does not check
            quality, and is not the NDIA.
          </p>
          {chosen.map((g) => {
            const doors = doorsForGoal(area, g.query, g.need);
            const need = NEEDS.find((n) => n.id === g.need);
            return (
              <Card key={g.id}>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Goal</p>
                <p className="font-semibold">{g.title}</p>
                {need ? <p className="mt-1 text-sm text-muted">{need.lede}</p> : null}
                {need ? (
                  <>
                    <p className="mt-3 text-sm font-medium">Words you can use</p>
                    <p className="mt-1 rounded-xl bg-paper-2 px-3 py-2 text-sm">{need.say}</p>
                  </>
                ) : null}
                <ul className="mt-3 space-y-2">
                  {doors.map((d) => (
                    <li key={d.name + d.href}>
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
            );
          })}
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveChosen}>Save these goals on this device</Button>
            <Button variant="secondary" asChild>
              <Link to="/navigator" search={{ tab: "goals" }}>
                Open my small goals
              </Link>
            </Button>
          </div>
          {savedNote ? <p className="text-sm text-muted">{savedNote}</p> : null}
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

function GoalsPanel() {
  const items = useClientList("navigatorGoals");
  const upsert = useOllie((s) => s.upsertNavigatorGoal);
  const remove = useOllie((s) => s.removeNavigatorGoal);
  if (!items.length) {
    return (
      <Card>
        <p className="font-semibold">No small goals yet</p>
        <p className="mt-2 text-sm text-muted">Walk with me first. Pick up to three. We will suggest supports near you.</p>
        <Button className="mt-4" asChild>
          <Link to="/navigator" search={{ tab: "walk" }}>
            Start the walk
          </Link>
        </Button>
      </Card>
    );
  }
  return (
    <ul className="space-y-3">
      {items.map((g) => {
        const doors = doorsForGoal(g.area, g.query || g.title, (g.need as NavigatorNeedId) || "community");
        return (
          <li key={g.id}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className={cn("font-semibold", g.done && "text-muted line-through")}>{g.title}</p>
                  <p className="text-sm text-muted">{g.area || "No area saved"}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => upsert({ ...g, done: !g.done })}>
                    {g.done ? "Still going" : "I tried this"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(g.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {doors.slice(0, 4).map((d) => (
                  <li key={d.name}>
                    <a className="text-primary underline-offset-2 hover:underline" href={d.href} target="_blank" rel="noreferrer">
                      {d.name}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        );
      })}
    </ul>
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
