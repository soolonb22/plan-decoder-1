import { useState, type FormEvent } from "react";
import { MEMBERSHIP_RANK, redeemCode } from "@/lib/membership";
import { redeemComplimentary } from "@/lib/billing-sync";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useOllie } from "@/lib/store";
import type { Membership } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export function CodeWordUnlock({
  need,
  compact = false,
}: {
  need?: Membership;
  compact?: boolean;
}) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const setBilling = useOllie((s) => s.setBilling);
  const { user } = useCurrentUserState();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = redeemCode(value);
    if (!next) {
      setOk(false);
      setMessage("That word isn’t recognised. Check the spelling, or stay with the free tools.");
      return;
    }
    if (need && MEMBERSHIP_RANK[next] < MEMBERSHIP_RANK[need]) {
      setOk(false);
      setMessage(
        need === "pro"
          ? "That word opens Core. Professional has its own word."
          : "That word opens a different space.",
      );
      return;
    }
    if (user) {
      try {
        const b = await redeemComplimentary({ data: { code: value } });
        setBilling(b);
      } catch {
        setBilling({ membership: next });
      }
    } else {
      setBilling({ membership: next });
    }
    setOk(true);
    setMessage(
      next === "pro"
        ? "Professional is open, with credits added."
        : "Core is open, with credits added. Buy more when you need outcomes.",
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className={compact ? "space-y-2" : "space-y-3"}>
      <Field
        label="Code word"
        hint={compact ? undefined : "A gifted word is not a payment."}
      >
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setMessage("");
          }}
          autoComplete="off"
          spellCheck={false}
          placeholder="Type the word"
          aria-invalid={message && !ok ? true : undefined}
        />
      </Field>
      <Button type="submit" variant={compact ? "primary" : "leaf"} className="w-full sm:w-auto">
        Open with the word
      </Button>
      {message ? (
        <p
          className={ok ? "text-sm text-leaf-fg" : "text-sm text-muted"}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
