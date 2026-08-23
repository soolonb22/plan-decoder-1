import type { Membership } from "./types";

export const MEMBERSHIP_PRICE_AUD = {
  core: 12,
  pro: 49,
} as const;

/** One finished outcome (report, polished draft, PDF pack) costs this many credits. */
export const OUTCOME_CREDITS = 1;
export const CREDIT_PRICE_AUD = 5;

export const CREDIT_PACKS = [
  {
    credits: 1,
    aud: 5,
    label: "1 outcome",
    link: "https://buy.stripe.com/28EfZigh79ofa7JcZY4Ni0O",
  },
  {
    credits: 2,
    aud: 10,
    label: "2 outcomes",
    link: "https://buy.stripe.com/6oU5kE5Ct1VNfs3aRQ4Ni0R",
  },
  {
    credits: 5,
    aud: 25,
    label: "5 outcomes",
    link: "https://buy.stripe.com/00w8wQ1mdgQH3Jl7FE4Ni0Q",
  },
] as const;

export type OutcomeKind =
  | "practice_report"
  | "language_draft"
  | "impact_statement"
  | "advocacy_script"
  | "meeting_brief"
  | "appointment_brief"
  | "clinical_draft"
  | "covering_letter"
  | "guided_letter";

export const OUTCOME_LABEL: Record<OutcomeKind, string> = {
  practice_report: "Practice report",
  language_draft: "Functional language draft",
  impact_statement: "Impact statement",
  advocacy_script: "Advocacy script",
  meeting_brief: "Meeting brief",
  appointment_brief: "Appointment brief",
  clinical_draft: "Clinical language draft",
  covering_letter: "Covering letter",
  guided_letter: "Guided letter",
};

export type SubscriptionStatus = "none" | "active" | "canceled" | "preview" | "complimentary";

export type BillingSnapshot = {
  membership: Membership;
  credits: number;
  subscriptionStatus: SubscriptionStatus;
  stripeConfigured: boolean;
};

export function hasPaidSeat(membership: Membership, status: SubscriptionStatus) {
  if (membership === "core" || membership === "pro") return true;
  return status === "active" || status === "preview" || status === "complimentary";
}
