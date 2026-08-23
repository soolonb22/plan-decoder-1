import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SCRIPT_LIBRARY } from "@/lib/content/scripts";
import { useOllie } from "@/lib/store";
import { downloadText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MembershipGate, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/scripts")({ component: ScriptsPage });

function ScriptsPage() {
  const saved = useOllie((s) => s.scripts);
  const add = useOllie((s) => s.addScript);
  const remove = useOllie((s) => s.removeScript);
  const [q, setQ] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const filtered = useMemo(() => {
    const n = q.toLowerCase();
    return SCRIPT_LIBRARY.filter(
      (s) =>
        !n ||
        s.title.toLowerCase().includes(n) ||
        s.category.toLowerCase().includes(n) ||
        s.body.toLowerCase().includes(n),
    );
  }, [q]);

  return (
    <MembershipGate need="core">
      <PageHeader
        title="Advocacy scripts"
        lede="Words for the moments that go too fast. Change names, dates, and anything that is not true for you."
      />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search scripts"
        className="mb-4"
      />
      <div className="space-y-3">
        {filtered.map((s) => (
          <Card key={s.id}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{s.title}</p>
              <Badge>{s.category}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">{s.when}</p>
            <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{s.body}</pre>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => downloadText(`${s.id}.txt`, s.body)}>
                Download
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => add({ title: s.title, category: s.category, body: s.body, custom: false })}
              >
                Save a copy
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-6 space-y-3">
        <p className="font-semibold">Your words</p>
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Script">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} />
        </Field>
        <Button
          disabled={!title.trim() || !body.trim()}
          onClick={() => {
            add({ title, category: "Mine", body, custom: true });
            setTitle("");
            setBody("");
          }}
        >
          Save my script
        </Button>
        {saved.map((s) => (
          <div key={s.id} className="rounded-xl border border-line p-3 text-sm">
            <p className="font-medium">{s.title}</p>
            <Button size="sm" variant="ghost" onClick={() => remove(s.id)}>
              Remove
            </Button>
          </div>
        ))}
      </Card>
    </MembershipGate>
  );
}
