export type Role = "participant" | "nominee" | "family" | "coordinator" | "";
export type WorkerKind =
  | "support-worker"
  | "allied-health"
  | "coordinator"
  | "plan-manager"
  | "household"
  | "transport"
  | "other"
  | "";
export type YesNo = "yes" | "no" | "not-sure" | "";
export type PlanStyle = "agency" | "plan" | "self" | "mix" | "not-sure" | "";
export type PriceUnit = "hour" | "visit" | "week" | "other" | "";
export type PayHow = "agency" | "plan-manager" | "self-claim" | "not-sure" | "";

export type HireDraft = {
  role: Role;
  personName: string;
  nomineeName: string;
  ndisNumber: string;
  providerName: string;
  providerAbn: string;
  workerKind: WorkerKind;
  workerKindOther: string;
  registered: YesNo;
  planStyle: PlanStyle;
  tasks: string;
  where: string;
  howOften: string;
  startDate: string;
  endDate: string;
  goals: string;
  quotedPrice: string;
  priceUnit: PriceUnit;
  travel: string;
  gst: YesNo;
  payHow: PayHow;
  cancelNotice: string;
  providerCancel: string;
  endNotice: string;
  shareWhat: string;
  complaintsContact: string;
  checks: Record<string, boolean>;
};

export const CHECKS: { id: string; label: string }[] = [
  { id: "registered", label: "I asked whether they are NDIS registered" },
  { id: "abn", label: "I asked for their ABN" },
  { id: "screening", label: "I asked about an NDIS Worker Screening Check" },
  { id: "insurance", label: "I asked what insurance they hold" },
  { id: "price", label: "I asked for the price in writing, and whether it is at or under the current price limit" },
  { id: "cancel", label: "I asked what happens if I cancel, and if they cancel" },
  { id: "end", label: "I asked how I can end the agreement, and how much notice" },
  { id: "complaint", label: "I asked how to complain, including to the NDIS Commission" },
  { id: "conflict", label: "I asked whether they benefit if I choose another service they own" },
  { id: "time", label: "I have time to read this before I sign. I was not pressured to sign today" },
  { id: "copy", label: "I will get a copy of the agreement and of reports written about me" },
];

export const EMPTY_DRAFT: HireDraft = {
  role: "",
  personName: "",
  nomineeName: "",
  ndisNumber: "",
  providerName: "",
  providerAbn: "",
  workerKind: "",
  workerKindOther: "",
  registered: "",
  planStyle: "",
  tasks: "",
  where: "",
  howOften: "",
  startDate: "",
  endDate: "",
  goals: "",
  quotedPrice: "",
  priceUnit: "",
  travel: "",
  gst: "",
  payHow: "",
  cancelNotice: "",
  providerCancel: "",
  endNotice: "",
  shareWhat: "",
  complaintsContact: "",
  checks: {},
};

const STORAGE_KEY = "pd-hire-draft-v1";

export function loadDraft(): HireDraft {
  if (typeof localStorage === "undefined") return EMPTY_DRAFT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DRAFT;
    const parsed = JSON.parse(raw) as Partial<HireDraft>;
    return {
      ...EMPTY_DRAFT,
      ...parsed,
      checks: { ...EMPTY_DRAFT.checks, ...(parsed.checks ?? {}) },
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

export function saveDraft(draft: HireDraft) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  localStorage.removeItem(STORAGE_KEY);
}

export const ROLE_LABEL: Record<Exclude<Role, "">, string> = {
  participant: "I am the participant",
  nominee: "I am a nominee",
  family: "I am family or a carer",
  coordinator: "I am helping someone prepare (coordinator or other supporter)",
};

export const KIND_LABEL: Record<Exclude<WorkerKind, "">, string> = {
  "support-worker": "Support worker",
  "allied-health": "Allied health professional",
  coordinator: "Support coordinator",
  "plan-manager": "Plan manager",
  household: "Household tasks",
  transport: "Transport",
  other: "Other professional",
};

export const PLAN_LABEL: Record<Exclude<PlanStyle, "">, string> = {
  agency: "Agency-managed",
  plan: "Plan-managed",
  self: "Self-managed",
  mix: "A mix",
  "not-sure": "Not sure yet",
};

export const PAY_LABEL: Record<Exclude<PayHow, "">, string> = {
  agency: "The NDIA pays the provider (agency-managed)",
  "plan-manager": "A plan manager pays the invoice",
  "self-claim": "I pay, then claim it back",
  "not-sure": "Not sure yet",
};

export const UNIT_LABEL: Record<Exclude<PriceUnit, "">, string> = {
  hour: "per hour",
  visit: "per visit",
  week: "per week",
  other: "as quoted",
};

export function blank(value: string, hint: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : `[${hint}]`;
}

export function kindLabel(draft: HireDraft) {
  if (!draft.workerKind) return "[type of professional]";
  if (draft.workerKind === "other") return blank(draft.workerKindOther, "type of professional");
  return KIND_LABEL[draft.workerKind];
}
