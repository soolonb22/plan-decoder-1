import { createFileRoute } from "@tanstack/react-router";
import { GuideBySlug, guideHead } from "@/lib/guide-route";

export const Route = createFileRoute("/ndis-carer-support-statement")({
  component: () => <GuideBySlug slug="ndis-carer-support-statement" />,
  head: () => guideHead("ndis-carer-support-statement"),
});
