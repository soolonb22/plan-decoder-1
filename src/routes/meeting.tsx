import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useOllie, useClientList } from "@/lib/store";
import { downloadText, formatDate, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/meeting")({ component: MeetingPage });

function MeetingPage() {
  const save = useOllie((s) => s.upsertMeeting);
  const remove = useOllie((s) => s.removeMeeting);
  const items = useClientList("meetings");
  const [title, setTitle] = useState("Plan meeting");
  const [purpose, setPurpose] = useState("");
  const [questions, setQuestions] = useState("");
  const [talking, setTalking] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(todayISO());

  return (
    <MembershipGate need="core">
      <PageHeader
        title="Meeting prep"
        lede="A page you can read from if the meeting goes too fast."
      />
      <Card className="space-y-3">
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Purpose">
          <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        </Field>
        <Field label="Must-say talking points">
          <Textarea value={talking} onChange={(e) => setTalking(e.target.value)} />
        </Field>
        <Field label="Questions for them">
          <Textarea value={questions} onChange={(e) => setQuestions(e.target.value)} />
        </Field>
        <Field label="Notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button
          onClick={() =>
            save({ title, date, purpose, questions, talkingPoints: talking, notes })
          }
        >
          Save brief
        </Button>
      </Card>
      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState title="No meeting briefs" body="Use Guided help if you want questions first." />
        ) : (
          items.map((item) => {
            const text = `${item.title}\n${item.date}\nPurpose: ${item.purpose}\n\nMust say\n${item.talkingPoints}\n\nQuestions\n${item.questions}\n\n${item.notes}`;
            return (
              <Card key={item.id}>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-muted">{formatDate(item.date)}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{item.talkingPoints}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => downloadText(`${item.title}.txt`, text)}>
                    Download
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(item.id)}>
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
