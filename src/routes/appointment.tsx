import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useOllie, useClientList } from "@/lib/store";
import { formatDate, todayISO, downloadText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/appointment")({ component: AppointmentPage });

function AppointmentPage() {
  const save = useOllie((s) => s.upsertAppointment);
  const remove = useOllie((s) => s.removeAppointment);
  const items = useClientList("appointments");
  const [title, setTitle] = useState("OT appointment");
  const [who, setWho] = useState("");
  const [questions, setQuestions] = useState("");
  const [sensory, setSensory] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(todayISO());

  return (
    <MembershipGate need="core">
      <PageHeader
        title="Appointment prep"
        lede="A one-page brief for you — and, if you want, for the clinician."
      />
      <Card className="space-y-3">
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Who you are seeing">
          <Input value={who} onChange={(e) => setWho(e.target.value)} />
        </Field>
        <Field label="Questions">
          <Textarea value={questions} onChange={(e) => setQuestions(e.target.value)} />
        </Field>
        <Field label="Sensory or communication needs for the appointment">
          <Textarea value={sensory} onChange={(e) => setSensory(e.target.value)} />
        </Field>
        <Field label="Notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button
          onClick={() =>
            save({ title, date, who, questions, sensoryNeeds: sensory, notes })
          }
        >
          Save brief
        </Button>
      </Card>
      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState title="No appointment briefs" body="Write questions before you are in the waiting room." />
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-muted">{formatDate(item.date)} · {item.who}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm">{item.questions}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    downloadText(
                      `${item.title}.txt`,
                      `${item.title}\n${item.date}\n${item.who}\n\nQuestions\n${item.questions}\n\nAccess needs\n${item.sensoryNeeds}\n\n${item.notes}`,
                    )
                  }
                >
                  Download
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(item.id)}>
                  Remove
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </MembershipGate>
  );
}
