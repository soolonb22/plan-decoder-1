import { Link, createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Plan Decoder | Independent NDIS practice tools" },
      {
        name: "description",
        content:
          "Plan Decoder (plandecoder.com) is an independent Australian NDIS practice workspace. Not the NDIA. Not a diagnosis. Not legal advice.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About Plan Decoder"
        lede="An independent website for practising NDIS-style questions, keeping evidence notes on your device, and reading rights in plain English."
      />
      <Card>
        <p className="text-sm text-muted">
          Plan Decoder lives at <strong>www.plandecoder.com</strong>. It is made for participants, families, carers,
          nominees, support coordinators, and schools in Australia.
        </p>
        <p className="mt-3 text-sm text-muted">
          It is <strong>not</strong> the National Disability Insurance Agency, not the NDIS, and not a health service.
          It cannot lodge an access request, cannot change a plan, and cannot promise funding.
        </p>
      </Card>
      <ul className="mt-5 space-y-2 text-sm">
        <li>
          <Link className="font-medium text-primary underline-offset-2 hover:underline" to="/assessment">
            Practice assessment
          </Link>{" "}
          — rehearse functional questions.
        </li>
        <li>
          <Link className="font-medium text-primary underline-offset-2 hover:underline" to="/rights">
            Know your rights
          </Link>{" "}
          — eight short modules.
        </li>
        <li>
          <Link className="font-medium text-primary underline-offset-2 hover:underline" to="/news">
            NDIS news
          </Link>{" "}
          — headlines from ndis.gov.au with our notes.
        </li>
        <li>
          <Link className="font-medium text-primary underline-offset-2 hover:underline" to="/glossary">
            Glossary
          </Link>{" "}
          — NDIS words in ordinary English.
        </li>
      </ul>
    </div>
  );
}
