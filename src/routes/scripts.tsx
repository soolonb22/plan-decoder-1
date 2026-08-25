import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/scripts")({
  component: () => <Navigate to="/words" search={{ tab: "scripts" }} />,
});
