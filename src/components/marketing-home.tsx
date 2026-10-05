import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FOUNDER_LINE } from "@/lib/founder-copy";
import { HOME_FAQS, faqJsonLd } from "@/lib/seo-faq";
import { CORE_TRIAL_DAYS, MEMBERSHIP_PRICE_AUD } from "@/lib/billing";
import { DOORS } from "@/lib/doors";

const COVER_SRC = encodeURI("/brand/Plan Decoder Facebook cover.png");

export function MarketingHome() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <noscript>
        <p>
          Plan Decoder at https://www.plandecoder.com helps you get ready for one NDIS conversation, in your own
          words. Notes stay on this device. Independent. Not the NDIA. Not a funding decision. Core is A$
          {MEMBERSHIP_PRICE_AUD.core} a month after a {CORE_TRIAL_DAYS}-day trial.
        </p>
      </noscript>

      <section>
        <p className="text-sm font-semibold text-primary">Plan Decoder</p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-primary-deep sm:text-4xl">
          Get ready for one conversation.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted">
          For participants, families, and carers. Your notes stay on this device. Independent. Not the NDIA. Not a
          funding decision.
        </p>
        <h2 className="mt-8 text-xl font-semibold text-ink">What are you getting ready for?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {DOORS.map((door) => (
            <Link
              key={door.id}
              to="/words"
              search={{ tab: "everyday", door: door.id }}
              className="rounded-2xl border border-line bg-card p-5 shadow-[var(--shadow-card)] hover:border-line-strong hover:bg-primary-soft"
            >
              <p className="text-lg font-semibold text-ink">{door.label}</p>
              <p className="mt-1 text-sm text-muted">{door.detail}</p>
              <p className="mt-3 text-sm font-semibold text-primary">Say it in your words →</p>
            </Link>
          ))}
        </div>
        <p className="mt-4 max-w-2xl text-sm text-muted">
          Clear facts are less likely to get lost. NDIS decisions are made by the NDIA and are discretionary.
        </p>
        <p className="mt-3 text-sm">
          <Link to="/pricing" className="font-semibold text-primary underline-offset-2 hover:underline">
            Core is A${MEMBERSHIP_PRICE_AUD.core} a month after a {CORE_TRIAL_DAYS}-day trial
          </Link>
        </p>
      </section>

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
        <Button className="mt-4" variant="ghost" size="sm" asChild>
          <Link to="/about">About</Link>
        </Button>
      </Card>
    </div>
  );
}
