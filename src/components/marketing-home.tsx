import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { FOUNDER_LINE } from "@/lib/founder-copy";
import { HOME_FAQS, faqJsonLd } from "@/lib/seo-faq";
import { CORE_TRIAL_DAYS, MEMBERSHIP_PRICE_AUD } from "@/lib/billing";
import { DOORS } from "@/lib/doors";

const COVER_SRC = encodeURI("/brand/Plan Decoder Facebook cover.png");

const DOOR_WELCOME: Record<(typeof DOORS)[number]["id"], { hello: string; next: string }> = {
  applying: {
    hello: "I am getting ready to apply.",
    next: "Start with one ordinary sentence about a hard part of the day.",
  },
  planning: {
    hello: "I have a planning meeting.",
    next: "Start with what a usual day and a hard day actually look like.",
  },
  reassessment: {
    hello: "My plan no longer fits, or I disagree with a decision.",
    next: "Start with what changed, in your own words.",
  },
  carer: {
    hello: "I am the one who helps.",
    next: "Start with what you do, and what you have to set aside.",
  },
};

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

      <section className="welcome-band">
        <p className="welcome-kicker">A calm place to start</p>
        <h1>Get ready for one conversation.</h1>
        <p className="welcome-lede">
          For participants, families, and carers. You say it how you would say it. The page helps you keep the facts in
          the sentence. Your notes stay on this device.
        </p>
        <p className="welcome-trust">Independent. Not the NDIA. Not a funding decision.</p>
      </section>

      <section className="mt-8" aria-labelledby="door-question">
        <h2 id="door-question" className="text-xl font-semibold">
          What are you getting ready for?
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">Pick one. You can change your mind. Nothing is sent.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {DOORS.map((door) => (
            <Link key={door.id} to="/words" search={{ tab: "everyday", door: door.id }} className="door-card">
              <p className="door-hello">{DOOR_WELCOME[door.id].hello}</p>
              <p className="door-next">{DOOR_WELCOME[door.id].next}</p>
              <p className="door-go">Start with my words</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="welcome-note">
        <p>
          Clear facts are less likely to get lost. NDIS decisions are made by the NDIA and are discretionary. Check{" "}
          <a href="https://www.ndis.gov.au" rel="noopener">
            ndis.gov.au
          </a>{" "}
          for the current rules.
        </p>
        <p className="mt-2">
          <Link to="/pricing">
            Core is A${MEMBERSHIP_PRICE_AUD.core} a month after a {CORE_TRIAL_DAYS}-day trial
          </Link>
          . You can look around first.
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
        <p className="mt-3 text-sm">
          <Link to="/about" className="font-semibold text-primary underline-offset-2 hover:underline">
            About Fallon
          </Link>
        </p>
      </Card>
    </div>
  );
}
