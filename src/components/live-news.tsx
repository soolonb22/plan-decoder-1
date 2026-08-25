import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { LiveNewsItem } from "@/lib/ndis-news";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Feed = {
  live: LiveNewsItem[];
  fetchedAt: string;
  error: string | null;
  stale: boolean;
};

function useLiveNews() {
  const [feed, setFeed] = useState<Feed>({ live: [], fetchedAt: "", error: null, stale: false });
  const [busy, setBusy] = useState(true);

  function load(refresh = false) {
    setBusy(true);
    void fetch(refresh ? "/api/news?refresh=1" : "/api/news")
      .then(async (r) => {
        const data = (await r.json()) as {
          live?: LiveNewsItem[];
          fetchedAt?: string;
          error?: string | null;
          stale?: boolean;
        };
        if (!r.ok && !data.live?.length) throw new Error(data.error || "Could not load headlines.");
        setFeed({
          live: data.live ?? [],
          fetchedAt: data.fetchedAt ?? "",
          error: data.error ?? null,
          stale: Boolean(data.stale),
        });
      })
      .catch(() =>
        setFeed((f) => ({
          ...f,
          error: f.live.length
            ? "Could not refresh. Showing the last saved headlines."
            : "Could not load headlines. The official site may be busy.",
        })),
      )
      .finally(() => setBusy(false));
  }

  useEffect(() => {
    load();
  }, []);

  return { ...feed, busy, load };
}

export function NewsStatus({ error, stale, fetchedAt }: { error: string | null; stale?: boolean; fetchedAt?: string }) {
  if (!error && !stale) {
    return fetchedAt ? <p className="mt-1 text-xs text-muted">Last pulled {formatDate(fetchedAt.slice(0, 10))}.</p> : null;
  }
  return (
    <p className="mt-2 rounded-xl border border-line bg-paper-2 px-3 py-2 text-sm" role="status">
      {error || "Showing the last saved headlines."}{" "}
      {stale ? "These are the last saved headlines, not a live pull." : ""}{" "}
      <a className="text-primary underline-offset-4 hover:underline" href="https://www.ndis.gov.au/news/latest" target="_blank" rel="noreferrer">
        Open ndis.gov.au
      </a>
    </p>
  );
}

export function LiveNewsStrip({ limit = 3 }: { limit?: number }) {
  const { live, fetchedAt, error, stale, busy, load } = useLiveNews();
  const rows = live.slice(0, limit);

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-muted">Live from ndis.gov.au</p>
          <h2 className="text-lg font-semibold">NDIS news</h2>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => load(true)}>
            {busy ? "Checking…" : "Check again"}
          </Button>
          <Button size="sm" variant="secondary" asChild>
            <Link to="/news">All news</Link>
          </Button>
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">Independent scrape, refreshed several times a day. Not the NDIA.</p>
      <NewsStatus error={error} stale={stale} fetchedAt={fetchedAt} />
      <ul className="mt-3 space-y-2">
        {rows.map((n) => (
          <li key={n.id}>
            <Card className="p-4">
              <p className="text-xs text-muted">{n.date ? formatDate(n.date) : "Date not listed"}</p>
              <p className="mt-1 font-medium">{n.title}</p>
              <a
                className="mt-2 inline-block text-sm text-primary underline-offset-4 hover:underline"
                href={n.url}
                target="_blank"
                rel="noreferrer"
              >
                Open official page
              </a>
            </Card>
          </li>
        ))}
      </ul>
      {!busy && !rows.length ? (
        <p className="mt-2 text-sm text-muted">
          No headlines just now.{" "}
          <a className="text-primary underline-offset-4 hover:underline" href="https://www.ndis.gov.au/news/latest" target="_blank" rel="noreferrer">
            Open the official news page
          </a>
          .
        </p>
      ) : null}
    </section>
  );
}
