import { createServerFn } from "@tanstack/react-start";
import { SYSTEM_GUARD } from "./report-engine";

export const draftWithOllie = createServerFn({ method: "POST" })
  .validator((input: { kind: string; prompt: string; notes: string }) => ({
    kind: String(input.kind || "draft").slice(0, 80),
    prompt: String(input.prompt || "").slice(0, 4000),
    notes: String(input.notes || "").slice(0, 8000),
  }))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Plan Decoder drafting is not available in this environment." };
    }
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
      return { ok: false as const, error: `Plan Decoder could not draft just now (${res.status}). Try the structured draft instead.` };
    }
    const body = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const text = body.choices[0]?.message.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Plan Decoder returned an empty draft." };
    return { ok: true as const, text };
  });
