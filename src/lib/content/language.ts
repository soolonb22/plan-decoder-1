export const DOMAINS = [
  {
    id: "cognition",
    title: "Thinking and communicating",
    hint: "Concentrating, remembering, problem-solving, learning, being understood.",
  },
  {
    id: "mobility",
    title: "Moving around",
    hint: "Standing, moving at home, leaving the house, walking a longer distance, transport.",
  },
  {
    id: "selfCare",
    title: "Self-care",
    hint: "Washing, dressing, eating, medication, being alone safely.",
  },
  {
    id: "gettingAlong",
    title: "Getting along with people",
    hint: "Family, friends, strangers, conflict, and recovering after social contact.",
  },
  {
    id: "lifeActivities",
    title: "Daily life, home, work or school",
    hint: "Household tasks, shopping, study, work, and leisure that happens on most days.",
  },
  {
    id: "participation",
    title: "Community and dignity",
    hint: "Joining in, barriers in the environment, feeling included, maintaining dignity.",
  },
] as const;

export const STRENGTH_PROMPTS = [
  "What already works on a good day?",
  "Which people, places, or tools make things easier?",
  "What does the person care about and want more of?",
];

export const IMPACT_PROMPTS = [
  {
    id: "task",
    label: "The task or situation",
    placeholder: "Getting out of the house in the morning",
  },
  {
    id: "without",
    label: "What happens without support",
    placeholder: "The routine stops. Medication is missed. School or work is cancelled.",
  },
  {
    id: "frequency",
    label: "How often, and for how long",
    placeholder: "4 mornings a week. Recovery can take the rest of the day.",
  },
  {
    id: "support",
    label: "What support changes",
    placeholder: "A known worker for 2 hours means the person leaves the house and the carer can work.",
  },
  {
    id: "risk",
    label: "Risk if nothing changes",
    placeholder: "Carer burnout, missed nutrition, isolation, or a hospital presentation.",
  },
];

export const SWAP_PAIRS: { avoid: string; prefer: string; why: string }[] = [
  {
    avoid: "non-compliant / attention-seeking / lazy",
    prefer: "needs more support to start / communicate / recover",
    why: "Judgement words hide the support need.",
  },
  {
    avoid: "high functioning",
    prefer: "can do this in some conditions, with this much support",
    why: "Function fluctuates. Best-day snapshots underfund.",
  },
  {
    avoid: "just anxious / just behavioural",
    prefer: "disability-related barriers in this environment",
    why: "Cause-debating delays supports.",
  },
  {
    avoid: "they can do it if they try",
    prefer: "on a good day this is possible; on a typical or hard day this is not",
    why: "Effort is not evidence.",
  },
  {
    avoid: "needs 24/7 because we worry",
    prefer: "needs this support because of these safety / function facts",
    why: "Worry is real. Funding still needs function.",
  },
];
