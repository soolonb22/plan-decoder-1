export type Script = {
  id: string;
  title: string;
  category: string;
  when: string;
  body: string;
};

export const SCRIPT_LIBRARY: Script[] = [
  {
    id: "planner-opening",
    title: "Opening a planning meeting",
    category: "Planning meeting",
    when: "Start of a plan meeting when you feel rushed or unheard",
    body: `Thank you for meeting with us. I have prepared a short list of functional impacts, what a typical week looks like, and the supports we are asking for. I would like to go through those one at a time. If we run out of time, I would like a written follow-up of what was agreed and what is still outstanding.`,
  },
  {
    id: "not-just-bad-day",
    title: "When someone says ‘but they can do it sometimes’",
    category: "Planning meeting",
    when: "Fluctuating disability is being treated as inconsistency or motivation",
    body: `Yes, there are days when this looks easier. Those days are not the baseline. Over the last [time period], the hard days happened [how often], lasted [how long], and meant [what was missed]. Supports need to work on the hard days, not only the best days. I can show the fluctuation log if that helps.`,
  },
  {
    id: "informal-support",
    title: "Informal support is at capacity",
    category: "Carer / family",
    when: "The plan assumes family can keep doing unpaid work that is not sustainable",
    body: `Our family will keep being family. That is different from being an unpaid disability workforce. At the moment informal support is [hours / nights / tasks]. That has led to [impact on carer health, work, other children]. If this level continues, the risk is [breakdown / hospital / housing stress]. We are asking the NDIS to fund the disability-related hours, not to replace love.`,
  },
  {
    id: "school-adjustments",
    title: "School meeting — NDIS and education",
    category: "School",
    when: "A school says ‘that’s an NDIS issue’ or the NDIA says ‘that’s a school issue’",
    body: `We want a clear split, in writing. The school is responsible for reasonable adjustments so [name] can access education. The NDIS is responsible for disability supports that are not the school’s job — for example personal care, specialist equipment used across life, or therapy that is not curriculum. Today we need both systems to say what they will do, and by when, so [name] is not left in the gap.`,
  },
  {
    id: "review-request",
    title: "Requesting an internal review",
    category: "Reviews",
    when: "You received a decision you disagree with",
    body: `I am requesting an internal review of the decision dated [date], reference [number]. I disagree with [the specific decision]. The reasons are: [short list of functional facts]. I attach [evidence list]. Please confirm in writing that this request has been received, the date it was received, and the timeframe for the review. I can be contacted at [email / phone].`,
  },
  {
    id: "change-circ",
    title: "Change of circumstances letter",
    category: "Reviews",
    when: "Something significant has changed since the plan was written",
    body: `I am writing because there has been a significant change of circumstances for [name], NDIS number [number], since the current plan started on [date].

What changed: [plain facts].
When: [date].
Impact on daily function: [what is different in self-care, safety, community, family].
What we are asking: [supports / hours / item], because [link to disability].
What happens if the plan stays the same: [risk].

Please advise the next step and timeframe in writing.`,
  },
  {
    id: "provider-not-working",
    title: "Changing a provider calmly",
    category: "Providers",
    when: "A support is not safe, not reliable, or not a good fit",
    body: `I am giving notice that we will stop using [service] from [date], as allowed under our service agreement. This is about fit and reliability, not a personal attack. Please send a final invoice and return any of our documents. We will arrange a handover note so the next worker has what they need.`,
  },
  {
    id: "allied-health-brief",
    title: "Briefing an allied health clinician",
    category: "Appointments",
    when: "You need a report that actually talks about function",
    body: `Thank you for seeing [name]. For NDIS purposes we need functional language, not only diagnosis. Could the report cover: typical vs worst week; the six life areas (thinking and communicating, moving, self-care, relationships, daily tasks, community); what support is needed, how often, and what happens without it; and any risks if support is reduced. We are not asking you to guarantee funding.`,
  },
  {
    id: "psychosocial",
    title: "Describing psychosocial disability",
    category: "Psychosocial",
    when: "People hear ‘mental health’ and stop at treatment",
    body: `This is not only a health issue. The mental health system treats the illness. The disability is what remains in daily life: initiating tasks, leaving the house, managing relationships, recovering after contact, and staying safe. Those functional impacts are why NDIS supports are needed alongside treatment.`,
  },
  {
    id: "silence-is-ok",
    title: "If you need a pause in a meeting",
    category: "Meetings",
    when: "The meeting is going too fast or you are shutting down",
    body: `I need a short pause. I want to answer this properly, and I cannot do that if we keep going at this speed. Could we take five minutes, or come back to this question after the next item? I can also send a written answer today.`,
  },
];
