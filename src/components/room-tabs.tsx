import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function RoomTabs({
  to,
  tab,
  items,
  label,
}: {
  to: "/words" | "/prep" | "/plan" | "/wallet" | "/assessment";
  tab: string;
  items: { id: string; label: string }[];
  label: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label={label}>
      {items.map((t) => (
        <Link
          key={t.id}
          to={to}
          search={{ tab: t.id }}
          role="tab"
          aria-selected={tab === t.id}
          className={cn(
            "inline-flex min-h-11 items-center rounded-full border px-3 text-sm",
            tab === t.id ? "border-primary bg-primary-soft" : "border-line bg-card",
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
