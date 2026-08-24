import { neonConfig, Pool as NeonPool } from "@neondatabase/serverless";

function onWorker() {
  if (typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers") return true;
  return typeof (globalThis as { WebSocketPair?: unknown }).WebSocketPair === "function";
}

/**
 * Postgres pool that works on Cloudflare Workers (HTTP) and in Node.
 * node-pg TCP sockets cannot initialize Better Auth on workerd.
 */
export function createNeonPool(connectionString: string) {
  if (onWorker()) neonConfig.poolQueryViaFetch = true;
  return new NeonPool({ connectionString, max: 5 });
}
