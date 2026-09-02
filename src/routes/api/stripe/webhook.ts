import { createHmac, timingSafeEqual } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { stripeSecret, type StripeSession } from "@/lib/stripe-server";

function verify(raw: string, header: string, secret: string) {
  const parts = Object.fromEntries(
    header.split(",").map((bit) => {
      const i = bit.indexOf("=");
      return [bit.slice(0, i), bit.slice(i + 1)];
    }),
  );
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
  try {
    const a = Buffer.from(v1, "hex");
    const b = Buffer.from(expected, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function sessionEmail(session: StripeSession) {
  return (session.customer_details?.email || session.customer_email || "").trim().toLowerCase();
}

function sessionKind(session: StripeSession) {
  if (session.metadata?.kind) return session.metadata.kind;
  if (session.amount_total === 3900) return "prep-pack";
  if (session.mode === "subscription") return "core";
  return "credits";
}

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
        const key = stripeSecret();
        if (!secret || !key) {
          return new Response("webhooks not configured", { status: 503 });
        }
        const raw = await request.text();
        const sig = request.headers.get("stripe-signature") || "";
        if (!verify(raw, sig, secret)) {
          return new Response("invalid signature", { status: 400 });
        }
        const event = JSON.parse(raw) as { type: string; data: { object: StripeSession } };
        if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
          return new Response("ok", { status: 200 });
        }
        const session = event.data.object;
        const sql = await getSql();
        let userId = session.client_reference_id || session.metadata?.userId || "";
        if (!userId) {
          const email = sessionEmail(session);
          if (email) {
            const rows = await sql<{ id: string }>`
              select id from "user" where lower(email) = ${email} limit 1
            `;
            userId = rows[0]?.id || "";
          }
        }
        if (!userId) return new Response("ok", { status: 200 });
        const already = await sql<{ id: number }>`
          select id from credit_ledger where stripe_session_id = ${session.id} limit 1
        `;
        if (already.length) return new Response("ok", { status: 200 });
        const kind = sessionKind(session);
        if (kind === "core" || kind === "pro" || kind === "prep-pack") {
          const membership = kind === "pro" ? "pro" : "core";
          await sql`
            insert into profiles (user_id, role, membership, credits, subscription_status)
            values (${userId}, 'participant', ${membership}, 0, 'active')
            on conflict (user_id) do update
            set membership = ${membership},
                subscription_status = 'active',
                stripe_customer_id = ${session.customer ?? null},
                stripe_subscription_id = ${session.subscription ?? null},
                updated_at = now()
          `;
          await sql`
            insert into credit_ledger (user_id, delta, reason, stripe_session_id)
            values (${userId}, 0, ${kind === "prep-pack" ? "membership:prep-pack" : `membership:${membership}`}, ${session.id})
          `;
        } else if (kind === "credits") {
          const n = Math.max(
            1,
            Math.min(
              50,
              Number(session.metadata?.credits || 0) ||
                (session.amount_total === 2500 ? 5 : session.amount_total === 1000 ? 2 : 1),
            ),
          );
          await sql`
            insert into credit_ledger (user_id, delta, reason, stripe_session_id)
            values (${userId}, ${n}, 'purchase', ${session.id})
          `;
          await sql`
            update profiles set credits = credits + ${n}, updated_at = now()
            where user_id = ${userId}
          `;
        }
        return new Response("ok", { status: 200 });
      },
    },
  },
});
