import { useMemo, useState } from "react";
import { useOllie, useClientList } from "@/lib/store";
import { todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/layout/page";

export function ChartPanel() {
  const add = useOllie((s) => s.addFluctuation);
  const remove = useOllie((s) => s.removeFluctuation);
  const rows = useClientList("fluctuations");
  const points = useMemo(() => rows.slice().sort((a, b) => a.date.localeCompare(b.date)), [rows]);
  const [date, setDate] = useState(todayISO());
  const [energy, setEnergy] = useState(3);
  const [regulation, setRegulation] = useState(3);
  const [participation, setParticipation] = useState(3);
  const [notes, setNotes] = useState("");
  const chart = useMemo(() => points.slice(-14), [points]);

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Best-day snapshots underfund. A week of simple scores shows the real range.
      </p>
      <Card className="space-y-3">
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        {[
          ["Energy", energy, setEnergy],
          ["Regulation", regulation, setRegulation],
          ["Participation", participation, setParticipation],
        ].map(([label, value, set]) => (
          <Field key={String(label)} label={`${label}: ${value} / 5`}>
            <input
              type="range"
              min={1}
              max={5}
              value={value as number}
              onChange={(e) => (set as (n: number) => void)(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </Field>
        ))}
        <Field label="What shaped the day">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button
          onClick={() => {
            add({ date, energy, regulation, participation, notes });
            setNotes("");
          }}
        >
          Save today
        </Button>
      </Card>
      <Card className="mt-5">
        <p className="font-semibold">Last two weeks</p>
        {chart.length === 0 ? (
          <div className="mt-3">
            <EmptyState title="No pattern yet" body="Log a few days, including hard ones." />
          </div>
        ) : (
          <div className="mt-4 flex h-40 items-end gap-2">
            {chart.map((p) => (
              <div key={p.id} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-32 w-full items-end gap-0.5">
                  <div className="w-1/3 rounded-t bg-primary" style={{ height: `${(p.energy / 5) * 100}%` }} title="Energy" />
                  <div className="w-1/3 rounded-t bg-lavender" style={{ height: `${(p.regulation / 5) * 100}%` }} title="Regulation" />
                  <div className="w-1/3 rounded-t bg-leaf" style={{ height: `${(p.participation / 5) * 100}%` }} title="Participation" />
                </div>
                <span className="text-xs text-subtle">{p.date.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-muted">Purple energy · lavender regulation · green participation</p>
      </Card>
      <ul className="mt-4 space-y-2">
        {points
          .slice()
          .reverse()
          .map((p) => (
            <li key={p.id} className="flex items-start justify-between gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm">
              <span>
                <span className="font-medium">{p.date}</span> · E{p.energy} R{p.regulation} P{p.participation}
                {p.notes ? <span className="block text-muted">{p.notes}</span> : null}
              </span>
              <Button size="sm" variant="ghost" onClick={() => remove(p.id)}>
                Remove
              </Button>
            </li>
          ))}
      </ul>
    </div>
  );
}
