import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

test("billing source of truth still lists Core and Professional AUD prices", () => {
  const billing = read("src/lib/billing.ts");
  assert.match(billing, /core:\s*12/);
  assert.match(billing, /pro:\s*49/);
  assert.match(billing, /credits:\s*1,\s*\n\s*aud:\s*5/s);
  assert.match(billing, /credits:\s*2,\s*\n\s*aud:\s*10/s);
  assert.match(billing, /credits:\s*5,\s*\n\s*aud:\s*25/s);
});

test("pricing page uses billing constants instead of a second price list", () => {
  const pricing = read("src/routes/pricing.tsx");
  assert.match(pricing, /MEMBERSHIP_PRICE_AUD/);
  assert.match(pricing, /CREDIT_PACKS/);
  assert.match(pricing, /CORE_TRIAL_DAYS/);
  assert.doesNotMatch(pricing, /\$12/);
  assert.doesNotMatch(pricing, /\$49/);
});

test("login opens create mode from query param and has no zip download", () => {
  const login = read("src/routes/login.tsx");
  assert.match(login, /parseLoginSearch/);
  assert.match(login, /create === "1"/);
  assert.match(login, /Create a free account/);
  assert.doesNotMatch(login, /github\.com\/.*archive.*\.zip/);
  assert.doesNotMatch(login, /Wrangler/);
  const search = read("src/lib/login-search.ts");
  assert.match(search, /create\?: "1"/);
});

test("production login hides Worker secret setup behind a local-host check", () => {
  const login = read("src/routes/login.tsx");
  assert.match(login, /isLocalAuthDebugHost/);
  assert.match(login, /Sign-in is unavailable just now/);
  const site = read("src/lib/site.ts");
  assert.match(site, /plandecoder\.com/);
  assert.match(site, /grok-sandbox\.com/);
});

test("get-files is a redirect, not a public zip page", () => {
  const files = read("src/routes/get-files.tsx");
  assert.match(files, /Navigate to="\/"/);
  assert.doesNotMatch(files, /github\.com\/.*\.zip/);
  assert.doesNotMatch(files, /Wrangler/);
});

test("homepage and rights share the free vs Core boundary", () => {
  const copy = read("src/lib/access-copy.ts");
  assert.match(copy, /ACCESS_BOUNDARY/);
  assert.match(copy, /Module 0/);
  assert.match(copy, /free account/);
  assert.match(copy, /Core/);
  const home = read("src/components/marketing-home.tsx");
  const rights = read("src/components/rights-course.tsx");
  assert.match(home, /ACCESS_BOUNDARY/);
  assert.match(rights, /ACCESS_BOUNDARY/);
  assert.match(home, /LOGIN_CREATE_SEARCH/);
  assert.match(rights, /LOGIN_CREATE_SEARCH/);
});

test("robots and sitemap include /pricing", () => {
  const robots = read("public/robots.txt");
  const sitemap = read("public/sitemap.xml");
  assert.match(robots, /Allow: \/pricing/);
  assert.match(robots, /Disallow: \/get-files/);
  assert.match(sitemap, /plandecoder\.com\/pricing/);
});
