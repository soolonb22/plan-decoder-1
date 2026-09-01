import type { ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Disclaimer, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/articles")({
  component: ArticlesPage,
  head: () => ({
    meta: [
      { title: "Articles and guides · Plan Decoder" },
      {
        name: "description",
        content:
          "Plain-language NDIS guides: the new assessment, 2026–2028 changes, reassessment, reading your plan, reasonable and necessary, unused funding. Independent. Not the NDIA.",
      },
    ],
  }),
});

const GUIDES = [
  {
    id: "new-assessment",
    badge: "Changes",
    title: "The new NDIS assessment",
    blurb: "The support needs assessment starts April 2027. What it is, what it asks, and calm ways to get ready.",
  },
  {
    id: "changes-2026",
    badge: "Changes",
    title: "NDIS changes 2026 to 2028",
    blurb: "Every main change, dated and in plain language. Check current dates on ndis.gov.au.",
  },
  {
    id: "reassessment",
    badge: "Guide",
    title: "NDIS reassessment",
    blurb: "What happens, how to get ready, and your review rights if you disagree.",
  },
  {
    id: "read-plan",
    badge: "Guide",
    title: "Why plans are hard to read",
    blurb: "The main parts of your plan explained simply, and private tools that help.",
  },
  {
    id: "reasonable",
    badge: "Guide",
    title: "Reasonable and necessary",
    blurb: "What the phrase means, what is changing from 2027, and how to describe your needs.",
  },
  {
    id: "unused",
    badge: "Guide",
    title: "Unused funding at reassessment",
    blurb: "What happens to unused funds, and why spend it all is the wrong takeaway.",
  },
];

function ArticlesPage() {
  return (
    <div>
      <PageHeader
        title="Articles & guides"
        lede="Plain language, short sections, dated. Colours follow official NDIS purple and cream so the pages stay calm."
        picture="/brand/story-words.jpg"
      />
      <Disclaimer>
        General information only. Rules change. Check ndis.gov.au. Independent. Not the NDIA. Not legal advice.
      </Disclaimer>

      <h2 className="mt-2 text-sm font-semibold uppercase tracking-wide text-muted">NDIS changes and reassessment</h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <li key={g.id}>
            <a href={`#${g.id}`} className="block no-underline">
              <Card className="h-full hover:border-primary">
                <p className="text-[0.7rem] font-bold uppercase tracking-wide text-primary">{g.badge}</p>
                <h3 className="mt-1 text-base font-semibold text-primary-deep">{g.title}</h3>
                <p className="mt-1 text-sm text-muted">{g.blurb}</p>
                <p className="mt-3 text-sm font-semibold text-primary">Read →</p>
              </Card>
            </a>
          </li>
        ))}
      </ul>

      <article id="new-assessment" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-semibold text-primary-deep">The new NDIS assessment: what to expect and how to prepare</h2>
        <p className="mt-2 text-muted">
          The NDIS is bringing in a new way of planning, with a support needs assessment. Here is what it is, in plain language, and some calm ways to get ready.
        </p>
        <Block title="What the new assessment is" open>
          <p>The NDIA has described the support needs assessment as a structured conversation with a trained, accredited assessor. It is for participants aged 16 and over.</p>
          <p>It is not a medical examination. It is not a diagnosis. It is not a test you need to pass. The aim is to build a clearer, more consistent picture of the support you need in daily life.</p>
          <p>The NDIA has said it is adapting a tool called I-CAN version 6 as the base for the conversation. It looks at how often you need support, and how much, across different areas of life.</p>
        </Block>
        <Block title="What it may ask about">
          <p>Based on public information, an assessor may ask about everyday areas of life, such as personal care, communication, getting around, decision making, relationships, community, work or study, safety, and the unpaid support you already get.</p>
          <p>It may also ask how your needs change, including on harder days. The exact questions and final process are still being tested before the rollout.</p>
        </Block>
        <Block title="When it starts">
          <p>The rollout is planned to begin from 1 April 2027. It will be staged. Not everyone moves across on that date. The NDIA should contact you before anything changes for you.</p>
          <p>Some older articles say the change starts in 2026. That timing is no longer current.</p>
        </Block>
        <Block title="Simple ways to get ready now">
          <p>You do not need to do anything urgently. Think about a normal day, from waking up to going to sleep, and where support fits in.</p>
          <p>Notice the difference between a good day and a hard day. Write down who helps you, with what, and how often — including unpaid help. Keep your own words.</p>
        </Block>
      </article>

      <article id="changes-2026" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-semibold text-primary-deep">NDIS changes 2026 to 2028: every date, in plain language</h2>
        <p className="mt-2 text-muted">A calm, dated rundown. Check the dates against ndis.gov.au, because timing can shift.</p>
        <Block title="2026" open>
          <p>On 19 August 2026, the Securing the NDIS for Future Generations Act passed parliament.</p>
          <p>From 1 October 2026, some community participation and capacity building budgets are expected to change as plans are reassessed or renewed. Critical daily supports, like help at home, are described as protected.</p>
        </Block>
        <Block title="2027">
          <p>From 1 February 2027, clearer criteria for reasonable and necessary supports are expected.</p>
          <p>From 1 April 2027, the new way of planning begins its staged rollout, including the support needs assessment for people aged 16 and over.</p>
          <p>From 1 October 2027, a new panel of plan management providers is expected to begin, with a transition period.</p>
        </Block>
        <Block title="2028">
          <p>From January 2028, access is expected to shift towards a standardised functional capacity assessment. This is about eligibility, and is separate from the support needs assessment used in planning.</p>
          <p>From 1 July 2028, a newly commissioned support coordination function is expected to begin.</p>
        </Block>
        <p className="mt-3 text-sm">
          Also see the dated summary on{" "}
          <Link to="/ndis-changes" className="font-medium text-primary underline-offset-4 hover:underline">
            NDIS changes
          </Link>
          .
        </p>
      </article>

      <article id="reassessment" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-semibold text-primary-deep">NDIS reassessment: what happens and how to get ready</h2>
        <Block title="What a reassessment is" open>
          <p>A reassessment, sometimes called a plan review, is a check of your situation and your supports before your next plan. It can happen at your scheduled date, or if your situation changes a lot.</p>
        </Block>
        <Block title="What tends to happen">
          <p>You usually talk with someone from the NDIA or a partner in the community, such as an LAC. You can bring notes, and you can have someone with you.</p>
        </Block>
        <Block title="If you disagree">
          <p>You have the right to ask for a review. There are time limits, so act promptly. A common limit is three months from the decision, but check the letter you receive. A free independent advocate can help.</p>
        </Block>
      </article>

      <article id="read-plan" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-semibold text-primary-deep">Why NDIS plans are hard to read, and what helps</h2>
        <Block title="The main parts, simply" open>
          <p>Your goals: what you want to work towards.</p>
          <p>Your funded supports: the help the NDIS will pay for, grouped into budgets.</p>
          <p>How your funding is managed: self managed, plan managed, or NDIA managed.</p>
          <p>Dates: when your plan starts, and when it is due to be looked at again.</p>
        </Block>
        <Block title="Reading your budget without fear">
          <p>Look for the budget headings, then the amounts under each. If a number surprises you, write your question down. You can ask your LAC, support coordinator, or plan manager.</p>
        </Block>
      </article>

      <article id="reasonable" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-semibold text-primary-deep">What reasonable and necessary means, and what is changing</h2>
        <Block title="What it means now" open>
          <p>A support is generally considered if it relates to your disability, helps you pursue your goals, and represents value for money. It also considers what is reasonable for family, carers, and the community to provide, and what other services should cover.</p>
        </Block>
        <Block title="What is changing">
          <p>From 1 February 2027, the NDIA is expected to use clearer criteria when deciding what is reasonable and necessary, applied more consistently across people with similar needs.</p>
        </Block>
        <Block title="How to describe your needs">
          <p>Connect each support to your disability and to a real part of your day. Describe what happens without the support, on a good day and a hard day. Use plain, honest language.</p>
        </Block>
      </article>

      <article id="unused" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-semibold text-primary-deep">Unused NDIS funding and reassessment: what to know</h2>
        <Block title="The change, plainly" open>
          <p>The government has said unused funds from your current plan will not carry over into a new plan. This applies as plans are reassessed or renewed under the new approach. Check ndis.gov.au for how and when this applies to you.</p>
        </Block>
        <Block title="Why spend it all is the wrong takeaway">
          <p>NDIS funding should only be used for legitimate supports that meet the rules and your actual needs. Rushing to spend can lead to supports you do not need. Using funds correctly matters more than using every dollar.</p>
        </Block>
        <Block title="Treat underspend as information">
          <p>If a budget is often underspent, ask why. Was the support not needed? Was there no provider available? Was there a hospital stay? Underspending because you could not find support is very different from not needing it. Say so.</p>
        </Block>
      </article>

      <p className="mt-10 rounded-xl bg-warn-soft p-4 text-sm text-warn">
        Details on this page were last reviewed on 2 September 2026. Dates and processes may shift. Before acting, check{" "}
        <a className="font-medium underline-offset-4 hover:underline" href="https://www.ndis.gov.au" rel="noreferrer">
          ndis.gov.au
        </a>
        .
      </p>
    </div>
  );
}

function Block({ title, open, children }: { title: string; open?: boolean; children: ReactNode }) {
  return (
    <details open={open} className="mt-3 rounded-2xl border border-line bg-card px-4 py-1 shadow-card">
      <summary className="cursor-pointer list-none py-3 font-semibold text-primary-deep">{title}</summary>
      <div className="space-y-2 pb-3 text-sm">{children}</div>
    </details>
  );
}
