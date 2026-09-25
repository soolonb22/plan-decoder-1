/** Cut a plan letter into nested heading buckets before money or catalog logic. */

export type SectionLevel = 0 | 1 | 2 | 3;

export type PlanSection = {
  id: string;
  path: string;
  level: SectionLevel;
  heading: string;
  startLine: number;
  endLine: number;
  text: string;
  children: PlanSection[];
};

export type SectionMap = {
  sections: PlanSection[];
  flags: string[];
  lineCount: number;
};

type HeadingRule = {
  id: string;
  level: 1 | 2 | 3;
  re: RegExp;
};

const NOT_HEADING =
  /this is a (stated|flexible) support|^\$\s?[\d,]|available balance|amount spent/i;

const HEADINGS: HeadingRule[] = [
  { id: "who", level: 1, re: /^(this plan is for|about you|participant details|your name)\b/i },
  { id: "dates", level: 1, re: /^(plan period|plan dates|plan start|start date|end date|duration of your plan)\b/i },
  { id: "management", level: 1, re: /^(how your plan is managed|plan managed by|management of your plan)\b/i },
  { id: "goals", level: 1, re: /^(your goals|my goals|what i want)\b/i },
  { id: "funding", level: 1, re: /^(your funding|funded supports|funding in your plan|your funded supports)\b/i },
  { id: "review", level: 1, re: /^(scheduled review|reassessment|next review|plan review)\b/i },
  { id: "core", level: 2, re: /^core supports?\b/i },
  { id: "capacity", level: 2, re: /^capacity building\b/i },
  { id: "capital", level: 2, re: /^capital supports?\b/i },
  { id: "recurring", level: 2, re: /^recurring supports?\b/i },
  { id: "daily_living", level: 3, re: /^(assistance with daily life|daily living)\b/i },
  { id: "community", level: 3, re: /^(assistance with social|social and community participation)\b/i },
  { id: "consumables", level: 3, re: /^consumables\b/i },
  { id: "transport", level: 3, re: /^(transport|assistance with travel)\b/i },
  { id: "idl", level: 3, re: /^improved daily living\b/i },
  { id: "coord", level: 3, re: /^(support coordination|recovery coach)\b/i },
  { id: "work", level: 3, re: /^finding and keeping a job\b/i },
  { id: "relationships", level: 3, re: /^improved relationships\b/i },
  { id: "health", level: 3, re: /^improved health and wellbeing\b/i },
  { id: "learning", level: 3, re: /^improved learning\b/i },
  { id: "life_choices", level: 3, re: /^improved life choices\b/i },
  { id: "at", level: 3, re: /^(assistive technology|low cost at)\b/i },
  { id: "home_mod", level: 3, re: /^home modifications?\b/i },
  { id: "vehicle_mod", level: 3, re: /^vehicle modifications?\b/i },
  { id: "sil", level: 3, re: /^(supported independent living|\bsil\b)\b/i },
  { id: "sda", level: 3, re: /^(specialist disability accommodation|\bsda\b)\b/i },
];

function splitLines(text: string): string[] {
  return text
    .replace(/\u0000/g, " ")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line, i, arr) => line.length > 0 || (i > 0 && arr[i - 1].length > 0));
}

function matchHeading(line: string): HeadingRule | null {
  if (!line || NOT_HEADING.test(line)) return null;
  if (line.length > 80) return null;
  let best: HeadingRule | null = null;
  for (const rule of HEADINGS) {
    if (!rule.re.test(line)) continue;
    if (!best || rule.level > best.level) best = rule;
  }
  return best;
}

function closeTo(stack: PlanSection[], level: SectionLevel, lineIndex: number) {
  while (stack.length && stack[stack.length - 1].level >= level) {
    const done = stack.pop();
    if (done) done.endLine = lineIndex - 1;
  }
}

export function mapPlanSections(text: string): SectionMap {
  const lines = splitLines(text);
  const flags: string[] = [];
  const root: PlanSection = {
    id: "root",
    path: "root",
    level: 0,
    heading: "",
    startLine: 0,
    endLine: Math.max(0, lines.length - 1),
    text: "",
    children: [],
  };
  const stack: PlanSection[] = [root];
  let lastOpened: { id: string; line: number } | null = null;

  lines.forEach((line, i) => {
    const hit = matchHeading(line);
    if (hit) {
      if (lastOpened && lastOpened.id === hit.id && i - lastOpened.line <= 2) {
        flags.push(`merged_repeat_heading:${hit.id}`);
        return;
      }
      closeTo(stack, hit.level, i);
      const parent = stack[stack.length - 1] ?? root;
      const node: PlanSection = {
        id: hit.id,
        path: parent.level === 0 ? hit.id : `${parent.path}.${hit.id}`,
        level: hit.level,
        heading: line,
        startLine: i,
        endLine: i,
        text: "",
        children: [],
      };
      parent.children.push(node);
      stack.push(node);
      lastOpened = { id: hit.id, line: i };
      return;
    }
    const current = stack[stack.length - 1];
    if (current && current.level > 0 && line) {
      current.text = current.text ? `${current.text}\n${line}` : line;
    }
  });

  closeTo(stack, 1, lines.length);

  const flat = flattenSections(root.children);
  if (!flat.some((s) => s.id === "funding")) flags.push("no_funding_heading");
  if (!flat.some((s) => s.level === 2)) flags.push("no_pot_headings");
  if (flat.some((s) => s.id === "goals" && /\$\s?[\d,]{3,}/.test(s.text))) {
    flags.push("dollars_in_goals");
  }
  const pots = new Set(flat.filter((s) => s.level === 2).map((s) => s.id));
  if (pots.has("core") && pots.has("capacity") && !pots.has("recurring") && !pots.has("capital")) {
    flags.push("old_three_pot_or_partial");
  }

  return { sections: root.children, flags, lineCount: lines.length };
}

export function flattenSections(sections: PlanSection[]): PlanSection[] {
  const out: PlanSection[] = [];
  const walk = (nodes: PlanSection[]) => {
    for (const node of nodes) {
      out.push(node);
      if (node.children.length) walk(node.children);
    }
  };
  walk(sections);
  return out;
}

export function sectionById(sections: PlanSection[], id: string): PlanSection | undefined {
  return flattenSections(sections).find((s) => s.id === id);
}

export function sectionText(sections: PlanSection[], id: string): string {
  const node = sectionById(sections, id);
  if (!node) return "";
  const kids = flattenSections(node.children)
    .map((c) => [c.heading, c.text].filter(Boolean).join("\n"))
    .join("\n");
  return [node.text, kids].filter(Boolean).join("\n");
}

export function fundingSubtree(sections: PlanSection[]): PlanSection[] {
  const funding = sectionById(sections, "funding");
  if (!funding) return [];
  return [funding, ...flattenSections(funding.children)];
}

const AMOUNT = /\$\s?[\d,]{2,}(?:\.\d{2})?/g;

export function amountsInSection(section: PlanSection): string[] {
  const blob = `${section.heading}\n${section.text}`;
  return [...new Set([...blob.matchAll(AMOUNT)].map((m) => m[0].replace(/\s/g, "")))];
}

export function statedOrFlexible(text: string): "stated" | "flexible" | "unknown" {
  const stated = /this is a stated support|\bstated support\b/i.test(text);
  const flexible = /this is a flexible support|\bflexible support\b/i.test(text);
  if (stated && !flexible) return "stated";
  if (flexible && !stated) return "flexible";
  return "unknown";
}
