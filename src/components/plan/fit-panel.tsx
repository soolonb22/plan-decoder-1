import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { S34_QUESTIONS } from "@/lib/s34";
import { useClientList } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/layout/page";

export function FitPanel() {
  const goals = useClientList("goals");
  const [goalId, setGoalId] = useState(goals[0]?.id ?? "");
  const [ticks, setTicks] = useState<Record<string, "yes" | "no" | "unsure">>({});
  const goal = goals.find((g) => g.id === goalId) ?? goals[0];
  const score = useMemo(() => {
    const yes = S34_QUESTIONS.filter((q) => ticks[q.id] === "yes").length;
    const no = S34_QUESTIONS.filter((q) => ticks[q.id] === "no").length;
    const unsure = S34_QUESTIONS.filter((q) => ticks[q.id] === "unsure").length;
    return { yes, no, unsure };
  }, [ticks]);

  if (!goals.length) {
    return (
      <EmptyState
        title="Add a wish first"
        body="The legal test is easier when you have a named support next to a goal."
        action={
          <Button asChild>
            <Link to="/plan" search={{ tab: "goals" }}>
              Open goals
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Practice map of section 34 questions. You are organising your own words — not filling the NDIA’s form. Not legal
        advice.
      </p>
      <Card className="mb-4">
        <label className="text-sm font-medium" htmlFor="fit-goal">
          Which wish or goal?
        </label>
        <select
          id="fit-goal"
          className="mt-2 h-11 w-full rounded-lg border border-line bg-card px-3"
          value={goal?.id}
          onChange={(e) => {
            setGoalId(e.target.value);
            setTicks({});
          }}
        >
          {goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.title}
            </option>
          ))}
        </select>
        {goal?.supports ? <p className="mt-2 text-sm text-muted">Support named: {goal.supports}</p> : null}
      </Card>
      <ol className="space-y-3">
        {S34_QUESTIONS.map((q, i) => (
          <li key={q.id}>
            <Card>
              <p className="text-sm font-medium">
                {i + 1}. {q.ask}
              </p>
              <p className="mt-1 text-sm text-muted">{q.easy}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["yes", "unsure", "no"] as const).map((v) => (
                  <Button
                    key={v}
                    size="sm"
                    variant={ticks[q.id] === v ? "primary" : "secondary"}
                    onClick={() => setTicks((t) => ({ ...t, [q.id]: v }))}
                  >
                    {v === "yes" ? "Yes, in my words" : v === "no" ? "Not yet" : "Not sure"}
                  </Button>
                ))}
              </div>
            </Card>
          </li>
        ))}
      </ol>
      <Card className="mt-4">
        <p className="text-sm">
          {score.yes} yes · {score.unsure} not sure · {score.no} not yet. Gaps are where a letter or a slip might help —
          they are not a fail.
        </p>
        <Button className="mt-3" variant="secondary" asChild>
          <Link to="/rights">Read the rights page on this test</Link>
        </Button>
      </Card>
    </div>
  );
}
