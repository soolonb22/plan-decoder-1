import type { ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { OllieMark } from "@/components/mark";

export function AuthSplash({ label = "Checking your account…" }: { label?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <OllieMark className="size-12" />
        <p className="font-semibold">Plan Decoder</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <AuthSplash />;
  if (!user) return <RedirectToSignIn />;
  return <>{children}</>;
}
