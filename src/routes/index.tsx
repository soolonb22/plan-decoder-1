import { createFileRoute, Link } from "@tanstack/react-router";
import { useActiveClient, useClientList } from "@/lib/store";
import { daysUntil, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarketingHome } from "@/components/marketing-home";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Plan Decoder — calm NDIS practice tools" },
      {
        name: "description",
        content:
          "Get ready for one NDIS conversation, in your own words. Notes stay on this device. Independent. Not the NDIA. Not a funding decision.",
      },
    ],
  }),
});

function Home() {
  const { user } = useCurrentUserState();
  if (user) return <WorkspaceHome />;
  return <MarketingHome />;
}

function WorkspaceHome() {
  const client = useActiveClient();
  const evidence = useClientList("evidence");
  const logs = useClientList("logs");
  const until = daysUntil(client?.planEnd);
  const name = client?.preferredName || client?.name || "there";
  const sentences = evidence.filter((item) => item.tags?.includes("language")).length;

  return (
    <div>
      <section>
        <div className="welcome-band">
          <p className="welcome-kicker">You are in the right place</p>
          <h1>My pack</h1>
          <p className="welcome-lede">
            Four small steps for {name === "there" ? "this conversation" : name}. Empty steps are fine. Notes stay on this device.
          </p>
          <p className="welcome-trust">Nothing here is an NDIA decision.</p>
        </div>
      </section>

      {until !== null && until <= 90 ? (
        <Card className="mt-5 border-lavender bg-primary-soft">
          <p className="text-sm font-medium text-primary-deep">Plan date on the radar</p>
          <p className="mt-1 text-ink">
            Recorded plan end {formatDate(client?.planEnd)} · {until >= 0 ? `${until} days away` : `${Math.abs(until)} days ago`}.
          </p>
        </Card>
      ) : null}

      <ol className="mt-6 space-y-3">
        <li className="rounded-2xl border border-line bg-card p-4">
          <p className="text-sm font-semibold text-primary">1. Say it in your words</p>
          <p className="mt-1 text-sm text-muted">{sentences ? `${sentences} sentence${sentences === 1 ? "" : "s"} on this device.` : "No sentence yet."}</p>
          <Button className="mt-3" size="sm" asChild>
            <Link to="/words" search={{ tab: "everyday", door: "planning" }}>Add this to my pack</Link>
          </Button>
        </li>
        <li className="rounded-2xl border border-line bg-card p-4">
          <p className="text-sm font-semibold text-primary">2. Add the pattern</p>
          <p className="mt-1 text-sm text-muted">{logs.length ? `${logs.length} diary or carer note${logs.length === 1 ? "" : "s"}.` : "No dated notes yet."}</p>
          <Button className="mt-3" size="sm" variant="secondary" asChild>
            <Link to="/wallet" search={{ tab: "diary" }}>Add how often this happens</Link>
          </Button>
        </li>
        <li className="rounded-2xl border border-line bg-card p-4">
          <p className="text-sm font-semibold text-primary">3. Tick what you already have</p>
          <p className="mt-1 text-sm text-muted">{evidence.length ? `${evidence.length} evidence note${evidence.length === 1 ? "" : "s"}.` : "Nothing ticked yet."}</p>
          <Button className="mt-3" size="sm" variant="secondary" asChild>
            <Link to="/wallet" search={{ tab: "slips" }}>Back to my pack</Link>
          </Button>
        </li>
        <li className="rounded-2xl border border-line bg-card p-4">
          <p className="text-sm font-semibold text-primary">4. Print my pack</p>
          <p className="mt-1 text-sm text-muted">Your sentences, dated notes, and evidence ticks. Built from your words. Not an assessment.</p>
          <Button className="mt-3" size="sm" variant="secondary" asChild>
            <Link to="/wallet">Open the pocket to print</Link>
          </Button>
        </li>
      </ol>

      <p className="mt-6 text-sm text-muted">
        Rule changes are dated on{" "}
        <Link to="/ndis-changes" className="font-medium text-primary underline-offset-2 hover:underline">What changed</Link>.
        A practice rehearsal is available from{" "}
        <Link to="/pricing" className="font-medium text-primary underline-offset-2 hover:underline">Pricing</Link>.
        It is not the front door.
      </p>
    </div>
  );
}
