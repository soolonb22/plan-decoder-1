/** Independent rehearsal maps. Not a government system. Not legal advice. */

export const SYSTEMS_WALK_TITLE = "Plan Decoder · Systems walk";
export const SYSTEMS_WALK_TAGLINE =
  "Practise the conversation. Not the government form. Not the NDIA, not official NDIS Navigator, not legal advice.";
export const SYSTEMS_WALK_PLUM = "#6E2C92";

export const SYSTEMS_WALK_DISCLAIMER =
  "Plan Decoder is not the NDIA, not an official NDIS Navigator, and not a government system. Systems walk is a rehearsal map so you can practise what to say. It cannot decide eligibility, funding, or a tenancy outcome. It is not legal advice.";

export const SYSTEMS = ["Housing", "NDIS", "Providers", "School", "Health", "Centrelink"] as const;
export type SystemName = (typeof SYSTEMS)[number];

export type NavigatorFlags = Record<string, boolean | string | number | null | undefined>;

export type OfficialRef = { name: string; href: string };

export type SystemsWorldModel = {
  paper: string;
  systemDoor: string;
  whatThisIs: string;
  whatThisIsNot: string;
  usualWindow?: string;
  keep: string[];
  official?: OfficialRef[];
};

export type SystemsIntent = {
  practise: string;
  notTryingTo: string;
  wordsYouCanUse: string;
};

export type NavigatorReport = {
  scenario: { system: string; situation: string; flags: NavigatorFlags };
  worldModel: SystemsWorldModel;
  interpretations: { meaning: string }[];
  intent: SystemsIntent;
  risks: { risks_detected: string[] };
  routes: { name: string; actions: string[] }[];
};

export type SystemDemo = {
  id: string;
  system: SystemName;
  label: string;
  situation: string;
  flags: NavigatorFlags;
};

export type SystemCheckbox = {
  flag: string;
  label: string;
};

export const FORM11_NOTICE_HREF =
  "https://www.rta.qld.gov.au/forms-resources/forms/forms-for-general-tenancies/notice-to-remedy-breach-form-11";
export const FORM11_BREACH_HREF = "https://www.rta.qld.gov.au/during-a-tenancy/breach-of-the-agreement";
export const NDIS_REVIEW_HREF =
  "https://www.ndis.gov.au/participants/changing-your-plan/decision-reviews/how-request-review-decision";
export const NDIS_APPLY_HREF = "https://www.ndis.gov.au/applying/application-process/how-apply";
export const NDIS_SERVICE_AGREEMENT_HREF =
  "https://www.ndis.gov.au/participants/working-providers/arranging-supports/what-service-agreement";
export const NDIS_COMMISSION_COMPLAINTS_HREF = "https://www.ndiscommission.gov.au/complaints";
export const DSE_HREF = "https://www.education.gov.au/disability-standards-education-2005";
export const NDIS_EDUCATION_HREF =
  "https://www.ndis.gov.au/understanding/ndis-and-other-government-services/education";
export const HEALTHDIRECT_HREF = "https://www.healthdirect.gov.au";
export const SERVICES_AUSTRALIA_HREF = "https://www.servicesaustralia.gov.au";

const SHARED_NOT = "Not the NDIA. Not an official NDIS Navigator. Not legal advice. Not a promise of a result.";
const READ_THE_DATE =
  "Read the date written on the paper in front of you. That date is the one that matters. This walk does not invent a new clock.";

export const SYSTEM_CHECKBOX: Record<SystemName, SystemCheckbox> = {
  Housing: {
    flag: "form11",
    label: "This looks like a Queensland Form 11 (notice to remedy breach)",
  },
  NDIS: {
    flag: "reviewLetter",
    label: "This looks like a written NDIS decision or review letter",
  },
  Providers: {
    flag: "serviceAgreement",
    label: "This looks like a service agreement I am asked to sign",
  },
  School: {
    flag: "adjustment",
    label: "I need a written classroom or course adjustment",
  },
  Health: {
    flag: "discharge",
    label: "This looks like a hospital discharge conversation",
  },
  Centrelink: {
    flag: "letter",
    label: "I have a Services Australia or Centrelink letter",
  },
};

export const SYSTEM_DEMOS: Record<SystemName, SystemDemo[]> = {
  Housing: [
    {
      id: "housing-form11",
      system: "Housing",
      label: "Try the Housing Form 11 demo",
      situation: "Form 11 issued; tenant disputes breach",
      flags: { form11: true },
    },
  ],
  NDIS: [
    {
      id: "ndis-review",
      system: "NDIS",
      label: "Try the NDIS review letter demo",
      situation: "Written review letter about a plan decision; I want to practise what to say",
      flags: { reviewLetter: true },
    },
    {
      id: "ndis-access",
      system: "NDIS",
      label: "Try the NDIS access conversation demo",
      situation: "Access conversation about applying; I want to practise describing a usual day",
      flags: { accessConversation: true },
    },
  ],
  Providers: [
    {
      id: "providers-agreement",
      system: "Providers",
      label: "Try the service agreement demo",
      situation: "Provider sent a service agreement and wants me to sign this week",
      flags: { serviceAgreement: true },
    },
    {
      id: "providers-safety",
      system: "Providers",
      label: "Try the safety conversation demo",
      situation: "I do not feel safe with a worker and I need to practise what to say",
      flags: { unsafe: true },
    },
  ],
  School: [
    {
      id: "school-adjustment",
      system: "School",
      label: "Try the classroom adjustment demo",
      situation: "I need a written classroom adjustment and a named disability liaison",
      flags: { adjustment: true },
    },
    {
      id: "school-exclusion",
      system: "School",
      label: "Try the suspension conversation demo",
      situation: "School sent a suspension notice; I want to practise the next conversation",
      flags: { exclusion: true },
    },
  ],
  Health: [
    {
      id: "health-discharge",
      system: "Health",
      label: "Try the hospital discharge demo",
      situation: "Hospital discharge plan in my hand; I need to practise the follow-up conversation",
      flags: { discharge: true },
    },
    {
      id: "health-gp",
      system: "Health",
      label: "Try the GP conversation demo",
      situation: "I want a longer GP appointment to talk about a usual day and a hard day",
      flags: { gp: true },
    },
  ],
  Centrelink: [
    {
      id: "centrelink-letter",
      system: "Centrelink",
      label: "Try the Services Australia letter demo",
      situation: "Services Australia letter about a payment; I want to practise what to ask",
      flags: { letter: true },
    },
    {
      id: "centrelink-debt",
      system: "Centrelink",
      label: "Try the debt letter demo",
      situation: "Centrelink debt or overpayment letter; I want to practise the next conversation",
      flags: { debt: true },
    },
  ],
};

export const HOUSING_FORM11_DEMO = {
  system: SYSTEM_DEMOS.Housing[0].system,
  situation: SYSTEM_DEMOS.Housing[0].situation,
  flags: SYSTEM_DEMOS.Housing[0].flags,
};

export const NDIS_REVIEW_DEMO = SYSTEM_DEMOS.NDIS[0];
export const NDIS_ACCESS_DEMO = SYSTEM_DEMOS.NDIS[1];

export function primaryDemo(system: SystemName): SystemDemo {
  return SYSTEM_DEMOS[system][0];
}

export function generateNavigatorReport(
  system: string,
  situation: string,
  flags: NavigatorFlags = {},
): NavigatorReport {
  const scenario = { system, situation, flags };
  const name = normaliseSystem(system);
  if (name === "Housing") return housingWalk(scenario);
  if (name === "NDIS") return ndisWalk(scenario);
  if (name === "Providers") return providersWalk(scenario);
  if (name === "School") return schoolWalk(scenario);
  if (name === "Health") return healthWalk(scenario);
  if (name === "Centrelink") return centrelinkWalk(scenario);
  return genericWalk(scenario);
}

export function normaliseSystem(system: string): SystemName | "Other" {
  const key = system.trim().toLowerCase();
  if (key === "housing" || key === "tenancy" || key === "rta") return "Housing";
  if (key === "ndis" || key === "plan" || key === "ndia") return "NDIS";
  if (key === "providers" || key === "provider" || key === "support") return "Providers";
  if (key === "school" || key === "education" || key === "tafe") return "School";
  if (key === "health" || key === "gp" || key === "hospital") return "Health";
  if (key === "centrelink" || key === "services australia" || key === "payments") return "Centrelink";
  const exact = SYSTEMS.find((s) => s.toLowerCase() === key);
  return exact ?? "Other";
}

function flagOn(flags: NavigatorFlags, key: string) {
  const value = flags[key];
  return value === true || String(value).toLowerCase() === "true";
}

function isForm11(situation: string, flags: NavigatorFlags) {
  if (flagOn(flags, "form11")) return true;
  return /form\s*11/i.test(situation);
}

function ndisKind(situation: string, flags: NavigatorFlags): "review" | "access" | "generic" {
  const review =
    flagOn(flags, "reviewLetter") ||
    /review letter|internal review|written decision|decision letter|review of a decision/i.test(situation);
  const access =
    flagOn(flags, "accessConversation") ||
    /access (request|conversation|meeting|form)|applying|apply for (the )?ndis/i.test(situation);
  if (review && !access) return "review";
  if (access && !review) return "access";
  if (review && access) {
    if (/review|decision letter|written decision/i.test(situation) && !/access/i.test(situation)) return "review";
    if (/access|apply/i.test(situation) && !/review|decision/i.test(situation)) return "access";
    if (flagOn(flags, "reviewLetter") && !flagOn(flags, "accessConversation")) return "review";
    if (flagOn(flags, "accessConversation") && !flagOn(flags, "reviewLetter")) return "access";
    return "review";
  }
  return "generic";
}

function providersKind(situation: string, flags: NavigatorFlags): "agreement" | "unsafe" | "generic" {
  const unsafe =
    flagOn(flags, "unsafe") || /not (feel )?safe|unsafe|complaint|commission|hurt|abuse/i.test(situation);
  const agreement =
    flagOn(flags, "serviceAgreement") || /service agreement|sign|quote|contract/i.test(situation);
  if (unsafe) return "unsafe";
  if (agreement) return "agreement";
  return "generic";
}

function schoolKind(situation: string, flags: NavigatorFlags): "adjustment" | "exclusion" | "generic" {
  const exclusion =
    flagOn(flags, "exclusion") || /suspen|exclu|expel|stand[ -]?down|cannot come to (school|class)/i.test(situation);
  const adjustment =
    flagOn(flags, "adjustment") || /adjust|reasonable adjustment|inclusion|disability liaison/i.test(situation);
  if (exclusion) return "exclusion";
  if (adjustment) return "adjustment";
  return "generic";
}

function healthKind(situation: string, flags: NavigatorFlags): "discharge" | "gp" | "generic" {
  const discharge =
    flagOn(flags, "discharge") || /discharge|hospital|emergency department|\bed\b/i.test(situation);
  const gp =
    flagOn(flags, "gp") ||
    /gp|general practitioner|mental health treatment plan|longer appointment|bulk bill/i.test(situation);
  if (discharge) return "discharge";
  if (gp) return "gp";
  return "generic";
}

function centrelinkKind(situation: string, flags: NavigatorFlags): "debt" | "letter" | "generic" {
  const debt = flagOn(flags, "debt") || /debt|overpayment|owe|repay/i.test(situation);
  const letter =
    flagOn(flags, "letter") || /letter|payment|concession|dsp|jobseeker|carer payment|reference number/i.test(situation);
  if (debt) return "debt";
  if (letter) return "letter";
  return "generic";
}

function housingWalk(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return isForm11(scenario.situation, scenario.flags) ? housingForm11(scenario) : housingGeneric(scenario);
}

function housingForm11(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Form 11 — Notice to remedy breach (Queensland general tenancy)",
      systemDoor: "Residential Tenancies Authority. This walk is not the RTA.",
      whatThisIs:
        "A notice that someone thinks a term of the tenancy agreement has been broken, and asking for that problem to be fixed.",
      whatThisIsNot:
        "Not an eviction order. Not a lock-out. Not a QCAT decision. The Form 11 should not be sent to the RTA — keep a copy for your records.",
      usualWindow:
        "For a general residential tenancy breach the usual 7-day remedy window applies. Read the date written on your notice. That date is the one that matters.",
      keep: [
        "Keep the Form 11. Do not post or email it to the RTA as if they issued it.",
        "Write the day you received it.",
        "If you dispute the breach, say so in writing after you talk.",
      ],
      official: [
        { name: "Notice to remedy breach (Form 11)", href: FORM11_NOTICE_HREF },
        { name: "Breach of the agreement", href: FORM11_BREACH_HREF },
      ],
    },
    interpretations: [
      {
        meaning:
          "Someone claims there has been a breach. The paper asks for a remedy. It does not, by itself, end the tenancy.",
      },
      {
        meaning:
          "You dispute the breach. The first job is to talk, then use the RTA’s free dispute resolution if talking does not settle it.",
      },
      {
        meaning:
          "The date on the notice is a usual 7-day remedy window, not an automatic eviction. Read that date. Do not invent a new one.",
      },
    ],
    intent: {
      practise:
        "A calm conversation, a written record, then the official doors if talking does not settle it.",
      notTryingTo:
        "Win a case, guess a QCAT outcome, or replace the RTA, QCAT, or a lawyer. This is not legal advice.",
      wordsYouCanUse:
        "I have a Form 11. I do not agree there was a breach. I want to talk it through and keep a copy of what we agree.",
    },
    risks: {
      risks_detected: [
        "Treating a Form 11 as an eviction order",
        "Sending the Form 11 to the RTA",
        "Missing the remedy date written on the notice",
        "Going to QCAT on a non-urgent matter before RTA dispute resolution",
        "Signing a new agreement or payment plan in a rush",
      ],
    },
    routes: [
      {
        name: "Talk first",
        actions: [
          "Contact the person who issued the Form 11. Say you dispute the breach.",
          "Ask what they say you did, and what they want fixed.",
          "Keep notes of the call or email. Do not send the Form 11 to the RTA.",
          "If you are not safe tonight, use a homelessness service or call 000. That is separate from this paper.",
        ],
      },
      {
        name: "RTA dispute resolution",
        actions: [
          "If talking does not settle it, use the RTA’s free dispute resolution.",
          "The Form 11 still should not be sent to the RTA as if they are the sender. Keep your copy.",
          "Read the official Form 11 and breach pages before you call.",
        ],
      },
      {
        name: "QCAT Form 2 after a Notice of Unresolved Dispute",
        actions: [
          "For non-urgent matters, the usual next paper after unresolved RTA dispute resolution is a Notice of Unresolved Dispute.",
          "People then often use QCAT Form 2. Read the papers in front of you.",
          "This walk does not add extra legal steps or deadlines. An advocate or tenant service can sit with you.",
        ],
      },
    ],
  };
}

function housingGeneric(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Housing or tenancy conversation",
      systemDoor: "State housing, community housing, or the tenancy authority in your state.",
      whatThisIs: "A place to live, stay, or make safer. NDIS does not usually pay rent.",
      whatThisIsNot: `${SHARED_NOT} This walk does not invent a notice-to-leave clock or a Form 12 outcome.`,
      usualWindow: READ_THE_DATE,
      keep: [
        "Keep copies of any notice.",
        "Public and community housing are mainstream doors.",
        "An advocate can sit with you.",
      ],
    },
    interpretations: [
      { meaning: "Housing is its own system. A practice walk here does not apply for a house." },
      { meaning: "If the paper is a Queensland Form 11, use the Form 11 walk. That notice is not an eviction order." },
      {
        meaning:
          "If the paper is a notice to leave or another housing form, read the date on that paper. This walk does not invent that clock.",
      },
    ],
    intent: {
      practise: "Name the paper in front of you and the next human conversation.",
      notTryingTo: "Promise a house or decide a tenancy case. This is not legal advice.",
      wordsYouCanUse: "I need housing help. I have a disability. I need an accessible option if you have one.",
    },
    risks: {
      risks_detected: [
        "Waiting on NDIS for rent",
        "Throwing away a notice",
        "Treating a Form 11 as an eviction order",
        "Guessing a notice-to-leave deadline that is not on the paper",
      ],
    },
    routes: [
      {
        name: "Read the paper",
        actions: [
          "Name the form and the date on it.",
          "If it is a Queensland Form 11, it is a notice to remedy breach — not an eviction order.",
          "If it is another notice, stay with the date printed on it. Do not borrow the Form 11 window.",
        ],
      },
      {
        name: "Talk, then the tenancy door",
        actions: [
          "Talk with the other party first.",
          "Then use your state’s tenancy authority. In Queensland that is the RTA.",
        ],
      },
    ],
  };
}

function ndisWalk(scenario: NavigatorReport["scenario"]): NavigatorReport {
  const kind = ndisKind(scenario.situation, scenario.flags);
  if (kind === "review") return ndisReviewLetter(scenario);
  if (kind === "access") return ndisAccessConversation(scenario);
  return ndisGeneric(scenario);
}

function ndisReviewLetter(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Written NDIS decision or review letter",
      systemDoor: "NDIA review path on the letter. This walk is not the NDIA and not an official NDIS Navigator.",
      whatThisIs:
        "A rehearsal for reading a written decision, naming what you disagree with, and finding the review path printed on that letter.",
      whatThisIsNot: `${SHARED_NOT} It does not start a review, keep a plan, or quote a dollar amount.`,
      usualWindow: READ_THE_DATE,
      keep: [
        "Keep the letter and the envelope if you have it.",
        "Write the day you received it.",
        "Use the current plan until a new letter says otherwise.",
      ],
      official: [{ name: "How to request a review of a decision", href: NDIS_REVIEW_HREF }],
    },
    interpretations: [
      {
        meaning:
          "A written decision is different from an access conversation. This paper is about a decision that has already been made.",
      },
      {
        meaning:
          "The letter usually names a review path. Read that path. This walk does not lodge the review for you.",
      },
      { meaning: "Housing, school, health, and Centrelink still have their own doors while you read this letter." },
    ],
    intent: {
      practise: "Name the decision in one sentence, then practise asking about the review path on the page.",
      notTryingTo: "Decide a plan, quote a budget, or speak as the official NDIS Navigator.",
      wordsYouCanUse:
        "I have a written decision. I want to understand the review path on this letter. I will keep using my current plan until a new letter says otherwise.",
    },
    risks: {
      risks_detected: [
        "Treating this tool as an official NDIS Navigator",
        "Guessing a review clock instead of reading the date on the letter",
        "Signing a new service agreement in a rush",
        "Mixing an access conversation with a review letter",
      ],
    },
    routes: [
      {
        name: "Read the letter",
        actions: [
          "Name the decision and the date on the page.",
          "Find the review path printed on the letter. Read that. Do not invent a new date.",
          "This walk does not start a review.",
        ],
      },
      {
        name: "Practise what you will say",
        actions: [
          "Write one sentence about what the letter decided.",
          "Write one sentence about what you want checked.",
          "Take a support person if you want one.",
        ],
      },
      {
        name: "Other systems still",
        actions: [
          "Map what still sits with school, health, housing, or Centrelink.",
          "Use Community navigator if you need local doors.",
        ],
      },
    ],
  };
}

function ndisAccessConversation(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "NDIS access conversation",
      systemDoor: "Applying or talking about access. This walk is not the NDIA and not an official NDIS Navigator.",
      whatThisIs:
        "A rehearsal for describing a usual day and a hard day, and what already sits with school, health, or housing.",
      whatThisIsNot: `${SHARED_NOT} It does not say you will get a plan. It does not quote funding.`,
      usualWindow: READ_THE_DATE,
      keep: [
        "Write three short lines: usual day, hard day, who already helps.",
        "Keep copies of any reports you already have. This walk does not collect them.",
        "School, health, and housing still have jobs even if you are talking about access.",
      ],
      official: [{ name: "How to apply", href: NDIS_APPLY_HREF }],
    },
    interpretations: [
      {
        meaning:
          "An access conversation is about describing daily life. It is not a review of a written decision.",
      },
      {
        meaning:
          "A practice walk cannot lodge an access request or say what the NDIA will decide.",
      },
      { meaning: "Mainstream doors stay open. Access talk does not pause school, health, or housing." },
    ],
    intent: {
      practise: "Plain words about a usual day and a hard day, without asking this tool for a plan.",
      notTryingTo: "Promise a plan, quote a budget, or speak as the official NDIS Navigator.",
      wordsYouCanUse:
        "On a usual day I can… On a hard day I need… School / health / housing still covers… I want to talk about daily life, not a dollar amount.",
    },
    risks: {
      risks_detected: [
        "Treating this tool as an official NDIS Navigator",
        "Asking this page whether you will get a plan",
        "Quoting a funding amount in the access conversation",
        "Waiting on access before you call school, health, or housing",
      ],
    },
    routes: [
      {
        name: "Practise the conversation",
        actions: [
          "Write three short lines: usual day, hard day, who already helps.",
          "Say what still sits with another system. Do not ask this walk for a plan.",
        ],
      },
      {
        name: "Read any paper you already have",
        actions: [
          "If a letter has arrived, read the date and the path on that page.",
          "If there is no letter yet, do not invent a clock.",
        ],
      },
      {
        name: "Other systems still",
        actions: [
          "Keep using school, health, housing, or Centrelink doors.",
          "Use Community navigator if you need local doors.",
        ],
      },
    ],
  };
}

function ndisGeneric(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "NDIS letter, meeting, or plan conversation",
      systemDoor: "NDIA and your plan. This walk is not the NDIA and not an official NDIS Navigator.",
      whatThisIs: "A rehearsal for how you describe daily life, supports, and what still sits with school, health, or housing.",
      whatThisIsNot: `${SHARED_NOT} It does not say if you will get a plan, keep a plan, or receive a dollar amount.`,
      usualWindow: READ_THE_DATE,
      keep: [
        "Keep the letter if you have one.",
        "Use the current plan until a new letter says otherwise.",
        "Write what a hard day looks like in your own words.",
      ],
    },
    interpretations: [
      { meaning: "NDIS sits beside housing, school, health, and Centrelink. It does not replace those doors." },
      { meaning: "If the paper is a written decision, use the review letter walk. If it is about applying, use the access walk." },
    ],
    intent: {
      practise: "Plain words about a usual day and a hard day, and which other system still has a job.",
      notTryingTo: "Decide a plan, quote a budget, or speak as the official NDIS Navigator.",
      wordsYouCanUse:
        "On a usual day I can… On a hard day I need… School / health / housing still covers… I want NDIS for…",
    },
    risks: {
      risks_detected: [
        "Treating this tool as an official NDIS Navigator",
        "Guessing a funding amount",
        "Ignoring a date written on a decision letter",
        "Signing a new service agreement in a rush",
      ],
    },
    routes: [
      {
        name: "Name the paper",
        actions: [
          "If you have a written decision, try the review letter walk.",
          "If you are talking about applying, try the access conversation walk.",
        ],
      },
      {
        name: "Practise the conversation",
        actions: [
          "Write three short lines: usual day, hard day, who already helps.",
          "Take a support person if you want one.",
        ],
      },
      {
        name: "Other systems still",
        actions: [
          "Map what still sits with school, health, housing, or Centrelink.",
          "Use Community navigator if you need local doors.",
        ],
      },
    ],
  };
}

function providersWalk(scenario: NavigatorReport["scenario"]): NavigatorReport {
  const kind = providersKind(scenario.situation, scenario.flags);
  if (kind === "unsafe") return providersUnsafe(scenario);
  if (kind === "agreement") return providersAgreement(scenario);
  return providersGeneric(scenario);
}

function providersAgreement(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Service agreement or quote to sign",
      systemDoor: "The provider. This walk is not a recommended list.",
      whatThisIs: "A rehearsal for what they will do, which plan pot they will claim from, and how you can pause.",
      whatThisIsNot: `${SHARED_NOT} It does not rate a business, approve a quote, or pick a provider for you.`,
      usualWindow: "You can say you need a week before you sign. There is no signing deadline on this page.",
      keep: [
        "You can say you need a week before you sign.",
        "Ask which plan pot they will claim from.",
        "Keep a copy of anything you sign.",
      ],
      official: [{ name: "What is a service agreement", href: NDIS_SERVICE_AGREEMENT_HREF }],
    },
    interpretations: [
      { meaning: "A quote is not an approval. The plan letter and the my NDIS app still win." },
      { meaning: "This page does not recommend a provider. It only helps you practise questions." },
    ],
    intent: {
      practise: "Clear questions before money or hours move.",
      notTryingTo: "Recommend a provider or promise the Commission will uphold a complaint.",
      wordsYouCanUse:
        "Please write what you will do, which budget it comes from, and how I pause or end this. I will not sign today.",
    },
    risks: {
      risks_detected: [
        "Paying a deposit you cannot reclaim",
        "Signing in a rush",
        "Treating this page as a recommended list",
      ],
    },
    routes: [
      {
        name: "Questions before you sign",
        actions: [
          "What will you do, how often, and in which budget?",
          "How do I pause or end this? I need that in writing.",
          "I will not sign today. I need a week.",
        ],
      },
      {
        name: "Read the official page",
        actions: [
          "Read what a service agreement is meant to cover.",
          "Compare that list with the paper in your hand.",
        ],
      },
      {
        name: "If you do not feel safe",
        actions: [
          "If you are in danger now, call 000.",
          "NDIS Commission 1800 035 544 for quality and safety of NDIS supports.",
        ],
      },
    ],
  };
}

function providersUnsafe(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Safety or quality conversation about a worker or provider",
      systemDoor: "Safety first, then the NDIS Commission. This walk is not a recommended list.",
      whatThisIs: "A rehearsal for saying you do not feel safe, and which door is for quality and safety.",
      whatThisIsNot: `${SHARED_NOT} It does not promise the Commission will uphold a complaint or name a replacement provider.`,
      usualWindow: "If you are in danger now, call 000. Safety does not wait on this rehearsal.",
      keep: [
        "You can complain and still keep your plan.",
        "An advocate can call with you.",
        "You do not have to stay polite to stay safe.",
      ],
      official: [{ name: "NDIS Commission complaints", href: NDIS_COMMISSION_COMPLAINTS_HREF }],
    },
    interpretations: [
      { meaning: "Feeling unsafe with a worker is a safety door, not a politeness problem." },
      { meaning: "This page will not pick a new provider for you." },
    ],
    intent: {
      practise: "A short, clear sentence about safety, then the Commission number if you want it.",
      notTryingTo: "Recommend a provider or promise a complaint outcome.",
      wordsYouCanUse:
        "I do not feel safe. Please do not contact the person I am worried about. I want the NDIS Commission number and an advocate.",
    },
    risks: {
      risks_detected: [
        "Staying with a worker who does not feel safe",
        "Waiting for this tool to recommend someone else",
        "Skipping 000 when it is an emergency",
      ],
    },
    routes: [
      {
        name: "If you are in danger now",
        actions: ["Call 000.", "Ask a trusted person to sit with you if that helps."],
      },
      {
        name: "Quality and safety door",
        actions: [
          "NDIS Commission 1800 035 544 for quality and safety of NDIS supports.",
          "An advocate can call with you.",
        ],
      },
      {
        name: "The conversation with the provider, if you want it",
        actions: [
          "You can say you are pausing. You do not have to explain everything today.",
          "Keep notes. This walk is not a recommended list of who to use next.",
        ],
      },
    ],
  };
}

function providersGeneric(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Provider conversation or service agreement",
      systemDoor: "The provider, and the NDIS Commission if safety is the issue.",
      whatThisIs: "A rehearsal for what they will do, what they will charge, and how you can pause.",
      whatThisIsNot: `${SHARED_NOT} It does not rate a business, approve a quote, or give a recommended list.`,
      keep: [
        "You can say you need a week before you sign.",
        "Ask which plan pot they will claim from.",
        "Keep a copy of anything you sign.",
      ],
    },
    interpretations: [
      { meaning: "A quote is not an approval. The plan letter and the my NDIS app still win." },
      { meaning: "If the paper is a service agreement, use that walk. If you do not feel safe, use the safety walk." },
    ],
    intent: {
      practise: "Clear questions before money or hours move.",
      notTryingTo: "Recommend a provider or promise the Commission will uphold a complaint.",
      wordsYouCanUse:
        "Please write what you will do, which budget it comes from, and how I pause or end this. I will not sign today.",
    },
    risks: {
      risks_detected: [
        "Paying a deposit you cannot reclaim",
        "Signing in a rush",
        "Staying with a worker who does not feel safe",
      ],
    },
    routes: [
      {
        name: "Questions before you sign",
        actions: [
          "What will you do, how often, and in which budget?",
          "How do I pause or end this? I need that in writing.",
        ],
      },
      {
        name: "If you do not feel safe",
        actions: [
          "If you are in danger now, call 000.",
          "NDIS Commission 1800 035 544 for quality and safety of NDIS supports.",
          "An advocate can call with you.",
        ],
      },
    ],
  };
}

function schoolWalk(scenario: NavigatorReport["scenario"]): NavigatorReport {
  const kind = schoolKind(scenario.situation, scenario.flags);
  if (kind === "exclusion") return schoolExclusion(scenario);
  if (kind === "adjustment") return schoolAdjustment(scenario);
  return schoolGeneric(scenario);
}

function schoolAdjustment(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Request for a written classroom or course adjustment",
      systemDoor: "Education. NDIS does not run the classroom.",
      whatThisIs: "A rehearsal for naming the adjustment you need, and asking for it in writing.",
      whatThisIsNot: `${SHARED_NOT} NDIS does not replace the school’s duty. This walk does not invent a state exclusion form.`,
      usualWindow: READ_THE_DATE,
      keep: [
        "Ask for the disability liaison or inclusion teacher.",
        "Ask for the adjustment in writing.",
        "Therapy that helps you attend is not the same as classroom support.",
      ],
      official: [
        { name: "Disability Standards for Education 2005", href: DSE_HREF },
        { name: "NDIS and other government services — education", href: NDIS_EDUCATION_HREF },
      ],
    },
    interpretations: [
      { meaning: "Learning support at school is education’s door. NDIS may sit beside it. It does not take the school’s place." },
      { meaning: "A practice walk cannot enrol you or decide an adjustment." },
    ],
    intent: {
      practise: "One clear request and a named contact.",
      notTryingTo: "Decide what the school must fund or what NDIS will fund around school.",
      wordsYouCanUse:
        "I need a written classroom adjustment. Who is the disability liaison, and what can you offer in writing? NDIS does not run the classroom.",
    },
    risks: {
      risks_detected: [
        "Waiting on NDIS instead of asking the school",
        "Leaving the meeting with no named contact",
        "Agreeing to an informal workaround that disappears next term",
      ],
    },
    routes: [
      {
        name: "Name the contact",
        actions: [
          "Ask for the disability liaison, inclusion teacher, or TAFE disability service.",
          "Write their name and how to reach them.",
        ],
      },
      {
        name: "Ask for the adjustment in writing",
        actions: [
          "Say the adjustment in one sentence.",
          "Ask them to write back what they can offer.",
        ],
      },
      {
        name: "Keep the doors separate",
        actions: [
          "NDIS does not run the classroom.",
          "If you also have an NDIS letter, walk that paper under NDIS — not here.",
        ],
      },
    ],
  };
}

function schoolExclusion(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Suspension, exclusion, or stand-down conversation",
      systemDoor: "Education. NDIS does not run the classroom.",
      whatThisIs: "A rehearsal for reading the school paper, naming a contact, and asking how you return.",
      whatThisIsNot: `${SHARED_NOT} This walk does not invent a state exclusion form or a return date.`,
      usualWindow: READ_THE_DATE,
      keep: [
        "Keep the notice. Write the day you received it.",
        "Ask for the disability liaison as well as the year coordinator.",
        "Ask whether a reasonable adjustment was on the table before the suspension.",
      ],
      official: [
        { name: "Disability Standards for Education 2005", href: DSE_HREF },
        { name: "NDIS and other government services — education", href: NDIS_EDUCATION_HREF },
      ],
    },
    interpretations: [
      { meaning: "A suspension notice is a school paper. NDIS does not run the classroom and cannot cancel the notice." },
      {
        meaning:
          "State forms and return dates sit on the notice in your hand. This walk will not invent that paper.",
      },
    ],
    intent: {
      practise: "Read the date on the notice, then ask for the disability contact and the return conversation.",
      notTryingTo: "Overturn a suspension or move the problem onto an NDIS plan.",
      wordsYouCanUse:
        "I have the suspension notice. I want the disability liaison and a written note about how I return. NDIS does not run the classroom.",
    },
    risks: {
      risks_detected: [
        "Waiting on NDIS instead of talking to the school",
        "Guessing a return date that is not on the notice",
        "Leaving with no named contact",
      ],
    },
    routes: [
      {
        name: "Read the notice",
        actions: [
          "Name the date on the paper. That is the date that matters.",
          "Do not borrow a deadline from another state’s form.",
        ],
      },
      {
        name: "Name the school contact",
        actions: [
          "Ask for the disability liaison or inclusion teacher as well as the year coordinator.",
          "Ask for the next conversation in writing.",
        ],
      },
      {
        name: "Keep NDIS out of the classroom door",
        actions: [
          "NDIS does not run the classroom.",
          "If you also need an NDIS conversation, walk that paper under NDIS.",
        ],
      },
    ],
  };
}

function schoolGeneric(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "School, TAFE, or university disability conversation",
      systemDoor: "Education. Reasonable adjustments are the school’s job. NDIS does not run the classroom.",
      whatThisIs: "A rehearsal for naming the adjustment you need, in writing.",
      whatThisIsNot: `${SHARED_NOT} NDIS does not replace the school’s duty.`,
      keep: [
        "Ask for the disability liaison or inclusion teacher.",
        "Ask for the adjustment in writing.",
        "Therapy that helps you attend is not the same as classroom support.",
      ],
    },
    interpretations: [
      { meaning: "Learning support at school is education’s door. NDIS may sit beside it. It does not take the school’s place." },
      { meaning: "A practice walk cannot enrol you or decide an adjustment." },
    ],
    intent: {
      practise: "One clear request and a named contact.",
      notTryingTo: "Decide what the school must fund or what NDIS will fund around school.",
      wordsYouCanUse:
        "I need disability support at school. Who is the disability liaison, and what adjustments can you offer in writing?",
    },
    risks: {
      risks_detected: [
        "Waiting on NDIS instead of asking the school",
        "Leaving the meeting with no named contact",
        "Agreeing to an informal workaround that disappears next term",
      ],
    },
    routes: [
      {
        name: "Name the contact",
        actions: [
          "Ask for the disability liaison, inclusion teacher, or TAFE disability service.",
          "Write their name and how to reach them.",
        ],
      },
      {
        name: "Ask for the adjustment in writing",
        actions: [
          "Say the adjustment in one sentence.",
          "Ask them to write back what they can offer.",
        ],
      },
    ],
  };
}

function healthWalk(scenario: NavigatorReport["scenario"]): NavigatorReport {
  const kind = healthKind(scenario.situation, scenario.flags);
  if (kind === "discharge") return healthDischarge(scenario);
  if (kind === "gp") return healthGp(scenario);
  return healthGeneric(scenario);
}

function healthDischarge(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Hospital discharge plan or leaving-hospital conversation",
      systemDoor: "Health. A discharge plan is not an NDIS plan. This walk is not a diagnosis.",
      whatThisIs: "A rehearsal for naming the follow-up, the medicines list, and who to call if things slip.",
      whatThisIsNot: `${SHARED_NOT} It is not a diagnosis and not a funding quote.`,
      usualWindow: READ_THE_DATE,
      keep: [
        "If it is an emergency, call 000.",
        "Keep the discharge summary and the medicines list.",
        "A discharge plan is not an NDIS plan.",
      ],
      official: [{ name: "Healthdirect", href: HEALTHDIRECT_HREF }],
    },
    interpretations: [
      { meaning: "A hospital discharge is a health paper. It does not open or change an NDIS plan." },
      { meaning: "This walk cannot book a clinic or say what a doctor will write." },
    ],
    intent: {
      practise: "A short list: follow-up, medicines, and who to call if you become unwell again.",
      notTryingTo: "Diagnose, prescribe, or treat a discharge summary as an NDIS plan.",
      wordsYouCanUse:
        "I have the discharge summary. I need the follow-up in writing, the medicines list, and who I call if I get worse. This is not an NDIS plan.",
    },
    risks: {
      risks_detected: [
        "Using a hospital discharge as if it were an NDIS plan",
        "Skipping 000 when it is an emergency",
        "Leaving without a named follow-up",
      ],
    },
    routes: [
      {
        name: "If it is urgent",
        actions: ["Call 000 in an emergency.", "Healthdirect can help you find after-hours care."],
      },
      {
        name: "Read the discharge paper",
        actions: [
          "Name the follow-up and the date on the page.",
          "Keep the medicines list with the summary.",
        ],
      },
      {
        name: "The next health conversation",
        actions: [
          "Ask the GP or clinic to read the discharge summary with you.",
          "Do not treat this paper as a diagnosis from Plan Decoder.",
        ],
      },
    ],
  };
}

function healthGp(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "GP or longer-appointment conversation",
      systemDoor: "Health. This walk is not a diagnosis.",
      whatThisIs: "A rehearsal for a longer appointment, a clear ask, and what health already covers.",
      whatThisIsNot: `${SHARED_NOT} It is not a diagnosis and not a funding quote.`,
      usualWindow: "Ask the clinic what time they can offer. This walk does not invent a wait.",
      keep: [
        "If it is an emergency, call 000.",
        "Ask about bulk billing and a longer appointment.",
        "A GP can write a Mental Health Treatment Plan. You do not need an NDIS plan for that.",
      ],
      official: [{ name: "Healthdirect", href: HEALTHDIRECT_HREF }],
    },
    interpretations: [
      { meaning: "Health and NDIS can sit side by side. One letter does not replace the other." },
      { meaning: "This walk cannot book a clinic or say what a doctor will write." },
    ],
    intent: {
      practise: "A short, specific ask for the next appointment.",
      notTryingTo: "Diagnose, prescribe, or decide an NDIS plan from a health letter.",
      wordsYouCanUse:
        "I need a longer appointment. I want to talk about how a usual day and a hard day look. Can you tell me what is bulk billed?",
    },
    risks: {
      risks_detected: [
        "Treating this page as a diagnosis",
        "Skipping 000 when it is an emergency",
        "Paying twice for something a public health door already covers",
      ],
    },
    routes: [
      {
        name: "If it is urgent",
        actions: ["Call 000 in an emergency.", "Healthdirect can help you find after-hours care."],
      },
      {
        name: "The GP conversation",
        actions: [
          "Ask for a longer appointment and a quiet wait if you need it.",
          "Take three lines: usual day, hard day, what you want from this visit.",
        ],
      },
      {
        name: "Keep NDIS separate",
        actions: [
          "A Mental Health Treatment Plan is a health door. You do not need an NDIS plan for that.",
          "If you also have an NDIS letter, walk that paper under NDIS.",
        ],
      },
    ],
  };
}

function healthGeneric(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "GP, allied health, or hospital conversation",
      systemDoor: "Health. A discharge plan is not an NDIS plan. This walk is not a diagnosis.",
      whatThisIs: "A rehearsal for a longer appointment, a clear ask, and what health already covers.",
      whatThisIsNot: `${SHARED_NOT} It is not a diagnosis and not a funding quote.`,
      keep: [
        "If it is an emergency, call 000.",
        "Ask about bulk billing and a longer appointment.",
        "A GP can write a Mental Health Treatment Plan. You do not need an NDIS plan for that.",
      ],
    },
    interpretations: [
      { meaning: "Health and NDIS can sit side by side. One letter does not replace the other." },
      { meaning: "This walk cannot book a clinic or say what a doctor will write." },
    ],
    intent: {
      practise: "A short, specific ask for the next appointment.",
      notTryingTo: "Diagnose, prescribe, or decide an NDIS plan from a health letter.",
      wordsYouCanUse:
        "I need a longer appointment. I want to talk about how a usual day and a hard day look. Can you tell me what is bulk billed?",
    },
    risks: {
      risks_detected: [
        "Using a hospital discharge as if it were an NDIS plan",
        "Skipping 000 when it is an emergency",
        "Paying twice for something a public health door already covers",
      ],
    },
    routes: [
      {
        name: "If it is urgent",
        actions: ["Call 000 in an emergency.", "Healthdirect can help you find after-hours care."],
      },
      {
        name: "The GP conversation",
        actions: [
          "Ask for a longer appointment and a quiet wait if you need it.",
          "Take three lines: usual day, hard day, what you want from this visit.",
        ],
      },
    ],
  };
}

function centrelinkWalk(scenario: NavigatorReport["scenario"]): NavigatorReport {
  const kind = centrelinkKind(scenario.situation, scenario.flags);
  if (kind === "debt") return centrelinkDebt(scenario);
  if (kind === "letter") return centrelinkLetter(scenario);
  return centrelinkGeneric(scenario);
}

function centrelinkLetter(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Services Australia or Centrelink letter",
      systemDoor: "Services Australia. This walk cannot approve a payment.",
      whatThisIs: "A rehearsal for checking what the letter is asking, and the question you will take to the counter or the phone.",
      whatThisIsNot: `${SHARED_NOT} It does not say you will get a payment. It cannot approve a payment.`,
      usualWindow: READ_THE_DATE,
      keep: [
        "Take the letter and any reference number.",
        "A support person or advocate can sit with you.",
        "Free financial counselling: National Debt Helpline 1800 007 007.",
      ],
      official: [{ name: "Services Australia", href: SERVICES_AUSTRALIA_HREF }],
    },
    interpretations: [
      { meaning: "Centrelink is a payments door. NDIS is a disability-support door. They are not the same office." },
      { meaning: "A practice walk cannot approve DSP, JobSeeker, or Carer Payment." },
    ],
    intent: {
      practise: "A short list of what you want checked, and the papers you will take.",
      notTryingTo: "Decide if you qualify for a payment or a concession, or approve a payment.",
      wordsYouCanUse:
        "I have this Services Australia letter. I need you to tell me what it is asking and what the next step is. This tool cannot approve a payment.",
    },
    risks: {
      risks_detected: [
        "Guessing a payment outcome from social media",
        "Missing a date or reference number on a Services Australia letter",
        "Treating this walk as if it can approve a payment",
      ],
    },
    routes: [
      {
        name: "Read the letter",
        actions: [
          "Name the payment or concession and the date on the page.",
          "Write the question you want answered in one sentence.",
        ],
      },
      {
        name: "Talk to Services Australia",
        actions: [
          "Take a support person if that helps.",
          "Ask them to repeat the next step in writing or on the screen.",
          "This walk cannot approve a payment.",
        ],
      },
      {
        name: "If money is the crunch",
        actions: [
          "National Debt Helpline 1800 007 007 — free, confidential.",
          "Ask energy and water hardship teams. They are used to this.",
        ],
      },
    ],
  };
}

function centrelinkDebt(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Centrelink debt or overpayment letter",
      systemDoor: "Services Australia. This walk cannot approve a payment or wipe a debt.",
      whatThisIs: "A rehearsal for reading the letter, naming the reference number, and asking what the letter wants you to do.",
      whatThisIsNot: `${SHARED_NOT} It cannot approve a payment, waive a debt, or invent a review clock.`,
      usualWindow: READ_THE_DATE,
      keep: [
        "Keep the letter and the reference number.",
        "Write the day you received it.",
        "Free financial counselling: National Debt Helpline 1800 007 007.",
      ],
      official: [{ name: "Services Australia", href: SERVICES_AUSTRALIA_HREF }],
    },
    interpretations: [
      { meaning: "A debt letter is a payments paper. This walk cannot approve a payment or decide the debt." },
      {
        meaning:
          "Review paths and dates sit on the letter. This walk does not invent a Centrelink form code or a day count.",
      },
    ],
    intent: {
      practise: "Read the date and the reference number, then practise the question you will ask.",
      notTryingTo: "Approve a payment, waive a debt, or replace Services Australia.",
      wordsYouCanUse:
        "I have a debt or overpayment letter. I want the reference number checked and the next step in writing. This tool cannot approve a payment.",
    },
    risks: {
      risks_detected: [
        "Guessing a review deadline that is not on the letter",
        "Ignoring the reference number",
        "Skipping free financial counselling when bills are the real problem",
        "Treating this walk as if it can approve a payment",
      ],
    },
    routes: [
      {
        name: "Read the letter",
        actions: [
          "Name the date and the reference number on the page.",
          "Write the question you want answered in one sentence.",
          "Do not invent a form code or a clock.",
        ],
      },
      {
        name: "Talk to Services Australia",
        actions: [
          "Take a support person if that helps.",
          "Ask them to repeat the next step in writing or on the screen.",
          "This walk cannot approve a payment.",
        ],
      },
      {
        name: "If money is the crunch",
        actions: [
          "National Debt Helpline 1800 007 007 — free, confidential.",
          "Ask energy and water hardship teams. They are used to this.",
        ],
      },
    ],
  };
}

function centrelinkGeneric(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "Centrelink or Services Australia conversation",
      systemDoor: "Services Australia. This walk cannot lodge a claim or approve a payment.",
      whatThisIs: "A rehearsal for checking a payment, a concession, or a letter you already have.",
      whatThisIsNot: `${SHARED_NOT} It does not say you will get a payment. It cannot approve a payment.`,
      keep: [
        "Take the letter and any reference number.",
        "A support person or advocate can sit with you.",
        "Free financial counselling: National Debt Helpline 1800 007 007.",
      ],
    },
    interpretations: [
      { meaning: "Centrelink is a payments door. NDIS is a disability-support door. They are not the same office." },
      { meaning: "A practice walk cannot approve DSP, JobSeeker, or Carer Payment." },
    ],
    intent: {
      practise: "A short list of what you want checked, and the papers you will take.",
      notTryingTo: "Decide if you qualify for a payment or a concession, or approve a payment.",
      wordsYouCanUse:
        "My disability support has changed. I need to check my payment, my concession card, and what this letter means.",
    },
    risks: {
      risks_detected: [
        "Guessing a payment outcome from social media",
        "Missing a date or reference number on a Services Australia letter",
        "Skipping free financial counselling when bills are the real problem",
      ],
    },
    routes: [
      {
        name: "Read the letter",
        actions: [
          "Name the payment or concession and the date on the page.",
          "Write the question you want answered in one sentence.",
        ],
      },
      {
        name: "Talk to Services Australia",
        actions: [
          "Take a support person if that helps.",
          "Ask them to repeat the next step in writing or on the screen.",
        ],
      },
      {
        name: "If money is the crunch",
        actions: ["National Debt Helpline 1800 007 007 — free, confidential.", "Ask energy and water hardship teams. They are used to this."],
      },
    ],
  };
}

function genericWalk(scenario: NavigatorReport["scenario"]): NavigatorReport {
  return {
    scenario,
    worldModel: {
      paper: "An Australian system conversation",
      systemDoor: "Name the door first: housing, NDIS, a provider, school, health, or Centrelink.",
      whatThisIs: "A rehearsal map. Pick the system that matches the paper in your hand.",
      whatThisIsNot: SHARED_NOT,
      keep: ["Name the paper.", "Name the date on it.", "Practise one sentence before you call."],
    },
    interpretations: [
      { meaning: "A vague situation still has a next conversation. It does not have a made-up deadline." },
    ],
    intent: {
      practise: "Choose the system, then try the walk again.",
      notTryingTo: "Invent extra legal steps or a case outcome.",
      wordsYouCanUse: "I have this paper. I want to understand what it is asking me to do.",
    },
    risks: {
      risks_detected: ["Mixing two systems in one call", "Inventing a deadline that is not on the paper"],
    },
    routes: [
      {
        name: "Name the system",
        actions: [
          "Pick Housing, NDIS, Providers, School, Health, or Centrelink.",
          "Walk that door. Do not treat this page as a government form.",
        ],
      },
    ],
  };
}
