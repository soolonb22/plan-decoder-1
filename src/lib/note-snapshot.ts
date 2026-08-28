import type { AppState } from "./types";

export const SYNC_KEYS = [
  "role",
  "orgName",
  "activeClientId",
  "clients",
  "evidence",
  "logs",
  "flags",
  "goals",
  "scripts",
  "reports",
  "fluctuations",
  "budgets",
  "checklist",
  "meetings",
  "appointments",
  "schoolNotes",
  "claims",
  "providers",
  "navigatorPlaces",
  "navigatorGoals",
  "whodas",
  "drafts",
  "lastGuide",
  "planRead",
  "assessments",
  "a11y",
  "activeAssessmentId",
] as const;

export type NoteSnapshot = Pick<AppState, (typeof SYNC_KEYS)[number]>;

export function takeSnapshot(state: AppState): NoteSnapshot {
  const out = {} as NoteSnapshot;
  for (const key of SYNC_KEYS) {
    (out as Record<string, unknown>)[key] = state[key];
  }
  return out;
}
