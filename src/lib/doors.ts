export const DOORS = [
  {
    id: "applying",
    label: "Applying",
    detail: "Access request",
    pattern: "diary",
    scriptId: "not-just-bad-day",
  },
  {
    id: "planning",
    label: "A planning meeting",
    detail: "The meeting that builds the plan",
    pattern: "diary",
    scriptId: "planner-opening",
  },
  {
    id: "reassessment",
    label: "A plan reassessment, or a decision I disagree with",
    detail: "When the plan no longer fits, or a decision looks wrong",
    pattern: "diary",
    scriptId: "review-request",
  },
  {
    id: "carer",
    label: "I am the carer",
    detail: "What you do, and what is not sustainable",
    pattern: "carer",
    scriptId: "informal-support",
  },
] as const;

export type DoorId = (typeof DOORS)[number]["id"];

export function doorFrom(raw: unknown): DoorId | "" {
  const id = String(raw ?? "");
  return DOORS.some((d) => d.id === id) ? (id as DoorId) : "";
}

export function doorById(id: string) {
  return DOORS.find((d) => d.id === id) ?? DOORS[1];
}
