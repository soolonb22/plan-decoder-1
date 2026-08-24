import type { Membership } from "./types";

export type NavItem = {
  to: string;
  label: string;
  need: Membership;
  group: string;
};

export const NAV: NavItem[] = [
  { to: "/", label: "Home", need: "free", group: "Start" },
  { to: "/assessment", label: "Practice assessment", need: "free", group: "Start" },
  { to: "/guide", label: "Guided help", need: "free", group: "Start" },
  { to: "/companion", label: "3D guide", need: "free", group: "Start" },
  { to: "/wallet", label: "Evidence Wallet", need: "core", group: "Evidence" },
  { to: "/carer", label: "Carer impact log", need: "core", group: "Evidence" },
  { to: "/fluctuation", label: "Fluctuation patterns", need: "core", group: "Evidence" },
  { to: "/flags", label: "Green and red flags", need: "core", group: "Evidence" },
  { to: "/diary", label: "Support diary", need: "free", group: "Evidence" },
  { to: "/appointment", label: "Appointment prep", need: "core", group: "Evidence" },
  { to: "/meeting", label: "Meeting prep", need: "core", group: "Evidence" },
  { to: "/function", label: "Functional snapshot", need: "core", group: "Evidence" },
  { to: "/language", label: "Functional language", need: "core", group: "Language" },
  { to: "/impact", label: "Impact statements", need: "core", group: "Language" },
  { to: "/scripts", label: "Advocacy scripts", need: "core", group: "Language" },
  { to: "/budget", label: "Budget helper", need: "core", group: "Planning" },
  { to: "/funding", label: "Funding categories", need: "free", group: "Planning" },
  { to: "/goals", label: "Goals and wish list", need: "core", group: "Planning" },
  { to: "/checklist", label: "Plan checklist", need: "free", group: "Planning" },
  { to: "/rights", label: "Know your rights", need: "free", group: "Rights" },
  { to: "/code-of-conduct", label: "Code of Conduct", need: "free", group: "Rights" },
  { to: "/art", label: "ART / AAT review", need: "free", group: "Rights" },
  { to: "/glossary", label: "Glossary", need: "free", group: "Rights" },
  { to: "/news", label: "NDIS news", need: "free", group: "Rights" },
  { to: "/clients", label: "Clients", need: "pro", group: "Professional" },
  { to: "/reports", label: "Reports", need: "pro", group: "Professional" },
  { to: "/clinical", label: "Clinical language", need: "pro", group: "Professional" },
  { to: "/school", label: "School collaboration", need: "pro", group: "Professional" },
  { to: "/ops", label: "Operations", need: "pro", group: "Professional" },
  { to: "/membership", label: "Pay & credits", need: "free", group: "Account" },
  { to: "/privacy", label: "Privacy", need: "free", group: "Account" },
];

export const GROUPS = ["Start", "Evidence", "Language", "Planning", "Rights", "Professional", "Account"];
