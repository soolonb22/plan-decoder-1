import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/fluctuation")({
  component: () => <Navigate to="/wallet" search={{ tab: "chart" }} />,
});
