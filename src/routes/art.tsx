import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { AAT_VIDEO, ART_APPLY_VIDEO, YoutubeEmbed } from "@/components/youtube-embed";

export const Route = createFileRoute("/art")({
  component: ArtPage,
  head: () => ({
    meta: [
      { title: "Navigating the Administrative Appeals Tribunal for your NDIS · Plan Decoder" },
      {
        name: "description",
        content:
          "AAT is now the ART. How to apply for an NDIS external review: 28 days, no fee, internal review first, NDIS Appeals Program. Not legal advice. Not the NDIA.",
      },
    ],
  }),
});

function ArtPage() {
  return (
    <div>
      <PageHeader
        title="Navigating the Administrative Appeals Tribunal for your NDIS"
        lede="The AAT was replaced by the Administrative Review Tribunal (ART) on 14 October 2024. Same idea: an independent look at an NDIA decision. Dates are strict."
        picture="/brand/story-path.jpg"
      />
      <Disclaimer>
        This is general information, not legal advice. Plan Decoder cannot represent you. If you are in crisis, call Lifeline 13 11 14. If you are in danger, call 000.
      </Disclaimer>
      <YoutubeEmbed id={AAT_VIDEO.id} title={AAT_VIDEO.title} credit={AAT_VIDEO.credit} />

      <h2 className="mt-8 text-lg font-semibold">A calm order of steps</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
        <li>Keep the decision letter and the date you received it.</li>
        <li>Ask the NDIA for an internal review first (usually within 3 months).</li>
        <li>If you still disagree, apply to the ART, usually within 28 days of that internal review.</li>
        <li>If the NDIA has not finished the internal review in 90 days, ask the ART whether it can start anyway.</li>
        <li>There is no application fee for NDIS reviews.</li>
        <li>Ask for an NDIS Appeals Program advocate, or Legal Aid.</li>
      </ol>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Card>
          <p className="text-sm font-medium text-primary">The ART can look at</p>
          <p className="mt-2 text-sm text-muted">
            Access decisions, supports in a plan, some nominee and child decisions — after internal review.
          </p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-primary">The ART cannot</p>
          <p className="mt-2 text-sm text-muted">
            Investigate a complaint about NDIA service, or change the law. Use the Commission or Ombudsman for those.
          </p>
        </Card>
      </div>

      <h2 className="mt-8 text-lg font-semibold">How to apply (official ART video)</h2>
      <YoutubeEmbed id={ART_APPLY_VIDEO.id} title={ART_APPLY_VIDEO.title} credit={ART_APPLY_VIDEO.credit} />
      <p className="mt-3 text-sm">
        Apply:{" "}
        <a className="text-primary underline-offset-4 hover:underline" href="https://online.aat.gov.au/Home/InstructionsNdis" target="_blank" rel="noreferrer">
          online NDIS form
        </a>
        {" · "}
        <a className="text-primary underline-offset-4 hover:underline" href="https://www.art.gov.au/applying-review/national-disability-insurance-scheme" target="_blank" rel="noreferrer">
          art.gov.au NDIS page
        </a>
        {" · "}
        phone 1800 228 333 · email reviews@art.gov.au
      </p>
      <p className="mt-2 text-sm">
        Free advocate:{" "}
        <a className="text-primary underline-offset-4 hover:underline" href="https://www.health.gov.au/our-work/ndis-appeals-program" target="_blank" rel="noreferrer">
          NDIS Appeals Program
        </a>
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="secondary" asChild>
          <Link to="/rights">Know your rights</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/wallet">Sort evidence first</Link>
        </Button>
      </div>
    </div>
  );
}
