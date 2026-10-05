/** Pages Google (and a signed-out visitor) can open without an account. */
export const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/reset-password",
  "/rights",
  "/course",
  "/news",
  "/glossary",
  "/funding",
  "/art",
  "/code-of-conduct",
  "/service-charter",
  "/ndis-changes",
  "/articles",
  "/assessment",
  "/about",
  "/pricing",
  "/privacy",
  "/words",
  "/navigator",
  "/systems-walk",
  "/sitemap.xml",
  "/health",
  "/get-files",
  "/prep-pack",
  "/prep-pack/success",
  "/unlock",
  "/membership",
  "/function",
  "/service-agreement",
  "/before-you-hire",
]);

export function isPublicPath(pathname: string) {
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/ndis-")) return true;
  if (pathname.startsWith("/prep-pack")) return true;
  if (PUBLIC_PATHS.has(pathname)) return true;
  return false;
}

export const SITE_URL = "https://www.plandecoder.com";

export const PUBLIC_NAV = [
  { to: "/", label: "Start" },
  { to: "/words", label: "My pack" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
] as const;

export const LOGIN_CREATE_SEARCH = { create: 1 } as const;
