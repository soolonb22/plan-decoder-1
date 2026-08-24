import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { draftWithOllie } from "@/lib/ollie-ai";
import { CREDIT_PRICE_AUD } from "@/lib/billing";
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
  const addReport = useOllie((s) => s.addReport);
  const pay = useSpendOutcome();

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await draftWithOllie({ data: { kind, prompt, notes } });
      if (!res.ok) {
        setError(res.error);
        if ("credits" in res && typeof res.credits === "number") {
          useOllie.getState().setBilling({ credits: res.credits });
        }
        return;
      }
      setText(res.text);
      if ("credits" in res && typeof res.credits === "number") {
        useOllie.getState().setBilling({ credits: res.credits });
      }
    } catch {
      setError("Plan Decoder could not draft just now. Your structured notes are still saved.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <p className="text-sm font-medium text-primary">Polish this — 1 credit (${CREDIT_PRICE_AUD})</p>
      <p className="mt-1 text-sm text-muted">
        This sends only the notes you already wrote. It does not diagnose, and it does not
        promise funding. You stay in charge of every word.
      </p>
      <p className="mt-2 text-xs text-muted">
        {pay.seated
          ? `You have ${pay.credits} credit${pay.credits === 1 ? "" : "s"}.`
          : "Core membership ($12 / month) is needed before credits can be used."}
      </p>
      {pay.seated && pay.credits >= 1 ? (
        <Button className="mt-3" variant="secondary" disabled={busy || !notes.trim()} onClick={() => void run()}>
          {busy ? "Drafting…" : "Use 1 credit and draft"}
        </Button>
      ) : (
        <Button className="mt-3" variant="secondary" asChild>
          <Link to="/membership">{pay.seated ? "Buy credits" : "Start Core — $12 / month"}</Link>
        </Button>
      )}
      {error ? <p className="mt-3 text-sm text-alert">{error}</p> : null}
      {text ? (
        <div className="mt-4">
          <pre className="whitespace-pre-wrap rounded-xl bg-paper p-4 text-sm leading-relaxed">
            {text}
          </pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() =>
                addReport({ kind, title: `Plan Decoder draft — ${kind}`, body: text })
              }
            >
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
