import type { EvidenceType } from "./types";

export type PlanPiece = {
  id: string;
  title: string;
  easy: string;
  found: string;
  howToUse: string;
};

export type PlanLesson = {
  n: number;
  title: string;
  body: string;
};

export type PlanRead = {
  fileName: string;
  extractedAt: string;
  management: "self" | "plan" | "ndia" | "mix" | "unknown";
  money: { label: string; amount: string }[];
  pieces: PlanPiece[];
  lessons: PlanLesson[];
  warnings: string[];
  textLength: number;
};

function clean(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function snippet(text: string, index: number, radius = 140) {
  const start = Math.max(0, index - 40);
  return clean(text.slice(start, index + radius));
}

function findMoneyNear(text: string, keyword: RegExp, label: string) {
  const m = keyword.exec(text);
  if (!m || m.index == null) return null;
  const window = text.slice(m.index, m.index + 280);
  const dollars = window.match(/\$\s?[\d,]{2,}(?:\.\d{2})?/);
  return { label, amount: dollars ? dollars[0].replace(/\s/g, "") : "amount not read", found: clean(window).slice(0, 180) };
}

async function pdfToText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data, disableWorker: false }).promise;
  const pages: string[] = [];
  const max = Math.min(doc.numPages, 40);
  for (let i = 1; i <= max; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? String(item.str) : ""))
      .filter(Boolean)
      .join(" ");
    pages.push(line);
  }
  return pages.join("\n");
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

export function parseNdisPlan(text: string, fileName: string): PlanRead {
  const t = text.replace(/\u0000/g, " ");
  const lower = t.toLowerCase();
  const warnings: string[] = [];
  if (t.replace(/\s/g, "").length < 80) {
    warnings.push(
      "This file did not give enough readable text (it may be a photo of a plan). You can still use the self-manage steps below, or type totals from the paper copy.",
    );
  }

  let management: PlanRead["management"] = "unknown";
  if (/\bself[-\s]?manag/.test(lower) && /plan[-\s]?manag/.test(lower)) management = "mix";
  else if (/\bself[-\s]?manag/.test(lower)) management = "self";
  else if (/plan[-\s]?manag/.test(lower)) management = "plan";
  else if (/ndia[-\s]?manag|agency[-\s]?manag/.test(lower)) management = "ndia";

  const money: PlanRead["money"] = [];
  const buckets: [RegExp, string][] = [
    [/core supports|assistance with daily life|consumables|social and community participation/i, "Core"],
    [/capacity building|improved daily living|support coordination|finding and keeping a job|increased social/i, "Capacity building"],
    [/capital supports|assistive technology|home modification|vehicle modification/i, "Capital"],
    [/recurring supports|\btransport\b/i, "Recurring / transport"],
  ];
  for (const [re, label] of buckets) {
    const hit = findMoneyNear(t, new RegExp(re.source, "i"), label);
    if (hit && !money.some((m) => m.label === label)) money.push({ label: hit.label, amount: hit.amount });
  }
  const allDollars = [...t.matchAll(/\$\s?[\d,]{3,}(?:\.\d{2})?/g)].map((m) => m[0].replace(/\s/g, ""));
  const unique = [...new Set(allDollars)].slice(0, 8);
  if (!money.length && unique.length) {
    money.push({ label: "Amounts found on the page", amount: unique.join(" · ") });
  }

  const pieces: PlanPiece[] = [];

  const mgmtCopy = {
    self: {
      title: "This plan looks self-managed",
      easy: "You (or your nominee) pay providers, then claim from the NDIS. You keep invoices.",
      howToUse:
        "Before you book: check the pot (Core, Capacity Building, Capital, Recurring), whether the line is flexible or stated, and the price limit. Keep every invoice. Claim close to the date of the support.",
    },
    plan: {
      title: "This plan looks plan-managed",
      easy: "A plan manager pays invoices for you from your NDIS funds. You still choose providers.",
      howToUse:
        "Send invoices to the plan manager. Ask them which pot a support comes from. You can still say no to a provider. Check the my NDIS app so the pots match what you expected.",
    },
    ndia: {
      title: "This plan looks NDIA-managed (agency managed)",
      easy: "The NDIA pays registered providers directly. Choice of provider is usually narrower.",
      howToUse:
        "Use registered providers. You still have goals and a say. If you want more choice later, you can ask about plan-managed or self-managed at a review — that is a request, not a promise.",
    },
    mix: {
      title: "This plan may mix how money is managed",
      easy: "Some supports might be self-managed and some plan- or NDIA-managed. That is allowed.",
      howToUse: "For each support, check who pays. Do not assume every invoice goes the same way.",
    },
    unknown: {
      title: "How the money is managed was not clear",
      easy: "Plans say self-managed, plan-managed, NDIA-managed, or a mix. That line tells you who pays.",
      howToUse: "Look for “plan managed by” on the first pages, or in the my NDIS app. The steps below still help.",
    },
  }[management];
  pieces.push({
    id: "management",
    title: mgmtCopy.title,
    easy: mgmtCopy.easy,
    found: snippet(t, Math.max(0, lower.search(/manag/))),
    howToUse: mgmtCopy.howToUse,
  });

  pieces.push({
    id: "pots",
    title: "Four money pots (you cannot pour one into another)",
    easy: "Core = everyday. Capacity building = skills. Capital = equipment or home. Recurring = regular things like transport.",
    found: money.map((m) => `${m.label}: ${m.amount}`).join(" · ") || "Totals were not clearly labelled in the file.",
    howToUse:
      "When you get a quote, ask: which pot? If it is Core and flexible, you often have more choice inside Core. If it is stated, it is for the named support only.",
  });

  const stated = /stated support/i.test(t);
  const flexible = /flexible support/i.test(t);
  pieces.push({
    id: "stated",
    title: stated || flexible ? "Flexible vs stated" : "Check flexible or stated on each line",
    easy: "Flexible: you can often choose NDIS supports inside that pot. Stated: only the named support.",
    found: stated || flexible ? snippet(t, lower.search(/stated support|flexible support/)) : "Not clearly marked in the extracted text.",
    howToUse:
      "Self-managing does not let you ignore a stated line. If a therapist is stated, that money is not for a different therapy unless the plan is changed.",
  });

  const goalIdx = lower.search(/\bgoals?\b/);
  pieces.push({
    id: "goals",
    title: "Goals are the “why”",
    easy: "Supports should connect to the goals in the plan — in your own words, not only clinic words.",
    found: goalIdx >= 0 ? snippet(t, goalIdx, 200) : "No goal heading was read. You can still write your own “why” on a slip.",
    howToUse:
      "Before you spend, ask: does this help a goal, or is it an ordinary living cost? Keep a one-line note with the invoice.",
  });

  const coord = /support coordinat/i.test(t);
  pieces.push({
    id: "help",
    title: coord ? "Support coordination is in this plan" : "You can still get help to manage",
    easy: "Self-manage does not mean do it alone. A coordinator, plan manager, nominee, or advocate can sit with you.",
    found: coord ? snippet(t, lower.search(/support coordinat/)) : "No support coordination line was read.",
    howToUse:
      "Make a simple weekly rhythm: quotes in one folder, invoices in another, a note of which pot, and a check of the my NDIS balance.",
  });

  const lessons: PlanLesson[] = [
    {
      n: 1,
      title: "Name the pot before you book",
      body: "Core, Capacity Building, Capital, or Recurring. If you cannot name the pot, pause. Look at the plan or the my NDIS app.",
    },
    {
      n: 2,
      title: "Stated means “this support, not another”",
      body: "Flexible Core is often the most choice. Stated Capacity Building is usually tied to a named therapy or coordination.",
    },
    {
      n: 3,
      title: "Keep the paper trail",
      body: "Quote, service agreement, invoice, date, hours, which pot. Self-managing is mostly good records, not extra courage.",
    },
    {
      n: 4,
      title: "Claim close to the support date",
      body: "Rules on how long you have to claim can change. From late 2026, government pages describe 90 days. Check the current NDIA claiming page, not a rumour.",
    },
    {
      n: 5,
      title: "Price limits still apply",
      body: "Self-managed people often have more provider choice, but NDIS supports still have to be NDIS supports. Check the current Pricing Schedule.",
    },
    {
      n: 6,
      title: "The my NDIS app is the live balance",
      body: "This explainer is a reading aid on this device. It does not replace the plan letter or the app. If they disagree, trust the letter and the app.",
    },
  ];

  if (management === "self") {
    lessons.unshift({
      n: 0,
      title: "You pay, then you claim",
      body: "Agree the hours and the pot first. Pay in a way you can prove. Claim with the invoice. If cash flow is tight, ask about plan management — that is allowed.",
    });
  }

  return {
    fileName,
    extractedAt: new Date().toISOString(),
    management,
    money,
    pieces,
    lessons: lessons.map((l, i) => ({ ...l, n: i + 1 })),
    warnings,
    textLength: t.trim().length,
  };
}

export function planSlipBody(read: PlanRead): string {
  const lines = [
    `Plan reading aid for ${read.fileName}`,
    `How it looks managed: ${read.management}`,
    read.money.length ? `Amounts noticed: ${read.money.map((m) => `${m.label} ${m.amount}`).join("; ")}` : "",
    "",
    ...read.pieces.map((p) => `${p.title}\n${p.easy}\n${p.howToUse}`),
    "",
    "Practice reading aid in Plan Decoder. Not the NDIA. Check the plan letter and the my NDIS app.",
  ];
  return lines.filter(Boolean).join("\n\n");
}

export function guessEvidenceTypeFromPlan(): EvidenceType {
  return "plan";
}
