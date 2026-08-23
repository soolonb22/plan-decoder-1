import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/layout/app-shell";
import { RequireAuth } from "@/components/layout/auth-gate";
import { HydrateOllie } from "@/components/hydrate-ollie";
import appCss from "../styles.css?url";

const APP_NAME = "Plan Decoder";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Plan Decoder is an independent NDIS practice workspace: WHODAS-inspired functional rehearsal, evidence notes, and calm language. Not affiliated with the NDIA or NDIS. Not a diagnosis.",
      },
      { name: "theme-color", content: "#6E2C92" },
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

function RootDocument() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const publicPage = pathname === "/login" || pathname === "/get-files";
  return (
    <html lang="en-AU" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-paper text-ink">
        <PreviewHostBridge />
        <AuthProvider>
          <HydrateOllie />
          {publicPage ? (
            <Outlet />
          ) : (
            <RequireAuth>
              <AppShell>
                <Outlet />
              </AppShell>
            </RequireAuth>
          )}
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
