import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { NEWS, NEWS_CHECKED } from "@/lib/content/news";
import type { LiveNewsItem } from "@/lib/ndis-news";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { NewsStatus } from "@/components/live-news";

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
  const [stale, setStale] = useState(false);
  const [busy, setBusy] = useState(true);

  function load(force = false) {
    setBusy(true);
    void fetch(force ? "/api/news?refresh=1" : "/api/news")
      .then(async (r) => {
        const d = (await r.json()) as {
          live?: LiveNewsItem[];
          fetchedAt?: string;
          error?: string | null;
          stale?: boolean;
        };
        setLive(d.live ?? []);
        setFetchedAt(d.fetchedAt ?? "");
        setError(d.error ?? null);
        setStale(Boolean(d.stale));
      })
      .catch(() => {
        setError("Could not reach the news endpoint. The official site may be busy.");
      })
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
          <Button variant="secondary" disabled={busy} onClick={() => load(true)}>
            {busy ? "Checking…" : "Check again"}
          </Button>
        }
      />
      <Disclaimer>
        Headlines are copied from the official site and pulled several times a day. Always open the NDIA page if a
        decision depends on it. Last notes check {formatDate(NEWS_CHECKED)}.
      </Disclaimer>

      <h2 className="mt-6 text-lg font-semibold">From ndis.gov.au</h2>
      <NewsStatus error={error} stale={stale} fetchedAt={fetchedAt} />
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