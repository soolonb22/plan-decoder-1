import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { redeemCode } from "@/lib/membership";
import {
  CREDIT_PACKS,
  CREDIT_PRICE_AUD,
  OUTCOME_CREDITS,
  type BillingSnapshot,
  type OutcomeKind,
  type SubscriptionStatus,
} from "@/lib/billing";
import type { Membership } from "@/lib/types";
import {
  stripeConfigured,
  stripeGet,
  type StripeSession,
} from "@/lib/stripe-server";
import { creditPack, stripePaymentUrl, type PaidLinkKind } from "@/lib/stripe-links";

type ProfileRow = {
  membership: string;
  credits: number | string;
  subscription_status: string;
};

function snap(row: ProfileRow | undefined): Omit<BillingSnapshot, "stripeConfigured"> {
  return {
    membership: (row?.membership as Membership) || "free",
    credits: Number(row?.credits ?? 0),
    subscriptionStatus: (row?.subscription_status as SubscriptionStatus) || "none",
  };
}

async function ensureProfile(userId: string) {
  const sql = await getSql();
  await sql`
    insert into profiles (user_id, role, membership, credits, subscription_status)
    values (${userId}, 'participant', 'free', 0, 'none')
    on conflict (user_id) do nothing
  `;
}

async function readProfile(userId: string) {
  const sql = await getSql();
  const rows = await sql<ProfileRow>`
    select membership, credits, subscription_status from profiles where user_id = ${userId}
  `;
  return rows[0];
}

async function fulfillSession(userId: string, session: StripeSession) {
  const kind = session.metadata?.kind || (session.mode === "subscription" ? "core" : "credits");
  const sql = await getSql();
  const sessionId = session.id;
  const already = await sql<{ id: number }>`
    select id from credit_ledger where stripe_session_id = ${sessionId} limit 1
  `;
  if (already.length) return;

  if (kind === "core" || kind === "pro") {
    await sql`
      update profiles
      set membership = ${kind},
          subscription_status = 'active',
          stripe_customer_id = ${session.customer ?? null},
          stripe_subscription_id = ${session.subscription ?? null},
          updated_at = now()
      where user_id = ${userId}
    `;
    await sql`
      insert into credit_ledger (user_id, delta, reason, stripe_session_id)
      values (${userId}, 0, ${`membership:${kind}`}, ${sessionId})
    `;
    return;
  }

  if (kind === "credits") {
    const n = Math.max(1, Math.min(50, Number(session.metadata?.credits || 1)));
    await sql`
      insert into credit_ledger (user_id, delta, reason, stripe_session_id)
      values (${userId}, ${n}, 'purchase', ${sessionId})
    `;
    await sql`
      update profiles
      set credits = credits + ${n}, updated_at = now()
      where user_id = ${userId}
    `;
  }
}

export const getBilling = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<BillingSnapshot> => {
    await ensureProfile(context.userId);
    const row = await readProfile(context.userId);
    return { ...snap(row), stripeConfigured: stripeConfigured() };
  });

export const saveAccount = createServerFn({ method: "POST" })
  .validator((input: { role: string; orgName: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(context.userId);
    await sql`
      update profiles
      set role = ${data.role}, org_name = ${data.orgName}, updated_at = now()
      where user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const createCheckout = createServerFn({ method: "POST" })
  .validator((input: { kind: "core" | "pro" | "credits"; credits?: number; origin: string; email?: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await ensureProfile(context.userId);
    if (data.kind === "pro") {
      throw new Error("Professional checkout is not on this Stripe link yet.");
    }
    if (data.kind === "credits") {
      const seat = await readProfile(context.userId);
      if (seat?.membership !== "core" && seat?.membership !== "pro") {
        throw new Error("Pay for Core ($12 / month) before buying credits.");
      }
    }
    const kind: PaidLinkKind = data.kind === "credits" ? "credits" : "core";
    const pack = creditPack(data.credits);
    const url = stripePaymentUrl(kind, {
      userId: context.userId,
      email: data.email,
      credits: pack.credits,
    });
    const pendingKey = kind === "credits" ? `pending:credits:${pack.credits}` : "pending:core";
    const sql = await getSql();
    await sql`
      insert into credit_ledger (user_id, delta, reason, outcome_kind)
      values (${context.userId}, 0, ${pendingKey}, ${kind === "credits" ? `credits:${pack.credits}` : "core"})
    `;
    return { ok: true as const, preview: false as const, url, credits: pack.credits };
  });

export const confirmPaid = createServerFn({ method: "POST" })
  .validator((input: { kind: "core" | "credits"; credits?: number }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<BillingSnapshot> => {
    await ensureProfile(context.userId);
    // Never grant membership/credits from a client tap. Stripe webhooks
    // (and confirmCheckout with a session id) write entitlements.
    const row = await readProfile(context.userId);
    return { ...snap(row), stripeConfigured: stripeConfigured() };
  });

export const confirmCheckout = createServerFn({ method: "POST" })
  .validator((input: { sessionId: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<BillingSnapshot> => {
    await ensureProfile(context.userId);
    if (!stripeConfigured()) {
      const row = await readProfile(context.userId);
      return { ...snap(row), stripeConfigured: false };
    }
    const session = await stripeGet<StripeSession>(
      `/checkout/sessions/${encodeURIComponent(data.sessionId)}`,
    );
    const owner = session.client_reference_id || session.metadata?.userId;
    if (owner !== context.userId) throw new Error("That payment belongs to another account.");
    if (session.status === "complete" || session.payment_status === "paid") {
      await fulfillSession(context.userId, session);
    }
    const row = await readProfile(context.userId);
    return { ...snap(row), stripeConfigured: true };
  });

export const previewPurchase = createServerFn({ method: "POST" })
  .validator((input: { kind: "core" | "pro" | "credits"; credits?: number }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<BillingSnapshot> => {
    if (stripeConfigured()) {
      throw new Error("Live payments are on. Use checkout instead of preview purchase.");
    }
    await ensureProfile(context.userId);
    if (data.kind === "credits") {
      const seat = await readProfile(context.userId);
      if (seat?.membership !== "core" && seat?.membership !== "pro") {
        throw new Error("Pay for Core ($12 / month) before buying credits.");
      }
    }
    const sql = await getSql();
    if (data.kind === "credits") {
      const pack = CREDIT_PACKS.find((p) => p.credits === data.credits) ?? CREDIT_PACKS[0];
      await sql`
        update profiles set credits = credits + ${pack.credits}, updated_at = now()
        where user_id = ${context.userId}
      `;
      await sql`
        insert into credit_ledger (user_id, delta, reason)
        values (${context.userId}, ${pack.credits}, 'preview-purchase')
      `;
    } else {
      await sql`
        update profiles
        set membership = ${data.kind},
            subscription_status = 'preview',
            updated_at = now()
        where user_id = ${context.userId}
      `;
      await sql`
        insert into credit_ledger (user_id, delta, reason)
        values (${context.userId}, 0, ${`preview-membership:${data.kind}`})
      `;
    }
    const row = await readProfile(context.userId);
    return { ...snap(row), stripeConfigured: false };
  });

export const redeemComplimentary = createServerFn({ method: "POST" })
  .validator((input: { code: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<BillingSnapshot> => {
    const next = redeemCode(data.code);
    if (!next || next === "free") throw new Error("That word isn’t recognised.");
    await ensureProfile(context.userId);
    const bonus = next === "pro" ? 10 : 3;
    const sql = await getSql();
    await sql`
      update profiles
      set membership = ${next},
          subscription_status = 'complimentary',
          credits = credits + ${bonus},
          updated_at = now()
      where user_id = ${context.userId}
    `;
    await sql`
      insert into credit_ledger (user_id, delta, reason)
      values (${context.userId}, ${bonus}, ${`code:${next}`})
    `;
    const row = await readProfile(context.userId);
    return { ...snap(row), stripeConfigured: stripeConfigured() };
  });

export const spendCredit = createServerFn({ method: "POST" })
  .validator((input: { kind: OutcomeKind }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    await ensureProfile(context.userId);
    const row = await readProfile(context.userId);
    const membership = (row?.membership as Membership) || "free";
    const status = (row?.subscription_status as SubscriptionStatus) || "none";
    if (membership === "free" && status === "none") {
      return { ok: false as const, error: "Core membership ($12 / month) is needed first.", credits: Number(row?.credits ?? 0) };
    }
    const sql = await getSql();
    const updated = await sql<{ credits: number | string }>`
      update profiles
      set credits = credits - ${OUTCOME_CREDITS}, updated_at = now()
      where user_id = ${context.userId} and credits >= ${OUTCOME_CREDITS}
      returning credits
    `;
    if (!updated[0]) {
      return {
        ok: false as const,
        error: `This outcome uses ${OUTCOME_CREDITS} credit ($${CREDIT_PRICE_AUD}). Buy credits first.`,
        credits: Number(row?.credits ?? 0),
      };
    }
    await sql`
      insert into credit_ledger (user_id, delta, reason, outcome_kind)
      values (${context.userId}, ${-OUTCOME_CREDITS}, 'spend', ${data.kind})
    `;
    return { ok: true as const, credits: Number(updated[0].credits) };
  });
