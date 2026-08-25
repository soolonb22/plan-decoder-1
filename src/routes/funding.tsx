import { Link, createFileRoute } from "@tanstack/react-router";
import { FUNDING_BUDGETS } from "@/lib/content/funding";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { PlanStructureDiagram } from "@/components/plan-diagram";

export const Route = createFileRoute("/funding")({
  component: FundingPage,
  head: () => ({
    meta: [
      { title: "NDIS Funding Categories Explained: What Your Plan Covers and How to Use It · Plan Decoder" },
      {
        name: "description",
        content:
          "NDIS funding categories explained: Core, Capacity Building, Capital and Recurring. What your plan covers, flexible vs stated, and how to use it. Not the NDIA.",
      },
    ],
  }),
});

function FundingPage() {
  return (
    <div>
      <PageHeader
        title="NDIS funding categories explained: what your plan covers and how to use it"
        lede="Four official support budgets. This is a calm practice explainer — not the NDIA, and not your live balance."
        picture="/brand/story-wallet.jpg"
      />
      <Disclaimer>
        Plan Decoder is not affiliated with the NDIA or NDIS. Check your plan and ndis.gov.au before you spend. Official balances live in the my NDIS app.
      </Disclaimer>
      <div className="mt-5">
        <PlanStructureDiagram />
      </div>
      <YoutubeEmbed id={FUNDING_VIDEO.id} title={FUNDING_VIDEO.title} credit={FUNDING_VIDEO.credit} />

      <h2 className="mt-8 text-lg font-semibold">The four support budgets</h2>
      <p className="mt-2 text-sm text-muted">
        NDIA guide, current 9 June 2026. Not every plan has every budget. You only get the pots you need. You cannot pour one pot into another.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {FUNDING_BUDGETS.map((b) => (
          <Card key={b.id}>
            <p className="text-sm font-medium text-primary">{b.name}</p>
            <p className="mt-1 text-sm">{b.easy}</p>
            <p className="mt-2 text-sm text-muted">{b.body}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold">How to use the funding</h2>
      <Card className="mt-3">
        <ul className="space-y-3 text-sm">
          <li>
            <span className="font-medium">Only NDIS supports.</span> Related to your disability, in line with your plan, and on the NDIS supports list (or an agreed replacement).
          </li>
          <li>
            <span className="font-medium">Stay inside the budget.</span> Flexible lines can often share money inside the same budget. Stated lines are for the named support only.
          </li>
          <li>
            <span className="font-medium">Do not mix the four pots.</span> Core cannot top up Capital. Recurring (for example transport) cannot take money from Core.
          </li>
          <li>
            <span className="font-medium">Watch the words on the plan.</span> “This is a flexible support” vs “This is a stated support”.
          </li>
          <li>
            <span className="font-medium">Providers.</span> If NDIA-managed, they usually need to be registered. Plan-managed and self-managed have more choice, still within the rules.
          </li>
          <li>
            <span className="font-medium">Price limits.</span> Most items have a code and a price limit. Your notes here are not a claim.
          </li>
          <li>
            <span className="font-medium">Track from week one.</span> Short notes of spend and what changed help the next check-in.
          </li>
        </ul>
      </Card>

      <p className="mt-4 text-sm">
        Official:{" "}
        <a
          className="text-primary underline-offset-4 hover:underline"
          href="https://www.ndis.gov.au/participants/using-your-funding/ndis-support-budgets/guide-ndis-support-budgets"
          target="_blank"
          rel="noreferrer"
        >
          Guide to NDIS support budgets
        </a>
        {" · "}
        <a
          className="text-primary underline-offset-4 hover:underline"
          href="https://www.ndis.gov.au/participants/using-your-funding/understanding-your-ndis-funding/what-are-ndis-supports"
          target="_blank"
          rel="noreferrer"
        >
          What are NDIS supports
        </a>
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/budget">Open budget helper (your notes)</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/checklist">Plan implementation checklist</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/rights">Know your rights</Link>
        </Button>
      </div>
    </div>
  );
}
