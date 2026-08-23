import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { confirmPaid } from "@/lib/billing-sync";
import { useOllie } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/paid")({
  component: PaidReturn,
  head: () => ({
    meta: [
      { title: "Payment received · Plan Decoder" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});

function readPending() {
  const stored = sessionStorage.getItem("plan-decoder-pending-pay");
  if (stored === "core") return { kind: "core" as const, credits: undefined };
  const m = /^credits:(\d+)$/.exec(stored || "");
  if (m) return { kind: "credits" as const, credits: Number(m[1]) };
  if (stored === "credits") return { kind: "credits" as const, credits: 1 };
  return null;
}

function PaidReturn() {
  const setBilling = useOllie((s) => s.setBilling);
  const credits = useOllie((s) => s.credits);
  const membership = useOllie((s) => s.membership);
  const [status, setStatus] = useState<"working" | "ok" | "need-tap" | "error">("working");
  const [detail, setDetail] = useState("Adding what you paid for to this account…");

  useEffect(() => {
    const pending = readPending();
    if (!pending) {
      setStatus("need-tap");
      setDetail("We could not see which checkout you just finished. Open Pay & credits and tap I’ve paid.");
      return;
    }
    void confirmPaid({ data: pending })
      .then((b) => {
        setBilling(b);
        sessionStorage.removeItem("plan-decoder-pending-pay");
        setStatus("ok");
        setDetail(
          pending.kind === "core"
            ? "Core is active. You can buy credits and use the tools."
            : `${pending.credits ?? 1} credit${(pending.credits ?? 1) === 1 ? "" : "s"} added.`,
        );
      })
      .catch((err) => {
        setStatus("error");
        setDetail(err instanceof Error ? err.message : "Could not add this payment yet.");
      });
  }, [setBilling]);

  return (
    <div>
      <PageHeader title="Welcome back" lede="Stripe is done. Plan Decoder is updating this account." />
      <Card>
        <p className="text-sm font-medium text-primary">
          {status === "working" ? "Applying payment" : status === "ok" ? "Done" : "Needs a moment"}
        </p>
        <p className="mt-2 text-sm text-muted">{detail}</p>
        {status === "ok" ? (
          <p className="mt-3 text-sm">
            {membership === "core" || membership === "pro" ? "Core is on." : null}{" "}
            You have {credits} credit{credits === 1 ? "" : "s"}.
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/membership">Pay & credits</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/assessment">Practice assessment</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
