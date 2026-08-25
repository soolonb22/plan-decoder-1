import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/language")({
  component: () => <Navigate to="/words" search={{ tab: "everyday" }} />,
});
