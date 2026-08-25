export type LiveNewsItem = {
  id: string;
  title: string;
  date: string;
  url: string;
  source: string;
};

export type NewsPayload = {
  items: LiveNewsItem[];
  fetchedAt: string;
  error?: string;
  stale?: boolean;
  source: "live" | "cache" | "empty";
};

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December";
const FRESH_MS = 3 * 60 * 60 * 1000;
const FETCH_MS = 12_000;

function toIso(au: string) {
  const m = au.match(new RegExp(`(\\d{1,2}) (${MONTHS}) (\\d{4})`, "i"));
  if (!m) return "";
  const months = MONTHS.split("|");
  const month = months.findIndex((x) => x.toLowerCase() === m[2].toLowerCase()) + 1;
  if (!month) return "";
  return `${m[3]}-${String(month).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

export function publicScrapeError(raw: string) {
  const t = raw.toLowerCase();
  if (/abort|timeout|timed out/.test(t)) return "The official site took too long to answer.";
  if (/\b403\b|blocked|forbidden|just a moment|cloudflare/.test(t)) return "The official site blocked this request.";
  if (/\b404\b|not found/.test(t)) return "The official news page was not found.";
  if (/\b429\b|too many/.test(t)) return "The official site asked us to wait. Try again in a little while.";
  if (/\b5\d\d\b|unavailable|bad gateway/.test(t)) return "The official site is having trouble right now.";
  if (/layout|parse|no headlines/.test(t)) return "Could not read headlines from the page. The layout may have changed.";
  if (/database|news_cache/.test(t)) return "Headlines could not be saved, but the scrape still ran.";
  return "Could not reach ndis.gov.au just now.";
}

export function parseNdisNewsHtml(html: string): LiveNewsItem[] {
  if (!html || html.length < 400) return [];
  if (/just a moment|cf-browser-verification|attention required/i.test(html) && !/\/news\/\d+-/.test(html)) {
    return [];
  }
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

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchHtml(url: string): Promise<{ html?: string; error?: string }> {
  let last = "Could not reach ndis.gov.au.";
  for (let attempt = 0; attempt < 3; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), FETCH_MS);
    try {
      const res = await fetch(url, {
        signal: ctrl.signal,
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent": "PlanDecoder/1.0 (+https://www.plandecoder.com; independent practice tool, not NDIA)",
        },
      });
      if (res.status === 429 || res.status >= 500) {
        last = `Official page returned ${res.status}`;
        await sleep(400 * (attempt + 1) * (attempt + 1));
        continue;
      }
      if (!res.ok) return { error: `Official page returned ${res.status}` };
      const html = await res.text();
      if (!html || html.length < 400) return { error: "Official page was empty." };
      if (/just a moment|cf-browser-verification/i.test(html) && !/\/news\/\d+-/.test(html)) {
        return { error: "blocked by Cloudflare" };
      }
      return { html };
    } catch (err) {
      const name = err instanceof Error ? err.name : "";
      last = name === "AbortError" || name === "TimeoutError" ? "timeout" : err instanceof Error ? err.message : "network";
      if (attempt < 2) await sleep(400 * (attempt + 1) * (attempt + 1));
    } finally {
      clearTimeout(timer);
    }
  }
  return { error: last };
}

async function scrapeNdisNews(): Promise<NewsPayload> {
  const urls = [
    "https://www.ndis.gov.au/news/latest",
    "https://www.ndis.gov.au/news",
    "https://www.ndis.gov.au/",
  ];
  const items: LiveNewsItem[] = [];
  const errors: string[] = [];
  for (const url of urls) {
    const got = await fetchHtml(url);
    if (got.error) {
      errors.push(got.error);
      continue;
    }
    if (got.html) items.push(...parseNdisNewsHtml(got.html));
  }
  const seen = new Set<string>();
  const unique = items.filter((i) => {
    if (seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  });
  unique.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const fail = unique.length ? undefined : publicScrapeError(errors[0] || "no headlines");
  return {
    items: unique.slice(0, 16),
    fetchedAt: new Date().toISOString(),
    error: fail,
    stale: false,
    source: unique.length ? "live" : "empty",
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
    let parsed: unknown = row.payload;
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        return null;
      }
    }
    const items = Array.isArray(parsed)
      ? (parsed as LiveNewsItem[])
      : ((parsed as { items?: LiveNewsItem[] })?.items ?? []);
    if (!Array.isArray(items)) return null;
    return {
      items: items.filter((i) => i && typeof i.title === "string" && typeof i.url === "string"),
      fetchedAt: row.fetched_at,
      error: row.error || undefined,
      stale: true,
      source: "cache",
    };
  } catch (err) {
    console.error("[news-cache-read]", err instanceof Error ? err.message : err);
    return null;
  }
}

async function writeStored(payload: NewsPayload) {
  if (!payload.items.length) return;
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
    console.error("[news-cache-write]", err instanceof Error ? err.message : err);
  }
}

async function markStoredError(message: string) {
  try {
    const { getSql } = await import("./db");
    const sql = await getSql();
    await sql.query(`update news_cache set error = $1 where id = 'ndia'`, [message]);
  } catch {
    /* keep last good copy */
  }
}

function mem() {
  return globalThis as typeof globalThis & { __pdNewsCache__?: { at: number; payload: NewsPayload } };
}

export async function refreshAndStoreNews(): Promise<NewsPayload> {
  const stored = await readStored();
  let payload: NewsPayload;
  try {
    payload = await scrapeNdisNews();
  } catch (err) {
    const error = publicScrapeError(err instanceof Error ? err.message : "scrape failed");
    console.error("[news-scrape]", err);
    if (stored?.items.length) {
      const kept = { ...stored, error, stale: true, source: "cache" as const };
      mem().__pdNewsCache__ = { at: Date.now(), payload: kept };
      await markStoredError(error);
      return kept;
    }
    return { items: [], fetchedAt: new Date().toISOString(), error, stale: false, source: "empty" };
  }
  if (payload.items.length) {
    mem().__pdNewsCache__ = { at: Date.now(), payload };
    await writeStored(payload);
    return payload;
  }
  const error = payload.error || publicScrapeError("no headlines");
  if (stored?.items.length) {
    const kept = { ...stored, error, stale: true, source: "cache" as const };
    mem().__pdNewsCache__ = { at: Date.now(), payload: kept };
    await markStoredError(error);
    return kept;
  }
  mem().__pdNewsCache__ = { at: Date.now(), payload: { ...payload, error } };
  return { ...payload, error };
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
  try {
    return await refreshAndStoreNews();
  } catch (err) {
    const error = publicScrapeError(err instanceof Error ? err.message : "scrape failed");
    console.error("[news-fetch]", err);
    if (stored?.items.length) return { ...stored, error, stale: true, source: "cache" };
    return { items: [], fetchedAt: new Date().toISOString(), error, stale: false, source: "empty" };
  }
}
