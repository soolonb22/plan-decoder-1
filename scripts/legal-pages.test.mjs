import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

test("footer legal links are real public routes, not hash-only 404s", () => {
  const footer = read("src/components/layout/public-shell.tsx");
  const paths = read("src/lib/public-paths.ts");
  const tree = read("src/routeTree.gen.ts");

  for (const path of ["/privacy", "/terms", "/refunds", "/contact"]) {
    assert.match(footer, new RegExp(`to="${path}"`));
    assert.match(paths, new RegExp(`"${path}"`));
    assert.match(tree, new RegExp(`path: '${path}'`));
  }

  assert.doesNotMatch(footer, /\/privacy#terms/);
  assert.doesNotMatch(footer, /\/privacy#contact/);
  assert.doesNotMatch(footer, /\/privacy#refunds/);
});

test("legal copy stays independent Australian plain English", () => {
  const copy = `${read("src/lib/legal.ts")}\n${read("src/components/legal.tsx")}`;
  assert.match(copy, /soolonb22@gmail\.com/);
  assert.match(copy, /not legal advice/i);
  assert.match(copy, /not the NDIA/i);
  assert.match(copy, /cannot be paid for from NDIS plan funding/);
  assert.match(copy, /Queensland/);
  assert.doesNotMatch(copy, /ABN/);
  assert.doesNotMatch(copy, /you are eligible/i);
  assert.doesNotMatch(copy, /you will be funded/i);
});

test("sitemap and robots list the public legal pages", () => {
  const sitemap = read("public/sitemap.xml");
  const robots = read("public/robots.txt");
  for (const path of ["/terms", "/refunds", "/contact"]) {
    assert.match(sitemap, new RegExp(`plandecoder\\.com${path}`));
    assert.match(robots, new RegExp(`Allow: ${path}`));
  }
});
