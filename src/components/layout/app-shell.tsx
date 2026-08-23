import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  ClipboardList,
  Compass,
  FolderOpen,
  HeartHandshake,
  Activity,
  Flag,
  NotebookPen,
  CalendarDays,
  UsersRound,
  Brain,
  MessageSquare,
  FileText,
  PiggyBank,
  Target,
  ListChecks,
  Scale,
  BookMarked,
  Newspaper,
  UserRound,
  Files,
  Stethoscope,
  School,
  Cog,
  BadgeCheck,
  Shield,
  Orbit,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { GROUPS, NAV } from "@/lib/nav";
import { canAccess } from "@/lib/membership";
import { useOllie, useActiveClient } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OllieMark } from "@/components/mark";

const NAV_ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "/assessment": ClipboardList,
  "/guide": Compass,
  "/companion": Orbit,
  "/wallet": FolderOpen,
  "/carer": HeartHandshake,
  "/fluctuation": Activity,
  "/flags": Flag,
  "/diary": NotebookPen,
  "/appointment": CalendarDays,
  "/meeting": UsersRound,
  "/function": Brain,
  "/language": MessageSquare,
  "/impact": FileText,
  "/scripts": FileText,
  "/budget": PiggyBank,
  "/goals": Target,
  "/checklist": ListChecks,
  "/rights": Scale,
  "/glossary": BookMarked,
  "/news": Newspaper,
  "/clients": UserRound,
  "/reports": Files,
  "/clinical": Stethoscope,
  "/school": School,
  "/ops": Cog,
  "/membership": BadgeCheck,
  "/privacy": Shield,
};

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  const [signingOut, setSigningOut] = useState(false);
  if (isPending) {
    return <div className="size-9 animate-pulse rounded-full bg-paper-2" />;
  }
  if (!user) return null;
  const label = user.displayName ?? user.primaryEmail ?? "Account";
  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-36 truncate text-sm sm:inline">{label}</span>
      <Button
        size="sm"
        variant="secondary"
        disabled={signingOut}
        onClick={() => {
          setSigningOut(true);
          void signOut("/login").catch(() => setSigningOut(false));
        }}
      >
        {signingOut ? "Signing out…" : "Sign out"}
      </Button>
    </div>
  );
}

function NavList({ onGo }: { onGo?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const membership = useOllie((s) => s.membership);
  return (
    <nav className="space-y-5" aria-label="Main">
      {GROUPS.map((group) => {
        const items = NAV.filter((i) => i.group === group);
        return (
          <div key={group}>
            <p className="px-3 text-xs font-semibold uppercase tracking-widest text-subtle">
              {group}
            </p>
            <ul className="mt-1.5 space-y-0.5">
              {items.map((item) => {
                const active = pathname === item.to;
                const locked = !canAccess(membership, item.need);
                const Icon = NAV_ICONS[item.to];
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onGo}
                      className={cn(
                        "flex min-h-10 items-center justify-between gap-2 rounded-lg px-3 text-sm",
                        active
                          ? "bg-primary text-primary-fg"
                          : "text-ink hover:bg-primary-soft",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {Icon ? <Icon className="size-4 shrink-0 opacity-80" aria-hidden /> : null}
                        <span className="truncate">{item.label}</span>
                      </span>
                      {locked ? (
                        <span className={cn("text-[10px] uppercase tracking-wide", active ? "text-lavender" : "text-subtle")}>
                          {item.need}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const client = useActiveClient();
  const clients = useOllie((s) => s.clients);
  const setActive = useOllie((s) => s.setActiveClient);
  const membership = useOllie((s) => s.membership);
  const credits = useOllie((s) => s.credits);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh">
        <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 flex-col border-r border-line bg-card lg:flex">
          <div className="flex items-center gap-2.5 px-4 py-4">
            <OllieMark className="size-10" />
            <div>
              <p className="font-semibold leading-tight">Plan Decoder</p>
              <p className="text-xs text-muted">Clarity creates confidence.</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-6">
            <NavList />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-card/90 px-3 backdrop-blur-sm sm:px-5">
            <button
              type="button"
              className="grid size-11 place-items-center rounded-lg hover:bg-primary-soft lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="hidden items-center gap-2 sm:flex lg:hidden">
                <OllieMark className="size-8" />
                <span className="font-semibold">Plan Decoder</span>
              </div>
              {clients.length > 1 ? (
                <label className="relative min-w-0">
                  <span className="sr-only">Active person</span>
                  <select
                    className="h-10 max-w-48 appearance-none rounded-lg border border-line bg-card py-1 pl-3 pr-8 text-sm"
                    value={client?.id}
                    onChange={(e) => setActive(e.target.value)}
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.preferredName || c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted" />
                </label>
              ) : (
                <p className="truncate text-sm text-muted">
                  {client?.preferredName || client?.name || "Your space"}
                </p>
              )}
            </div>
            <span className="hidden rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary-deep sm:inline">
              {membership === "pro" ? "Professional" : membership === "core" ? "Core" : "Free"}
              {membership !== "free" ? ` · ${credits} cr` : ""}
            </span>
            <AuthSlot />
          </header>

          {open ? (
            <div className="fixed inset-0 z-40 lg:hidden">
              <button
                type="button"
                className="absolute inset-0 bg-primary-deep/30"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              />
              <div className="absolute inset-y-0 left-0 w-80 overflow-y-auto bg-card p-3 shadow-[var(--shadow-card)]">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <OllieMark className="size-8" />
                    <span className="font-semibold">Plan Decoder</span>
                  </div>
                  <button
                    type="button"
                    className="grid size-11 place-items-center rounded-lg"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <NavList onGo={() => setOpen(false)} />
              </div>
            </div>
          ) : null}

          <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
