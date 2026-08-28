import { Navigate, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/get-files")({
  component: GetFiles,
  head: () => ({
    meta: [
      { title: "Plan Decoder" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function GetFiles() {
  return <Navigate to="/" />;
}
