import { CORE_TRIAL_DAYS, CREDIT_PRICE_AUD, MEMBERSHIP_PRICE_AUD } from "./billing";
import type { Membership } from "./types";

export const MEMBERSHIP_RANK: Record<Membership, number> = {
  free: 0,
  core: 1,
  pro: 2,
};

export function canAccess(have: Membership, need: Membership) {
  return MEMBERSHIP_RANK[have] >= MEMBERSHIP_RANK[need];
}

/** Preview-only words. Payments are not taken in this build. */
export const ACCESS_CODES: Record<string, Membership> = {
  clarity: "core",
  confidence: "pro",
  "clarity creates confidence": "pro",
};

export function normaliseCode(raw: string) {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

export function redeemCode(raw: string): Membership | null {
  const key = normaliseCode(raw);
  return ACCESS_CODES[key] ?? null;
}

export const PLANS = [
  {
    id: "free" as const,
    name: "Free",
    price: "$0",
    cadence: "always",
    blurb: "Rights, language you can trust, and a calm place to start.",
    features: [
      "Glossary",
      "NDIS News",
      "See what the practice assessment covers",
      "Basic support diary (up to 10 entries)",
      "Plan understanding checklist",
      "Guided navigation (intro)",
      "Know Your Rights Module 0 preview",
    ],
  },
  {
    id: "core" as const,
    name: "Core",
    price: `$${MEMBERSHIP_PRICE_AUD.core}`,
    cadence: `per month after ${CORE_TRIAL_DAYS}-day trial`,
    blurb: "Evidence, language, meeting prep, and the full practice assessment — kept on this device.",
    features: [
      "Full practice pack (36-item function, 12 life areas, permanency, mainstream)",
      "Core tools unlocked",
      `Finished reports and polished drafts use 1 credit each ($${CREDIT_PRICE_AUD})`,
      "Unlimited local assessment saves",
      "Evidence Wallet",
      "Functional language builder",
      "Impact statements",
      "Full Know Your Rights course, Easy Read, and certificate",
      "Fluctuation patterns",
      "Carer impact log",
      "Meeting and appointment prep",
      "Goals and budget helper",
    ],
  },
  {
    id: "pro" as const,
    name: "Professional",
    price: `$${MEMBERSHIP_PRICE_AUD.pro}`,
    cadence: "per month",
    blurb: "For coordinators, coaches, clinicians, and schools.",
    features: [
      "Everything in Core",
      "Multi-client practice assessments",
      "Professional evidence vault",
      "Exportable reports and covering letters",
      "Clinical language builder",
      "School collaboration notes",
      "Behaviour and sensory frameworks",
      "Priority support pathway",
    ],
  },
];

export const ONE_OFF = {
  id: "report",
  name: "Practice report",
  price: `$${CREDIT_PRICE_AUD}`,
  cadence: "1 credit per outcome",
  blurb: `Questions are included with Core. Each finished practice report uses 1 credit ($${CREDIT_PRICE_AUD}).`,
  features: [
    "Full clinical-style practice report for this rehearsal",
    "Results table, plots, interpretation, and answer grid",
    "PDF download for a GP or allied health appointment",
    "Stays on this device — delete anytime",
  ],
};

export function canViewFullReport(have: Membership, draftUnlocked?: boolean) {
  return canAccess(have, "core") && Boolean(draftUnlocked);
}
