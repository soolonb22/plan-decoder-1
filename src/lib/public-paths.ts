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
  "/navigator",
  "/sitemap.xml",
  "/health",
  "/get-files",
  "/prep-pack",
  "/prep-pack/success",
  "/unlock",
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
  { to: "/", label: "Home" },
  { to: "/assessment", label: "Practice assessment" },
  { to: "/navigator", label: "Navigator" },
  { to: "/rights", label: "Know your rights" },
  { to: "/articles", label: "Articles" },
  { to: "/prep-pack", label: "Prep Pack" },
  { to: "/news", label: "NDIS news" },
  { to: "/glossary", label: "Glossary" },
  { to: "/pricing", label: "Pricing" },
] as const;

export const LOGIN_CREATE_SEARCH = { create: 1 } as const;
