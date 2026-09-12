import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { SystemsWalkReport } from "@/components/systems-walk-report";
import { Disclaimer } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Textarea } from "@/components/ui/input";
import {
  HOUSING_FORM11_DEMO,
  SYSTEMS,
  SYSTEMS_WALK_DISCLAIMER,
  SYSTEMS_WALK_PLUM,
  SYSTEMS_WALK_TAGLINE,
  SYSTEMS_WALK_TITLE,
  generateNavigatorReport,
  type NavigatorFlags,
  type SystemName,
} from "@/lib/systems-walk";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/systems-walk")({
  component: SystemsWalkPage,
  head: () => ({
    meta: [
      { title: `${SYSTEMS_WALK_TITLE}` },
      {
        name: "description",
        content:
          "Plan Decoder Systems walk — practise a housing, NDIS, provider, school, health, or Centrelink conversation. Not a government system. Not an official NDIS Navigator. Not legal advice.",
      },
    ],
  }),
});

function SystemsWalkPage() {
  const [system, setSystem] = useState<SystemName>(HOUSING_FORM11_DEMO.system);
  const [situation, setSituation] = useState(HOUSING_FORM11_DEMO.situation);
  const [form11, setForm11] = useState(true);
  const [walkKey, setWalkKey] = useState(0);

  const flags: NavigatorFlags = useMemo(() => {
    if (system === "Housing" && form11) return { form11: true };
    return {};
  }, [system, form11]);

  const report = useMemo(
    () => generateNavigatorReport(system, situation, flags),
    [system, situation, flags, walkKey],
  );

  function loadHousingDemo() {
    setSystem(HOUSING_FORM11_DEMO.system);
    setSituation(HOUSING_FORM11_DEMO.situation);
    setForm11(true);
    setWalkKey((n) => n + 1);
  }

  return (
    <div>
      <header className="mb-6">
        <p className="text-sm font-semibold" style={{ color: SYSTEMS_WALK_PLUM }}>
          Independent practice tool
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: SYSTEMS_WALK_PLUM }}>
          {SYSTEMS_WALK_TITLE}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">{SYSTEMS_WALK_TAGLINE}</p>
      </header>

      <Disclaimer>{SYSTEMS_WALK_DISCLAIMER}</Disclaimer>

      <Card className="mt-5">
        <p className="text-sm font-medium">Looking for local doors and small goals?</p>
        <p className="mt-1 text-sm text-muted">
          Community navigator is a different walk. It stays a goal-picking map. This page is a rehearsal for one paper
          or conversation.
        </p>
        <Button className="mt-3" variant="secondary" asChild>
          <Link to="/navigator" search={{ tab: "walk" }}>
            Open Community navigator
          </Link>
        </Button>
      </Card>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">1. Which system?</h2>
        <p className="mt-1 text-sm text-muted">Housing first. Then NDIS, providers, school, health, Centrelink.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {SYSTEMS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                setSystem(name);
                if (name !== "Housing") setForm11(false);
              }}
              className={cn(
                "rounded-2xl border p-4 text-left",
                system === name ? "bg-primary-soft" : "border-line bg-card",
              )}
              style={system === name ? { borderColor: SYSTEMS_WALK_PLUM } : undefined}
            >
              <p className="font-semibold">{name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">2. What is in front of you?</h2>
        <p className="mt-1 text-sm text-muted">A notice, a letter, a meeting. Your words. Nothing is sent to government.</p>
        <Field label="Situation" hint="Short and plain is enough.">
          <Textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={3}
            placeholder="e.g. Form 11 issued; tenant disputes breach"
          />
        </Field>
        {system === "Housing" ? (
          <label className="mt-3 flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={form11}
              onChange={(e) => setForm11(e.target.checked)}
            />
            <span>This looks like a Queensland Form 11 (notice to remedy breach)</span>
          </label>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={() => setWalkKey((n) => n + 1)} style={{ backgroundColor: SYSTEMS_WALK_PLUM }}>
            Walk this
          </Button>
          <Button type="button" variant="secondary" onClick={loadHousingDemo}>
            Try the Housing Form 11 demo
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">3. Your rehearsal map</h2>
        <p className="mb-4 mt-1 text-sm text-muted">
          Scenario, world model, interpretations, intent, risks, and routes. Practise the conversation. Do not treat
          this as the official form.
        </p>
        <SystemsWalkReport report={report} />
      </div>
    </div>
  );
}
