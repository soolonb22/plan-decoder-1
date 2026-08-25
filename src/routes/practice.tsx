import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/practice")({
  component: () => <Navigate to="/assessment" search={{ tab: "practice" }} />,
});
