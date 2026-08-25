import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/function")({
  component: () => <Navigate to="/assessment" search={{ tab: "function" }} />,
});
