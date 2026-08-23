import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export const loadProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      role: string;
      membership: string;
      org_name: string | null;
    }>`select role, membership, org_name from profiles where user_id = ${context.userId}`;
    return rows[0] ?? null;
  });

export const saveProfile = createServerFn({ method: "POST" })
  .validator((input: { role: string; membership: string; orgName: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into profiles (user_id, role, membership, org_name, updated_at)
      values (${context.userId}, ${data.role}, ${data.membership}, ${data.orgName}, now())
      on conflict (user_id) do update set
        role = excluded.role,
        membership = excluded.membership,
        org_name = excluded.org_name,
        updated_at = now()
    `;
    return { ok: true as const };
  });
