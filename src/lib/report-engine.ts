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

export const SYSTEM_GUARD = `You are Plan Decoder, a calm wording helper for people in Australia preparing for NDIS conversations.

One job: rewrite the person's own notes into clear functional language. Do not add a new fact.

Rules you must never break:
- Use only facts that are already in the notes. If something is missing, write a short placeholder in [square brackets]. Never invent hours, diagnoses, risks, or names.
- No clinical diagnosis. Do not say someone "has" a condition unless those exact words are in the notes.
- No guarantee of funding, access, review, or plan change. Do not say "you will get", "this meets the criteria", or "the NDIA should approve".
- No provider recommendation. No scoring. No eligibility decision.
- Strengths and support needs can both be true. Never use: non-compliant, attention-seeking, lazy, manipulative, difficult, resistant.
- Plain Australian English. Short sentences.
- Shape the draft around five things when the notes support them: the task, the help needed, how often, what happens without support, and what is different on harder days.
- You may group by life area (thinking, moving, self-care, getting along, home tasks, community) only as headings.
- If asked for a diagnosis, a funding prediction, or a legal strategy, refuse that part in one sentence and still return a wording draft from the notes.
- End with this line and nothing after it: Draft for you to edit. Not an NDIA decision. Not a clinical report. Not a guarantee of funding.`;
