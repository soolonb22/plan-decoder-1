import type { Membership } from "./types";

export type NavItem = {
  to: string;
  label: string;
  need: Membership;
  group: string;
};

/** First-pass rooms. Old URLs still work; they just are not extra doors. */
export const NAV: NavItem[] = [
  { to: "/", label: "Home", need: "free", group: "Start" },
  { to: "/assessment", label: "Practice assessment", need: "free", group: "Start" },
  { to: "/guide", label: "Guided help", need: "free", group: "Start" },
  { to: "/wallet", label: "Evidence pocket", need: "free", group: "Evidence" },
  { to: "/appointment", label: "Appointment prep", need: "core", group: "Evidence" },
  { to: "/meeting", label: "Meeting prep", need: "core", group: "Evidence" },
  { to: "/language", label: "Functional language", need: "core", group: "Language" },
  { to: "/scripts", label: "Advocacy scripts", need: "core", group: "Language" },
  { to: "/budget", label: "Budget helper", need: "core", group: "Planning" },
  { to: "/funding", label: "Funding categories", need: "free", group: "Planning" },
  { to: "/goals", label: "Goals and wish list", need: "core", group: "Planning" },
  { to: "/checklist", label: "Plan checklist", need: "free", group: "Planning" },
  { to: "/rights", label: "Know your rights", need: "free", group: "Rights" },
  { to: "/clients", label: "Clients", need: "pro", group: "Professional" },
  { to: "/reports", label: "Reports", need: "pro", group: "Professional" },
  { to: "/clinical", label: "Clinical language", need: "pro", group: "Professional" },
  { to: "/school", label: "School collaboration", need: "pro", group: "Professional" },
  { to: "/ops", label: "Operations", need: "pro", group: "Professional" },
  { to: "/membership", label: "Pay & credits", need: "free", group: "Account" },
  { to: "/privacy", label: "Privacy", need: "free", group: "Account" },
];

export const GROUPS = ["Start", "Evidence", "Language", "Planning", "Rights", "Professional", "Account"];
