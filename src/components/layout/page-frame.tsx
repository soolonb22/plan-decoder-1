import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { isPublicPath } from "@/lib/public-paths";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { AppShell } from "./app-shell";
import { PublicShell } from "./public-shell";
import { AuthSplash } from "./auth-gate";

export function PageFrame({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const authScreen = pathname === "/login" || pathname === "/reset-password";

  if (authScreen) return <>{children}</>;
  // Public pages must render immediately — Googlebot indexes the first HTML,
  // and an auth splash would be the whole page in Search.
  if (isPublicPath(pathname)) {
    if (user) return <AppShell>{children}</AppShell>;
    return <PublicShell>{children}</PublicShell>;
  }
  if (isPending) return <AuthSplash />;
  if (user) return <AppShell>{children}</AppShell>;
  return <RedirectToSignIn />;
}
