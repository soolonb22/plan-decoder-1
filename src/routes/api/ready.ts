import { createFileRoute } from "@tanstack/react-router";
import { ensureDbReady } from "@/lib/db";

export const Route = createFileRoute("/api/ready")({
  server: {
    handlers: {
      GET: async () => {
        const hasDatabase = Boolean(process.env.DATABASE_URL?.trim());
        const hasSecret = Boolean(process.env.BETTER_AUTH_SECRET?.trim());
        let ping = "skipped";
        let tables = "skipped";
        if (hasDatabase) {
          try {
            await ensureDbReady();
            const { neon, neonConfig } = await import("@neondatabase/serverless");
            neonConfig.poolQueryViaFetch = true;
            const sql = neon(process.env.DATABASE_URL as string);
            await sql.query("select 1 as ok");
            ping = "ok";
            const rows = (await sql.query(
              `select count(*)::int as n from information_schema.tables where table_schema = 'public' and table_name = 'user'`,
            )) as { n?: number }[];
            tables = Number(rows?.[0]?.n) > 0 ? "ok" : "missing";
          } catch (err) {
            ping = err instanceof Error ? err.message : "ping failed";
          }
        }
        return Response.json({
          ok: hasDatabase && hasSecret && ping === "ok" && tables === "ok",
          database: hasDatabase,
          secret: hasSecret,
          ping,
          tables,
        });
      },
    },
  },
});
