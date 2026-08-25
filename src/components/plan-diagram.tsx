import { cn } from "@/lib/utils";
import type { PlanRead } from "@/lib/plan-reader";

const POTS = [
  {
    id: "core",
    name: "Core",
    easy: "Everyday help",
    kids: ["Daily life", "Community", "Consumables"],
    match: /core/i,
    image: "/brand/story-together.jpg",
  },
  {
    id: "capacity",
    name: "Capacity building",
    easy: "Skills over time",
    kids: ["Therapy", "Coordination", "Work / learning"],
    match: /capacity/i,
    image: "/brand/story-tick.jpg",
  },
  {
    id: "capital",
    name: "Capital",
    easy: "Equipment / home",
    kids: ["Assistive tech", "Home mods"],
    match: /capital/i,
    image: "/brand/story-device.jpg",
  },
  {
    id: "recurring",
    name: "Recurring",
    easy: "Regular repeats",
    kids: ["Transport"],
    match: /recurring|transport/i,
    image: "/brand/story-path.jpg",
  },
] as const;

function amountFor(read: PlanRead | undefined, match: RegExp) {
  return read?.money.find((m) => match.test(m.label))?.amount;
}

export function PlanStructureDiagram({
  read,
  compact = false,
}: {
  read?: PlanRead | null;
  compact?: boolean;
}) {
  const pay =
    read?.management === "self"
      ? "You pay, then claim"
      : read?.management === "plan"
        ? "Plan manager pays invoices"
        : read?.management === "ndia"
          ? "NDIA pays registered providers"
          : "Who pays: self / plan manager / NDIA";

  return (
    <figure className="rounded-2xl border border-line bg-card p-4" aria-labelledby="plan-diagram-title">
      <figcaption id="plan-diagram-title" className="text-sm font-semibold">
        How an NDIS plan is built
      </figcaption>
      <p className="mt-1 text-xs text-muted">
        Four money pots. Goals sit above. You cannot pour one pot into another. Who pays sits underneath.
      </p>

      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="w-full max-w-md rounded-xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-fg">
          Your NDIS plan
          {read?.dates?.length ? <span className="mt-1 block text-xs font-normal opacity-90">{read.dates[0]}</span> : null}
        </div>
        <ArrowDown />
        <div className="flex w-full max-w-md items-center gap-3 rounded-xl border border-line bg-primary-soft px-3 py-3">
          <img src="/brand/story-words.jpg" alt="" width={48} height={48} className="size-12 rounded-lg object-cover" />
          <div>
            <p className="text-sm font-medium">Goals — the why</p>
            <p className="text-xs text-muted">Supports should help these, not ordinary living costs.</p>
          </div>
        </div>
        <ArrowDown label="then funding is split" />
      </div>

      <p className="mt-3 text-center text-xs font-medium text-alert">Money does not move between these four pots</p>
      <ul className={cn("mt-2 grid gap-2", compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
        {POTS.map((pot) => {
          const amount = amountFor(read ?? undefined, pot.match);
          const lit = Boolean(amount) || Boolean(read?.pieces.some((p) => p.id === pot.id && p.present));
          return (
            <li
              key={pot.id}
              className={cn(
                "overflow-hidden rounded-xl border",
                lit ? "border-primary bg-primary-soft/40" : "border-line bg-paper-2",
              )}
            >
              <img src={pot.image} alt="" className="h-16 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold">{pot.name}</p>
                <p className="text-xs text-muted">{pot.easy}</p>
                {amount ? <p className="mt-1 text-sm font-medium tabular-nums">{amount}</p> : null}
                <ul className="mt-2 space-y-1 text-xs text-muted">
                  {pot.kids.map((k) => (
                    <li key={k}>· {k}</li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-line px-3 py-3 text-sm">
          <p className="font-medium">Flexible or stated</p>
          <p className="mt-1 text-xs text-muted">
            Flexible: choice inside that pot. Stated: only the named support. Self-managing does not unlock a stated line.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-line px-3 py-3">
          <img src="/brand/story-wallet.jpg" alt="" width={48} height={48} className="size-12 rounded-lg object-cover" />
          <div>
            <p className="text-sm font-medium">{pay}</p>
            <p className="text-xs text-muted">Check this before the first invoice.</p>
          </div>
        </div>
      </div>

      <p className="sr-only">
        An NDIS plan sits on top. Goals sit under the plan. Funding splits into four pots that cannot mix: Core for
        everyday help, Capacity building for skills, Capital for equipment or home changes, and Recurring for regular
        supports like transport. Each support is flexible or stated. Someone pays: you if self-managed, a plan manager,
        or the NDIA.
      </p>
    </figure>
  );
}

function ArrowDown({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center text-primary" aria-hidden>
      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
        <path d="M10 2v20M4 16l6 8 6-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label ? <span className="text-[10px] uppercase tracking-wide text-muted">{label}</span> : null}
    </div>
  );
}
