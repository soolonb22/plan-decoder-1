import { createFileRoute } from "@tanstack/react-router";
import { GuideBySlug, guideHead } from "@/lib/guide-route";

export const Route = createFileRoute("/ndis-access-request")({
  component: () => <GuideBySlug slug="ndis-access-request" />,
  head: () => guideHead("ndis-access-request"),
});
