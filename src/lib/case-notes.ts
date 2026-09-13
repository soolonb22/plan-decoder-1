/** Independent on-device draft. Not a government system. Not legal advice. */

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export const CASE_NOTE_SYSTEMS = ["Housing", "NDIS", "Providers", "School", "Health", "Centrelink"] as const;
export type SystemName = (typeof CASE_NOTE_SYSTEMS)[number];

export const CASE_NOTES_TITLE = "Plan Decoder · Case notes";
export const CASE_NOTES_TAGLINE =
  "Practise the conversation. Not the government form. Not the NDIA, not official NDIS Navigator, not legal advice.";
export const CASE_NOTES_PLUM = "#6E2C92";
export const CASE_NOTES_STORAGE_KEY = "plan-decoder-case-notes-v1";

export const CASE_NOTES_DISCLAIMER =
  "Plan Decoder is not the NDIA, not an official NDIS Navigator, and not a government system. Case notes are a practice draft you can attach to a Systems walk. They stay on this device. Export is a JSON file for you — not a government filing. This is not legal advice.";

export const SAFETY_LINE =
  "If you are not safe, call 000. This is not legal advice. An advocate or legal aid can sit with you.";

export const EVIDENCE_TYPES = ["document", "email", "photo", "note", "letter"] as const;
export type CaseEvidenceType = (typeof EVIDENCE_TYPES)[number];

export const FORM13_HREF =
  "https://www.rta.qld.gov.au/forms-resources/forms/forms-for-general-tenancies/notice-of-intention-to-leave-form-13";

export type HousingFormFact = {
  form: "Form 11" | "Form 12" | "Form 13";
  meaning: string;
  href?: string;
};

export const HOUSING_FORM_FACTS: HousingFormFact[] = [
  {
    form: "Form 11",
    meaning: "Notice to remedy breach, not an eviction. Do not send it to the RTA.",
  },
  {
    form: "Form 12",
    meaning: "Notice to leave (lessor/agent).",
  },
  {
    form: "Form 13",
    meaning: "Tenant notice of intention to leave.",
    href: FORM13_HREF,
  },
];

export type CaseEvidence = {
  id: string;
  label: string;
  type: CaseEvidenceType;
  description: string;
};

export type CaseDraft = {
  id: string;
  system: SystemName;
  title: string;
  situation: string;
  evidence: CaseEvidence[];
  updatedAt: string;
};

export type CaseNotesStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

export type CaseWalkSearch = {
  system?: SystemName;
  situation?: string;
  note?: string;
};

export function caseSystem(raw?: string): SystemName {
  const key = (raw ?? "").trim().toLowerCase();
  return CASE_NOTE_SYSTEMS.find((name) => name.toLowerCase() === key) ?? "Housing";
}

export function createEmptyDraft(system?: string): CaseDraft {
  return {
    id: uid("case"),
    system: caseSystem(system),
    title: "",
    situation: "",
    evidence: [],
    updatedAt: new Date().toISOString(),
  };
}

export function sanitiseEvidence(raw: Record<string, unknown> | CaseEvidence): CaseEvidence {
  const type = EVIDENCE_TYPES.includes(raw.type as CaseEvidenceType)
    ? (raw.type as CaseEvidenceType)
    : "note";
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : uid("ev"),
    label: String(raw.label ?? "").slice(0, 200),
    type,
    description: String(raw.description ?? "").slice(0, 2000),
  };
}

export function addEvidenceNote(
  draft: CaseDraft,
  input: Partial<CaseEvidence> & Record<string, unknown>,
): CaseDraft {
  return {
    ...draft,
    evidence: [...draft.evidence, sanitiseEvidence({ ...input, id: uid("ev") })],
    updatedAt: new Date().toISOString(),
  };
}

export function removeEvidenceNote(draft: CaseDraft, evidenceId: string): CaseDraft {
  return {
    ...draft,
    evidence: draft.evidence.filter((item) => item.id !== evidenceId),
    updatedAt: new Date().toISOString(),
  };
}

function defaultStorage(): CaseNotesStorage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function sanitiseDraft(raw: unknown): CaseDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const evidence = Array.isArray(row.evidence)
    ? row.evidence
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
        .map((item) => sanitiseEvidence(item))
    : [];
  return {
    id: typeof row.id === "string" && row.id ? row.id : uid("case"),
    system: caseSystem(typeof row.system === "string" ? row.system : ""),
    title: String(row.title ?? "").slice(0, 200),
    situation: String(row.situation ?? "").slice(0, 4000),
    evidence,
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : new Date().toISOString(),
  };
}

export function loadDrafts(storage: CaseNotesStorage | null = defaultStorage()): CaseDraft[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(CASE_NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { drafts?: unknown };
    const rows = Array.isArray(parsed?.drafts) ? parsed.drafts : Array.isArray(parsed) ? parsed : [];
    return rows.map(sanitiseDraft).filter((row): row is CaseDraft => Boolean(row));
  } catch {
    return [];
  }
}

export function saveDrafts(drafts: CaseDraft[], storage: CaseNotesStorage | null = defaultStorage()) {
  if (!storage) return;
  storage.setItem(CASE_NOTES_STORAGE_KEY, JSON.stringify({ version: 1, drafts }));
}

export function getDraft(id: string, storage: CaseNotesStorage | null = defaultStorage()) {
  return loadDrafts(storage).find((row) => row.id === id);
}

export function upsertDraft(draft: CaseDraft, storage: CaseNotesStorage | null = defaultStorage()) {
  const next = sanitiseDraft({ ...draft, updatedAt: new Date().toISOString() });
  if (!next) return draft;
  const rows = loadDrafts(storage);
  const existing = rows.findIndex((row) => row.id === next.id);
  const drafts = existing >= 0 ? rows.map((row) => (row.id === next.id ? next : row)) : [next, ...rows];
  saveDrafts(drafts, storage);
  return next;
}

export function removeDraft(id: string, storage: CaseNotesStorage | null = defaultStorage()) {
  saveDrafts(
    loadDrafts(storage).filter((row) => row.id !== id),
    storage,
  );
}

export function exportDraftJson(draft: CaseDraft) {
  const clean = sanitiseDraft(draft) ?? draft;
  return JSON.stringify(
    {
      kind: "plan-decoder-case-notes",
      version: 1,
      disclaimer:
        "On-device practice draft. Not a government filing. Not the NDIA. Not official NDIS Navigator. Not legal advice.",
      draft: {
        id: clean.id,
        system: clean.system,
        title: clean.title,
        situation: clean.situation,
        evidence: clean.evidence.map((item) => sanitiseEvidence(item)),
        updatedAt: clean.updatedAt,
      },
    },
    null,
    2,
  );
}

export function walkSearchFor(draft: CaseDraft): CaseWalkSearch {
  return { system: draft.system, note: draft.id };
}

export function parseCaseWalkSearch(raw: Record<string, unknown>): CaseWalkSearch {
  const systemRaw = String(raw.system ?? "");
  const system = CASE_NOTE_SYSTEMS.find((name) => name.toLowerCase() === systemRaw.toLowerCase());
  const situation = typeof raw.situation === "string" ? raw.situation.slice(0, 4000) : undefined;
  const note = typeof raw.note === "string" ? raw.note.slice(0, 80) : undefined;
  return {
    ...(system ? { system } : {}),
    ...(situation ? { situation } : {}),
    ...(note ? { note } : {}),
  };
}
