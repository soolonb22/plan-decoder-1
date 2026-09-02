import { createFileRoute } from "@tanstack/react-router";
import { GuideBySlug, guideHead } from "@/lib/guide-route";

export const Route = createFileRoute("/ndis-autism-adhd-funding")({
  component: () => <GuideBySlug slug="ndis-autism-adhd-funding" />,
  head: () => guideHead("ndis-autism-adhd-funding"),
});
