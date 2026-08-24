export type GlossaryEntry = {
  term: string;
  plain: string;
  also?: string;
};

export const GLOSSARY: GlossaryEntry[] = [
  { term: "Access request", plain: "The process of asking to become an NDIS participant. You provide evidence of disability, identity, and residence." },
  { term: "ART", plain: "Administrative Review Tribunal. Independent body that can review some NDIS decisions after internal review. Replaced the AAT on 14 October 2024. Usually 28 days to apply. No fee for NDIS reviews." },
  { term: "AAT", plain: "Administrative Appeals Tribunal — the old name. From 14 October 2024 NDIS external reviews go to the ART. Existing AAT cases moved across; you did not have to start again." },
  { term: "Capacity building", plain: "Plan funding meant to build skills and independence — for example therapy, support coordination, or finding and keeping a job." },
  { term: "Capital", plain: "Plan funding for higher-cost items such as some assistive technology or home modifications." },
  { term: "Carer", plain: "A family member or friend who provides unpaid support. Carer impact is relevant evidence, not a test of love." },
  { term: "Choice and control", plain: "The principle that you should have a say in your goals, supports, and providers." },
  { term: "Core supports", plain: "Everyday disability supports — help at home, community access, consumables, and transport in many plans." },
  { term: "ECEI / early childhood", plain: "The early childhood approach for young children. Pathways and names have changed over time — check current NDIA wording." },
  { term: "Evidence", plain: "Information that shows functional impact: what is hard, how often, what happens without support, and what helps. Reports are one kind. Lived experience is another." },
  { term: "Foundational supports", plain: "Disability supports governments are building outside individual NDIS plans, for a wider group of people with disability." },
  { term: "Functional impact", plain: "How a disability affects daily life — communication, moving, self-care, relationships, domestic tasks, work or school, and community participation." },
  { term: "Informal supports", plain: "Help from family, friends and community that is not paid. The NDIS considers what is reasonable — it should not assume unlimited unpaid labour." },
  { term: "LAC", plain: "Local Area Coordinator. A partner who can help with access, planning, and connecting to community, depending on your pathway." },
  { term: "NDIA", plain: "National Disability Insurance Agency — the agency that runs the NDIS." },
  { term: "NDIS", plain: "National Disability Insurance Scheme. Official page (May 2026): funding for eligible people with disability, and connections to community services for anyone with disability. Run by the NDIA. Plan Decoder is not the NDIS." },
  { term: "Participant Service Charter", plain: "How the NDIA says it will treat you: transparent, responsive, respectful, empowering, connected. Not a plan. Not a funding decision." },
  { term: "Participant Service Guarantee", plain: "Clocks on NDIA decisions — access, plans, variations, reviews. Missing a clock does not automatically add funding. Keep dates and letters." },
  { term: "PACE", plain: "The NDIA’s computer system for plans and payments. It changed how plans appear and how some things are claimed." },
  { term: "Plan manager", plain: "A person or organisation that pays invoices from your plan and helps you track budget. Different from a support coordinator." },
  { term: "Plan variation / reassessment", plain: "Ways a plan can change before the scheduled end date, including after a significant change of circumstances." },
  { term: "Pricing Schedule", plain: "The NDIA list of price limits for NDIS supports. From 2026–27 this replaced the older Price Guide / PAPL document." },
  { term: "Psychosocial disability", plain: "Disability that can arise from a mental health condition — described by function and support need, not by diagnosis alone." },
  { term: "Reasonable and necessary", plain: "The legal test for whether the NDIS funds a support. See Know your rights." },
  { term: "Recovery coach", plain: "A support that helps people with psychosocial disability build a good life, often alongside or instead of support coordination." },
  { term: "S100 review", plain: "Internal review of a reviewable NDIA decision, usually within 3 months." },
  { term: "Self-managed", plain: "You (or your nominee) pay providers and claim from the NDIS, within the rules of your plan." },
  { term: "Stated support", plain: "A line in a plan that must be used in a particular way. You generally cannot move that money freely." },
  { term: "Support coordinator", plain: "A funded role that helps you understand the plan, find providers, and solve service problems." },
  { term: "WHODAS 2.0", plain: "A World Health Organization questionnaire about functioning in six life areas. Clinicians may use it. Plan Decoder’s snapshot is inspired by it and is not a clinical assessment." },
];
