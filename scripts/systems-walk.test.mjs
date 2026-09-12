import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  HOUSING_FORM11_DEMO,
  SYSTEMS,
  generateNavigatorReport,
} from "../src/lib/systems-walk.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = JSON.parse(
  readFileSync(join(root, "scripts/fixtures/housing-form11.json"), "utf8"),
);

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

test("Housing Form 11 demo returns the required report shape", () => {
  const report = generateNavigatorReport(
    fixture.system,
    fixture.situation,
    fixture.flags,
  );

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
  assert.ok(report.routes.length >= 3);
  for (const route of report.routes) {
    assert.equal(typeof route.name, "string");
    assert.ok(Array.isArray(route.actions));
    assert.ok(route.actions.length > 0);
  }
});

test("Housing Form 11 demo is a real QLD RTA walk, not government chrome", () => {
  const report = generateNavigatorReport(
    HOUSING_FORM11_DEMO.system,
    HOUSING_FORM11_DEMO.situation,
    HOUSING_FORM11_DEMO.flags,
  );
  const blob = blobOf(report);

  for (const needle of fixture.mustInclude) {
    assert.match(blob, new RegExp(needle.toLowerCase(), "i"), `missing: ${needle}`);
  }
  for (const href of fixture.official) {
    assert.match(blob, new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  for (const banned of fixture.mustNotInclude) {
    assert.doesNotMatch(blob, new RegExp(banned.toLowerCase(), "i"), `banned: ${banned}`);
  }
  assert.match(blob, /not legal advice/i);
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
  }
});

test("public Systems walk chrome stays independent and in Plan Decoder voice", () => {
  const page = readFileSync(join(root, "src/routes/systems-walk.tsx"), "utf8");
  const engine = readFileSync(join(root, "src/lib/systems-walk.ts"), "utf8");
  const together = `${page}\n${engine}`;

  assert.match(engine, /Plan Decoder · Systems walk/);
  assert.match(engine, /Practise the conversation\. Not the government form\./);
  assert.match(together, /#6E2C92/);
  assert.match(page, /SYSTEMS_WALK_TITLE/);
  assert.match(page, /SYSTEMS_WALK_TAGLINE/);
  assert.match(page, /generateNavigatorReport/);
  assert.doesNotMatch(together, /NDISS/);
  assert.doesNotMatch(together, /Government Systems/);
  assert.doesNotMatch(together, /NDIS purple/);
  assert.match(together, /not an official NDIS Navigator/i);
  assert.match(together, /not legal advice/i);

  const paths = readFileSync(join(root, "src/lib/public-paths.ts"), "utf8");
  assert.match(paths, /\/systems-walk/);
  assert.match(readFileSync(join(root, "public/sitemap.xml"), "utf8"), /systems-walk/);
  assert.match(readFileSync(join(root, "public/robots.txt"), "utf8"), /Allow: \/systems-walk/);

  const navigator = readFileSync(join(root, "src/routes/navigator.tsx"), "utf8");
  assert.match(navigator, /Community navigator/);
  assert.match(navigator, /to="\/systems-walk"/);
});
