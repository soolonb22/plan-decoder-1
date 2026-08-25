import { createFileRoute } from "@tanstack/react-router";
import { fetchNdisNews, refreshAndStoreNews } from "@/lib/ndis-news";
import { NEWS, NEWS_CHECKED } from "@/lib/content/news";

function pack(live: { items: unknown; fetchedAt: string; error?: string }) {
  return {
    live: live.items,
    fetchedAt: live.fetchedAt,
    error: live.error ?? null,
    notes: NEWS,
    notesChecked: NEWS_CHECKED,
    disclaimer:
      "Headlines are copied from ndis.gov.au for orientation. Plan Decoder is not the NDIA. Always open the official page.",
  };
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
        const force = new URL(request.url).searchParams.get("refresh") === "1";
        const live = await fetchNdisNews({ force });
        return Response.json(pack(live));
      },
      POST: async ({ request }) => {
        if (!cronOk(request)) return Response.json({ error: "forbidden" }, { status: 403 });
        const live = await refreshAndStoreNews();
        return Response.json({ ok: true, ...pack(live) });
      },
    },
  },
});
