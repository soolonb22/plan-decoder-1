import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import course from "@/lib/content/rights-course-data.json";
import { ACCESS_BOUNDARY } from "@/lib/access-copy";
import { MEMBERSHIP_PRICE_AUD } from "@/lib/billing";
import { LOGIN_CREATE_SEARCH } from "@/lib/public-paths";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MembershipGate } from "@/components/layout/page";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import { CourseFrame } from "@/components/course-frame";

const PROGRESS_KEY = "ndis-course-progress-v1";
const NAME_KEY = "ndis-course-name-v1";

type Module = { emoji: string; title: string; sub?: string; html: string };
const MODULES = course.modules as Module[];
const EXTRAS = course.extras as Record<string, Module>;

function loadDone(): Set<number> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return new Set();
    return new Set((JSON.parse(raw) as number[]).filter((n) => Number.isInteger(n)));
  } catch {
    return new Set();
  }
}

function saveDone(set: Set<number>) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...set]));
  } catch {
    /* private mode */
  }
}

export type CourseSearch = { m?: number; x?: string };

const PREVIEW_MODULE = 0;

function isPreviewLocked(signedIn: boolean, moduleIdx: number | null, extra: boolean) {
  if (signedIn) return false;
  if (extra) return true;
  if (moduleIdx === null) return false;
  return moduleIdx > PREVIEW_MODULE;
}

function PreviewWall({ onHome }: { onHome: () => void }) {
  return (
    <Card className="mx-auto max-w-xl">
      <p className="text-sm font-medium text-primary">Preview</p>
      <h2 className="mt-1 text-xl font-semibold">That part is in Core</h2>
      <p className="mt-2 text-sm text-muted">
        Visitors can try Module 0 — Getting In. The other seven modules, Easy Read, the in-course glossary, and the
        certificate open with Core membership (${MEMBERSHIP_PRICE_AUD.core} / month) after you sign in.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/login" search={LOGIN_CREATE_SEARCH}>
            Create a free account
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/pricing">See pricing</Link>
        </Button>
        <Button variant="ghost" onClick={onHome}>
          Back to Module 0
        </Button>
      </div>
    </Card>
  );
}

export function RightsCourse({ search }: { search: CourseSearch }) {
  const { user } = useCurrentUserState();
  if (user) {
    return (
      <MembershipGate need="core">
        <RightsCourseBody search={search} signedIn />
      </MembershipGate>
    );
  }
  return <RightsCourseBody search={search} signedIn={false} />;
}

function RightsCourseBody({ search, signedIn }: { search: CourseSearch; signedIn: boolean }) {
  const navigate = useNavigate({ from: "/rights" });
  const [done, setDone] = useState<Set<number>>(new Set());
  const [certOpen, setCertOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    setDone(loadDone());
    try {
      setName(localStorage.getItem(NAME_KEY) || "");
    } catch {
      /* ignore */
    }
  }, []);

  const extra = search.x && EXTRAS[search.x] ? EXTRAS[search.x] : null;
  const moduleIdx =
    extra || search.m === undefined || search.m < 0 || search.m >= MODULES.length ? null : search.m;
  const reading = extra ?? (moduleIdx !== null ? MODULES[moduleIdx] : null);

  function mark(i: number) {
    setDone((prev) => {
      const next = new Set(prev);
      next.add(i);
      saveDone(next);
      return next;
    });
  }

  useEffect(() => {
    if (moduleIdx !== null && !isPreviewLocked(signedIn, moduleIdx, false)) mark(moduleIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleIdx, signedIn]);

  function openModule(i: number) {
    void navigate({ search: { m: i } });
  }

  const pct = Math.round((done.size / MODULES.length) * 100);
  const nextUnfinished = useMemo(() => {
    if (!signedIn) return PREVIEW_MODULE;
    for (let i = 0; i < MODULES.length; i++) if (!done.has(i)) return i;
    return -1;
  }, [done, signedIn]);

  if (isPreviewLocked(signedIn, moduleIdx, Boolean(extra))) {
    return (
      <div className="py-6">
        <PreviewWall onHome={() => void navigate({ to: "/rights", search: { m: PREVIEW_MODULE } })} />
      </div>
    );
  }

  if (reading) {
    const isExtra = Boolean(extra);
    return (
      <div className="-mx-4 -mt-2 flex min-h-[calc(100dvh-7rem)] flex-col sm:-mx-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-card px-3 py-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => void navigate({ to: "/rights" })}
          >
            Contents
          </Button>
          <p className="min-w-0 flex-1 truncate font-semibold">
            {reading.emoji}{" "}
            {isExtra ? reading.title : `Module ${moduleIdx} · ${reading.title}`}
          </p>
          {!isExtra ? (
            <span className="text-sm text-muted">
              {(moduleIdx ?? 0) + 1} / {MODULES.length}
            </span>
          ) : null}
        </div>
        <CourseFrame title={reading.title} html={reading.html} />
        {!isExtra && moduleIdx !== null ? (
          <div className="flex gap-2 border-t border-line bg-card p-3">
            <Button
              variant="secondary"
              className="flex-1"
              disabled={moduleIdx === 0}
              onClick={() => openModule(moduleIdx - 1)}
            >
              Previous
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                if (moduleIdx < MODULES.length - 1) openModule(moduleIdx + 1);
                else void navigate({ to: "/rights" });
              }}
            >
              {!signedIn && moduleIdx === PREVIEW_MODULE
                ? "See the rest in Core"
                : moduleIdx < MODULES.length - 1
                  ? `Next: ${MODULES[moduleIdx + 1].title}`
                  : "Finish"}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <section className="rounded-3xl bg-primary px-5 py-7 text-primary-fg shadow-[var(--shadow-card)] sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-lavender">
          {signedIn ? "Core membership" : "Free preview"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Know Your NDIS Rights</h1>
        <p className="mt-2 max-w-xl text-sm text-lavender sm:text-base">
          {signedIn
            ? "Eight short modules. A quiz in each. Progress stays in this browser. Not the NDIA, and not advice about your plan."
            : ACCESS_BOUNDARY}
        </p>
        <div className="mt-5">
          <div className="mb-1 flex justify-between text-xs font-medium">
            <span>
              {done.size === 0
                ? "Not started yet"
                : done.size === MODULES.length
                  ? "All modules complete"
                  : `${done.size} of ${MODULES.length} modules complete`}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-primary-deep/30">
            <div className="h-full rounded-full bg-card" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => openModule(nextUnfinished === -1 ? 0 : nextUnfinished)}
          >
            {done.size === 0
              ? signedIn
                ? "Start from the beginning"
                : "Try Module 0"
              : nextUnfinished === -1
                ? "Review from the beginning"
                : `Continue: ${MODULES[nextUnfinished].title}`}
          </Button>
          {signedIn && done.size === MODULES.length ? (
            <Button variant="secondary" onClick={() => setCertOpen(true)}>
              Get my certificate
            </Button>
          ) : null}
          {!signedIn ? (
            <Button variant="ghost" className="text-lavender" asChild>
              <Link to="/login" search={LOGIN_CREATE_SEARCH}>
                Create a free account
              </Link>
            </Button>
          ) : null}
          {done.size > 0 ? (
            <Button
              variant="ghost"
              className="text-lavender"
              onClick={() => {
                if (window.confirm("Reset all your course progress?")) {
                  const empty = new Set<number>();
                  saveDone(empty);
                  setDone(empty);
                }
              }}
            >
              Reset progress
            </Button>
          ) : null}
        </div>
      </section>

      <p className="mb-2 mt-8 text-xs font-semibold uppercase tracking-widest text-subtle">The course</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {MODULES.map((m, i) => {
          const complete = done.has(i);
          const locked = !signedIn && i > PREVIEW_MODULE;
          return (
            <button
              key={m.title}
              type="button"
              onClick={() => openModule(i)}
              className={cn(
                "rounded-2xl border bg-card p-4 text-left shadow-[var(--shadow-card)] hover:border-line-strong hover:bg-primary-soft",
                complete ? "border-leaf/40" : "border-line",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xl" aria-hidden>
                  {m.emoji}
                </span>
                <span
                  className={cn(
                    "grid size-7 place-items-center rounded-full text-xs font-bold",
                    complete ? "bg-leaf text-primary-fg" : "bg-paper-2 text-muted",
                  )}
                >
                  {complete ? "\u2713" : locked ? "\u2013" : i}
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
                {locked ? "Core" : `Module ${i}`}
              </p>
              <p className="font-semibold">{m.title}</p>
              <p className="mt-1 text-sm text-muted">{locked ? "Included with membership." : m.sub}</p>
            </button>
          );
        })}
      </div>

      <p className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wide text-subtle">
        Reference
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(EXTRAS).map(([id, x]) => (
          <button
            key={id}
            type="button"
            onClick={() => (signedIn ? void navigate({ search: { x: id } }) : openModule(1))}
            className="rounded-2xl border border-line bg-card p-4 text-left shadow-[var(--shadow-card)] hover:border-line-strong hover:bg-primary-soft"
          >
            <p className="text-2xl" aria-hidden>
              {x.emoji}
            </p>
            <p className="mt-2 font-semibold">{x.title}</p>
            <p className="mt-1 text-sm text-muted">
              {id === "x0" ? "The whole course, in plain English." : "NDIS words in ordinary language."}
            </p>
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <p className="text-sm text-muted">
          Educational content for NDIS participants and applicants. General information only — check{" "}
          <a className="text-primary underline-offset-2 hover:underline" href="https://www.ndis.gov.au" target="_blank" rel="noreferrer">
            ndis.gov.au
          </a>
          . Words you can look up:{" "}
          <Link to="/glossary" className="font-medium text-primary underline-offset-2 hover:underline">
            Glossary
          </Link>
          .
        </p>
      </Card>

      {certOpen ? (
        <CertificateModal
          name={name}
          onName={(n) => {
            setName(n);
            try {
              localStorage.setItem(NAME_KEY, n);
            } catch {
              /* ignore */
            }
          }}
          onClose={() => setCertOpen(false)}
        />
      ) : null}
    </div>
  );
}

function CertificateModal({
  name,
  onName,
  onClose,
}: {
  name: string;
  onName: (n: string) => void;
  onClose: () => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = document.getElementById("pd-cert") as HTMLCanvasElement | null;
    if (canvas) drawCertificate(canvas, name);
    setReady(true);
  }, [name]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-primary-deep/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Course certificate"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-xl font-semibold">Course complete</h2>
        <p className="mt-1 text-sm text-muted">Type your name, then download the certificate.</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-line">
          <canvas id="pd-cert" width={1600} height={1131} className="block w-full bg-card" />
        </div>
        <label className="mt-4 block text-sm font-medium">
          Your name
          <Input
            className="mt-1"
            value={name}
            maxLength={60}
            autoComplete="name"
            onChange={(e) => onName(e.target.value)}
            placeholder="e.g. Sam Smith"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            disabled={!ready}
            onClick={() => {
              const canvas = document.getElementById("pd-cert") as HTMLCanvasElement | null;
              if (!canvas) return;
              drawCertificate(canvas, name);
              const a = document.createElement("a");
              a.download = "NDIS-Rights-Certificate.png";
              a.href = canvas.toDataURL("image/png");
              a.click();
            }}
          >
            Download certificate
          </Button>
        </div>
      </div>
    </div>
  );
}

function drawCertificate(c: HTMLCanvasElement, name: string) {
  const ctx = c.getContext("2d");
  if (!ctx) return;
  const W = c.width;
  const H = c.height;
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(1, "#f5effc");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  const band = ctx.createLinearGradient(0, 0, W, 0);
  band.addColorStop(0, "#6B2976");
  band.addColorStop(1, "#007A86");
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, W, 140);
  ctx.fillStyle = band;
  ctx.fillRect(0, H - 40, W, 40);
  ctx.strokeStyle = "#6B2976";
  ctx.lineWidth = 4;
  ctx.strokeRect(70, 180, W - 140, H - 260);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = 'bold 44px Figtree, "Segoe UI", sans-serif';
  ctx.fillText("KNOW YOUR NDIS RIGHTS", W / 2, 92);
  ctx.fillStyle = "#4A1C53";
  ctx.font = 'bold 64px Figtree, "Segoe UI", sans-serif';
  ctx.fillText("Certificate of Completion", W / 2, 300);
  ctx.fillStyle = "#5c5560";
  ctx.font = '32px Figtree, "Segoe UI", sans-serif';
  ctx.fillText("This certifies that", W / 2, 400);
  ctx.fillStyle = "#2a2228";
  ctx.font = 'bold 80px Figtree, "Segoe UI", sans-serif';
  let nm = name.trim() || "Your Name";
  if (ctx.measureText(nm).width > W - 260) {
    while (ctx.measureText(`${nm}…`).width > W - 260 && nm.length > 0) nm = nm.slice(0, -1);
    nm = `${nm}…`;
  }
  ctx.fillText(nm, W / 2, 530);
  const tw = Math.min(W - 200, ctx.measureText(nm).width + 60);
  ctx.strokeStyle = "#C48414";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - tw / 2, 570);
  ctx.lineTo(W / 2 + tw / 2, 570);
  ctx.stroke();
  ctx.fillStyle = "#2a2228";
  ctx.font = '30px Figtree, "Segoe UI", sans-serif';
  ctx.fillText("has completed all 8 modules of the", W / 2, 640);
  ctx.fillStyle = "#6B2976";
  ctx.font = 'bold 34px Figtree, "Segoe UI", sans-serif';
  ctx.fillText("Know Your NDIS Rights interactive course", W / 2, 690);
  ctx.fillStyle = "#5c5560";
  ctx.font = '24px Figtree, "Segoe UI", sans-serif';
  const items = MODULES.map((m, i) => `${i}. ${m.title}`);
  const half = Math.ceil(items.length / 2);
  ctx.textAlign = "left";
  for (let i = 0; i < half; i++) ctx.fillText(`\u2713  ${items[i]}`, W * 0.28, 770 + i * 38);
  for (let i = half; i < items.length; i++) ctx.fillText(`\u2713  ${items[i]}`, W * 0.72, 770 + (i - half) * 38);
  ctx.textAlign = "center";
  ctx.fillStyle = "#5c5560";
  ctx.font = '22px Figtree, "Segoe UI", sans-serif';
  ctx.fillText(
    `Awarded ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}`,
    W / 2,
    H - 100,
  );
  ctx.fillStyle = "#ffffff";
  ctx.font = '18px Figtree, "Segoe UI", sans-serif';
  ctx.fillText(
    "Plan Decoder educational content — general information only. Confirm with the NDIS: 1800 800 110",
    W / 2,
    H - 15,
  );
}
