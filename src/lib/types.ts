import type { A11yPrefs, AssessmentDraft } from "./assessment/types";

export type { A11yPrefs, AssessmentDraft, Respondent } from "./assessment/types";

export type Membership = "free" | "core" | "pro";

export type Role =
  | "participant"
  | "carer"
  | "family"
  | "coordinator"
  | "coach"
  | "clinician"
  | "school"
  | "org";

export type WhodasDomain =
  | "cognition"
  | "mobility"
  | "selfCare"
  | "gettingAlong"
  | "lifeActivities"
  | "participation";

export type Client = {
  id: string;
  name: string;
  preferredName: string;
  pronouns: string;
  ndisNumber: string;
  planStart: string;
  planEnd: string;
  planManagedBy: "self" | "plan" | "ndia" | "mix" | "";
  notes: string;
  createdAt: string;
};

export type EvidenceType =
  | "observation"
  | "carer"
  | "clinical"
  | "school"
  | "letter"
  | "plan"
  | "photo-note"
  | "other";

export type EvidenceItem = {
  id: string;
  clientId: string;
  title: string;
  body: string;
  type: EvidenceType;
  domain: WhodasDomain | "";
  tags: string[];
  date: string;
  source: string;
  createdAt: string;
};

export type LogKind = "carer" | "support" | "diary";

export type LogEntry = {
  id: string;
  clientId: string;
  kind: LogKind;
  date: string;
  whatHappened: string;
  impact: string;
  supportUsed: string;
  whatHelped: string;
  energy: number;
  createdAt: string;
};

export type Flag = {
  id: string;
  clientId: string;
  kind: "green" | "red";
  title: string;
  detail: string;
  date: string;
};

export type Goal = {
  id: string;
  clientId: string;
  title: string;
  why: string;
  supports: string;
  domain: string;
  status: "wish" | "active" | "paused" | "done";
};

export type SavedScript = {
  id: string;
  title: string;
  category: string;
  body: string;
  custom: boolean;
};

export type Report = {
  id: string;
  clientId: string;
  kind: string;
  title: string;
  body: string;
  createdAt: string;
};

export type FluctuationPoint = {
  id: string;
  clientId: string;
  date: string;
  energy: number;
  regulation: number;
  participation: number;
  notes: string;
};

export type BudgetLine = {
  id: string;
  clientId: string;
  category: "core" | "capacity" | "capital" | "recurring";
  name: string;
  allocated: number;
  spent: number;
};

export type ChecklistState = {
  clientId: string;
  key: string;
  done: boolean;
  note: string;
};

export type MeetingPrep = {
  id: string;
  clientId: string;
  title: string;
  date: string;
  purpose: string;
  questions: string;
  talkingPoints: string;
  evidenceIds: string[];
  notes: string;
};

export type AppointmentPrep = {
  id: string;
  clientId: string;
  title: string;
  date: string;
  who: string;
  questions: string;
  sensoryNeeds: string;
  notes: string;
};

export type SchoolNote = {
  id: string;
  clientId: string;
  date: string;
  setting: string;
  whatWorked: string;
  whatWasHard: string;
  sensory: string;
  requestedSupport: string;
};

export type WhodasRecord = {
  id: string;
  clientId: string;
  date: string;
  items: Record<string, number | null>;
  notes: string;
};

export type GuidedDraft = {
  id: string;
  clientId: string;
  flowId: string;
  answers: Record<string, string>;
  output: string;
  createdAt: string;
};

export type AppState = {
  membership: Membership;
  role: Role;
  orgName: string;
  activeClientId: string;
  clients: Client[];
  evidence: EvidenceItem[];
  logs: LogEntry[];
  flags: Flag[];
  goals: Goal[];
  scripts: SavedScript[];
  reports: Report[];
  fluctuations: FluctuationPoint[];
  budgets: BudgetLine[];
  checklist: ChecklistState[];
  meetings: MeetingPrep[];
  appointments: AppointmentPrep[];
  schoolNotes: SchoolNote[];
  whodas: WhodasRecord[];
  drafts: GuidedDraft[];
  lastGuide: string;
  assessments: AssessmentDraft[];
  a11y: A11yPrefs;
  activeAssessmentId: string;
  credits: number;
  subscriptionStatus: string;
};
