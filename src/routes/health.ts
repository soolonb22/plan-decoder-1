import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/health")({
  ssr: false,
  server: {
    handlers: {
      GET: () =>
        new Response("ok", {
          headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
        }),
    },
  },
});
