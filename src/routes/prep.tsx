import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useOllie, useClientList } from "@/lib/store";
import { downloadText, formatDate, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";
import { RoomTabs } from "@/components/room-tabs";

const TABS = [
  { id: "appointment", label: "Appointment" },
  { id: "meeting", label: "Meeting" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export const Route = createFileRoute("/prep")({
  validateSearch: (raw: Record<string, unknown>): { tab: Tab } => {
    const tab = String(raw.tab ?? "");
    if (tab === "meeting" || tab === "appointment") return { tab };
    return { tab: "appointment" };
  },
  component: PrepPage,
  head: () => ({
    meta: [
      { title: "Prep · Plan Decoder" },
      { name: "description", content: "One-page briefs for GP appointments and NDIS planning meetings. Practice tool — not the NDIA." },
    ],
  }),
});

function PrepPage() {
  const { tab } = Route.useSearch();
  return (
    <MembershipGate need="core">
      <PageHeader
        title="Prep"
        lede="A page you can take in. GP or allied health, or a planning meeting — same calm brief."
        picture="/brand/story-gp.jpg"
        actions={
          <Button variant="secondary" asChild>
            <Link to="/guide">Or use guided help</Link>
          </Button>
        }
      />
      <RoomTabs to="/prep" tab={tab} items={[...TABS]} label="Prep" />
      {tab === "appointment" ? <AppointmentPanel /> : <MeetingPanel />}
    </MembershipGate>
  );
}

function AppointmentPanel() {
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
    <div>
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
        <Button onClick={() => save({ title, date, who, questions, sensoryNeeds: sensory, notes })}>
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
              <p className="text-xs text-muted">
                {formatDate(item.date)} · {item.who}
              </p>
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
    </div>
  );
}

function MeetingPanel() {
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
    <div>
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
        <Button onClick={() => save({ title, date, purpose, questions, talkingPoints: talking, notes })}>
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
    </div>
  );
}
