import { WHODAS_ITEMS, descriptor, scoreWhodas } from "../whodas";
import { DOMAINS } from "../content/language";
import type {
  AnswerVal,
  AssessmentScore,
  EligibilityBand,
  FundingBand,
  Gap,
  Inconsistency,
  NeedDomainId,
  Respondent,
  SupportIdea,
} from "./types";
import { NEED_DOMAINS, WHODAS12_IDS, visibleScreens } from "./screens";

const num = (v: AnswerVal) => (typeof v === "number" ? v : null);
const str = (v: AnswerVal) => (typeof v === "string" ? v : "");
const list = (v: AnswerVal) => (Array.isArray(v) ? v : []);

function supportPair(answers: Record<string, AnswerVal>, id: NeedDomainId) {
  const freq = num(answers[`need-${id}-freq`]);
  const intensity = num(answers[`need-${id}-int`]);
  if (freq === null && intensity === null) return null;
  const f = freq ?? 0;
  const i = intensity ?? 0;
  const answered = (freq !== null ? 1 : 0) + (intensity !== null ? 1 : 0);
  const score = ((f + i) / 8) * 10;
  return { freq: f, intensity: i, score, answered };
}

function supportWord(score: number) {
  if (score < 1.5) return "Little extra support recorded";
  if (score < 3.5) return "Occasional or prompting-level support";
  if (score < 5.5) return "Regular support in this area";
  if (score < 7.5) return "Substantial support";
  return "Very high / pervasive support recorded";
}

function fundingBand(overall: number, overnight: string, living: string): FundingBand {
  const silHint =
    overnight === "yes" || living === "supported"
      ? " Higher overnight or accommodation supports, when they occur in real life, sit in a much wider public range and are decided case by case."
      : "";
  if (overall < 2) {
    return {
      id: "low",
      label: "Lower recorded support intensity",
      range: "Often discussed in public reporting as smaller plans, roughly $0–$20,000, or mainly mainstream supports.",
      note:
        "This band is an illustration from your ticks, not a quote." + silHint,
    };
  }
  if (overall < 4) {
    return {
      id: "moderate-low",
      label: "Mild to moderate recorded support intensity",
      range: "Public conversation about similar day-to-day support often mentions plans in the $15,000–$45,000 area.",
      note: "Wide variation. Not your budget." + silHint,
    };
  }
  if (overall < 6) {
    return {
      id: "moderate",
      label: "Moderate recorded support intensity",
      range: "Public averages for many NDIS plans sit somewhere around the $40,000–$90,000 area. Individuals differ a lot.",
      note: "Averages are not a quote. Capital items and coordination sit on top of daily support." + silHint,
    };
  }
  if (overall < 8) {
    return {
      id: "high",
      label: "High recorded support intensity",
      range: "People describing substantial daily support sometimes have published plan sizes from about $80,000 into the low hundreds of thousands.",
      note: "This is not a prediction. Home and living supports change the picture completely." + silHint,
    };
  }
  return {
    id: "very-high",
    label: "Very high recorded support intensity",
    range:
      "Very high daily support, including some home and living arrangements, is publicly associated with six-figure plans. Figures over $200,000 exist in published data for a minority of participants.",
    note: "Plan Decoder cannot estimate a SIL or 24-hour package. That is an NDIA decision with extra evidence." + silHint,
  };
}

function mapWhodasToNdis(domain: string): string[] {
  if (domain === "cognition") return ["learning", "communication", "self-management"];
  if (domain === "mobility") return ["mobility"];
  if (domain === "selfCare") return ["self-care"];
  if (domain === "gettingAlong") return ["social", "communication"];
  if (domain === "lifeActivities") return ["self-management", "learning"];
  if (domain === "participation") return ["social"];
  return [];
}

function mapNeedToNdis(id: NeedDomainId): string[] {
  const row = NEED_DOMAINS.find((d) => d.id === id);
  if (!row) return [];
  const key =
    row.ndis === "self-care"
      ? "self-care"
      : row.ndis === "self-management"
        ? "self-management"
        : row.ndis === "social interaction"
          ? "social"
          : row.ndis;
  return [key];
}

export function scoreAssessment(
  respondent: Respondent,
  answers: Record<string, AnswerVal>,
): AssessmentScore {
  const screens = visibleScreens(respondent, answers);
  const askedIds = screens.flatMap((s) => s.fields.filter((f) => !f.optional).map((f) => f.id));
  const answeredCount = askedIds.filter((id) => {
    const v = answers[id];
    if (v === null || v === undefined || v === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  }).length;

  const whodasItems: Record<string, number | null> = {};
  for (const item of WHODAS_ITEMS) {
    const v = num(answers[item.id]);
    if (v !== null) whodasItems[item.id] = v;
  }
  const short = answers["whodas-length"] === "short";
  if (short) {
    for (const item of WHODAS_ITEMS) {
      if (!WHODAS12_IDS.includes(item.id)) delete whodasItems[item.id];
    }
  }
  const w = scoreWhodas(whodasItems);
  const whodasDomains = w.domains.map((d) => ({
    id: d.domain,
    title: DOMAINS.find((x) => x.id === d.domain)?.title ?? d.domain,
    avg: d.avg,
    descriptor: d.answered ? descriptor(d.avg) : "Not answered",
    answered: d.answered,
  }));

  const supportDomains = NEED_DOMAINS.map((d) => {
    const pair = supportPair(answers, d.id);
    return {
      id: d.id,
      title: d.title,
      avg: pair ? pair.score / 2.5 : 0,
      support: pair ? Math.round(pair.score * 10) / 10 : 0,
      descriptor: pair ? supportWord(pair.score) : "Skipped",
      answered: pair ? pair.answered : 0,
    };
  });
  const supportAnswered = supportDomains.filter((d) => d.answered);
  const supportOverall = supportAnswered.length
    ? supportAnswered.reduce((a, b) => a + (b.support ?? 0), 0) / supportAnswered.length
    : 0;

  const ndisKeys = [
    { id: "communication", title: "Communication" },
    { id: "social", title: "Social interaction" },
    { id: "learning", title: "Learning" },
    { id: "mobility", title: "Mobility" },
    { id: "self-care", title: "Self-care" },
    { id: "self-management", title: "Self-management" },
  ];
  const ticked = list(answers.ndisFunctions);
  const ndisFunction = ndisKeys.map((k) => {
    const fromTick = ticked.includes(k.id) ? 1 : 0;
    const fromWho = w.domains
      .filter((d) => mapWhodasToNdis(d.domain).includes(k.id) && d.answered)
      .map((d) => d.avg);
    const fromNeed = NEED_DOMAINS.filter((d) => mapNeedToNdis(d.id).includes(k.id))
      .map((d) => supportPair(answers, d.id)?.score ?? null)
      .filter((n): n is number => n !== null)
      .map((n) => (n / 10) * 4);
    const pool = [...fromWho, ...fromNeed];
    const score = pool.length ? pool.reduce((a, b) => a + b, 0) / pool.length : fromTick * 2;
    let level = "Not enough answers";
    if (pool.length || fromTick) {
      if (score >= 2.5 || fromTick) level = score >= 3.2 ? "Marked reduction in these answers" : "Noticeable reduction in these answers";
      else if (score >= 1.5) level = "Some reduction in these answers";
      else level = "Little reduction recorded";
    }
    return { id: k.id, title: k.title, level, score: Math.round(score * 100) / 100 };
  });

  const permIndicators: string[] = [];
  const permCautions: string[] = [];
  const duration = str(answers["perm-duration"]);
  if (duration === "5plus" || duration === "2-5y") {
    permIndicators.push("You recorded that the main impairment has been present for a long time.");
  } else if (duration === "under6m") {
    permCautions.push("Short duration was recorded. Permanency conversations often look at whether this is likely to continue.");
  }
  if (str(answers["perm-clinician"]) === "yes") {
    permIndicators.push("You said a treating professional has already described this as likely ongoing.");
  } else if (str(answers["perm-clinician"]) === "no" || str(answers["perm-clinician"]) === "unsure") {
    permCautions.push("A clear clinician view on whether this is likely ongoing was not recorded. That is a common evidence gap.");
  }
  if (str(answers["perm-remedy"]) === "no") {
    permIndicators.push("You recorded that, as you understand it, treatment is not expected to fully reverse the impairment.");
  } else if (str(answers["perm-remedy"]) === "yes") {
    permCautions.push("You recorded that a treatment might fully reverse the impairment. NDIS access talks about permanency after available treatment. This is for a clinician to explain — not Plan Decoder.");
  }
  if (str(answers["perm-fluctuate"]) === "yes") {
    permIndicators.push("Function was recorded as fluctuating. Typical and hard days both matter; a good-day snapshot can understate support needs.");
  }
  const evidence = list(answers["perm-evidence"]);
  if (evidence.includes("none") || evidence.length === 0) {
    permCautions.push("Little written evidence was listed. A GP or allied health letter in functional language is often the next practical step.");
  }

  const gaps: Gap[] = [];
  const inconsistencies: Inconsistency[] = [];

  if (!str(answers.disabilityWords)) {
    gaps.push({
      severity: "info",
      title: "No description in your own words",
      detail: "A short description using the words you already use with a doctor helps a GP letter match your life.",
    });
  }
  if (w.answered < 6) {
    gaps.push({
      severity: "watch",
      title: "Few function items answered",
      detail: "The WHODAS-inspired snapshot is thin. Completing more items (or the 12-item set) gives a clearer picture to take to a clinician.",
    });
  }
  if (supportAnswered.length < 4 && str(answers["needs-ready"]) !== "later") {
    gaps.push({
      severity: "watch",
      title: "Support-needs rehearsal incomplete",
      detail: "Several life areas were skipped. Skipping is fine if they do not apply. If they do apply, a sentence of example helps more than a blank.",
    });
  }
  if (!str(answers["env-ifaway"])) {
    gaps.push({
      severity: "important",
      title: "What happens if informal support is away",
      detail: "Assessors and planners often ask this. If a parent or carer is the only support, say what actually happens when they are sick.",
    });
  }
  if (str(answers.living) === "alone" && (supportPair(answers, "selfCare")?.score ?? 0) >= 6) {
    gaps.push({
      severity: "important",
      title: "High self-care support and living alone",
      detail: "These answers together raise a safety and informal-support question. Spell out who steps in, and what has gone wrong when no one does.",
    });
  }
  if (str(answers["ms-why-ndis"]).length < 8 && (str(answers.ndisStatus) === "applying" || str(answers.ndisStatus) === "curious")) {
    gaps.push({
      severity: "important",
      title: "Mainstream supports not yet explained",
      detail: "Access conversations often ask what health, education, housing or family systems already do, and what still does not happen.",
    });
  }
  if (str(answers.ageBand) === "65plus" && str(answers.ndisStatus) !== "participant") {
    gaps.push({
      severity: "important",
      title: "Age and access",
      detail: "NDIS access is generally before age 65. If this is a new request, a local aged-care or advocacy service may be the first call. This is general information, not advice for your case.",
    });
  }
  const extremeWho = WHODAS_ITEMS.filter((i) => num(answers[i.id]) === 4);
  if (extremeWho.length >= 3) {
    gaps.push({
      severity: "info",
      title: "Several “extreme / cannot do” ratings",
      detail: "A one-line example for each (what happens, how often) makes those ratings usable for a doctor. Plan Decoder will not change your ticks.",
    });
  }

  for (const d of NEED_DOMAINS) {
    const pair = supportPair(answers, d.id);
    if (!pair) continue;
    const whoDomains = w.domains.filter((x) => mapNeedToNdis(d.id).some((n) => mapWhodasToNdis(x.domain).includes(n)));
    const whoAvg =
      whoDomains.filter((x) => x.answered).reduce((a, b) => a + b.avg, 0) /
      Math.max(1, whoDomains.filter((x) => x.answered).length);
    if (whoDomains.some((x) => x.answered) && Math.abs(whoAvg / 4 * 10 - pair.score) >= 4.5) {
      inconsistencies.push({
        title: `${d.title}: function and support ticks sit far apart`,
        detail: `WHODAS-inspired average in related areas is ${whoAvg.toFixed(1)} / 4, while the support rehearsal is ${pair.score.toFixed(1)} / 10. That can be true (for example equipment hides difficulty). A sentence of context will help a clinician.`,
      });
    }
  }
  if (str(answers["perm-fluctuate"]) === "no" && num(answers["h-days-unable"]) && (num(answers["h-days-unable"]) as number) >= 12) {
    inconsistencies.push({
      title: "Many days unable, but “does not fluctuate”",
      detail: "A high count of days unable often means some days are much harder. You may want to describe a typical week and a hard week.",
    });
  }

  const why: string[] = [];
  const reduced = ndisFunction.filter((n) => n.level.startsWith("Marked") || n.level.startsWith("Noticeable"));
  if (reduced.length) {
    why.push(`These answers describe reduced function in: ${reduced.map((n) => n.title).join(", ")}.`);
  } else {
    why.push("These answers do not yet show substantially reduced function across the six NDIS access areas. That may be incomplete answers, a good-day snapshot, or a life that is mainly managed another way.");
  }
  if (permIndicators.length) why.push(...permIndicators);
  if (str(answers["ms-why-ndis"])) why.push("You described daily life tasks that still do not happen after other systems.");
  if (str(answers.ageBand) === "65plus") why.push("Age band 65+ was recorded — access rules differ.");

  let band: EligibilityBand = "mixed";
  const strong =
    reduced.filter((n) => n.level.startsWith("Marked")).length >= 1 &&
    permIndicators.length >= 2 &&
    str(answers.ageBand) !== "65plus";
  const weak =
    reduced.length === 0 ||
    (permCautions.length >= 2 && permIndicators.length === 0);
  if (strong) band = "many";
  else if (weak) band = "few";

  const supports: SupportIdea[] = [];
  const pushIf = (cond: boolean, idea: SupportIdea) => {
    if (cond) supports.push(idea);
  };
  pushIf((supportPair(answers, "selfCare")?.score ?? 0) >= 3 || (w.domains.find((d) => d.domain === "selfCare")?.avg ?? 0) >= 1.5, {
    area: "Daily life",
    ideas: ["Assistance with daily life at home", "Support worker for personal care or mealtime", "Capacity-building occupational therapy for routines"],
    caveat: "Hours are not calculated here. Informal support already in the home changes what is reasonable.",
  });
  pushIf((supportPair(answers, "community")?.score ?? 0) >= 3 || (w.domains.find((d) => d.domain === "participation")?.avg ?? 0) >= 1.5, {
    area: "Community",
    ideas: ["Community participation support", "Support with transport to a known activity", "A predictable worker rather than rotating strangers"],
    caveat: "Community access is not a taxi replacement for ordinary travel if other transport systems apply.",
  });
  pushIf((supportPair(answers, "communication")?.score ?? 0) >= 3, {
    area: "Communication",
    ideas: ["Speech pathology (capacity building)", "Communication devices or apps already used or needed", "A known communication partner in paid support"],
    caveat: "Health-funded therapy and NDIS capacity building can overlap. A clinician should say which is which.",
  });
  pushIf((supportPair(answers, "mobility")?.score ?? 0) >= 3 || (w.domains.find((d) => d.domain === "mobility")?.avg ?? 0) >= 1.5, {
    area: "Mobility and equipment",
    ideas: ["Assistive technology assessment", "Support to leave the house", "Home access (ramps, bathroom) if the home itself is the barrier"],
    caveat: "Home modifications and higher-cost AT usually need extra evidence. This rehearsal is not that assessment.",
  });
  pushIf((supportPair(answers, "mental")?.score ?? 0) >= 4 || (supportPair(answers, "behaviour")?.score ?? 0) >= 4, {
    area: "Regulation and safety",
    ideas: ["Psychology or counselling where it is disability-related daily support, not acute mental health treatment", "A behaviour support practitioner if there is risk of harm — only with proper consent and safeguards"],
    caveat: "Acute mental health care is a health-system responsibility. Plan Decoder will not recommend restrictive practices.",
  });
  pushIf((supportPair(answers, "lifelong")?.score ?? 0) >= 3, {
    area: "Work and study",
    ideas: ["Support to attend TAFE or a disability employment pathway", "School collaboration notes if the person is a student"],
    caveat: "Education adjustments are first a school/TAFE duty.",
  });
  if (!supports.length) {
    supports.push({
      area: "General",
      ideas: ["A GP letter in functional language", "A diary of a typical week and a hard week", "One allied health report that describes support, not just diagnosis"],
      caveat: "No specific NDIS line items are suggested because support-need answers were light.",
    });
  }

  return {
    whodas: {
      avgOverall: w.avgOverall,
      descriptor: w.answered ? descriptor(w.avgOverall) : "Not scored",
      simple100: w.simple100,
      answered: w.answered,
      domains: whodasDomains,
    },
    support: {
      overall: Math.round(supportOverall * 10) / 10,
      descriptor: supportAnswered.length ? supportWord(supportOverall) : "Not scored",
      domains: supportDomains,
    },
    ndisFunction,
    permanency: { indicators: permIndicators, cautions: permCautions },
    environment: {
      informalHours: str(answers["env-hours"]),
      living: str(answers.living),
      location: str(answers["env-location"]),
      ifCarerAway: str(answers["env-ifaway"]),
    },
    eligibilityBand: band,
    eligibilityWhy: why,
    funding: fundingBand(supportOverall, str(answers["cx-overnight"]), str(answers.living)),
    supports,
    gaps,
    inconsistencies,
    answered: answeredCount,
    totalAsked: askedIds.length,
  };
}

export const BAND_COPY: Record<EligibilityBand, { title: string; body: string }> = {
  few: {
    title: "Fewer practice indicators in these answers",
    body: "Based only on what was ticked, this rehearsal does not yet look like a strong match for the publicly described NDIS disability requirements. That can mean the person does not need NDIS, or that answers are incomplete, or that a good-day snapshot hid the hard days. It is not a refusal and not advice to stay away from applying.",
  },
  mixed: {
    title: "Mixed practice indicators",
    body: "Some answers point to reduced daily function or ongoing impairment; others are thin, skipped, or still sitting with mainstream systems. A clinician and, if you apply, the NDIA, would still decide. Use the gap list. Do not treat this as a yellow or green light.",
  },
  many: {
    title: "Many practice indicators — still not a decision",
    body: "These answers describe ongoing impairment and substantially reduced function in at least one access area, in the person’s own report. That is not eligibility. The NDIA uses its own assessors, evidence rules, and legislation. This document is rehearsal notes for you and a treating professional.",
  },
};
