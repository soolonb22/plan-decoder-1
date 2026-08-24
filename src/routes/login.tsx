import { useEffect, useState, type FormEvent } from "react";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { OllieMark } from "@/components/mark";
import { AuthSplash } from "@/components/layout/auth-gate";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { passwordIssue } from "@/lib/security/password-policy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({
    meta: [
      { title: "Sign in · Plan Decoder" },
      {
        name: "description",
        content: "Sign in or create a Plan Decoder account. Practice notes stay on this device.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
});

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState<string | null>(null);
  const [dbReady, setDbReady] = useState<boolean | null>(null);
  const showOauth =
    typeof window !== "undefined" && window.location.hostname.endsWith(".grok-sandbox.com");

  function checkReady() {
    void fetch("/api/ready")
      .then((r) => r.json() as Promise<{ database?: boolean }>)
      .then((d) => setDbReady(Boolean(d.database)))
      .catch(() => setDbReady(null));
  }

  useEffect(() => {
    checkReady();
  }, []);

  if (isPending) return <AuthSplash />;
  if (user) return <Navigate to="/" />;

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    if (!authEnabled) return;
    if (mode === "up") {
      if (password !== confirm) {
        setError("The two passwords do not match.");
        return;
      }
      const issue = passwordIssue(password, { email, name });
      if (issue) {
        setError(issue);
        return;
      }
    } else if (password.length < 8) {
      setError("Check the email and password and try again.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0],
          callbackURL: "/",
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/",
        });
        if (err) throw new Error(err.message);
      }
      setPassword("");
      setConfirm("");
      window.location.href = "/";
    } catch {
      setPassword("");
      setConfirm("");
      if (dbReady === false) {
        setError(
          "Sign-in is not connected to the database yet. In Cloudflare open Worker plan-decoder-1 → Settings → Variables and Secrets (not Build variables). Add a Secret named DATABASE_URL with your Neon postgresql:// line. Then refresh this page. No new build is needed.",
        );
      } else {
        setError(
          mode === "up"
            ? "Could not create the account. That email may already be in use."
            : "Check the email and password and try again.",
        );
      }
    } finally {
      setBusy(false);
    }
  }

  async function onOauth(providerId: string) {
    setError(null);
    setOauthBusy(providerId);
    try {
      await signIn(providerId, { callbackURL: "/", errorCallbackURL: "/login" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in did not finish.");
      setOauthBusy(null);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <OllieMark className="size-11" />
          <div>
            <p className="text-lg font-semibold">Plan Decoder</p>
            <p className="text-sm text-muted">An account is required. Nothing here is the NDIA.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-2 rounded-xl bg-paper-2 p-1" role="tablist" aria-label="Account">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "in"}
              className={cn(
                "min-h-11 rounded-lg text-sm font-medium",
                mode === "in" ? "bg-card text-ink shadow-[var(--shadow-card)]" : "text-muted",
              )}
              onClick={() => {
                setMode("in");
                setError(null);
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "up"}
              className={cn(
                "min-h-11 rounded-lg text-sm font-medium",
                mode === "up" ? "bg-card text-ink shadow-[var(--shadow-card)]" : "text-muted",
              )}
              onClick={() => {
                setMode("up");
                setError(null);
              }}
            >
              Create account
            </button>
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            {mode === "in" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {mode === "in"
              ? "Sign in to open your Plan Decoder workspace."
              : "You need an account to use Plan Decoder. Practice answers still stay on this device."}
          </p>
          {dbReady === false ? (
            <div className="mt-4 rounded-2xl border border-alert/30 bg-alert/10 p-3 text-sm text-ink" role="status">
              <p>
                Sign-in is not connected yet. Your email and password are not the problem. The Worker is missing the
                Neon database secret.
              </p>
              <p className="mt-2">
                In Cloudflare open Worker <strong>plan-decoder-1</strong> → Settings → Variables and Secrets
                (the Worker, <strong>not</strong> Build variables). Add a Secret named{" "}
                <strong>DATABASE_URL</strong>. Paste the Neon pooled connection string that starts with{" "}
                <code>postgresql://</code> and includes <code>-pooler</code>. Encrypt it. Then come back here and tap
                Check again. No new build is needed.
              </p>
              <button
                type="button"
                className="mt-3 min-h-11 rounded-lg border border-line bg-card px-3 text-sm"
                onClick={() => checkReady()}
              >
                Check again
              </button>
            </div>
          ) : null}

          {authEnabled && showOauth ? (
            <div className="mt-5 space-y-2">
              {GROK_PROVIDERS.map((p) => (
                <Button
                  key={p.providerId}
                  type="button"
                  variant="secondary"
                  className="w-full"
                  disabled={Boolean(oauthBusy) || busy}
                  onClick={() => void onOauth(p.providerId)}
                >
                  {oauthBusy === p.providerId ? "Opening…" : `Continue with ${p.label}`}
                </Button>
              ))}
            </div>
          ) : null}

          {authEnabled && showOauth ? (
          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-subtle">
            <span className="h-px flex-1 bg-line" />
            or email
            <span className="h-px flex-1 bg-line" />
          </div>
          ) : (
            <div className="mt-5" />
          )}

          <form className="space-y-3" onSubmit={(e) => void onEmail(e)}>
            {mode === "up" ? (
              <div>
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How should we greet you?"
                />
              </div>
            ) : null}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "up" ? 10 : 8}
              />
              {mode === "up" ? (
                <p className="mt-1 text-xs text-muted">
                  At least 10 characters, with a letter and a number. It is hashed on the server (scrypt, unique salt) and never stored in the clear.
                </p>
              ) : null}
            </div>
            {mode === "up" ? (
              <div>
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            ) : null}
            {error ? (
              <p className="text-sm text-alert" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={busy || Boolean(oauthBusy) || !authEnabled}>
              {busy ? "Please wait…" : mode === "up" ? "Create account" : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-muted">
          Evidence and practice answers stay on this device. Your account only remembers who you are and membership.
          Not affiliated with the NDIA.
        </p>
        <div className="mt-6 rounded-2xl border border-primary bg-primary-soft p-4 text-center">
          <p className="font-semibold text-primary-deep">Need the files on your computer?</p>
          <p className="mt-1 text-sm text-muted">Plan Decoder 1 — full app zip for Cloudflare / Wrangler.</p>
          <Button className="mt-3 w-full min-h-12" asChild>
            <a
              href="https://github.com/soolonb22/plan-decoder-1/archive/refs/heads/main.zip"
              download="Plan Decoder 1.zip"
            >
              Download Plan Decoder 1.zip
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
