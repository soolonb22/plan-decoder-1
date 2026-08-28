export const NAVIGATOR_DISCLAIMER =
  "Plan Decoder is not the NDIA, not an official NDIS Navigator, and not a replacement for a Local Area Coordinator, support coordinator, or advocate. Official Navigator roles are still being designed. This walk points to public services. It cannot apply for you, book you in, or promise funding.";

export type NavigatorSituationId =
  | "on-ndis"
  | "self-manage"
  | "funding-change"
  | "not-eligible"
  | "applying"
  | "family"
  | "unsure";

export type NavigatorNeedId =
  | "health"
  | "mental-health"
  | "housing"
  | "money"
  | "work"
  | "learning"
  | "community"
  | "transport"
  | "carers"
  | "kids"
  | "safety"
  | "daily";

export const SITUATIONS: {
  id: NavigatorSituationId;
  title: string;
  lede: string;
}[] = [
  { id: "funding-change", title: "My NDIS funding changed", lede: "A letter, a smaller plan, or supports stopping." },
  { id: "not-eligible", title: "I am not on the NDIS", lede: "Told no, not applying, or waiting outside the scheme." },
  { id: "applying", title: "I am applying or waiting", lede: "Access request, evidence, or a decision not yet in writing." },
  { id: "on-ndis", title: "I have a plan", lede: "I need help using it, or finding things the plan does not cover." },
  { id: "self-manage", title: "I self-manage (or want to)", lede: "Paying providers, keeping records, choosing who to use." },
  { id: "family", title: "I support someone else", lede: "Parent, carer, nominee, or friend walking beside them." },
  { id: "unsure", title: "I am not sure yet", lede: "Start here. We will keep the steps small." },
];

export const NEEDS: {
  id: NavigatorNeedId;
  title: string;
  lede: string;
  say: string;
  steps: string[];
  doors: { name: string; href: string; why: string }[];
}[] = [
  {
    id: "health",
    title: "Health and GP",
    lede: "A doctor, allied health, or hospital follow-up.",
    say: "I need help finding a GP or health service that is accessible. Can you tell me what is bulk billed near me, and if there is a disability liaison?",
    steps: [
      "If it is an emergency, call 000.",
      "Search Healthdirect for a GP or after-hours option.",
      "Ask the clinic about bulk billing, longer appointments, and a quiet waiting space.",
      "If you have a plan, check whether therapy is already in Capacity Building — do not double-pay if a public option fits.",
    ],
    doors: [
      { name: "Healthdirect", href: "https://www.healthdirect.gov.au", why: "Find health services and after-hours advice." },
      { name: "Ask Izzy", href: "https://askizzy.org.au", why: "Housing, food, and health doors in one search." },
    ],
  },
  {
    id: "mental-health",
    title: "Mental health",
    lede: "Feeling unsafe, overwhelmed, or needing someone to talk to.",
    say: "I need a mental health service that understands disability. I prefer a calm, no-rush first contact.",
    steps: [
      "If you are in danger or thinking of suicide, call 000 or Lifeline 13 11 14 now.",
      "Head to Health can match you to a service. You do not need an NDIS plan.",
      "A GP can write a Mental Health Treatment Plan for Medicare psychology.",
      "NDIS psychosocial supports, if you have them, sit beside — not instead of — public mental health.",
    ],
    doors: [
      { name: "Head to Health", href: "https://www.headtohealth.gov.au", why: "Find mental health support, with or without NDIS." },
      { name: "Lifeline", href: "https://www.lifeline.org.au", why: "13 11 14 — 24 hours." },
      { name: "Beyond Blue", href: "https://www.beyondblue.org.au", why: "1300 22 4636." },
    ],
  },
  {
    id: "housing",
    title: "Housing and home",
    lede: "A place to live, stay, or make safer.",
    say: "I need housing or homelessness help. I have a disability and I need an accessible option if you have one.",
    steps: [
      "If you have nowhere safe tonight, Ask Izzy or 1800 628 727 (Link2home in NSW) — use your state’s homelessness line.",
      "Public housing and community housing are mainstream. NDIS does not usually pay rent.",
      "SDA is only for some participants with very high needs. Most people use ordinary housing plus supports.",
      "Keep copies of any notice to leave. An advocate can sit with you.",
    ],
    doors: [
      { name: "Ask Izzy — housing", href: "https://askizzy.org.au", why: "Find local housing and homelessness services." },
      { name: "NDIS housing page", href: "https://www.ndis.gov.au/participants/home-and-living", why: "What the NDIS may fund in a home — and what it does not." },
    ],
  },
  {
    id: "money",
    title: "Money and payments",
    lede: "Centrelink, bills, or stretching a smaller plan.",
    say: "My disability support has changed. I need to check Centrelink, concessions, and free financial counselling.",
    steps: [
      "Services Australia for DSP, JobSeeker, Carer Payment, and concession cards.",
      "National Debt Helpline 1800 007 007 — free financial counselling.",
      "If an NDIS plan changed, keep using the current plan until a letter says otherwise, then map what is no longer funded to mainstream.",
      "Energy and water hardship teams exist. Ask — they are used to this.",
    ],
    doors: [
      { name: "Services Australia", href: "https://www.servicesaustralia.gov.au", why: "Payments, concessions, and disability support pension." },
      { name: "National Debt Helpline", href: "https://ndh.org.au", why: "1800 007 007 — free, confidential." },
    ],
  },
  {
    id: "work",
    title: "Work",
    lede: "A job, a workplace adjustment, or leaving work safely.",
    say: "I have a disability and I am looking for work or a workplace adjustment. Can you tell me about Disability Employment Services or JobAccess?",
    steps: [
      "JobAccess 1800 464 800 — workplace adjustments and Wage Subsidy information.",
      "Disability Employment Services (DES) are mainstream. You do not need NDIS for DES.",
      "If you have Capacity Building in a plan, check it does not clash with a free public service first.",
    ],
    doors: [
      { name: "JobAccess", href: "https://www.jobaccess.gov.au", why: "Work, adjustments, and employer help." },
      { name: "Workforce Australia", href: "https://www.workforceaustralia.gov.au", why: "Job search and DES referrals." },
    ],
  },
  {
    id: "learning",
    title: "Learning and school",
    lede: "School, TAFE, uni, or adult learning.",
    say: "I need disability support at school or TAFE. Who is the disability liaison, and what adjustments can you offer?",
    steps: [
      "Schools and TAFEs have disability support. That is education’s job, not usually the NDIS.",
      "Ask for the reasonable adjustment in writing.",
      "NDIS may fund some therapy that helps you attend — it does not replace the school’s duty.",
    ],
    doors: [
      { name: "Your state education department", href: "https://www.education.gov.au", why: "Start here, then your state school disability page." },
      { name: "NDIS and school", href: "https://www.ndis.gov.au/understanding/ndis-and-other-government-services/education", why: "What NDIS may fund around education — and what schools fund." },
    ],
  },
  {
    id: "community",
    title: "Community and activities",
    lede: "A group, library, sport, art, or somewhere to belong.",
    say: "I am looking for a local group that is disability-friendly. Quiet options help. I do not need a sales pitch.",
    steps: [
      "Start with the library, neighbourhood centre, or council inclusion officer — they are free.",
      "My Community Directory and Ask Izzy list groups by suburb.",
      "Visit once. Rate how it felt for you, privately, in this tool. You can leave if it is not right.",
      "NDIS community access is extra, not the only door.",
    ],
    doors: [
      { name: "My Community Directory", href: "https://www.mycommunitydirectory.com.au", why: "Local groups and services by suburb." },
      { name: "Ask Izzy", href: "https://askizzy.org.au", why: "Community and everyday supports." },
    ],
  },
  {
    id: "transport",
    title: "Getting around",
    lede: "Buses, taxis, community transport, or concessions.",
    say: "I need accessible transport or a concession. What community transport or taxi subsidy exists here?",
    steps: [
      "State transport concessions and taxi subsidy schemes are mainstream.",
      "Community transport often sits with councils or aged-care partners — ask even if you are under 65.",
      "NDIS transport is only in some plans, and it does not replace public transport duty.",
    ],
    doors: [
      { name: "Your state transport page", href: "https://www.australia.gov.au", why: "Find your state’s concession and accessible transport page." },
      { name: "Ask Izzy", href: "https://askizzy.org.au", why: "Local transport and practical help." },
    ],
  },
  {
    id: "carers",
    title: "For carers",
    lede: "A break, counselling, or someone who gets it.",
    say: "I am a carer. I need Carer Gateway, a break, or counselling. The person I support may or may not have NDIS.",
    steps: [
      "Carer Gateway 1800 422 737 — counselling, respite packages, and peer support. Free. Not NDIS.",
      "Carer Payment / Carer Allowance is Services Australia.",
      "Your needs count even when the plan is not about you.",
    ],
    doors: [
      { name: "Carer Gateway", href: "https://www.carergateway.gov.au", why: "1800 422 737 — support for carers." },
      { name: "Services Australia — carers", href: "https://www.servicesaustralia.gov.au/individuals/carers", why: "Payments for carers." },
    ],
  },
  {
    id: "kids",
    title: "Children and young people",
    lede: "Early childhood, school-age, or a young adult.",
    say: "My child has additional needs. I need to know what is school, what is health, and what might be NDIS or foundational supports.",
    steps: [
      "Under 9, ask about the NDIS early childhood approach — and also child health and preschool inclusion.",
      "Foundational supports and programs such as Thriving Kids are still being rolled out. Check your state. Do not wait alone.",
      "Schools must still make reasonable adjustments.",
      "Kids Helpline 1800 55 1800.",
    ],
    doors: [
      { name: "NDIS early childhood", href: "https://www.ndis.gov.au/understanding/families-and-carers/early-childhood-approach-children-younger-9", why: "Early childhood approach for younger children." },
      { name: "Kids Helpline", href: "https://kidshelpline.com.au", why: "1800 55 1800." },
    ],
  },
  {
    id: "safety",
    title: "Staying safe",
    lede: "Abuse, neglect, feeling unsafe with a provider, or at home.",
    say: "I do not feel safe. I need a confidential service. Please do not contact the person I am worried about.",
    steps: [
      "If you are in danger now, call 000.",
      "NDIS Commission 1800 035 544 — quality and safety of NDIS supports.",
      "1800RESPECT 1800 737 732 — domestic, family and sexual violence.",
      "You can complain and still keep your plan. An advocate can call with you.",
    ],
    doors: [
      { name: "000", href: "https://www.triplezero.gov.au", why: "Police, fire, ambulance." },
      { name: "NDIS Commission", href: "https://www.ndiscommission.gov.au", why: "1800 035 544 — provider and worker safety." },
      { name: "1800RESPECT", href: "https://www.1800respect.org.au", why: "1800 737 732." },
    ],
  },
  {
    id: "daily",
    title: "Everyday life",
    lede: "Meals, cleaning, personal care, or a bit of help at home.",
    say: "I need help at home. I may or may not have NDIS. What council, health, or community options exist?",
    steps: [
      "Council and community care exist beside NDIS. Ask the council inclusion or community care team.",
      "If you are 65+ (or 50+ for some Aboriginal and Torres Strait Islander people), My Aged Care is the usual door.",
      "If NDIS Core covers daily living, still map backup options for when hours run out.",
    ],
    doors: [
      { name: "My Aged Care", href: "https://www.myagedcare.gov.au", why: "Home support if you are in the aged-care age group." },
      { name: "Ask Izzy", href: "https://askizzy.org.au", why: "Meals, material aid, and local help." },
    ],
  },
];

export const ALWAYS: { name: string; href: string; detail: string }[] = [
  { name: "Emergency", href: "tel:000", detail: "000" },
  { name: "NDIS", href: "https://www.ndis.gov.au", detail: "1800 800 110" },
  { name: "Interpreter (TIS)", href: "https://www.tisnational.gov.au", detail: "131 450" },
  { name: "Disability advocacy", href: "https://disabilityadvocacyfinder.dss.gov.au", detail: "Find an advocate" },
];

export const FUNDING_CHANGE_STEPS = [
  "Keep the letter. Write the date you received it. Review clocks often start from that date.",
  "Keep using the plan you have until a new letter says otherwise.",
  "List what still happens without NDIS hours — family, health, school, council, community.",
  "You can ask for an internal review of many NDIS decisions. Usually 3 months from the decision. Free.",
  "An independent advocate can sit with you. That is not the same as a support coordinator.",
  "Do not sign a new service agreement in a rush. You can say you need a week.",
];

export function needsByIds(ids: NavigatorNeedId[]) {
  return NEEDS.filter((n) => ids.includes(n.id));
}
