import type { ArtTopic } from "@/components/illustrations";

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  art: ArtTopic;
  lede: string;
  disclaimer: string;
  sections: {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
    numbered?: string[];
    quote?: string;
    table?: { headers: string[]; rows: string[][] };
  }[];
  faqs: { q: string; a: string }[];
  related: { to: string; label: string }[];
};

const DISCLAIMER =
  "General information only. Not the NDIA, not a diagnosis, and not a funding decision. Rules change — check ndis.gov.au before you act.";

export const GUIDES: Guide[] = [
  {
    slug: "ndis-carer-support-statement",
    title: "How to write an NDIS carer or support statement",
    metaTitle: "How to Write an NDIS Carer / Support Statement (Free Template)",
    metaDescription: "A plain-English guide to writing a carer or support statement for an NDIS plan review — what to include, what to avoid, and a free template.",
    art: "wallet",
    lede: "A short, honest description of what daily life looks like: what help is needed, how often, and what happens on a hard day.",
    disclaimer: DISCLAIMER,
    sections: [
      { title: "Why a carer statement matters", paragraphs: ["Assessments capture a snapshot. A carer statement captures the pattern."], bullets: ["Shows function on a typical day, not a best day.", "Describes prompting, supervision, and hands-on support.", "Makes variability visible."] },
      { title: "What to include", numbered: ["Who you are, your relationship, and how long you have supported the person.", "A typical hard day — alone, prompting, hands-on help.", "The supports you provide and how long they take.", "Safety and risk if support is not there.", "How often the hardest situations happen.", "The effect on you — sleep, work, health, being on call."] },
      { title: "What to avoid", bullets: ["Do not exaggerate.", "Do not only describe good days.", "Do not use clinical language you are unsure of.", "Do not leave out help that feels normal."] },
      { title: "Free template — copy and adapt", quote: "NDIS Support Statement\n\nParticipant: [Name] · Written by: [Your name], [relationship] · Date: [date]\n\nI have supported [name] for [time period]. I see them [how often]. This statement describes what a typical difficult day looks like and the help [name] needs.\n\nA typical hard day. [Morning, daytime, evening.]\n\nThe support I provide. [Each support, how often, how long. Include prompting.]\n\nSafety. [What happens without this support.]\n\nHow often the hardest situations happen. [Per day or week.]\n\nThe effect on me. [Sleep, work, health, being on call.]\n\nI am happy to be contacted. [Contact details.]" },
    ],
    faqs: [
      { q: "Does the NDIS have an official carer statement form?", a: "No. A clear, honest, specific statement in your own words is what matters." },
      { q: "Who can write a support statement?", a: "Anyone who supports the participant regularly. More than one person can each write their own." },
      { q: "How long should it be?", a: "One to two pages is common." },
    ],
    related: [{ to: "/ndis-plan-review", label: "Plan review prep" }, { to: "/ndis-evidence", label: "What evidence counts" }, { to: "/prep-pack", label: "Prep Pack" }],
  },
  {
    slug: "ndis-2026-changes",
    title: "NDIS 2026 changes: what participants need to know",
    metaTitle: "NDIS 2026 Changes: What Participants Need to Know",
    metaDescription: "A plain-English summary of the NDIS changes rolling out from 2026 — planning framework, reassessments, budgets, and how to prepare.",
    art: "articles",
    lede: "The biggest set of changes since the scheme began. They arrive in stages.",
    disclaimer: DISCLAIMER,
    sections: [
      { title: "The headline: a new way of planning", paragraphs: ["From mid-2026 the NDIS begins a new planning framework. A trained assessor has a structured conversation about daily life.", "The tool is I-CAN v6. It is not the same as WHODAS 2.0.", "The rollout is phased through to 2030."] },
      { title: "The timeline, as currently described", table: { headers: ["When", "What changes"], rows: [["From mid-2026", "New planning framework begins, phased."], ["1 October 2026", "Some categories adjusted at reassessment. Core daily supports described as protected."], ["1 December 2026", "Claims described as within 90 days."], ["1 February 2027", "Plan renewal. Unused funds do not carry over."], ["1 April 2027", "Support-needs assessments begin determining budgets."], ["1 January 2028", "New applicants face a standardised functional capacity assessment."]] } },
      { title: "What to do now", numbered: ["Know your next review date.", "Keep a running record of supports and hard days.", "Practise the functional questions.", "Bring a support person."] },
    ],
    faqs: [
      { q: "What tool will the NDIS use?", a: "I-CAN v6, alongside a questionnaire about your situation." },
      { q: "Will my plan change immediately in 2026?", a: "Not necessarily. Keep using your current plan until a letter says otherwise." },
      { q: "Can I still ask for a review?", a: "Yes. Internal and external review rights remain." },
    ],
    related: [{ to: "/ndis-changes", label: "Dated May 2026 summary" }, { to: "/ndis-assessment-tool", label: "I-CAN v6" }, { to: "/ndis-plan-review", label: "How to prepare" }],
  },
  {
    slug: "ndis-functional-capacity-assessment",
    title: "NDIS functional capacity assessment: what it is and how to prepare",
    metaTitle: "NDIS Functional Capacity Assessment: What It Is & How to Prepare",
    metaDescription: "What an NDIS functional capacity assessment is, who does one, what to expect, and how to prepare so it reflects real daily life.",
    art: "assess",
    lede: "Not a test you pass or fail. A professional description of how disability affects everyday activities.",
    disclaimer: DISCLAIMER,
    sections: [
      { title: "What an FCA actually is", paragraphs: ["It looks at function across mobility, self-care, communication, social life, learning, and self-management."], bullets: ["Mobility and movement", "Self-care", "Communication", "Social and relationships", "Learning", "Self-management"] },
      { title: "Who can do one", bullets: ["Occupational therapists", "Physiotherapists", "Psychologists", "Speech pathologists"] },
      { title: "How to prepare", numbered: ["Describe a typical hard day.", "Include prompting and supervision.", "Bring a carer statement and a diary.", "Name how often hard days come.", "Rehearse the questions."] },
    ],
    faqs: [
      { q: "What is an FCA?", a: "A report describing how disability affects everyday activities and how much support you need." },
      { q: "Who can complete one?", a: "A qualified allied health professional, commonly an occupational therapist." },
      { q: "How much does it cost?", a: "It varies. Ask for a quote, and check whether your current plan can fund it." },
    ],
    related: [{ to: "/ndis-assessment-tool", label: "I-CAN v6" }, { to: "/ndis-plan-review", label: "Plan review prep" }, { to: "/ndis-carer-support-statement", label: "Carer statement" }],
  },
  {
    slug: "ndis-plan-reassessment",
    title: "NDIS plan reassessment: the complete walkthrough",
    metaTitle: "NDIS Plan Reassessment: The Complete Walkthrough (2026)",
    metaDescription: "Scheduled vs unscheduled reassessment, 2026 request rules, the step-by-step process, and how to prepare.",
    art: "articles",
    lede: "Plan reassessment is how the NDIS looks at your plan and decides the next one.",
    disclaimer: DISCLAIMER,
    sections: [
      { title: "Scheduled vs unscheduled", bullets: ["Scheduled — near the end of your current plan.", "Unscheduled — when something significant and ongoing changes. From 2026 the request generally comes from you, a nominee, or a child representative."] },
      { title: "The process", numbered: ["Notice or trigger.", "Preparation — evidence, function, goals.", "The conversation. Bring a support person.", "Decision. From February 2027 unused funds do not carry over.", "Review rights if you disagree."] },
    ],
    faqs: [
      { q: "Can I request a reassessment early?", a: "Yes, with a significant and ongoing change, requested by you, a nominee, or a child representative." },
      { q: "What happens to unused funds?", a: "From February 2027 unused funds do not carry forward." },
    ],
    related: [{ to: "/ndis-plan-review", label: "How to prepare" }, { to: "/ndis-2026-changes", label: "2026 changes" }, { to: "/ndis-internal-review", label: "Internal review" }],
  },
  {
    slug: "ndis-assessment-tool",
    title: "What tool does the NDIS use to assess needs? I-CAN v6 explained",
    metaTitle: "What Tool Does the NDIS Use to Assess Needs? I-CAN v6 Explained",
    metaDescription: "The NDIS new support-needs assessment uses I-CAN v6. How it differs from WHODAS 2.0, and how to prepare.",
    art: "assess",
    lede: "WHODAS and I-CAN are not the same tool.",
    disclaimer: DISCLAIMER,
    sections: [
      { title: "The short answer", paragraphs: ["The new support-needs assessment uses I-CAN v6. WHODAS 2.0 is a separate questionnaire. Plan Decoder practice questions follow the same daily-life areas as WHODAS, so you can rehearse function — not sit the official tool."] },
      { title: "How I-CAN v6 works", bullets: ["A trained assessor has a semi-structured conversation.", "Strengths-based.", "Paired with a questionnaire about your situation.", "You can bring a support person."] },
      { title: "I-CAN v6 and WHODAS 2.0", table: { headers: ["", "I-CAN v6", "WHODAS 2.0"], rows: [["Used by", "NDIS new support-needs assessment", "Widely used in health and disability assessment"], ["Style", "Semi-structured interview", "Structured questionnaire"]] } },
    ],
    faqs: [
      { q: "What tool does the NDIS use?", a: "I-CAN v6 for the new support-needs assessment." },
      { q: "Is WHODAS the same as I-CAN?", a: "No. Both look at daily function. They are different instruments." },
    ],
    related: [{ to: "/ndis-2026-changes", label: "2026 changes" }, { to: "/ndis-functional-capacity-assessment", label: "FCA" }, { to: "/ndis-plan-review", label: "How to prepare" }],
  },
  {
    slug: "ndis-planning-meeting",
    title: "NDIS planning meeting: questions to expect and how to answer",
    metaTitle: "NDIS Planning Meeting: Questions to Expect & How to Answer",
    metaDescription: "Questions asked in an NDIS planning meeting, how to answer so they reflect real needs, and what to bring.",
    art: "guide",
    lede: "Knowing the questions in advance turns an intimidating conversation into one you can prepare for.",
    disclaimer: DISCLAIMER,
    sections: [
      { title: "Questions by area", bullets: ["Daily living and self-care", "Mobility, including worse days", "Communication", "Social and community", "Learning and managing life", "Current supports and goals"] },
      { title: "How to answer well", numbered: ["Answer for a typical hard day.", "Include prompting and supervision.", "Be specific about time and frequency.", "Link each need to a goal.", "Bring notes. Pause if you need to."] },
      { title: "What to bring", bullets: ["A support person", "Hard-day notes", "A carer statement", "Recent reports", "A short list of goals"] },
    ],
    faqs: [
      { q: "Can I bring someone?", a: "Yes. A family member, carer, nominee, advocate, or support worker." },
      { q: "How should I answer?", a: "Honestly and specifically, for a typical hard day." },
    ],
    related: [{ to: "/ndis-plan-review", label: "How to prepare" }, { to: "/ndis-assessment-tool", label: "I-CAN v6" }, { to: "/ndis-carer-support-statement", label: "Carer statement" }],
  },
  {
    slug: "ndis-autism-adhd-funding",
    title: "Does the NDIS cover autism assessment? And ADHD and cognitive",
    metaTitle: "Does the NDIS Cover Autism Assessment? (+ ADHD & Cognitive)",
    metaDescription: "Whether the NDIS pays for autism, ADHD, or cognitive assessments — diagnosis versus supports.",
    art: "articles",
    lede: "The NDIS generally funds supports, not the diagnostic assessment that gets you onto the scheme.",
    disclaimer: DISCLAIMER,
    sections: [
      { title: "Diagnosis vs supports", bullets: ["Getting a diagnosis is usually not NDIS-funded.", "Supports can be funded once you are a participant, if reasonable and necessary."] },
      { title: "Autism", paragraphs: ["Autism can be a qualifying condition. Access depends on functional impact, not the label alone."] },
      { title: "ADHD", paragraphs: ["ADHD is not automatically eligible. Access depends on permanent, significant functional impact and a likely lifetime need for support."] },
      { title: "The practical path", numbered: ["Get the diagnosis, usually before applying.", "Gather functional evidence for a hard day.", "Apply with both diagnosis and function.", "If you get in, build a plan around reasonable and necessary supports."] },
    ],
    faqs: [
      { q: "Does the NDIS pay for an autism assessment?", a: "Generally no for the diagnostic assessment to get in. Supports may be funded afterward." },
      { q: "Does the NDIS cover ADHD?", a: "Not automatically. Functional impact and permanence matter." },
    ],
    related: [{ to: "/ndis-eligibility", label: "Eligibility" }, { to: "/ndis-functional-capacity-assessment", label: "FCA" }, { to: "/ndis-access-request", label: "Access request" }],
  },
  {
    slug: "ndis-plan-review",
    title: "How to prepare for your NDIS plan review",
    metaTitle: "How to Prepare for Your NDIS Plan Review",
    metaDescription: "A calm checklist for an NDIS plan review: hard-day notes, evidence, a support person, and questions to rehearse.",
    art: "guide",
    lede: "The conversation goes better when you are not reconstructing a year from memory the night before.",
    disclaimer: DISCLAIMER,
    sections: [{ title: "A short checklist", numbered: ["Know the date and who will be in the room.", "Write a typical hard day, area by area.", "List prompting and supervision.", "Gather reports, a carer statement, and a diary.", "Write three goals in ordinary words.", "Rehearse the questions and print one page."] }],
    faqs: [{ q: "When should I start preparing?", a: "Weeks ahead, not days." }],
    related: [{ to: "/ndis-planning-meeting", label: "Meeting questions" }, { to: "/ndis-plan-reassessment", label: "Reassessment" }, { to: "/prep-pack", label: "Prep Pack" }],
  },
  {
    slug: "ndis-evidence",
    title: "NDIS evidence: what counts and how to gather it",
    metaTitle: "NDIS Evidence: What Counts and How to Gather It",
    metaDescription: "What evidence helps an NDIS plan or access request, and how to keep it on your own device.",
    art: "wallet",
    lede: "Specifics beat impressions.",
    disclaimer: DISCLAIMER,
    sections: [{ title: "What usually helps", bullets: ["Allied health reports that describe function.", "A carer or support statement.", "A diary of hard days and missed tasks.", "Letters that show what happens without support."] }],
    faqs: [{ q: "Does everything have to be a formal report?", a: "No. Notes about real days and unpaid support also matter." }],
    related: [{ to: "/ndis-carer-support-statement", label: "Carer statement" }, { to: "/wallet", label: "Evidence pocket" }],
  },
  {
    slug: "ndis-internal-review",
    title: "NDIS internal review and appeals",
    metaTitle: "NDIS Internal Review and Appeals",
    metaDescription: "What to do if you disagree with an NDIS decision, including internal review and time limits.",
    art: "rights",
    lede: "If you disagree with a decision, you can ask for a review. Time limits apply.",
    disclaimer: DISCLAIMER,
    sections: [{ title: "The usual path", numbered: ["Read the decision letter and the date you received it.", "Ask for an internal review within the time on the letter.", "Say what you disagree with, and attach evidence.", "If you still disagree, ask about external review.", "A free independent advocate can help."] }],
    faqs: [{ q: "Do I lose my current plan while I wait?", a: "Keep using the plan you have until a letter says otherwise." }],
    related: [{ to: "/rights", label: "Know your rights" }, { to: "/ndis-plan-reassessment", label: "Reassessment" }],
  },
  {
    slug: "ndis-eligibility",
    title: "NDIS eligibility checklist",
    metaTitle: "NDIS Eligibility Checklist",
    metaDescription: "A plain-English checklist of what NDIS access usually looks at: age, residence, disability, and functional impact.",
    art: "assess",
    lede: "Access is about more than a diagnosis. Functional impact and permanence matter.",
    disclaimer: DISCLAIMER,
    sections: [{ title: "What access usually looks at", bullets: ["Age and residence rules.", "A disability that is permanent, or likely to be.", "Significant impact on daily function.", "A likely lifetime need for support."], paragraphs: ["Check current access rules on ndis.gov.au. This page is a map, not a decision."] }],
    faqs: [{ q: "Does a diagnosis guarantee access?", a: "No. Diagnosis helps explain the disability. Access still depends on function and the other rules." }],
    related: [{ to: "/ndis-autism-adhd-funding", label: "Autism, ADHD, and assessments" }, { to: "/ndis-access-request", label: "Access request" }],
  },
  {
    slug: "ndis-access-request",
    title: "NDIS access request: what to send",
    metaTitle: "NDIS Access Request",
    metaDescription: "What an NDIS access request usually needs: diagnosis evidence plus how daily life is affected.",
    art: "guide",
    lede: "An access request is stronger when it shows both the diagnosis and what a hard day looks like.",
    disclaimer: DISCLAIMER,
    sections: [{ title: "Usually needed", bullets: ["Evidence of the disability from an appropriate professional.", "How it affects daily tasks on a typical hard day.", "What unofficial support already happens.", "Whether the impact is ongoing."] }],
    faqs: [{ q: "Can I apply without a diagnosis?", a: "Access usually needs evidence of disability. Check the official access pages on ndis.gov.au." }],
    related: [{ to: "/ndis-eligibility", label: "Eligibility checklist" }, { to: "/ndis-evidence", label: "Evidence" }],
  },
];

export function guideBySlug(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
