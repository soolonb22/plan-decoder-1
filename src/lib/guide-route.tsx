import { GuideArticle } from "@/components/guide-article";
import { guideBySlug } from "@/lib/content/guides";

export function guideHead(slug: string) {
  const g = guideBySlug(slug);
  return {
    meta: [
      { title: g?.metaTitle ?? "Guide · Plan Decoder" },
      { name: "description", content: g?.metaDescription ?? "Plain-language NDIS guide. Independent. Not the NDIA." },
    ],
  };
}

export function GuideBySlug({ slug }: { slug: string }) {
  const g = guideBySlug(slug);
  if (!g) {
    return <p className="text-sm text-muted">That guide is not on this site.</p>;
  }
  return <GuideArticle guide={g} />;
}
