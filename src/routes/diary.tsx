import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useOllie, useClientList } from "@/lib/store";
import { formatDate, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { EmptyState, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/diary")({ component: DiaryPage });

function DiaryPage() {
  const membership = useOllie((s) => s.membership);
  const add = useOllie((s) => s.addLog);
  const remove = useOllie((s) => s.removeLog);
  const items = useClientList("logs").filter((e) => e.kind === "diary");
  const [what, setWhat] = useState("");
  const [impact, setImpact] = useState("");
  const [helped, setHelped] = useState("");
  const [energy, setEnergy] = useState(3);
  const [date, setDate] = useState(todayISO());
  const capped = membership === "free" && items.length >= 10;

  return (
    <div>
      <PageHeader
        title="Support diary"
        lede="A few lines about today. Free accounts can keep ten notes. Core removes the cap."
      />
      <Card className="space-y-3">
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="What happened">
          <Textarea value={what} onChange={(e) => setWhat(e.target.value)} />
        </Field>
        <Field label="Impact on the day">
          <Textarea value={impact} onChange={(e) => setImpact(e.target.value)} />
        </Field>
        <Field label="What helped (even a little)">
          <Textarea value={helped} onChange={(e) => setHelped(e.target.value)} />
        </Field>
        <Field label={`Energy today: ${energy} / 5`}>
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
          disabled={capped || !what.trim()}
          onClick={() => {
            add({
              kind: "diary",
              date,
              whatHappened: what,
              impact,
              supportUsed: "",
              whatHelped: helped,
              energy,
            });
            setWhat("");
            setImpact("");
            setHelped("");
          }}
        >
          {capped ? "Free diary is full — see membership" : "Save note"}
        </Button>
      </Card>
      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState title="No diary notes yet" body="One ordinary day is still evidence." />
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <p className="text-xs text-muted">
                {formatDate(item.date)} · energy {item.energy}/5
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm">{item.whatHappened}</p>
              {item.impact ? <p className="mt-2 text-sm text-muted">{item.impact}</p> : null}
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
