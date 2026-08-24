import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { OLLIE_ASSESS_SYSTEM, REPORT_SYSTEM } from "./assessment/disclaimers";

async function chat(apiKey: string, system: string, user: string, maxTokens: number) {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.3,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) return { ok: false as const, error: `Plan Decoder could not answer just now (${res.status}).` };
  const body = (await res.json()) as { choices: { message: { content: string } }[] };
  const text = body.choices[0]?.message.content?.trim() ?? "";
  if (!text) return { ok: false as const, error: "Plan Decoder had nothing to add." };
  return { ok: true as const, text };
}

export const askOllieGuide = createServerFn({ method: "POST" })
  .validator((input: { question: string; context: string; history: { role: string; content: string }[] }) => ({
    question: String(input.question || "").slice(0, 600),
    context: String(input.context || "").slice(0, 1800),
    history: Array.isArray(input.history)
      ? input.history.slice(-6).map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content || "").slice(0, 500),
        }))
      : [],
  }))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Plan Decoder chat is not available in this environment." };
    const user = [
      "Current practice screen:",
      data.context || "(none)",
      "",
      data.history
        .map((m) => `${m.role === "assistant" ? "Plan Decoder" : "Person"}: ${m.content}`)
        .join("\n"),
      "",
      `Person: ${data.question}`,
      "",
      "Ask at most one clarifying question if their answer is vague. Do not lead. Do not score them.",
    ].join("\n");
    return chat(apiKey, OLLIE_ASSESS_SYSTEM, user, 280);
  });

export const writeAiPracticeReport = createServerFn({ method: "POST" })
  .validator((input: { digest: string; assessmentId?: string }) => ({
    digest: String(input.digest || "").slice(0, 10000),
    assessmentId: String(input.assessmentId || "").slice(0, 80),
  }))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Plan Decoder drafting is not available in this environment." };
    const { consumeOutcome, refundOutcome } = await import("@/lib/billing-sync");
    const subject = `ai:${data.assessmentId || "practice"}`;
    const paid = await consumeOutcome(context.userId, "practice_report", subject);
    if (!paid.ok) return { ok: false as const, error: paid.error };
    const result = await chat(
      apiKey,
      REPORT_SYSTEM,
      `Write the practice report from this digest. Keep every number exactly as given. Australian English.\n\n${data.digest}`,
      1800,
    );
    if (!result.ok) {
      await refundOutcome(context.userId, "practice_report", subject);
      return result;
    }
    return { ...result, credits: paid.credits };
  });


export const speakOllie = createServerFn({ method: "POST" })
  .validator((input: { text: string }) => ({
    text: String(input.text || "").slice(0, 360),
  }))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Voice is not available in this environment." };
    if (!data.text.trim()) return { ok: false as const, error: "Nothing to read." };
    const res = await fetch("https://api.x.ai/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ text: data.text.trim(), voice_id: "eve" }),
    });
    if (!res.ok) {
      return { ok: false as const, error: `Plan Decoder could not speak just now (${res.status}).` };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") || "audio/mpeg";
    return { ok: true as const, mime, audio: buf.toString("base64") };
  });
