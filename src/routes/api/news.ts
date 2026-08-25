import { createFileRoute } from "@tanstack/react-router";
import { fetchNdisNews, refreshAndStoreNews, type NewsPayload } from "@/lib/ndis-news";
import { NEWS, NEWS_CHECKED } from "@/lib/content/news";

function pack(live: NewsPayload) {
  return {
    live: live.items,
    fetchedAt: live.fetchedAt,
    error: live.error ?? null,
    stale: Boolean(live.stale),
    source: live.source,
    notes: NEWS,
    notesChecked: NEWS_CHECKED,
    disclaimer:
      "Headlines are copied from ndis.gov.au for orientation. Plan Decoder is not the NDIA. Always open the official page.",
  };
}

function emptyPack(error: string) {
  return pack({
    items: [],
    fetchedAt: new Date().toISOString(),
    error,
    stale: false,
    source: "empty",
  });
}

function cronOk(request: Request) {
  const expected = process.env.BETTER_AUTH_SECRET?.trim() || process.env.CRON_SECRET?.trim();
  const got = request.headers.get("x-pd-cron")?.trim();
  return Boolean(expected && got && got === expected);
}

export const Route = createFileRoute("/api/news")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const force = new URL(request.url).searchParams.get("refresh") === "1";
          const live = await fetchNdisNews({ force });
          return Response.json(pack(live));
        } catch (err) {
          console.error("[api/news GET]", err);
          return Response.json(emptyPack("Could not load headlines just now."), { status: 200 });
        }
      },
      POST: async ({ request }) => {
        if (!cronOk(request)) return Response.json({ error: "forbidden" }, { status: 403 });
        try {
          const live = await refreshAndStoreNews();
          return Response.json({ ok: !live.error || live.items.length > 0, ...pack(live) });
        } catch (err) {
          console.error("[api/news POST]", err);
          return Response.json({ ok: false, ...emptyPack("Scheduled refresh failed.") }, { status: 200 });
        }
      },
    },
  },
});
