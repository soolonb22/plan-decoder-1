import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { RIGHTS, RIGHTS_CONTACTS, RIGHTS_DISCLAIMER, RIGHTS_GROUPS } from "@/lib/content/rights";
import { useOllie } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { YoutubeEmbed } from "@/components/youtube-embed";
import { LiveNewsStrip } from "@/components/live-news";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/rights")({
  component: RightsPage,
  head: () => ({
    meta: [
      { title: "Know your rights · Plan Decoder" },
      {
        name: "description",
        content:
          "Plain-language NDIS rights: access, reasonable and necessary supports, internal review, ART, complaints, timeframes, and 2026 law changes. Not the NDIA.",
      },
    ],
  }),
});

function RightsPage() {
  const easy = useOllie((s) => s.a11y.easyRead);
  const [open, setOpen] = useState<string | null>(RIGHTS[0]?.id ?? null);
  const [group, setGroup] = useState<(typeof RIGHTS_GROUPS)[number]["id"] | "all">("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return RIGHTS.filter((r) => {
      if (group !== "all" && r.group !== group) return false;
      if (!query) return true;
      return `${r.title} ${r.summary} ${r.body} ${r.easy}`.toLowerCase().includes(query);
    });
  }, [group, q]);

  return (
    <div>
      <PageHeader
        title="Know your rights"
        lede="Plain-language starting points from official NDIS pages, checked in August 2026. Read your own letters for the dates that apply to you."
        picture="/brand/story-rights.jpg"
      />
      <Disclaimer>{RIGHTS_DISCLAIMER}</Disclaimer>

      <Card className="mt-5 border-lavender bg-primary-soft">
        <p className="text-sm font-medium text-primary">Free interactive course</p>
        <h2 className="mt-1 text-xl font-semibold">Know Your NDIS Rights</h2>
        <p className="mt-2 text-sm text-muted">
          Eight short modules (~10–14 minutes each) with a quiz in every one. Progress saves in this browser. When you
          finish, you can download a certificate. Not the NDIA.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/course"
            className="inline-flex min-h-11 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-fg"
          >
            Start the course
          </Link>
          <a
            href="/courses/know-your-rights.html"
            className="inline-flex min-h-11 items-center rounded-full border border-line bg-card px-4 text-sm"
          >
            Open full screen
          </a>
        </div>
      </Card>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { to: "/glossary" as const, label: "Glossary" },
          { to: "/news" as const, label: "NDIS news" },
          { to: "/code-of-conduct" as const, label: "Code of Conduct" },
          { to: "/art" as const, label: "ART / review" },
          { to: "/service-charter" as const, label: "Service Charter" },
          { to: "/ndis-changes" as const, label: "2026 changes" },
          { to: "/funding" as const, label: "Funding categories" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="inline-flex min-h-11 items-center rounded-full border border-line bg-card px-3 text-sm hover:border-primary"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <LiveNewsStrip limit={4} />

      <Card className="mt-5">
        <p className="text-sm font-medium text-primary">Help now</p>
        <ul className="mt-3 space-y-2 text-sm">
          {RIGHTS_CONTACTS.map((c) => (
            <li key={c.name}>
              <span className="font-medium">{c.name}. </span>
              <span className="text-muted">{c.detail}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-5">
        <label className="sr-only" htmlFor="rights-search">
          Search rights
        </label>
        <Input
          id="rights-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search — review, timeframe, complaint…"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Rights topics">
        <button
          type="button"
          role="tab"
          aria-selected={group === "all"}
          className={cn(
            "min-h-11 rounded-lg border px-3 text-sm",
            group === "all" ? "border-primary bg-primary-soft" : "border-line bg-card",
          )}
          onClick={() => setGroup("all")}
        >
          All
        </button>
        {RIGHTS_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={group === g.id}
            className={cn(
              "min-h-11 rounded-lg border px-3 text-sm",
              group === g.id ? "border-primary bg-primary-soft" : "border-line bg-card",
            )}
            onClick={() => setGroup(g.id)}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {list.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">Nothing matched. Try another word, or choose All.</p>
          </Card>
        ) : (
          list.map((r) => {
            const isOpen = open === r.id;
            return (
              <Card key={r.id} className="p-0">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : r.id)}
                  aria-expanded={isOpen}
                >
                  <span>
                    <span className="block font-semibold">{r.title}</span>
                    <span className="mt-1 block text-sm text-muted">{easy ? r.easy : r.summary}</span>
                  </span>
                  <span className="text-subtle">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen ? (
                  <div className="border-t border-line px-5 py-4">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{easy ? r.easy + "\n\n" + r.body : r.body}</p>
                    {r.youtube ? (
                      <YoutubeEmbed id={r.youtube.id} title={r.youtube.title} credit={r.youtube.credit} />
                    ) : null}
                    <p className="mt-3 text-xs text-muted">Checked against official pages · {r.updated}</p>
                    {r.official.length ? (
                      <ul className="mt-3 space-y-1 text-sm">
                        {r.official.map((l) => (
                          <li key={l.url}>
                            <a
                              className="text-primary underline-offset-4 hover:underline"
                              href={l.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
