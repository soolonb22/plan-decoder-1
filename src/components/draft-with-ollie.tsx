import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { draftWithOllie } from "@/lib/ollie-ai";
import { stripIdentifiers } from "@/lib/strip-identifiers";
import { CREDIT_PRICE_AUD, MEMBERSHIP_PRICE_AUD } from "@/lib/billing";
import { useSpendOutcome } from "@/components/outcome-paywall";
import { useOllie } from "@/lib/store";
import { downloadText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DraftWithOllie({
  kind,
  notes,
  prompt,
}: {
  kind: string;
  notes: string;
  prompt: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const addReport = useOllie((s) => s.addReport);
  const pay = useSpendOutcome();

  function showPreview() {
    const stripped = stripIdentifiers(notes);
    if (!stripped.trim()) {
      setPreview(null);
      setError("Nothing left to send. Your notes are still on this device.");
      return;
    }
    setError(null);
    setText("");
    setPreview(stripped);
  }

  async function run() {
    const outgoing = stripIdentifiers(preview || "");
    if (!outgoing.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await draftWithOllie({ data: { kind, prompt, notes: outgoing } });
      if (!res.ok) {
        setError(res.error);
        if ("credits" in res && typeof res.credits === "number") {
          useOllie.getState().setBilling({ credits: res.credits });
        }
        return;
      }
      setText(res.text);
      setPreview(null);
      if ("credits" in res && typeof res.credits === "number") {
        useOllie.getState().setBilling({ credits: res.credits });
      }
    } catch {
      setError("Plan Decoder could not draft just now. Your notes are still saved on this device. No credit was used.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <p className="text-sm font-medium text-primary">Polish my words — 1 credit (${CREDIT_PRICE_AUD})</p>
      <p className="mt-1 text-sm text-muted">
        This sends only the notes already on this screen, after names and numbers are removed. It does not diagnose.
        It does not promise funding. You edit every word before you share it.
      </p>
      <p className="mt-2 text-xs text-muted">
        {pay.seated
          ? `You have ${pay.credits} credit${pay.credits === 1 ? "" : "s"}.`
          : `Core membership ($${MEMBERSHIP_PRICE_AUD.core} / month) is needed before credits can be used.`}
      </p>
      {pay.seated && pay.credits >= 1 ? (
        <div className="mt-3 space-y-3">
          {preview === null ? (
            <Button variant="secondary" disabled={busy || !notes.trim()} onClick={showPreview}>
              Show what will be sent
            </Button>
          ) : (
            <div>
              <p className="text-sm font-medium text-ink">This is what will leave this device</p>
              <textarea
                className="mt-2 min-h-32 w-full rounded-xl border border-border bg-paper p-3 text-sm leading-relaxed"
                value={preview}
                onChange={(e) => setPreview(e.target.value)}
                aria-label="This is what will leave this device"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button disabled={busy || !preview.trim()} onClick={() => void run()}>
                  {busy ? "Writing a draft…" : "Send this and use 1 credit"}
                </Button>
                <Button variant="secondary" disabled={busy} onClick={() => setPreview(null)}>
                  Keep it on this device
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button className="mt-3" variant="secondary" asChild>
          {pay.seated ? (
            <Link to="/membership">Buy credits</Link>
          ) : (
            <a href="/login?create=1">Start 3-day Core trial</a>
          )}
        </Button>
      )}
      {error ? <p className="mt-3 text-sm text-alert">{error}</p> : null}
      {text ? (
        <div className="mt-4">
          <p className="text-sm font-medium text-ink">Draft for you to edit. Not an NDIA decision.</p>
          <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-paper p-4 text-sm leading-relaxed">{text}</pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => addReport({ kind, title: `Plan Decoder draft — ${kind}`, body: text })}>
              Save draft
            </Button>
            <Button size="sm" variant="secondary" onClick={() => downloadText(`plan-decoder-${kind}.txt`, text)}>
              Download
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
