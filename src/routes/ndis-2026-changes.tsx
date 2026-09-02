import { createFileRoute } from "@tanstack/react-router";
import { GuideBySlug, guideHead } from "@/lib/guide-route";

export const Route = createFileRoute("/ndis-2026-changes")({
  component: () => <GuideBySlug slug="ndis-2026-changes" />,
  head: () => guideHead("ndis-2026-changes"),
});
