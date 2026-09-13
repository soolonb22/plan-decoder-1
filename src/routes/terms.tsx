import { createFileRoute } from "@tanstack/react-router";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { LegalCard, LegalPageNav, TermsBody } from "@/components/legal";
import { LEGAL_DISCLAIMER, LEGAL_UPDATED } from "@/lib/legal";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of use | Plan Decoder" },
      {
        name: "description",
        content:
          "Plan Decoder terms of use. Independent Australian NDIS practice tools. Not the NDIA, not a diagnosis, and not legal advice.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
});

function TermsPage() {
  return (
    <div>
      <PageHeader
        title="Terms of use"
        lede={`Plain-language rules for using Plan Decoder. Last reviewed ${LEGAL_UPDATED}.`}
      />
      <Disclaimer>{LEGAL_DISCLAIMER}</Disclaimer>
      <LegalPageNav />
      <div className="mt-5 space-y-3">
        <LegalCard title="Terms of use">
          <TermsBody />
        </LegalCard>
      </div>
    </div>
  );
}
