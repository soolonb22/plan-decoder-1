import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { authClient, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useOllie } from "@/lib/store";
import { passwordIssue } from "@/lib/security/password-policy";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { NoteSync } from "@/components/note-sync";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
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
        title="Privacy and safety"
        lede="NDIS information is sensitive. Plan Decoder is built device-local on purpose."
      />
      <Disclaimer>
        Plan Decoder is a working tool, not the NDIA, not a health service, and not a substitute for advocacy or clinical care. If you are in immediate danger, call 000.
      </Disclaimer>
      <div className="mt-5 space-y-3">
        <Card>
          <p className="font-semibold">What stays on this device</p>
          <p className="mt-2 text-sm text-muted">
            Evidence, logs, flags, goals, briefs, school notes, claims, providers, WHODAS-inspired snapshots, practice assessments, and drafts are stored in this browser. Clearing site data deletes them. An encrypted copy is optional, below — off unless you save one. Pocket files (PDFs, photos) never leave this device.
          </p>
        </Card>
        <Card>
          <p className="font-semibold">What sign-in is for</p>
          <p className="mt-2 text-sm text-muted">
            Your account identity, role, and membership. You need an account to open Plan Decoder. Practice answers still stay on this device.
          </p>
        </Card>
        <Card>
          <p className="font-semibold">Passwords</p>
          <p className="mt-2 text-sm text-muted">
            Email passwords are hashed on the server with scrypt. The plain password is never written to the database. You can email a reset link from the sign-in page (needs Resend or Mailgun secrets), or change it here while you are signed in.
          </p>
          {user?.primaryEmail ? (
            <div className="mt-3 space-y-3">
              <Field label="Current password">
                <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" />
              </Field>
              <Field label="New password">
                <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" />
              </Field>
              <Button disabled={busy || current.length < 8 || next.length < 8} onClick={() => void changePassword()}>
                {busy ? "Saving…" : "Change password"}
              </Button>
            </div>
          ) : null}
        </Card>
        <NoteSync />
        <Card>
          <p className="font-semibold">What “Draft with Plan Decoder” sends</p>
          <p className="mt-2 text-sm text-muted">
            Only when you press the button. It sends the notes already on screen so a language model can polish them. Do not include extra identifiers you would not put in an email. Drafts can be wrong. You edit before you share.
          </p>
        </Card>
        <Card>
          <p className="font-semibold">Professionals</p>
          <p className="mt-2 text-sm text-muted">
            You still need consent, your own record-keeping, and your organisation’s policies. Plan Decoder is not an official client management system.
          </p>
        </Card>
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
            Removes this email from Plan Decoder and clears notes on this browser. It cannot undo. Save a local pocket copy first if you want the notes.
          </p>
          <Button className="mt-3" variant="danger" disabled={deleting} onClick={() => void deleteAccount()}>
            {deleting ? "Deleting…" : "Delete login and notes"}
          </Button>
        </Card>
        {note ? (
          <p className="rounded-xl bg-paper-2 px-4 py-3 text-sm" role="status">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}