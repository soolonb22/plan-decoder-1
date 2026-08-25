import { createFileRoute } from "@tanstack/react-router";
import { ensureDbReady, getSql } from "@/lib/db";

export const Route = createFileRoute("/api/account/delete")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          await ensureDbReady();
          const { auth } = await import("@/lib/auth/server");
          const session = await auth.api.getSession({ headers: request.headers });
          const userId = session?.user?.id;
          const email = String(session?.user?.email ?? "")
            .trim()
            .toLowerCase();
          if (!userId) return Response.json({ error: "not signed in" }, { status: 401 });
          const sql = await getSql();
          await sql.query(`delete from "session" where "userId" = $1`, [userId]);
          await sql.query(`delete from "account" where "userId" = $1`, [userId]);
          if (email) await sql.query(`delete from "verification" where identifier = $1`, [email]);
          await sql.query(`delete from "user" where id = $1`, [userId]);
          return Response.json({ ok: true });
        } catch (err) {
          const message = err instanceof Error ? err.message : "delete failed";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
