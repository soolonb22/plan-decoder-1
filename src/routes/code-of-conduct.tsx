import { Link, createFileRoute } from "@tanstack/react-router";
import { RIGHTS } from "@/lib/content/rights";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { CODE_OF_CONDUCT_VIDEO, YoutubeEmbed } from "@/components/youtube-embed";

export const Route = createFileRoute("/code-of-conduct")({
  component: CodePage,
  head: () => ({
    meta: [
      { title: "NDIS Code of Conduct [ENGLISH] · Plan Decoder" },
      {
        name: "description",
        content:
          "Official NDIS Code of Conduct in English: the eight rules for providers and workers, Easy Read, and how to complain to the NDIS Commission. Not the NDIA.",
      },
    ],
  }),
});

const ARTICLE = RIGHTS.find((r) => r.id === "code-conduct");

const RULES = [
  "Respect your rights to express yourself, make decisions, and have a say — in line with the law.",
  "Respect your privacy.",
  "Provide supports in a safe, skilled way, with care.",
  "Act with integrity, honesty, and transparency.",
  "Raise and act on quality and safety concerns promptly.",
  "Prevent and respond to violence, exploitation, neglect, and abuse.",
  "Prevent and respond to sexual misconduct.",
  "Not overcharge for goods without a reasonable justification.",
];

function CodePage() {
  return (
    <div>
      <PageHeader
        title="NDIS Code of Conduct [ENGLISH]"
        lede="The Commission’s rules for every NDIS provider and worker. Official English video. You can say no. You can complain."
        picture="/brand/story-rights.jpg"
      />
      <Disclaimer>
        This is the NDIS Quality and Safeguards Commission’s Code, not an NDIA plan decision. Plan Decoder is not the Commission. If you are in immediate danger, call 000.
      </Disclaimer>
      <YoutubeEmbed
        id={CODE_OF_CONDUCT_VIDEO.id}
        title={CODE_OF_CONDUCT_VIDEO.title}
        credit={CODE_OF_CONDUCT_VIDEO.credit}
      />
      <h2 className="mt-8 text-lg font-semibold">The eight rules, in plain words</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
        {RULES.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ol>
      <Card className="mt-6 text-sm text-muted">
        <p>
          Applies to registered and unregistered providers and workers. Full legal text: National Disability Insurance
          Scheme (Code of Conduct) Rules 2018, section 6. Official page:{" "}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://www.ndiscommission.gov.au/rules-and-standards/ndis-code-conduct"
            target="_blank"
            rel="noreferrer"
          >
            ndiscommission.gov.au
          </a>
          . Easy Read:{" "}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://ndiscommission.easyread.com.au/ndis-code-conduct/"
            target="_blank"
            rel="noreferrer"
          >
            NDIS Code of Conduct Easy Read
          </a>
          . Other languages and Auslan:{" "}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://www.ndiscommission.gov.au/code-of-conduct-videos"
            target="_blank"
            rel="noreferrer"
          >
            Code of Conduct videos
          </a>
          .
        </p>
      </Card>
      {ARTICLE ? (
        <Card className="mt-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{ARTICLE.body}</p>
        </Card>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild>
          <a href="https://www.ndiscommission.gov.au/complaints/report" target="_blank" rel="noreferrer">
            Report a provider or worker
          </a>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/rights">Know your rights</Link>
        </Button>
      </div>
    </div>
  );
}
