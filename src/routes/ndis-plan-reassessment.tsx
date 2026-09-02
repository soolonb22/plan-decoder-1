import { createFileRoute } from "@tanstack/react-router";
import { GuideBySlug, guideHead } from "@/lib/guide-route";

export const Route = createFileRoute("/ndis-plan-reassessment")({
  component: () => <GuideBySlug slug="ndis-plan-reassessment" />,
  head: () => guideHead("ndis-plan-reassessment"),
});
