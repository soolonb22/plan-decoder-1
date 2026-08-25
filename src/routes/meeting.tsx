import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/meeting")({
  component: () => <Navigate to="/prep" search={{ tab: "meeting" }} />,
});
