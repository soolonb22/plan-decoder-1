/**
 * Detailed Worker secret names and Wrangler setup belong on local/dev hosts.
 * Production visitors on plandecoder.com should never see them.
 */
export function isLocalAuthDebugHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
  if (host.endsWith(".localhost") || host.endsWith(".local")) return true;
  if (host.endsWith(".grok-sandbox.com")) return true;
  return false;
}
