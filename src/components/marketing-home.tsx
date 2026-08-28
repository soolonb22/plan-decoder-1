import { Link } from "@tanstack/react-router";
import { ClipboardList, Scale, Newspaper, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LiveNewsStrip } from "@/components/live-news";
import { OllieMark } from "@/components/mark";
import { HOW_OLLIE_WORKS, StoryStrip } from "@/components/story";
import { ACCESS_BOUNDARY } from "@/lib/access-copy";
import { LOGIN_CREATE_SEARCH } from "@/lib/public-paths";
import { HOME_FAQS, faqJsonLd } from "@/lib/seo-faq";

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
      <section className="welcome-row">
        <OllieMark className="size-14 shrink-0" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Plan Decoder — calm NDIS practice tools
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
            For families, carers, and coordinators in Australia. Rehearse functional questions, keep evidence on this
            device, and read rights in plain language. Not the NDIA. Does not decide eligibility or funding.
          </p>
        </div>
      </section>

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

      <StoryStrip heading="How this works" steps={HOW_OLLIE_WORKS} />

      <p className="mb-3 mt-8 text-sm text-muted">{ACCESS_BOUNDARY}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            to: "/assessment" as const,
            icon: ClipboardList,
            title: "Practice assessment",
            body: "Read what the rehearsal covers. Starting it needs Core.",
          },
          {
            to: "/rights" as const,
            icon: Scale,
            title: "Know your rights",
            body: "Module 0 is free to preview. The rest of the course is Core.",
          },
          {
            to: "/news" as const,
            icon: Newspaper,
            title: "NDIS news",
            body: "Live headlines from ndis.gov.au, with our notes underneath.",
          },
          {
            to: "/glossary" as const,
            icon: BookMarked,
            title: "Glossary",
            body: "NDIS words said in ordinary language.",
          },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="invite-card group rounded-2xl border border-line bg-card p-4 shadow-[var(--shadow-card)] hover:border-line-strong hover:bg-primary-soft"
          >
            <item.icon className="size-5 text-primary" />
            <p className="mt-2 font-semibold">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.body}</p>
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
