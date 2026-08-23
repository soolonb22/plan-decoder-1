import { jsPDF } from "jspdf";
import type { Client } from "../types";
import { FOOTER_DISCLAIMER, REPORT_BANNER, SHORT_DISCLAIMER } from "./disclaimers";
import { buildClinicalModel, type ClinicalModel, type ResultRow } from "./clinical";
import type { AssessmentDraft } from "./types";

const PURPLE = [110, 44, 146] as const;
const INK = [58, 42, 69] as const;
const MUTED = [107, 91, 118] as const;
const LINE = [228, 216, 236] as const;
const SOFT = [243, 234, 248] as const;
const YES_BG = [251, 236, 234] as const;
const YES = [163, 59, 50] as const;
const NO_BG = [234, 246, 220] as const;
const WHITE = [255, 255, 255] as const;
const LEAF = [139, 197, 65] as const;

export async function downloadPracticePdf(draft: AssessmentDraft, client?: Client | null) {
  const score = draft.score;
  if (!score) return;
  const model = buildClinicalModel(draft, score, client);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 42;
  const width = pageW - margin * 2;
  let y = margin;
  let page = 1;

  const footer = () => {
    doc.setFillColor(...PURPLE);
    doc.rect(0, pageH - 28, pageW, 28, "F");
    doc.setTextColor(...WHITE);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `Page ${page}  ·  PRACTICE ONLY — not NDIA / NDIS / WHO / I-CAN  ·  Independent of government`,
      margin,
      pageH - 12,
    );
  };

  const header = () => {
    doc.setFillColor(246, 243, 248);
    doc.rect(0, 0, pageW, 72, "F");
    doc.setFillColor(...PURPLE);
    doc.roundedRect(margin, 16, 40, 40, 8, 8, "F");
    doc.setDrawColor(...WHITE);
    doc.setLineWidth(2.2);
    doc.circle(margin + 20, 36, 9, "S");
    doc.setFillColor(...LEAF);
    doc.circle(margin + 34, 24, 4, "F");
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Practice assessment powered by", margin + 52, 30);
    doc.setTextColor(...PURPLE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Plan Decoder", margin + 52, 48);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.6);
    doc.line(margin, 72, pageW - margin, 72);
    y = 88;
  };

  const addPage = () => {
    footer();
    doc.addPage();
    page += 1;
    header();
    footer();
  };

  const need = (h: number) => {
    if (y + h > pageH - 48) addPage();
  };

  const wrap = (text: string, fontSize = 10, max = width) => {
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, max) as string[];
  };

  const para = (text: string, opts?: { bold?: boolean; color?: readonly number[]; size?: number; gap?: number }) => {
    const size = opts?.size ?? 10;
    const lines = wrap(text, size);
    need(lines.length * (size + 3) + 6);
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(size);
    const colour = opts?.color ?? INK;
    doc.setTextColor(colour[0], colour[1], colour[2]);
    for (const line of lines) {
      need(size + 4);
      doc.text(line, margin, y);
      y += size + 3;
    }
    y += opts?.gap ?? 6;
  };

  const heading = (text: string) => {
    y += 8;
    need(28);
    doc.setFillColor(...SOFT);
    doc.rect(margin, y - 12, width, 20, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...PURPLE);
    doc.text(text, margin + 8, y + 2);
    y += 18;
  };

  header();
  footer();

  doc.setFillColor(...PURPLE);
  doc.rect(margin, y, width, 28, "F");
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(model.title, pageW / 2, y + 18, { align: "center" });
  y += 40;

  const meta = [
    ["Client name", model.clientName],
    ["Date administered", model.administered],
    ["Completed by", model.respondent],
    ["Coverage", model.answeredLine],
  ];
  const colW = width / 2;
  meta.forEach((pair, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + col * colW;
    const yy = y + row * 32;
    doc.setDrawColor(...LINE);
    doc.setFillColor(255, 255, 255);
    doc.rect(x, yy, colW - 6, 28, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(pair[0], x + 8, yy + 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text(pair[1], x + 8, yy + 22);
  });
  y += 76;

  doc.setFillColor(...YES_BG);
  doc.rect(margin, y, width, 36, "F");
  para(SHORT_DISCLAIMER + " Independent of the NDIA, NDIS, WHO, and any official I-CAN tool. Not a diagnosis. Not a funding quote.", {
    color: YES,
    size: 8,
    gap: 10,
  });

  const drawTable = (title: string, rows: ResultRow[]) => {
    heading(title);
    const cols = [150, 110, 130, width - 390];
    const headers = ["Scale", "Raw / average", "Above practice threshold?", "Practice index"];
    need(22 + rows.length * 20);
    let x = margin;
    doc.setFillColor(...SOFT);
    doc.rect(margin, y, width, 18, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    headers.forEach((h, i) => {
      doc.text(h, x + 6, y + 12);
      x += cols[i];
    });
    y += 18;
    rows.forEach((r, idx) => {
      need(20);
      if (idx % 2 === 0) {
        doc.setFillColor(252, 250, 253);
        doc.rect(margin, y, width, 20, "F");
      }
      x = margin;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...INK);
      const raw = `${r.rawMax === 4 ? r.raw.toFixed(2) : r.raw.toFixed(1)} / ${r.rawMax}`;
      const cells = [r.title, `${raw}  (${r.descriptor})`, r.aboveThreshold ? "Yes" : "No", r.answered ? String(r.practiceIndex) : "—"];
      cells.forEach((c, i) => {
        if (i === 2) {
          if (r.aboveThreshold) {
            doc.setFillColor(...YES_BG);
            doc.rect(x + 2, y + 2, cols[i] - 8, 16, "F");
            doc.setTextColor(...YES);
            doc.setFont("helvetica", "bold");
          } else {
            doc.setFillColor(...NO_BG);
            doc.rect(x + 2, y + 2, cols[i] - 8, 16, "F");
            doc.setTextColor(62, 122, 20);
            doc.setFont("helvetica", "normal");
          }
        } else {
          doc.setTextColor(...INK);
          doc.setFont("helvetica", i === 0 ? "bold" : "normal");
        }
        const clipped = doc.splitTextToSize(c, cols[i] - 10)[0] as string;
        doc.text(clipped, x + 6, y + 13);
        x += cols[i];
      });
      y += 20;
    });
    y += 8;
  };

  drawTable("Results — WHODAS-inspired function", [...model.whodasRows, model.overallWho]);
  const supportShown = model.supportRows.filter((r) => r.answered);
  if (supportShown.length) {
    drawTable("Results — support rehearsal", [...supportShown, model.overallSupport]);
  }

  heading("Domain averages on the 0–4 practice scale");
  const answeredWho = model.whodasRows.filter((r) => r.answered);
  const barMax = 260;
  answeredWho.forEach((r) => {
    need(22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    doc.text(r.title, margin, y + 8);
    const bx = margin + 140;
    doc.setFillColor(...SOFT);
    doc.rect(bx, y, barMax, 12, "F");
    const w = Math.max(2, (r.raw / 4) * barMax);
    const fill = r.aboveThreshold ? PURPLE : ([191, 169, 217] as const);
    doc.setFillColor(fill[0], fill[1], fill[2]);
    doc.rect(bx, y, w, 12, "F");
    const tx = bx + (PRACTICE_X(barMax));
    doc.setDrawColor(...YES);
    doc.setLineWidth(0.8);
    doc.line(tx, y - 2, tx, y + 14);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(r.raw.toFixed(2), bx + barMax + 8, y + 10);
    y += 18;
  });
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("Dashed line = practice threshold (2.0 Moderate). Not a clinical cutoff.", margin, y + 4);
  y += 16;

  heading("Practice index by domain (simple 0–100 — not a percentile)");
  const bars = [...answeredWho, model.overallWho];
  const n = Math.max(1, bars.length);
  const gap = 8;
  const bw = Math.min(48, (width - gap * n) / n);
  need(120);
  const base = y + 90;
  bars.forEach((r, i) => {
    const h = (r.practiceIndex / 100) * 80;
    const x = margin + i * (bw + gap) + 20;
    doc.setFillColor(243, 234, 248);
    doc.rect(x, base - 80, bw, 40, "F");
    doc.setFillColor(...PURPLE);
    doc.rect(x, base - h, bw, h, "F");
    doc.setFontSize(7);
    doc.setTextColor(...INK);
    doc.text(String(r.practiceIndex), x + bw / 2, base - h - 4, { align: "center" });
    const label = r.title.split(" ")[0];
    doc.setTextColor(...MUTED);
    doc.text(label, x + bw / 2, base + 12, { align: "center" });
  });
  y = base + 28;

  heading("Interpretation");
  para(
    "Practice index is a simple 0–100 transform of answered items. It is not a normative percentile and not official WHODAS IRT scoring. The practice threshold is an Plan Decoder rehearsal line at Moderate (average 2.0 / 4).",
    { size: 9, color: MUTED },
  );
  for (const nara of model.narratives) {
    need(48);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...PURPLE);
    doc.text(nara.title, margin, y);
    y += 14;
    para(nara.rawLine, { size: 9, bold: true, color: nara.above ? YES : MUTED, gap: 4 });
    para(nara.body, { size: 10, gap: 4 });
    for (const e of nara.endorsed.slice(0, 5)) {
      para(`• ${e.text} (${e.label})`, { size: 9, gap: 2 });
    }
    y += 6;
  }

  heading("Everyday impact");
  para(model.impairment);
  for (const e of model.extra) {
    para(`${e.label}: ${e.value}`, { size: 9, gap: 3 });
  }

  heading("Scoring and interpretation information");
  para(
    "Plan Decoder uses average scores across answered items. Higher averages mean more difficulty (function) or more extra support (support rehearsal) as you described it. Official WHODAS 2.0 IRT percentiles are not calculated. Support questions are Plan Decoder’s original rehearsal, not I-CAN v6. “Above practice threshold” means average ≥ 2.0 on function items, or intensity ≥ 5.5 on support rehearsal. That is not an NDIA rule.",
  );

  for (const grid of model.grids) {
    heading(grid.title);
    const labelW = 220;
    const cellW = (width - labelW) / Math.max(1, grid.labels.length);
    need(36);
    doc.setFillColor(...SOFT);
    doc.rect(margin, y, width, 28, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...INK);
    doc.text("Item", margin + 6, y + 17);
    grid.labels.forEach((lab, i) => {
      const x = margin + labelW + i * cellW;
      const lines = doc.splitTextToSize(lab, cellW - 4) as string[];
      doc.text(lines[0], x + cellW / 2, y + 17, { align: "center" });
    });
    y += 28;
    for (const row of grid.rows) {
      need(22);
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.4);
      doc.rect(margin, y, width, 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...INK);
      const prompt = doc.splitTextToSize(`${row.n}. ${row.prompt}`, labelW - 10)[0] as string;
      doc.text(prompt, margin + 6, y + 13);
      row.labels.forEach((_, i) => {
        const x = margin + labelW + i * cellW;
        const selected = row.value === i;
        if (selected) {
          doc.setFillColor(...PURPLE);
          doc.rect(x, y, cellW, 20, "F");
          doc.setTextColor(...WHITE);
          doc.setFont("helvetica", "bold");
        } else {
          doc.setTextColor(...MUTED);
          doc.setFont("helvetica", "normal");
        }
        doc.setFontSize(8);
        doc.text(String(i), x + cellW / 2, y + 13, { align: "center" });
      });
      y += 20;
    }
    y += 8;
  }

  heading("Important");
  para(REPORT_BANNER.replaceAll("\n", " "), { color: YES, size: 9 });
  para(FOOTER_DISCLAIMER, { size: 8, color: MUTED });
  para(model.roleLine + ". You can edit or delete this on the device. Do not send it instead of seeing a qualified clinician.", {
    size: 8,
    color: MUTED,
  });

  const safe = model.clientName.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "practice";
  doc.save(`Plan-Decoder-practice-report-${safe}-${model.administered.replace(/\s+/g, "-")}.pdf`);
}

function PRACTICE_X(barMax: number) {
  return (2 / 4) * barMax;
}
