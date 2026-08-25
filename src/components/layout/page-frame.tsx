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
  if (isPending) return <AuthSplash />;
  if (user) return <AppShell>{children}</AppShell>;
  if (isPublicPath(pathname)) return <PublicShell>{children}</PublicShell>;
  return <RedirectToSignIn />;
}
