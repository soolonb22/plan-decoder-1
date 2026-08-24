import { createFileRoute } from "@tanstack/react-router";
import { ensureDbReady } from "@/lib/db";

async function handle(request: Request): Promise<Response> {
  try {
    await ensureDbReady();
    const { auth } = await import("@/lib/auth/server");
    return await auth.handler(request);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sign-in failed";
    return Response.json({ error: message, code: "AUTH_HANDLER" }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
});
