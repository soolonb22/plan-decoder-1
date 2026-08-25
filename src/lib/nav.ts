import type { Membership } from "./types";

export type NavItem = {
  to: string;
  label: string;
  need: Membership;
  group: string;
};

/** Rooms. Old URLs still work; they are not extra doors. */
export const NAV: NavItem[] = [
  { to: "/", label: "Home", need: "free", group: "Start" },
  { to: "/assessment", label: "Practice assessment", need: "free", group: "Start" },
  { to: "/guide", label: "Guided help", need: "free", group: "Start" },
  { to: "/wallet", label: "Evidence pocket", need: "free", group: "Evidence" },
  { to: "/prep", label: "Prep", need: "core", group: "Evidence" },
  { to: "/words", label: "Words", need: "core", group: "Language" },
  { to: "/plan", label: "My plan", need: "free", group: "Planning" },
  { to: "/rights", label: "Know your rights", need: "free", group: "Rights" },
  { to: "/news", label: "NDIS news", need: "free", group: "Rights" },
  { to: "/clients", label: "Clients", need: "pro", group: "Professional" },
  { to: "/reports", label: "GP pack & reports", need: "core", group: "Professional" },
  { to: "/school", label: "School collaboration", need: "pro", group: "Professional" },
  { to: "/ops", label: "Operations", need: "pro", group: "Professional" },
  { to: "/membership", label: "Pay & credits", need: "free", group: "Account" },
  { to: "/privacy", label: "Privacy", need: "free", group: "Account" },
];

export const GROUPS = ["Start", "Evidence", "Language", "Planning", "Rights", "Professional", "Account"];
