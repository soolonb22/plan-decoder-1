import type { WhodasDomain } from "./types";

export type WhodasItem = {
  id: string;
  domain: WhodasDomain;
  text: string;
  optional?: boolean;
};

export const WHODAS_ITEMS: WhodasItem[] = [
  { id: "q1", domain: "cognition", text: "Concentrating on something for ten minutes" },
  { id: "q2", domain: "cognition", text: "Remembering to do important things" },
  { id: "q3", domain: "cognition", text: "Analysing and finding solutions to problems in daily life" },
  { id: "q4", domain: "cognition", text: "Learning a new task, for example learning how to get to a new place" },
  { id: "q5", domain: "cognition", text: "Generally understanding what people say" },
  { id: "q6", domain: "cognition", text: "Starting and maintaining a conversation" },
  { id: "q7", domain: "mobility", text: "Standing for long periods such as 30 minutes" },
  { id: "q8", domain: "mobility", text: "Standing up from sitting down" },
  { id: "q9", domain: "mobility", text: "Moving around inside the home" },
  { id: "q10", domain: "mobility", text: "Getting out of the home" },
  { id: "q11", domain: "mobility", text: "Walking a long distance such as a kilometre" },
  { id: "q12", domain: "selfCare", text: "Washing your whole body" },
  { id: "q13", domain: "selfCare", text: "Getting dressed" },
  { id: "q14", domain: "selfCare", text: "Eating" },
  { id: "q15", domain: "selfCare", text: "Staying by yourself for a few days" },
  { id: "q16", domain: "gettingAlong", text: "Dealing with people you do not know" },
  { id: "q17", domain: "gettingAlong", text: "Maintaining a friendship" },
  { id: "q18", domain: "gettingAlong", text: "Getting along with people who are close to you" },
  { id: "q19", domain: "gettingAlong", text: "Making new friends" },
  { id: "q20", domain: "gettingAlong", text: "Sexual activities (skip if not relevant)" },
  { id: "q21", domain: "lifeActivities", text: "Taking care of household responsibilities" },
  { id: "q22", domain: "lifeActivities", text: "Doing most important household tasks well" },
  { id: "q23", domain: "lifeActivities", text: "Getting all the household work done that you needed to do" },
  { id: "q24", domain: "lifeActivities", text: "Getting household work done as quickly as needed" },
  { id: "q25", domain: "lifeActivities", text: "Your day-to-day work or school (optional if not relevant)", optional: true },
  { id: "q26", domain: "lifeActivities", text: "Doing your most important work or school tasks well (optional)", optional: true },
  { id: "q27", domain: "lifeActivities", text: "Getting done all the work or school you needed to (optional)", optional: true },
  { id: "q28", domain: "lifeActivities", text: "Getting work or school done as quickly as needed (optional)", optional: true },
  { id: "q29", domain: "participation", text: "Joining in community activities (festivals, meetings, religious or other activities) in the same way as anyone else" },
  { id: "q30", domain: "participation", text: "Barriers or hindrances in the world around you" },
  { id: "q31", domain: "participation", text: "Living with dignity because of the attitudes and actions of others" },
  { id: "q32", domain: "participation", text: "How much time you spend on your health condition or its consequences" },
  { id: "q33", domain: "participation", text: "How much you have been emotionally affected" },
  { id: "q34", domain: "participation", text: "How much your health has been a drain on the financial resources of you or your family" },
  { id: "q35", domain: "participation", text: "How much of a problem family have had because of your health problems" },
  { id: "q36", domain: "participation", text: "How much of a problem you have had in doing things by yourself for relaxation or pleasure" },
];

export const SCALE = [
  { value: 0, label: "None" },
  { value: 1, label: "Mild" },
  { value: 2, label: "Moderate" },
  { value: 3, label: "Severe" },
  { value: 4, label: "Extreme or cannot do" },
];

export function descriptor(avg: number) {
  if (avg < 0.5) return "None";
  if (avg < 1.5) return "Mild";
  if (avg < 2.5) return "Moderate";
  if (avg < 3.5) return "Severe";
  return "Extreme";
}

export function scoreWhodas(items: Record<string, number | null>) {
  const byDomain: Record<WhodasDomain, number[]> = {
    cognition: [],
    mobility: [],
    selfCare: [],
    gettingAlong: [],
    lifeActivities: [],
    participation: [],
  };
  for (const item of WHODAS_ITEMS) {
    const v = items[item.id];
    if (v === null || v === undefined) continue;
    byDomain[item.domain].push(v);
  }
  const domains = (Object.keys(byDomain) as WhodasDomain[]).map((domain) => {
    const vals = byDomain[domain];
    const raw = vals.reduce((a, b) => a + b, 0);
    const avg = vals.length ? raw / vals.length : 0;
    const answered = vals.length;
    const variance =
      answered > 1
        ? vals.reduce((a, b) => a + (b - avg) ** 2, 0) / answered
        : 0;
    return { domain, raw, avg, answered, highVariance: variance > 2 };
  });
  const answeredAll = Object.values(items).filter(
    (v): v is number => v !== null && v !== undefined,
  );
  const rawOverall = answeredAll.reduce((a, b) => a + b, 0);
  const avgOverall = answeredAll.length ? rawOverall / answeredAll.length : 0;
  const simple100 = answeredAll.length
    ? Math.round((rawOverall / (answeredAll.length * 4)) * 100)
    : 0;
  return { domains, rawOverall, avgOverall, simple100, answered: answeredAll.length };
}

export const WHODAS_DISCLAIMER = `This is a WHODAS 2.0–inspired functional snapshot for self-reflection and evidence gathering. It is not a clinical diagnosis, not an official WHODAS administration, and not an NDIA assessment.

Official WHODAS 2.0 has two scoring methods: item-response theory (a 0–100 metric with a percentile against a WHO sample) and average scores (none / mild / moderate / severe / extreme). Average scores are preferred when items are skipped. Plan Decoder shows average scores and a simple 0–100 transform of answered items. It does not compute official IRT scores or percentiles.

Do not submit this as a substitute for a qualified clinician’s assessment. You can take the notes to a clinician or support coordinator.`;
