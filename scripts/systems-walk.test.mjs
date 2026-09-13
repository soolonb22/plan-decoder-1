import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  HOUSING_FORM11_DEMO,
  NDIS_ACCESS_DEMO,
  NDIS_REVIEW_DEMO,
  SYSTEMS,
  SYSTEM_CHECKBOX,
  SYSTEM_DEMOS,
  generateNavigatorReport,
} from "../src/lib/systems-walk.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixtureDir = join(root, "scripts/fixtures");

const SHARED_BANS = [
  "NDISS",
  "Government Systems",
  "I-CAN",
  "win rate",
  "dollar band",
  "likely eligible",
  "you are eligible",
  "you are ineligible",
  "you will get funding",
  "book an I-CAN",
  "try I-CAN",
];

function loadFixture(name) {
  return JSON.parse(readFileSync(join(fixtureDir, name), "utf8"));
}

function flatten(value, into = []) {
  if (value == null) return into;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    into.push(String(value));
    return into;
  }
  if (Array.isArray(value)) {
    for (const item of value) flatten(item, into);
    return into;
  }
  if (typeof value === "object") {
    for (const item of Object.values(value)) flatten(item, into);
  }
  return into;
}

function blobOf(report) {
  return flatten(report).join(" \n ").toLowerCase();
}

function assertShape(report, fixture) {
  assert.deepEqual(report.scenario, {
    system: fixture.system,
    situation: fixture.situation,
    flags: fixture.flags,
  });
  assert.equal(typeof report.worldModel, "object");
  assert.ok(report.worldModel && !Array.isArray(report.worldModel));
  assert.ok(Array.isArray(report.interpretations));
  assert.ok(report.interpretations.length > 0);
  assert.equal(typeof report.interpretations[0].meaning, "string");
  assert.equal(typeof report.intent, "object");
  assert.ok(Array.isArray(report.risks.risks_detected));
  assert.ok(report.risks.risks_detected.length > 0);
  assert.ok(Array.isArray(report.routes));
  assert.ok(report.routes.length > 0);
  for (const route of report.routes) {
    assert.equal(typeof route.name, "string");
    assert.ok(Array.isArray(route.actions));
    assert.ok(route.actions.length > 0);
  }
}

function assertFixture(fixture) {
  const report = generateNavigatorReport(fixture.system, fixture.situation, fixture.flags);
  assertShape(report, fixture);
  const blob = blobOf(report);
  for (const needle of fixture.mustInclude) {
    assert.match(blob, new RegExp(needle.toLowerCase(), "i"), `missing: ${needle}`);
  }
  for (const href of fixture.official) {
    assert.match(blob, new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const banned of [...SHARED_BANS, ...fixture.mustNotInclude]) {
    assert.doesNotMatch(blob, new RegExp(banned.toLowerCase(), "i"), `banned: ${banned}`);
  }
  assert.doesNotMatch(blob, /\$\s?[\d,]{2,}/);
  return report;
}

const SYSTEM_FIXTURES = {
  Housing: "housing-form11.json",
  NDIS: "ndis-review-letter.json",
  Providers: "providers-service-agreement.json",
  School: "school-adjustment.json",
  Health: "health-discharge.json",
  Centrelink: "centrelink-letter.json",
};

test("one fixture per named system returns the required report shape", () => {
  for (const system of SYSTEMS) {
    const fixture = loadFixture(SYSTEM_FIXTURES[system]);
    assert.equal(fixture.system, system);
    assertFixture(fixture);
  }
});

test("Housing Form 11 demo is a real QLD RTA walk, not government chrome", () => {
  const fixture = loadFixture("housing-form11.json");
  const report = generateNavigatorReport(
    HOUSING_FORM11_DEMO.system,
    HOUSING_FORM11_DEMO.situation,
    HOUSING_FORM11_DEMO.flags,
  );
  const blob = blobOf(report);
  for (const needle of fixture.mustInclude) {
    assert.match(blob, new RegExp(needle.toLowerCase(), "i"), `missing: ${needle}`);
  }
  assert.match(blob, /not legal advice/i);
  assert.ok(report.routes.length >= 3);
});

test("Housing Form 11 vs generic housing changes the report", () => {
  const form11 = assertFixture(loadFixture("housing-form11.json"));
  const generic = assertFixture(loadFixture("housing-generic.json"));
  assert.notEqual(form11.worldModel.paper, generic.worldModel.paper);
  assert.notEqual(blobOf(form11), blobOf(generic));
  assert.match(blobOf(form11), /notice to remedy breach/i);
  assert.doesNotMatch(blobOf(generic), /usual 7-day remedy window/i);
});

test("NDIS review letter vs access conversation changes the report", () => {
  const review = assertFixture(loadFixture("ndis-review-letter.json"));
  const access = assertFixture(loadFixture("ndis-access-conversation.json"));
  assert.notEqual(review.worldModel.paper, access.worldModel.paper);
  assert.notEqual(blobOf(review), blobOf(access));
  assert.match(blobOf(review), /review path/i);
  assert.match(blobOf(access), /does not quote funding/i);
  assert.doesNotMatch(blobOf(review), /likely eligible/i);
  assert.doesNotMatch(blobOf(access), /likely eligible/i);

  const fromDemo = generateNavigatorReport(
    NDIS_REVIEW_DEMO.system,
    NDIS_REVIEW_DEMO.situation,
    NDIS_REVIEW_DEMO.flags,
  );
  const fromAccess = generateNavigatorReport(
    NDIS_ACCESS_DEMO.system,
    NDIS_ACCESS_DEMO.situation,
    NDIS_ACCESS_DEMO.flags,
  );
  assert.equal(fromDemo.worldModel.paper, review.worldModel.paper);
  assert.equal(fromAccess.worldModel.paper, access.worldModel.paper);
});

test("each named Australian system branches when situation and flags change", () => {
  const pairs = [
    [
      generateNavigatorReport("Housing", "Form 11 issued; tenant disputes breach", { form11: true }),
      generateNavigatorReport("Housing", "I need housing help and an accessible option", {}),
    ],
    [
      generateNavigatorReport("NDIS", NDIS_REVIEW_DEMO.situation, NDIS_REVIEW_DEMO.flags),
      generateNavigatorReport("NDIS", NDIS_ACCESS_DEMO.situation, NDIS_ACCESS_DEMO.flags),
    ],
    [
      generateNavigatorReport(
        "Providers",
        "Provider sent a service agreement and wants me to sign this week",
        { serviceAgreement: true },
      ),
      generateNavigatorReport(
        "Providers",
        "I do not feel safe with a worker and I need to practise what to say",
        { unsafe: true },
      ),
    ],
    [
      generateNavigatorReport(
        "School",
        "I need a written classroom adjustment and a named disability liaison",
        { adjustment: true },
      ),
      generateNavigatorReport(
        "School",
        "School sent a suspension notice; I want to practise the next conversation",
        { exclusion: true },
      ),
    ],
    [
      generateNavigatorReport(
        "Health",
        "Hospital discharge plan in my hand; I need to practise the follow-up conversation",
        { discharge: true },
      ),
      generateNavigatorReport(
        "Health",
        "I want a longer GP appointment to talk about a usual day and a hard day",
        { gp: true },
      ),
    ],
    [
      generateNavigatorReport(
        "Centrelink",
        "Services Australia letter about a payment; I want to practise what to ask",
        { letter: true },
      ),
      generateNavigatorReport(
        "Centrelink",
        "Centrelink debt or overpayment letter; I want to practise the next conversation",
        { debt: true },
      ),
    ],
  ];

  for (const [a, b] of pairs) {
    assert.equal(a.scenario.system, b.scenario.system);
    assert.notEqual(a.worldModel.paper, b.worldModel.paper, `${a.scenario.system} paper should change`);
    assert.notEqual(blobOf(a), blobOf(b), `${a.scenario.system} report should change`);
    for (const report of [a, b]) {
      const blob = blobOf(report);
      for (const banned of SHARED_BANS) {
        assert.doesNotMatch(blob, new RegExp(banned.toLowerCase(), "i"), `${report.scenario.system}: ${banned}`);
      }
    }
  }
});

test("each named Australian system returns a real walk in the same shape", () => {
  for (const system of SYSTEMS) {
    const report = generateNavigatorReport(system, "I need to practise what to say", {});
    assert.equal(report.scenario.system, system);
    assert.ok(report.interpretations[0]?.meaning);
    assert.ok(report.routes[0]?.actions.length);
    const blob = blobOf(report);
    assert.doesNotMatch(blob, /ndiss/i);
    assert.doesNotMatch(blob, /government systems/i);
    assert.doesNotMatch(blob, /you are eligible/i);
    assert.doesNotMatch(blob, /you are ineligible/i);
    assert.doesNotMatch(blob, /i-can/i);
    assert.doesNotMatch(blob, /win rate/i);
    assert.doesNotMatch(blob, /dollar band/i);
  }
});

test("fixture folder has one typical paper per system", () => {
  const names = readdirSync(fixtureDir).filter((name) => name.endsWith(".json")).sort();
  for (const file of Object.values(SYSTEM_FIXTURES)) {
    assert.ok(names.includes(file), `missing fixture ${file}`);
  }
  assert.ok(names.includes("housing-generic.json"));
  assert.ok(names.includes("ndis-access-conversation.json"));
});

test("public Systems walk chrome stays independent and in Plan Decoder voice", () => {
  const page = readFileSync(join(root, "src/routes/systems-walk.tsx"), "utf8");
  const engine = readFileSync(join(root, "src/lib/systems-walk.ts"), "utf8");
  const together = `${page}\n${engine}`;

  assert.match(engine, /Plan Decoder · Systems walk/);
  assert.match(engine, /Practise the conversation\. Not the government form\./);
  assert.match(engine, /Not the NDIA, not official NDIS Navigator, not legal advice/);
  assert.match(together, /#6E2C92/);
  assert.match(page, /SYSTEMS_WALK_TITLE/);
  assert.match(page, /SYSTEMS_WALK_TAGLINE/);
  assert.match(page, /generateNavigatorReport/);
  assert.match(page, /SYSTEM_DEMOS/);
  assert.match(page, /SYSTEM_CHECKBOX/);
  assert.doesNotMatch(together, /NDISS/);
  assert.doesNotMatch(together, /Government Systems/);
  assert.doesNotMatch(together, /NDIS purple/);
  assert.match(together, /not an official NDIS Navigator/i);
  assert.match(together, /not legal advice/i);
  assert.match(together, /NDIS does not run the classroom/);
  assert.match(together, /cannot approve a payment/);
  assert.match(together, /not a recommended list/);
  assert.match(together, /not a diagnosis/);

  for (const system of SYSTEMS) {
    assert.equal(SYSTEM_CHECKBOX[system].flag === "form11", system === "Housing");
    assert.ok(SYSTEM_DEMOS[system].length >= 1);
    assert.ok(SYSTEM_DEMOS[system][0].situation.length > 0);
  }

  const paths = readFileSync(join(root, "src/lib/public-paths.ts"), "utf8");
  assert.match(paths, /\/systems-walk/);
  assert.match(readFileSync(join(root, "public/sitemap.xml"), "utf8"), /systems-walk/);
  assert.match(readFileSync(join(root, "public/robots.txt"), "utf8"), /Allow: \/systems-walk/);

  const navigator = readFileSync(join(root, "src/routes/navigator.tsx"), "utf8");
  assert.match(navigator, /Community navigator/);
  assert.match(navigator, /to="\/systems-walk"/);
});
