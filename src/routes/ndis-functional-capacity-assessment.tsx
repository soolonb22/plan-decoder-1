import { createFileRoute } from "@tanstack/react-router";
import { GuideBySlug, guideHead } from "@/lib/guide-route";

export const Route = createFileRoute("/ndis-functional-capacity-assessment")({
  component: () => <GuideBySlug slug="ndis-functional-capacity-assessment" />,
  head: () => guideHead("ndis-functional-capacity-assessment"),
});
