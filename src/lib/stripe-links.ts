/** Live Stripe Payment Links (AUD). */

import { CREDIT_PACKS } from "./billing";

export const STRIPE_PAYMENT_LINKS = {
  core: "https://buy.stripe.com/bJe28s6Gx6c3djVaRQ4Ni0P",
  credits: CREDIT_PACKS[0].link,
} as const;

export type PaidLinkKind = "core" | "credits";

export function creditPack(credits?: number) {
  return CREDIT_PACKS.find((p) => p.credits === credits) ?? CREDIT_PACKS[0];
}

export function stripePaymentUrl(
  kind: PaidLinkKind,
  opts: { userId: string; email?: string | null; credits?: number },
) {
  const base = kind === "core" ? STRIPE_PAYMENT_LINKS.core : creditPack(opts.credits).link;
  const url = new URL(base);
  url.searchParams.set("client_reference_id", opts.userId);
  if (opts.email) url.searchParams.set("prefilled_email", opts.email);
  return url.toString();
}
