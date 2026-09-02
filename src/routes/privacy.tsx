import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { authClient, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useOllie } from "@/lib/store";
import { passwordIssue } from "@/lib/security/password-policy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { NoteSync } from "@/components/note-sync";

export const Route = createFileRoute("/privacy")({
  component: LegalPage,
  head: () => ({
    meta: [
      { title: "Privacy, terms, refunds and contact | Plan Decoder" },
      {
        name: "description",
        content:
          "Plan Decoder privacy policy, terms of use, refund and cancellation rules, and how to contact us. Independent Australian practice tools. Not the NDIA.",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
});

const UPDATED = "3 September 2026";
const EMAIL = "soolonb22@gmail.com";

function Section({
  id,
  title,
  children,
}: {
  id: string;
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

function LegalPage() {
  const reset = useOllie((s) => s.resetAll);
  const { user } = useCurrentUserState();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function changePassword() {
    const issue = passwordIssue(next, { email: user?.primaryEmail ?? "", name: user?.displayName ?? "" });
    if (issue) {
      setNote(issue);
      return;
    }
    setBusy(true);
    setNote(null);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: current,
        newPassword: next,
        revokeOtherSessions: true,
      });
      if (error) throw new Error(error.message);
      setCurrent("");
      setNext("");
      setNote("Password updated. Other sessions were signed out.");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not change password.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteAccount() {
    if (!confirm("Delete this login and clear notes on this device? This cannot be undone.")) return;
    setDeleting(true);
    setNote(null);
    try {
      reset();
      await fetch("/api/account/delete", { method: "POST", credentials: "include" });
      await signOut("/login");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not delete the login. Local notes were still cleared.");
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Privacy, terms, refunds and contact"
        lede="Plain-language rules for using Plan Decoder. Read this before you pay. Last reviewed 3 September 2026."
      />
      <Disclaimer>
        This page is general information about how this website works. It is not legal advice. Plan Decoder is
        independent and is not the NDIA, the NDIS Quality and Safeguards Commission, or the Australian Government.
      </Disclaimer>

      <nav className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-sm font-semibold" aria-label="On this page">
        <a className="text-teal underline-offset-2 hover:underline" href="#privacy">
          Privacy
        </a>
        <a className="text-teal underline-offset-2 hover:underline" href="#terms">
          Terms
        </a>
        <a className="text-teal underline-offset-2 hover:underline" href="#refunds">
          Refunds and cancellation
        </a>
        <a className="text-teal underline-offset-2 hover:underline" href="#contact">
          Contact
        </a>
      </nav>

      <div className="mt-5 space-y-3">
        <Section id="privacy" title="Privacy">
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
            to delete your login. Use the buttons on this page while signed in, or email {EMAIL}. Australian Privacy
            Principle rights apply to personal information we hold.
          </p>
        </Section>

        <Section id="terms" title="Terms of use">
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
            Membership, the Prep Pack, and credits are personal purchases. They are <strong className="text-ink">not an NDIS support</strong> and cannot be paid for from NDIS plan funding.
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
        </Section>

        <Section id="refunds" title="Refunds and cancellation">
          <p>
            <strong className="text-ink">Core is a subscription.</strong> It starts with a 3-day trial. If you do not
            cancel before the trial ends, Stripe charges A$12 each month until you cancel. That is the price shown on
            the pricing page at the time you start.
          </p>
          <p>
            <strong className="text-ink">How to cancel.</strong> Email {EMAIL} from the address you used at checkout and
            write Please cancel Core. We cancel the Stripe subscription. You keep access until the end of the period
            already paid. We do not charge again after cancellation. We will also add an in-account cancel button; until
            that is live, email is the official way.
          </p>
          <p>
            <strong className="text-ink">Refunds we will give without argument.</strong>
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>You cancel during the 3-day trial and nothing has been charged - nothing to refund.</li>
            <li>The first monthly charge landed and you email us within 14 days, and you have not generated a paid report or polished draft - full refund of that charge.</li>
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
        </Section>

        <Section id="contact" title="Contact">
          <p>Plan Decoder is an independent project run from Queensland, Australia.</p>
          <p>
            Email:{" "}
            <a className="font-medium text-teal underline-offset-2 hover:underline" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
          <p>
            Use that address for cancel requests, refunds, privacy requests, and anything on the site that is wrong or
            confusing. We answer member messages first.
          </p>
          <p>
            If you have an Australian Business Number, add it on this page when you have it. Until then this site is
            operated by the person behind {EMAIL}.
          </p>
          <p className="text-xs">Last reviewed: {UPDATED}.</p>
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
        </Section>

        <Card>
          <p className="font-semibold">Account tools on this device</p>
          <p className="mt-2 text-sm text-muted">Signed-in tools only. They do not change the public policy above.</p>
        </Card>

        {user ? (
          <>
            <Card>
              <p className="font-semibold">Passwords</p>
              <p className="mt-2 text-sm text-muted">
                Email passwords are hashed on the server with scrypt. You can change the password here while signed in.
              </p>
              {user.primaryEmail ? (
                <div className="mt-3 space-y-3">
                  <Field label="Current password">
                    <Input
                      type="password"
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                      autoComplete="current-password"
                    />
                  </Field>
                  <Field label="New password">
                    <Input
                      type="password"
                      value={next}
                      onChange={(e) => setNext(e.target.value)}
                      autoComplete="new-password"
                    />
                  </Field>
                  <Button disabled={busy || current.length < 8 || next.length < 8} onClick={() => void changePassword()}>
                    {busy ? "Saving…" : "Change password"}
                  </Button>
                </div>
              ) : null}
            </Card>
            <NoteSync />
            <Card>
              <p className="font-semibold">Clear this device</p>
              <p className="mt-2 text-sm text-muted">Removes local Plan Decoder notes on this browser. It does not close your account.</p>
              <Button
                className="mt-3"
                variant="danger"
                onClick={() => {
                  if (confirm("Remove all Plan Decoder notes on this device?")) reset();
                }}
              >
                Clear local notes
              </Button>
            </Card>
            <Card>
              <p className="font-semibold">Delete my login</p>
              <p className="mt-2 text-sm text-muted">
                Removes this email from Plan Decoder and clears notes on this browser. It cannot undo. Save a local
                pocket copy first if you want the notes.
              </p>
              <Button className="mt-3" variant="danger" disabled={deleting} onClick={() => void deleteAccount()}>
                {deleting ? "Deleting…" : "Delete login and notes"}
              </Button>
            </Card>
          </>
        ) : (
          <Card>
            <p className="text-sm text-muted">
              Sign in to change your password, clear notes on this device, or delete your login.{" "}
              <Link className="font-medium text-teal underline-offset-2 hover:underline" to="/login">
                Sign in
              </Link>
            </p>
          </Card>
        )}

        {note ? (
          <p className="rounded-xl bg-paper-2 px-4 py-3 text-sm" role="status">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
