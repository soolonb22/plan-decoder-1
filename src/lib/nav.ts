import type { Membership } from "./types";

export type NavItem = {
  to: string;
  label: string;
  need: Membership;
  group: string;
};

/** Rooms. Old URLs still work; they are not extra doors. */
export const NAV: NavItem[] = [
  { to: "/", label: "My pack", need: "free", group: "Start" },
  { to: "/pricing", label: "Pricing", need: "free", group: "Start" },
  { to: "/about", label: "About", need: "free", group: "Start" },
  { to: "/words", label: "Say it in your words", need: "free", group: "Pack" },
  { to: "/wallet", label: "Evidence pocket", need: "free", group: "Pack" },
  { to: "/assessment", label: "Practice rehearsal", need: "free", group: "More" },
  { to: "/plan", label: "My plan", need: "free", group: "More" },
  { to: "/rights", label: "Know your rights", need: "core", group: "More" },
  { to: "/news", label: "NDIS news", need: "free", group: "More" },
  { to: "/glossary", label: "Glossary", need: "free", group: "More" },
  { to: "/navigator", label: "Community navigator", need: "free", group: "More" },
  { to: "/systems-walk", label: "Systems walk", need: "free", group: "More" },
  { to: "/membership", label: "Pay and credits", need: "free", group: "Account" },
  { to: "/privacy", label: "Privacy", need: "free", group: "Account" },
];

export const GROUPS = ["Start", "Pack", "More", "Account"];
