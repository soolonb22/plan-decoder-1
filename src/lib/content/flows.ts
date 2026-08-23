export type FlowField = {
  id: string;
  prompt: string;
  help?: string;
  kind: "text" | "long" | "choice" | "multi";
  options?: { value: string; label: string }[];
};

export type FlowDef = {
  id: string;
  title: string;
  intro: string;
  need: "free" | "core" | "pro";
  outputKind: "impact" | "meeting" | "language" | "letter" | "wallet" | "carer";
  fields: FlowField[];
};

export const FLOWS: FlowDef[] = [
  {
    id: "impact",
    title: "Write an impact statement",
    intro: "One situation at a time. Short facts are enough. You can stop and save at any step.",
    need: "core",
    outputKind: "impact",
    fields: [
      { id: "who", prompt: "Whose day are we describing?", help: "You can use a first name or just ‘me’." , kind: "text" },
      { id: "situation", prompt: "What is the situation or task?", kind: "text" },
      { id: "without", prompt: "What happens without the right support?", kind: "long" },
      { id: "how-often", prompt: "How often does this happen, and how long does it last?", kind: "long" },
      { id: "with", prompt: "What changes when the right support is there?", kind: "long" },
      { id: "strength", prompt: "What already works, even a little?", kind: "long" },
      { id: "ask", prompt: "What support are you asking for, in plain words?", kind: "text" },
    ],
  },
  {
    id: "meeting",
    title: "Prepare for a planning meeting",
    intro: "Let’s take this one step at a time. You will leave with a one-page brief you can read from.",
    need: "core",
    outputKind: "meeting",
    fields: [
      { id: "purpose", prompt: "What is this meeting for?", kind: "choice", options: [
        { value: "first-plan", label: "First plan" },
        { value: "reassessment", label: "Plan reassessment" },
        { value: "check-in", label: "Check-in or implementation" },
        { value: "review", label: "Review or disagreement" },
        { value: "other", label: "Something else" },
      ]},
      { id: "must-say", prompt: "What must be said even if time runs out?", kind: "long" },
      { id: "week", prompt: "What does a typical week look like right now?", kind: "long" },
      { id: "hard", prompt: "What does a hard week look like?", kind: "long" },
      { id: "ask", prompt: "What are you asking the NDIS to fund or change?", kind: "long" },
      { id: "questions", prompt: "What do you want to ask them?", kind: "long" },
    ],
  },
  {
    id: "carer",
    title: "Record carer impact",
    intro: "This is not a test of love. It is a record of unpaid disability support and what it costs the household.",
    need: "core",
    outputKind: "carer",
    fields: [
      { id: "task", prompt: "What extra support did you provide?", kind: "long" },
      { id: "hours", prompt: "Roughly how long, including overnight and waiting?", kind: "text" },
      { id: "body", prompt: "What did it cost you — sleep, work, health, other children?", kind: "long" },
      { id: "risk", prompt: "What happens if this continues at this level?", kind: "long" },
      { id: "help", prompt: "What paid support would change this week?", kind: "long" },
    ],
  },
  {
    id: "coc",
    title: "Something has changed",
    intro: "We will turn the change into a calm letter. You can edit every word before you send it.",
    need: "core",
    outputKind: "letter",
    fields: [
      { id: "what", prompt: "What changed?", kind: "long" },
      { id: "when", prompt: "When did it change?", kind: "text" },
      { id: "function", prompt: "How is daily function different now?", kind: "long" },
      { id: "ask", prompt: "What are you asking the NDIA to do?", kind: "long" },
      { id: "risk", prompt: "What is at risk if the plan stays the same?", kind: "long" },
    ],
  },
  {
    id: "appointment",
    title: "Prepare for an allied health appointment",
    intro: "Clinicians write better NDIS reports when they know what to look for. You are briefing them, not performing.",
    need: "core",
    outputKind: "language",
    fields: [
      { id: "who", prompt: "Who are you seeing, and for what?", kind: "text" },
      { id: "goal", prompt: "What do you need this appointment to produce?", kind: "choice", options: [
        { value: "function-report", label: "A functional report" },
        { value: "letter", label: "A short support letter" },
        { value: "therapy", label: "Therapy / strategy, not a report" },
        { value: "review", label: "An update on progress" },
      ]},
      { id: "typical", prompt: "What should they know about a typical week?", kind: "long" },
      { id: "sensory", prompt: "Any sensory, communication, or access needs for the appointment itself?", kind: "long" },
      { id: "ask", prompt: "Questions you want to ask", kind: "long" },
    ],
  },
  {
    id: "understand-plan",
    title: "Understand my plan",
    intro: "No jargon test. We will name the parts, then you can tick the checklist at your pace.",
    need: "free",
    outputKind: "wallet",
    fields: [
      { id: "have", prompt: "Do you have the plan in front of you?", kind: "choice", options: [
        { value: "yes", label: "Yes" },
        { value: "letter", label: "I have a letter but not the full plan" },
        { value: "no", label: "Not yet" },
      ]},
      { id: "feeling", prompt: "How does the plan feel, in one line?", kind: "text" },
      { id: "unclear", prompt: "What is the first thing that is unclear?", kind: "long" },
      { id: "help", prompt: "Who can sit with you to read it?", kind: "text" },
    ],
  },
];
