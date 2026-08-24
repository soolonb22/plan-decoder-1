import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ready")({
  server: {
    handlers: {
      GET: async () => {
        const hasDatabase = Boolean(process.env.DATABASE_URL?.trim());
        const hasSecret = Boolean(process.env.BETTER_AUTH_SECRET?.trim());
        let ping = "skipped";
        if (hasDatabase) {
          try {
            const { neon, neonConfig } = await import("@neondatabase/serverless");
            neonConfig.poolQueryViaFetch = true;
            const sql = neon(process.env.DATABASE_URL as string);
            await sql.query("select 1 as ok");
            ping = "ok";
          } catch (err) {
            ping = err instanceof Error ? err.message : "ping failed";
          }
        }
        return Response.json({
          ok: hasDatabase && hasSecret && ping === "ok",
          database: hasDatabase,
          secret: hasSecret,
          ping,
        });
      },
    },
  },
});
