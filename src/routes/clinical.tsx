import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/clinical")({
  component: () => <Navigate to="/words" search={{ tab: "clinical" }} />,
});
