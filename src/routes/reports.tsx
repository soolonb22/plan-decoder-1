import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { canAccess } from "@/lib/membership";
import { useOllie, useActiveClient, useClientList } from "@/lib/store";
import { downloadText, formatDate, todayISO } from "@/lib/utils";
import { buildGpPackText } from "@/lib/gp-pack";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, PageHeader } from "@/components/layout/page";
import { DraftWithOllie } from "@/components/draft-with-ollie";
import { GpPackButtons } from "@/components/gp-pack-buttons";

export const Route = createFileRoute("/reports")({ component: ReportsPage });

const KINDS = [
  { id: "sc-summary", label: "Support coordinator summary" },
  { id: "school-report", label: "School collaboration note" },
  { id: "allied-letter", label: "Allied health support letter brief" },
  { id: "evidence-bundle", label: "Evidence bundle cover sheet" },
  { id: "review-request", label: "Review request" },
];

function ReportsPage() {
  const client = useActiveClient();
  const evidence = useClientList("evidence");
  const logs = useClientList("logs");
  const flags = useClientList("flags");
  const goals = useClientList("goals");
  const schoolNotes = useClientList("schoolNotes");
  const fluctuations = useClientList("fluctuations");
  const appointments = useClientList("appointments");
  const meetings = useClientList("meetings");
  const checklist = useClientList("checklist");
  const whodas = useClientList("whodas");
  const claims = useClientList("claims");
  const budgets = useClientList("budgets");
  const reports = useClientList("reports");
  const addReport = useOllie((s) => s.addReport);
  const remove = useOllie((s) => s.removeReport);
  const membership = useOllie((s) => s.membership);
  const [kind, setKind] = useState(KINDS[0].id);

  const pack = {
    client,
    evidence,
    logs,
    flags,
    goals,
    schoolNotes,
    fluctuations,
    appointments,
    meetings,
    checklist,
    whodas,
    claims,
    budgets,
  };
  const bundle = buildGpPackText(pack);

  return (
    <div>
      <PageHeader
        title="Pack for a GP or planner"
        lede="One document from what is already on this device: slips, carer notes, school, function, prep, checklist, and claims. Ask consent. Edit before you share."
        actions={<GpPackButtons />}
      />
      <Card>
        <p className="text-sm text-muted">
          {evidence.length} slips · {logs.length} logs · {schoolNotes.length} school · {whodas.length} function ·{" "}
          {appointments.length + meetings.length} prep · {claims.length} claims · {goals.length} goals
        </p>
        <p className="mt-2 text-xs text-muted">
          Printed {todayISO()}. Practice notes only — not the NDIA, not a clinical report.
        </p>
      </Card>

      {canAccess(membership, "pro") ? (
        <>
        <Card className="mt-4">
          <p className="text-sm font-medium">Pro drafts</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <Button key={k.id} size="sm" variant={kind === k.id ? "primary" : "secondary"} onClick={() => setKind(k.id)}>
                {k.label}
              </Button>
            ))}
          </div>
        </Card>
        <div className="mt-4">
          <DraftWithOllie
            kind={kind}
            notes={bundle}
            prompt={`Write a ${KINDS.find((k) => k.id === kind)?.label} from these notes. Australian English. Functional. No clinical claims. No funding guarantees.`}
          />
        </div>
        <div className="mt-5 space-y-3">
          {reports.length === 0 ? (
            <EmptyState title="No saved drafts" body="Download the GP pack, or draft with Plan Decoder if you have credits." />
          ) : (
            reports.map((r) => (
              <Card key={r.id}>
                <p className="font-semibold">{r.title}</p>
                <p className="text-xs text-muted">{formatDate(r.createdAt)}</p>
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-sm">{r.body}</pre>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => downloadText(`${r.title}.txt`, r.body)}>
                    Download
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(r.id)}>
                    Remove
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => addReport({ kind: r.kind, title: r.title, body: r.body })}>
                    Duplicate
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
        </>
      ) : (
        <p className="mt-6 text-sm text-muted">
          The pack above is yours. Polished letter drafts are a Professional tool.
        </p>
      )}
    </div>
  );
}
