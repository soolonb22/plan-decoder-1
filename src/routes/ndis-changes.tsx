import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { MAY_2026_CHANGES_VIDEO, YoutubeEmbed } from "@/components/youtube-embed";

export const Route = createFileRoute("/ndis-changes")({
  component: ChangesPage,
  head: () => ({
    meta: [
      { title: "NDIS Changes Summary May 2026 · Plan Decoder" },
      {
        name: "description",
        content:
          "NDIS Changes Summary May 2026: Bill introduced 14 May, passed August, staged starts. Keep using your current plan until a letter says otherwise. Not the NDIA.",
      },
    ],
  }),
});

function ChangesPage() {
  return (
    <div>
      <PageHeader
        title="NDIS Changes Summary May 2026"
        lede="What was announced in May, and what official pages say now. Staged. Not a rumour thread. Not a funding quote."
        picture="/brand/story-path.jpg"
      />
      <Disclaimer>
        Plan Decoder is not the NDIA. The May video is independent. Parliament passed the Bill on 19 August 2026. Start dates are staggered. Keep using your current plan until a letter says otherwise.
      </Disclaimer>
      <YoutubeEmbed
        id={MAY_2026_CHANGES_VIDEO.id}
        title={MAY_2026_CHANGES_VIDEO.title}
        credit={MAY_2026_CHANGES_VIDEO.credit}
      />

      <h2 className="mt-8 text-lg font-semibold">Dates, in order</h2>
      <ul className="mt-3 space-y-2 text-sm">
        <li>
          <span className="font-medium">14 May 2026.</span> Bill introduced. NDIA Budget update: nothing changes for now; keep using your plan.
        </li>
        <li>
          <span className="font-medium">19–20 August 2026.</span> Parliament passed the Bill. Governor-General signed it (NDIA page, 21 August 2026).
        </li>
        <li>
          <span className="font-medium">27 August 2026.</span> First changes can start — still in stages.
        </li>
        <li>
          <span className="font-medium">1 October 2026.</span> Some participation and daily-activity budget settings described for new or reassessed plans.
        </li>
        <li>
          <span className="font-medium">1 December 2026.</span> Claims described as within 90 days of the support.
        </li>
        <li>
          <span className="font-medium">1 April 2027.</span> New-framework planning / support needs assessments described as starting to transition.
        </li>
        <li>
          <span className="font-medium">1 January 2028.</span> Access based on standardised functional capacity described as beginning; current participants later.
        </li>
      </ul>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Card>
          <p className="text-sm font-medium text-primary">Keep doing</p>
          <p className="mt-2 text-sm text-muted">
            Use the plan you have. Keep evidence of function. Diary the date of any new letter — review clocks start from when you receive it.
          </p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-primary">Do not assume</p>
          <p className="mt-2 text-sm text-muted">
            A May video or a social post does not change your plan. Ask which start date applies to you, in writing.
          </p>
        </Card>
      </div>

      <p className="mt-4 text-sm">
        Official:{" "}
        <a className="text-primary underline-offset-4 hover:underline" href="https://www.ndis.gov.au/ndis-laws/securing-ndis-future-generations" target="_blank" rel="noreferrer">
          Securing the NDIS
        </a>
        {" · "}
        <a className="text-primary underline-offset-4 hover:underline" href="https://www.ndis.gov.au/news/11545-federal-budget-and-ndis-laws-update" target="_blank" rel="noreferrer">
          14 May 2026 update
        </a>
        {" · "}
        <a className="text-primary underline-offset-4 hover:underline" href="https://www.ndis.gov.au/changes-ndis" target="_blank" rel="noreferrer">
          Changes to the NDIS
        </a>
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="secondary" asChild>
          <Link to="/rights">Know your rights</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/news">NDIS news</Link>
        </Button>
      </div>
    </div>
  );
}
