import { DOMAINS } from "./content/language";
import type { FlowDef } from "./content/flows";

export const DRAFT_FOOTER = `

---
Draft prepared in Plan Decoder for the person or their support network to edit. Not an NDIA decision. Not a clinical diagnosis. Not a guarantee of funding. Strengths and support needs can both be true.`;

export function draftFromFlow(flow: FlowDef, answers: Record<string, string>) {
  const a = (id: string) => (answers[id] || "").trim();
  switch (flow.id) {
    case "impact":
      return [
        `Impact statement — ${a("situation") || "daily life"}`,
        "",
        `Person: ${a("who") || "the participant"}`,
        "",
        "What is hard",
        a("without") || "(add what happens without support)",
        "",
        "How often and for how long",
        a("how-often") || "(add frequency)",
        "",
        "What changes with the right support",
        a("with") || "(add the difference support makes)",
        "",
        "What already works",
        a("strength") || "(add a strength or helpful condition)",
        "",
        "The ask",
        a("ask") || "(add the support being requested)",
        DRAFT_FOOTER,
      ].join("\n");
    case "meeting":
      return [
        "Meeting brief",
        "",
        `Purpose: ${a("purpose") || "planning"}`,
        "",
        "Must be said",
        a("must-say"),
        "",
        "Typical week",
        a("week"),
        "",
        "Hard week",
        a("hard"),
        "",
        "What we are asking",
        a("ask"),
        "",
        "Questions for the NDIA / planner",
        a("questions"),
        DRAFT_FOOTER,
      ].join("\n");
    case "carer":
      return [
        "Carer impact note",
        "",
        "Extra support provided",
        a("task"),
        "",
        `Time: ${a("hours")}`,
        "",
        "Cost to the carer and household",
        a("body"),
        "",
        "If this continues",
        a("risk"),
        "",
        "Paid support that would change this week",
        a("help"),
        DRAFT_FOOTER,
      ].join("\n");
    case "coc":
      return [
        "Change of circumstances — draft letter",
        "",
        "I am writing because there has been a significant change of circumstances.",
        "",
        `What changed: ${a("what")}`,
        `When: ${a("when")}`,
        "",
        "Impact on daily function",
        a("function"),
        "",
        "What I am asking",
        a("ask"),
        "",
        "If the plan stays the same",
        a("risk"),
        "",
        "Please confirm receipt in writing and the next step and timeframe.",
        DRAFT_FOOTER,
      ].join("\n");
    case "appointment":
      return [
        "Appointment brief",
        "",
        a("who"),
        `Needed from this appointment: ${a("goal")}`,
        "",
        "Typical week",
        a("typical"),
        "",
        "Access needs for the appointment",
        a("sensory"),
        "",
        "Questions",
        a("ask"),
        "",
        "Please use functional language (what, how often, what happens without support). Please do not write guarantees of NDIS funding.",
        DRAFT_FOOTER,
      ].join("\n");
    default:
      return [
        flow.title,
        "",
        ...flow.fields.map((f) => `${f.prompt}\n${a(f.id)}\n`),
        DRAFT_FOOTER,
      ].join("\n");
  }
}

export function functionalParagraph(input: {
  domain: string;
  task: string;
  without: string;
  frequency: string;
  withSupport: string;
}) {
  const domain = DOMAINS.find((d) => d.id === input.domain)?.title ?? "Daily life";
  return `${domain}: ${input.task || "This task"} is affected by disability. Without support, ${input.without || "the task is not completed safely or at all"}. This happens ${input.frequency || "regularly"}. With the right support, ${input.withSupport || "participation is possible"}. This describes function. It is not a diagnosis or a funding decision.`;
}

export const SYSTEM_GUARD = `You are Plan Decoder, a calm NDIS evidence and advocacy writing assistant for people in Australia.

Rules you must never break:
- No clinical diagnoses, no treatment claims, no statements that someone "has" a condition unless the user already stated it as their own words.
- No guarantees of NDIS funding or review outcomes.
- Strengths-based and trauma-informed. Never blame, never use words like non-compliant, attention-seeking, lazy, manipulative.
- Plain language. Short sentences. Functional impact: what is hard, how often, what happens without support, what changes with support.
- Do not invent facts. If information is missing, use a short placeholder in [square brackets].
- Australian English.
- You may use WHODAS-style life areas (cognition, mobility, self-care, getting along, life activities, participation) as organisers only.
- Always end with a one-line disclaimer that this is a draft for the person to edit, not an NDIA decision and not a clinical report.
- If the user asks for something unsafe or a clinical claim, refuse that part and keep the rest helpful.`;
