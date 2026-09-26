import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LEGAL_EMAIL, LEGAL_UPDATED } from "@/lib/legal";
import { Card } from "@/components/ui/card";

export function LegalCard({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card id={id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold text-primary-deep">{title}</h2>
      <div className="mt-3 space-y-3 text-sm text-muted">{children}</div>
    </Card>
  );
}

export function LegalPageNav() {
  return (
    <nav className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-sm font-semibold" aria-label="Legal pages">
      <Link className="text-teal underline-offset-2 hover:underline" to="/privacy">
        Privacy
      </Link>
      <Link className="text-teal underline-offset-2 hover:underline" to="/terms">
        Terms
      </Link>
      <Link className="text-teal underline-offset-2 hover:underline" to="/refunds">
        Refunds and cancellation
      </Link>
      <Link className="text-teal underline-offset-2 hover:underline" to="/contact">
        Contact
      </Link>
    </nav>
  );
}

export function PrivacyBody() {
  return (
    <>
      <p>
        <strong className="text-ink">The short version.</strong> Practice answers, diaries, evidence notes and
        pocket files stay in this browser on your device unless you later choose an optional encrypted copy. We do
        not sell data. We do not run advertising trackers on the tools.
      </p>
      <p>
        <strong className="text-ink">What stays on this device.</strong> Evidence, logs, flags, goals, briefs,
        school notes, claims, providers, practice assessments, and drafts are stored in this browser. Clearing site
        data deletes them. Pocket files (PDFs, photos) never leave this device.
      </p>
      <p>
        <strong className="text-ink">What we hold if you create an account.</strong> Your email address, a hashed
        password, membership status, and credit balance. That is so we can sign you in and honour a paid plan. The
        plain password is never written to the database.
      </p>
      <p>
        <strong className="text-ink">Payments.</strong> Card details go to Stripe, not to us. Stripe privacy
        policy applies to the checkout. We see the email on the receipt so we can attach membership or credits to
        the right account.
      </p>
      <p>
        <strong className="text-ink">Optional extras you switch on.</strong> An encrypted notes copy is off unless
        you save one. Draft with Plan Decoder only runs when you press the button. It sends the notes already on
        screen so a language model can polish wording. Do not include extra identifiers you would not put in an
        email. Drafts can be wrong. You edit before you share.
      </p>
      <p>
        <strong className="text-ink">The news page.</strong> Opening NDIS news fetches public headlines. That
        request does not include your practice answers.
      </p>
      <p>
        <strong className="text-ink">Your rights.</strong> You can ask what we hold, ask us to correct it, or ask us
        to delete your login. Use the buttons on the privacy page while signed in, or email {LEGAL_EMAIL}. Australian
        Privacy Principle rights apply to personal information we hold.
      </p>
    </>
  );
}

export function TermsBody() {
  return (
    <>
      <p>
        Plan Decoder is a preparation and organisation tool. It helps you practise questions, keep notes, and read
        public NDIS information in plain language.
      </p>
      <p>
        It is <strong className="text-ink">not</strong> an assessment, diagnosis, eligibility decision, or funding
        decision. It cannot apply to the NDIS for you. It cannot change a plan. No wording on this site, including
        any practice report or course completion note, has official standing with the NDIA.
      </p>
      <p>
        Membership, the Prep Pack, and credits are personal purchases. They are{" "}
        <strong className="text-ink">not an NDIS support</strong> and cannot be paid for from NDIS plan funding.
      </p>
      <p>
        You must be 18 or a parent, carer, nominee, or professional acting for someone, to create an account and
        pay. Do not put content in the app that you would not want stored on this device.
      </p>
      <p>
        We may change prices or features. We will keep this page dated. If a change is material, we will note it
        here. Australian Consumer Law rights are not excluded.
      </p>
      <p>These terms are governed by the law of Queensland, Australia.</p>
    </>
  );
}

export function RefundsBody() {
  return (
    <>
      <p>
        <strong className="text-ink">Core is a subscription.</strong> It starts with a 3-day trial. If you do not
        cancel before the trial ends, Stripe charges A$12 each month until you cancel. That is the price shown on
        the pricing page at the time you start.
      </p>
      <p>
        <strong className="text-ink">How to cancel.</strong> Email {LEGAL_EMAIL} from the address you used at checkout
        and write Please cancel Core. You can also open Pay and credits while signed in and tap Cancel Core, which
        opens Stripe. You keep access until the end of the period already paid. We do not charge again after
        cancellation. Email still works if the Stripe page does not open.
      </p>
      <p>
        <strong className="text-ink">Refunds we will give without argument.</strong>
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>You cancel during the 3-day trial and nothing has been charged - nothing to refund.</li>
        <li>
          The first monthly charge landed and you email us within 14 days, and you have not generated a paid report
          or polished draft - full refund of that charge.
        </li>
        <li>A duplicate payment, or a charge after you already asked us to cancel - full refund of the extra charge.</li>
        <li>The site was down so you could not use what you paid for, and we cannot restore access quickly - refund of that period.</li>
      </ul>
      <p>
        <strong className="text-ink">Credits and one-off packs</strong> (including a finished report credit or the
        Prep Pack) are digital goods delivered on the device. We refund them if they never unlocked, if you paid
        twice, or if Australian Consumer Law requires it. We do not refund unused credits because you changed your
        mind after a report was generated.
      </p>
      <p>
        Nothing on this page limits your rights under the Australian Consumer Law. If a service is not as described,
        say so and we will make it right.
      </p>
    </>
  );
}

export function ContactBody() {
  return (
    <>
      <p>Plan Decoder is an independent project run from Queensland, Australia.</p>
      <p>
        Email:{" "}
        <a className="font-medium text-teal underline-offset-2 hover:underline" href={`mailto:${LEGAL_EMAIL}`}>
          {LEGAL_EMAIL}
        </a>
      </p>
      <p>
        Use that address for cancel requests, refunds, privacy requests, and anything on the site that is wrong or
        confusing. We answer member messages first.
      </p>
      <p>This site is operated by the person behind {LEGAL_EMAIL}.</p>
      <p className="text-xs">Last reviewed: {LEGAL_UPDATED}.</p>
      <p>
        <Link className="font-medium text-teal underline-offset-2 hover:underline" to="/about">
          About
        </Link>
        {" · "}
        <Link className="font-medium text-teal underline-offset-2 hover:underline" to="/pricing">
          Pricing
        </Link>
        {" · "}
        <Link className="font-medium text-teal underline-offset-2 hover:underline" to="/">
          Home
        </Link>
      </p>
    </>
  );
}
