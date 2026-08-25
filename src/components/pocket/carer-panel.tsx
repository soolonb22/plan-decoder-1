import { useState } from "react";
import { useOllie, useClientList } from "@/lib/store";
import { formatDate, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/layout/page";

export function CarerPanel() {
  const add = useOllie((s) => s.addLog);
  const remove = useOllie((s) => s.removeLog);
  const items = useClientList("logs").filter((e) => e.kind === "carer");
  const [what, setWhat] = useState("");
  const [impact, setImpact] = useState("");
  const [support, setSupport] = useState("");
  const [helped, setHelped] = useState("");
  const [energy, setEnergy] = useState(2);
  const [date, setDate] = useState(todayISO());

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        This is not a test of love. It is a record of unpaid disability support and what it costs the household.
      </p>
      <Card className="space-y-3">
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Extra support you provided">
          <Textarea value={what} onChange={(e) => setWhat(e.target.value)} />
        </Field>
        <Field label="Cost to you — sleep, work, health, other children">
          <Textarea value={impact} onChange={(e) => setImpact(e.target.value)} />
        </Field>
        <Field label="Paid or informal support already used">
          <Input value={support} onChange={(e) => setSupport(e.target.value)} />
        </Field>
        <Field label="What would have helped">
          <Textarea value={helped} onChange={(e) => setHelped(e.target.value)} />
        </Field>
        <Field label={`How depleted you felt: ${energy} / 5`}>
          <input
            type="range"
            min={1}
            max={5}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </Field>
        <Button
          disabled={!what.trim()}
          onClick={() => {
            add({
              kind: "carer",
              date,
              whatHappened: what,
              impact,
              supportUsed: support,
              whatHelped: helped,
              energy,
            });
            setWhat("");
            setImpact("");
            setSupport("");
            setHelped("");
          }}
        >
          Save log
        </Button>
      </Card>
      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState title="No carer logs yet" body="Overnight hours, cancelled work, and recovery days belong here." />
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <p className="text-xs text-muted">{formatDate(item.date)}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm">{item.whatHappened}</p>
              <p className="mt-2 text-sm text-muted">{item.impact}</p>
              <Button className="mt-2" size="sm" variant="ghost" onClick={() => remove(item.id)}>
                Remove
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
