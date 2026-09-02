import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LiveNewsStrip } from "@/components/live-news";
import { HOW_OLLIE_WORKS, StoryStrip } from "@/components/story";
import { ACCESS_BOUNDARY } from "@/lib/access-copy";
import { LOGIN_CREATE_SEARCH } from "@/lib/public-paths";
import { HOME_FAQS, faqJsonLd } from "@/lib/seo-faq";
import { FeatureArt, PageArt } from "@/components/illustrations";

export function MarketingHome() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <noscript>
        <p>
          Plan Decoder at https://www.plandecoder.com is an independent NDIS practice tool. Without an account
          you can read the glossary, NDIS news, and rights Module 0. A free account adds a basic diary and the
          plan checklist. The practice assessment and the rest of the rights course need Core. Not the NDIA. Not a
          diagnosis.
        </p>
      </noscript>

      <section className="ill-hero">
        <div>
          <p className="ill-kicker">Independent NDIS practice tools</p>
          <h1 className="text-3xl font-semibold tracking-tight text-primary-deep sm:text-4xl">
            Plan Decoder
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
            For families, carers, and coordinators in Australia. Rehearse functional questions, keep evidence on this
            device, and read rights in plain language. Not the NDIA. Does not decide eligibility or funding.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/login" search={LOGIN_CREATE_SEARCH}>
                Create a free account
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/assessment" search={{ tab: "about" }}>
                See the practice assessment
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
          </div>
        </div>
        <PageArt topic="home" showPhones={false} />
      </section>

      <PageArt topic="home" showIcons={false} />

      <StoryStrip heading="How this works" steps={HOW_OLLIE_WORKS} />

      <p className="mb-3 mt-8 text-sm text-muted">{ACCESS_BOUNDARY}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            to: "/assessment" as const,
            kind: "assess" as const,
            title: "Practice assessment",
            body: "Read what the rehearsal covers. Starting it needs Core.",
          },
          {
            to: "/navigator" as const,
            kind: "nav" as const,
            title: "Community navigator",
            body: "Find health, housing, and local doors — with or without NDIS. Not the official Navigator.",
          },
          {
            to: "/rights" as const,
            kind: "rights" as const,
            title: "Know your rights",
            body: "Module 0 is free to preview. The rest of the course is Core.",
          },
          {
            to: "/news" as const,
            kind: "news" as const,
            title: "NDIS news",
            body: "Live headlines from ndis.gov.au, with our notes underneath.",
          },
          {
            to: "/glossary" as const,
            kind: "glossary" as const,
            title: "Glossary",
            body: "NDIS words said in ordinary language.",
          },
          {
            to: "/articles" as const,
            kind: "words" as const,
            title: "Articles & guides",
            body: "Calm, dated explainers for assessments, plans, and funding.",
          },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="invite-card group rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-card)] hover:border-line-strong hover:bg-primary-soft"
          >
            <FeatureArt kind={item.kind} />
            <div className="invite-copy">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.body}</p>
            </div>
          </Link>
        ))}
      </div>

      <LiveNewsStrip limit={3} />

      <h2 className="mb-3 mt-10 text-lg font-semibold">Common questions</h2>
      <div className="space-y-3">
        {HOME_FAQS.map((item) => (
          <Card key={item.q}>
            <h3 className="font-semibold">{item.q}</h3>
            <p className="mt-2 text-sm text-muted">{item.a}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <p className="font-semibold">Please read this first</p>
        <p className="mt-2 text-sm text-muted">
          Practice answers stay on this device unless you later choose an encrypted copy. This app cannot apply for you,
          cannot promise funding, and is not a health service. If you are in danger, call 000.
        </p>
      </Card>
    </div>
  );
}
