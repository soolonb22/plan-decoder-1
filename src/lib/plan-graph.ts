import { z } from "zod";
import {
  flattenSections,
  sectionText,
  type PlanSection,
} from "./plan-section-map";

export const PLAN_GRAPH_VERSION = 1 as const;

export const ManagementSchema = z.enum(["self", "plan", "ndia", "mix", "unknown"]);
export const LockSchema = z.enum(["stated", "flexible", "unknown"]);
export const PotSchema = z.enum(["core", "capacity", "capital", "recurring", "unknown"]);
export const ConfidenceSchema = z.enum(["high", "medium", "low"]);

export const PlanLineSchema = z.object({
  pot: PotSchema,
  item: z.string().min(1),
  label: z.string().min(1),
  amount: z.number().nonnegative(),
  amountText: z.string().min(1),
  lock: LockSchema,
  managed: ManagementSchema,
  path: z.string(),
});

export const PlanDatesSchema = z.object({
  raw: z.array(z.string()),
  start: z.string().nullable(),
  end: z.string().nullable(),
});

export const PlanGraphSchema = z.object({
  version: z.literal(PLAN_GRAPH_VERSION),
  source: z.enum(["letter", "sample", "unknown"]),
  fileName: z.string(),
  management: ManagementSchema,
  dates: PlanDatesSchema,
  goals: z.array(z.string()),
  lines: z.array(PlanLineSchema),
  flags: z.array(z.string()),
  confidence: ConfidenceSchema,
  disclaimer: z.string(),
});

export type PlanGraph = z.infer<typeof PlanGraphSchema>;
export type PlanLine = z.infer<typeof PlanLineSchema>;

const DISCLAIMER =
  "Practice reading aid in Plan Decoder. Not the NDIA. The letter and the my NDIS app win if this disagrees.";

type ReadLike = {
  fileName?: string;
  management?: string;
  dates?: string[];
  money?: {
    label: string;
    amount: string;
    lock?: string;
    sectionPath?: string;
    note?: string;
  }[];
  sections?: PlanSection[];
  mapFlags?: string[];
};

function dollarsToNumber(raw: string): number | null {
  const hit = raw.replace(/,/g, "").match(/(\d+(?:\.\d{1,2})?)/);
  if (!hit) return null;
  const n = Number(hit[1]);
  return Number.isFinite(n) ? n : null;
}

function potFrom(path: string, label: string): PlanLine["pot"] {
  const blob = `${path} ${label}`.toLowerCase();
  if (/\brecurring\b|\btransport\b/.test(blob)) return "recurring";
  if (/\bcapital\b|assistive|home mod|vehicle mod/.test(blob)) return "capital";
  if (/\bcapacity\b|improved daily|coordination|recovery coach|finding and keeping/.test(blob)) {
    return "capacity";
  }
  if (/\bcore\b|daily life|daily_living|community|consumables/.test(blob)) return "core";
  return "unknown";
}

function itemFrom(path: string, label: string): string {
  const last = path.split(".").filter(Boolean).pop();
  if (last && last !== "funding" && last !== "core" && last !== "capacity" && last !== "capital" && last !== "recurring") {
    return last;
  }
  const l = label.toLowerCase();
  if (/daily life|daily living/.test(l) && !/improved/.test(l)) return "daily_living";
  if (/community|social/.test(l)) return "community";
  if (/consumable/.test(l)) return "consumables";
  if (/transport/.test(l)) return "transport";
  if (/improved daily/.test(l)) return "idl";
  if (/coordinat/.test(l)) return "coord";
  if (/assistive/.test(l)) return "at";
  return last || "line";
}

function managedFrom(text: string, fallback: PlanGraph["management"]): PlanGraph["management"] {
  const self = /\bself[-\s]?manag/.test(text);
  const plan = /plan[-\s]?manag/.test(text);
  const ndia = /ndia[-\s]?manag|agency[-\s]?manag/.test(text);
  const n = Number(self) + Number(plan) + Number(ndia);
  if (n > 1) return "mix";
  if (self) return "self";
  if (plan) return "plan";
  if (ndia) return "ndia";
  return fallback;
}

function pickDates(raw: string[]): PlanGraph["dates"] {
  const unique = [...new Set(raw.map((d) => d.trim()).filter(Boolean))];
  return {
    raw: unique.slice(0, 8),
    start: unique[0] ?? null,
    end: unique.length > 1 ? unique[1] : null,
  };
}

function goalLines(sections: PlanSection[] | undefined): string[] {
  if (!sections?.length) return [];
  return sectionText(sections, "goals")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 8 && !/^your goals$/i.test(s))
    .slice(0, 12);
}

function confidenceOf(flags: string[], lineCount: number, textHint: number): PlanGraph["confidence"] {
  if (flags.includes("no_funding_heading") || lineCount === 0) return "low";
  if (flags.includes("dollars_in_goals") || flags.includes("no_pot_headings")) return "medium";
  if (lineCount >= 3) return "high";
  if (textHint < 80) return "low";
  return "medium";
}

function sourceOf(fileName: string): PlanGraph["source"] {
  if (/sample|dummy|fixture/i.test(fileName)) return "sample";
  if (fileName.trim()) return "letter";
  return "unknown";
}

export function toPlanGraph(read: ReadLike): PlanGraph {
  const flags = [...(read.mapFlags ?? [])];
  const fallbackMgmt = ManagementSchema.catch("unknown").parse(read.management ?? "unknown");
  const lines: PlanLine[] = [];

  for (const row of read.money ?? []) {
    if (!row.amount || / · | · /.test(row.amount) || row.amount.includes(" · ")) {
      flags.push("unscoped_amount_list");
      continue;
    }
    const amount = dollarsToNumber(row.amount);
    if (amount == null) continue;
    const path = row.sectionPath ?? "";
    const blob = `${row.label}\n${row.note ?? ""}`;
    lines.push({
      pot: potFrom(path, row.label),
      item: itemFrom(path, row.label),
      label: row.label,
      amount,
      amountText: row.amount.startsWith("$") ? row.amount : `$${row.amount}`,
      lock: LockSchema.catch("unknown").parse(row.lock ?? "unknown"),
      managed: managedFrom(blob, fallbackMgmt),
      path,
    });
  }

  const draft = {
    version: PLAN_GRAPH_VERSION,
    source: sourceOf(read.fileName ?? ""),
    fileName: read.fileName || "plan",
    management: fallbackMgmt,
    dates: pickDates(read.dates ?? []),
    goals: goalLines(read.sections),
    lines,
    flags,
    confidence: confidenceOf(flags, lines.length, flattenSections(read.sections ?? []).length),
    disclaimer: DISCLAIMER,
  };

  return PlanGraphSchema.parse(draft);
}

export function parsePlanGraph(value: unknown): PlanGraph | null {
  const parsed = PlanGraphSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function graphOrBuild(read: ReadLike & { graph?: unknown }): PlanGraph {
  return parsePlanGraph(read.graph) ?? toPlanGraph(read);
}
