import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { CHARTER_VIDEO, YoutubeEmbed } from "@/components/youtube-embed";

export const Route = createFileRoute("/service-charter")({
  component: CharterPage,
  head: () => ({
    meta: [
      { title: "NDIS Participant Service Charter and Improvement Plan · Plan Decoder" },
      {
        name: "description",
        content:
          "How To: NDIS Participant Service Charter and Participant Service Improvement Plan. Five service principles, Guarantee clocks, official video. Not the NDIA.",
      },
    ],
  }),
});

const PRINCIPLES = [
  { name: "Transparent", body: "Information and decisions should be easy to access and understand." },
  { name: "Responsive", body: "Your individual needs and circumstances." },
  { name: "Respectful", body: "You are the expert in your own life." },
  { name: "Empowering", body: "Information and support to lead your life." },
  { name: "Connected", body: "Help to reach the services and supports you need." },
];

function CharterPage() {
  return (
    <div>
      <PageHeader
        title="Participant Service Charter and Improvement Plan"
        lede="How the NDIA says it will treat you, and what it says it will change. Official How To video. Not your plan, and not a funding decision."
        picture="/brand/story-rights.jpg"
      />
      <Disclaimer>
        Plan Decoder is not the NDIA. The Charter is a service promise. The Guarantee is the decision clocks. If a clock is missed, keep the dates — it does not automatically add funding.
      </Disclaimer>
      <YoutubeEmbed id={CHARTER_VIDEO.id} title={CHARTER_VIDEO.title} credit={CHARTER_VIDEO.credit} />

      <h2 className="mt-8 text-lg font-semibold">Five words in the Charter</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <Card key={p.name}>
            <p className="text-sm font-medium text-primary">{p.name}</p>
            <p className="mt-1 text-sm text-muted">{p.body}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold">Three documents, three jobs</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
        <li>
          <span className="font-medium">Charter</span> — how they say they will treat you (page current October 2022).
        </li>
        <li>
          <span className="font-medium">Improvement Plan</span> — practical changes they say they will make (website current 19 May 2026).
        </li>
        <li>
          <span className="font-medium">Guarantee</span> — clocks on access, plans, variations, and reviews.
        </li>
      </ul>

      <p className="mt-4 text-sm">
        Official:{" "}
        <a className="text-primary underline-offset-4 hover:underline" href="https://www.ndis.gov.au/about-us/service-charter/participant-service-charter" target="_blank" rel="noreferrer">
          Charter
        </a>
        {" · "}
        <a className="text-primary underline-offset-4 hover:underline" href="https://www.ndis.gov.au/about-us/service-charter/participant-service-improvement-plan" target="_blank" rel="noreferrer">
          Improvement Plan
        </a>
        {" · "}
        <a className="text-primary underline-offset-4 hover:underline" href="https://www.ndis.gov.au/about-us/service-charter/participant-service-guarantee" target="_blank" rel="noreferrer">
          Guarantee timeframes
        </a>
        {" · "}
        <a className="text-primary underline-offset-4 hover:underline" href="https://www.ndis.gov.au/media/2621/download?attachment" target="_blank" rel="noreferrer">
          Easy Read Charter
        </a>
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="secondary" asChild>
          <Link to="/rights">Know your rights</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/art">If you disagree with a decision</Link>
        </Button>
      </div>
    </div>
  );
}
