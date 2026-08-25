import type { EvidenceType } from "./types";

export type PlanPiece = {
  id: string;
  title: string;
  easy: string;
  details: string[];
  found: string;
  howToUse: string;
  image: string;
  present: boolean;
};

export type PlanLesson = {
  n: number;
  title: string;
  body: string;
  image: string;
};

export type PlanMoney = {
  label: string;
  amount: string;
  note: string;
};

export type PlanRead = {
  fileName: string;
  extractedAt: string;
  management: "self" | "plan" | "ndia" | "mix" | "unknown";
  dates: string[];
  money: PlanMoney[];
  pieces: PlanPiece[];
  lessons: PlanLesson[];
  warnings: string[];
  textLength: number;
};

type Catalog = {
  id: string;
  match: RegExp;
  title: string;
  easy: string;
  details: string[];
  howToUse: string;
  image: string;
  moneyHint?: RegExp;
};

const CATALOG: Catalog[] = [
  {
    id: "who",
    match: /participant|about you|your name|this plan is for/i,
    title: "Who this plan is for",
    easy: "This page is about one person. Supports should fit their life, not a generic list.",
    details: [
      "The plan is personal. Another person’s plan cannot be copied across.",
      "A nominee or parent may help, but the goals still belong to the participant.",
    ],
    howToUse: "When you book a support, use this person’s name on the invoice. Do not mix family members on one claim.",
    image: "/brand/story-sit.jpg",
  },
  {
    id: "dates",
    match: /plan period|plan start|plan end|start date|end date|plan dates|duration of your plan/i,
    title: "How long the plan lasts",
    easy: "A plan has a start and an end. Supports are meant to be used in that window.",
    details: [
      "Write the start and end on the fridge or in your phone.",
      "If a reassessment is late, NDIA pages say many plans are extended so supports do not just stop.",
      "Diary the letter date if a new plan arrives — review clocks start from when you receive it.",
    ],
    howToUse: "Do not book a big support after the end date until you have a new plan or an extension in writing.",
    image: "/brand/story-path.jpg",
  },
  {
    id: "management",
    match: /self[-\s]?manag|plan[-\s]?manag|ndia[-\s]?manag|agency[-\s]?manag|how your plan is managed|plan managed by/i,
    title: "Who pays the bills",
    easy: "Self-managed: you pay, then claim. Plan-managed: a plan manager pays. NDIA-managed: the Agency pays registered providers.",
    details: [
      "This is the most important line for self-management.",
      "You can have a mix — some supports one way, some another.",
      "Self-manage does not mean do it alone. A nominee, coordinator, or advocate can sit with you.",
    ],
    howToUse: "Before the first invoice, confirm who the provider should bill. A wrong bill is the most common early stress.",
    image: "/brand/story-wallet.jpg",
  },
  {
    id: "goals",
    match: /\bgoals?\b|what I want|my goal/i,
    title: "Goals — the “why”",
    easy: "Goals are what you want life to look like. Money is meant to help those goals, not to replace ordinary living costs.",
    details: [
      "A goal can be small: leave the house three days a week, sleep through the night, finish a TAFE term.",
      "Providers should be able to say how their support helps a goal.",
      "You can keep the wording in your own voice. Clinic words are not required.",
    ],
    howToUse: "On each invoice folder, write one line: “This helps goal ___.” If you cannot, pause and ask.",
    image: "/brand/story-words.jpg",
  },
  {
    id: "core",
    match: /core supports|assistance with daily life|consumables|social and community participation|assistance with social/i,
    title: "Core — everyday support",
    easy: "Core is the everyday pot: help at home, getting out, some consumables. It is often the most flexible pot.",
    details: [
      "Daily life = help with personal care, home tasks, being safe.",
      "Community = help to leave the house and join in.",
      "Consumables = everyday disability items (for example continence products), not ordinary groceries.",
      "You can often move money between flexible Core categories. You cannot pour Core into Capacity Building or Capital.",
    ],
    howToUse: "Ask every provider: “Is this Core?” If yes, and the line is flexible, you have more choice inside Core.",
    image: "/brand/story-together.jpg",
    moneyHint: /core supports|daily life|consumables|community participation/i,
  },
  {
    id: "capacity",
    match: /capacity building|improved daily living|support coordination|finding and keeping a job|increased social|improved relationships|improved health|improved learning|improved life choices|recovery coach/i,
    title: "Capacity building — skills over time",
    easy: "This pot is for building skills: therapy, coordination, work, learning. It is often less flexible.",
    details: [
      "Improved daily living is often OT, psychology, speech, or similar.",
      "Support coordination helps you understand and use the plan.",
      "Many of these lines are stated — that money is for the named support.",
      "You cannot move this pot into Core to buy extra hours of daily care.",
    ],
    howToUse: "Get a service agreement that names the support and the hours. Check it matches the stated line.",
    image: "/brand/story-tick.jpg",
    moneyHint: /capacity building|improved daily living|support coordination/i,
  },
  {
    id: "capital",
    match: /capital supports|assistive technology|home modification|vehicle modification/i,
    title: "Capital — equipment and home changes",
    easy: "Capital is for bigger items: equipment, home or vehicle modifications. It is usually stated.",
    details: [
      "Quotes and assessments are often needed before you buy.",
      "Low-cost AT is sometimes in Core consumables instead. Check which pot the plan used.",
      "Do not use Capital to pay support-worker hours.",
    ],
    howToUse: "Keep quotes. Do not pay a deposit you cannot reclaim if the item is not approved as an NDIS support.",
    image: "/brand/story-device.jpg",
    moneyHint: /capital|assistive technology|home modification/i,
  },
  {
    id: "recurring",
    match: /recurring supports|\btransport\b|assistance with travel/i,
    title: "Recurring — regular things like transport",
    easy: "Recurring is a fourth pot on current NDIA pages. Transport is the common example. It cannot be topped up from Core.",
    details: [
      "If transport is in Recurring, that is its own pot.",
      "If transport is inside Core, the plan should say so.",
      "Taxi or kilometre claims still have to match the plan wording.",
    ],
    howToUse: "Do not pay community hours from the transport line, or transport from therapy money.",
    image: "/brand/story-path.jpg",
    moneyHint: /recurring|transport/i,
  },
  {
    id: "stated",
    match: /stated support|flexible support|this is a stated|this is a flexible/i,
    title: "Flexible or stated",
    easy: "Flexible: you can often choose NDIS supports inside that pot. Stated: only the named support.",
    details: [
      "Self-managing does not unlock a stated line.",
      "A stated speech pathology budget is not a general therapy budget.",
      "The plan should say “This is a flexible support” or “This is a stated support.”",
    ],
    howToUse: "If a provider wants to swap a stated support, you need a plan change — not just a friendly agreement.",
    image: "/brand/story-tick.jpg",
  },
  {
    id: "coord",
    match: /support coordinat|recovery coach|local area coordinat|my ndis contact/i,
    title: "People who can help you use the plan",
    easy: "A coordinator, recovery coach, or my NDIS contact can explain pots and providers. They do not replace your say.",
    details: [
      "Support coordination is a funded support, not a gatekeeper.",
      "You can still choose providers.",
      "If you self-manage, a coordinator can still help you set up invoices and folders.",
    ],
    howToUse: "Book one calm session: “Walk me through each pot and who I pay.” Take notes on a slip in this wallet.",
    image: "/brand/story-together.jpg",
  },
  {
    id: "informal",
    match: /informal support|family and friends|unpaid support|carer/i,
    title: "Family and unpaid support",
    easy: "The plan should not assume family can do everything forever. Carer impact is evidence, not a test of love.",
    details: [
      "Informal support is what family or friends already do.",
      "If that is breaking down, write it down — frequency, nights, what happens without them.",
      "NDIS funding is not a wage for family, but it can reduce unsafe load.",
    ],
    howToUse: "Keep a carer log for hard weeks. It belongs next to the plan, not instead of it.",
    image: "/brand/story-sit.jpg",
  },
  {
    id: "mainstream",
    match: /mainstream|health system|education|housing|jobactive|centrelink|medicare/i,
    title: "Other systems first, then NDIS",
    easy: "School, health, and housing still have a job. NDIS is for disability support that those systems do not fund.",
    details: [
      "A hospital discharge plan is not an NDIS plan.",
      "School learning support is not the same as NDIS therapy in the classroom.",
      "If a planner says “that is mainstream,” ask what exists in your area today, in writing.",
    ],
    howToUse: "Keep letters that show a gap in mainstream. That is useful evidence, not a complaint.",
    image: "/brand/story-rights.jpg",
  },
  {
    id: "sil",
    match: /supported independent living|\bSIL\b|specialist disability accommodation|\bSDA\b|medium term accommodation|\bMTA\b/i,
    title: "Living supports (SIL / SDA / MTA)",
    easy: "If these words are in the plan, they are usually stated and tightly described. They are not extra Core hours.",
    details: [
      "SIL is help in the home where you live.",
      "SDA is the dwelling itself, with rules about who can live there.",
      "These supports have extra evidence and quoting steps.",
    ],
    howToUse: "Do not sign a house agreement you cannot read. Ask an advocate. Keep the quote next to this plan.",
    image: "/brand/story-device.jpg",
  },
  {
    id: "review",
    match: /scheduled review|reassessment|plan review|next review/i,
    title: "When the plan will be looked at again",
    easy: "There is usually a scheduled reassessment. You can also ask for a change if life changes a lot.",
    details: [
      "Keep dates of letters. Clocks often start from the day you received the decision.",
      "A new assessment style (support needs / I-CAN based) is rolling out for some people from 2027.",
      "You can bring your own evidence, including slips from this wallet.",
    ],
    howToUse: "Three months before the end date, gather: goals progress, hard weeks, carer notes, and quotes you still need.",
    image: "/brand/story-gp.jpg",
  },
];

function clean(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function redact(s: string) {
  return clean(s)
    .replace(/\b\d{3}\s?\d{3}\s?\d{3}\b/g, "[number removed]")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email removed]")
    .replace(/\b(?:04\d{8}|04\d{2}\s\d{3}\s\d{3})\b/g, "[phone removed]");
}

function windowAround(text: string, index: number, after = 420) {
  return redact(text.slice(index, index + after));
}

function firstIndex(text: string, re: RegExp) {
  const m = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`).exec(text);
  return m?.index ?? -1;
}

function moneyNear(text: string, hint: RegExp): string | null {
  const idx = firstIndex(text, hint);
  if (idx < 0) return null;
  const chunk = text.slice(idx, idx + 320);
  const hit = chunk.match(/\$\s?[\d,]{2,}(?:\.\d{2})?/);
  return hit ? hit[0].replace(/\s/g, "") : null;
}

function allDates(text: string): string[] {
  const months =
    "january|february|march|april|may|june|july|august|september|october|november|december";
  const a = [...text.matchAll(new RegExp(`\\b\\d{1,2}\\s+(?:${months})\\s+\\d{4}\\b`, "gi"))].map((m) => m[0]);
  const b = [...text.matchAll(/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g)].map((m) => m[0]);
  return [...new Set([...a, ...b])].slice(0, 6);
}

async function pdfToText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  const max = Math.min(doc.numPages, 50);
  for (let i = 1; i <= max; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let lastY: number | null = null;
    let buf = "";
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const str = String(item.str);
      const y = Array.isArray(item.transform) ? Number(item.transform[5]) : 0;
      if (lastY != null && Math.abs(y - lastY) > 6) buf += "\n";
      else if (buf && !buf.endsWith(" ") && !str.startsWith(" ")) buf += " ";
      buf += str;
      lastY = y;
    }
    pages.push(buf);
  }
  return pages.join("\n\n");
}

export async function fileToPlanText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("text/") || name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".csv")) {
    return file.text();
  }
  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    return pdfToText(file);
  }
  return "";
}

function detectManagement(lower: string): PlanRead["management"] {
  const self = /\bself[-\s]?manag/.test(lower);
  const plan = /plan[-\s]?manag/.test(lower);
  const ndia = /ndia[-\s]?manag|agency[-\s]?manag/.test(lower);
  const n = Number(self) + Number(plan) + Number(ndia);
  if (n > 1) return "mix";
  if (self) return "self";
  if (plan) return "plan";
  if (ndia) return "ndia";
  return "unknown";
}

export function parseNdisPlan(text: string, fileName: string): PlanRead {
  const t = text.replace(/\u0000/g, " ");
  const lower = t.toLowerCase();
  const warnings: string[] = [];
  if (t.replace(/\s/g, "").length < 80) {
    warnings.push(
      "This file did not give enough readable text (it may be a photo). Use “paste text”, or type the headings you can see. The pictures and self-manage steps still help.",
    );
  }

  const management = detectManagement(lower);
  const dates = allDates(t);

  const money: PlanMoney[] = [];
  for (const row of CATALOG) {
    if (!row.moneyHint) continue;
    const amount = moneyNear(t, row.moneyHint);
    if (amount) money.push({ label: row.title, amount, note: row.easy });
  }
  if (!money.length) {
    const dollars = [...new Set([...t.matchAll(/\$\s?[\d,]{3,}(?:\.\d{2})?/g)].map((m) => m[0].replace(/\s/g, "")))].slice(0, 8);
    if (dollars.length) money.push({ label: "Amounts noticed on the page", amount: dollars.join(" · "), note: "Check which pot each belongs to in the my NDIS app." });
  }

  const pieces: PlanPiece[] = CATALOG.map((row) => {
    const idx = firstIndex(t, row.match);
    const present = idx >= 0;
    return {
      id: row.id,
      title: row.title,
      easy: row.easy,
      details: row.details,
      found: present ? windowAround(t, idx) : "",
      howToUse: row.howToUse,
      image: row.image,
      present,
    };
  }).filter((p) => p.present || ["management", "core", "capacity", "capital", "stated", "goals"].includes(p.id));

  if (dates.length && !pieces.some((p) => p.id === "dates" && p.present)) {
    const datesPiece = pieces.find((p) => p.id === "dates");
    if (datesPiece) datesPiece.found = dates.join(" · ");
  }

  const lessons: PlanLesson[] = [
    {
      n: 1,
      title: "Name the pot before you book",
      body: "Core, Capacity Building, Capital, or Recurring. If you cannot name the pot, pause.",
      image: "/brand/story-wallet.jpg",
    },
    {
      n: 2,
      title: "Stated means this support, not another",
      body: "Flexible Core is often the most choice. A stated therapy line stays that therapy.",
      image: "/brand/story-tick.jpg",
    },
    {
      n: 3,
      title: "Keep a paper trail",
      body: "Quote, agreement, invoice, date, hours, which pot. That is most of self-managing.",
      image: "/brand/story-device.jpg",
    },
    {
      n: 4,
      title: "Claim close to the support date",
      body: "Claiming windows can change. Check the current NDIA page. From late 2026, 90 days is described.",
      image: "/brand/story-gp.jpg",
    },
    {
      n: 5,
      title: "The my NDIS app is the live balance",
      body: "This screen is a reading aid on this device. If it disagrees with the letter or the app, trust the letter and the app.",
      image: "/brand/story-rights.jpg",
    },
  ];
  if (management === "self") {
    lessons.unshift({
      n: 0,
      title: "You pay, then you claim",
      body: "Agree hours and the pot first. Pay in a way you can prove. If cash flow is tight, plan management is allowed.",
      image: "/brand/story-wallet.jpg",
    });
  }

  return {
    fileName,
    extractedAt: new Date().toISOString(),
    management,
    dates,
    money,
    pieces,
    lessons: lessons.map((l, i) => ({ ...l, n: i + 1 })),
    warnings,
    textLength: t.trim().length,
  };
}

export function planSlipBody(read: PlanRead): string {
  return [
    `Plan reading aid for ${read.fileName}`,
    `How it looks managed: ${read.management}`,
    read.dates.length ? `Dates noticed: ${read.dates.join(", ")}` : "",
    read.money.length ? `Amounts: ${read.money.map((m) => `${m.label} ${m.amount}`).join("; ")}` : "",
    "",
    ...read.pieces.map((p) => [p.title, p.easy, ...p.details, p.howToUse, p.found ? `From the plan: ${p.found}` : ""].filter(Boolean).join("\n")),
    "",
    "Practice reading aid in Plan Decoder. Not the NDIA. Check the plan letter and the my NDIS app.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function guessEvidenceTypeFromPlan(): EvidenceType {
  return "plan";
}
