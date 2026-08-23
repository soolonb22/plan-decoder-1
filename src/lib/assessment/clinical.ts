import { WHODAS_ITEMS, SCALE } from "../whodas";
import { DOMAINS } from "../content/language";
import type { Client } from "../types";
import { formatDate } from "../utils";
import type {
  AnswerVal,
  AssessmentDraft,
  AssessmentScore,
  Respondent,
} from "./types";
import { FREQ_SCALE, INTENSITY_SCALE, NEED_DOMAINS, WHODAS_SCALE } from "./screens";

export const PRACTICE_THRESHOLD = 2;
export const SUPPORT_THRESHOLD = 5.5;

export type ResultRow = {
  id: string;
  title: string;
  raw: number;
  rawMax: number;
  practiceIndex: number;
  aboveThreshold: boolean;
  descriptor: string;
  answered: number;
  elevated: number;
  total: number;
};

export type Endorsed = { text: string; label: string; value: number };

export type NarrativeBlock = {
  id: string;
  title: string;
  rawLine: string;
  above: boolean;
  body: string;
  endorsed: Endorsed[];
};

export type GridRow = {
  n: number;
  id: string;
  prompt: string;
  value: number | null;
  labels: string[];
};

export type GridSection = {
  title: string;
  labels: string[];
  rows: GridRow[];
};

export type ClinicalModel = {
  title: string;
  clientName: string;
  administered: string;
  respondent: string;
  roleLine: string;
  answeredLine: string;
  whodasRows: ResultRow[];
  supportRows: ResultRow[];
  overallWho: ResultRow;
  overallSupport: ResultRow;
  narratives: NarrativeBlock[];
  impairment: string;
  grids: GridSection[];
  extra: { label: string; value: string }[];
};

const RESPONDENT: Record<Respondent, string> = {
  participant: "Participant",
  parent: "Parent",
  carer: "Carer",
  nominee: "Nominee",
  professional: "Professional",
};

const num = (v: AnswerVal) => (typeof v === "number" ? v : null);

function indexFrom4(avg: number) {
  return Math.round((avg / 4) * 100);
}

function indexFrom10(avg: number) {
  return Math.round((avg / 10) * 100);
}

function scaleLabel(value: number, labels: { value: number; label: string }[]) {
  return labels.find((s) => s.value === value)?.label ?? String(value);
}

export function buildClinicalModel(
  draft: AssessmentDraft,
  score: AssessmentScore,
  client?: Client | null,
): ClinicalModel {
  const answers = draft.answers;
  const clientName = client?.preferredName || client?.name || "Not named on this device";

  const whodasRows: ResultRow[] = score.whodas.domains.map((d) => {
    const items = WHODAS_ITEMS.filter((i) => i.domain === d.id);
    const elevated = items.filter((i) => {
      const v = num(answers[i.id]);
      return v !== null && v >= 2;
    }).length;
    const total = items.filter((i) => num(answers[i.id]) !== null).length;
    const raw = d.avg;
    return {
      id: d.id,
      title: d.title,
      raw,
      rawMax: 4,
      practiceIndex: indexFrom4(raw),
      aboveThreshold: d.answered > 0 && raw >= PRACTICE_THRESHOLD,
      descriptor: d.descriptor,
      answered: d.answered,
      elevated,
      total,
    };
  });

  const overallWho: ResultRow = {
    id: "who-total",
    title: "WHODAS-inspired total (average)",
    raw: score.whodas.avgOverall,
    rawMax: 4,
    practiceIndex: score.whodas.simple100,
    aboveThreshold: score.whodas.answered > 0 && score.whodas.avgOverall >= PRACTICE_THRESHOLD,
    descriptor: score.whodas.descriptor,
    answered: score.whodas.answered,
    elevated: WHODAS_ITEMS.filter((i) => {
      const v = num(answers[i.id]);
      return v !== null && v >= 2;
    }).length,
    total: score.whodas.answered,
  };

  const supportRows: ResultRow[] = score.support.domains.map((d) => ({
    id: d.id,
    title: d.title,
    raw: d.support ?? 0,
    rawMax: 10,
    practiceIndex: indexFrom10(d.support ?? 0),
    aboveThreshold: (d.answered ?? 0) > 0 && (d.support ?? 0) >= SUPPORT_THRESHOLD,
    descriptor: d.descriptor,
    answered: d.answered,
    elevated: (d.support ?? 0) >= SUPPORT_THRESHOLD ? 1 : 0,
    total: 1,
  }));

  const overallSupport: ResultRow = {
    id: "support-total",
    title: "Support rehearsal (average intensity)",
    raw: score.support.overall,
    rawMax: 10,
    practiceIndex: indexFrom10(score.support.overall),
    aboveThreshold: score.support.overall >= SUPPORT_THRESHOLD,
    descriptor: score.support.descriptor,
    answered: supportRows.filter((r) => r.answered).length,
    elevated: supportRows.filter((r) => r.aboveThreshold).length,
    total: supportRows.length,
  };

  const narratives: NarrativeBlock[] = whodasRows.map((row) => {
    const items = WHODAS_ITEMS.filter((i) => i.domain === row.id);
    const endorsed: Endorsed[] = items
      .map((i) => {
        const v = num(answers[i.id]);
        if (v === null || v < 2) return null;
        return { text: i.text, label: scaleLabel(v, SCALE), value: v };
      })
      .filter((x): x is Endorsed => Boolean(x))
      .sort((a, b) => b.value - a.value);

    const domainHint = DOMAINS.find((d) => d.id === row.id)?.hint ?? "";
    let body: string;
    if (!row.answered) {
      body = "This domain was not answered in this rehearsal.";
    } else if (row.aboveThreshold) {
      body = `The average on this domain is above Plan Decoder’s practice threshold of ${PRACTICE_THRESHOLD}.0 (Moderate). ${row.elevated} of ${row.total} answered items were rated Moderate or higher. In this rehearsal that is consistent with reduced function in this life area. ${domainHint} This is not a diagnosis and not an official WHODAS score.`;
    } else if (row.practiceIndex >= 50) {
      body = `The practice index sits at mid-scale or above, but the average does not meet the practice threshold of Moderate. That can happen when a few items are high and others are low, or when impact on daily life was not described. A clinician may still want examples. ${domainHint}`;
    } else {
      body = `The average on this domain is below the practice threshold of Moderate. ${row.elevated} of ${row.total} answered items were rated Moderate or higher. Lower ticks can still matter on hard days — this is a snapshot, not a verdict.`;
    }

    return {
      id: row.id,
      title: row.title,
      rawLine: `Average: ${row.raw.toFixed(2)} / 4 · Practice index: ${row.practiceIndex} · ${row.aboveThreshold ? "Above practice threshold" : "Below practice threshold"}`,
      above: row.aboveThreshold,
      body,
      endorsed,
    };
  });

  for (const row of supportRows.filter((r) => r.answered)) {
    const note = String(answers[`need-${row.id}-note`] ?? "");
    const freq = num(answers[`need-${row.id}-freq`]);
    const intensity = num(answers[`need-${row.id}-int`]);
    const bits = [
      freq !== null ? `how often: ${scaleLabel(freq, FREQ_SCALE)}` : null,
      intensity !== null ? `how much help: ${scaleLabel(intensity, INTENSITY_SCALE)}` : null,
    ].filter(Boolean);
    narratives.push({
      id: `need-${row.id}`,
      title: `Support · ${row.title}`,
      rawLine: `Intensity ${row.raw.toFixed(1)} / 10 · Practice index ${row.practiceIndex} · ${row.aboveThreshold ? "Above practice threshold" : "Below practice threshold"}`,
      above: row.aboveThreshold,
      body: row.aboveThreshold
        ? `These ticks describe regular or substantial extra support in ${row.title.toLowerCase()} (${bits.join("; ")}). That is a rehearsal of support need, not an I-CAN score and not hours.`
        : `Support recorded in ${row.title.toLowerCase()} is below Plan Decoder’s practice threshold for “regular support” (${bits.join("; ") || "limited ticks"}).`,
      endorsed: note ? [{ text: note, label: "Example", value: 2 }] : [],
    });
  }

  const reduced = score.ndisFunction.filter(
    (n) => n.level.startsWith("Marked") || n.level.startsWith("Noticeable"),
  );
  const impairment =
    reduced.length > 0
      ? `This rehearsal indicates reduced function in: ${reduced.map((n) => n.title).join(", ")}. Everyday impact is an essential part of any later clinical or access conversation. Plan Decoder is not that conversation.`
      : "This rehearsal did not clearly flag reduced function across the six NDIS access areas. That may mean incomplete answers, a good-day snapshot, or supports that already cover daily life.";

  const whoGrid: GridSection = {
    title: "Function items (WHODAS-inspired 0–4)",
    labels: WHODAS_SCALE.map((s) => s.label),
    rows: WHODAS_ITEMS.map((item, i) => ({
      n: i + 1,
      id: item.id,
      prompt: item.text,
      value: num(answers[item.id]),
      labels: WHODAS_SCALE.map((s) => s.label),
    })).filter((r) => r.value !== null),
  };

  const freqGrid: GridSection = {
    title: "Support rehearsal — how often extra support is needed",
    labels: FREQ_SCALE.map((s) => s.label),
    rows: NEED_DOMAINS.flatMap((d, i) => {
      const freq = num(answers[`need-${d.id}-freq`]);
      if (freq === null) return [];
      return [
        {
          n: i + 1,
          id: `need-${d.id}-freq`,
          prompt: d.title,
          value: freq,
          labels: FREQ_SCALE.map((s) => s.label),
        },
      ];
    }),
  };

  const intensityGrid: GridSection = {
    title: "Support rehearsal — how much help when support is needed",
    labels: INTENSITY_SCALE.map((s) => s.label),
    rows: NEED_DOMAINS.flatMap((d, i) => {
      const intensity = num(answers[`need-${d.id}-int`]);
      if (intensity === null) return [];
      return [
        {
          n: i + 1,
          id: `need-${d.id}-int`,
          prompt: d.title,
          value: intensity,
          labels: INTENSITY_SCALE.map((s) => s.label),
        },
      ];
    }),
  };

  const extra: { label: string; value: string }[] = [];
  const interfere = num(answers["h-interfere"]);
  if (interfere !== null) extra.push({ label: "Overall interference", value: scaleLabel(interfere, SCALE) });
  const daysUnable = num(answers["h-days-unable"]);
  if (daysUnable !== null) extra.push({ label: "Days unable (approx.)", value: `${daysUnable} in last 30` });
  const daysCut = num(answers["h-days-cut"]);
  if (daysCut !== null) extra.push({ label: "Days cut back (approx.)", value: `${daysCut} in last 30` });
  if (score.environment.living) extra.push({ label: "Living situation", value: score.environment.living });
  if (score.environment.informalHours) extra.push({ label: "Informal support hours", value: score.environment.informalHours });
  if (score.environment.ifCarerAway) extra.push({ label: "If informal support is away", value: score.environment.ifCarerAway });

  return {
    title: "Plan Decoder Practice Functional Report",
    clientName,
    administered: formatDate(draft.updatedAt || draft.createdAt),
    respondent: RESPONDENT[draft.respondent] ?? draft.respondent,
    roleLine: `${RESPONDENT[draft.respondent] ?? draft.respondent} completed this rehearsal on this device`,
    answeredLine: `${score.answered} of ${score.totalAsked} asked items answered`,
    whodasRows,
    supportRows,
    overallWho,
    overallSupport,
    narratives,
    impairment,
    grids: [whoGrid, freqGrid, intensityGrid].filter((g) => g.rows.length),
    extra,
  };
}

export function historySeries(drafts: AssessmentDraft[]) {
  return drafts
    .filter((d) => d.status === "complete" && d.score)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((d) => ({
      date: formatDate(d.updatedAt || d.createdAt),
      iso: d.updatedAt || d.createdAt,
      total: d.score!.whodas.avgOverall,
      index: d.score!.whodas.simple100,
      support: d.score!.support.overall,
      domains: Object.fromEntries(d.score!.whodas.domains.map((x) => [x.title, x.avg])),
    }));
}
