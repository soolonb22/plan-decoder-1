import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Lock, Shield, Trash2 } from "lucide-react";
import { canAccess } from "@/lib/membership";
import { SHORT_DISCLAIMER } from "@/lib/assessment/disclaimers";
import { useOllie } from "@/lib/store";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer, MembershipGate, PageHeader } from "@/components/layout/page";
import { HOW_OLLIE_WORKS, StoryStrip } from "@/components/story";
import { YoutubeEmbed, ELIGIBILITY_VIDEO } from "@/components/youtube-embed";
import { AssessmentWizard } from "@/components/assessment/wizard";
import { FunctionPanel } from "@/components/pocket/function-panel";

const TITLE =
  "NDIS practice assessment (WHODAS-inspired) — prepare for support needs conversations | Plan Decoder";
const DESC =
  "Free, private practice questionnaire to rehearse NDIS-style functional questions, environment, permanency and mainstream supports. Inspired by WHODAS 2.0 life areas and publicly described 2026 support-needs assessment themes. Not the NDIA. Not I-CAN. Not a diagnosis.";

export const Route = createFileRoute("/assessment")({
  validateSearch: (raw: Record<string, unknown>): { tab: "about" | "practice" | "function" } => {
    const tab = String(raw.tab ?? "");
    if (tab === "practice" || tab === "function") return { tab };
    return { tab: "about" };
  },
  component: AssessmentLanding,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      {
        name: "keywords",
        content:
          "NDIS practice assessment, WHODAS 2.0 Australia, prepare for I-CAN, NDIS support needs assessment 2026, NDIS eligibility practice, functional assessment NDIS, nominee carer parent questionnaire, NDIS permanency evidence, environmental circumstances NDIS",
      },
      { name: "robots", content: "index,follow" },
    ],
  }),
});

const FAQ = [
  {
    q: "Is this an official NDIS or I-CAN assessment?",
    a: "No. Plan Decoder is an independent practice tool. It is not affiliated with the NDIA, the NDIS, the World Health Organization, or the Centre for Disability Studies. It cannot replace an NDIA support needs assessment.",
  },
  {
    q: "Who can complete it?",
    a: "The participant, a parent or guardian, a carer, an NDIS nominee, or a professional with consent. The wording changes so questions say “you”, “your child”, “the person you support”, or “the participant”.",
  },
  {
    q: "What does the scoring mean?",
    a: "Plan Decoder uses WHODAS-style average scores (none through extreme) and a simple 0–100 transform of answered items. Support-needs questions use Plan Decoder’s own frequency and intensity scales. Official WHODAS IRT percentiles and official I-CAN scores are not calculated.",
  },
  {
    q: "Will this tell me if I am eligible, or how much funding I will get?",
    a: "No. Any “practice indicators” or dollar bands are illustrations from your ticks and from public conversation about plan sizes. They are not a quote, a prediction, or legal advice.",
  },
  {
    q: "Where is my information stored?",
    a: "On this device, in this browser. You can download a copy or delete the rehearsal immediately. Signing in only remembers membership, not your health answers.",
  },
];

function AssessmentLanding() {
  const { tab } = Route.useSearch();
  const assessments = useOllie((s) => s.assessments);
  const setActive = useOllie((s) => s.setActiveAssessment);
  const remove = useOllie((s) => s.removeAssessment);
  const upsert = useOllie((s) => s.upsertAssessment);
  const clientId = useOllie((s) => s.activeClientId);
  const membership = useOllie((s) => s.membership);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Plan Decoder practice assessment",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "12", priceCurrency: "AUD" },
    description: DESC,
    audience: { "@type": "Audience", geographicArea: { "@type": "Country", name: "Australia" } },
  };

  return (
    <div>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(appLd)}</script>
      <PageHeader
        title="Practise the conversation. Not the government form."
        lede="A calm, private rehearsal of functional questions, environment, permanency, and mainstream supports. Independent of the NDIA."
        picture="/brand/story-sit.jpg"
        actions={
          canAccess(membership, "core") ? (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button asChild>
              <Link to="/assessment" search={{ tab: "practice" }}>Continue practice</Link>
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                const id = upsert({
                  clientId,
                  respondent: "participant",
                  stepId: "welcome",
                  answers: {},
                  status: "in-progress",
                });
                setActive(id);
              }}
              asChild
            >
              <Link to="/assessment" search={{ tab: "practice" }}>Start a new rehearsal</Link>
            </Button>
          </div>
          ) : (
            <Button asChild>
              <Link to="/membership">Start Core to practise · $12 / month</Link>
            </Button>
          )
        }
      />
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="Practice assessment">
        {(
          [
            ["about", "About"],
            ["practice", "Rehearsal"],
            ["function", "Function snapshot"],
          ] as const
        ).map(([id, label]) => (
          <Link
            key={id}
            to="/assessment"
            search={{ tab: id }}
            role="tab"
            aria-selected={tab === id}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-3 text-sm",
              tab === id ? "border-primary bg-primary-soft" : "border-line bg-card",
            )}
          >
            {label}
          </Link>
        ))}
      </div>
      {tab === "practice" ? (
        <MembershipGate need="core">
          <AssessmentWizard />
        </MembershipGate>
      ) : null}
      {tab === "function" ? (
        <MembershipGate need="core">
          <FunctionPanel />
        </MembershipGate>
      ) : null}
      {tab === "about" ? (
        <>
      <Disclaimer>{SHORT_DISCLAIMER} You can stop or delete everything on this device at any time.</Disclaimer>
      <StoryStrip heading="The rehearsal in four pictures" steps={HOW_OLLIE_WORKS} />
      <div className="mt-4 sm:hidden">
        <Button className="w-full" asChild>
          <Link to={canAccess(membership, "core") ? "/assessment" : "/membership"} search={canAccess(membership, "core") ? { tab: "practice" } : undefined}>
            {canAccess(membership, "core") ? "Start practice with Plan Decoder" : "Start Core to practise"}
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          {
            icon: ClipboardList,
            image: "/brand/story-tick.jpg",
            title: "What you rehearse",
            body: "Daily function, 12 life areas, who is around you, whether it looks ongoing, and what other systems you already use.",
          },
          {
            icon: ClipboardList,
            image: "/brand/story-sit.jpg",
            title: "Easy to follow",
            body: "Large targets, skip buttons, Easy Read, and wording for a parent, carer, nominee, or professional.",
          },
          {
            icon: Shield,
            image: "/brand/story-device.jpg",
            title: "Stays on this device",
            body: "Answers autosave here. Download a PDF for a GP. Delete in one tap. Health notes are not sent to a cloud database.",
          },
          {
            icon: Lock,
            image: "/brand/story-together.jpg",
            title: "Built for access",
            body: "A parent, carer, nominee, or professional can answer. Skip buttons. Language that does not blame fluctuating disability.",
          },
        ].map((item) => (
          <Card key={item.title} className="invite-card">
            <img src={item.image} alt="" width={72} height={72} />
            <div className="invite-copy">
              <item.icon className="size-4 text-primary" />
              <p className="mt-1 font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.body}</p>
            </div>
          </Card>
        ))}
      </div>

      {assessments.length ? (
        <section className="mt-8" aria-labelledby="saved-heading">
          <h2 id="saved-heading" className="text-lg font-semibold">
            Saved on this device
          </h2>
          <ul className="mt-3 space-y-2">
            {assessments.map((a) => (
              <li key={a.id}>
                <Card className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {typeof a.answers.name === "string" && a.answers.name
                        ? a.answers.name
                        : "Practice rehearsal"}{" "}
                      · {a.status === "complete" ? "report ready" : "in progress"}
                    </p>
                    <p className="text-xs text-muted">Updated {formatDate(a.updatedAt.slice(0, 10))}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => setActive(a.id)}
                      asChild
                    >
                      <Link to="/assessment" search={{ tab: "practice" }}>Open</Link>
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => remove(a.id)}>
                      <Trash2 className="size-4" /> Delete
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10" aria-labelledby="about-heading">
        <h2 id="about-heading" className="text-xl font-semibold">
          What the 2026 NDIS assessment conversation is about
        </h2>
        <div className="mt-3 space-y-3 text-sm text-muted">
          <p>
            From mid-2026 the NDIA is introducing a new planning pathway. Public statements say trained assessors will use a customised version of the Instrument for Classification and Assessment of Support Needs (I-CAN) version 6, plus questionnaires about personal and environmental circumstances, and further modules when needs are more complex. The official tools are licensed and not published in full.
          </p>
          <p>
            Plan Decoder does not copy those instruments. This rehearsal uses original questions in the same <em>kinds</em> of life areas people are being asked to think about: daily function, support needed, who is around you, whether a treating professional has already described the impairment as ongoing, and whether other systems (health, school, housing, employment) have already been tried.
          </p>
          <p>
            WHODAS 2.0 is a World Health Organization schedule of functioning across six domains. Plan Decoder offers a WHODAS-inspired snapshot with WHO-style average descriptors (none, mild, moderate, severe, extreme) and a simple 0–100 transform. It is not an official WHODAS administration and does not compute item-response-theory percentiles.
          </p>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="text-xl font-semibold">
          Modules in this practice pack
        </h2>
        <p className="mt-2 text-sm text-muted">
          Module 1 starts with what the NDIS is, including a short independent video about eligibility and how to apply. It is not from the NDIA.
        </p>
        <YoutubeEmbed
          id={ELIGIBILITY_VIDEO.id}
          title={ELIGIBILITY_VIDEO.title}
          credit={ELIGIBILITY_VIDEO.credit}
        />
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>What is the NDIS — official-scheme explainer, then confirm this is only practice.</li>
          <li>Who is answering — participant, parent, carer, nominee, or professional.</li>
          <li>About the person — living situation, NDIS status, and the six NDIS-style function areas.</li>
          <li>WHODAS-inspired function (12 or 36 items) plus how many days life was interrupted.</li>
          <li>Support-needs rehearsal across 12 everyday life areas (frequency and intensity).</li>
          <li>Environment — who is in the home, unpaid hours, what happens if that person is away.</li>
          <li>Permanency module — duration, clinician view as you already know it, treatments tried, evidence on hand.</li>
          <li>Mainstream module — GP, health, school, housing, employment, and what still does not happen.</li>
          <li>Optional extra supports — equipment, home changes, overnight support.</li>
        </ol>
      </section>

      <section className="mt-8" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="text-xl font-semibold">
          Questions people ask
        </h2>
        <div className="mt-3 space-y-3">
          {FAQ.map((f) => (
            <Card key={f.q}>
              <h3 className="font-medium">{f.q}</h3>
              <p className="mt-1 text-sm text-muted">{f.a}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8" aria-labelledby="price-heading">
        <h2 id="price-heading" className="text-xl font-semibold">
          Practice assessments are part of Core
        </h2>
        <p className="mt-2 text-sm text-muted">
          You can read what the rehearsal covers here. Starting or continuing a practice assessment needs Core membership ($12 a month after a 3-day trial). Each finished practice report or polished draft then uses 1 credit ($5). Professional is $49 a month for coordinators and clinicians working with more than one person.
        </p>
        <div className="mt-4">
          <MembershipGate need="core">
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/assessment" search={{ tab: "practice" }}>Start a rehearsal</Link>
              </Button>
            </div>
          </MembershipGate>
        </div>
      </section>
        </>
      ) : null}
    </div>
  );
}
