import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "neutral",
  children,
}: {
  className?: string;
  tone?: "neutral" | "primary" | "ok" | "alert" | "warn";
  children: ReactNode;
}) {
  const tones = {
    neutral: "bg-paper-2 text-muted",
    primary: "bg-primary-soft text-primary-deep",
    ok: "bg-ok-soft text-ok",
    alert: "bg-alert-soft text-alert",
    warn: "bg-warn-soft text-warn",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
