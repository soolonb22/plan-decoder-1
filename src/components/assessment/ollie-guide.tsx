import { useEffect, useRef, useState, type ComponentType } from "react";
import { MessageCircle, Volume2, VolumeX, X } from "lucide-react";
import { askOllieGuide, speakOllie } from "@/lib/ollie-assess";
import { canAccess } from "@/lib/membership";
import { useOllie } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatTurn } from "@/lib/assessment/types";

function CssOllie({ talking }: { talking: boolean }) {
  return (
    <div className="ollie-stage" aria-hidden>
      <div className={cn("ollie-file", talking && "is-talking")}>
        <span className="ollie-tab" />
        <span className="ollie-paper" />
        <span className="ollie-sticker" />
        <span className="ollie-eye left" />
        <span className="ollie-eye right" />
        <span className="ollie-mouth" />
      </div>
    </div>
  );
}

export function OllieGuide({
  prompt,
  context,
}: {
  prompt: string;
  context: string;
}) {
  const membership = useOllie((s) => s.membership);
  const a11y = useOllie((s) => s.a11y);
  const [talking, setTalking] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [Scene, setScene] = useState<ComponentType<{ talking: boolean; reduce: boolean }> | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cache = useRef<Record<string, string>>({});
  const reduce =
    a11y.hide3d ||
    (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const core = canAccess(membership, "core");

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const ok = Boolean(c.getContext("webgl") || c.getContext("experimental-webgl"));
      setWebgl(ok);
      if (ok && !a11y.hide3d) {
        void import("./ollie-scene").then((m) => setScene(() => m.default));
      }
    } catch {
      setWebgl(false);
    }
  }, [a11y.hide3d]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  async function speak() {
    if (!core) {
      setError("Plan Decoder’s voice is part of Core. The words are still on screen.");
      return;
    }
    if (talking) {
      audioRef.current?.pause();
      setTalking(false);
      return;
    }
    setError(null);
    const key = prompt.slice(0, 360);
    try {
      let src = cache.current[key];
      if (!src) {
        const res = await speakOllie({ data: { text: key } });
        if (!res.ok) {
          setError(res.error);
          return;
        }
        src = `data:${res.mime};base64,${res.audio}`;
        cache.current[key] = src;
      }
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.onended = () => setTalking(false);
      audio.onerror = () => setTalking(false);
      setTalking(true);
      await audio.play();
    } catch {
      setTalking(false);
      setError("Voice could not play in this browser.");
    }
  }

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    if (!core) {
      setError("Asking Plan Decoder is part of Core. You can still complete the practice on Free.");
      return;
    }
    setBusy(true);
    setError(null);
    setInput("");
    const next = [...turns, { role: "user" as const, content: q }];
    setTurns(next);
    try {
      const res = await askOllieGuide({
        data: {
          question: q,
          context: `${prompt}\n${context}`.slice(0, 1800),
          history: next,
        },
      });
      if (!res.ok) setError(res.error);
      else setTurns([...next, { role: "assistant", content: res.text }]);
    } catch {
      setError("Plan Decoder could not reply just now.");
    } finally {
      setBusy(false);
    }
  }

  const show3d = Boolean(webgl && !a11y.hide3d && Scene);

  return (
    <aside className="rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-card)] lg:sticky lg:top-20">
      <div className="flex items-start gap-3">
        <div className="size-[7.5rem] shrink-0 overflow-hidden rounded-xl bg-paper-2">
          {show3d && Scene ? <Scene talking={talking} reduce={reduce} /> : <CssOllie talking={talking} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Plan Decoder</p>
          <p className="text-xs text-muted">Practice guide · not the NDIA</p>
          <p className="mt-2 text-sm leading-relaxed" aria-live="polite">
            {prompt}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => void speak()} aria-pressed={talking}>
          {talking ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          {talking ? "Stop" : "Hear Plan Decoder"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setChatOpen((v) => !v)}>
          <MessageCircle className="size-4" />
          Ask Plan Decoder
        </Button>
      </div>
      {error ? <p className="mt-2 text-xs text-alert">{error}</p> : null}
      {chatOpen ? (
        <div className="mt-3 rounded-xl bg-paper p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-primary">Ask a clarifying question</p>
            <button type="button" className="grid size-9 place-items-center" onClick={() => setChatOpen(false)} aria-label="Close chat">
              <X className="size-4" />
            </button>
          </div>
          <p className="text-xs text-muted">
            Plan Decoder will ask you to be specific. Plan Decoder will not tell you what to tick.
          </p>
          <div className="mt-2 max-h-40 space-y-2 overflow-y-auto text-sm">
            {turns.map((t, i) => (
              <p key={i} className={t.role === "user" ? "text-ink" : "text-primary-deep"}>
                <span className="font-medium">{t.role === "user" ? "You" : "Plan Decoder"}: </span>
                {t.content}
              </p>
            ))}
          </div>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-card px-3 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. What does a typical day mean?"
              aria-label="Ask Plan Decoder"
            />
            <Button size="sm" disabled={busy || !input.trim()}>
              {busy ? "…" : "Send"}
            </Button>
          </form>
        </div>
      ) : null}
    </aside>
  );
}
