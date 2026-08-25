import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/appointment")({
  component: () => <Navigate to="/prep" search={{ tab: "appointment" }} />,
});
