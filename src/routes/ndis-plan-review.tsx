import { createFileRoute } from "@tanstack/react-router";
import { GuideBySlug, guideHead } from "@/lib/guide-route";

export const Route = createFileRoute("/ndis-plan-review")({
  component: () => <GuideBySlug slug="ndis-plan-review" />,
  head: () => guideHead("ndis-plan-review"),
});
