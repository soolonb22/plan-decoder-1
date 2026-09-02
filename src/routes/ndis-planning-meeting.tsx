import { createFileRoute } from "@tanstack/react-router";
import { GuideBySlug, guideHead } from "@/lib/guide-route";

export const Route = createFileRoute("/ndis-planning-meeting")({
  component: () => <GuideBySlug slug="ndis-planning-meeting" />,
  head: () => guideHead("ndis-planning-meeting"),
});
