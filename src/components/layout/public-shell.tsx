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
      <header className="sticky top-0 z-30 border-b border-line bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <OllieMark className="size-9" />
            <span className="leading-tight">
              <span className="block font-bold text-primary-deep">Plan Decoder</span>
              <span className="block text-[0.7rem] font-medium text-muted">Independent · not the NDIA</span>
            </span>
          </Link>
          <nav className="flex min-w-0 flex-1 flex-wrap gap-1" aria-label="Public">
            {PUBLIC_NAV.filter((i) => i.to !== "/").map((item) => {
              const active = pathname === item.to;
              const className = cn(
                "inline-flex min-h-10 items-center rounded-full px-3 text-sm font-semibold text-primary-deep",
                active ? "bg-primary-soft" : "hover:bg-primary-soft",
              );
              if (item.to === "/assessment") {
                return (
                  <Link key={item.to} to="/assessment" search={{ tab: "about" }} className={className}>
                    {item.label}
                  </Link>
                );
              }
              return (
                <Link key={item.to} to={item.to} className={className}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Button size="sm" className="rounded-full" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-line px-4 py-6 text-center text-xs text-muted">
        <p>
          <a className="font-medium text-ink" href="https://www.plandecoder.com/">
            Plan Decoder
          </a>{" "}
          · www.plandecoder.com · Australia · independent NDIS practice tools. Not the NDIA. Not a diagnosis. Not legal
          advice.
        </p>
        <p className="mt-2">
          <Link to="/about" className="text-teal underline-offset-2 hover:underline">
            About
          </Link>
          {" · "}
          <Link to="/navigator" search={{ tab: "walk" }} className="text-teal underline-offset-2 hover:underline">
            Navigator
          </Link>
          {" · "}
          <Link to="/assessment" search={{ tab: "about" }} className="text-teal underline-offset-2 hover:underline">
            Practice assessment
          </Link>
          {" · "}
          <Link to="/rights" className="text-teal underline-offset-2 hover:underline">
            Know your rights
          </Link>
          {" · "}
          <Link to="/articles" className="text-teal underline-offset-2 hover:underline">
            Articles
          </Link>
          {" · "}
          <Link to="/news" className="text-teal underline-offset-2 hover:underline">
            News
          </Link>
          {" · "}
          <Link to="/glossary" className="text-teal underline-offset-2 hover:underline">
            Glossary
          </Link>
          {" · "}
          <Link to="/pricing" className="text-teal underline-offset-2 hover:underline">
            Pricing
          </Link>
        </p>
      </footer>
    </div>
  );
}
