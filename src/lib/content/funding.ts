export const FUNDING_BUDGETS = [
  {
    id: "core" as const,
    name: "Core supports",
    easy: "Everyday disability support — help at home, community, consumables, daily life.",
    body: "Usually the most flexible budget in a plan. You can often move money between Core categories unless a line is stated. You cannot move Core money into Capacity Building or Capital.",
  },
  {
    id: "capacity" as const,
    name: "Capacity building",
    easy: "Supports that build skills over time — therapy, coordination, finding work, learning.",
    body: "Often less flexible. Many Capacity Building lines are stated, which means that money is for the support named in the plan (for example speech pathology), not another support.",
  },
  {
    id: "capital" as const,
    name: "Capital supports",
    easy: "Higher-cost items — assistive technology, home or vehicle modifications.",
    body: "Usually stated. It is for the item or modification in the plan, not for everyday hours. Quotes and assessments are often needed before you buy.",
  },
  {
    id: "recurring" as const,
    name: "Recurring supports",
    easy: "Regular, repeating supports — transport is a common example.",
    body: "A fourth budget on current NDIA pages (June 2026). You can use that budget in the way that fits you, but you cannot top it up from Core, Capacity Building, or Capital.",
  },
];
