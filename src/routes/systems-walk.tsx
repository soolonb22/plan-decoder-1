import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { SystemsWalkReport } from "@/components/systems-walk-report";
import { Disclaimer } from "@/components/layout/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Textarea } from "@/components/ui/input";
import {
  SYSTEMS,
  SYSTEM_CHECKBOX,
  SYSTEM_DEMOS,
  SYSTEMS_WALK_DISCLAIMER,
  SYSTEMS_WALK_PLUM,
  SYSTEMS_WALK_TAGLINE,
  SYSTEMS_WALK_TITLE,
  generateNavigatorReport,
  primaryDemo,
  type NavigatorFlags,
  type SystemDemo,
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

const PLACEHOLDERS: Record<SystemName, string> = {
  Housing: "e.g. Form 11 issued; tenant disputes breach",
  NDIS: "e.g. Written review letter about a plan decision",
  Providers: "e.g. Provider sent a service agreement to sign",
  School: "e.g. I need a written classroom adjustment",
  Health: "e.g. Hospital discharge plan in my hand",
  Centrelink: "e.g. Services Australia letter about a payment",
};

function SystemsWalkPage() {
  const start = primaryDemo("Housing");
  const [system, setSystem] = useState<SystemName>(start.system);
  const [situation, setSituation] = useState(start.situation);
  const [flags, setFlags] = useState<NavigatorFlags>({ ...start.flags });
  const [walkKey, setWalkKey] = useState(0);

  const report = useMemo(
    () => generateNavigatorReport(system, situation, flags),
    [system, situation, flags, walkKey],
  );

  const checkbox = SYSTEM_CHECKBOX[system];
  const demos = SYSTEM_DEMOS[system];
  const primaryFlagOn = flags[checkbox.flag] === true;

  function applyDemo(demo: SystemDemo) {
    setSystem(demo.system);
    setSituation(demo.situation);
    setFlags({ ...demo.flags });
    setWalkKey((n) => n + 1);
  }

  function chooseSystem(name: SystemName) {
    applyDemo(primaryDemo(name));
  }

  function setPrimaryFlag(checked: boolean) {
    setFlags(checked ? { [checkbox.flag]: true } : {});
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
              onClick={() => chooseSystem(name)}
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
            placeholder={PLACEHOLDERS[system]}
          />
        </Field>
        <label className="mt-3 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={primaryFlagOn}
            onChange={(e) => setPrimaryFlag(e.target.checked)}
          />
          <span>{checkbox.label}</span>
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={() => setWalkKey((n) => n + 1)} style={{ backgroundColor: SYSTEMS_WALK_PLUM }}>
            Walk this
          </Button>
          {demos.map((demo) => (
            <Button key={demo.id} type="button" variant="secondary" onClick={() => applyDemo(demo)}>
              {demo.label}
            </Button>
          ))}
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
