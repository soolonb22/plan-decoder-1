import { createFileRoute } from "@tanstack/react-router";
import { PLAN_CHECKLIST } from "@/lib/content/checklist";
import { useOllie, useClientList } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page";
import { IMPLEMENTATION_VIDEO, YoutubeEmbed } from "@/components/youtube-embed";

export const Route = createFileRoute("/checklist")({
  component: ChecklistPage,
  head: () => ({
    meta: [
      { title: "NDIS plan implementation checklist · Plan Decoder" },
      {
        name: "description",
        content:
          "What to do after an NDIS plan is approved: read the plan, optional implementation meeting, providers, agreements, and tracking. Practice tool — not the NDIA.",
      },
    ],
  }),
});

function ChecklistPage() {
  const rows = useClientList("checklist");
  const setItem = useOllie((s) => s.setChecklist);
  const doneCount = PLAN_CHECKLIST.flatMap((g) => g.items).filter((i) =>
    rows.find((r) => r.key === i.key && r.done),
  ).length;
  const total = PLAN_CHECKLIST.flatMap((g) => g.items).length;

  return (
    <div>
      <PageHeader
        title="Plan implementation checklist"
        lede="What to do after a plan is approved. Not a test. Tick what you already know. The rest is a to-ask list."
        picture="/brand/story-path.jpg"
      />
      <YoutubeEmbed
        id={IMPLEMENTATION_VIDEO.id}
        title={IMPLEMENTATION_VIDEO.title}
        credit={IMPLEMENTATION_VIDEO.credit}
      />
      <Card className="mt-4 text-sm text-muted">
        <p>
          Official NDIA page (current 9 June 2026): a plan implementation meeting is optional. They aim to make a time
          within 7 days if you want one. Skipping it does not stop your plan or funding.{" "}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://www.ndis.gov.au/participants/using-your-funding/plan-implementation-meeting/what-plan-implementation-meeting"
            target="_blank"
            rel="noreferrer"
          >
            What is a plan implementation meeting
          </a>
        </p>
      </Card>
      <p className="mb-4 mt-4 text-sm text-muted tabular-nums">
        {doneCount} of {total} understood
      </p>
      <div className="space-y-4">
        {PLAN_CHECKLIST.map((group) => (
          <Card key={group.group}>
            <p className="font-semibold">{group.group}</p>
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => {
                const row = rows.find((r) => r.key === item.key);
                const checked = Boolean(row?.done);
                return (
                  <li key={item.key}>
                    <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-paper">
                      <input
                        type="checkbox"
                        className="mt-1 size-4 accent-primary"
                        checked={checked}
                        onChange={(e) => setItem(item.key, e.target.checked, row?.note)}
                      />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
