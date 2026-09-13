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
import { ContactBody, PrivacyBody, RefundsBody, TermsBody } from "@/components/legal";
import { LEGAL_DISCLAIMER, LEGAL_UPDATED } from "@/lib/legal";
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
        lede={`Plain-language rules for using Plan Decoder. Read this before you pay. Last reviewed ${LEGAL_UPDATED}.`}
      />
      <Disclaimer>{LEGAL_DISCLAIMER}</Disclaimer>

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
          <PrivacyBody />
        </Section>

        <Section id="terms" title="Terms of use">
          <TermsBody />
        </Section>

        <Section id="refunds" title="Refunds and cancellation">
          <RefundsBody />
        </Section>

        <Section id="contact" title="Contact">
          <ContactBody />
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
