import { createFileRoute } from "@tanstack/react-router";
import { AssessmentWizard } from "@/components/assessment/wizard";
import { MembershipGate, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/practice")({
  component: PracticePage,
  head: () => ({
    meta: [
      {
        title: "Practice questionnaire with Plan Decoder | NDIS rehearsal — not NDIA",
      },
      {
        name: "description",
        content:
          "Complete a private NDIS-style practice questionnaire. WHODAS-inspired scoring, environment, permanency and mainstream modules. Not affiliated with the NDIA.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});

function PracticePage() {
  return (
    <div>
      <PageHeader
        title="Practice assessment"
        lede="Core membership opens this rehearsal. Go slowly. Skip anything that does not apply. Delete anytime."
      />
      <MembershipGate need="core">
        <AssessmentWizard />
      </MembershipGate>
    </div>
  );
}
