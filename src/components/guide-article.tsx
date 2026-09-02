import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import { PageArt } from "@/components/illustrations";
import type { Guide } from "@/lib/content/guides";

export function GuideArticle({ guide }: { guide: Guide }) {
  return (
    <article>
      <PageHeader title={guide.title} lede={guide.lede} art={guide.art} />
      <Disclaimer>{guide.disclaimer}</Disclaimer>
      {guide.sections.map((section) => (
        <section key={section.title} className="mt-8">
          <h2 className="text-xl font-semibold text-primary-deep">{section.title}</h2>
          {(section.paragraphs ?? []).map((p) => (
            <p key={p.slice(0, 48)} className="mt-3 text-sm leading-relaxed">
              {p}
            </p>
          ))}
          {section.bullets ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {section.bullets.map((b) => (
                <li key={b.slice(0, 48)}>{b}</li>
              ))}
            </ul>
          ) : null}
          {section.numbered ? (
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
              {section.numbered.map((b) => (
                <li key={b.slice(0, 48)}>{b}</li>
              ))}
            </ol>
          ) : null}
          {section.quote ? (
            <Card className="mt-4 whitespace-pre-wrap text-sm">{section.quote}</Card>
          ) : null}
          {section.table ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                <thead>
                  <tr>
                    {section.table.headers.map((h) => (
                      <th key={h} className="border-b border-line px-3 py-2 font-semibold text-primary-deep">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell) => (
                        <td key={cell.slice(0, 24)} className="border-b border-line px-3 py-2 align-top">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ))}
      <p className="mt-8">
        <Link to="/prep-pack" className="font-semibold text-primary underline-offset-4 hover:underline">
          Prepare with the Reassessment Prep Pack →
        </Link>
      </p>
      <h2 className="mt-10 text-lg font-semibold text-primary-deep">Common questions</h2>
      <div className="mt-3 space-y-3">
        {guide.faqs.map((item) => (
          <details key={item.q} className="rounded-2xl border border-line bg-card px-4 py-1 shadow-[var(--shadow-card)]">
            <summary className="cursor-pointer list-none py-3 font-semibold text-primary-deep">{item.q}</summary>
            <p className="pb-3 text-sm text-muted">{item.a}</p>
          </details>
        ))}
      </div>
      {guide.related.length ? (
        <p className="mt-8 text-sm">
          Related:{" "}
          {guide.related.map((r, i) => (
            <span key={r.to}>
              {i ? " · " : null}
              <a href={r.to} className="font-medium text-primary underline-offset-4 hover:underline">
                {r.label}
              </a>
            </span>
          ))}
        </p>
      ) : null}
    </article>
  );
}
