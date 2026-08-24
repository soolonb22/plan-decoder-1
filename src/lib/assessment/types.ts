export type Respondent =
  | "participant"
  | "parent"
  | "carer"
  | "nominee"
  | "professional";

export type AnswerVal = string | number | string[] | null;

export type A11yPrefs = {
  fontScale: "md" | "lg" | "xl";
  easyRead: boolean;
  hide3d: boolean;
};

export type ScaleKind = "whodas" | "freq" | "intensity" | "days" | "interfere";

export type Field = {
  id: string;
  type: "scale" | "choice" | "multi" | "text";
  prompt: string;
  easy?: string;
  hint?: string;
  optional?: boolean;
  scale?: ScaleKind;
  options?: { value: string; label: string }[];
  rows?: number;
};

export type Screen = {
  id: string;
  module: string;
  title: string;
  lede: string;
  ollie: string;
  fields: Field[];
  need: "free" | "core" | "pro";
  youtube?: { id: string; title: string; credit: string };
};

export type NeedDomainId =
  | "mobility"
  | "domestic"
  | "selfCare"
  | "community"
  | "communication"
  | "learning"
  | "generalTasks"
  | "lifelong"
  | "relationships"
  | "behaviour"
  | "mental"
  | "physical";

export type DomainScore = {
  id: string;
  title: string;
  avg: number;
  descriptor: string;
  answered: number;
  support?: number;
};

export type Gap = {
  severity: "info" | "watch" | "important";
  title: string;
  detail: string;
};

export type Inconsistency = {
  title: string;
  detail: string;
};

export type EligibilityBand = "few" | "mixed" | "many";

export type FundingBand = {
  id: string;
  label: string;
  range: string;
  note: string;
};

export type SupportIdea = {
  area: string;
  ideas: string[];
  caveat: string;
};

export type AssessmentScore = {
  whodas: {
    avgOverall: number;
    descriptor: string;
    simple100: number;
    answered: number;
    domains: DomainScore[];
  };
  support: {
    overall: number;
    descriptor: string;
    domains: DomainScore[];
  };
  ndisFunction: {
    id: string;
    title: string;
    level: string;
    score: number;
  }[];
  permanency: {
    indicators: string[];
    cautions: string[];
  };
  environment: {
    informalHours: string;
    living: string;
    location: string;
    ifCarerAway: string;
  };
  eligibilityBand: EligibilityBand;
  eligibilityWhy: string[];
  funding: FundingBand;
  supports: SupportIdea[];
  gaps: Gap[];
  inconsistencies: Inconsistency[];
  answered: number;
  totalAsked: number;
};

export type AssessmentDraft = {
  id: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  stepId: string;
  respondent: Respondent;
  answers: Record<string, AnswerVal>;
  status: "in-progress" | "complete";
  reportLocal: string;
  reportAi: string;
  score: AssessmentScore | null;
  unlocked?: boolean;
};

export type ChatTurn = { role: "user" | "assistant"; content: string };
