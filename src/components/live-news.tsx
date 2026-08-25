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
};

function useLiveNews() {
  const [feed, setFeed] = useState<Feed>({ live: [], fetchedAt: "", error: null });
  const [busy, setBusy] = useState(true);

  function load(refresh = false) {
    setBusy(true);
    void fetch(refresh ? "/api/news?refresh=1" : "/api/news")
      .then((r) => r.json() as Promise<{ live?: LiveNewsItem[]; fetchedAt?: string; error?: string | null }>)
      .then((d) =>
        setFeed({
          live: d.live ?? [],
          fetchedAt: d.fetchedAt ?? "",
          error: d.error ?? null,
        }),
      )
      .catch(() => setFeed((f) => ({ ...f, error: "Could not load headlines." })))
      .finally(() => setBusy(false));
  }

  useEffect(() => {
    load();
  }, []);

  return { ...feed, busy, load };
}

export function LiveNewsStrip({ limit = 3 }: { limit?: number }) {
  const { live, fetchedAt, error, busy, load } = useLiveNews();
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
      <p className="mt-1 text-xs text-muted">
        Independent scrape, refreshed several times a day. Not the NDIA.
        {fetchedAt ? ` Last pulled ${formatDate(fetchedAt.slice(0, 10))}.` : ""}
      </p>
      {error && !rows.length ? <p className="mt-2 text-sm text-muted">{error}</p> : null}
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
      {!busy && !rows.length && !error ? (
        <p className="mt-2 text-sm text-muted">
          No headlines parsed just now.{" "}
          <Link className="text-primary underline-offset-4 hover:underline" to="/news">
            Open the news page
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}

export function LiveNewsList() {
  const { live, fetchedAt, error, busy, load } = useLiveNews();
  return { live, fetchedAt, error, busy, load };
}
