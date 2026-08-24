import { useEffect, useState } from "react";
import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { PLANS } from "@/lib/membership";
import { CREDIT_PACKS, CREDIT_PRICE_AUD, MEMBERSHIP_PRICE_AUD } from "@/lib/billing";
import {
  confirmPaid,
  createCheckout,
  saveAccount,
} from "@/lib/billing-sync";
import { useOllie } from "@/lib/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page";
import { CodeWordUnlock } from "@/components/code-word";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/membership")({ component: MembershipPage });

const ROLES: { id: Role; label: string }[] = [
  { id: "participant", label: "Participant" },
  { id: "carer", label: "Carer" },
  { id: "family", label: "Family" },
  { id: "coordinator", label: "Support coordinator" },
  { id: "coach", label: "Recovery coach" },
  { id: "clinician", label: "Clinician" },
  { id: "school", label: "School" },
  { id: "org", label: "Organisation" },
];

function MembershipPage() {
  const membership = useOllie((s) => s.membership);
  const credits = useOllie((s) => s.credits);
  const setBilling = useOllie((s) => s.setBilling);
  const role = useOllie((s) => s.role);
  const setRole = useOllie((s) => s.setRole);
  const orgName = useOllie((s) => s.orgName);
  const setOrgName = useOllie((s) => s.setOrgName);
  const { user } = useCurrentUserState();
  const search = useRouterState({ select: (s) => s.location.searchStr });
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<"core" | "credits:1" | "credits:2" | "credits:5" | null>(null);

  useEffect(() => {
    if (!user) return;
    void saveAccount({ data: { role, orgName } }).catch(() => {});
  }, [user, role, orgName]);

  useEffect(() => {
    const stored = sessionStorage.getItem("plan-decoder-pending-pay");
    if (stored === "core" || stored === "credits:1" || stored === "credits:2" || stored === "credits:5") {
      setPending(stored);
    } else if (stored === "credits") {
      setPending("credits:1");
    }
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (params.get("canceled") === "1") {
      setMessage("Checkout was cancelled. Nothing was charged.");
    }
    if (params.get("paid") !== "1") return;
    const token =
      stored === "core" || stored === "credits:1" || stored === "credits:2" || stored === "credits:5"
        ? stored
        : stored === "credits"
          ? "credits:1"
          : null;
    if (!token) {
      setMessage("If Stripe confirmed payment, tap I’ve paid below.");
      return;
    }
    setMessage("Payment received. Adding it to this account…");
    const kind = token === "core" ? ("core" as const) : ("credits" as const);
    const pack = token === "core" ? undefined : Number(token.split(":")[1]) || 1;
    void confirmPaid({ data: { kind, credits: pack } })
      .then((b) => {
        setBilling(b);
        sessionStorage.removeItem("plan-decoder-pending-pay");
        setPending(null);
        setMessage(
          kind === "core" ? "Core is active on this account." : `${pack} credit${pack === 1 ? "" : "s"} added.`,
        );
      })
      .catch(() => {
        setMessage("If Stripe confirmed payment, tap I’ve paid below.");
      });
  }, [search, setBilling]);

  async function pay(kind: "core" | "pro" | "credits", packCredits?: number) {
    if (kind === "pro") {
      setMessage("Professional is not on this Stripe checkout yet.");
      return;
    }
    const busyKey = kind === "credits" ? `credits-${packCredits ?? 1}` : "core";
    setBusy(busyKey);
    setMessage(null);
    try {
      const res = await createCheckout({
        data: {
          kind,
          credits: packCredits,
          origin: window.location.origin,
          email: user?.primaryEmail ?? undefined,
        },
      });
      if (res.ok && res.url) {
        const token = kind === "core" ? "core" : `credits:${res.credits ?? packCredits ?? 1}`;
        sessionStorage.setItem("plan-decoder-pending-pay", token);
        window.location.href = res.url;
        return;
      }
      setMessage("Could not open Stripe.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not start payment.");
    } finally {
      setBusy(null);
    }
  }

  async function activate(kind: "core" | "credits", packCredits?: number) {
    setBusy(`activate-${kind}-${packCredits ?? 0}`);
    setMessage(null);
    try {
      const b = await confirmPaid({ data: { kind, credits: packCredits } });
      setBilling(b);
      sessionStorage.removeItem("plan-decoder-pending-pay");
      setPending(null);
      setMessage(
        kind === "core"
          ? "Core is active on this account."
          : `${packCredits ?? 1} credit${(packCredits ?? 1) === 1 ? "" : "s"} added.`,
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not activate payment.");
    } finally {
      setBusy(null);
    }
  }

  const seated = membership === "core" || membership === "pro";

  return (
    <div>
      <PageHeader
        title="Membership and credits"
        lede="Core: 3 days free, then $12 a month. Each finished report or polished draft uses 1 credit ($5)."
        picture="/brand/story-path.jpg"
      />

      <Card className="mb-5">
        <p className="text-sm font-medium text-primary">Your account</p>
        <p className="mt-2 text-2xl font-semibold">
          {membership === "pro" ? "Professional" : membership === "core" ? "Core" : "No membership yet"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {credits} credit{credits === 1 ? "" : "s"} · ${CREDIT_PRICE_AUD} per outcome
        </p>
        {message ? <p className="mt-3 text-sm text-primary-deep">{message}</p> : null}
        <p className="mt-3 text-xs text-muted">
          Pay on Stripe. Membership and credits land on this account after Stripe confirms (webhook). Tap refresh if the page still looks old.
        </p>
        {pending ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {pending === "core" ? (
              <Button disabled={Boolean(busy)} onClick={() => void activate("core")}>
                {busy?.startsWith("activate-core") ? "Checking…" : "I’ve paid — refresh Core"}
              </Button>
            ) : (
              <Button
                disabled={Boolean(busy)}
                onClick={() => void activate("credits", Number(pending.split(":")[1]) || 1)}
              >
                {busy?.startsWith("activate-credits")
                  ? "Adding…"
                  : `I’ve paid — add ${pending.split(":")[1]} credit${pending === "credits:1" ? "" : "s"}`}
              </Button>
            )}
          </div>
        ) : seated ? (
          <p className="mt-4 text-xs text-muted">After a credit checkout, this button appears so you can add the pack to this account.</p>
        ) : (
          <p className="mt-4 text-xs text-muted">After the Core checkout, you’ll activate membership here.</p>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {PLANS.filter((p) => p.id !== "free").map((p) => {
          const active = membership === p.id;
          const id = p.id as "core" | "pro";
          return (
            <Card key={p.id} className={active ? "border-primary" : ""}>
              <p className="text-sm text-muted">{p.name}</p>
              <p className="mt-1 text-3xl font-semibold">
                ${MEMBERSHIP_PRICE_AUD[id]}
                <span className="ml-1 text-sm font-normal text-muted">
                  {id === "core" ? "per month after 3-day trial" : "per month"}
                </span>
              </p>
              <p className="mt-2 text-sm text-muted">{p.blurb}</p>
              <ul className="mt-4 space-y-1.5 text-sm">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              {id === "pro" ? (
                <p className="mt-5 text-sm text-muted">Professional Stripe checkout is not on this link yet.</p>
              ) : (
                <Button
                  className="mt-5 w-full"
                  disabled={Boolean(busy) || active}
                  onClick={() => void pay("core")}
                >
                  {active ? "Current plan" : busy === "core" ? "Opening Stripe…" : "Start 3-day trial · then $12 / month"}
                </Button>
              )}
            </Card>
          );
        })}
        <Card>
          <p className="text-sm text-muted">Free tools</p>
          <p className="mt-1 text-3xl font-semibold">$0</p>
          <p className="mt-2 text-sm text-muted">
            Rights, glossary, NDIS news, plan checklist, and starting a rehearsal stay available with an account.
          </p>
        </Card>
      </div>

      <h2 className="mt-8 text-lg font-semibold">Buy credits</h2>
      <p className="mt-1 text-sm text-muted">
        {seated
          ? "Each finished report or polished draft uses 1 credit ($5)."
          : "Pay for Core first, then buy credits to spend on outcomes."}
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {CREDIT_PACKS.map((pack) => (
          <Card key={pack.credits}>
            <p className="font-semibold">{pack.label}</p>
            <p className="mt-1 text-2xl font-semibold">A${pack.aud}</p>
            <p className="text-sm text-muted">${CREDIT_PRICE_AUD} each</p>
            <Button
              className="mt-4 w-full"
              variant="secondary"
              disabled={Boolean(busy) || !seated}
              onClick={() => void pay("credits", pack.credits)}
            >
              {busy === `credits-${pack.credits}` ? "Opening Stripe…" : `Pay A$${pack.aud} on Stripe`}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="mt-8 space-y-3">
        <Field label="How you use Plan Decoder">
          <select
            className="h-11 w-full rounded-lg border border-line bg-card px-3"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
        {role === "org" || role === "school" || role === "coordinator" ? (
          <Field label="Organisation name">
            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          </Field>
        ) : null}
      </Card>

      <Card className="mt-5 space-y-2">
        <p className="text-sm font-medium text-primary">Send people back after Stripe</p>
        <p className="text-sm text-muted">
          In Stripe, open each Payment Link → After payment → Redirect to website. Use your live Plan Decoder address plus <code className="rounded bg-paper-2 px-1">/paid</code>
          (for example <code className="rounded bg-paper-2 px-1">https://your-site/paid</code>).
          Do this on all four links: Core, A$5, A$10, and A$25.
        </p>
        <p className="text-sm text-muted">
          When they land back, credits or Core are added automatically. If Stripe still shows its own receipt, they can return here and tap I’ve paid.
        </p>
      </Card>
      <Card className="mt-5 space-y-3">
        <p className="text-sm font-medium text-primary">Complimentary code</p>
        <p className="text-sm text-muted">
          A gifted word opens membership and a few credits. It is not a payment.
        </p>
        <CodeWordUnlock />
      </Card>
    </div>
  );
}
