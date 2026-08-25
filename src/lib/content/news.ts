export type NewsItem = {
  id: string;
  title: string;
  date: string;
  source: string;
  url: string;
  summary: string;
  whyItMatters: string;
  tags: string[];
};

export const NEWS_CHECKED = "2026-08-25";

export const NEWS: NewsItem[] = [
  {
    id: "apr-2026-27",
    title: "2026–27 Annual Pricing Review and new Pricing Schedule",
    date: "2026-07-01",
    source: "NDIA",
    url: "https://www.ndis.gov.au/providers/pricing-and-payments/pricing/pricing-updates",
    summary:
      "From 1 July 2026 the NDIA’s new Pricing Schedule applies. The older Price Guide / PAPL document has been replaced. The Annual Pricing Review discusses disability support worker prices, some allied health prices, and claiming changes including Short Term Accommodation.",
    whyItMatters:
      "If you self-manage or plan-manage, check that invoices match the new item numbers and price limits. If a therapy price moved, talk with your provider before the next session so there are no surprise gaps.",
    tags: ["pricing", "providers"],
  },
  {
    id: "foundational-supports",
    title: "National Agreement on Foundational Supports",
    date: "2026-02-02",
    source: "National Cabinet",
    url: "https://federalfinancialrelations.gov.au/agreements/national-agreement-foundational-supports",
    summary:
      "Governments have agreed to build foundational supports outside individual NDIS plans — community, information, and capacity supports for a wider group of people with disability.",
    whyItMatters:
      "Foundational supports are not an automatic replacement for your plan. If a planner says ‘this belongs in foundational supports’, ask what exists in your area today, in writing, and keep your functional evidence.",
    tags: ["policy", "access"],
  },
  {
    id: "future-generations-bill",
    title: "NDIS Amendment (Securing the NDIS for Future Generations) Bill 2026",
    date: "2026-05-14",
    source: "Parliament / NDIA",
    url: "https://www.ndis.gov.au/ndis-laws/securing-ndis-future-generations",
    summary:
      "Introduced 14 May 2026, passed 19 August 2026, signed 20 August 2026. First changes from 27 August 2026, with later dates for claims, new-framework planning, and access assessments. NDIA: keep using your current plan as usual unless they tell you otherwise.",
    whyItMatters:
      "Do not assume your current plan has already changed. Read letters. If a new decision arrives, diary the date — review clocks start from when you receive it.",
    tags: ["legislation", "reviews"],
  },
  {
    id: "sta-claiming",
    title: "Changes to how Short Term Accommodation is claimed",
    date: "2026-07-01",
    source: "NDIA / sector summaries",
    url: "https://www.ndis.gov.au/providers/pricing-and-payments/pricing/pricing-updates",
    summary:
      "The 2026–27 pricing package includes changes to how STA and respite-style supports are claimed. Providers and families should check the current Pricing Schedule, not last year’s invoice template.",
    whyItMatters:
      "Carer-break evidence still matters. If STA is how the family recovers enough to keep someone safely at home, write that down in functional language — not just ‘we need a holiday’.",
    tags: ["carers", "pricing"],
  },
  {
    id: "pace-plans",
    title: "Reading a PACE plan without panic",
    date: "2026-03-12",
    source: "Plan Decoder explainer",
    url: "https://www.ndis.gov.au",
    summary:
      "Plans in the PACE system can look different to older PDFs: budgets grouped differently, stated supports, and payment methods in new places. The funding is still a set of reasonable and necessary supports.",
    whyItMatters:
      "Use the Plan checklist in Plan Decoder to mark what you understand and what you will ask your coordinator or planner. Confusion is common. It is not a failing.",
    tags: ["plans", "how-to"],
  },
  {
    id: "claiming-window-2026",
    title: "Claim close to the date of the support",
    date: "2026-07-01",
    source: "NDIA pricing / claiming pages",
    url: "https://www.ndis.gov.au/providers/pricing-and-payments",
    summary:
      "Claiming rules can change. From late 2026, government pages describe a 90-day window for some claims. Always check the live NDIA page, not a screenshot.",
    whyItMatters:
      "If you self-manage, keep invoices dated and claim soon. Plan Decoder’s claiming book is a practice clock on this device — not a claim to the NDIS.",
    tags: ["claiming", "self-manage"],
  },
  {
    id: "support-needs-2027",
    title: "New support needs assessments (I-CAN based) — later for most people",
    date: "2026-06-01",
    source: "NDIA public statements",
    url: "https://www.ndis.gov.au",
    summary:
      "A new planning pathway using a customised I-CAN tool plus extra questionnaires is described as rolling out for some people from 2027. Official instruments are licensed and not published in full.",
    whyItMatters:
      "You can still practise talking about daily function, environment, permanency, and mainstream supports. Plan Decoder’s questionnaire is rehearsal only — not I-CAN, not the NDIA.",
    tags: ["assessment", "planning"],
  },
];
