import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/diary")({
  component: () => <Navigate to="/wallet" search={{ tab: "diary" }} />,
});
