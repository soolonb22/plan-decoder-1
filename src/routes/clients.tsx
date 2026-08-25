import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_CLIENT_ID, useOllie } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { MembershipGate, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/clients")({ component: ClientsPage });

function ClientsPage() {
  const clients = useOllie((s) => s.clients);
  const active = useOllie((s) => s.activeClientId);
  const setActive = useOllie((s) => s.setActiveClient);
  const upsert = useOllie((s) => s.upsertClient);
  const remove = useOllie((s) => s.removeClient);
  const [name, setName] = useState("");
  const [preferred, setPreferred] = useState("");
  const [ndis, setNdis] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [letter, setLetter] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <MembershipGate need="pro">
      <PageHeader
        title="Clients"
        lede="A local workspace per person. Evidence stays on this device. This is not a cloud client record."
      />
      <Card className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Preferred name">
            <Input value={preferred} onChange={(e) => setPreferred(e.target.value)} />
          </Field>
          <Field label="NDIS number">
            <Input value={ndis} onChange={(e) => setNdis(e.target.value)} />
          </Field>
          <Field label="Plan start">
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="Plan end">
            <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
          <Field label="Decision letter received">
            <Input type="date" value={letter} onChange={(e) => setLetter(e.target.value)} />
          </Field>
        </div>
        <Field label="Working notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button
          disabled={!name.trim()}
          onClick={() => {
            upsert({
              name,
              preferredName: preferred,
              ndisNumber: ndis,
              planStart: start,
              planEnd: end,
              letterReceived: letter,
              notes,
              pronouns: "",
              planManagedBy: "",
            });
            setName("");
            setPreferred("");
            setNdis("");
            setNotes("");
          }}
        >
          Add person
        </Button>
      </Card>
      <div className="mt-5 space-y-3">
        {clients.map((c) => (
          <Card key={c.id} className={c.id === active ? "border-primary" : ""}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{c.preferredName || c.name}</p>
                <p className="text-sm text-muted">
                  {c.ndisNumber || "No NDIS number recorded"}
                  {c.planEnd ? ` · plan to ${c.planEnd}` : ""}
                  {c.letterReceived ? ` · letter ${c.letterReceived}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant={c.id === active ? "primary" : "secondary"} onClick={() => setActive(c.id)}>
                  {c.id === active ? "Active" : "Switch"}
                </Button>
                {c.id !== DEFAULT_CLIENT_ID ? (
                  <Button size="sm" variant="ghost" onClick={() => remove(c.id)}>
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>
            {c.notes ? <p className="mt-2 text-sm text-muted">{c.notes}</p> : null}
          </Card>
        ))}
      </div>
    </MembershipGate>
  );
}
