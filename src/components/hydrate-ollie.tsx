import { useEffect } from "react";
import { getBilling } from "@/lib/billing-sync";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useOllie } from "@/lib/store";

export function HydrateOllie() {
  useEffect(() => {
    void useOllie.persist.rehydrate();
  }, []);
  return (
    <>
      <A11ySync />
      <BillingHydrate />
    </>
  );
}

function A11ySync() {
  const a11y = useOllie((s) => s.a11y);
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.fontScale = a11y?.fontScale ?? "md";
    el.dataset.easyRead = a11y?.easyRead ? "on" : "off";
  }, [a11y]);
  return null;
}

function BillingHydrate() {
  const { user, isPending } = useCurrentUserState();
  const setBilling = useOllie((s) => s.setBilling);
  useEffect(() => {
    if (isPending || !user) return;
    void getBilling()
      .then((b) => {
        setBilling({
          membership: b.membership,
          credits: b.credits,
          subscriptionStatus: b.subscriptionStatus,
        });
      })
      .catch(() => {
        /* stay with local copy */
      });
  }, [user, isPending, setBilling]);
  return null;
}
