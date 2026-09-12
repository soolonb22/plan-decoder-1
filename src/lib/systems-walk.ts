/** Independent rehearsal maps. Not a government system. Not legal advice. */

export const SYSTEMS_WALK_TITLE = "Plan Decoder · Systems walk";
export const SYSTEMS_WALK_TAGLINE = "Practise the conversation. Not the government form.";
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

export const HOUSING_FORM11_DEMO = {
  system: "Housing" as const,
  situation: "Form 11 issued; tenant disputes breach",
  flags: { form11: true } as NavigatorFlags,
};

export const FORM11_NOTICE_HREF =
  "https://www.rta.qld.gov.au/forms-resources/forms/forms-for-general-tenancies/notice-to-remedy-breach-form-11";
export const FORM11_BREACH_HREF = "https://www.rta.qld.gov.au/during-a-tenancy/breach-of-the-agreement";

const SHARED_NOT = "Not the NDIA. Not an official NDIS Navigator. Not legal advice. Not a promise of a result.";

export function generateNavigatorReport(
  system: string,
  situation: string,
  flags: NavigatorFlags = {},
): NavigatorReport {
  const scenario = { system, situation, flags };
  const name = normaliseSystem(system);
  if (name === "Housing" && isForm11(situation, flags)) return housingForm11(scenario);
  if (name === "Housing") return housingGeneric(scenario);
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

function isForm11(situation: string, flags: NavigatorFlags) {
  if (flags.form11 === true || String(flags.form11).toLowerCase() === "true") return true;
  return /form\s*11/i.test(situation);
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
      whatThisIsNot: SHARED_NOT,
      keep: [
        "Keep copies of any notice.",
        "Public and community housing are mainstream doors.",
        "An advocate can sit with you.",
      ],
    },
    interpretations: [
      { meaning: "Housing is its own system. A practice walk here does not apply for a house." },
      { meaning: "If the paper is a Queensland Form 11, use the Form 11 walk. That notice is not an eviction order." },
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
      ],
    },
    routes: [
      {
        name: "Read the paper",
        actions: [
          "Name the form and the date on it.",
          "If it is a Queensland Form 11, it is a notice to remedy breach — not an eviction order.",
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
  return {
    scenario,
    worldModel: {
      paper: "NDIS letter, meeting, or plan conversation",
      systemDoor: "NDIA and your plan. This walk is not the NDIA and not an official NDIS Navigator.",
      whatThisIs: "A rehearsal for how you describe daily life, supports, and what still sits with school, health, or housing.",
      whatThisIsNot: `${SHARED_NOT} It does not say if you will get a plan, keep a plan, or receive a dollar amount.`,
      usualWindow: "If you have a written decision, read the date and the review path on that letter. Do not invent a new clock.",
      keep: [
        "Keep the letter.",
        "Use the current plan until a new letter says otherwise.",
        "Write what a hard day looks like in your own words.",
      ],
    },
    interpretations: [
      { meaning: "NDIS sits beside housing, school, health, and Centrelink. It does not replace those doors." },
      { meaning: "A practice walk cannot lodge an access request or change a plan." },
    ],
    intent: {
      practise: "Plain words about a usual day and a hard day, and which other system still has a job.",
      notTryingTo: "Decide eligibility or funding, quote a budget, or speak as the official NDIS Navigator.",
      wordsYouCanUse:
        "On a usual day I can… On a hard day I need… School / health / housing still covers… I want NDIS for…",
    },
    risks: {
      risks_detected: [
        "Treating this tool as an official NDIS Navigator",
        "Guessing eligibility or a funding amount",
        "Ignoring a date written on a decision letter",
        "Signing a new service agreement in a rush",
      ],
    },
    routes: [
      {
        name: "Read the letter",
        actions: [
          "Name the decision and the date on the page.",
          "If it is a written decision, the letter usually says how to ask for an internal review. Read that. This walk does not start a review.",
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
  return {
    scenario,
    worldModel: {
      paper: "Provider conversation or service agreement",
      systemDoor: "The provider, and the NDIS Commission if safety is the issue.",
      whatThisIs: "A rehearsal for what they will do, what they will charge, and how you can pause.",
      whatThisIsNot: `${SHARED_NOT} It does not rate a business or approve a quote.`,
      keep: [
        "You can say you need a week before you sign.",
        "Ask which plan pot they will claim from.",
        "Keep a copy of anything you sign.",
      ],
    },
    interpretations: [
      { meaning: "A quote is not an approval. The plan letter and the my NDIS app still win." },
      { meaning: "Feeling unsafe with a worker is a safety door, not a politeness problem." },
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
  return {
    scenario,
    worldModel: {
      paper: "School, TAFE, or university disability conversation",
      systemDoor: "Education. Reasonable adjustments are the school’s job.",
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
  return {
    scenario,
    worldModel: {
      paper: "GP, allied health, or hospital conversation",
      systemDoor: "Health. A discharge plan is not an NDIS plan.",
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
      notTryingTo: "Diagnose, prescribe, or decide NDIS eligibility from a health letter.",
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
  return {
    scenario,
    worldModel: {
      paper: "Centrelink or Services Australia conversation",
      systemDoor: "Services Australia. This walk cannot lodge a claim.",
      whatThisIs: "A rehearsal for checking a payment, a concession, or a letter you already have.",
      whatThisIsNot: `${SHARED_NOT} It does not say you will get a payment.`,
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
      notTryingTo: "Decide if you qualify for a payment or a concession.",
      wordsYouCanUse:
        "My disability support has changed. I need to check my payment, my concession card, and what this letter means.",
    },
    risks: {
      risks_detected: [
        "Guessing eligibility from social media",
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
