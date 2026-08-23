import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useOllie, useActiveClient, useClientList } from "@/lib/store";
import { downloadText, formatDate, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";
import { DraftWithOllie } from "@/components/draft-with-ollie";

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
  const reports = useClientList("reports");
  const addReport = useOllie((s) => s.addReport);
  const remove = useOllie((s) => s.removeReport);
  const [kind, setKind] = useState(KINDS[0].id);

  const bundle = [
    `Plan Decoder export — ${client?.preferredName || client?.name} — ${todayISO()}`,
    client?.ndisNumber ? `NDIS: ${client.ndisNumber}` : "",
    "",
    "Goals",
    ...goals.map((g) => `- ${g.title}: ${g.supports}`),
    "",
    "Evidence",
    ...evidence.map((e) => `- ${e.date} ${e.title}\n  ${e.body}`),
    "",
    "Logs",
    ...logs.map((e) => `- ${e.date} (${e.kind}) ${e.whatHappened} / ${e.impact}`),
    "",
    "Flags",
    ...flags.map((f) => `- ${f.kind}: ${f.title} — ${f.detail}`),
    "",
    "Draft only. Not an NDIA decision. Not a clinical report.",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <MembershipGate need="pro">
      <PageHeader
        title="Exportable reports"
        lede="Pull together what is already on this device. Edit before you share. Ask consent."
        actions={
          <Button variant="secondary" onClick={() => downloadText("plan-decoder-bundle.txt", bundle)}>
            Download bundle
          </Button>
        }
      />
      <Card>
        <p className="text-sm text-muted">
          {evidence.length} evidence notes · {logs.length} logs · {flags.length} flags · {goals.length} goals
        </p>
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
          <EmptyState title="No saved reports" body="Draft with Plan Decoder, or download the bundle as text." />
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
    </MembershipGate>
  );
}
