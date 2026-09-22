export type IcfItem = {
  id: string;
  chapter: string;
  short: boolean;
  text: string;
  domain: "cognition" | "mobility" | "selfCare" | "gettingAlong" | "lifeActivities" | "participation";
};

export const ICF_SCALE = [
  { value: 0, label: "None" },
  { value: 1, label: "Mild" },
  { value: 2, label: "Moderate" },
  { value: 3, label: "Severe" },
  { value: 4, label: "Complete" },
];

export const FREQ_SCALE = [
  { value: 0, label: "Never" },
  { value: 1, label: "A few times" },
  { value: 2, label: "Most weeks" },
  { value: 3, label: "Most days" },
  { value: 4, label: "All or nearly all of the time" },
];

export const INTENSITY_SCALE = [
  { value: 0, label: "No extra support" },
  { value: 1, label: "Reminders or someone nearby" },
  { value: 2, label: "Some hands-on help" },
  { value: 3, label: "A lot of help" },
  { value: 4, label: "Someone else has to do it" },
];

export const INTERFERE_SCALE = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Mildly" },
  { value: 2, label: "Moderately" },
  { value: 3, label: "Severely" },
  { value: 4, label: "Extremely" },
];

export const CHAPTERS: { id: string; code: string; title: string; ndis: string; summary: string }[] = [
  {
    id: "d1",
    code: "d1",
    title: "Learning and applying knowledge",
    ndis: "learning",
    summary: "Watching, listening, focusing, thinking, solving problems, deciding.",
  },
  {
    id: "d2",
    code: "d2",
    title: "General tasks and demands",
    ndis: "self-management",
    summary: "Starting tasks, daily routine, handling change, stress.",
  },
  {
    id: "d3",
    code: "d3",
    title: "Communication",
    ndis: "communication",
    summary: "Understanding, being understood, conversation, devices.",
  },
  {
    id: "d4",
    code: "d4",
    title: "Mobility",
    ndis: "mobility",
    summary: "Moving, transferring, walking, carrying, transport.",
  },
  {
    id: "d5",
    code: "d5",
    title: "Self-care",
    ndis: "self-care",
    summary: "Washing, dressing, eating, toileting, looking after health.",
  },
  {
    id: "d6",
    code: "d6",
    title: "Domestic life",
    ndis: "self-management",
    summary: "Shopping, meals, housework, helping others at home.",
  },
  {
    id: "d7",
    code: "d7",
    title: "Relationships",
    ndis: "social",
    summary: "Family, friends, workers, strangers, staying in contact.",
  },
  {
    id: "d8",
    code: "d8",
    title: "Major life areas",
    ndis: "learning",
    summary: "School, TAFE, work, money, and economic life.",
  },
  {
    id: "d9",
    code: "d9",
    title: "Community, social and civic life",
    ndis: "social",
    summary: "Community, recreation, culture, civic life.",
  },
];

export const ICF_ITEMS: IcfItem[] = [
  { id: "d110", chapter: "d1", short: true, text: "Taking in information by watching or looking", domain: "cognition" },
  { id: "d160", chapter: "d1", short: false, text: "Staying focused on a task", domain: "cognition" },
  { id: "d163", chapter: "d1", short: false, text: "Thinking things through", domain: "cognition" },
  { id: "d175", chapter: "d1", short: false, text: "Solving a problem in daily life", domain: "cognition" },
  { id: "d210", chapter: "d2", short: true, text: "Starting and finishing a single task", domain: "lifeActivities" },
  { id: "d220", chapter: "d2", short: false, text: "Managing more than one thing at once", domain: "lifeActivities" },
  { id: "d230", chapter: "d2", short: false, text: "Carrying out the usual daily routine", domain: "lifeActivities" },
  { id: "d240", chapter: "d2", short: false, text: "Handling stress or unexpected change", domain: "lifeActivities" },
  { id: "d310", chapter: "d3", short: true, text: "Understanding what people say", domain: "cognition" },
  { id: "d330", chapter: "d3", short: false, text: "Speaking or producing messages", domain: "cognition" },
  { id: "d350", chapter: "d3", short: false, text: "Having a conversation", domain: "cognition" },
  { id: "d360", chapter: "d3", short: false, text: "Using a phone, device, or other communication aid", domain: "cognition" },
  { id: "d450", chapter: "d4", short: true, text: "Walking or moving around inside", domain: "mobility" },
  { id: "d410", chapter: "d4", short: false, text: "Changing body position (sit, stand, lie)", domain: "mobility" },
  { id: "d420", chapter: "d4", short: false, text: "Transferring from one surface to another", domain: "mobility" },
  { id: "d470", chapter: "d4", short: false, text: "Using transport to leave the home", domain: "mobility" },
  { id: "d510", chapter: "d5", short: true, text: "Washing the whole body", domain: "selfCare" },
  { id: "d540", chapter: "d5", short: false, text: "Dressing", domain: "selfCare" },
  { id: "d550", chapter: "d5", short: false, text: "Eating and drinking", domain: "selfCare" },
  { id: "d570", chapter: "d5", short: false, text: "Looking after one’s own health (medication, rest, safety)", domain: "selfCare" },
  { id: "d620", chapter: "d6", short: true, text: "Getting food and household goods", domain: "lifeActivities" },
  { id: "d630", chapter: "d6", short: false, text: "Preparing meals", domain: "lifeActivities" },
  { id: "d640", chapter: "d6", short: false, text: "Doing housework", domain: "lifeActivities" },
  { id: "d660", chapter: "d6", short: false, text: "Assisting others in the household", domain: "lifeActivities" },
  { id: "d710", chapter: "d7", short: true, text: "Basic social contact (greeting, responding, showing interest)", domain: "gettingAlong" },
  { id: "d750", chapter: "d7", short: false, text: "Informal relationships — friends, neighbours, peers", domain: "gettingAlong" },
  { id: "d760", chapter: "d7", short: false, text: "Family relationships", domain: "gettingAlong" },
  { id: "d730", chapter: "d7", short: false, text: "Relating with people not already known", domain: "gettingAlong" },
  { id: "d820", chapter: "d8", short: true, text: "School, TAFE, or other organised learning", domain: "lifeActivities" },
  { id: "d850", chapter: "d8", short: false, text: "Paid or unpaid work", domain: "lifeActivities" },
  { id: "d860", chapter: "d8", short: false, text: "Using money and simple transactions", domain: "lifeActivities" },
  { id: "d870", chapter: "d8", short: false, text: "Having the means to live day to day", domain: "lifeActivities" },
  { id: "d910", chapter: "d9", short: true, text: "Joining in community life", domain: "participation" },
  { id: "d920", chapter: "d9", short: false, text: "Recreation, leisure, or play", domain: "participation" },
  { id: "d930", chapter: "d9", short: false, text: "Religion or spirituality, if it is part of life", domain: "participation" },
  { id: "d950", chapter: "d9", short: false, text: "Civic life — voting, rights, being a citizen", domain: "participation" },
];

export const ICF_SHORT_IDS = ICF_ITEMS.filter((i) => i.short).map((i) => i.id);

export function descriptor(avg: number) {
  if (avg < 0.5) return "None";
  if (avg < 1.5) return "Mild";
  if (avg < 2.5) return "Moderate";
  if (avg < 3.5) return "Severe";
  return "Complete";
}

export function scaleOptions(kind: string) {
  if (kind === "freq") return FREQ_SCALE;
  if (kind === "intensity") return INTENSITY_SCALE;
  if (kind === "interfere") return INTERFERE_SCALE;
  if (kind === "days") {
    return Array.from({ length: 11 }, (_, i) => ({
      value: i === 10 ? 30 : i * 3,
      label: i === 10 ? "Every day" : i === 0 ? "0 days" : `About ${i * 3} days`,
    }));
  }
  return ICF_SCALE;
}

export function scoreIcf(items: Record<string, number | null>) {
  const byDomain: Record<IcfItem["domain"], number[]> = {
    cognition: [],
    mobility: [],
    selfCare: [],
    gettingAlong: [],
    lifeActivities: [],
    participation: [],
  };
  for (const item of ICF_ITEMS) {
    const v = items[item.id];
    if (v === null || v === undefined) continue;
    byDomain[item.domain].push(v);
  }
  const domains = (Object.keys(byDomain) as IcfItem["domain"][]).map((domain) => {
    const vals = byDomain[domain];
    const raw = vals.reduce((a, b) => a + b, 0);
    const avg = vals.length ? raw / vals.length : 0;
    const answered = vals.length;
    const variance = answered > 1 ? vals.reduce((a, b) => a + (b - avg) ** 2, 0) / answered : 0;
    return { domain, raw, avg, answered, highVariance: variance > 2 };
  });
  const answeredAll = Object.values(items).filter((v): v is number => v !== null && v !== undefined);
  const rawOverall = answeredAll.reduce((a, b) => a + b, 0);
  const avgOverall = answeredAll.length ? rawOverall / answeredAll.length : 0;
  const simple100 = answeredAll.length ? Math.round((rawOverall / (answeredAll.length * 4)) * 100) : 0;
  return { domains, rawOverall, avgOverall, simple100, answered: answeredAll.length };
}

export const SCALE = ICF_SCALE;

export const ICF_DISCLAIMER = `This is an ICF-inspired functioning snapshot for self-reflection and evidence gathering. It is not a clinical diagnosis, not an official ICF assessment, not WHODAS, and not an NDIA assessment.\n\nPlan Decoder uses the ICF 0–4 qualifier (none / mild / moderate / severe / complete) and a simple average of answered items. Performance is what happens in real life with the usual help and environment. Capacity is what is possible in a more standard setting. The gap often lives in the environment.\n\nDo not submit this as a substitute for a qualified clinician’s assessment. You can take the notes to a clinician or support coordinator.`;
