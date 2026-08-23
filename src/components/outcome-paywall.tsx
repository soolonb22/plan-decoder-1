import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { CREDIT_PRICE_AUD, OUTCOME_CREDITS, OUTCOME_LABEL, hasPaidSeat, type OutcomeKind, type SubscriptionStatus } from "@/lib/billing";
import { spendCredit } from "@/lib/billing-sync";
import { canAccess } from "@/lib/membership";
import { useOllie } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function useSpendOutcome() {
  const membership = useOllie((s) => s.membership);
  const credits = useOllie((s) => s.credits);
  const status = useOllie((s) => s.subscriptionStatus);
  const setBilling = useOllie((s) => s.setBilling);
  const seated = hasPaidSeat(membership, status as SubscriptionStatus) || canAccess(membership, "core");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function spend(kind: OutcomeKind) {
    setBusy(true);
    setError(null);
    try {
      const res = await spendCredit({ data: { kind } });
      if (!res.ok) {
        setError(res.error);
        setBilling({ credits: res.credits });
        return false;
      }
      setBilling({ credits: res.credits });
      return true;
    } catch {
      setError("Could not use a credit just now. Try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return { seated, credits, busy, error, spend, setError };
}

export function OutcomeUnlock({
  kind,
  title,
  body,
  onUnlock,
}: {
  kind: OutcomeKind;
  title?: string;
  body?: string;
  onUnlock: () => void | Promise<void>;
}) {
  const { seated, credits, busy, error, spend } = useSpendOutcome();
  const name = OUTCOME_LABEL[kind];

  if (!seated) {
    return (
      <Card>
        <p className="text-sm font-medium text-primary">Core membership first</p>
        <h2 className="mt-1 text-xl font-semibold">{title ?? name}</h2>
        <p className="mt-2 text-sm text-muted">
          Core is $12 per month. Then each finished outcome uses 1 credit (${CREDIT_PRICE_AUD}).
        </p>
        <Button className="mt-4" asChild>
          <Link to="/membership">Start Core — $12 / month</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-sm font-medium text-primary">1 credit · ${CREDIT_PRICE_AUD}</p>
      <h2 className="mt-1 text-xl font-semibold">{title ?? name}</h2>
      <p className="mt-2 text-sm text-muted">
        {body ??
          `This finished ${name.toLowerCase()} uses ${OUTCOME_CREDITS} credit ($${CREDIT_PRICE_AUD}). You have ${credits} credit${credits === 1 ? "" : "s"}.`}
      </p>
      {credits >= OUTCOME_CREDITS ? (
        <Button
          className="mt-4"
          disabled={busy}
          onClick={() => {
            void spend(kind).then((ok) => {
              if (ok) void onUnlock();
            });
          }}
        >
          {busy ? "Using credit…" : `Use 1 credit — unlock ${name.toLowerCase()}`}
        </Button>
      ) : (
        <Button className="mt-4" asChild>
          <Link to="/membership">Buy credits — ${CREDIT_PRICE_AUD} each</Link>
        </Button>
      )}
      {error ? <p className="mt-3 text-sm text-alert">{error}</p> : null}
    </Card>
  );
}

export function SpendHint({ children }: { children?: ReactNode }) {
  const credits = useOllie((s) => s.credits);
  return (
    <p className="text-xs text-muted">
      {children ?? `Polishing uses 1 credit ($${CREDIT_PRICE_AUD}).`} You have {credits} left.
    </p>
  );
}
