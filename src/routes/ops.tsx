import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useClientList } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MembershipGate, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/ops")({ component: OpsPage });

const DAILY = [
  "Inbox triage — what arrived, what can wait, what is a review clock",
  "Evidence suggestion — one gap in the wallet (frequency, hard week, or carer cost)",
  "Report drafts — only if the person asked for one",
  "Ops improvement — one process that confused someone today",
  "Marketing touch — skip unless you are an organisation doing outreach",
];

const WEEKLY = [
  "System review — which modules did people actually use",
  "Architecture — is evidence still device-local",
  "Funnel — rights content still accurate this month",
  "SOP — write down one repeatable meeting brief",
];

const SKILLS = [
  { id: "evidence_ops_skill", name: "Evidence ops", body: "Find missing frequency, typical vs hard week, and informal-support cost." },
  { id: "report_engine_skill", name: "Report engine", body: "Drafts only. Strengths-based. No clinical claims." },
  { id: "compliance_guard_skill", name: "Compliance guard", body: "No guarantees. No diagnosis. Consent before sharing." },
  { id: "determine_functionality_of_person", name: "Function snapshot", body: "WHODAS-inspired averages, not IRT, not an NDIA tool." },
  { id: "determine_disability_is_permanent", name: "Permanency language", body: "Do not assert permanency. Record what the person or clinician already said." },
  { id: "NDIS_funding_level_adjudicator", name: "Funding adjudicator", body: "Plan Decoder does not adjudicate. It organises evidence for a human decision-maker." },
  { id: "Determine_reasonable_necessary_support_individually", name: "Reasonable and necessary", body: "Map each ask to s34 questions. Never fill the answer for the NDIA." },
  { id: "Plan_builder", name: "Plan builder", body: "Wish list + supports + budgets. Not a plan." },
  { id: "Participant_compliance_watchdog", name: "Watchdog", body: "Watch review dates and missing evidence — never ‘compliance’ of the person." },
  { id: "Progress_tracker", name: "Progress", body: "Goals and fluctuation over time." },
];

function OpsPage() {
  const evidence = useClientList("evidence");
  const logs = useClientList("logs");
  const flags = useClientList("flags");
  const [done, setDone] = useState<Record<string, boolean>>({});

  const suggestion = useMemo(() => {
    if (evidence.length < 3) return "Add three dated observations, including one hard day.";
    if (!logs.some((l) => l.kind === "carer")) return "Add one carer impact note this week.";
    if (!flags.some((f) => f.kind === "green")) return "Record one green flag — a condition that already helps.";
    if (!flags.some((f) => f.kind === "red")) return "Record one red flag — a condition that reliably harms.";
    return "Bundle a meeting brief from what you already have. Do not wait for a perfect file.";
  }, [evidence.length, logs, flags]);

  return (
    <MembershipGate need="pro">
      <PageHeader
        title="Operations"
        lede="A quiet playbook for coordinators and organisations. Nothing here runs in the background. You choose each step."
      />
      <Card className="mb-4">
        <p className="text-sm font-medium text-primary">Today’s evidence suggestion</p>
        <p className="mt-2">{suggestion}</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="font-semibold">Daily cycle</p>
          <ul className="mt-3 space-y-2">
            {DAILY.map((item) => (
              <li key={item}>
                <label className="flex gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 accent-primary"
                    checked={Boolean(done[item])}
                    onChange={(e) => setDone((d) => ({ ...d, [item]: e.target.checked }))}
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="font-semibold">Weekly cycle</p>
          <ul className="mt-3 space-y-2">
            {WEEKLY.map((item) => (
              <li key={item}>
                <label className="flex gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 accent-primary"
                    checked={Boolean(done[item])}
                    onChange={(e) => setDone((d) => ({ ...d, [item]: e.target.checked }))}
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <h2 className="mt-8 text-lg font-semibold">Skills (guards, not autopilot)</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {SKILLS.map((s) => (
          <Card key={s.id} className="py-4">
            <p className="font-medium">{s.name}</p>
            <p className="mt-1 text-sm text-muted">{s.body}</p>
          </Card>
        ))}
      </div>
      <Button className="mt-5" variant="secondary" onClick={() => setDone({})}>
        Clear ticks
      </Button>
    </MembershipGate>
  );
}
