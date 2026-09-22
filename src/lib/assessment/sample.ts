import { uid } from "../utils";
import { ICF_ITEMS } from "../icf";
import { localReport } from "./report";
import { scoreAssessment } from "./scoring";
import type { AnswerVal, AssessmentDraft } from "./types";

export function makeSampleAssessment(clientId: string): AssessmentDraft {
  const answers: Record<string, AnswerVal> = {
    name: "Alex",
    respondent: "carer",
    ageBand: "18-24",
    ndisStatus: "participant",
    disabilityWords: "Autism and ADHD. Shutdowns after busy shops. Needs a known person for morning care.",
    "icf-length": "full",
    "h-interfere": 3,
    "h-days-unable": 9,
    "h-days-cut": 15,
    "need-selfCare-freq": 4,
    "need-selfCare-int": 3,
    "need-selfCare-note": "Dressing and medication prompts need a known worker every morning.",
    "need-community-freq": 3,
    "need-community-int": 3,
    "need-community-note": "Leaves the house only with 1:1 support. Crowds lead to a two-day shutdown.",
    "need-communication-freq": 2,
    "need-communication-int": 2,
    "need-domestic-freq": 3,
    "need-domestic-int": 3,
    "need-learning-freq": 3,
    "need-learning-int": 2,
    "need-generalTasks-freq": 4,
    "need-generalTasks-int": 3,
    "need-mental-freq": 3,
    "need-mental-int": 3,
    living: "family",
    "env-hours": "40plus",
    "env-location": "metro",
    "env-ifaway": "Morning routine stops. Meals are skipped. Cannot attend TAFE.",
    "perm-duration": "5plus",
    "perm-clinician": "yes",
    "perm-remedy": "no",
    "perm-fluctuate": "yes",
    "perm-evidence": ["gp", "allied", "school"],
    ndisFunctions: ["self-care", "social", "learning", "self-management"],
    "ms-why-ndis": "Health and education adjustments do not cover the morning routine or community access after shutdowns.",
  };

  const samplePerf: Record<string, number> = {
    d110: 2,
    d160: 3,
    d163: 3,
    d175: 3,
    d210: 3,
    d220: 4,
    d230: 3,
    d240: 3,
    d310: 1,
    d330: 2,
    d350: 2,
    d360: 1,
    d450: 0,
    d410: 1,
    d420: 1,
    d470: 3,
    d510: 3,
    d540: 3,
    d550: 1,
    d570: 3,
    d620: 3,
    d630: 4,
    d640: 3,
    d660: 2,
    d710: 2,
    d750: 3,
    d760: 1,
    d730: 3,
    d820: 3,
    d850: 3,
    d860: 2,
    d870: 2,
    d910: 3,
    d920: 2,
    d930: 1,
    d950: 2,
  };
  for (const item of ICF_ITEMS) {
    const p = samplePerf[item.id];
    if (p === undefined) continue;
    answers[`${item.id}-p`] = p;
    answers[`${item.id}-c`] = Math.max(0, p - 1);
  }

  const respondent = "carer";
  const score = scoreAssessment(respondent, answers);
  const id = uid("assess");
  const now = new Date().toISOString();
  const draft: AssessmentDraft = {
    id,
    clientId,
    createdAt: now,
    updatedAt: now,
    stepId: "review",
    respondent,
    answers,
    status: "complete",
    reportLocal: "",
    reportAi: "",
    score,
    unlocked: true,
  };
  draft.reportLocal = localReport(draft, score);
  return draft;
}
