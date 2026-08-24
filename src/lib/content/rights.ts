export type RightLink = { label: string; url: string };

export type RightArticle = {
  id: string;
  group: "access" | "plan" | "review" | "safety" | "change" | "help";
  title: string;
  summary: string;
  easy: string;
  body: string;
  tags: string[];
  updated: string;
  official: RightLink[];
  youtube?: { id: string; title: string; credit: string };
};

export const RIGHTS_GROUPS: { id: RightArticle["group"]; label: string }[] = [
  { id: "access", label: "Getting into the NDIS" },
  { id: "plan", label: "Your plan and funding" },
  { id: "review", label: "If you disagree" },
  { id: "safety", label: "Safety and providers" },
  { id: "change", label: "When life changes" },
  { id: "help", label: "Getting help" },
];

export const RIGHTS_CONTACTS = [
  {
    name: "Emergency",
    detail: "If you are in immediate danger, call 000.",
  },
  {
    name: "NDIA (the Agency)",
    detail: "1800 800 110 · Monday to Friday 8am–8pm local time · ndis.gov.au",
  },
  {
    name: "NDIS Quality and Safeguards Commission",
    detail: "Complaints about providers or workers · 1800 035 544 · ndiscommission.gov.au",
  },
  {
    name: "National Relay Service",
    detail: "Ask for 1800 800 110 (NDIA) or 1800 035 544 (Commission).",
  },
];

export const RIGHTS: RightArticle[] = [
  {
    id: "what-is-ndis",
    group: "access",
    title: "What is the NDIS",
    summary:
      "The NDIS funds eligible people with disability and also connects anyone with disability to community services. It is run by the NDIA. Plan Decoder is not the NDIS.",
    easy:
      "The NDIS can pay for some disability supports if you are eligible. It can also help anyone with disability find local services. This app is only practice.",
    tags: ["access", "everyday", "what is the ndis"],
    updated: "May 2026",
    official: [
      { label: "What is the NDIS (ndis.gov.au)", url: "https://www.ndis.gov.au/understanding-ndis/about-ndis/what-ndis" },
      { label: "About the NDIS", url: "https://www.ndis.gov.au/understanding-ndis/about-ndis" },
      { label: "Participant service charter", url: "https://www.ndis.gov.au/about-us/service-charter/participant-service-charter" },
      { label: "How the NDIS works", url: "https://www.ndis.gov.au/understanding-ndis/about-ndis/how-ndis-works" },
      { label: "How to apply (ndis.gov.au)", url: "https://www.ndis.gov.au/applying/application-process/how-apply" },
    ],
    youtube: {
      id: "C9Gka3EQetY",
      title: "NDIS Eligibility Criteria How to Apply for the NDIS",
      credit: "Dana G on YouTube — independent explainer, not NDIA",
    },
    body: `This page restates the NDIA’s public explainer “What is the NDIS”, current on ndis.gov.au as of 7 May 2026. Plan Decoder is not the NDIA. Always check the official page if a decision depends on it.

The NDIS (National Disability Insurance Scheme) provides funding to eligible people with disability to:

• gain more time with family and friends
• have greater independence
• access new skills, jobs, or volunteering in their community
• work towards an improved quality of life

The NDIS also connects anyone with disability to services in their community. That includes doctors, community groups, sporting clubs, support groups, libraries and schools, and information about what each state and territory government already provides.

You do not have to be an NDIS participant to use those community connections. The Scheme is meant to help people find ordinary, local support as well as funded NDIS supports.

The NDIA (National Disability Insurance Agency) is the organisation that runs the NDIS. The NDIS is the scheme. The Agency is the people and systems that administer it.

The NDIA’s public page (May 2026) says the NDIS now supports over 500,000 Australians with disability. That includes supporting approximately 80,000 children with developmental delay, so they can receive supports early.

The NDIS is Australia’s first national scheme that can provide funding directly to eligible individuals. It does not replace health, education, housing, or income support. Those systems still have their own jobs.

If you are a participant, funded items must be NDIS supports that meet the legal tests. If you are not a participant, you can still ask for information and community connections.

Read the Participant service charter on ndis.gov.au to see how the Agency says it will treat you.

This Plan Decoder article is a calm restatement for practice and understanding. It is not legal advice and it does not decide access, plans, or funding.`,
  },
  {
    id: "funding-categories",
    group: "plan",
    title: "What your plan covers — funding categories",
    summary:
      "Current NDIA pages list four support budgets: Core, Capacity Building, Capital, and Recurring. Money does not move between budgets.",
    easy:
      "A plan can have up to four money pots. Core is everyday. Capacity building is skills. Capital is equipment or home changes. Recurring is regular things like transport. You cannot pour one pot into another.",
    tags: ["plan", "funding", "core", "capital"],
    updated: "June 2026",
    official: [
      {
        label: "Guide to NDIS support budgets",
        url: "https://www.ndis.gov.au/participants/using-your-funding/ndis-support-budgets/guide-ndis-support-budgets",
      },
      {
        label: "What are NDIS supports",
        url: "https://www.ndis.gov.au/participants/using-your-funding/understanding-your-ndis-funding/what-are-ndis-supports",
      },
    ],
    youtube: {
      id: "WzgWN9s4p3g",
      title: "NDIS Budget Categories Explained: Core, Capacity Building & Capital",
      credit: "Affective Care on YouTube — independent explainer, not NDIA",
    },
    body: `The NDIA’s “Guide to NDIS support budgets” (current 9 June 2026) says every plan has four support budgets:

• Core supports
• Capacity building supports
• Capital supports
• Recurring supports

Not every person has money in every budget. The plan only lists the budgets you need.

Under those budgets there are 21 support categories (for example assistance with daily life, or social and community participation). Under categories there are hundreds of support items, each with a code and a price limit.

Flexible funding: you can often choose which NDIS supports to buy inside that budget, and use the total across flexible categories in the same budget. The plan will say “This is a flexible support.”

Stated funding: you can only buy the NDIS support named in the plan, within that category. You can still choose the provider and how many of that support you buy, within the budget. The plan will say “This is a stated support.”

You cannot move money from one support budget to another. You cannot spend more than the total for that budget.

Example from the NDIA guide: Core daily life and Core community participation can often share one Core total if both are flexible. Speech pathology in Capacity Building that is stated cannot be used to buy a different support. Transport in Recurring cannot be topped up from Core.

Funding still has to be an NDIS support, related to your disability, and in line with your plan.

This is a calm restatement for practice. Official balances live in the my NDIS app and your plan, not in Plan Decoder.`,
  },
  {
    id: "choice-control",
    group: "plan",
    title: "Choice and control",
    summary: "You should have a say in your supports, who provides them, and how they are delivered.",
    easy: "You get a say. Someone can help. The choice can still be yours.",
    tags: ["plan", "everyday"],
    updated: "August 2026",
    official: [
      { label: "NDIS — using your plan", url: "https://www.ndis.gov.au/participants/using-your-plan" },
    ],
    body: `The NDIS Act is built around choice and control. That means you (or your nominee) should be able to:

• decide the goals that matter to you
• choose providers, where the market allows
• change providers if a support is not working
• have information in a way you can understand (Easy Read, interpreter, Auslan, longer time)

Choice and control does not mean you must manage everything yourself. You can ask a support coordinator, recovery coach, plan manager, or trusted person to help — and still keep the final say.

If a decision was made about you without you, ask for reasons in writing and the date you can request a review. Keep a copy.`,
  },
  {
    id: "plan-implementation",
    group: "plan",
    title: "After your plan is approved",
    summary:
      "Read the plan, decide about the optional implementation meeting, choose providers, and start tracking. Access to funding is not lost if you skip the meeting.",
    easy:
      "When a plan is approved: read it, decide if you want a start-up meeting, find providers, and keep simple notes. You can say no to the meeting and still use the plan.",
    tags: ["plan", "implementation", "checklist"],
    updated: "June 2026",
    official: [
      {
        label: "What is a plan implementation meeting",
        url: "https://www.ndis.gov.au/participants/using-your-funding/plan-implementation-meeting/what-plan-implementation-meeting",
      },
      { label: "Using your plan", url: "https://www.ndis.gov.au/participants/using-your-plan" },
    ],
    youtube: {
      id: "vr_uQES8TdI",
      title: "NDIS Plan Implementation Checklist: What to Do After Your Plan is Approved",
      credit: "Affective Care on YouTube — independent explainer, not NDIA",
    },
    body: `The NDIA’s public page (current 9 June 2026) says a plan implementation meeting is for you and your my NDIS contact. It is a way to get started with the approved plan.

They offer it once the plan is approved, including first plans and later plans. If you want to meet, they aim to make a time within 7 days. Meetings are usually about an hour, and they should take as long as you need.

In the meeting they may:

• talk you through using the plan
• talk you through which NDIS supports you can buy
• help find providers that fit your goals
• show the my NDIS participant portal and app
• answer questions

The meeting is optional. You might already feel comfortable, or a support coordinator or recovery coach may be helping. Access to the approved plan and funding is not affected if you do not have the meeting.

After an implementation meeting they usually arrange a check-in at least once a year. You can still contact your my NDIS person sooner if you need help.

A calm order of first steps:

1. Read the plan — dates, goals, budgets, stated supports, how money is managed.
2. Open the portal or app, or ask someone to sit with you.
3. Decide about the implementation meeting.
4. Choose providers. NDIA-managed funding usually needs registered providers.
5. Read service agreements before you sign.
6. Keep a simple spend record and short notes of what works.

Plan Decoder’s checklist is a rehearsal list. It is not an NDIA form.`,
  },
  {
    id: "access-requirements",
    group: "access",
    title: "Who can access the NDIS",
    summary: "Access has age, residence, and disability or early intervention tests. Evidence of function matters more than a label.",
    easy: "You need to be the right age, live in Australia the right way, and show a long-term disability impact.",
    tags: ["access"],
    updated: "August 2026",
    official: [
      { label: "Eligibility requirements", url: "https://www.ndis.gov.au/applying/eligibility-requirements" },
      { label: "Disability requirements", url: "https://www.ndis.gov.au/applying/eligibility-requirements/what-are-ndis-disability-requirements" },
      { label: "How to apply", url: "https://www.ndis.gov.au/applying/application-process/how-apply" },
    ],
    youtube: {
      id: "C9Gka3EQetY",
      title: "NDIS Eligibility Criteria How to Apply for the NDIS",
      credit: "Dana G on YouTube — independent explainer, not NDIA",
    },
    body: `To become a participant you generally need to meet:

1. Age — under 65 when you apply.
2. Residence — an Australian citizen, permanent resident, or Protected Special Category Visa holder, living in Australia.
3. Disability requirements and/or early intervention requirements.

The disability requirements (NDIS website, current as of 2026) look at whether:

• you have an impairment that is likely to be permanent (lifelong), including impairments that fluctuate or are episodic
• it substantially reduces your functional capacity in one or more of: communication, social interaction, learning, mobility, self-care, self-management
• you are likely to need NDIS supports for your lifetime

“Permanent” is not “untreatable forever”. The Agency looks at whether available, appropriate treatment has been considered. You do not have to have tried unsafe or unreasonable treatment.

Early intervention is a different pathway, often used for children and for some people where early support will reduce future need.

Access is a legal decision. Plan Decoder’s practice questions are rehearsal only — they do not apply to the NDIS for you.`,
  },
  {
    id: "reasonable-necessary",
    group: "plan",
    title: "Reasonable and necessary supports",
    summary: "Funding must meet the legal test in section 34 — and, since October 2024, must also be an NDIS support.",
    easy: "The NDIS funds disability supports that meet a legal test. It does not fund ordinary living costs.",
    tags: ["funding", "s34"],
    updated: "August 2026",
    official: [
      { label: "What is reasonable and necessary", url: "https://www.ndis.gov.au/participants/creating-plan/understanding-plan-meeting/what-reasonable-and-necessary" },
      { label: "Summary of legislation changes", url: "https://www.ndis.gov.au/ndis-laws/getting-ndis-back-track/summary-legislation-changes" },
    ],
    body: `Section 34 of the NDIS Act is the legal test. Since 3 October 2024 the published test also requires the support to be an “NDIS support” (or an agreed replacement support).

In plain language, a funded support needs to:

• relate to the impairment that met access (disability and/or early intervention)
• help you work towards your goals
• help you work, study, or take part in social life
• be value for money
• be likely to be effective and beneficial
• work with mainstream supports and informal networks
• be an NDIS support for you, or an agreed replacement support

The Agency says reasonable and necessary supports cannot include ordinary day-to-day living costs, holidays or event tickets as such, illegal or harmful supports, or a replacement for income.

You do not have to prove you are “deserving”. You need evidence of functional impact — what is hard, how often, what happens without support, and what the support will change.

Lists of what is and is not an NDIS support sit in the NDIS rules (section 10). Those lists can be updated. Always check the letter and ndis.gov.au, not a rumour.`,
  },
  {
    id: "service-charter",
    group: "plan",
    title: "Participant Service Charter and Improvement Plan",
    summary:
      "The Charter is how the NDIA says it will treat you. The Improvement Plan is what they say they will change. The Guarantee is the decision clocks.",
    easy:
      "The Agency says it will be transparent, responsive, respectful, empowering, and connected. If that is not your experience, you can give feedback. There are also clocks on decisions.",
    tags: ["charter", "timeframes", "service"],
    updated: "May 2026",
    official: [
      { label: "Participant Service Charter", url: "https://www.ndis.gov.au/about-us/service-charter/participant-service-charter" },
      { label: "Participant Service Improvement Plan", url: "https://www.ndis.gov.au/about-us/service-charter/participant-service-improvement-plan" },
      { label: "Participant Service Guarantee", url: "https://www.ndis.gov.au/about-us/service-charter/participant-service-guarantee" },
      { label: "Easy Read Charter (PDF)", url: "https://www.ndis.gov.au/media/2621/download?attachment" },
    ],
    youtube: {
      id: "LfrjyaHtTY0",
      title: "How To - NDIS Participant Service Charter and Participant Service Improvement Plan",
      credit: "NDIS Australia — official How To video",
    },
    body: `Three related NDIA documents. They are not your plan.

1. Participant Service Charter — how the Agency says it will engage with you. Five words: transparent, responsive, respectful, empowering, connected. The published Charter page is current as at October 2022.

   • Transparent: information and decisions should be easy to access and understand.
   • Responsive: your individual needs and circumstances.
   • Respectful: you are the expert in your own life.
   • Empowering: information and support to lead your life.
   • Connected: help to reach the services and supports you need.

2. Participant Service Improvement Plan — what the NDIA and partners say they will do over a two-year period so the Scheme meets people’s expectations. The website (current 19 May 2026) describes 51 commitments across 9 improvement areas. Progress is meant to appear in Quarterly Reports.

3. Participant Service Guarantee — the clocks on access, plans, variations, reviews, and nominee changes. Those timeframes are reported separately.

The Charter does not replace a review right. If service is late, unclear, or disrespectful, keep dates, keep letters, ask for reasons in writing, and you can give feedback (1800 800 110) or complain about Agency service.

Plan Decoder is not the NDIA. The official How To video is below.`,
  },
  {
    id: "psg-timeframes",
    group: "plan",
    title: "How long the NDIA has to decide (Participant Service Guarantee)",
    summary: "The Participant Service Guarantee sets legal-style timeframes for access, plans, variations, and reviews.",
    easy: "There are clocks on NDIA decisions. Your letter should tell you the date.",
    tags: ["timeframes", "charter"],
    updated: "August 2026",
    official: [
      { label: "Participant Service Guarantee", url: "https://www.ndis.gov.au/about-us/service-charter/participant-service-guarantee" },
    ],
    body: `The Participant Service Guarantee (on ndis.gov.au, current as of 14 August 2026) includes timeframes such as:

Access
• Decide who can use the NDIS — 21 days (PSG 2)
• Decide after more information is given — 14 days (PSG 4)

First plans
• Approve a plan — 56 days (PSG 6)
• Have a meeting to start your plan if you want one — 28 days (PSG 7)

Changes and reviews
• Decide whether to do a plan reassessment you asked for — 21 days (PSG 12)
• Do a plan reassessment they agreed to — 28 days (PSG 13)
• Make changes to a plan — 28 days (PSG 14)
• Internal review of a decision — 60 days (PSG 17a)
• Put an internal review outcome into a plan — 28 days (PSG 17b)
• Put Administrative Review Tribunal orders into place — 28 days (PSG 18)

These clocks start from the Agency’s own milestones. If a timeframe is missed, write down the dates, keep the letter, and you can still ask for a review or make a complaint about service. Missing a PSG clock does not automatically give you funding.

The NDIA also says plans are extended if they have not been reassessed before they expire, so supports should not stop at the end date.`,
  },
  {
    id: "review-s100",
    group: "review",
    title: "Internal review of a decision",
    summary: "You usually have 3 months from receiving a reviewable decision to ask the NDIA to look again.",
    easy: "If you disagree, ask for an internal review. Write it down. Keep a copy. You usually have 3 months.",
    tags: ["review", "appeals"],
    updated: "August 2026",
    official: [
      { label: "Guide to decision reviews", url: "https://www.ndis.gov.au/participants/changing-your-plan/decision-reviews/guide-decision-reviews" },
    ],
    body: `Many NDIA decisions are “reviewable decisions”. Common ones are:

• whether you meet access
• the supports in your plan (what is funded, and what is not)

You generally have 3 months from the day you received the decision to request an internal review. The NDIA says you can:

• use their “request a review of a decision” form
• send an enquiry through the service hub with evidence
• call 1800 800 110

You, a family member, friend, support coordinator, or recovery coach can help you ask. Put it in writing if you can. Keep a copy. Ask for the decision and the reasons.

A different decision-maker looks at it. You can add new evidence. PSG 17a allows 60 days for the Agency to finish that review.

If you miss the 3 months, still ask and explain why it was late. Do not assume it is closed without asking.

This is general information, not legal advice.`,
  },
  {
    id: "art-review",
    group: "review",
    title: "External review (ART — the old AAT)",
    summary:
      "After internal review you usually have 28 days to apply to the Administrative Review Tribunal. It replaced the AAT on 14 October 2024. No application fee.",
    easy:
      "If the NDIA looks again and you still disagree, you can ask an independent tribunal. It used to be called the AAT. It is now the ART. Dates are strict.",
    tags: ["review", "appeals", "ART", "AAT"],
    updated: "August 2026",
    official: [
      { label: "ART — NDIS reviews", url: "https://www.art.gov.au/applying-review/national-disability-insurance-scheme" },
      { label: "Apply online (NDIS)", url: "https://online.aat.gov.au/Home/InstructionsNdis" },
      { label: "NDIS Appeals Program", url: "https://www.health.gov.au/our-work/ndis-appeals-program" },
      { label: "NDIA — introducing the ART", url: "https://www.ndis.gov.au/news/10435-introducing-new-administrative-review-tribunal" },
    ],
    youtube: {
      id: "QOizkbyHD-4",
      title: "Navigating the Administrative Appeals Tribunal for your NDIS",
      credit: "Queensland Advocacy for Inclusion — independent. The AAT is now the ART.",
    },
    body: `On 14 October 2024 the Administrative Appeals Tribunal (AAT) was replaced by the Administrative Review Tribunal (ART). You do not start again if you already had an AAT case — those files moved across.

Usually you need an NDIA internal review first. Then you have 28 days from receiving that internal review decision to apply to the ART. The Tribunal can allow more time if you ask in writing and explain why.

If the NDIA has not finished the internal review within 90 days of you asking, the ART may be able to look at it without waiting.

There is no application fee for NDIS reviews.

The ART can review many internal review decisions, including access, the statement of supports in a plan, and some nominee or child decisions. It cannot investigate a complaint about the NDIA’s service, and it cannot change the law.

Apply:

• online (easiest): online.aat.gov.au NDIS instructions
• phone 1800 228 333
• email reviews@art.gov.au
• letter, or a Tribunal office

You will need the decision, the date you got it, why you say it is wrong, and any extra evidence. Interpreters: TIS 131 450.

Free help: the NDIS Appeals Program can connect you with a disability advocate for ART matters (health.gov.au). Legal Aid and community legal centres may also help.

If the ART makes orders, the Participant Service Guarantee allows 28 days for the Agency to put those orders in place (PSG 18).

Plan Decoder can help you sort evidence. It cannot represent you or predict a result. This is not legal advice.`,
  },
  {
    id: "change-circumstances",
    group: "change",
    title: "Change of circumstances and plan variations",
    summary: "If something significant changes, you can ask for a variation or a reassessment. Write down what changed.",
    easy: "If life changes a lot, tell the NDIS in writing. Keep a copy.",
    tags: ["plan", "review"],
    updated: "August 2026",
    official: [
      { label: "Changing your plan", url: "https://www.ndis.gov.au/participants/changing-your-plan" },
    ],
    body: `A scheduled reassessment is not the only time a plan can change. You can ask for a plan variation or a reassessment if there is a significant change — for example:

• function has changed (better or worse, including after hospital)
• informal support has changed (a carer cannot continue)
• you moved, or your living arrangement changed
• a support is clearly not working or is no longer available
• new evidence has come in

Write down: what changed, when, how day-to-day function is different, what happens if support stays the same, and what you are asking for.

The Participant Service Guarantee currently allows 21 days for the Agency to decide whether to do a reassessment you asked for (PSG 12), and 28 days to make plan changes (PSG 14).

Parliament passed the NDIS Amendment (Securing the NDIS for Future Generations) Bill 2026 in August 2026. Start dates are staggered. When those rules commence, unscheduled reassessments may be tighter (who can ask, and a 90-day decision clock). Until a start date applies to you, follow the letter in your hand and ndis.gov.au.`,
  },
  {
    id: "needs-assessment",
    group: "change",
    title: "New support needs assessments (I-CAN based)",
    summary: "A new planning assessment based on I-CAN is being introduced. It is for planning budgets — it is not the same as access.",
    easy: "A new assessment is coming for plans. You can have someone with you. It is not the old independent assessments.",
    tags: ["planning", "I-CAN"],
    updated: "August 2026",
    official: [
      { label: "Developing a new support needs assessment", url: "https://www.ndis.gov.au/news/10926-developing-new-support-needs-assessment" },
      { label: "Summary of legislation changes", url: "https://www.ndis.gov.au/ndis-laws/getting-ndis-back-track/summary-legislation-changes" },
    ],
    body: `The NDIA says a new support needs assessment will be part of new-framework planning. It is based on the Instrument for the Classification and Assessment of Support Needs (I-CAN) version 6, licensed from the Centre for Disability Studies, with the University of Melbourne.

Official pages say:

• it collects information from participants, families and carers about disability support needs
• it is meant to make plan budgets fairer and reduce some evidence burden
• it is for planning, not for deciding access
• people will be told when it is their turn, with support for that step
• full new-framework planning is described as transitioning from 1 April 2027, with tools rolling out from mid-2026

You can still bring your own evidence. You can ask who will be in the room. You can ask for the questions in advance if you need that for processing or communication. You can have a support person.

Plan Decoder’s practice assessment is a rehearsal inspired by functional questions. It is not the NDIA’s I-CAN tool and it is not an official assessment.`,
  },
  {
    id: "future-generations",
    group: "change",
    title: "2026 law changes — what to watch",
    summary: "A 2026 Amendment Bill passed Parliament in August 2026. Many parts start later. Your current plan stays until a start date applies to you.",
    easy: "New laws are coming in stages. Read your letter. Do not panic on rumours.",
    tags: ["law", "2026"],
    updated: "August 2026",
    official: [
      { label: "About the changes to the NDIS (Health)", url: "https://www.health.gov.au/our-work/ndis-legislation-changes/amendments/ndis-amendment-securing-the-ndis-for-future-generations-bill-2026/about-the-changes-to-the-ndis?language=en" },
    ],
    body: `The NDIS Amendment (Securing the NDIS for Future Generations) Bill 2026 passed Parliament on 19 August 2026 and was awaiting Royal Assent. Parts start on different days. This is a map, not legal advice.

Published government material describes staged changes such as:

• tighter rules for unscheduled plan reassessments, with a 90-day decision clock — if no decision, it can be treated as refused so review rights open
• only the participant, plan nominee, or guardian requesting some unscheduled reassessments
• new-framework planning and support needs assessments from 2027
• access and eligibility reassessments described from 1 January 2028, with current participants keeping supports under existing rules until they are reassessed
• some participation and capacity-building budget settings changing for new or reassessed plans
• claims closer to the date of service
• more registered-provider rules for higher-risk supports later in the decade

Review rights for access and plan decisions are described as remaining. Automated decisions are described as still having human review.

If a planner quotes a 2026 Bill at you, ask which start date applies to your plan, in writing. Until then, the decision letter you already have is the one to review.`,
  },
  {
    id: "privacy",
    group: "help",
    title: "Privacy and your information",
    summary: "NDIS information is sensitive. You choose what you share, and you can ask who will see it.",
    easy: "You choose what to share. You can share a short extract, not the whole file.",
    tags: ["privacy"],
    updated: "August 2026",
    official: [
      { label: "NDIS privacy", url: "https://www.ndis.gov.au/about-us/policies/privacy" },
    ],
    body: `NDIS information is sensitive personal information. You can:

• ask who will see a report before you share it
• share extracts instead of a whole file
• withdraw consent where the law allows
• request access to information the NDIA holds about you

Plan Decoder keeps evidence on this device by default. Sign-in is only for your account identity, membership, and credits. Do not paste extra identifiers into tools you do not trust.

If you are a professional, you still need consent and your own record-keeping duties.`,
  },
  {
    id: "complaints",
    group: "safety",
    title: "Complaints about the NDIA or a provider",
    summary: "You can complain without losing your plan. Use the Commission for providers, the NDIA for Agency service.",
    easy: "You can complain. It should not cancel your plan. If you are unsafe, call 000.",
    tags: ["safety", "quality"],
    updated: "August 2026",
    official: [
      { label: "Report to the NDIS Commission", url: "https://www.ndiscommission.gov.au/complaints/report" },
      { label: "NDIA feedback", url: "https://www.ndis.gov.au/contact/feedback-and-enquiries/how-give-feedback" },
    ],
    body: `Two different doors:

1. The NDIA (1800 800 110, ndis.gov.au) — how the Agency treated you, delays, communication, a decision process. You can also go to the Commonwealth Ombudsman about Agency service.

2. The NDIS Quality and Safeguards Commission (1800 035 544, ndiscommission.gov.au) — quality and safety of NDIS supports, registered or unregistered providers, workers, and how a provider handled a complaint.

You can complain about unsafe, disrespectful, or poor supports. Providers must not punish you for complaining (changing hours or ending a service because you spoke up can itself be reported).

You can ask for your name to be kept confidential in many Commission processes.

If you are in immediate danger, call 000. Then tell the Commission when you are safe.`,
  },
  {
    id: "code-conduct",
    group: "safety",
    title: "NDIS Code of Conduct",
    summary: "The Commission’s rules for every NDIS provider and worker — registered or not. Official English video is below.",
    easy: "Workers must treat you with respect, keep you safe, and not overcharge. You can complain to the Commission. If you are unsafe, call 000.",
    tags: ["providers", "safety", "code of conduct"],
    updated: "May 2026",
    official: [
      { label: "NDIS Code of Conduct (Commission)", url: "https://www.ndiscommission.gov.au/rules-and-standards/ndis-code-conduct" },
      { label: "Easy Read: NDIS Code of Conduct", url: "https://ndiscommission.easyread.com.au/ndis-code-conduct/" },
      { label: "Report a provider or worker", url: "https://www.ndiscommission.gov.au/complaints/report" },
      { label: "Code of Conduct videos (other languages and Auslan)", url: "https://www.ndiscommission.gov.au/code-of-conduct-videos" },
    ],
    youtube: {
      id: "nFIeHFazBuI",
      title: "NDIS Code of Conduct [ENGLISH]",
      credit: "NDIS Quality and Safeguards Commission — official English overview",
    },
    body: `The NDIS Code of Conduct is made by the NDIS Quality and Safeguards Commission, not the NDIA. It is in section 6 of the National Disability Insurance Scheme (Code of Conduct) Rules 2018.

It applies to registered and unregistered providers, their key personnel, and workers. It also applies to some ILC and Continuity of Support services.

The Code requires people who deliver NDIS supports to:

1. Act with respect for individual rights to freedom of expression, self-determination, and decision-making, in line with relevant laws and conventions.
2. Respect the privacy of people with disability.
3. Provide supports and services in a safe and competent manner, with care and skill.
4. Act with integrity, honesty, and transparency.
5. Promptly take steps to raise and act on concerns about quality and safety.
6. Take all reasonable steps to prevent and respond to all forms of violence, exploitation, neglect, and abuse of people with disability.
7. Take all reasonable steps to prevent and respond to sexual misconduct.
8. Not charge or represent higher prices for goods for NDIS participants without a reasonable justification.

You can refuse a support worker. You can ask for a worker of a particular gender if that is a safety need. You can have a support person in the home. You can end a service agreement — check notice periods, but safety comes first.

Providers must not threaten you for raising a concern. If something feels unsafe, you can tell the provider and you can tell the Commission (1800 035 544). If you are in immediate danger, call 000.

Restrictive practices (locking doors, certain medications, seclusion, physical restraint) have extra rules. They are not a casual “house rule”. Ask for the behaviour support plan and who authorised it.

Plan Decoder is not the Commission. This is a calm restatement plus the official English overview video.`,
  },
  {
    id: "nominees",
    group: "help",
    title: "Nominees, children, and supported decision-making",
    summary: "Someone can help you decide. That is different from someone deciding for you.",
    easy: "Help to decide is good. Taking over should only happen as much as needed.",
    tags: ["decision-making"],
    updated: "August 2026",
    official: [
      { label: "Nominees", url: "https://www.ndis.gov.au/applying/how-apply-using-access-request-form/nominees" },
    ],
    body: `A nominee can be appointed to make NDIS decisions with you or for you. It is a serious role and should be used only as much as needed.

Supported decision-making means people help you understand options and communicate a choice — your choice stays yours. This matches the UN Convention on the Rights of Persons with Disabilities (Australia is a party).

For children, parents and guardians already have a role. Young people should still be included in ways that match their age and communication.

If you disagree with a nominee arrangement, seek advocacy early. Cancelling some nominee appointments has a Participant Service Guarantee timeframe of 14 days.`,
  },
  {
    id: "other-systems",
    group: "plan",
    title: "What the NDIS does not fund (other systems)",
    summary: "Health, education, housing, and justice still have their own jobs. Gaps are not your fault.",
    easy: "The NDIS is not Medicare, school, or housing. Those systems still have duties.",
    tags: ["boundaries"],
    updated: "August 2026",
    official: [
      { label: "Reasonable and necessary", url: "https://www.ndis.gov.au/participants/creating-plan/understanding-plan-meeting/what-reasonable-and-necessary" },
    ],
    body: `The NDIS funds disability-related NDIS supports. It is not a replacement for:

• Medicare and public hospitals (clinical treatment)
• schools (curriculum and reasonable adjustments)
• public housing and homelessness services
• income support (Centrelink / Services Australia)
• child protection or justice systems

If the NDIA says “this is a health / education responsibility”, ask both systems to put their position in writing. Gaps between systems are common.

Foundational supports (outside individual NDIS plans) are being built by governments. They do not automatically replace an existing plan. Ask what actually exists in your area today.`,
  },
  {
    id: "psychosocial",
    group: "access",
    title: "Psychosocial disability and fluctuating days",
    summary: "Mental health can meet NDIS access. Fluctuating or episodic impact still counts.",
    easy: "Bad days and good days both matter. Write down the pattern, not only the best day.",
    tags: ["psychosocial", "fluctuation"],
    updated: "August 2026",
    official: [
      { label: "Disability requirements", url: "https://www.ndis.gov.au/applying/eligibility-requirements/what-are-ndis-disability-requirements" },
    ],
    body: `Psychosocial disability can meet the disability requirements when the impairment is likely to be permanent and it substantially reduces functional capacity.

The official disability-requirements page says periods of lesser impact or episodic changes are acceptable. Permanent does not mean “the same every day”.

Useful evidence describes:

• a typical week, not only a clinic day
• what happens without prompts or a known person
• recovery time after a hard day
• safety, self-care, leaving the house, and relationships

A diagnosis letter on its own is usually not enough. Function over time is the story.

You may also be connected to psychosocial supports outside the NDIS (for example, Medicare Better Access, state mental health). Those do not automatically replace NDIS disability supports.`,
  },
  {
    id: "dignity-risk",
    group: "safety",
    title: "Dignity of risk",
    summary: "Safety matters. So does the right to try, fail, and live a life you choose.",
    easy: "You can take ordinary life risks with the right support. Safety is not the only goal.",
    tags: ["everyday"],
    updated: "August 2026",
    official: [],
    body: `People with disability have the right to take risks that other adults take — with support that makes the risk reasonable.

A support that removes all choice “for safety” can still be the wrong support. Good evidence describes both:

• what keeps the person safe
• what helps them participate, learn, work, study, and have a life

Strengths belong in the same file as support needs. That is also how later needs assessments (I-CAN based) are described: strengths-based, not deficit-only.`,
  },
  {
    id: "advocacy",
    group: "help",
    title: "Advocates, interpreters, and Legal Aid",
    summary: "Independent advocates are free. Interpreters should be available. You do not have to do this alone.",
    easy: "You can get a free advocate. You can ask for an interpreter.",
    tags: ["advocacy", "help"],
    updated: "August 2026",
    official: [
      { label: "Ask Izzy advocacy finder", url: "https://askizzy.org.au/disability-advocacy" },
      { label: "NDIS Commission — get an advocate", url: "https://www.ndiscommission.gov.au/complaints/help-advocate" },
    ],
    body: `Independent disability advocates are not the NDIA and not your provider. They can help with access, planning, internal review, and ART applications.

Find one through the disability advocacy finder (Ask Izzy) or ask the NDIS Commission to help you find an advocate.

You can ask the NDIA and the Commission for an interpreter, including Auslan. Use the National Relay Service if you need it.

Legal Aid in your state or territory may help with ART matters. Community legal centres sometimes help with NDIS too.

Take a support person to meetings. You can ask for the agenda in writing. You can ask for a break.`,
  },
  {
    id: "continuity",
    group: "plan",
    title: "Continuity of support when a plan is due",
    summary: "The NDIA says plans are extended if they have not been reassessed before expiry. Supports should not just stop.",
    easy: "If your plan end date is close, you should still get support. Write down if someone says it will stop.",
    tags: ["plan", "timeframes"],
    updated: "August 2026",
    official: [
      { label: "Participant Service Guarantee", url: "https://www.ndis.gov.au/about-us/service-charter/participant-service-guarantee" },
    ],
    body: `The Participant Service Guarantee page (current as of 14 August 2026) says the NDIA’s check-in process starts before a scheduled reassessment, and that plans are extended automatically if they have not been reassessed before expiry so participants have continuity of support.

If someone tells you funding will “fall off a cliff” on the end date, ask them to put that in writing and check your myplace / PACE plan. Call 1800 800 110 and keep a note of the time, the person’s name, and what they said.

Still prepare early: a meeting brief, current evidence, and goals. Continuity is about not being cut off. It is not a reason to skip getting the next plan right.`,
  },
];

export const RIGHTS_DISCLAIMER =
  "General information about NDIS processes in Australia, checked against official pages in August 2026. It is not legal advice, not an NDIA decision, and not a guarantee of funding. Rules and start dates change. Read your letters, ndis.gov.au, or an independent advocate.";
