import {
  blank,
  CHECKS,
  kindLabel,
  PAY_LABEL,
  PLAN_LABEL,
  ROLE_LABEL,
  UNIT_LABEL,
  type HireDraft,
  type PayHow,
  type PlanStyle,
  type PriceUnit,
  type Role,
  type YesNo,
} from "./model";

export type Section = { heading: string; body: string };

const CHECKED = "5 October 2026";

function yesNo(value: YesNo, yes: string, no: string, unsure: string) {
  if (value === "yes") return yes;
  if (value === "no") return no;
  if (value === "not-sure") return unsure;
  return "[not answered yet]";
}

function labelled<T extends string>(value: T, map: Record<string, string>, empty: string) {
  if (!value) return empty;
  return map[value] ?? empty;
}

export function agreementSections(draft: HireDraft): Section[] {
  const who = blank(draft.personName, "participant name");
  const provider = blank(draft.providerName, "provider or worker name");
  const role = labelled<Role>(draft.role, ROLE_LABEL, "[who is filling this in]");
  const priceBit = draft.quotedPrice.trim()
    ? `$${draft.quotedPrice.trim()} ${labelled<PriceUnit>(draft.priceUnit, UNIT_LABEL, "")}`.trim()
    : "[price, written down before the support starts]";

  return [
    {
      heading: "1. What this document is",
      body: [
        "This is a draft service agreement for the person and the provider to edit and sign together.",
        "It was filled in from notes typed on one device. Plan Decoder did not add facts.",
        "It is not an NDIA form, not legal advice, not a behaviour support plan, and not a specialist disability accommodation agreement.",
        "A written agreement is recommended each time you start with a new provider. In most cases it is not compulsory. It is required for specialist disability accommodation, and this draft does not cover that.",
        `Prepared ${CHECKED}. Check the current rules on ndis.gov.au before anyone signs.`,
      ].join("\n"),
    },
    {
      heading: "2. The people",
      body: [
        `Participant: ${who}`,
        `This draft was prepared by: ${role}`,
        draft.nomineeName.trim() ? `Support person or nominee named on this draft: ${draft.nomineeName.trim()}` : "Support person or nominee: [add a name if someone will sign or attend with you]",
        `NDIS number: ${draft.ndisNumber.trim() ? draft.ndisNumber.trim() : "[leave blank here and write it on the paper copy if you prefer]"}`,
        `Provider or worker: ${provider}`,
        `ABN: ${blank(draft.providerAbn, "ABN")}`,
        `Type of support: ${kindLabel(draft)}`,
        `NDIS registered: ${yesNo(draft.registered, "They told me they are registered.", "They told me they are not registered.", "I have not confirmed this yet.")}`,
        `How this part of the plan is managed: ${labelled<PlanStyle>(draft.planStyle, PLAN_LABEL, "[agency-managed, plan-managed, self-managed, or a mix]")}`,
      ].join("\n"),
    },
    {
      heading: "3. The support",
      body: [
        "The provider agrees to deliver only the support described here, in the way the participant directs, within safety.",
        "",
        "What they will do",
        blank(draft.tasks, "describe the tasks in your own words"),
        "",
        "Where",
        blank(draft.where, "home, community, clinic, or transport"),
        "",
        "How often",
        blank(draft.howOften, "days, times, and how long"),
        "",
        `Starts: ${blank(draft.startDate, "start date")}`,
        `Ends or is reviewed: ${blank(draft.endDate, "end date or review date")}`,
        "",
        "What the participant wants this support to help with, in their words",
        blank(draft.goals, "optional: your own words about what you want to be able to do"),
      ].join("\n"),
    },
    {
      heading: "4. Price and payment",
      body: [
        `Quoted price: ${priceBit}`,
        `GST: ${yesNo(draft.gst, "The quote says GST is included or added. Check the invoice.", "The quote says no GST.", "Ask whether GST applies before you agree.")}`,
        "Many NDIS supports supplied against a plan are GST-free when the tax rules are met. This draft does not decide that.",
        "",
        "Travel or other charges",
        blank(draft.travel, "say none, or write the travel or non-face-to-face charge you were told"),
        "",
        `How it is paid: ${labelled<PayHow>(draft.payHow, PAY_LABEL, "[who pays the invoice]")}`,
        "",
        "The price limit on ndis.gov.au is a maximum, not the price you must accept. You can ask for less.",
        "Agency-managed supports must be delivered by a registered provider, and the price must not go over the current price limit.",
        "If a plan manager pays, they also have to follow the price limits, including when the provider is not registered.",
        "Anyone paid from an NDIS plan must follow the NDIS Code of Conduct, registered or not.",
        "Ask which support they will claim against, in writing, before the first shift. If they cannot name it, do not agree yet.",
      ].join("\n"),
    },
    {
      heading: "5. If a shift is cancelled",
      body: [
        "If the participant cancels",
        blank(draft.cancelNotice, "write the notice period they offered, then check it against the current pricing arrangements"),
        "",
        "If the provider cancels",
        blank(draft.providerCancel, "write what they will do if they cancel, including a replacement worker"),
        "",
        "A cancellation fee should be written here before anyone signs. Where the NDIS pricing arrangements apply, a provider should not use a harsher rule than those arrangements allow.",
        "As at the 2025-26 pricing arrangements, short notice was often less than 7 days for many disability support worker supports, and less than 2 clear business days for many other supports. The provider also had to be unable to find other billable work. Details can change. Read the current pricing arrangements on ndis.gov.au before you agree to a fee.",
      ].join("\n"),
    },
    {
      heading: "6. Responsibilities",
      body: [
        `${provider} will:`,
        "- Follow the NDIS Code of Conduct.",
        "- Send workers who are suited to the work, and screened where a screening check is required.",
        "- Respect the participant's decisions, home, privacy, and routines.",
        "- Not pressure the participant to sign, to buy extra services, or to give gifts or loans.",
        "- Give invoices that match the support that actually happened.",
        "- Tell the participant about any conflict of interest, including if the organisation benefits from a referral.",
        "",
        `${who} will:`,
        "- Give the notice in this agreement when a shift needs to change, when they can.",
        "- Treat workers with respect.",
        "- Say if the support is not what was agreed.",
        "",
        "The participant can ask for a different worker without giving a reason. Saying no to a support does not, by itself, put a plan at risk.",
      ].join("\n"),
    },
    {
      heading: "7. Privacy",
      body: [
        "The provider collects only what they need to deliver this support.",
        "The participant agrees to share only the following:",
        blank(draft.shareWhat, "for example: first name, support tasks, and the parts of the plan that relate to this service. Not the whole plan unless you choose to"),
        "",
        "The participant can ask for a copy of notes or reports about them. They can withdraw consent for extra sharing. The provider confirms that withdrawal in writing.",
      ].join("\n"),
    },
    {
      heading: "8. Complaints",
      body: [
        "First step, if it feels safe: talk to the provider.",
        `Provider contact for a complaint: ${blank(draft.complaintsContact, "name, phone, or email")}`,
        "The participant can also contact the NDIS Quality and Safeguards Commission on 1800 035 544. They can ask to be anonymous.",
        "If someone is in danger now, call 000.",
        "Free advocacy is separate from the provider: disabilityadvocacyfinder.dss.gov.au",
      ].join("\n"),
    },
    {
      heading: "9. Changes and ending",
      body: [
        "Changes to this agreement are agreed by both people and written down. A text or email is enough if both can use it.",
        `Either person can end the agreement with this notice: ${blank(draft.endNotice, "for example, 14 days, or the notice in their service terms")}`,
        "Ending the agreement does not stop the participant from using other providers. The provider helps with a calm handover of anything the participant asks to be passed on, and nothing more.",
        "The participant keeps a copy of the signed agreement.",
      ].join("\n"),
    },
    {
      heading: "10. Checks before signing",
      body: [
        "These boxes were ticked by the person on this device. A tick is a reminder, not a clearance.",
        "",
        ...CHECKS.map((item) => `${draft.checks[item.id] ? "[x]" : "[ ]"} ${item.label}`),
      ].join("\n"),
    },
    {
      heading: "11. Signatures",
      body: [
        "Do not sign until you have read this, asked your questions, and checked the price and cancellation rule against the current information on ndis.gov.au.",
        "",
        "Participant or nominee",
        "Name: ______________________________",
        "Signature: _________________________  Date: ______________",
        "",
        "Provider",
        "Name: ______________________________",
        "Signature: _________________________  Date: ______________",
        "",
        "Draft for you to edit. Not an NDIA decision. Not a clinical report. Not a guarantee of funding. Not an NDIS support, and not payable from a plan.",
      ].join("\n"),
    },
  ];
}

export function guideSections(): Section[] {
  return [
    {
      heading: "What this guide is",
      body: [
        "This is general information to help you prepare before you hire a support worker or another professional with NDIS funding.",
        "It is not legal advice, not an assessment, and not an NDIS decision. Plan Decoder is independent. It is not the NDIA, the NDIS Commission, or the Australian Government.",
        "No wording here promises funding or says a provider is safe. Rules change. Check ndis.gov.au before you sign.",
        `Last checked against public NDIA and NDIS Commission information: ${CHECKED}.`,
      ].join("\n"),
    },
    {
      heading: "A service agreement, in plain words",
      body: [
        "A service agreement is what you and a provider write down: what they will do, when, where, what it costs, and how either of you can stop.",
        "The NDIA recommends a written agreement each time you start with a new provider. In most cases you are not forced to have one. You do not have to sign on the spot.",
        "A written agreement is required for specialist disability accommodation. This guide does not cover SDA.",
        "Making one is a negotiation. You can bring a support person. You can ask for plain language, extra time, and a copy to take away.",
        "You can say: \"I'd like to think about it before signing. Please email me the agreement.\"",
      ].join("\n"),
    },
    {
      heading: "Who you can hire depends on how the plan is managed",
      body: [
        "Agency-managed: the NDIA pays the provider. The provider must be NDIS registered. The price must not go over the current price limit.",
        "Plan-managed: a plan manager pays the invoices. You can use registered or unregistered providers. The plan manager still has to follow the price limits.",
        "Self-managed: you have the most choice and the most paperwork. You pay providers in the way the NDIA sets out, then claim. Anyone paid from the plan still has to follow the NDIS Code of Conduct.",
        "You can use a mix. If you are not sure which part of the plan pays for this support, check the plan or ask your plan manager, LAC, or support coordinator before you agree a price.",
      ].join("\n"),
    },
    {
      heading: "Support worker, therapist, or someone else",
      body: [
        "A support worker helps with day-to-day tasks you agree, such as personal care, meals, or getting out.",
        "An allied health professional is a trained clinician, such as an occupational therapist, physiotherapist, speech pathologist, or psychologist. Ask which profession they are registered in.",
        "A support coordinator, if one is funded, helps you find and set up supports. They should help you compare options, not only steer you to their own company.",
        "A plan manager pays invoices. They do not decide what support you need.",
        "Household help and transport are different supports. Ask which budget they will claim from, in writing.",
        "This is not a behaviour support plan. Behaviour support and restrictive practices have extra rules. If that is what you need, ask a registered specialist behaviour support practitioner.",
      ].join("\n"),
    },
    {
      heading: "What to ask before the first shift",
      body: [
        "Ask these out loud, and ask for the answers in the agreement.",
        "- What exactly will you do, and what will you not do?",
        "- Which days, what times, and where?",
        "- Who is the actual worker? Can I ask for a different worker?",
        "- Are you NDIS registered?",
        "- What is your ABN?",
        "- Do you, and the workers who come to me, hold a current NDIS Worker Screening Check where one is required?",
        "- What insurance do you hold?",
        "- What is the price? Is GST included? Is it at or under the current NDIS price limit?",
        "- What do you charge for travel, or for time that is not face to face?",
        "- How much notice if I cancel? How much notice if you cancel?",
        "- How do I end this?",
        "- How do I complain, including to the NDIS Commission?",
        "- Do you or your organisation get a benefit if I choose another service you own?",
        "- Will I get a copy of notes written about me?",
      ].join("\n"),
    },
    {
      heading: "Money",
      body: [
        "Price limits are maximums, not the price you have to accept. You can ask for a lower price.",
        "Get the price in writing before the support starts.",
        "Ask which support type they will claim. If they cannot name it, wait.",
        "Check each invoice against what actually happened. You can say: \"This invoice does not match the support I received. Please correct it before it is paid.\"",
        "Do not pay from your own pocket for an NDIS support unless you understand how you will be reimbursed.",
        "Fair pricing also matters. A provider should not charge an NDIS participant more than another customer for the same thing without a fair reason. The NDIS Commission explains this on its fair pricing page.",
        "Preparation tools, apps, and private memberships are not NDIS supports. They cannot be paid from plan funding.",
      ].join("\n"),
    },
    {
      heading: "Cancellation",
      body: [
        "Put the cancellation rule in the agreement in words you understand.",
        "Where the pricing arrangements apply, a provider should not use a harsher rule than those arrangements allow.",
        "As at the 2025-26 pricing arrangements, short notice was often less than 7 days for many disability support worker supports, and less than 2 clear business days for many other supports, such as therapy. The provider also had to be unable to find other billable work. A 2026-27 pricing determination is in place and claiming guidance can be updated. Read the current page on ndis.gov.au before you agree to a fee.",
        "If they say \"24 hours or you pay the full shift\" and that is harsher than the current rule, ask them to change it.",
        "Also ask what happens when they cancel on you.",
      ].join("\n"),
    },
    {
      heading: "Your choice and control",
      body: [
        "You choose your providers. You can change them. You do not have to justify asking for a different worker.",
        "Saying no to a support does not, by itself, put your plan at risk.",
        "No one should pressure you to sign, to take extra services, or to give gifts or loans. High-pressure selling is a Code of Conduct problem.",
        "Within safety, workers should follow your routines, your home, and your preferences.",
        "You can say: \"This isn't working for me. I'm giving notice. My last day of service will be [date].\"",
        "You can say: \"I'd prefer a different worker. Please arrange that for future shifts.\"",
      ].join("\n"),
    },
    {
      heading: "Safety, privacy, and respect",
      body: [
        "Every NDIS provider and worker, registered or not, must follow the NDIS Code of Conduct.",
        "They must respect your decisions and your privacy, work safely and honestly, and never be violent, abusive, neglectful, exploitative, or sexual toward you while they are paid to support you.",
        "None of that is okay on a bad day, or because a worker is stressed.",
        "If you are in danger now, call 000.",
        "To raise a concern, tell the provider if you feel safe to do so. You can contact the NDIS Commission on 1800 035 544 and ask to be anonymous.",
        "Save that number before you need it.",
        "You do not have to share your whole plan. You can share only the parts that relate to the service.",
        "Free advocacy is separate from your provider. Find one at disabilityadvocacyfinder.dss.gov.au.",
        "NDIA contact: 1800 800 110.",
      ].join("\n"),
    },
    {
      heading: "What to keep, and where this draft lives",
      body: [
        "Keep the signed agreement, invoices, and messages about cancellations or changes.",
        "This tool saves a draft in this browser only. Nothing is uploaded. Clearing site data deletes the draft.",
        "Downloading the PDF is how a copy leaves the screen. If you do not want your NDIS number saved on this device, leave that box blank and write it on the paper copy.",
        "Read the draft before you share it. Take out anything you do not want a provider to see.",
      ].join("\n"),
    },
    {
      heading: "Where to check",
      body: [
        "- Service agreements: ndis.gov.au (search \"what is a service agreement\")",
        "- Pricing arrangements and price limits: ndis.gov.au",
        "- NDIS Code of Conduct and fair pricing: ndiscommission.gov.au",
        "- NDIS Commission complaints: 1800 035 544",
        "- NDIA: 1800 800 110",
        "- Disability Advocacy Finder: disabilityadvocacyfinder.dss.gov.au",
        "- Emergency: 000",
      ].join("\n"),
    },
  ];
}
