import { createFileRoute } from "@tanstack/react-router";
import { ensureDbReady, getSql } from "@/lib/db";

export const Route = createFileRoute("/api/ops/reclaim-email")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env.BETTER_AUTH_SECRET?.trim();
        const got = request.headers.get("x-pd-ops")?.trim();
        if (!expected || !got || got !== expected) {
          return Response.json({ error: "forbidden" }, { status: 403 });
        }
        let email = "";
        try {
          const body = (await request.json()) as { email?: string };
          email = String(body.email ?? "")
            .trim()
            .toLowerCase();
        } catch {
          return Response.json({ error: "bad json" }, { status: 400 });
        }
        if (!email || !email.includes("@")) {
          return Response.json({ error: "email required" }, { status: 400 });
        }
        await ensureDbReady();
        const sql = await getSql();
        const users = await sql.query<{ id: string }>(`select id from "user" where lower(email) = $1`, [email]);
        if (!users.length) return Response.json({ ok: true, deleted: 0 });
        const id = users[0].id;
        await sql.query(`delete from "session" where "userId" = $1`, [id]);
        await sql.query(`delete from "account" where "userId" = $1`, [id]);
        await sql.query(`delete from "verification" where identifier = $1`, [email]);
        await sql.query(`delete from "user" where id = $1`, [id]);
        return Response.json({ ok: true, deleted: 1 });
      },
    },
  },
});
