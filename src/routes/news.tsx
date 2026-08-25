import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NEWS, NEWS_CHECKED } from "@/lib/content/news";
import type { LiveNewsItem } from "@/lib/ndis-news";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Disclaimer, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({
    meta: [
      { title: "NDIS news, translated · Plan Decoder" },
      {
        name: "description",
        content: "Live headlines from ndis.gov.au plus Plan Decoder notes on why they might matter. Not the NDIA.",
      },
    ],
  }),
});

function NewsPage() {
  const [live, setLive] = useState<LiveNewsItem[]>([]);
  const [fetchedAt, setFetchedAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  function load() {
    setBusy(true);
    void fetch("/api/news")
      .then((r) => r.json() as Promise<{ live?: LiveNewsItem[]; fetchedAt?: string; error?: string | null }>)
      .then((d) => {
        setLive(d.live ?? []);
        setFetchedAt(d.fetchedAt ?? "");
        setError(d.error ?? null);
      })
      .catch(() => setError("Could not reach the news endpoint."))
      .finally(() => setBusy(false));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <PageHeader
        title="NDIS news"
        lede="Live headlines from ndis.gov.au, then our notes on why a family might care. Not the NDIA."
        picture="/brand/story-rights.jpg"
        actions={
          <Button variant="secondary" disabled={busy} onClick={() => load()}>
            {busy ? "Checking…" : "Check again"}
          </Button>
        }
      />
      <Disclaimer>
        Headlines are copied from the official site. Always open the NDIA page if a decision depends on it. Last notes
        check {formatDate(NEWS_CHECKED)}.
      </Disclaimer>

      <h2 className="mt-6 text-lg font-semibold">From ndis.gov.au</h2>
      {error && !live.length ? <p className="mt-2 text-sm text-muted">{error}</p> : null}
      {fetchedAt ? <p className="mt-1 text-xs text-muted">Fetched {formatDate(fetchedAt.slice(0, 10))}.</p> : null}
      <div className="mt-3 space-y-3">
        {live.map((n) => (
          <Card key={n.id}>
            <p className="text-xs text-muted">
              {n.date ? formatDate(n.date) : "Date not listed"} · {n.source}
            </p>
            <h3 className="mt-1 text-lg font-semibold">{n.title}</h3>
            <a
              className="mt-2 inline-block text-sm text-primary underline-offset-4 hover:underline"
              href={n.url}
              target="_blank"
              rel="noreferrer"
            >
              Open official page
            </a>
          </Card>
        ))}
        {!busy && !live.length ? (
          <Card>
            <p className="text-sm text-muted">
              No headlines parsed just now. The official layout may have changed, or the Worker could not fetch it.{" "}
              <a
                className="text-primary underline-offset-4 hover:underline"
                href="https://www.ndis.gov.au/news/latest"
                target="_blank"
                rel="noreferrer"
              >
                Open ndis.gov.au/news/latest
              </a>
              .
            </p>
          </Card>
        ) : null}
      </div>

      <h2 className="mt-8 text-lg font-semibold">Why it might matter (our notes)</h2>
      <div className="mt-3 space-y-3">
        {NEWS.map((n) => (
          <Card key={n.id}>
            <div className="flex flex-wrap gap-2">
              {n.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <h3 className="mt-2 text-lg font-semibold">{n.title}</h3>
            <p className="text-xs text-muted">
              {formatDate(n.date)} · {n.source}
            </p>
            <p className="mt-3 text-sm">{n.summary}</p>
            <p className="mt-3 text-sm text-primary-deep">
              <span className="font-medium">Why it matters. </span>
              {n.whyItMatters}
            </p>
            <a
              className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
              href={n.url}
              target="_blank"
              rel="noreferrer"
            >
              Official source
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}