import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cleanGoals,
  friendlyFlag,
  friendlyWarnings,
  matchGoalsToSupports,
  pickPlanDates,
  tidyExcerpt,
} from "../src/lib/plan-clean.ts";

test("raw parser flags never reach people", () => {
  assert.match(friendlyFlag("old_three_pot_or_partial"), /older format/);
  assert.equal(friendlyFlag("merged_repeat_heading:core"), null);
  assert.equal(friendlyFlag("unscoped_amount_list"), null);
  const shown = friendlyWarnings(["old_three_pot_or_partial", "no_funding_heading", "merged_repeat_heading:goals"]);
  assert.equal(shown.length, 1);
  assert.ok(shown.every((w) => !/_/.test(w)));
});

test("labelled dates win, and the range is never backwards", () => {
  const text = "Plan reassessment date: 31 August 2026\nNDIS plan start date: 24 August 2023";
  const d = pickPlanDates(text, ["31 August 2026", "24 August 2023"]);
  assert.equal(d.start, "24 August 2023");
  assert.equal(d.end, "31 August 2026");
  assert.equal(d.labelled, true);
});

test("unlabelled dates are sorted earliest to latest", () => {
  const d = pickPlanDates("no labels here", ["31 August 2026", "24 August 2023"]);
  assert.equal(d.start, "24 August 2023");
  assert.equal(d.end, "31 August 2026");
});

test("'X to Y' ranges are read as start and end", () => {
  const d = pickPlanDates("Plan period\n12 March 2026 to 11 March 2027", ["12 March 2026", "11 March 2027"]);
  assert.equal(d.start, "12 March 2026");
  assert.equal(d.end, "11 March 2027");
});

test("goal form labels are stripped and broken lines are joined", () => {
  const raw = [
    "This is what I want to achieve",
    "Short-term goal",
    "During this plan, Fallon and Christopher would like for Oscar to communicate with his family",
    "and friends.",
    "How I will achieve this goal How I will be supported",
    "Oscar will work with a speech pathologist",
    "to practice skills and strategies to",
    "support the goal. There will be a plan",
  ].join("\n");
  const goals = cleanGoals(raw);
  assert.ok(goals.every((g) => !/this is what i want|short-term goal|how i will/i.test(g)), goals.join(" | "));
  assert.ok(goals.some((g) => /communicate with his family and friends\./.test(g)), goals.join(" | "));
  assert.ok(!goals.includes("and friends."));
});

test("excerpts drop postal boilerplate and stay short", () => {
  const ex = tidyExcerpt(
    "Participant plan attached. If not delivered: GPO Box 700 Canberra ACT 2601 NDS2LETTER. " + "Words. ".repeat(80),
  );
  assert.ok(!/GPO Box/.test(ex));
  assert.ok(ex.length <= 262);
});

test("goals link to matching supports; gaps and orphans are reported", () => {
  const map = matchGoalsToSupports(
    ["Oscar to communicate with his family and friends.", "Learn to ride a horse"],
    [
      { key: "idl", label: "Improved daily living (therapy)", pot: "Capacity Building" },
      { key: "at", label: "Assistive technology", pot: "Capital" },
    ],
  );
  assert.equal(map.matches[0].supports[0].key, "idl");
  assert.deepEqual(map.gaps, ["Learn to ride a horse"]);
  assert.deepEqual(
    map.orphans.map((o) => o.key),
    ["at"],
  );
});
