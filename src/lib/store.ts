import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useMemo } from "react";
import { todayISO, uid } from "./utils";
import type {
  AppointmentPrep,
  AppState,
  BudgetLine,
  ChecklistState,
  Client,
  EvidenceItem,
  Flag,
  FluctuationPoint,
  Goal,
  GuidedDraft,
  LogEntry,
  MeetingPrep,
  Membership,
  Report,
  Role,
  SavedScript,
  SchoolNote,
  WhodasRecord,
  A11yPrefs,
  AssessmentDraft,
} from "./types";
import { makeSampleAssessment } from "./assessment/sample";
import type { PlanRead } from "./plan-reader";

const DEFAULT_CLIENT_ID = "self";

function defaultClient(): Client {
  return {
    id: DEFAULT_CLIENT_ID,
    name: "Me",
    preferredName: "",
    pronouns: "",
    ndisNumber: "",
    planStart: "",
    planEnd: "",
    planManagedBy: "",
    notes: "",
    createdAt: new Date().toISOString(),
  };
}

const initial: AppState = {
  membership: "free",
  role: "participant",
  orgName: "",
  activeClientId: DEFAULT_CLIENT_ID,
  clients: [defaultClient()],
  evidence: [],
  logs: [],
  flags: [],
  goals: [],
  scripts: [],
  reports: [],
  fluctuations: [],
  budgets: [],
  checklist: [],
  meetings: [],
  appointments: [],
  schoolNotes: [],
  whodas: [],
  drafts: [],
  lastGuide: "",
  planRead: null,
  assessments: [],
  a11y: { fontScale: "md", easyRead: false, hide3d: false },
  activeAssessmentId: "",
  credits: 0,
  subscriptionStatus: "none",
};

type Actions = {
  setMembership: (m: Membership) => void;
  setBilling: (p: { membership?: Membership; credits?: number; subscriptionStatus?: string }) => void;
  setRole: (r: Role) => void;
  setOrgName: (n: string) => void;
  setActiveClient: (id: string) => void;
  upsertClient: (c: Partial<Client> & { id?: string }) => string;
  removeClient: (id: string) => void;
  addEvidence: (e: Omit<EvidenceItem, "id" | "createdAt" | "clientId"> & { clientId?: string }) => string;
  updateEvidence: (id: string, patch: Partial<EvidenceItem>) => void;
  removeEvidence: (id: string) => void;
  addLog: (e: Omit<LogEntry, "id" | "createdAt" | "clientId"> & { clientId?: string }) => string;
  removeLog: (id: string) => void;
  addFlag: (e: Omit<Flag, "id" | "clientId"> & { clientId?: string }) => string;
  removeFlag: (id: string) => void;
  addGoal: (e: Omit<Goal, "id" | "clientId"> & { clientId?: string }) => string;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  addScript: (e: Omit<SavedScript, "id">) => string;
  removeScript: (id: string) => void;
  addReport: (e: Omit<Report, "id" | "createdAt" | "clientId"> & { clientId?: string }) => string;
  removeReport: (id: string) => void;
  addFluctuation: (e: Omit<FluctuationPoint, "id" | "clientId"> & { clientId?: string }) => string;
  removeFluctuation: (id: string) => void;
  upsertBudget: (e: Omit<BudgetLine, "id" | "clientId"> & { id?: string; clientId?: string }) => string;
  removeBudget: (id: string) => void;
  setChecklist: (key: string, done: boolean, note?: string) => void;
  upsertMeeting: (e: Partial<MeetingPrep> & { id?: string }) => string;
  removeMeeting: (id: string) => void;
  upsertAppointment: (e: Partial<AppointmentPrep> & { id?: string }) => string;
  removeAppointment: (id: string) => void;
  addSchoolNote: (e: Omit<SchoolNote, "id" | "clientId"> & { clientId?: string }) => string;
  removeSchoolNote: (id: string) => void;
  saveWhodas: (e: Omit<WhodasRecord, "id" | "clientId"> & { clientId?: string }) => string;
  saveDraft: (e: Omit<GuidedDraft, "id" | "createdAt" | "clientId"> & { clientId?: string }) => string;
  upsertAssessment: (e: Partial<AssessmentDraft> & { id?: string }) => string;
  removeAssessment: (id: string) => void;
  purgeAllAssessments: () => void;
  setA11y: (p: Partial<A11yPrefs>) => void;
  setActiveAssessment: (id: string) => void;
  loadSample: () => void;
  resetAll: () => void;
  setPlanRead: (p: PlanRead | null) => void;
};

function withClient<T extends { clientId?: string }>(state: AppState, item: T) {
  return { ...item, clientId: item.clientId || state.activeClientId };
}

export const useOllie = create<AppState & Actions>()(
  persist(
    (set, get) => ({
      ...initial,
      setMembership: (membership) => set({ membership }),
      setBilling: (p) =>
        set((s) => ({
          membership: p.membership ?? s.membership,
          credits: p.credits ?? s.credits,
          subscriptionStatus: p.subscriptionStatus ?? s.subscriptionStatus,
        })),
      setRole: (role) => set({ role }),
      setOrgName: (orgName) => set({ orgName }),
      setActiveClient: (activeClientId) => set({ activeClientId }),
      upsertClient: (c) => {
        const id = c.id ?? uid("client");
        set((s) => {
          const next = s.clients.some((x) => x.id === id)
            ? s.clients.map((x) => (x.id === id ? { ...x, ...c, id } : x))
            : [
                ...s.clients,
                {
                  ...defaultClient(),
                  ...c,
                  id,
                  createdAt: new Date().toISOString(),
                },
              ];
          return { clients: next, activeClientId: id };
        });
        return id;
      },
      removeClient: (id) =>
        set((s) => {
          if (id === DEFAULT_CLIENT_ID) return s;
          const clients = s.clients.filter((c) => c.id !== id);
          return {
            clients,
            activeClientId:
              s.activeClientId === id ? DEFAULT_CLIENT_ID : s.activeClientId,
          };
        }),
      addEvidence: (e) => {
        const id = uid("ev");
        set((s) => ({
          evidence: [
            {
              ...withClient(s, e),
              id,
              createdAt: new Date().toISOString(),
              tags: e.tags ?? [],
            },
            ...s.evidence,
          ],
        }));
        return id;
      },
      updateEvidence: (id, patch) =>
        set((s) => ({
          evidence: s.evidence.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      removeEvidence: (id) =>
        set((s) => ({ evidence: s.evidence.filter((x) => x.id !== id) })),
      addLog: (e) => {
        const id = uid("log");
        set((s) => ({
          logs: [
            { ...withClient(s, e), id, createdAt: new Date().toISOString() },
            ...s.logs,
          ],
        }));
        return id;
      },
      removeLog: (id) => set((s) => ({ logs: s.logs.filter((x) => x.id !== id) })),
      addFlag: (e) => {
        const id = uid("flag");
        set((s) => ({ flags: [{ ...withClient(s, e), id }, ...s.flags] }));
        return id;
      },
      removeFlag: (id) => set((s) => ({ flags: s.flags.filter((x) => x.id !== id) })),
      addGoal: (e) => {
        const id = uid("goal");
        set((s) => ({ goals: [{ ...withClient(s, e), id }, ...s.goals] }));
        return id;
      },
      updateGoal: (id, patch) =>
        set((s) => ({
          goals: s.goals.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      removeGoal: (id) => set((s) => ({ goals: s.goals.filter((x) => x.id !== id) })),
      addScript: (e) => {
        const id = uid("script");
        set((s) => ({ scripts: [{ ...withClient(s, e), id }, ...s.scripts] }));
        return id;
      },
      removeScript: (id) =>
        set((s) => ({ scripts: s.scripts.filter((x) => x.id !== id) })),
      addReport: (e) => {
        const id = uid("rep");
        set((s) => ({
          reports: [
            { ...withClient(s, e), id, createdAt: new Date().toISOString() },
            ...s.reports,
          ],
        }));
        return id;
      },
      removeReport: (id) =>
        set((s) => ({ reports: s.reports.filter((x) => x.id !== id) })),
      addFluctuation: (e) => {
        const id = uid("fl");
        set((s) => ({
          fluctuations: [{ ...withClient(s, e), id }, ...s.fluctuations],
        }));
        return id;
      },
      removeFluctuation: (id) =>
        set((s) => ({ fluctuations: s.fluctuations.filter((x) => x.id !== id) })),
      upsertBudget: (e) => {
        const id = e.id ?? uid("bud");
        set((s) => {
          const row = { ...withClient(s, e), id };
          const exists = s.budgets.some((x) => x.id === id);
          return {
            budgets: exists
              ? s.budgets.map((x) => (x.id === id ? { ...x, ...row } : x))
              : [row, ...s.budgets],
          };
        });
        return id;
      },
      removeBudget: (id) =>
        set((s) => ({ budgets: s.budgets.filter((x) => x.id !== id) })),
      setChecklist: (key, done, note = "") =>
        set((s) => {
          const clientId = s.activeClientId;
          const exists = s.checklist.some((x) => x.clientId === clientId && x.key === key);
          const row: ChecklistState = { clientId, key, done, note };
          return {
            checklist: exists
              ? s.checklist.map((x) =>
                  x.clientId === clientId && x.key === key ? row : x,
                )
              : [...s.checklist, row],
          };
        }),
      upsertMeeting: (e) => {
        const id = e.id ?? uid("meet");
        set((s) => {
          const row: MeetingPrep = {
            id,
            clientId: e.clientId || s.activeClientId,
            title: e.title || "Planning meeting",
            date: e.date || todayISO(),
            purpose: e.purpose || "",
            questions: e.questions || "",
            talkingPoints: e.talkingPoints || "",
            evidenceIds: e.evidenceIds || [],
            notes: e.notes || "",
          };
          const exists = s.meetings.some((x) => x.id === id);
          return {
            meetings: exists
              ? s.meetings.map((x) => (x.id === id ? { ...x, ...row } : x))
              : [row, ...s.meetings],
          };
        });
        return id;
      },
      removeMeeting: (id) =>
        set((s) => ({ meetings: s.meetings.filter((x) => x.id !== id) })),
      upsertAppointment: (e) => {
        const id = e.id ?? uid("appt");
        set((s) => {
          const row: AppointmentPrep = {
            id,
            clientId: e.clientId || s.activeClientId,
            title: e.title || "Appointment",
            date: e.date || todayISO(),
            who: e.who || "",
            questions: e.questions || "",
            sensoryNeeds: e.sensoryNeeds || "",
            notes: e.notes || "",
          };
          const exists = s.appointments.some((x) => x.id === id);
          return {
            appointments: exists
              ? s.appointments.map((x) => (x.id === id ? { ...x, ...row } : x))
              : [row, ...s.appointments],
          };
        });
        return id;
      },
      removeAppointment: (id) =>
        set((s) => ({ appointments: s.appointments.filter((x) => x.id !== id) })),
      addSchoolNote: (e) => {
        const id = uid("sch");
        set((s) => ({
          schoolNotes: [{ ...withClient(s, e), id }, ...s.schoolNotes],
        }));
        return id;
      },
      removeSchoolNote: (id) =>
        set((s) => ({ schoolNotes: s.schoolNotes.filter((x) => x.id !== id) })),
      saveWhodas: (e) => {
        const id = uid("who");
        set((s) => ({
          whodas: [{ ...withClient(s, e), id }, ...s.whodas],
        }));
        return id;
      },
      saveDraft: (e) => {
        const id = uid("draft");
        set((s) => ({
          drafts: [
            { ...withClient(s, e), id, createdAt: new Date().toISOString() },
            ...s.drafts,
          ],
        }));
        return id;
      },
      upsertAssessment: (e) => {
        const id = e.id ?? uid("assess");
        const now = new Date().toISOString();
        set((s) => {
          const existing = s.assessments.find((x) => x.id === id);
          const row: AssessmentDraft = {
            id,
            clientId: e.clientId || s.activeClientId,
            createdAt: existing?.createdAt || now,
            updatedAt: now,
            stepId: e.stepId ?? existing?.stepId ?? "welcome",
            respondent: e.respondent ?? existing?.respondent ?? "participant",
            answers: e.answers ?? existing?.answers ?? {},
            status: e.status ?? existing?.status ?? "in-progress",
            reportLocal: e.reportLocal ?? existing?.reportLocal ?? "",
            reportAi: e.reportAi ?? existing?.reportAi ?? "",
            score: e.score === undefined ? existing?.score ?? null : e.score,
            unlocked: e.unlocked ?? existing?.unlocked ?? false,
          };
          const assessments = existing
            ? s.assessments.map((x) => (x.id === id ? row : x))
            : [row, ...s.assessments];
          return { assessments, activeAssessmentId: id };
        });
        return id;
      },
      removeAssessment: (id) =>
        set((s) => ({
          assessments: s.assessments.filter((x) => x.id !== id),
          activeAssessmentId: s.activeAssessmentId === id ? "" : s.activeAssessmentId,
        })),
      purgeAllAssessments: () => set({ assessments: [], activeAssessmentId: "" }),
      setA11y: (p) => set((s) => ({ a11y: { ...s.a11y, ...p } })),
      setActiveAssessment: (id) => set({ activeAssessmentId: id }),
      loadSample: () => {
        const clientId = uid("client");
        const now = todayISO();
        const sampleAssess = makeSampleAssessment(clientId);
        set((s) => ({
          membership: s.membership === "free" ? "pro" : s.membership,
          role: "coordinator",
          activeClientId: clientId,
          clients: [
            ...s.clients,
            {
              id: clientId,
              name: "Alex Chen",
              preferredName: "Alex",
              pronouns: "they/them",
              ndisNumber: "430 000 000",
              planStart: "2025-11-01",
              planEnd: "2026-10-31",
              planManagedBy: "plan",
              notes: "Sample participant for exploring Plan Decoder. Fictional.",
              createdAt: new Date().toISOString(),
            },
          ],
          evidence: [
            {
              id: uid("ev"),
              clientId,
              title: "Morning routine needs two-person support",
              body: "Without a known support worker, Alex cannot complete dressing, medication prompts, or leaving the house. On three observed mornings this week, the routine took 90–120 minutes with one worker and was abandoned twice without support.",
              type: "observation",
              domain: "selfCare",
              tags: ["self-care", "morning", "support worker"],
              date: now,
              source: "Carer observation",
              createdAt: new Date().toISOString(),
            },
            {
              id: uid("ev"),
              clientId,
              title: "Community access after shutdown",
              body: "After a busy supermarket trip, Alex experienced a 48-hour shutdown: no spoken language, skipped meals, and could not attend TAFE. This has happened 4 times in 8 weeks.",
              type: "carer",
              domain: "participation",
              tags: ["shutdown", "community", "recovery"],
              date: now,
              source: "Carer impact log",
              createdAt: new Date().toISOString(),
            },
          ],
          logs: [
            {
              id: uid("log"),
              clientId,
              kind: "carer",
              date: now,
              whatHappened: "Overnight waking at 2am. Could not settle without a person in the room.",
              impact: "Carer slept 3 hours. Could not work the next day. Alex missed community access.",
              supportUsed: "Informal overnight support (unpaid).",
              whatHelped: "Dim lighting, weighted blanket, familiar playlist, one calm person nearby.",
              energy: 2,
              createdAt: new Date().toISOString(),
            },
          ],
          flags: [
            {
              id: uid("flag"),
              clientId,
              kind: "green",
              title: "Predictable visual timetable",
              detail: "When the day is shown as pictures the night before, transitions are calmer.",
              date: now,
            },
            {
              id: uid("flag"),
              clientId,
              kind: "red",
              title: "Unfamiliar workers without handover",
              detail: "New staff without a written profile led to refusal of personal care and a 2-day recovery.",
              date: now,
            },
          ],
          goals: [
            {
              id: uid("goal"),
              clientId,
              title: "Leave the house three days a week",
              why: "To attend TAFE and do one independent shop with support nearby.",
              supports: "Support worker (1:1), travel training, OT for sensory plan.",
              domain: "participation",
              status: "active",
            },
          ],
          fluctuations: [
            { id: uid("fl"), clientId, date: offset(-6), energy: 3, regulation: 3, participation: 2, notes: "Quiet week." },
            { id: uid("fl"), clientId, date: offset(-5), energy: 2, regulation: 2, participation: 1, notes: "After supermarket." },
            { id: uid("fl"), clientId, date: offset(-4), energy: 1, regulation: 1, participation: 1, notes: "Shutdown day." },
            { id: uid("fl"), clientId, date: offset(-3), energy: 2, regulation: 2, participation: 1, notes: "Recovering." },
            { id: uid("fl"), clientId, date: offset(-2), energy: 3, regulation: 3, participation: 3, notes: "Known worker." },
            { id: uid("fl"), clientId, date: offset(-1), energy: 4, regulation: 4, participation: 3, notes: "TAFE attended." },
            { id: uid("fl"), clientId, date: now, energy: 3, regulation: 3, participation: 2, notes: "Average day." },
          ],
          budgets: [
            { id: uid("bud"), clientId, category: "core", name: "Daily living", allocated: 42000, spent: 18600 },
            { id: uid("bud"), clientId, category: "core", name: "Community access", allocated: 18000, spent: 6400 },
            { id: uid("bud"), clientId, category: "capacity", name: "Improved daily living (OT / psychology)", allocated: 12000, spent: 4100 },
            { id: uid("bud"), clientId, category: "capacity", name: "Support coordination", allocated: 6200, spent: 2100 },
            { id: uid("bud"), clientId, category: "capital", name: "Assistive technology", allocated: 3500, spent: 0 },
          ],
          assessments: [...s.assessments, sampleAssess],
          activeAssessmentId: sampleAssess.id,
        }));
      },
      resetAll: () => set({ ...initial, clients: [defaultClient()] }),
      setPlanRead: (planRead) => set({ planRead }),
    }),
    {
      name: "ollie-ndis-v1",
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...p,
          assessments: p.assessments ?? [],
          a11y: { ...current.a11y, ...(p.a11y ?? {}) },
          activeAssessmentId: p.activeAssessmentId ?? "",
          credits: p.credits ?? current.credits ?? 0,
          subscriptionStatus: p.subscriptionStatus ?? current.subscriptionStatus ?? "none",
          planRead: p.planRead ?? current.planRead ?? null,
        };
      },
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
    },
  ),
);

function offset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function useActiveClient() {
  return useOllie((s) => s.clients.find((c) => c.id === s.activeClientId) ?? s.clients[0]);
}

type ClientListKey = {
  [K in keyof AppState]: AppState[K] extends { clientId?: string }[] ? K : never;
}[keyof AppState];

export function useClientList<K extends ClientListKey>(key: K): AppState[K] {
  const id = useOllie((s) => s.activeClientId);
  const rows = useOllie((s) => s[key]);
  return useMemo(
    () => (rows as { clientId?: string }[]).filter((r) => r.clientId === id) as AppState[K],
    [id, rows],
  );
}

export { DEFAULT_CLIENT_ID };
