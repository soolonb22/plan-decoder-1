import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useOllie, useClientList } from "@/lib/store";
import { formatDate, todayISO, downloadText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/school")({ component: SchoolPage });

function SchoolPage() {
  const add = useOllie((s) => s.addSchoolNote);
  const remove = useOllie((s) => s.removeSchoolNote);
  const items = useClientList("schoolNotes");
  const [setting, setSetting] = useState("Classroom");
  const [worked, setWorked] = useState("");
  const [hard, setHard] = useState("");
  const [sensory, setSensory] = useState("");
  const [ask, setAsk] = useState("");

  return (
    <MembershipGate need="pro">
      <PageHeader
        title="School collaboration"
        lede="Split what is a reasonable adjustment from what is an NDIS support. Keep both systems in the same note."
      />
      <Card className="mb-5 bg-primary-soft">
        <p className="font-semibold">A simple split</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          <li>School: curriculum access, reasonable adjustments, learning environment.</li>
          <li>NDIS: personal care, specialist disability supports used across life, therapy that is not the school’s job.</li>
          <li>Neither system should leave a child in the gap. Ask both to write down what they will do.</li>
        </ul>
      </Card>
      <Card className="space-y-3">
        <Field label="Setting">
          <Input value={setting} onChange={(e) => setSetting(e.target.value)} />
        </Field>
        <Field label="What worked">
          <Textarea value={worked} onChange={(e) => setWorked(e.target.value)} />
        </Field>
        <Field label="What was hard">
          <Textarea value={hard} onChange={(e) => setHard(e.target.value)} />
        </Field>
        <Field label="Sensory / communication">
          <Textarea value={sensory} onChange={(e) => setSensory(e.target.value)} />
        </Field>
        <Field label="Support being requested (school, NDIS, or both)">
          <Textarea value={ask} onChange={(e) => setAsk(e.target.value)} />
        </Field>
        <Button
          onClick={() => {
            add({
              date: todayISO(),
              setting,
              whatWorked: worked,
              whatWasHard: hard,
              sensory,
              requestedSupport: ask,
            });
            setWorked("");
            setHard("");
            setSensory("");
            setAsk("");
          }}
        >
          Save note
        </Button>
      </Card>
      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState title="No school notes" body="Capture one good strategy and one barrier from this week." />
        ) : (
          items.map((n) => {
            const text = `${n.date} · ${n.setting}\nWorked: ${n.whatWorked}\nHard: ${n.whatWasHard}\nSensory: ${n.sensory}\nAsk: ${n.requestedSupport}`;
            return (
              <Card key={n.id}>
                <p className="text-xs text-muted">{formatDate(n.date)} · {n.setting}</p>
                <p className="mt-2 text-sm">{n.whatWasHard}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => downloadText("school-note.txt", text)}>
                    Download
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(n.id)}>
                    Remove
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </MembershipGate>
  );
}
