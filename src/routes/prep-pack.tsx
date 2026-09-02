import { Link, createFileRoute } from "@tanstack/react-router";
import { PREP_PACK } from "@/lib/prep-pack";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer } from "@/components/layout/page";
import { PageArt } from "@/components/illustrations";

export const Route = createFileRoute("/prep-pack")({
  component: PrepPackPage,
  head: () => ({
    meta: [
      { title: "Reassessment Prep Pack — Plan Decoder" },
      {
        name: "description",
        content:
          "Walk into your NDIS review already prepared. A calm, private one-time pack to rehearse the questions, gather evidence, and print one paper. $39, no subscription.",
      },
    ],
  }),
});

function BuyButton({ className }: { className?: string }) {
  if (PREP_PACK.link) {
    return (
      <a className={className} href={PREP_PACK.link}>
        Get the Prep Pack
      </a>
    );
  }
  return (
    <Button className={className} asChild>
      <Link to="/unlock">Get the Prep Pack</Link>
    </Button>
  );
}

function PrepPackPage() {
  return (
    <div>
      <section className="ill-hero">
        <div>
          <p className="ill-kicker">One-time · ${PREP_PACK.aud} · Stays on your device</p>
          <h1 className="text-3xl font-semibold tracking-tight text-primary-deep sm:text-4xl">
            Walk into your NDIS review already prepared.
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
            A calm, private pack that helps you rehearse the questions, gather your evidence, and print one paper
            to take to your meeting. Pay once. No subscription.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <BuyButton />
            <Button variant="secondary" asChild>
              <Link to="/unlock">I already have a code</Link>
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted">Nothing to cancel · Not the NDIA · Answers stay on this device</p>
        </div>
        <PageArt topic="guide" showPhones={false} />
      </section>
      <Disclaimer>
        Practice only. Not the NDIA, not I-CAN, not a diagnosis, and not a funding decision. The live Stripe link is
        added when the product exists. Until then, a code word unlocks the same tools.
      </Disclaimer>
      <h2 className="mt-8 text-xl font-semibold text-primary-deep">Why it helps</h2>
      <p className="mt-2 text-sm text-muted">
        A plan review can shape supports for the next year. This pack takes you through it slowly, one step at a time.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-primary-deep">What is inside</h2>
      <ul className="mt-3 space-y-3 text-sm">
        {[
          ["The full practice assessment", "Rehearse functional questions at your own pace."],
          ["Questions you will be asked", "Plain English, including wording for a parent, carer, or nominee."],
          ["Your evidence checklist", "Slips, diary notes, and carer notes in one place."],
          ["A meeting script", "What to say, in your words."],
          ["Your GP / planner pack", "One clean document from what is on your device."],
          [`${PREP_PACK.days} days of full access`, "The lead-up to your review."],
        ].map(([title, body]) => (
          <li key={title}>
            <span className="font-semibold text-primary-deep">{title}. </span>
            {body}
          </li>
        ))}
      </ul>
      <h2 className="mt-8 text-xl font-semibold text-primary-deep">How it works</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {[
          "Answer the practice questions when you feel up to it.",
          "Add evidence as you go. It stays on this device.",
          "Print your pack and walk into the meeting knowing what is coming.",
        ].map((text, i) => (
          <Card key={text}>
            <p className="text-sm font-semibold text-primary">{i + 1}</p>
            <p className="mt-2 text-sm">{text}</p>
          </Card>
        ))}
      </div>
      <Card className="mx-auto mt-10 max-w-md border-primary text-center">
        <p className="text-4xl font-semibold text-primary-deep">
          ${PREP_PACK.aud} <span className="text-base font-medium text-muted">once</span>
        </p>
        <p className="mt-1 text-sm text-muted">Not a subscription. Not the NDIA.</p>
        <div className="mt-4 flex justify-center">
          <BuyButton />
        </div>
        <p className="mt-3 text-sm text-muted">Have a code? Enter it on the unlock page.</p>
      </Card>
    </div>
  );
}
