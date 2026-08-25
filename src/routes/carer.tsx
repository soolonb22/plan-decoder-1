import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/carer")({
  component: () => <Navigate to="/wallet" search={{ tab: "carer" }} />,
});
