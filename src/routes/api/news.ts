import { createFileRoute } from "@tanstack/react-router";
import { fetchNdisNews } from "@/lib/ndis-news";
import { NEWS, NEWS_CHECKED } from "@/lib/content/news";

export const Route = createFileRoute("/api/news")({
  server: {
    handlers: {
      GET: async () => {
        const live = await fetchNdisNews();
        return Response.json({
          live: live.items,
          fetchedAt: live.fetchedAt,
          error: live.error ?? null,
          notes: NEWS,
          notesChecked: NEWS_CHECKED,
          disclaimer:
            "Headlines are copied from ndis.gov.au for orientation. Plan Decoder is not the NDIA. Always open the official page.",
        });
      },
    },
  },
});
