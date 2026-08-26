import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ClipboardList,
  Compass,
  FolderOpen,
  MessageSquare,
  Scale,
} from "lucide-react";
import { useOllie, useActiveClient, useClientList } from "@/lib/store";
import { canAccess } from "@/lib/membership";
import { daysUntil, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HOW_OLLIE_WORKS, StoryStrip } from "@/components/story";
import { OllieMark } from "@/components/mark";
import { LiveNewsStrip } from "@/components/live-news";
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
          "Independent NDIS practice assessment, evidence notes, and plain-language rights for families, carers, and coordinators. Not the NDIA. Not a diagnosis.",
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
  const loadSample = useOllie((s) => s.loadSample);
  const membership = useOllie((s) => s.membership);
  const evidence = useClientList("evidence");
  const logs = useClientList("logs");
  const until = daysUntil(client?.planEnd);
  const name = client?.preferredName || client?.name || "there";
  const whose =
    name === "Me" || name === "there" ? "your" : `${name}'s`;

  return (
    <div>
      <section className="welcome-row">
        <OllieMark className="size-14 shrink-0" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Let’s take this one step at a time.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
            This is {whose} calm workspace. Evidence stays on this device. Nothing here is an NDIA decision.
          </p>
        </div>
      </section>

      <StoryStrip heading="How this works" steps={HOW_OLLIE_WORKS} />

      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild>
          <Link to={canAccess(membership, "core") ? "/assessment" : "/membership"}>
            {canAccess(membership, "core") ? "Start a practice assessment" : "Start Core to practise"}
          </Link>
        </Button>
        <Button variant="secondary" onClick={() => loadSample()}>
          Load a sample person
        </Button>
      </div>

      {until !== null && until <= 90 ? (
        <Card className="mt-5 border-lavender bg-primary-soft">
          <p className="text-sm font-medium text-primary-deep">Plan date on the radar</p>
          <p className="mt-1 text-ink">
            Recorded plan end {formatDate(client?.planEnd)} · {until >= 0 ? `${until} days away` : `${Math.abs(until)} days ago`}.
            You can prepare a meeting brief whenever you are ready.
          </p>
          <Button className="mt-3" size="sm" asChild>
            <Link to="/guide">Prepare with guided help</Link>
          </Button>
        </Card>
      ) : null}

      <LiveNewsStrip limit={3} />

      <p className="mb-3 mt-8 text-sm font-medium text-muted">What do you need today?</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            to: "/assessment",
            icon: ClipboardList,
            image: "/brand/story-tick.jpg",
            title: "Practice assessment",
            body: "Tick questions about daily life. Practice only — not the NDIA.",
          },
          {
            to: "/guide",
            icon: Compass,
            image: "/brand/story-path.jpg",
            title: "Guided help",
            body: "Letters and meeting notes, one small step at a time.",
          },
          {
            to: "/wallet",
            icon: FolderOpen,
            image: "/brand/story-wallet.jpg",
            title: "Evidence pocket",
            body: "Slips, diary, carer notes, flags, and a weekly chart — on this device.",
          },
          {
            to: "/rights",
            icon: Scale,
            image: "/brand/story-rights.jpg",
            title: "Know your rights",
            body: "Eight short modules with quizzes. Progress stays in this browser.",
          },
          {
            to: "/words",
            icon: MessageSquare,
            image: "/brand/story-words.jpg",
            title: "Find the words",
            body: "Swap harsh words for what actually happens in a day.",
          },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="invite-card group rounded-2xl border border-line bg-card p-3 shadow-[var(--shadow-card)] transition-colors hover:border-line-strong hover:bg-primary-soft"
          >
            <img src={item.image} alt="" width={72} height={72} />
            <div className="invite-copy">
              <item.icon className="size-4 text-primary" />
              <p className="mt-1 font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.body}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-medium text-primary">On this device</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{evidence.length}</p>
          <p className="text-sm text-muted">evidence notes</p>
          <p className="mt-3 text-3xl font-semibold tabular-nums">{logs.length}</p>
          <p className="text-sm text-muted">diary and carer logs</p>
          <Button className="mt-4" variant="secondary" size="sm" asChild>
            <Link to="/wallet" search={{ tab: "diary" }}>Add a diary note</Link>
          </Button>
        </Card>
        <Card>
          <div className="flex items-start gap-3">
            <img
              src="/brand/story-together.jpg"
              alt=""
              width={56}
              height={56}
              className="size-14 rounded-2xl object-cover"
            />
            <div>
              <p className="font-semibold">You do not have to do this alone</p>
              <p className="mt-2 text-sm text-muted">
                A parent, carer, nominee, or professional can answer with you. Strengths and support needs can both be true.
              </p>
              <Button className="mt-4" variant="ghost" size="sm" asChild>
                <Link to="/privacy">How privacy works</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="secondary" asChild>
          <Link to="/funding">Funding categories explained</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/checklist">Plan implementation checklist</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/code-of-conduct">NDIS Code of Conduct</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/glossary">Open the glossary</Link>
        </Button>
      </div>
    </div>
  );
}
