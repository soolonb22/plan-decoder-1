import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { SYSTEMS } from "../src/lib/systems-walk.ts";
import {
  CASE_NOTE_SYSTEMS,
  CASE_NOTES_DISCLAIMER,
  CASE_NOTES_PLUM,
  CASE_NOTES_TAGLINE,
  CASE_NOTES_TITLE,
  EVIDENCE_TYPES,
  FORM13_HREF,
  HOUSING_FORM_FACTS,
  SAFETY_LINE,
  addEvidenceNote,
  createEmptyDraft,
  exportDraftJson,
  findMatchingDraft,
  getDraft,
  loadDrafts,
  removeDraft,
  sanitiseEvidence,
  upsertDraft,
  walkSearchFor,
} from "../src/lib/case-notes.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function memoryStorage(seed = "") {
  const bag = new Map();
  if (seed) bag.set("plan-decoder-case-notes-v1", seed);
  return {
    getItem: (key) => bag.get(key) ?? null,
    setItem: (key, value) => {
      bag.set(key, value);
    },
  };
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

test("Case notes systems match Systems walk and refuse a Justice engine", () => {
  assert.deepEqual(SYSTEMS, ["Housing", "NDIS", "Providers", "School", "Health", "Centrelink"]);
  assert.deepEqual(CASE_NOTE_SYSTEMS, SYSTEMS);
  const draft = createEmptyDraft("Justice");
  assert.equal(draft.system, "Housing");
  assert.doesNotMatch(JSON.stringify(draft), /justice/i);
});

test("evidence notes are metadata only — no file bytes, uploads, or extra fields", () => {
  const draft = createEmptyDraft("NDIS");
  const next = addEvidenceNote(draft, {
    label: "Plan letter",
    type: "letter",
    description: "Decision letter dated 12 March. Kept in the kitchen drawer.",
    file: "secret.pdf",
    dataUrl: "data:application/pdf;base64,AAAA",
    bytes: [1, 2, 3],
  });
  assert.equal(next.evidence.length, 1);
  assert.deepEqual(Object.keys(next.evidence[0]).sort(), ["description", "id", "label", "type"]);
  assert.equal(next.evidence[0].type, "letter");
  assert.equal(sanitiseEvidence({ type: "virus", label: "x", file: "a.pdf" }).type, "note");
  assert.deepEqual(EVIDENCE_TYPES, ["document", "email", "photo", "note", "letter"]);
});

test("drafts stay in the supplied on-device store and export is a JSON download payload", () => {
  const storage = memoryStorage();
  const draft = createEmptyDraft("Housing");
  draft.title = "Form 13 practice";
  draft.situation = "I want to give notice of intention to leave.";
  upsertDraft(draft, storage);

  const loaded = loadDrafts(storage);
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].title, "Form 13 practice");
  assert.equal(getDraft(draft.id, storage)?.system, "Housing");

  const json = exportDraftJson(loaded[0]);
  const parsed = JSON.parse(json);
  assert.equal(parsed.kind, "plan-decoder-case-notes");
  assert.equal(parsed.version, 1);
  assert.match(json, /not a government filing/i);
  assert.match(json, /not legal advice/i);
  assert.doesNotMatch(json, /ndiss/i);
  assert.equal(parsed.draft.situation, draft.situation);

  const search = walkSearchFor(loaded[0]);
  assert.deepEqual(search, { system: "Housing", note: draft.id });

  const match = findMatchingDraft(loadDrafts(storage), { system: "Housing", situation: draft.situation });
  assert.equal(match?.id, draft.id);

  const again = createEmptyDraft("Housing");
  again.situation = draft.situation;
  upsertDraft(again, storage);
  const still = findMatchingDraft(loadDrafts(storage), { system: "Housing", situation: draft.situation });
  assert.ok(still);
  assert.equal(still.situation, draft.situation);

  removeDraft(draft.id, storage);
  removeDraft(again.id, storage);
  assert.equal(loadDrafts(storage).length, 0);
});

test("housing form facts never call Form 13 an eviction", () => {
  assert.equal(CASE_NOTES_TITLE, "Plan Decoder · Case notes");
  assert.equal(
    CASE_NOTES_TAGLINE,
    "Practise the conversation. Not the government form. Not the NDIA, not official NDIS Navigator, not legal advice.",
  );
  assert.equal(CASE_NOTES_PLUM, "#6E2C92");
  assert.match(CASE_NOTES_DISCLAIMER, /not the NDIA/i);
  assert.match(CASE_NOTES_DISCLAIMER, /not legal advice/i);
  assert.match(SAFETY_LINE, /call 000/);
  assert.match(SAFETY_LINE, /not legal advice/i);
  assert.match(SAFETY_LINE, /advocate or legal aid/i);

  const form11 = HOUSING_FORM_FACTS.find((f) => f.form === "Form 11");
  const form12 = HOUSING_FORM_FACTS.find((f) => f.form === "Form 12");
  const form13 = HOUSING_FORM_FACTS.find((f) => f.form === "Form 13");
  assert.match(form11.meaning, /notice to remedy breach/i);
  assert.match(form11.meaning, /not an eviction/i);
  assert.match(form11.meaning, /do not send it to the RTA/i);
  assert.match(form12.meaning, /notice to leave/i);
  assert.match(form12.meaning, /lessor|agent/i);
  assert.match(form13.meaning, /tenant notice of intention to leave/i);
  assert.doesNotMatch(form13.meaning, /eviction/i);
  assert.equal(
    form13.href,
    "https://www.rta.qld.gov.au/forms-resources/forms/forms-for-general-tenancies/notice-of-intention-to-leave-form-13",
  );
  assert.equal(FORM13_HREF, form13.href);
});

test("public Case notes chrome stays independent Plan Decoder voice", () => {
  const page = readFileSync(join(root, "src/routes/case-notes.tsx"), "utf8");
  const engine = readFileSync(join(root, "src/lib/case-notes.ts"), "utf8");
  const walk = readFileSync(join(root, "src/routes/systems-walk.tsx"), "utf8");
  const together = `${page}\n${engine}`;
  const blob = flatten([together, CASE_NOTES_TITLE, CASE_NOTES_TAGLINE, CASE_NOTES_DISCLAIMER, SAFETY_LINE, HOUSING_FORM_FACTS]).join(
    "\n",
  );

  assert.match(engine, /Plan Decoder · Case notes/);
  assert.match(engine, /Practise the conversation\. Not the government form\./);
  assert.match(together, /#6E2C92/);
  assert.match(page, /CASE_NOTES_TITLE/);
  assert.match(page, /CASE_NOTES_TAGLINE/);
  assert.match(walk, /to="\/case-notes"/);
  assert.match(page, /to="\/systems-walk"/);
  assert.match(page, /to="\/navigator"/);

  assert.doesNotMatch(together, /NDISS/);
  assert.doesNotMatch(together, /Navigator OS/);
  assert.doesNotMatch(together, /Government Systems/);
  assert.doesNotMatch(together, /#005bbb/i);
  assert.doesNotMatch(together, /I-CAN/);
  assert.doesNotMatch(together, /you are eligible/i);
  assert.doesNotMatch(together, /you are ineligible/i);
  assert.doesNotMatch(together, /dollar band/i);
  assert.doesNotMatch(together, /type=["']file["']/);
  assert.doesNotMatch(together, /pdfjs|fileToPlanText|parseNdisPlan/);
  assert.doesNotMatch(together, /formData|multipart/i);

  const form13Lines = blob.split(/[.\n]/).filter((line) => /form\s*13/i.test(line));
  assert.ok(form13Lines.length > 0);
  for (const line of form13Lines) {
    assert.doesNotMatch(line, /eviction/i, `Form 13 line must not say eviction: ${line}`);
  }

  assert.equal(existsSync(join(root, "src/lib/navigator-case-builder.ts")), false);
  assert.equal(existsSync(join(root, "src/components/CaseBuilderUI.tsx")), false);

  const paths = readFileSync(join(root, "src/lib/public-paths.ts"), "utf8");
  assert.match(paths, /\/case-notes/);
  assert.match(readFileSync(join(root, "public/sitemap.xml"), "utf8"), /case-notes/);
  assert.match(readFileSync(join(root, "public/robots.txt"), "utf8"), /Allow: \/case-notes/);

  const nav = readFileSync(join(root, "src/lib/nav.ts"), "utf8");
  assert.match(nav, /\/case-notes/);
  assert.match(nav, /need: "free"/);

  const membership = readFileSync(join(root, "src/lib/membership.ts"), "utf8");
  assert.match(membership, /Case notes/);

  const walkPage = walk.toLowerCase();
  assert.doesNotMatch(walkPage, /membershipgate/);
  assert.doesNotMatch(page.toLowerCase(), /membershipgate/);
});
