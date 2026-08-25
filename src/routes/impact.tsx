import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/impact")({
  component: () => <Navigate to="/words" search={{ tab: "impact" }} />,
});
