import { createFileRoute } from "@tanstack/react-router";
import { GuideBySlug, guideHead } from "@/lib/guide-route";

export const Route = createFileRoute("/ndis-internal-review")({
  component: () => <GuideBySlug slug="ndis-internal-review" />,
  head: () => guideHead("ndis-internal-review"),
});
