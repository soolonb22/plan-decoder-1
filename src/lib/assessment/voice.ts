import type { Respondent } from "./types";

export const RESPONDENTS: {
  id: Respondent;
  label: string;
  blurb: string;
  easy: string;
}[] = [
  {
    id: "participant",
    label: "I am the person this is about",
    blurb: "Questions will say “you”.",
    easy: "About me.",
  },
  {
    id: "parent",
    label: "I am a parent or guardian",
    blurb: "Questions will say “your child”. Use this for a young person, or an adult child you support.",
    easy: "I am the parent.",
  },
  {
    id: "carer",
    label: "I am a carer or family member",
    blurb: "Questions will say “the person you support”.",
    easy: "I am the carer.",
  },
  {
    id: "nominee",
    label: "I am a nominee",
    blurb: "NDIS nominee, correspondence nominee, or plan nominee answering for the participant.",
    easy: "I am the nominee.",
  },
  {
    id: "professional",
    label: "I am a professional helping someone practise",
    blurb: "Coordinator, coach, clinician, or school staff. You still need consent.",
    easy: "I am helping professionally.",
  },
];

export function words(r: Respondent) {
  switch (r) {
    case "participant":
      return {
        who: "you",
        whose: "your",
        they: "you",
        them: "you",
        their: "your",
        self: "yourself",
        have: "have",
        are: "are",
        do: "do",
        need: "need",
        live: "live",
      };
    case "parent":
      return {
        who: "your child",
        whose: "your child’s",
        they: "they",
        them: "them",
        their: "their",
        self: "themselves",
        have: "has",
        are: "is",
        do: "does",
        need: "needs",
        live: "lives",
      };
    case "carer":
      return {
        who: "the person you support",
        whose: "their",
        they: "they",
        them: "them",
        their: "their",
        self: "themselves",
        have: "has",
        are: "is",
        do: "does",
        need: "needs",
        live: "lives",
      };
    case "nominee":
      return {
        who: "the participant",
        whose: "the participant’s",
        they: "they",
        them: "them",
        their: "their",
        self: "themselves",
        have: "has",
        are: "is",
        do: "does",
        need: "needs",
        live: "lives",
      };
    default:
      return {
        who: "this person",
        whose: "their",
        they: "they",
        them: "them",
        their: "their",
        self: "themselves",
        have: "has",
        are: "is",
        do: "does",
        need: "needs",
        live: "lives",
      };
  }
}

export function fill(template: string, r: Respondent) {
  const w = words(r);
  return template
    .replaceAll("{who}", w.who)
    .replaceAll("{whose}", w.whose)
    .replaceAll("{they}", w.they)
    .replaceAll("{them}", w.them)
    .replaceAll("{their}", w.their)
    .replaceAll("{self}", w.self)
    .replaceAll("{have}", w.have)
    .replaceAll("{are}", w.are)
    .replaceAll("{do}", w.do)
    .replaceAll("{need}", w.need)
    .replaceAll("{live}", w.live);
}
