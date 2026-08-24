import { WHODAS_ITEMS } from "../whodas";
import { DOMAINS } from "../content/language";
import type { NeedDomainId, Respondent, ScaleKind, Screen } from "./types";
import { fill } from "./voice";

export const WHODAS12_IDS = [
  "q1",
  "q4",
  "q7",
  "q11",
  "q12",
  "q13",
  "q16",
  "q17",
  "q21",
  "q25",
  "q29",
  "q33",
];

export const FREQ_SCALE = [
  { value: 0, label: "Never" },
  { value: 1, label: "A few times" },
  { value: 2, label: "Most weeks" },
  { value: 3, label: "Most days" },
  { value: 4, label: "All or nearly all of the time" },
];

export const INTENSITY_SCALE = [
  { value: 0, label: "No extra support" },
  { value: 1, label: "Reminders or someone nearby" },
  { value: 2, label: "Some hands-on help" },
  { value: 3, label: "A lot of help" },
  { value: 4, label: "Someone else has to do it" },
];

export const WHODAS_SCALE = [
  { value: 0, label: "None" },
  { value: 1, label: "Mild" },
  { value: 2, label: "Moderate" },
  { value: 3, label: "Severe" },
  { value: 4, label: "Extreme or cannot do" },
];

export const INTERFERE_SCALE = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Mildly" },
  { value: 2, label: "Moderately" },
  { value: 3, label: "Severely" },
  { value: 4, label: "Extremely" },
];

export function scaleOptions(kind: ScaleKind) {
  if (kind === "freq") return FREQ_SCALE;
  if (kind === "intensity") return INTENSITY_SCALE;
  if (kind === "interfere") return INTERFERE_SCALE;
  if (kind === "days") {
    return Array.from({ length: 11 }, (_, i) => ({
      value: i === 10 ? 30 : i * 3,
      label: i === 10 ? "Every day" : i === 0 ? "0 days" : `About ${i * 3} days`,
    }));
  }
  return WHODAS_SCALE;
}

export const NEED_DOMAINS: {
  id: NeedDomainId;
  title: string;
  ndis: string;
  hint: string;
  example: string;
}[] = [
  {
    id: "mobility",
    title: "Getting around",
    ndis: "mobility",
    hint: "Moving in the home, transfers, leaving the house, distances, and transport.",
    example: "Needs two people to transfer from bed. Cannot use public transport without a known worker.",
  },
  {
    id: "domestic",
    title: "Home and domestic life",
    ndis: "self-management",
    hint: "Meals, shopping, cleaning, laundry, and keeping the home safe.",
    example: "Can microwave a ready meal on a good day. Cannot plan a shop or cook from scratch.",
  },
  {
    id: "selfCare",
    title: "Looking after the body",
    ndis: "self-care",
    hint: "Washing, dressing, eating, toileting, medication prompts, and being alone safely.",
    example: "Needs hands-on help in the shower and dressing. Misses medication without prompts.",
  },
  {
    id: "community",
    title: "Community and civic life",
    ndis: "social interaction",
    hint: "Shops, appointments, recreation, culture, voting, and being in public places.",
    example: "Leaves the house only with a support worker. Crowds lead to a two-day shutdown.",
  },
  {
    id: "communication",
    title: "Communication",
    ndis: "communication",
    hint: "Understanding, being understood, devices, and harder conversations.",
    example: "Uses a device with a known communication partner. Phone calls with strangers do not happen.",
  },
  {
    id: "learning",
    title: "Learning and using information",
    ndis: "learning",
    hint: "Remembering, new tasks, reading forms, following steps, and problem-solving.",
    example: "Cannot complete a Centrelink form without a person sitting with them for the whole task.",
  },
  {
    id: "generalTasks",
    title: "Daily demands and routines",
    ndis: "self-management",
    hint: "Starting the day, managing time, handling change, and staying safe through a routine.",
    example: "Without a visual timetable and a prompt, the morning routine stops and school is missed.",
  },
  {
    id: "lifelong",
    title: "Study, skills and work",
    ndis: "learning",
    hint: "School, TAFE, work, volunteering, and learning new life skills.",
    example: "Attends TAFE only with 1:1 support. Independent work hours are not currently possible.",
  },
  {
    id: "relationships",
    title: "Relationships",
    ndis: "social interaction",
    hint: "Family, friends, workers, and staying in contact without burnout.",
    example: "Wants friends but cannot initiate contact. Recovers for a day after a social visit.",
  },
  {
    id: "behaviour",
    title: "Behaviours that need extra support",
    ndis: "social interaction",
    hint: "Only if relevant: distress, unsafe moments, or support to stay regulated. Skip if not part of life.",
    example: "When overwhelmed, runs toward roads. Needs a known person and a quiet exit plan.",
  },
  {
    id: "mental",
    title: "Feelings, energy and mental health",
    ndis: "self-management",
    hint: "Mood, anxiety, motivation, recovery time, and what support looks like on a hard day.",
    example: "After one appointment, cannot cook or speak for the rest of the day.",
  },
  {
    id: "physical",
    title: "Physical health support needs",
    ndis: "self-care",
    hint: "Disability-related health supports in daily life — not a medical diagnosis. Health treatment stays with the health system.",
    example: "Needs help with a daily therapy program and positioning. GP manages the medical condition.",
  },
];

const CHOICE = {
  age: [
    { value: "0-6", label: "Under 7" },
    { value: "7-14", label: "7 to 14" },
    { value: "15-18", label: "15 to 18" },
    { value: "18-24", label: "18 to 24" },
    { value: "25-44", label: "25 to 44" },
    { value: "45-64", label: "45 to 64" },
    { value: "65plus", label: "65 or over" },
    { value: "skip", label: "Prefer not to say" },
  ],
  ndis: [
    { value: "curious", label: "Just learning — not applying yet" },
    { value: "applying", label: "Thinking of applying, or an access request is in" },
    { value: "participant", label: "Already an NDIS participant" },
    { value: "review", label: "A plan review or reassessment is coming" },
    { value: "unsure", label: "Not sure" },
  ],
  living: [
    { value: "alone", label: "Lives alone" },
    { value: "family", label: "With family or a partner" },
    { value: "housemates", label: "With housemates" },
    { value: "supported", label: "Supported accommodation or SIL-type setting" },
    { value: "other", label: "Other / it changes" },
  ],
  location: [
    { value: "metro", label: "Major city" },
    { value: "regional", label: "Regional" },
    { value: "remote", label: "Remote or very remote" },
    { value: "unsure", label: "Not sure" },
  ],
  hours: [
    { value: "0", label: "None" },
    { value: "1-7", label: "1–7 hours a week" },
    { value: "8-20", label: "8–20 hours a week" },
    { value: "21-40", label: "21–40 hours a week" },
    { value: "40plus", label: "More than 40 hours a week, or overnight" },
    { value: "unsure", label: "Hard to count" },
  ],
  yesno: [
    { value: "yes", label: "Yes" },
    { value: "partly", label: "Partly / it depends" },
    { value: "no", label: "No" },
    { value: "unsure", label: "Not sure" },
  ],
  duration: [
    { value: "under6m", label: "Less than 6 months" },
    { value: "6-12m", label: "6 to 12 months" },
    { value: "1-2y", label: "1 to 2 years" },
    { value: "2-5y", label: "2 to 5 years" },
    { value: "5plus", label: "More than 5 years / since childhood" },
    { value: "unsure", label: "Not sure" },
  ],
};

export function buildScreens(r: Respondent): Screen[] {
  const t = (s: string) => fill(s, r);
  const whodasScreens: Screen[] = DOMAINS.map((d) => ({
    id: `whodas-${d.id}`,
    module: "whodas",
    title: d.title,
    lede: t(
      "Think about the last 30 days. Include the help and equipment {who} usually {have}. Skip anything that does not apply.",
    ),
    ollie: t(
      "There are no trick answers. If it changes day to day, choose what is true on a typical harder day, then you can note the good days.",
    ),
    need: "free",
    fields: WHODAS_ITEMS.filter((i) => i.domain === d.id).map((i) => ({
      id: i.id,
      type: "scale" as const,
      scale: "whodas" as const,
      optional: i.optional,
      prompt: t(`In the last 30 days, how much difficulty did {who} have with: ${i.text.toLowerCase()}?`),
      easy: t(`How hard was this for {who}: ${i.text.toLowerCase()}?`),
    })),
  }));

  const needScreens: Screen[] = NEED_DOMAINS.map((d) => ({
    id: `need-${d.id}`,
    module: "needs",
    title: d.title,
    lede: d.hint,
    ollie: t(
      "This is about support {who} {need} in daily life — not a test. If this area is not part of {their} life, skip it.",
    ),
    need: "core",
    fields: [
      {
        id: `need-${d.id}-freq`,
        type: "scale",
        scale: "freq",
        prompt: t(`How often {do} {who} need extra support with ${d.title.toLowerCase()}?`),
        easy: t(`How often is extra help needed with ${d.title.toLowerCase()}?`),
      },
      {
        id: `need-${d.id}-int`,
        type: "scale",
        scale: "intensity",
        prompt: t(`When support is needed, how much help {do} {who} need?`),
        easy: "How much help is needed?",
      },
      {
        id: `need-${d.id}-note`,
        type: "text",
        optional: true,
        rows: 3,
        prompt: t("Optional: one real example from a usual week."),
        hint: d.example,
        easy: "An example, if you want.",
      },
    ],
  }));

  return [
    {
      id: "welcome",
      module: "intro",
      title: "What is the NDIS — then we practise",
      lede:
        r === "participant"
          ? "The NDIS can fund eligible people with disability, and it can connect anyone with disability to local services. This rehearsal is not the NDIS. Nothing here is sent to the NDIA."
          : "The NDIS can fund eligible people with disability, and it can connect anyone with disability to local services. This rehearsal is not the NDIS. Nothing here is sent to the NDIA.",
      ollie:
        "Official words, in short: the NDIS funds eligible people so they can have more time with family, more independence, skills, work or volunteering, and a better quality of life. It also points anyone with disability toward doctors, groups, clubs, libraries and schools. I am a practice guide, not a government assessor. You can stop, save, or delete everything on this device.",
      need: "core",
      fields: [
        {
          id: "accept-practice",
          type: "choice",
          prompt: "Please confirm you know this is a practice tool only.",
          easy: "This is only practice. OK?",
          options: [
            {
              value: "yes",
              label: "I understand — this is not the NDIA, not NDIS, and not a diagnosis",
            },
          ],
        },
      ],
    },
    {
      id: "who",
      module: "who",
      title: "Who is answering",
      lede: "Wording changes so the questions fit who is in the room.",
      ollie: "There is no wrong role. Pick the one that matches today. You can change it later.",
      need: "free",
      fields: [
        {
          id: "respondent",
          type: "choice",
          prompt: "Who is filling this in?",
          options: [
            { value: "participant", label: "The person this is about" },
            { value: "parent", label: "Parent or guardian" },
            { value: "carer", label: "Carer or family" },
            { value: "nominee", label: "NDIS nominee" },
            { value: "professional", label: "Professional (with consent)" },
          ],
        },
      ],
    },
    {
      id: "about",
      module: "about",
      title: "About the person",
      lede: t("Stays on this device. Use a first name or a nickname if you prefer."),
      ollie: t("You can skip anything you do not want stored here."),
      need: "free",
      fields: [
        {
          id: "name",
          type: "text",
          optional: true,
          rows: 1,
          prompt: t("Name or nickname for {who} (optional)"),
          easy: "A name, if you want.",
        },
        {
          id: "ageBand",
          type: "choice",
          prompt: t("Age group for {who}"),
          options: CHOICE.age,
        },
        {
          id: "ndisStatus",
          type: "choice",
          prompt: "Where are you up to with the NDIS?",
          options: CHOICE.ndis,
        },
        {
          id: "living",
          type: "choice",
          prompt: t("Where {do} {who} usually live?"),
          options: CHOICE.living,
        },
        {
          id: "disabilityWords",
          type: "text",
          optional: true,
          rows: 3,
          prompt: t("In {their} own words, what is the disability or condition? (optional)"),
          hint: "Use the words you already use with a doctor. Plan Decoder will not add a diagnosis.",
          easy: "The disability, in your words.",
        },
        {
          id: "ndisFunctions",
          type: "multi",
          prompt: t("Which of these life areas {are} much harder because of disability?"),
          hint: "These six areas are how NDIS access conversations often talk about function. Tick any that apply.",
          options: [
            { value: "communication", label: "Communication" },
            { value: "social", label: "Social interaction" },
            { value: "learning", label: "Learning" },
            { value: "mobility", label: "Mobility" },
            { value: "self-care", label: "Self-care" },
            { value: "self-management", label: "Self-management (organising life, safety, decisions)" },
          ],
        },
      ],
    },
    {
      id: "pace",
      module: "pace",
      title: "How to go through this",
      lede: "You can save and come back. A typical full rehearsal is 20–40 minutes.",
      ollie: t("If energy is low, do one section and stop. I will keep {whose} answers on this device until you delete them."),
      need: "free",
      fields: [
        {
          id: "energy",
          type: "choice",
          prompt: "How is energy for this, right now?",
          options: [
            { value: "ok", label: "OK to continue" },
            { value: "low", label: "Low — go slowly, one screen at a time" },
            { value: "pause", label: "I may need to stop soon" },
          ],
        },
      ],
    },
    {
      id: "whodas-intro",
      module: "whodas",
      title: "Function in daily life",
      lede: t(
        "This section is inspired by WHODAS 2.0 life areas. It is not an official WHO questionnaire. It asks how much difficulty {who} {have} had.",
      ),
      ollie:
        "Official WHODAS scoring has two methods. Plan Decoder uses average scores (none to extreme) and a simple 0–100 transform of answered items. It does not compute official IRT percentiles.",
      need: "free",
      fields: [
        {
          id: "whodas-length",
          type: "choice",
          prompt: "How many function questions today?",
          options: [
            { value: "short", label: "Shorter set (12 questions) — a snapshot" },
            { value: "full", label: "Full set (36 questions) — more detail for a GP" },
          ],
        },
      ],
    },
    ...whodasScreens,
    {
      id: "whodas-h",
      module: "whodas",
      title: "How much this got in the way",
      lede: t("These extra questions sit beside the life-area scores. Approximate is fine."),
      ollie: t("If you are not sure of exact days, pick the closest band. Skipping is allowed."),
      need: "free",
      fields: [
        {
          id: "h-interfere",
          type: "scale",
          scale: "interfere",
          prompt: t("Overall, how much did these difficulties interfere with {whose} life?"),
        },
        {
          id: "h-days-present",
          type: "scale",
          scale: "days",
          optional: true,
          prompt: "About how many days in the last 30 were these difficulties present?",
        },
        {
          id: "h-days-unable",
          type: "scale",
          scale: "days",
          optional: true,
          prompt: t("About how many days was {who} totally unable to carry out usual activities?"),
        },
        {
          id: "h-days-cut",
          type: "scale",
          scale: "days",
          optional: true,
          prompt: t("About how many days did {who} cut back or reduce what {they} {do}?"),
        },
      ],
    },
    {
      id: "needs-intro",
      module: "needs",
      title: "Support needs rehearsal",
      lede: "The NDIA has said the new support-needs assessment (from mid-2026) looks at support needed across everyday life, plus environment. This is Plan Decoder’s original rehearsal — not the official I-CAN v6.",
      ollie:
        "I will ask how often extra support is needed, and how much help. That is not the official scoring. It is so you can practise describing a week.",
      need: "core",
      fields: [
        {
          id: "needs-ready",
          type: "choice",
          prompt: "Ready to rehearse support needs across 12 life areas?",
          options: [
            { value: "yes", label: "Yes, continue" },
            { value: "later", label: "Skip this module for now" },
          ],
        },
      ],
    },
    ...needScreens,
    {
      id: "environment",
      module: "environment",
      title: "Who is around, and the place",
      lede: t(
        "Public information about the new NDIS assessment says there will also be questions about personal and environmental circumstances. This is Plan Decoder’s practice version.",
      ),
      ollie: t(
        "Informal support (family, friends) matters. So does what happens if that person is unwell. Tell it as it is — not as you wish it were.",
      ),
      need: "free",
      fields: [
        {
          id: "env-who",
          type: "text",
          rows: 2,
          prompt: t("Who is usually in the home with {who}?"),
          easy: "Who lives in the home?",
        },
        {
          id: "env-hours",
          type: "choice",
          prompt: "Unpaid support in a typical week (roughly)",
          options: CHOICE.hours,
        },
        {
          id: "env-ifaway",
          type: "text",
          rows: 3,
          prompt: t("If that unpaid support is unwell or away, what happens for {who}?"),
          easy: "What if the carer is away?",
        },
        {
          id: "env-home",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "Anything about the home that makes daily life harder or easier? (steps, bathroom, distance to shops)",
        },
        {
          id: "env-location",
          type: "choice",
          prompt: "Where is home?",
          options: CHOICE.location,
        },
        {
          id: "env-culture",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "Language, culture, or communication needs an assessor should know?",
        },
        {
          id: "env-transport",
          type: "text",
          optional: true,
          rows: 2,
          prompt: t("How {do} {who} get to shops, health, or community?"),
        },
        {
          id: "env-at",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "Equipment or technology already used?",
        },
        {
          id: "env-safety",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "Any safety issues at home or in the community you want noted?",
        },
      ],
    },
    {
      id: "permanency",
      module: "permanency",
      title: "Is this likely to be ongoing?",
      lede: "NDIS access talks about impairment that is permanent, or likely to be. Only your treating professionals can speak to that. Plan Decoder only records what you already know.",
      ollie:
        "I will not decide if a disability is permanent. I will help you notice what evidence you already have, and what is missing, so a doctor can fill the gaps.",
      need: "core",
      fields: [
        {
          id: "perm-duration",
          type: "choice",
          prompt: t("How long has the main impairment been part of {whose} life?"),
          options: CHOICE.duration,
        },
        {
          id: "perm-clinician",
          type: "choice",
          prompt: "Has a doctor or allied health professional said it is likely to be ongoing or lifelong?",
          options: CHOICE.yesno,
        },
        {
          id: "perm-treatment",
          type: "text",
          rows: 3,
          prompt: "What treatment, therapy, or management has already been tried? (in your words)",
          easy: "What help has already been tried?",
        },
        {
          id: "perm-remedy",
          type: "choice",
          prompt: "As you understand it, is there a treatment expected to fully reverse the impairment?",
          hint: "This is your understanding of what clinicians have said — not a medical finding by Plan Decoder.",
          options: CHOICE.yesno,
        },
        {
          id: "perm-fluctuate",
          type: "choice",
          prompt: t("Does {whose} function change a lot between good days and hard days?"),
          options: CHOICE.yesno,
        },
        {
          id: "perm-evidence",
          type: "multi",
          optional: true,
          prompt: "What written evidence do you already have?",
          options: [
            { value: "gp", label: "GP letter" },
            { value: "specialist", label: "Specialist letter or report" },
            { value: "allied", label: "Allied health (OT, physio, speech, psych)" },
            { value: "school", label: "School or TAFE documents" },
            { value: "hospital", label: "Hospital or discharge summary" },
            { value: "diag", label: "Diagnostic assessment" },
            { value: "none", label: "Nothing written yet" },
          ],
        },
        {
          id: "perm-gap",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "What evidence do you know is missing?",
        },
      ],
    },
    {
      id: "mainstream",
      module: "mainstream",
      title: "Other systems already around you",
      lede: "NDIS is not meant to replace health, education, housing, or informal family support. Practising these questions helps you explain what you have already tried.",
      ollie:
        "If a mainstream service exists but does not actually work for this person, say what was tried and what still does not happen. That is not ingratitude. It is function.",
      need: "core",
      fields: [
        {
          id: "ms-gp",
          type: "choice",
          prompt: "Is there a regular GP or health team?",
          options: CHOICE.yesno,
        },
        {
          id: "ms-health",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "Health or mental health services already used? What is still missing in daily life?",
        },
        {
          id: "ms-edu",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "School, TAFE, or workplace adjustments already in place?",
        },
        {
          id: "ms-house",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "Housing support already in place (public housing, modifications, specialist disability accommodation)?",
        },
        {
          id: "ms-work",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "Employment services or DES, if relevant?",
        },
        {
          id: "ms-why-ndis",
          type: "text",
          rows: 3,
          prompt: t(
            "What still does not happen in daily life, even with those other systems — that {who} {need} disability-specific support for?",
          ),
          easy: "What is still hard after using other services?",
        },
      ],
    },
    {
      id: "complex",
      module: "complex",
      title: "Higher-cost or extra support (optional)",
      lede: "Public material about the new assessment mentions extra modules when needs are more complex (for example equipment, home changes, or behaviour support). Skip if none of this applies.",
      ollie: "Only fill what is true. Leaving this blank is fine.",
      need: "core",
      fields: [
        {
          id: "cx-at",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "Assistive technology or equipment that is needed and not yet in place?",
        },
        {
          id: "cx-home",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "Home modifications being considered?",
        },
        {
          id: "cx-behaviour",
          type: "text",
          optional: true,
          rows: 2,
          prompt: "Behaviour support or a safety plan already in place, or needed?",
        },
        {
          id: "cx-overnight",
          type: "choice",
          optional: true,
          prompt: "Is overnight or 24-hour support part of current life, or being discussed?",
          options: CHOICE.yesno,
        },
      ],
    },
    {
      id: "review",
      module: "review",
      title: "Check before the practice report",
      lede: "You can go back and change answers. Then Plan Decoder will score what you entered and write a practice report you can download.",
      ollie:
        "I will look for gaps and for answers that seem to disagree with each other. That is so you can fix them — not so I can catch you out.",
      need: "free",
      fields: [
        {
          id: "review-ok",
          type: "choice",
          prompt: "Ready to build the practice report from your answers?",
          options: [{ value: "yes", label: "Yes — build the practice report" }],
        },
      ],
    },
  ];
}

export function visibleScreens(
  r: Respondent,
  answers: Record<string, string | number | string[] | null>,
): Screen[] {
  const all = buildScreens(r);
  const short = answers["whodas-length"] === "short";
  const skipNeeds = answers["needs-ready"] === "later";
  return all.filter((s) => {
    if (skipNeeds && (s.module === "needs" && s.id !== "needs-intro")) return false;
    if (short && s.id.startsWith("whodas-")) {
      if (s.id === "whodas-intro" || s.id === "whodas-h") return true;
      return s.fields.some((f) => WHODAS12_IDS.includes(f.id));
    }
    return true;
  }).map((s) => {
    if (short && s.id.startsWith("whodas-") && s.id !== "whodas-intro" && s.id !== "whodas-h") {
      return { ...s, fields: s.fields.filter((f) => WHODAS12_IDS.includes(f.id)) };
    }
    return s;
  });
}
