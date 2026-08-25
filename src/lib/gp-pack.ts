import { jsPDF } from "jspdf";
import { PLAN_CHECKLIST } from "./content/checklist";
import { scoreWhodas, descriptor } from "./whodas";
import { DOMAINS } from "./content/language";
import { formatDate, todayISO } from "./utils";
import { claimDue, money, POTS } from "./claims";
import type {
  AppointmentPrep,
  BudgetLine,
  ChecklistState,
  ClaimItem,
  Client,
  EvidenceItem,
  Flag,
  FluctuationPoint,
  Goal,
  LogEntry,
  MeetingPrep,
  SchoolNote,
  WhodasRecord,
} from "./types";

export type PackInput = {
  client?: Client | null;
  evidence: EvidenceItem[];
  logs: LogEntry[];
  flags: Flag[];
  goals: Goal[];
  schoolNotes: SchoolNote[];
  fluctuations: FluctuationPoint[];
  appointments: AppointmentPrep[];
  meetings: MeetingPrep[];
  checklist: ChecklistState[];
  whodas: WhodasRecord[];
  claims: ClaimItem[];
  budgets: BudgetLine[];
};

const PURPLE: [number, number, number] = [110, 44, 146];
const INK: [number, number, number] = [58, 42, 69];
const MUTED: [number, number, number] = [107, 91, 118];
const LINE: [number, number, number] = [228, 216, 236];
const WHITE: [number, number, number] = [255, 255, 255];
const LEAF: [number, number, number] = [139, 197, 65];

function clip(s: string, n = 420) {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n)}…` : t;
}

export function buildGpPackText(input: PackInput) {
  const name = input.client?.preferredName || input.client?.name || "Participant";
  const latestWho = [...input.whodas].sort((a, b) => b.date.localeCompare(a.date))[0];
  const who = latestWho ? scoreWhodas(latestWho.items) : null;
  const lines: string[] = [
    `Plan Decoder GP pack — ${name} — ${todayISO()}`,
    "PRACTICE NOTES on this device. Not the NDIA. Not a clinical report. Not a diagnosis.",
    input.client?.ndisNumber ? `NDIS number (as recorded here): ${input.client.ndisNumber}` : "",
    input.client?.planStart || input.client?.planEnd
      ? `Plan dates (as recorded): ${input.client?.planStart || "?"} to ${input.client?.planEnd || "?"}`
      : "",
    input.client?.letterReceived ? `Decision letter received (as recorded): ${input.client.letterReceived}` : "",
    "",
    "Goals",
    ...(input.goals.length
      ? input.goals.map((g) => `- ${g.title}${g.why ? ` — ${g.why}` : ""}${g.supports ? ` / support: ${g.supports}` : ""} [${g.status}]`)
      : ["- None saved"]),
    "",
    "Evidence slips",
    ...(input.evidence.length
      ? input.evidence.slice(0, 20).map((e) => `- ${e.date} · ${e.title}\n  ${clip(e.body)}`)
      : ["- None saved"]),
    "",
    "Diary and carer logs",
    ...(input.logs.length
      ? input.logs.slice(0, 16).map((e) => `- ${e.date} (${e.kind}, energy ${e.energy}/5) ${clip(e.whatHappened)} / ${clip(e.impact, 180)}`)
      : ["- None saved"]),
    "",
    "Flags",
    ...(input.flags.length ? input.flags.map((f) => `- ${f.kind}: ${f.title} — ${clip(f.detail, 180)}`) : ["- None saved"]),
    "",
    "School notes",
    ...(input.schoolNotes.length
      ? input.schoolNotes.slice(0, 8).map((s) => `- ${s.date} ${s.setting}: worked ${clip(s.whatWorked, 140)}; hard ${clip(s.whatWasHard, 140)}; ask ${clip(s.requestedSupport, 140)}`)
      : ["- None saved"]),
    "",
    "Fluctuation (last points)",
    ...(input.fluctuations.length
      ? [...input.fluctuations]
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-14)
          .map((p) => `- ${p.date} energy ${p.energy} regulation ${p.regulation} participation ${p.participation}${p.notes ? ` — ${p.notes}` : ""}`)
      : ["- None saved"]),
    "",
    "Function snapshot (WHODAS-inspired, practice only)",
    who
      ? `- ${latestWho!.date}: overall average ${who.avgOverall.toFixed(2)} (${descriptor(who.avgOverall)}), simple 0–100 ${who.simple100}. ${who.answered} items.`
      : "- None saved",
    ...(who
      ? who.domains
          .filter((d) => d.answered)
          .map((d) => `  · ${DOMAINS.find((x) => x.id === d.domain)?.title ?? d.domain}: ${d.avg.toFixed(2)}`)
      : []),
    "",
    "Appointment briefs",
    ...(input.appointments.length
      ? input.appointments.slice(0, 6).map((a) => `- ${a.date} ${a.title} (${a.who})\n  Q: ${clip(a.questions, 200)}`)
      : ["- None saved"]),
    "",
    "Meeting briefs",
    ...(input.meetings.length
      ? input.meetings.slice(0, 6).map((m) => `- ${m.date} ${m.title}: ${clip(m.talkingPoints || m.purpose, 200)}`)
      : ["- None saved"]),
    "",
    "Plan checklist (ticked)",
    ...PLAN_CHECKLIST.flatMap((g) =>
      g.items
        .filter((i) => input.checklist.some((r) => r.key === i.key && r.done))
        .map((i) => `- ${i.label}`),
    ),
    input.checklist.some((r) => r.done) ? "" : "- None ticked",
    "",
    "Spend notes (not the my NDIS balance)",
    ...(input.budgets.length
      ? input.budgets.map((b) => `- ${b.name} (${b.category}): ${money(b.spent)} / ${money(b.allocated)}`)
      : ["- None saved"]),
    "",
    "Claims / invoices (practice book)",
    ...(input.claims.length
      ? input.claims.slice(0, 16).map((c) => {
          const due = claimDue(c);
          const pot = POTS.find((p) => p.id === c.pot)?.label ?? c.pot;
          return `- ${c.date} ${c.provider} · ${c.description} · ${pot} · ${money(c.amount)} · ${c.status}${due?.left != null ? ` · ${due.left} days on 90-day practice clock` : ""}`;
        })
      : ["- None saved"]),
    "",
    "Ask the reader: this is the person’s own notes of function, frequency, and unpaid support. Please keep originals of clinical reports too.",
    "Plan Decoder is independent of the NDIA, NDIS, WHO, and I-CAN.",
  ];
  return lines.filter((l) => l !== undefined).join("\n");
}

export async function downloadGpPackPdf(input: PackInput) {
  const text = buildGpPackText(input);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 42;
  const width = pageW - margin * 2;
  let y = 88;
  let page = 1;
  const name = input.client?.preferredName || input.client?.name || "Participant";

  const footer = () => {
    doc.setFillColor(...PURPLE);
    doc.rect(0, pageH - 28, pageW, 28, "F");
    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Page ${page}  ·  PRACTICE PACK — not NDIA / NDIS  ·  ${name}`, margin, pageH - 12);
  };

  const header = () => {
    doc.setFillColor(246, 243, 248);
    doc.rect(0, 0, pageW, 72, "F");
    doc.setFillColor(...PURPLE);
    doc.roundedRect(margin, 16, 40, 40, 8, 8, "F");
    doc.setFillColor(...LEAF);
    doc.circle(margin + 34, 24, 4, "F");
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Take this to a GP or planner  ·  practice notes", margin + 52, 30);
    doc.setTextColor(...PURPLE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Plan Decoder pack", margin + 52, 48);
    doc.setDrawColor(...LINE);
    doc.line(margin, 72, pageW - margin, 72);
    y = 88;
  };

  header();
  footer();

  const need = (h: number) => {
    if (y + h > pageH - 48) {
      footer();
      doc.addPage();
      page += 1;
      header();
      footer();
    }
  };

  const para = (body: string, size = 10, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...INK);
    const rows = doc.splitTextToSize(body, width) as string[];
    for (const row of rows) {
      need(14);
      doc.text(row, margin, y);
      y += 14;
    }
  };

  para(
    `For ${name}. Printed ${formatDate(todayISO())}. These are the person’s own notes on this device. Not an NDIA decision, not a diagnosis, not a quote of funding.`,
    10,
  );
  y += 8;
  para("Contents", 12, true);
  y += 4;
  const blocks = text.split("\n\n");
  for (const block of blocks.slice(1)) {
    const [title, ...rest] = block.split("\n");
    if (!title) continue;
    y += 6;
    para(title, 12, true);
    y += 2;
    para(rest.join("\n") || " ", 10);
  }

  footer();
  const safe = name.replace(/[^\w]+/g, "-").slice(0, 40);
  doc.save(`Plan-Decoder-GP-pack-${safe}-${todayISO()}.pdf`);
}
