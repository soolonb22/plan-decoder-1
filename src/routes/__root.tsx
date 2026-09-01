import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { PageFrame } from "@/components/layout/page-frame";
import { HydrateOllie } from "@/components/hydrate-ollie";
import { SITE_URL } from "@/lib/public-paths";
import appCss from "../styles.css?url";

const APP_NAME = "Plan Decoder";
const DESC =
  "Independent NDIS practice workspace for families, carers, and coordinators: WHODAS-inspired rehearsal, evidence notes, and plain-language rights. Not affiliated with the NDIA or NDIS. Not a diagnosis.";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: APP_NAME,
      alternateName: ["plandecoder.com", "PlanDecoder"],
      url: SITE_URL,
      description: DESC,
      inLanguage: "en-AU",
    },
    {
      "@type": "Organization",
      name: APP_NAME,
      url: SITE_URL,
      description: "Independent NDIS practice tool. Not the NDIA.",
    },
  ],
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Plan Decoder | NDIS practice tools" },
      { name: "description", content: DESC },
      { name: "theme-color", content: "#6B2976" },
      { name: "robots", content: "index,follow,max-image-preview:large" },
      { name: "googlebot", content: "index,follow" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: APP_NAME },
      { property: "og:title", content: "Plan Decoder | NDIS practice tools" },
      { property: "og:description", content: DESC },
      { property: "og:image", content: `${SITE_URL}/og.jpg` },
      { property: "og:locale", content: "en_AU" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Plan Decoder | NDIS practice tools" },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: `${SITE_URL}/og.jpg` },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
});

function canonicalFor(pathname: string) {
  if (pathname === "/") return SITE_URL;
  return `${SITE_URL}${pathname}`;
}

function RootDocument() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const canonical = canonicalFor(pathname);
  return (
    <html lang="en-AU" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
        <link rel="canonical" href={canonical} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="bg-paper text-ink">
        <PreviewHostBridge />
        <AuthProvider>
          <HydrateOllie />
          <PageFrame>
            <Outlet />
          </PageFrame>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
