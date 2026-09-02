import { GUIDES } from "@/lib/content/guides";
import { Card } from "@/components/ui/card";

export function MoreGuides() {
  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">More plain-language guides</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <a href={`/${g.slug}`} className="block no-underline">
              <Card className="h-full hover:border-primary">
                <h3 className="text-base font-semibold text-primary-deep">{g.title}</h3>
                <p className="mt-1 text-sm text-muted">{g.lede}</p>
                <p className="mt-3 text-sm font-semibold text-primary">Read →</p>
              </Card>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
