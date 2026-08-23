import { createFileRoute } from "@tanstack/react-router";
import { NEWS } from "@/lib/content/news";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Disclaimer, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/news")({ component: NewsPage });

function NewsPage() {
  return (
    <div>
      <PageHeader
        title="NDIS news, translated"
        lede="What changed, and why a family or coordinator might care. Always check the official source."
      />
      <Disclaimer>
        Summaries are for orientation. Policy and prices change. This is not legal or financial advice.
      </Disclaimer>
      <div className="mt-5 space-y-3">
        {NEWS.map((n) => (
          <Card key={n.id}>
            <div className="flex flex-wrap gap-2">
              {n.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <h2 className="mt-2 text-lg font-semibold">{n.title}</h2>
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
