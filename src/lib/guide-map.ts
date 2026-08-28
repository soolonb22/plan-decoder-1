export type GuideStation = {
  id: string;
  title: string;
  easy: string;
  caption: string;
  to: "/" | "/assessment" | "/wallet" | "/rights" | "/membership" | "/navigator";
  color: string;
};

export const GUIDE_STATIONS: GuideStation[] = [
  {
    id: "welcome",
    title: "Welcome",
    easy: "This is a practice space. You can stop anytime.",
    caption:
      "Plan Decoder is a calm practice workspace. Nothing here is an NDIA decision. Your notes stay on this device.",
    to: "/",
    color: "#6E2C92",
  },
  {
    id: "practice",
    title: "Practice questions",
    easy: "Tick how a usual day feels. It is only practice.",
    caption:
      "The practice assessment asks about daily life, supports, and whether difficulty has lasted. You can skip, save, or delete.",
    to: "/assessment",
    color: "#8bc541",
  },
  {
    id: "navigator",
    title: "Find other supports",
    easy: "If NDIS is not the door, we still walk you to the next one.",
    caption:
      "The community navigator points to health, housing, carers, and local groups. It is not an official NDIS Navigator.",
    to: "/navigator",
    color: "#3d7a6a",
  },
  {
    id: "notes",
    title: "Your notes",
    easy: "Write what happened. Keep it on this device.",
    caption:
      "Evidence, diaries, and meeting notes stay in this browser. You can delete them quickly. They are not sent to the NDIA.",
    to: "/wallet",
    color: "#c4a35a",
  },
  {
    id: "rights",
    title: "Your rights",
    easy: "Plain words about NDIS rights and words.",
    caption:
      "Know Your Rights and the glossary use everyday language. Use them before a meeting if that feels safer.",
    to: "/rights",
    color: "#4a7c9b",
  },
  {
    id: "pay",
    title: "Pay and credits",
    easy: "Core is $12 a month. Reports use $5 credits.",
    caption:
      "Core membership opens the tools. Each finished report or polished draft uses 1 credit. You choose when to pay.",
    to: "/membership",
    color: "#b45a7a",
  },
];
