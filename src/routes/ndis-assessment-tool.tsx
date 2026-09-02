import { createFileRoute } from "@tanstack/react-router";
import { GuideBySlug, guideHead } from "@/lib/guide-route";

export const Route = createFileRoute("/ndis-assessment-tool")({
  component: () => <GuideBySlug slug="ndis-assessment-tool" />,
  head: () => guideHead("ndis-assessment-tool"),
});
