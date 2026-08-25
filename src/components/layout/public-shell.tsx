import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { PUBLIC_NAV } from "@/lib/public-paths";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OllieMark } from "@/components/mark";

export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-dvh bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-line bg-card/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <OllieMark className="size-9" />
            <span className="font-semibold">Plan Decoder</span>
          </Link>
          <nav className="flex min-w-0 flex-1 flex-wrap gap-1" aria-label="Public">
            {PUBLIC_NAV.filter((i) => i.to !== "/").map((item) => (
              <Link
                key={item.to}
                to={item.to}
                search={item.to === "/assessment" ? { tab: "about" } : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-lg px-3 text-sm",
                  pathname === item.to ? "bg-primary text-primary-fg" : "hover:bg-primary-soft",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button size="sm" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-line px-4 py-6 text-center text-xs text-muted">
        Plan Decoder is independent. Not the NDIA. Not a diagnosis. Not legal advice.
      </footer>
    </div>
  );
}
