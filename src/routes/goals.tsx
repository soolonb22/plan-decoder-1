import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/goals")({
  component: () => <Navigate to="/plan" search={{ tab: "goals" }} />,
});
