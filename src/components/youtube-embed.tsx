export function YoutubeEmbed({
  id,
  title,
  credit,
}: {
  id: string;
  title: string;
  credit?: string;
}) {
  return (
    <figure className="mt-4 overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="relative aspect-video w-full bg-ink/10">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
          title={title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <figcaption className="px-3 py-2 text-xs text-muted">
        {credit ?? title}. This is not an NDIA video. Check ndis.gov.au for official steps.
      </figcaption>
    </figure>
  );
}
