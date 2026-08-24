import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { consumeOutcome, refundOutcome } from "@/lib/billing-sync";
import { creditSubject, type OutcomeKind } from "@/lib/billing";
import { SYSTEM_GUARD } from "./report-engine";

const KIND_MAP: Record<string, OutcomeKind> = {
  language: "language_draft",
  "functional-language": "language_draft",
  impact: "impact_statement",
  scripts: "advocacy_script",
  meeting: "meeting_brief",
  appointment: "appointment_brief",
  clinical: "clinical_draft",
  "clinical-language": "clinical_draft",
  report: "covering_letter",
  letter: "covering_letter",
  guide: "guided_letter",
};

export const draftWithOllie = createServerFn({ method: "POST" })
  .validator((input: { kind: string; prompt: string; notes: string }) => ({
    kind: String(input.kind || "draft").slice(0, 80),
    prompt: String(input.prompt || "").slice(0, 4000),
    notes: String(input.notes || "").slice(0, 8000),
  }))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Plan Decoder drafting is not available in this environment." };
    }
    const outcome = KIND_MAP[data.kind] ?? "language_draft";
    const subject = creditSubject(outcome, data.notes.slice(0, 80));
    const paid = await consumeOutcome(context.userId, outcome, subject);
    if (!paid.ok) return { ok: false as const, error: paid.error, credits: paid.credits };
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.3,
          max_tokens: 1200,
          messages: [
            { role: "system", content: SYSTEM_GUARD },
            {
              role: "user",
              content: `Kind of draft: ${data.kind}\n\nInstructions:\n${data.prompt}\n\nNotes from the person (treat as their words, do not add new facts):\n${data.notes || "(none)"}`,
            },
          ],
        }),
      });
      if (!res.ok) {
        await refundOutcome(context.userId, outcome, subject);
        return { ok: false as const, error: `Plan Decoder could not draft just now (${res.status}). Try the structured draft instead.`, credits: paid.credits + 1 };
      }
      const body = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      const text = body.choices[0]?.message.content?.trim() ?? "";
      if (!text) {
        await refundOutcome(context.userId, outcome, subject);
        return { ok: false as const, error: "Plan Decoder returned an empty draft.", credits: paid.credits + 1 };
      }
      return { ok: true as const, text, credits: paid.credits };
    } catch {
      await refundOutcome(context.userId, outcome, subject);
      return { ok: false as const, error: "Plan Decoder could not draft just now. Your structured notes are still saved." };
    }
  });
