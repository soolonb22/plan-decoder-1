import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/public-paths";

const PATHS = [
  "/",
  "/assessment",
  "/rights",
  "/news",
  "/glossary",
  "/funding",
  "/art",
  "/code-of-conduct",
  "/service-charter",
  "/ndis-changes",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const urls = PATHS.map(
          (path) => `  <url>
    <loc>${SITE_URL}${path === "/" ? "/" : path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${path === "/news" ? "hourly" : "weekly"}</changefreq>
    <priority>${path === "/" ? "1.0" : path === "/assessment" || path === "/rights" ? "0.9" : "0.7"}</priority>
  </url>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
        return new Response(xml, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
