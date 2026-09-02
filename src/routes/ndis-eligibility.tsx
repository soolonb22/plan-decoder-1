import { createFileRoute } from "@tanstack/react-router";
import { GuideBySlug, guideHead } from "@/lib/guide-route";

export const Route = createFileRoute("/ndis-eligibility")({
  component: () => <GuideBySlug slug="ndis-eligibility" />,
  head: () => guideHead("ndis-eligibility"),
});
