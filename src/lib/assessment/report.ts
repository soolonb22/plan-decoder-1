import { formatDate } from "../utils";
import { FOOTER_DISCLAIMER, REPORT_BANNER } from "./disclaimers";
import { BAND_COPY } from "./scoring";
import type { AnswerVal, AssessmentDraft, AssessmentScore, Respondent } from "./types";
import { RESPONDENTS, words } from "./voice";

function line(label: string, value: string) {
  return value ? `${label}: ${value}` : "";
}

export function digestForAi(draft: AssessmentDraft, score: AssessmentScore) {
  const a = draft.answers;
  const pick = (id: string) => {
    const v = a[id];
    if (v === null || v === undefined || v === "") return "";
    if (Array.isArray(v)) return v.join(", ");
    return String(v);
  };
  return [
    `Respondent: ${draft.respondent}`,
    `Name/nickname: ${pick("name") || "(not given)"}`,
    `Age band: ${pick("ageBand")}`,
    `NDIS status: ${pick("ndisStatus")}`,
    `Living: ${pick("living")}`,
    `Own words: ${pick("disabilityWords")}`,
    `NDIS function ticks: ${pick("ndisFunctions")}`,
    "",
    "SCORES (already calculated — do not change numbers):",
    JSON.stringify(score, null, 2).slice(0, 6000),
    "",
    "SELECTED NOTES:",
    ["disabilityWords", "env-who", "env-ifaway", "env-home", "env-culture", "env-transport", "env-at", "env-safety", "perm-treatment", "perm-gap", "ms-health", "ms-edu", "ms-house", "ms-work", "ms-why-ndis", "cx-at", "cx-home", "cx-behaviour"]
      .map((id) => `${id}: ${pick(id)}`)
      .join("\n"),
    "",
    "SUPPORT EXAMPLES:",
    Object.keys(a)
      .filter((k) => k.startsWith("need-") && k.endsWith("-note"))
      .map((k) => `${k}: ${pick(k)}`)
      .join("\n"),
  ].join("\n");
}

export function localReport(draft: AssessmentDraft, score: AssessmentScore) {
  const a = draft.answers;
  const w = words(draft.respondent);
  const role = RESPONDENTS.find((r) => r.id === draft.respondent)?.label ?? draft.respondent;
  const name = typeof a.name === "string" && a.name.trim() ? a.name.trim() : "the person";
  const band = BAND_COPY[score.eligibilityBand];
  const val = (id: string) => {
    const v = a[id] as AnswerVal;
    if (v === null || v === undefined || v === "") return "Not answered";
    if (Array.isArray(v)) return v.length ? v.join(", ") : "Not answered";
    return String(v);
  };

  const parts = [
    REPORT_BANNER,
    "",
    "OLLIE PRACTICE FUNCTIONAL REPORT",
    `Prepared ${formatDate(draft.updatedAt.slice(0, 10))} · Saved on this device only`,
    "",
    "1. Who completed this",
    line("Completed by", role),
    line("About", name),
    line("Age group", val("ageBand")),
    line("NDIS status (self-reported)", val("ndisStatus")),
    line("Living situation", val("living")),
    line("Disability in their words", val("disabilityWords")),
    "",
    "2. Practice reading of NDIS-style function areas",
    "These six areas are how NDIS access conversations often talk about substantially reduced functional capacity. This is the person’s rehearsal, not an NDIA rating.",
    ...score.ndisFunction.map((n) => `- ${n.title}: ${n.level}`),
    "",
    "3. WHODAS 2.0–inspired snapshot (Plan Decoder scoring)",
    `Overall average ${score.whodas.avgOverall.toFixed(2)} (${score.whodas.descriptor}) · simple 0–100 transform ${score.whodas.simple100} · ${score.whodas.answered} items answered.`,
    "WHO-style average descriptors used here: none (0–0.49), mild (0.5–1.49), moderate (1.5–2.49), severe (2.5–3.49), extreme (3.5–4). Official IRT scoring and population percentiles are not computed.",
    ...score.whodas.domains.map((d) => `- ${d.title}: ${d.answered ? `${d.avg.toFixed(2)} · ${d.descriptor}` : "skipped"}`),
    line("How much this interfered (self-report)", val("h-interfere")),
    line("Days difficulties present (approx)", val("h-days-present")),
    line("Days totally unable (approx)", val("h-days-unable")),
    line("Days cut back (approx)", val("h-days-cut")),
    "",
    "4. Support-needs rehearsal (not official I-CAN)",
    `Overall support intensity ${score.support.overall} / 10 · ${score.support.descriptor}`,
    "Frequency (never → all the time) and intensity (no extra support → someone else does it) are Plan Decoder’s practice scales.",
    ...score.support.domains
      .filter((d) => d.answered)
      .map((d) => {
        const note = val(`need-${d.id}-note`);
        return `- ${d.title}: ${d.support}/10 · ${d.descriptor}${note !== "Not answered" ? ` · Example: ${note}` : ""}`;
      }),
    "",
    "5. Environment and informal support",
    line("Who is in the home", val("env-who")),
    line("Unpaid hours (band)", val("env-hours")),
    line("If unpaid support is away", val("env-ifaway")),
    line("Home", val("env-home")),
    line("Location", val("env-location")),
    line("Language / culture", val("env-culture")),
    line("Transport", val("env-transport")),
    line("Equipment already used", val("env-at")),
    line("Safety notes", val("env-safety")),
    "",
    "6. Permanency — as reported, not as found",
    line("How long", val("perm-duration")),
    line("Clinician has said likely ongoing", val("perm-clinician")),
    line("Treatment already tried", val("perm-treatment")),
    line("Treatment expected to fully reverse (their understanding)", val("perm-remedy")),
    line("Fluctuates", val("perm-fluctuate")),
    line("Written evidence listed", val("perm-evidence")),
    line("Known evidence gaps", val("perm-gap")),
    score.permanency.indicators.length
      ? `Practice indicators from these answers:\n${score.permanency.indicators.map((x) => `- ${x}`).join("\n")}`
      : "No strong permanency indicators were recorded.",
    score.permanency.cautions.length
      ? `Cautions:\n${score.permanency.cautions.map((x) => `- ${x}`).join("\n")}`
      : "",
    "",
    "7. Mainstream and other systems",
    line("Regular GP", val("ms-gp")),
    line("Health / mental health", val("ms-health")),
    line("Education / work adjustments", val("ms-edu")),
    line("Housing", val("ms-house")),
    line("Employment services", val("ms-work")),
    line("What still does not happen", val("ms-why-ndis")),
    "",
    "8. Extra / complex supports mentioned",
    line("Assistive technology", val("cx-at")),
    line("Home modifications", val("cx-home")),
    line("Behaviour support", val("cx-behaviour")),
    line("Overnight / 24-hour discussed", val("cx-overnight")),
    "",
    "9. Practice reading of access-style indicators",
    band.title,
    band.body,
    ...score.eligibilityWhy.map((x) => `- ${x}`),
    "",
    "10. Illustrative public funding band — NOT a quote",
    score.funding.label,
    score.funding.range,
    score.funding.note,
    "Do not write this dollar language into an NDIA form as if it were evidence of entitlement.",
    "",
    "11. Supports people often discuss in these life areas",
    ...score.supports.flatMap((s) => [
      `${s.area}: ${s.ideas.join("; ")}`,
      `  Caveat: ${s.caveat}`,
    ]),
    "",
    "12. Gaps to close before a real appointment",
    ...(score.gaps.length ? score.gaps.map((g) => `- [${g.severity}] ${g.title}: ${g.detail}`) : ["- No extra gaps flagged beyond skipped items."]),
    "",
    "13. Inconsistencies to double-check (not accusations)",
    ...(score.inconsistencies.length
      ? score.inconsistencies.map((g) => `- ${g.title}: ${g.detail}`)
      : ["- No strong mismatches between sections."]),
    "",
    "14. Suggested next steps",
    `- Edit anything that is not true for ${w.who}.`,
    "- Take this to a GP or allied health professional and ask for a functional letter (what is hard, how often, what happens without support).",
    "- Do not submit this as an NDIA form or as an I-CAN assessment.",
    "- Keep a two-week diary of typical days and hard days if function fluctuates.",
    "- Delete this from the device when you no longer want it stored in this browser.",
    "",
    FOOTER_DISCLAIMER,
  ];

  return parts.filter((p) => p !== "").join("\n");
}
