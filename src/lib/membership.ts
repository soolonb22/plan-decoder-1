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
      "Know Your Rights",
      "Glossary",
      "NDIS News",
      "Practice assessment intro + WHODAS-inspired snapshot",
      "One local rehearsal save, with instant delete",
      "Basic support diary (up to 10 entries)",
      "Plan understanding checklist",
      "Guided navigation (intro)",
    ],
  },
  {
    id: "core" as const,
    name: "Core",
    price: "$12",
    cadence: "per month after 3-day trial",
    blurb: "Evidence, language, meeting prep, and the full practice assessment — kept on this device.",
    features: [
      "Full practice pack (36-item function, 12 life areas, permanency, mainstream)",
      "Core tools unlocked",
      "Finished reports and polished drafts use 1 credit each ($5)",
      "Unlimited local assessment saves",
      "Evidence Wallet",
      "Functional language builder",
      "Impact statements",
      "Advocacy scripts",
      "Fluctuation patterns",
      "Carer impact log",
      "Meeting and appointment prep",
      "Goals and budget helper",
    ],
  },
  {
    id: "pro" as const,
    name: "Professional",
    price: "$49",
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
  price: "$5",
  cadence: "1 credit per outcome",
  blurb: "Questions are free once you have Core. Each finished practice report or polished Core draft uses 1 credit ($5).",
  features: [
    "Full clinical-style practice report for this rehearsal",
    "Results table, plots, interpretation, and answer grid",
    "PDF download for a GP or allied health appointment",
    "Stays on this device — delete anytime",
  ],
};

export function canViewFullReport(_have: Membership, draftUnlocked?: boolean) {
  return Boolean(draftUnlocked);
}
