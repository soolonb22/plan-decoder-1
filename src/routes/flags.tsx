import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/flags")({
  component: () => <Navigate to="/wallet" search={{ tab: "flags" }} />,
});
