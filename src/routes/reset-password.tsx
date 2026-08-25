import { useState, type FormEvent } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { passwordIssue } from "@/lib/security/password-policy";
import { OllieMark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (raw: Record<string, unknown>): { token: string; error: string } => ({
    token: String(raw.token ?? ""),
    error: String(raw.error ?? ""),
  }),
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset password · Plan Decoder" },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});

function ResetPasswordPage() {
  const { token, error } = Route.useSearch();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [note, setNote] = useState<string | null>(error === "INVALID_TOKEN" ? "That reset link is not valid any more. Ask for a new one." : null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setNote("The two passwords do not match.");
      return;
    }
    const issue = passwordIssue(password);
    if (issue) {
      setNote(issue);
      return;
    }
    if (!token) {
      setNote("This page needs the link from your email.");
      return;
    }
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password, token }),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: boolean; message?: string; error?: string };
      if (!res.ok) throw new Error(data.message || data.error || "Could not reset the password. Ask for a new link.");
      setDone(true);
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not reset the password. Ask for a new link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <OllieMark className="size-11" />
          <div>
            <p className="text-lg font-semibold">Plan Decoder</p>
            <p className="text-sm text-muted">Choose a new password.</p>
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-card)]">
          {done ? (
            <div>
              <h1 className="text-xl font-semibold">Password updated</h1>
              <p className="mt-2 text-sm text-muted">Sign in with the new password. Other sessions were signed out.</p>
              <Button className="mt-4 w-full" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={(e) => void onSubmit(e)}>
              <h1 className="text-xl font-semibold">Reset password</h1>
              <p className="text-sm text-muted">At least 8 characters, with a letter and a number.</p>
              <div>
                <Label htmlFor="np">New password</Label>
                <Input id="np" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              </div>
              <div>
                <Label htmlFor="npc">Confirm</Label>
                <Input id="npc" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
              </div>
              {note ? (
                <p className="text-sm text-alert" role="alert">
                  {note}
                </p>
              ) : null}
              <Button type="submit" className="w-full" disabled={busy || !token}>
                {busy ? "Saving…" : "Save new password"}
              </Button>
              <p className="text-center text-sm">
                <Link className="text-primary underline-offset-4 hover:underline" to="/login">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
