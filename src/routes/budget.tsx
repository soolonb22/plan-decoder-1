import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/budget")({
  component: () => <Navigate to="/plan" search={{ tab: "spend" }} />,
});
