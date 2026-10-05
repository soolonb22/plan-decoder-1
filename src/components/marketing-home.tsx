import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { FOUNDER_LINE } from "@/lib/founder-copy";
import { HOME_FAQS, faqJsonLd } from "@/lib/seo-faq";
import { CORE_TRIAL_DAYS, MEMBERSHIP_PRICE_AUD } from "@/lib/billing";
import {
  ART_APPLY_VIDEO,
  ELIGIBILITY_VIDEO,
  FUNDING_VIDEO,
  IMPLEMENTATION_VIDEO,
  YoutubeEmbed,
} from "@/components/youtube-embed";

const COVER_SRC = encodeURI("/brand/Plan Decoder Facebook cover.png");

const SHOWS = [
  {
    id: "applying" as const,
    kicker: "Applying",
    title: "How people usually apply",
    video: ELIGIBILITY_VIDEO,
    next: "Then say your version",
  },
  {
    id: "planning" as const,
    kicker: "Planning meeting",
    title: "What the plan money is for",
    video: FUNDING_VIDEO,
    next: "Then describe your week",
  },
  {
    id: "reassessment" as const,
    kicker: "A decision you disagree with",
    title: "How a review is asked for",
    video: ART_APPLY_VIDEO,
    next: "Then write what changed",
  },
];

export function MarketingHome() {
  const lead = SHOWS[0];
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <noscript>
        <p>
          Plan Decoder plays short public videos, then helps you say the same thing in your own words. Notes stay on
          this device. Independent. Not the NDIA. Not a funding decision.
        </p>
      </noscript>

      <section>
        <p className="text-sm font-semibold text-primary">Watch, then say it</p>
        <h1 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight text-primary-deep sm:text-5xl sm:leading-tight">
          Watch the bit that matters. Then say your part.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-ink/80">
          Three short videos. One sentence in your words after each. Your notes stay on this device. Independent. Not
          the NDIA. Not a funding decision.
        </p>
      </section>

      <section className="mt-6" aria-label="Start video">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{lead.kicker}</p>
        <h2 className="mt-1 text-2xl font-semibold">{lead.title}</h2>
        <YoutubeEmbed id={lead.video.id} title={lead.video.title} credit={lead.video.credit} />
        <Link
          to="/words"
          search={{ tab: "everyday", door: lead.id }}
          className="mt-3 inline-flex min-h-12 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg"
        >
          {lead.next}
        </Link>
      </section>

      <section className="mt-10" aria-label="More to watch">
        <h2 className="text-xl font-semibold">Two more, if this is your moment</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          {SHOWS.slice(1).map((show) => (
            <article key={show.id}>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{show.kicker}</p>
              <h3 className="mt-1 text-lg font-semibold">{show.title}</h3>
              <YoutubeEmbed id={show.video.id} title={show.video.title} credit={show.video.credit} />
              <Link
                to="/words"
                search={{ tab: "everyday", door: show.id }}
                className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-2 hover:underline"
              >
                {show.next}
              </Link>
            </article>
          ))}
        </div>
        <article className="mt-6 rounded-2xl border border-line bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">After a plan is approved</p>
          <h3 className="mt-1 text-lg font-semibold">What to do with the plan you have</h3>
          <YoutubeEmbed id={IMPLEMENTATION_VIDEO.id} title={IMPLEMENTATION_VIDEO.title} credit={IMPLEMENTATION_VIDEO.credit} />
          <Link to="/plan" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-2 hover:underline">
            Open the plan page
          </Link>
        </article>
        <article className="mt-4 rounded-2xl border border-line bg-primary-soft p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">I am the carer</p>
          <h3 className="mt-1 text-lg font-semibold">No video for this one. Start with what you did.</h3>
          <p className="mt-2 text-sm text-muted">A few honest lines beat trying to remember months of care in the meeting.</p>
          <Link
            to="/words"
            search={{ tab: "everyday", door: "carer" }}
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-2 hover:underline"
          >
            Say what I set aside
          </Link>
        </article>
      </section>

      <p className="mt-8 max-w-2xl text-sm text-muted">
        Videos are other people’s explainers, not NDIA training. Clear facts are less likely to get lost. NDIS decisions
        are made by the NDIA and are discretionary.{" "}
        <Link to="/pricing" className="font-semibold text-primary underline-offset-2 hover:underline">
          Core is A${MEMBERSHIP_PRICE_AUD.core} a month after a {CORE_TRIAL_DAYS}-day trial
        </Link>
        . You can watch first.
      </p>

      <p className="sr-only">Social cover art is at {COVER_SRC} for Facebook and share cards.</p>

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
        <p className="mt-3 text-sm">
          <Link to="/about" className="font-semibold text-primary underline-offset-2 hover:underline">
            About Fallon
          </Link>
        </p>
      </Card>
    </div>
  );
}
