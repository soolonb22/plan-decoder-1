import { createFileRoute, Link } from "@tanstack/react-router";
import { useClientList } from "@/lib/store";
import { formatDate, downloadText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/impact")({ component: ImpactPage });

function ImpactPage() {
  const drafts = useClientList("drafts").filter((d) => d.flowId === "impact");
  const reports = useClientList("reports").filter((r) => r.kind.includes("impact"));

  return (
    <MembershipGate need="core">
      <PageHeader
        title="Impact statements"
        lede="A short statement of what is hard, how often, and what support changes. Guided help writes the first draft."
        actions={
          <Button asChild>
            <Link to="/guide">Write with guided help</Link>
          </Button>
        }
      />
      {drafts.length === 0 && reports.length === 0 ? (
        <EmptyState
          title="No impact statements yet"
          body="Use Guided help → Write an impact statement. You can edit every word."
          action={
            <Button asChild>
              <Link to="/guide">Start</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {drafts.map((d) => (
            <Card key={d.id}>
              <p className="text-xs text-muted">{formatDate(d.createdAt)}</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{d.output}</pre>
              <Button
                className="mt-3"
                size="sm"
                variant="secondary"
                onClick={() => downloadText("impact-statement.txt", d.output)}
              >
                Download
              </Button>
            </Card>
          ))}
        </div>
      )}
    </MembershipGate>
  );
}
