import { useState } from "react";
import { useOllie, useClientList } from "@/lib/store";
import { POTS } from "@/lib/claims";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/layout/page";
import type { Provider } from "@/lib/types";

export function PeoplePanel() {
  const add = useOllie((s) => s.upsertProvider);
  const remove = useOllie((s) => s.removeProvider);
  const items = useClientList("providers");
  const claims = useClientList("claims");
  const [name, setName] = useState("");
  const [pot, setPot] = useState<Provider["pot"]>("core");
  const [registered, setRegistered] = useState<Provider["registered"]>("unsure");
  const [agreement, setAgreement] = useState(false);
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  const fromClaims = [...new Set(claims.map((c) => c.provider).filter(Boolean))];

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Who you use, which pot, registered or not, and whether an agreement is on file. This is your list, not a provider
        register.
      </p>
      {fromClaims.length ? (
        <p className="mb-3 text-xs text-muted">Names already in the claiming book: {fromClaims.join(" · ")}</p>
      ) : null}
      <Card className="space-y-3">
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Provider or worker" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Usually paid from">
            <select
              className="h-11 w-full rounded-lg border border-line bg-card px-3"
              value={pot}
              onChange={(e) => setPot(e.target.value as Provider["pot"])}
            >
              {POTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
              <option value="mix">More than one pot</option>
            </select>
          </Field>
          <Field label="NDIS registered?">
            <select
              className="h-11 w-full rounded-lg border border-line bg-card px-3"
              value={registered}
              onChange={(e) => setRegistered(e.target.value as Provider["registered"])}
            >
              <option value="unsure">Not sure</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
        </div>
        <Field label="How to reach them">
          <Input value={contact} onChange={(e) => setContact(e.target.value)} />
        </Field>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primary" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
          Service agreement is on this device or in a folder I can find
        </label>
        <Field label="Note">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button
          disabled={!name.trim()}
          onClick={() => {
            add({ name, pot, registered, agreement, contact, notes });
            setName("");
            setContact("");
            setNotes("");
            setAgreement(false);
          }}
        >
          Save person
        </Button>
      </Card>
      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState title="No providers yet" body="Add the people you already pay, even if you are not sure they are registered." />
        ) : (
          items.map((p) => (
            <Card key={p.id}>
              <p className="font-semibold">{p.name}</p>
              <p className="mt-1 text-sm text-muted">
                {p.pot === "mix" ? "More than one pot" : POTS.find((x) => x.id === p.pot)?.label} · registered: {p.registered}
                {p.agreement ? " · agreement on file" : " · no agreement noted"}
              </p>
              {p.contact ? <p className="mt-1 text-sm">{p.contact}</p> : null}
              {p.notes ? <p className="mt-2 text-sm text-muted">{p.notes}</p> : null}
              <Button className="mt-2" size="sm" variant="ghost" onClick={() => remove(p.id)}>
                Remove
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
