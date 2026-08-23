import { useEffect, useState, type ComponentType, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Volume2, VolumeX } from "lucide-react";
import { GUIDE_STATIONS } from "@/lib/guide-map";
import { askOllieGuide, speakOllie } from "@/lib/ollie-assess";
import { useOllie } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatTurn } from "@/lib/assessment/types";

function MapFallback({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="grid h-full place-items-center bg-paper-2 p-4" aria-hidden>
      <div className="relative size-48">
        <span className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
        {GUIDE_STATIONS.map((s, i) => {
          const angle = (i / GUIDE_STATIONS.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(angle) * 38;
          const y = 50 + Math.sin(angle) * 38;
          return (
            <button
              key={s.id}
              type="button"
              tabIndex={-1}
              className={cn(
                "absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border",
                i === selected ? "border-primary bg-primary" : "border-line bg-card",
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => onSelect(i)}
            />
          );
        })}
      </div>
    </div>
  );
}

export function Guide3D({ compact = false }: { compact?: boolean }) {
  const a11y = useOllie((s) => s.a11y);
  const setA11y = useOllie((s) => s.setA11y);
  const [index, setIndex] = useState(0);
  const [talking, setTalking] = useState(false);
  const [webgl, setWebgl] = useState(false);
  const [Scene, setScene] = useState<ComponentType<{
    selected: number;
    talking: boolean;
    reduce: boolean;
    onSelect: (i: number) => void;
  }> | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const reduceMotion =
    a11y.hide3d ||
    (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const station = GUIDE_STATIONS[index];
  const caption = a11y.easyRead ? station.easy : station.caption;
  const show3d = Boolean(webgl && !a11y.hide3d && Scene);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const ok = Boolean(c.getContext("webgl") || c.getContext("experimental-webgl"));
      setWebgl(ok);
      if (ok && !a11y.hide3d) {
        void import("./scene").then((m) => setScene(() => m.default));
      }
    } catch {
      setWebgl(false);
    }
  }, [a11y.hide3d]);

  useEffect(() => () => audio?.pause(), [audio]);

  function move(delta: number) {
    setIndex((i) => (i + delta + GUIDE_STATIONS.length) % GUIDE_STATIONS.length);
  }

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Escape") {
      audio?.pause();
      setTalking(false);
    }
  }

  async function hear() {
    if (talking) {
      audio?.pause();
      setTalking(false);
      return;
    }
    setError(null);
    try {
      const res = await speakOllie({ data: { text: caption } });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const el = new Audio(`data:${res.mime};base64,${res.audio}`);
      setAudio(el);
      el.onended = () => setTalking(false);
      el.onerror = () => setTalking(false);
      setTalking(true);
      await el.play();
    } catch {
      setTalking(false);
      setError("Voice could not play in this browser. The words are still on screen.");
    }
  }

  async function send() {
    const q = input.trim();
    if (!q || busy) return;
    setBusy(true);
    setError(null);
    setInput("");
    const next = [...turns, { role: "user" as const, content: q }];
    setTurns(next);
    try {
      const res = await askOllieGuide({
        data: {
          question: q,
          context: `${station.title}: ${caption}`,
          history: next,
        },
      });
      if (!res.ok) setError(res.error);
      else setTurns([...next, { role: "assistant", content: res.text }]);
    } catch {
      setError("The guide could not reply just now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="rounded-2xl border border-line bg-card shadow-[var(--shadow-card)]"
      onKeyDown={onKey}
    >
      <div className={cn("grid", compact ? "lg:grid-cols-1" : "lg:grid-cols-2")}>
        <div
          className={cn("relative overflow-hidden bg-paper-2", compact ? "h-52" : "h-72 lg:h-[22rem]")}
        >
          <a href="#guide-captions" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-10 focus:rounded-md focus:bg-card focus:px-3 focus:py-2">
            Skip 3D map
          </a>
          {show3d && Scene ? (
            <Scene selected={index} talking={talking} reduce={reduceMotion} onSelect={setIndex} />
          ) : (
            <MapFallback selected={index} onSelect={setIndex} />
          )}
        </div>
        <div className="flex flex-col p-4 sm:p-5" id="guide-captions">
          <p className="text-sm font-medium text-primary">3D path guide</p>
          <h2 className="mt-1 text-xl font-semibold">{station.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink" aria-live="polite">
            {caption}
          </p>
          <p className="mt-2 text-xs text-muted">
            Captions stay on. Voice never starts by itself. Arrow keys move between stops.
          </p>
          <div
            className="mt-3 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Guide stops"
          >
            {GUIDE_STATIONS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={i === index}
                className={cn(
                  "min-h-11 rounded-lg border px-3 text-sm",
                  i === index ? "border-primary bg-primary-soft text-primary-deep" : "border-line bg-card",
                )}
                onClick={() => setIndex(i)}
              >
                {s.title}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" asChild>
              <Link to={station.to}>Open this stop</Link>
            </Button>
            <Button size="sm" variant="secondary" onClick={() => void hear()} aria-pressed={talking}>
              {talking ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              {talking ? "Stop voice" : "Hear this"}
            </Button>
            {!compact ? (
              <Button size="sm" variant="ghost" onClick={() => setChatOpen((v) => !v)}>
                <MessageCircle className="size-4" />
                Ask a question
              </Button>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={cn(
                "min-h-11 rounded-lg border px-3 text-sm",
                a11y.hide3d ? "border-primary bg-primary-soft" : "border-line",
              )}
              aria-pressed={a11y.hide3d}
              onClick={() => setA11y({ hide3d: !a11y.hide3d })}
            >
              {a11y.hide3d ? "3D off · simple map" : "Turn off 3D"}
            </button>
            <button
              type="button"
              className={cn(
                "min-h-11 rounded-lg border px-3 text-sm",
                a11y.easyRead ? "border-primary bg-primary-soft" : "border-line",
              )}
              aria-pressed={a11y.easyRead}
              onClick={() => setA11y({ easyRead: !a11y.easyRead })}
            >
              {a11y.easyRead ? "Easy read on" : "Easy read"}
            </button>
          </div>
          {error ? <p className="mt-2 text-sm text-alert">{error}</p> : null}
          {chatOpen && !compact ? (
            <div className="mt-3 rounded-xl bg-paper p-3">
              <p className="text-xs text-muted">
                Ask what a stop means. The guide will not tell you what to tick, and will not promise funding.
              </p>
              <div className="mt-2 max-h-36 space-y-2 overflow-y-auto text-sm">
                {turns.map((t, i) => (
                  <p key={i}>
                    <span className="font-medium">{t.role === "user" ? "You" : "Guide"}: </span>
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
                  placeholder="e.g. What stays on this device?"
                  aria-label="Ask the guide"
                />
                <Button size="sm" disabled={busy || !input.trim()}>
                  {busy ? "…" : "Send"}
                </Button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
