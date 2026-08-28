export type LoginSearch = { create?: "1" };

/** `/login?create=1` (or true) opens the Create tab. */
export function parseLoginSearch(raw: Record<string, unknown>): LoginSearch {
  const v = raw.create;
  if (v === true || v === 1 || v === "1" || v === "true") return { create: "1" };
  return {};
}
