import { Link } from "@tanstack/react-router";
import { ClipboardList, Scale, Newspaper, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LiveNewsStrip } from "@/components/live-news";
import { OllieMark } from "@/components/mark";
import { HOW_OLLIE_WORKS, StoryStrip } from "@/components/story";

export function MarketingHome() {
  return (
    <div>
      <section className="welcome-row">
        <OllieMark className="size-14 shrink-0" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Calm NDIS practice tools for families, carers, and coordinators.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
            Rehearse functional questions, keep evidence on this device, and read rights in plain language. Plan Decoder
            is not the NDIA and does not decide eligibility or funding.
          </p>
        </div>
      </section>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/login">Create a free account</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/assessment">See the practice assessment</Link>
        </Button>
      </div>

      <StoryStrip heading="How this works" steps={HOW_OLLIE_WORKS} />

      <p className="mb-3 mt-8 text-sm font-medium text-muted">Open without signing in</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          {
            to: "/assessment" as const,
            icon: ClipboardList,
            title: "Practice assessment",
            body: "WHODAS-inspired rehearsal. Not I-CAN. Not a diagnosis.",
          },
          {
            to: "/rights" as const,
            icon: Scale,
            title: "Know your rights",
            body: "Reviews, timeframes, and 2026 law notes in plain English.",
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
