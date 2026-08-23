import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useOllie, useClientList } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState, MembershipGate, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/goals")({ component: GoalsPage });

function GoalsPage() {
  const add = useOllie((s) => s.addGoal);
  const update = useOllie((s) => s.updateGoal);
  const remove = useOllie((s) => s.removeGoal);
  const items = useClientList("goals");
  const [title, setTitle] = useState("");
  const [why, setWhy] = useState("");
  const [supports, setSupports] = useState("");

  return (
    <MembershipGate need="core">
      <PageHeader
        title="Goals and support wish list"
        lede="Goals that sound like a life, not a form. Pair each wish with the support that would make it possible."
      />
      <Card className="space-y-3">
        <Field label="Goal">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Leave the house three days a week" />
        </Field>
        <Field label="Why this matters">
          <Textarea value={why} onChange={(e) => setWhy(e.target.value)} />
        </Field>
        <Field label="Supports that would make it possible">
          <Textarea value={supports} onChange={(e) => setSupports(e.target.value)} />
        </Field>
        <Button
          disabled={!title.trim()}
          onClick={() => {
            add({ title, why, supports, domain: "", status: "wish" });
            setTitle("");
            setWhy("");
            setSupports("");
          }}
        >
          Add to wish list
        </Button>
      </Card>
      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState title="No goals yet" body="Start with one ordinary-life sentence." />
        ) : (
          items.map((g) => (
            <Card key={g.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="font-semibold">{g.title}</p>
                <Badge tone={g.status === "active" ? "primary" : "neutral"}>{g.status}</Badge>
              </div>
              {g.why ? <p className="mt-2 text-sm text-muted">{g.why}</p> : null}
              {g.supports ? <p className="mt-2 text-sm">{g.supports}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {(["wish", "active", "paused", "done"] as const).map((st) => (
                  <Button key={st} size="sm" variant={g.status === st ? "primary" : "secondary"} onClick={() => update(g.id, { status: st })}>
                    {st}
                  </Button>
                ))}
                <Button size="sm" variant="ghost" onClick={() => remove(g.id)}>
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
