export type LiveNewsItem = {
  id: string;
  title: string;
  date: string;
  url: string;
  source: string;
};

export type NewsPayload = { items: LiveNewsItem[]; fetchedAt: string; error?: string };

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December";
const FRESH_MS = 3 * 60 * 60 * 1000;

function toIso(au: string) {
  const m = au.match(new RegExp(`(\\d{1,2}) (${MONTHS}) (\\d{4})`, "i"));
  if (!m) return "";
  const months = MONTHS.split("|");
  const month = months.findIndex((x) => x.toLowerCase() === m[2].toLowerCase()) + 1;
  if (!month) return "";
  return `${m[3]}-${String(month).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

export function parseNdisNewsHtml(html: string): LiveNewsItem[] {
  const items: LiveNewsItem[] = [];
  const patterns = [
    /href="(\/news\/(\d+)-([a-z0-9-]+))"([^>]*)>([^<]{8,200})/gi,
    /href="(https:\/\/www\.ndis\.gov\.au\/news\/(\d+)-([a-z0-9-]+))"([^>]*)>([^<]{8,200})/gi,
  ];
  for (const re of patterns) {
    let match: RegExpExecArray | null;
    while ((match = re.exec(html))) {
      const raw = match[1];
      const id = match[2];
      const title = match[5].replace(/\s+/g, " ").trim();
      if (!title || /listen|read more|skip to/i.test(title)) continue;
      const window = html.slice(match.index, match.index + 900);
      const dateMatch = window.match(new RegExp(`(\\d{1,2} (?:${MONTHS}) \\d{4})`, "i"));
      const date = dateMatch ? toIso(dateMatch[1]) : "";
      const path = raw.startsWith("http") ? raw : `https://www.ndis.gov.au${raw}`;
      items.push({
        id: `ndia-${id}`,
        title,
        date,
        url: path,
        source: "ndis.gov.au",
      });
    }
  }
  const seen = new Set<string>();
  return items
    .filter((i) => {
      if (seen.has(i.url)) return false;
      seen.add(i.url);
      return true;
    })
    .slice(0, 16);
}

async function scrapeNdisNews(): Promise<NewsPayload> {
  const urls = [
    "https://www.ndis.gov.au/news/latest",
    "https://www.ndis.gov.au/news",
    "https://www.ndis.gov.au/",
  ];
  const items: LiveNewsItem[] = [];
  let error: string | undefined;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent": "PlanDecoder/1.0 (+https://www.plandecoder.com; independent practice tool, not NDIA)",
        },
      });
      if (!res.ok) {
        error = `Official page returned ${res.status}`;
        continue;
      }
      items.push(...parseNdisNewsHtml(await res.text()));
    } catch (err) {
      error = err instanceof Error ? err.message : "Could not reach ndis.gov.au";
    }
  }
  const seen = new Set<string>();
  const unique = items.filter((i) => {
    if (seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  });
  unique.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return {
    items: unique.slice(0, 16),
    fetchedAt: new Date().toISOString(),
    error: unique.length ? undefined : error,
  };
}

async function readStored(): Promise<NewsPayload | null> {
  try {
    const { getSql } = await import("./db");
    const sql = await getSql();
    const rows = await sql.query<{ payload: unknown; fetched_at: string; error: string | null }>(
      `select payload, fetched_at::text as fetched_at, error from news_cache where id = 'ndia'`,
    );
    if (!rows.length) return null;
    const row = rows[0];
    const payload = typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;
    const items = Array.isArray(payload) ? (payload as LiveNewsItem[]) : (payload as { items?: LiveNewsItem[] }).items ?? [];
    return {
      items,
      fetchedAt: row.fetched_at,
      error: row.error || undefined,
    };
  } catch {
    return null;
  }
}

async function writeStored(payload: NewsPayload) {
  try {
    const { getSql } = await import("./db");
    const sql = await getSql();
    await sql.query(
      `insert into news_cache (id, payload, fetched_at, error)
       values ('ndia', $1::jsonb, $2::timestamptz, $3)
       on conflict (id) do update set payload = excluded.payload, fetched_at = excluded.fetched_at, error = excluded.error`,
      [JSON.stringify(payload.items), payload.fetchedAt, payload.error ?? null],
    );
  } catch (err) {
    console.error("[news-cache]", err instanceof Error ? err.message : err);
  }
}

function mem() {
  return globalThis as typeof globalThis & { __pdNewsCache__?: { at: number; payload: NewsPayload } };
}

export async function refreshAndStoreNews(): Promise<NewsPayload> {
  const payload = await scrapeNdisNews();
  mem().__pdNewsCache__ = { at: Date.now(), payload };
  if (payload.items.length) await writeStored(payload);
  return payload;
}

export async function fetchNdisNews(opts: { force?: boolean } = {}): Promise<NewsPayload> {
  const g = mem();
  const now = Date.now();
  if (!opts.force && g.__pdNewsCache__ && now - g.__pdNewsCache__.at < 20 * 60 * 1000) {
    return g.__pdNewsCache__.payload;
  }
  const stored = await readStored();
  if (stored?.items.length) {
    const age = now - new Date(stored.fetchedAt).getTime();
    if (!Number.isNaN(age) && age < (opts.force ? 10 * 60 * 1000 : FRESH_MS)) {
      g.__pdNewsCache__ = { at: now, payload: stored };
      return stored;
    }
  }
  const fresh = await refreshAndStoreNews();
  if (!fresh.items.length && stored?.items.length) return stored;
  return fresh;
}
