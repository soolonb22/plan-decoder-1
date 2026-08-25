import { createFileRoute } from "@tanstack/react-router";
import { ensureDbReady, getSql } from "@/lib/db";

async function userIdFrom(request: Request) {
  await ensureDbReady();
  const { auth } = await import("@/lib/auth/server");
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user?.id ?? "";
}

export const Route = createFileRoute("/api/sync")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const userId = await userIdFrom(request);
        if (!userId) return Response.json({ error: "not signed in" }, { status: 401 });
        const sql = await getSql();
        const rows = await sql.query<{ ciphertext: string; iv: string; salt: string; updated_at: string }>(
          `select ciphertext, iv, salt, updated_at::text as updated_at from note_vault where user_id = $1`,
          [userId],
        );
        if (!rows.length) return Response.json({ exists: false });
        const row = rows[0];
        return Response.json({
          exists: true,
          ciphertext: row.ciphertext,
          iv: row.iv,
          salt: row.salt,
          updatedAt: row.updated_at,
        });
      },
      PUT: async ({ request }) => {
        const userId = await userIdFrom(request);
        if (!userId) return Response.json({ error: "not signed in" }, { status: 401 });
        let body: { ciphertext?: string; iv?: string; salt?: string } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return Response.json({ error: "bad json" }, { status: 400 });
        }
        const ciphertext = String(body.ciphertext ?? "");
        const iv = String(body.iv ?? "");
        const salt = String(body.salt ?? "");
        if (!ciphertext || !iv || !salt) return Response.json({ error: "missing fields" }, { status: 400 });
        if (ciphertext.length > 2_000_000) return Response.json({ error: "too large" }, { status: 413 });
        const sql = await getSql();
        await sql.query(
          `insert into note_vault (user_id, ciphertext, iv, salt, updated_at)
           values ($1, $2, $3, $4, now())
           on conflict (user_id) do update set ciphertext = excluded.ciphertext, iv = excluded.iv, salt = excluded.salt, updated_at = now()`,
          [userId, ciphertext, iv, salt],
        );
        return Response.json({ ok: true });
      },
      DELETE: async ({ request }) => {
        const userId = await userIdFrom(request);
        if (!userId) return Response.json({ error: "not signed in" }, { status: 401 });
        const sql = await getSql();
        await sql.query(`delete from note_vault where user_id = $1`, [userId]);
        return Response.json({ ok: true });
      },
    },
  },
});
