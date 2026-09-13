import { createFileRoute } from "@tanstack/react-router";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { LegalCard, LegalPageNav, RefundsBody } from "@/components/legal";
import { LEGAL_DISCLAIMER, LEGAL_UPDATED } from "@/lib/legal";

export const Route = createFileRoute("/refunds")({
  component: RefundsPage,
  head: () => ({
    meta: [
      { title: "Refunds and cancellation | Plan Decoder" },
      {
        name: "description",
        content:
          "Plan Decoder refund and cancellation rules for Core, credits, and the Prep Pack. Membership cannot be paid from an NDIS plan. Not the NDIA.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
});

function RefundsPage() {
  return (
    <div>
      <PageHeader
        title="Refunds and cancellation"
        lede={`How Core, credits, and one-off packs can be cancelled or refunded. Last reviewed ${LEGAL_UPDATED}.`}
      />
      <Disclaimer>{LEGAL_DISCLAIMER}</Disclaimer>
      <LegalPageNav />
      <div className="mt-5 space-y-3">
        <LegalCard title="Refunds and cancellation">
          <RefundsBody />
        </LegalCard>
      </div>
    </div>
  );
}
