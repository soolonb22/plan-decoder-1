import { useEffect, useState, type FormEvent } from "react";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { isLocalAuthDebugHost } from "@/lib/site";
import { OllieMark } from "@/components/mark";
import { AuthSplash } from "@/components/layout/auth-gate";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { passwordIssue } from "@/lib/security/password-policy";
import { parseLoginSearch } from "@/lib/login-search";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  validateSearch: parseLoginSearch,
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
  const { create } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up" | "reset">(create === 1 ? "up" : "in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState<string | null>(null);
  const [dbReady, setDbReady] = useState<boolean | null>(null);
  const [secretReady, setSecretReady] = useState<boolean | null>(null);
  const [waited, setWaited] = useState(false);
  const [setupHints, setSetupHints] = useState(false);
  const showOauth =
    typeof window !== "undefined" && window.location.hostname.endsWith(".grok-sandbox.com");

  function checkReady() {
    void fetch("/api/ready")
      .then((r) => r.json() as Promise<{ database?: boolean; secret?: boolean }>)
      .then((d) => {
        setDbReady(Boolean(d.database));
        setSecretReady(Boolean(d.secret));
      })
      .catch(() => {
        setDbReady(null);
        setSecretReady(null);
      });
  }

  useEffect(() => {
    setSetupHints(isLocalAuthDebugHost(window.location.hostname));
    checkReady();
  }, []);

  useEffect(() => {
    if (create === 1) setMode("up");
  }, [create]);

  useEffect(() => {
    const t = window.setTimeout(() => setWaited(true), 2500);
    return () => window.clearTimeout(t);
  }, []);

  if (isPending && !waited) return <AuthSplash />;
  if (user) return <Navigate to="/" />;

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    if (!authEnabled) return;
    const emailNorm = email.trim().toLowerCase();
    if (mode === "reset") {
      setBusy(true);
      setError(null);
      try {
        const redirectTo = `${window.location.origin}/reset-password`;
        const res = await fetch("/api/auth/request-password-reset", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailNorm, redirectTo }),
        });
        const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
        if (!res.ok) {
          throw new Error(
            setupHints
              ? data.message ||
                  data.error ||
                  "Could not send a reset email. Add RESEND_API_KEY and EMAIL_FROM as Worker secrets."
              : "Could not send a reset email. Please try again later.",
          );
        }
        setError("If that email has an account, a reset link is on its way. Check spam. The link lasts one hour.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not send a reset email.");
      } finally {
        setBusy(false);
      }
      return;
    }
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
          email: emailNorm,
          password,
          name: name.trim() || emailNorm.split("@")[0],
          callbackURL: "/",
        });
        if (err) {
          if (/already|exist/i.test(err.message ?? "")) {
            const retry = await authClient.signIn.email({
              email: emailNorm,
              password,
              callbackURL: "/",
            });
            if (retry.error) {
              throw new Error(
                "This email already has an account, and that password did not match. Use Sign in with the password you set last time. If you never got in, ask to reset this email.",
              );
            }
          } else {
            throw new Error(err.message);
          }
        }
      } else {
        const { error: err } = await authClient.signIn.email({
          email: emailNorm,
          password,
          callbackURL: "/",
        });
        if (err) throw new Error(err.message);
      }
      window.location.assign("/");
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      if (dbReady === false) {
        setError(
          setupHints
            ? "Sign-in is not connected to the database yet. Add DATABASE_URL on the Worker, then tap Check again."
            : "Sign-in is unavailable just now. Please try again later.",
        );
      } else if (mode === "up") {
        setError(
          raw || "Could not create the account. Try a different email, or Sign in if you already have one.",
        );
      } else {
        setError(
          "No account for that email yet, or the password is different. If this is your first time, tap Create account. Use 8 or more characters with a letter and a number.",
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

  const heading =
    mode === "in" ? "Welcome back" : mode === "up" ? "Create a free account" : "Reset password";
  const helper =
    mode === "in"
      ? "Sign in to open your Plan Decoder workspace."
      : mode === "up"
        ? "A free account keeps a workspace. Practice answers still stay on this device."
        : setupHints
          ? "We email a one-hour link. Needs EMAIL_FROM and RESEND_API_KEY on the Worker."
          : "We email a one-hour link. Check spam if it does not arrive.";

  return (
    <main className="grid min-h-dvh place-items-center bg-paper px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <OllieMark className="size-11" />
          <div>
            <p className="text-lg font-semibold">Plan Decoder</p>
            <p className="text-sm text-muted">Independent NDIS practice tools.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-3 rounded-xl bg-paper-2 p-1" role="tablist" aria-label="Account">
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
              Create
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "reset"}
              className={cn(
                "min-h-11 rounded-lg text-sm font-medium",
                mode === "reset" ? "bg-card text-ink shadow-[var(--shadow-card)]" : "text-muted",
              )}
              onClick={() => {
                setMode("reset");
                setError(null);
              }}
            >
              Reset
            </button>
          </div>

          <h1 className="mt-5 text-xl font-semibold">{heading}</h1>
          <p className="mt-1 text-sm text-muted">{helper}</p>
          {dbReady === false || secretReady === false ? (
            <div className="mt-4 rounded-2xl border border-alert/30 bg-alert/10 p-3 text-sm text-ink" role="status">
              {setupHints ? (
                <>
                  <p>
                    Sign-in is not connected yet. Your email and password are not the problem. The Worker is missing{" "}
                    {dbReady === false && secretReady === false
                      ? "the database and the signing key."
                      : dbReady === false
                        ? "the Neon database secret."
                        : "BETTER_AUTH_SECRET (the signing key)."}
                  </p>
                  <p className="mt-2">
                    In Cloudflare open Worker <strong>plan-decoder-1</strong> → Settings → Variables and Secrets
                    (the Worker, <strong>not</strong> Build variables). Encrypted secrets named{" "}
                    <strong>DATABASE_URL</strong> and <strong>BETTER_AUTH_SECRET</strong> must both be present. Then tap
                    Check again. A new deploy is needed if the signing key was only in the old config file.
                  </p>
                </>
              ) : (
                <p>Sign-in is unavailable just now. Please try again later.</p>
              )}
              <button
                type="button"
                className="mt-3 min-h-11 rounded-lg border border-line bg-card px-3 text-sm"
                onClick={() => checkReady()}
              >
                {setupHints ? "Check again" : "Try again"}
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
            {mode !== "reset" ? (
            <>
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
                minLength={8}
              />
              <p className="mt-1 text-xs text-muted">
                {mode === "up"
                  ? "At least 8 characters, with a letter and a number. Hashed on the server — never stored in the clear."
                  : "First visit? Use Create. Sign-in only works after that."}
              </p>
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
            </>
            ) : null}
            {error ? (
              <p className="text-sm text-alert" role="alert">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full" disabled={busy || Boolean(oauthBusy) || !authEnabled}>
              {busy
                ? "Please wait…"
                : mode === "up"
                  ? "Create a free account"
                  : mode === "reset"
                    ? "Email a reset link"
                    : "Sign in"}
            </Button>
          </form>
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer font-medium">Cannot sign in?</summary>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
              <li>First visit: tap Create. Sign-in will not work until then.</li>
              <li>
                {setupHints
                  ? "Use Reset to email a one-hour link. That needs Resend (or Mailgun) secrets on the Worker."
                  : "Use Reset to email a one-hour link. Check spam if it does not arrive."}
              </li>
              <li>If you are already signed in, change the password under Privacy.</li>
              <li>Practice notes live in this browser unless you save an encrypted copy under Privacy.</li>
            </ul>
          </details>
        </div>

        <p className="mt-5 text-center text-sm text-muted">
          Evidence and practice answers stay on this device. Your account only remembers who you are and membership.
          Not affiliated with the NDIA.
        </p>
      </div>
    </main>
  );
}
