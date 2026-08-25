import { useState } from "react";
import { useOllie, useClientList } from "@/lib/store";
import { formatDate, todayISO } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/layout/page";

export function FlagsPanel() {
  const add = useOllie((s) => s.addFlag);
  const remove = useOllie((s) => s.removeFlag);
  const items = useClientList("flags");
  const [kind, setKind] = useState<"green" | "red">("green");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Green: conditions that help. Red: conditions that reliably make things worse. Both are evidence.
      </p>
      <Card className="space-y-3">
        <div className="flex gap-2">
          <Button variant={kind === "green" ? "leaf" : "secondary"} onClick={() => setKind("green")}>
            Green flag
          </Button>
          <Button variant={kind === "red" ? "danger" : "secondary"} onClick={() => setKind("red")}>
            Red flag
          </Button>
        </div>
        <Field label="Short title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Known worker / fluorescent lights" />
        </Field>
        <Field label="What happens">
          <Textarea value={detail} onChange={(e) => setDetail(e.target.value)} />
        </Field>
        <Button
          disabled={!title.trim()}
          onClick={() => {
            add({ kind, title, detail, date: todayISO() });
            setTitle("");
            setDetail("");
          }}
        >
          Save flag
        </Button>
      </Card>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.length === 0 ? (
          <div className="sm:col-span-2">
            <EmptyState title="No flags yet" body="Start with one thing that reliably helps, and one that reliably harms." />
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className={item.kind === "green" ? "border-leaf" : "border-alert/40"}>
              <Badge tone={item.kind === "green" ? "ok" : "alert"}>{item.kind}</Badge>
              <p className="mt-2 font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.detail}</p>
              <p className="mt-2 text-xs text-subtle">{formatDate(item.date)}</p>
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
