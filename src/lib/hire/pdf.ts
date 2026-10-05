import { jsPDF } from "jspdf";
import type { HireDraft } from "./model";
import { agreementSections, guideSections, type Section } from "./sections";

const FOOTER =
  "Draft for you to edit. Not an NDIA decision. Not legal advice. Not a guarantee of funding.";

function render(title: string, lede: string, sections: Section[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageW = 595.28;
  const pageH = 841.89;
  const width = pageW - margin * 2;
  let y = margin;

  const ensure = (needed: number) => {
    if (y + needed > pageH - 52) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (value: string, size: number, style: "normal" | "bold", color: [number, number, number]) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(value, width) as string[];
    const leading = size + 4;
    for (const line of lines) {
      ensure(leading);
      if (line) doc.text(line, margin, y);
      y += leading;
    }
  };

  write(title, 18, "bold", [75, 28, 104]);
  y += 4;
  write(lede, 10, "normal", [92, 84, 104]);
  y += 8;
  for (const section of sections) {
    y += 8;
    write(section.heading, 13, "bold", [36, 28, 51]);
    y += 2;
    write(section.body, 10.5, "normal", [36, 28, 51]);
  }

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(92, 84, 104);
    doc.text(FOOTER, margin, pageH - 28);
    doc.text(`${i} / ${pages}`, pageW - margin, pageH - 28, { align: "right" });
  }
  return doc;
}

export function downloadAgreement(draft: HireDraft) {
  render(
    "Draft service agreement",
    "Filled from your notes. Edit it with the provider before anyone signs. Blank brackets are still yours to complete.",
    agreementSections(draft),
  ).save("plan-decoder-service-agreement-draft.pdf");
}

export function downloadGuide() {
  render(
    "Before you hire",
    "What to know before you hire a support worker or other professional with NDIS funding. Read it at your own pace.",
    guideSections(),
  ).save("plan-decoder-before-you-hire.pdf");
}
