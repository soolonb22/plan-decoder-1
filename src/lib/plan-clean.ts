/**
 * Pure clean-up helpers for the plan reader.
 * No React, no DOM, no relative imports — so they can be unit-tested with plain Node.
 */

/* ------------------------------------------------------------------ */
/* Parser flags → plain-language notes                                 */
/* ------------------------------------------------------------------ */

/**
 * Internal parser flags must never reach the screen raw (bug: "old_three_pot_or_partial").
 * Return a friendly sentence, or null to hide the flag from people.
 */
export function friendlyFlag(flag: string): string | null {
  if (flag === "old_three_pot_or_partial") {
    return "We found Core and Capacity Building but not Capital or Recurring. Your plan may be an older format, or part of the file did not read. Check the funding table in your letter.";
  }
  if (flag === "no_pot_headings") {
    return "We could not see the budget headings clearly. The amounts below may be in the wrong budget — check your letter.";
  }
  if (flag === "dollars_in_goals") {
    return "Some dollar amounts sit inside the goals section. We have left them out of the goals list.";
  }
  // no_funding_heading already has its own message; merged_repeat_heading:* and
  // unscoped_amount_list are internal only.
  return null;
}

export function friendlyWarnings(flags: string[]): string[] {
  return [...new Set(flags.map(friendlyFlag).filter((s): s is string => Boolean(s)))];
}

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const DATE_WORDS = `\\d{1,2}\\s+(?:${MONTHS.join("|")})\\s+\\d{4}`;
const DATE_NUM = `\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}`;
const ANY_DATE = `(${DATE_WORDS}|${DATE_NUM})`;

/** "24 August 2023" or "24/08/2023" → epoch ms (UTC). Null when unreadable. */
export function dateValue(raw: string): number | null {
  const s = raw.trim().toLowerCase();
  const words = s.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (words) {
    const m = MONTHS.indexOf(words[2]);
    if (m < 0) return null;
    return Date.UTC(Number(words[3]), m, Number(words[1]));
  }
  const num = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
  if (num) {
    // Australian order: day/month/year.
    const y = num[3].length === 2 ? 2000 + Number(num[3]) : Number(num[3]);
    return Date.UTC(y, Number(num[2]) - 1, Number(num[1]));
  }
  return null;
}

export type PlanDates = {
  start: string | null;
  /** End or reassessment date. */
  end: string | null;
  /** True when start/end came from labels in the letter, not just date order. */
  labelled: boolean;
  raw: string[];
};

function labelledDate(text: string, label: string): string | null {
  const re = new RegExp(`(?:${label})[^\\n\\d]{0,40}?${ANY_DATE}`, "i");
  return text.match(re)?.[1] ?? null;
}

/**
 * Find the plan start and end/reassessment dates.
 * 1. Prefer labelled dates ("plan start date: …", "reassessment date: …", "12 March 2026 to 11 March 2027").
 * 2. Fall back to the earliest and latest date found, so the range is never backwards.
 */
export function pickPlanDates(text: string, raw: string[]): PlanDates {
  const unique = [...new Set(raw.map((d) => d.trim()).filter(Boolean))];

  const range = text.match(new RegExp(`${ANY_DATE}\\s+(?:to|until|-|–)\\s+${ANY_DATE}`, "i"));
  let start = labelledDate(text, "plan start date|start date|plan starts|plan approved") ?? null;
  let end = labelledDate(text, "reassessment date|plan end date|end date|review date|plan ends|reassess") ?? null;
  if (!start && range) start = range[1];
  if (!end && range) end = range[2];

  if (start || end) {
    // A labelled pair can still be backwards if the labels were misread — guard it.
    const a = start ? dateValue(start) : null;
    const b = end ? dateValue(end) : null;
    if (a != null && b != null && a > b) [start, end] = [end, start];
    return { start, end, labelled: true, raw: unique };
  }

  const dated = unique
    .map((d) => ({ d, v: dateValue(d) }))
    .filter((x): x is { d: string; v: number } => x.v != null)
    .sort((x, y) => x.v - y.v);
  return {
    start: dated[0]?.d ?? null,
    end: dated.length > 1 ? dated[dated.length - 1].d : null,
    labelled: false,
    raw: unique,
  };
}

/* ------------------------------------------------------------------ */
/* Goals                                                               */
/* ------------------------------------------------------------------ */

/** Form labels printed in NDIS plan letters that are not part of a goal. */
const GOAL_LABELS = [
  "this is what i want to achieve",
  "how i will achieve this goal",
  "how i will be supported",
  "short-term goal",
  "short term goal",
  "medium or long-term goal",
  "medium or long term goal",
  "medium to long-term goal",
  "long-term goal",
  "long term goal",
  "medium-term goal",
  "my goals",
  "your goals",
  "goal",
];

function stripLabels(line: string): string {
  let s = line.trim();
  let changed = true;
  while (changed) {
    changed = false;
    for (const label of GOAL_LABELS) {
      const re = new RegExp(`^(?:${label.replace(/[-]/g, "[-\\s]?")})(?:\\s*\\d+)?\\s*[:.\\-–]?\\s*`, "i");
      if (re.test(s)) {
        const next = s.replace(re, "").trim();
        if (next !== s) {
          s = next;
          changed = true;
        }
      }
    }
  }
  return s;
}

const ENDS_SENTENCE = /[.!?:;)"”]$/;

/**
 * Turn the raw goals section into clean goal sentences:
 * - drops form labels ("This is what I want to achieve", "Short-term goal" …)
 * - joins lines that were broken mid-sentence by the PDF ("… with his family" + "and friends.")
 * - drops lines with dollar amounts and boilerplate.
 */
export function cleanGoals(sectionText: string, max = 8): string[] {
  const lines = sectionText
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const joined: string[] = [];
  // Real letters alternate: goal → "How I will achieve this goal" → strategy → "How I will be supported" → supports.
  // Only text under a goal label (or with no labels at all) counts as a goal.
  let skipping = false;
  for (const rawLine of lines) {
    if (/^\s*how i will (achieve|be supported)/i.test(rawLine)) {
      skipping = true;
      if (joined.length) joined[joined.length - 1] += "\u2029";
      continue;
    }
    if (/^\s*(this is what i want|(short|medium|long)[-\s]?(or long[-\s]?)?(to long[-\s]?)?term goal)/i.test(rawLine)) {
      skipping = false;
    }
    if (skipping) continue;
    const line = stripLabels(rawLine);
    if (!line) {
      // A pure label line ends whatever came before it.
      if (joined.length) joined[joined.length - 1] += "\u2029";
      continue;
    }
    const prev = joined[joined.length - 1];
    const prevOpen = prev != null && !prev.endsWith("\u2029") && !ENDS_SENTENCE.test(prev);
    const continues = /^[a-z(,&]/.test(line) || /^(and|or|but|with|to|so)\b/i.test(line);
    if (prev != null && (prevOpen || continues) && !prev.endsWith("\u2029")) {
      joined[joined.length - 1] = `${prev} ${line}`;
    } else {
      joined.push(line);
    }
  }

  const out: string[] = [];
  for (const g of joined.map((s) => s.replace(/\u2029/g, "").trim())) {
    if (g.length < 12) continue;
    if (/\$\s?[\d,]{3,}/.test(g)) continue;
    if (/clinic words are not required|these goals belong to/i.test(g)) continue;
    if (out.some((o) => o.toLowerCase() === g.toLowerCase())) continue;
    out.push(g);
    if (out.length >= max) break;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Plan wording excerpts                                               */
/* ------------------------------------------------------------------ */

/**
 * A short, readable excerpt: whole sentences only, no address blocks, capped length.
 * Used for the collapsed "Show your plan's wording" box.
 */
export function tidyExcerpt(raw: string, max = 260): string {
  const s = raw
    .replace(/\s+/g, " ")
    // Postal boilerplate printed at the top of NDIS letters.
    .replace(/if not delivered[^.]*?\b\d{4}\b/gi, "")
    .replace(/GPO Box \d+[^.]*?\b(?:ACT|NSW|VIC|QLD|SA|WA|TAS|NT)\s+\d{4}/gi, "")
    .trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return lastStop > max * 0.5 ? cut.slice(0, lastStop + 1) : `${cut.replace(/\s+\S*$/, "")}…`;
}

/* ------------------------------------------------------------------ */
/* Goals ↔ supports                                                    */
/* ------------------------------------------------------------------ */

export type SupportRef = { key: string; label: string; pot: string };
export type GoalMatch = { goal: string; supports: SupportRef[] };
export type GoalSupportMap = {
  matches: GoalMatch[];
  /** Goals with no support linked — something to raise with a coordinator or at review. */
  gaps: string[];
  /** Supports no goal points to — a risk at reassessment. */
  orphans: SupportRef[];
};

/** Keyword → support item. Item ids match plan-section-map ids. Rule-based, no AI. */
const GOAL_KEYWORDS: { item: string; re: RegExp }[] = [
  { item: "daily_living", re: /\b(shower|dress|cook|meal|routine|personal care|home|independen|safe|sleep|night|morning)\w*/i },
  { item: "community", re: /\b(community|social|friend|outing|leave the house|go out|join|club|sport|group|activit)\w*/i },
  { item: "transport", re: /\b(travel|transport|bus|train|taxi|drive|get to|getting to)\w*/i },
  { item: "idl", re: /\b(communicat|speech|talk|therapy|therap|skill|behaviour|sensory|motor|swallow|occupational|physio|psycholog)\w*/i },
  { item: "coord", re: /\b(coordinat|organis|organiz|plan|navigate|provider)\w*/i },
  { item: "work", re: /\b(job|work|employ|career|volunteer)\w*/i },
  { item: "learning", re: /\b(school|tafe|study|learn|course|university|uni\b|education)\w*/i },
  { item: "relationships", re: /\b(relationship|family|friend|connect)\w*/i },
  { item: "health", re: /\b(health|wellbeing|exercise|fitness|weight|diet)\w*/i },
  { item: "at", re: /\b(equipment|device|wheelchair|aid|technology|tablet|app)\w*/i },
  { item: "home_mod", re: /\b(ramp|bathroom|rail|modif)\w*/i },
];

/** Broad fall-backs when the plan only shows the budget, not the line item. */
const POT_FALLBACK: Record<string, string[]> = {
  core: ["daily_living", "community", "consumables", "transport"],
  capacity: ["idl", "coord", "work", "learning", "relationships", "health", "life_choices"],
  capital: ["at", "home_mod", "vehicle_mod"],
  recurring: ["transport"],
};

export function matchGoalsToSupports(goals: string[], supports: SupportRef[]): GoalSupportMap {
  const used = new Set<string>();
  const matches: GoalMatch[] = goals.map((goal) => {
    const items = new Set(GOAL_KEYWORDS.filter((k) => k.re.test(goal)).map((k) => k.item));
    const hits = supports.filter(
      (s) => items.has(s.key) || (POT_FALLBACK[s.key] ?? []).some((i) => items.has(i)),
    );
    hits.forEach((h) => used.add(`${h.key}|${h.label}`));
    return { goal, supports: hits };
  });
  return {
    matches,
    gaps: matches.filter((m) => !m.supports.length).map((m) => m.goal),
    orphans: supports.filter((s) => !used.has(`${s.key}|${s.label}`)),
  };
}
