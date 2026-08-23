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
        if (event.type !== "checkout.session.completed") {
          return new Response("ok", { status: 200 });
        }
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        if (!userId) return new Response("ok", { status: 200 });
        const sql = await getSql();
        const already = await sql<{ id: number }>`
          select id from credit_ledger where stripe_session_id = ${session.id} limit 1
        `;
        if (already.length) return new Response("ok", { status: 200 });
        const kind =
          session.metadata?.kind ||
          (session.mode === "subscription" ? "core" : "credits");
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
            values (${userId}, 0, ${`membership:${kind}`}, ${session.id})
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
