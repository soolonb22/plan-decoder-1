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
    summary: "School, TAFE, or other organised learning",
  },
  {
    id: "d9",
    code: "d9",
    title: "Community, social and civic life",
    ndis: "social",
    summary: "Community, recreation, culture, civic life.",
  },
];
