import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const destDir = join(
  "/workspace",
  ".vercel/output/functions/__server.func/_libs",
);
if (!existsSync(destDir)) process.exit(0);
mkdirSync(destDir, { recursive: true });
const srcDir = join("/workspace/node_modules/@electric-sql/pglite/dist");
for (const file of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  const from = join(srcDir, file);
  if (existsSync(from)) copyFileSync(from, join(destDir, file));
}
