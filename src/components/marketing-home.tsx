import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LiveNewsStrip } from "@/components/live-news";
import { HOW_OLLIE_WORKS, StoryStrip } from "@/components/story";
import { ACCESS_BOUNDARY } from "@/lib/access-copy";
import { FOUNDER_LINE } from "@/lib/founder-copy";
import { HOME_FAQS, faqJsonLd } from "@/lib/seo-faq";
import { FeatureArt } from "@/components/illustrations";
import { CORE_TRIAL_DAYS, MEMBERSHIP_PRICE_AUD } from "@/lib/billing";

/** The four core promises on the public home page. Keep copy plain and honest. */
const OFFERS = [
  {
    to: "/plan" as const,
    emoji: "📄",
    title: "Decode your plan",
    tier: "Free account",
    body: "Understand your budgets, goals and what each part of your NDIS plan actually means.",
    cta: "Make sense of my plan",
    tone: "border-lavender bg-primary-soft",
  },
  {
    to: "/diary" as const,
    emoji: "📝",
    title: "Log daily evidence",
    tier: "Free account",
    body: "A simple diary for hard days, so you have real examples ready for your review.",
    cta: "Start my diary",
    tone: "border-leaf bg-leaf-soft",
  },
  {
    to: "/assessment" as const,
    emoji: "✅",
    title: "Practise your assessment",
    tier: "Core",
    body: "Rehearse everyday-life questions so the real assessment feels less scary.",
    cta: "See how it works",
    tone: "border-lavender bg-paper-2",
  },
  {
    to: "/rights" as const,
    emoji: "⚖️",
    title: "Know your rights",
    tier: "Module 0 free",
    body: "Short plain-language lessons on reviews, appeals and what you can ask for.",
    cta: "Start Module 0",
    tone: "border-warn-soft bg-warn-soft",
  },
];

const HERO_SRC = "/brand/hero-banner.webp";
const COVER_SRC = encodeURI("/brand/Plan Decoder Facebook cover.png");

export function MarketingHome() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <noscript>
        <p>
          Plan Decoder at https://www.plandecoder.com is an independent NDIS practice tool. Without an account
          you can read the glossary, NDIS news, and rights Module 0. A free account adds a basic diary and the
          plan checklist. The practice assessment and the rest of the rights course need Core. Not the NDIA. Not a
          diagnosis.
        </p>
      </noscript>

      {/* Hero = the banner image itself. Its headline and buttons are baked into the art,
          so we don't repeat them as HTML. Invisible links sit on top of the two drawn buttons,
          and the real headline stays in an sr-only h1 for screen readers and SEO. */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-card shadow-[var(--shadow-card)]">
        <h1 className="sr-only">Understand your NDIS plan. Prove what you need.</h1>
        <p className="sr-only">
          For NDIS participants, carers and families. Plain-English tools to decode your plan, log daily evidence,
          and walk into your review prepared. Independent. Not the NDIA. Does not decide eligibility or funding.
        </p>
        <img
          src={HERO_SRC}
          alt="Plan Decoder: understand your NDIS plan and prove what you need. Evidence Wallet, Behaviour Log, and I-CAN Prep on a laptop."
          className="block h-auto w-full"
          width={1890}
          height={945}
          fetchPriority="high"
        />
        {/* Positions are % of the banner, so they track the drawn buttons at any screen width. */}
        <Link
          to="/login"
          aria-label="Start free"
          className="absolute hidden rounded-lg sm:block focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          style={{ left: "4.8%", top: "71.8%", width: "16%", height: "9.6%" }}
        />
        <Link
          to="/assessment"
          search={{ tab: "about" }}
          aria-label="See how it works"
          className="absolute hidden rounded-lg sm:block focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          style={{ left: "22.3%", top: "71.8%", width: "16.6%", height: "9.6%" }}
        />
      </section>

      {/* On phones the drawn buttons are too small to tap, so show real ones under the banner. */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
        <Button asChild>
          <Link to="/login">Start free</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/assessment" search={{ tab: "about" }}>
            See how it works
          </Link>
        </Button>
      </div>

      <p className="sr-only">Social cover art is at {COVER_SRC} for Facebook and share cards.</p>

      {/* ---------- What you get: four plain promises, bright tiles ---------- */}
      <section className="mt-10">
        <p className="ill-kicker">What Plan Decoder does</p>
        <h2 className="text-2xl font-semibold tracking-tight text-primary-deep">Four things, in plain English</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {OFFERS.map((o) => (
            <Link
              key={o.title}
              to={o.to}
              className={`group flex gap-4 rounded-2xl border p-5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 ${o.tone}`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/80 text-2xl" aria-hidden>
                {o.emoji}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold text-ink">{o.title}</p>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-primary-deep">{o.tier}</span>
                </div>
                <p className="mt-1 text-sm text-ink/80">{o.body}</p>
                <p className="mt-2 text-sm font-semibold text-primary group-hover:underline">{o.cta} →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Practice assessment spotlight ---------- */}
      <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-deep p-6 text-white shadow-[var(--shadow-card)] sm:p-8">
        <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-leaf">Most popular</p>
            <h2 className="mt-1 text-2xl font-semibold sm:text-3xl" style={{ color: "#fff" }}>Practise your NDIS assessment before the real one</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/90 sm:text-base">
              <li>✓ Answer everyday-life questions at your own pace — stop and come back any time</li>
              <li>✓ See the areas where you may need support, in plain words</li>
              <li>✓ Get an optional practice report to take to your GP or therapist</li>
              <li>✓ Answers stay on your device. Practice only — not an NDIA decision</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 sm:min-w-[13rem]">
            <Button asChild className="bg-leaf text-leaf-fg hover:bg-leaf/90">
              <Link to="/assessment" search={{ tab: "about" }}>
                See the practice assessment
              </Link>
            </Button>
            <p className="text-center text-xs text-white/75">
              Included in Core · {CORE_TRIAL_DAYS}-day free trial
            </p>
          </div>
        </div>
      </section>

      <StoryStrip heading="How the practice works" steps={HOW_OLLIE_WORKS} />

      {/* ---------- Free vs Core, said plainly ---------- */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-primary-deep">Start free. Upgrade when you need more.</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Card className="border-leaf bg-leaf-soft">
            <p className="text-lg font-semibold">Free</p>
            <p className="text-sm text-muted">No card needed</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li>✓ NDIS glossary in ordinary words</li>
              <li>✓ Live NDIS news with our notes</li>
              <li>✓ Know-your-rights Module 0</li>
              <li>✓ With a free account: daily diary + plan checklist</li>
            </ul>
            <Button className="mt-4" variant="secondary" asChild>
              <Link to="/login">Create a free account</Link>
            </Button>
          </Card>
          <Card className="border-primary bg-primary-soft">
            <p className="text-lg font-semibold">
              Core <span className="text-base font-normal text-muted">· ${MEMBERSHIP_PRICE_AUD.core}/month</span>
            </p>
            <p className="text-sm text-muted">{CORE_TRIAL_DAYS}-day free trial first</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              <li>✓ Everything in Free</li>
              <li>✓ The full practice assessment</li>
              <li>✓ The full rights course + Easy Read</li>
              <li>✓ Practice completion note</li>
            </ul>
            <Button className="mt-4" asChild>
              <Link to="/membership">Try Core free</Link>
            </Button>
          </Card>
        </div>
        <p className="mt-3 text-xs text-muted">{ACCESS_BOUNDARY}</p>
      </section>

      {/* ---------- Everything else ---------- */}
      <h2 className="mb-3 mt-10 text-lg font-semibold">More free help</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            to: "/navigator" as const,
            kind: "nav" as const,
            title: "Community navigator",
            body: "Find health, housing, and local doors — with or without NDIS. Not the official Navigator.",
          },
          {
            to: "/news" as const,
            kind: "news" as const,
            title: "NDIS news",
            body: "Live headlines from ndis.gov.au, with our notes underneath.",
          },
          {
            to: "/glossary" as const,
            kind: "glossary" as const,
            title: "Glossary",
            body: "NDIS words said in ordinary language.",
          },
          {
            to: "/articles" as const,
            kind: "words" as const,
            title: "Articles & guides",
            body: "Calm, dated explainers for assessments, plans, and funding.",
          },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="invite-card group rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-card)] hover:border-line-strong hover:bg-primary-soft"
          >
            <FeatureArt kind={item.kind} />
            <div className="invite-copy">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.body}</p>
            </div>
          </Link>
        ))}
      </div>

      <LiveNewsStrip limit={3} />

      <h2 className="mb-3 mt-10 text-lg font-semibold">Common questions</h2>
      <div className="space-y-3">
        {HOME_FAQS.map((item) => (
          <Card key={item.q}>
            <h3 className="font-semibold">{item.q}</h3>
            <p className="mt-2 text-sm text-muted">{item.a}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <p className="font-semibold">Who built this</p>
        <p className="mt-2 text-sm text-muted">{FOUNDER_LINE}</p>
        <Button className="mt-4" variant="ghost" size="sm" asChild>
          <Link to="/about">About</Link>
        </Button>
      </Card>

      <Card className="mt-3">
        <p className="font-semibold">Please read this first</p>
        <p className="mt-2 text-sm text-muted">
          Practice answers stay on this device unless you later choose an encrypted copy. This app cannot apply for you,
          cannot promise funding, and is not a health service. If you are in danger, call 000.
        </p>
      </Card>
    </div>
  );
}
