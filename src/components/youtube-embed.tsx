export const ELIGIBILITY_VIDEO = {
  id: "C9Gka3EQetY",
  title: "NDIS Eligibility Criteria How to Apply for the NDIS",
  credit: "Dana G on YouTube — independent explainer, not NDIA",
  url: "https://www.youtube.com/watch?v=C9Gka3EQetY",
} as const;

export const IMPLEMENTATION_VIDEO = {
  id: "vr_uQES8TdI",
  title: "NDIS Plan Implementation Checklist: What to Do After Your Plan is Approved",
  credit: "Affective Care on YouTube — independent explainer, not NDIA",
  url: "https://www.youtube.com/watch?v=vr_uQES8TdI",
} as const;

export const FUNDING_VIDEO = {
  id: "WzgWN9s4p3g",
  title: "NDIS Budget Categories Explained: Core, Capacity Building & Capital",
  credit: "Affective Care on YouTube — independent explainer, not NDIA",
  url: "https://www.youtube.com/watch?v=WzgWN9s4p3g",
} as const;

export const CODE_OF_CONDUCT_VIDEO = {
  id: "nFIeHFazBuI",
  title: "NDIS Code of Conduct [ENGLISH]",
  credit: "NDIS Quality and Safeguards Commission — official English overview",
  url: "https://www.youtube.com/watch?v=nFIeHFazBuI",
} as const;

export const AAT_VIDEO = {
  id: "QOizkbyHD-4",
  title: "Navigating the Administrative Appeals Tribunal for your NDIS",
  credit: "Queensland Advocacy for Inclusion — independent explainer. The AAT is now the ART.",
  url: "https://www.youtube.com/watch?v=QOizkbyHD-4",
} as const;

export const ART_APPLY_VIDEO = {
  id: "EOEaT71ZKhg",
  title: "How to apply for a review by the Administrative Review Tribunal",
  credit: "Administrative Review Tribunal — official",
  url: "https://www.youtube.com/watch?v=EOEaT71ZKhg",
} as const;

export const CHARTER_VIDEO = {
  id: "LfrjyaHtTY0",
  title: "How To - NDIS Participant Service Charter and Participant Service Improvement Plan",
  credit: "NDIS Australia — official How To video",
  url: "https://www.youtube.com/watch?v=LfrjyaHtTY0",
} as const;

export function YoutubeEmbed({
  id,
  title,
  credit,
}: {
  id: string;
  title: string;
  credit?: string;
}) {
  const href = `https://www.youtube.com/watch?v=${id}`;
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
      <figcaption className="space-y-1 px-3 py-3 text-xs text-muted">
        <a className="block text-sm font-medium text-primary underline-offset-4 hover:underline" href={href} target="_blank" rel="noreferrer">
          Watch on YouTube: {title}
        </a>
        <p>
          {credit ?? title}. Link: {href}. This is not an NDIA video. Check ndis.gov.au for official steps.
        </p>
      </figcaption>
    </figure>
  );
}
