export type LiveNewsItem = {
  id: string;
  title: string;
  date: string;
  url: string;
  source: string;
};

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December";

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
  return items.filter((i) => {
    if (seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  }).slice(0, 16);
}

export async function fetchNdisNews(): Promise<{ items: LiveNewsItem[]; fetchedAt: string; error?: string }> {
  const g = globalThis as typeof globalThis & {
    __pdNewsCache__?: { at: number; payload: { items: LiveNewsItem[]; fetchedAt: string; error?: string } };
  };
  const now = Date.now();
  if (g.__pdNewsCache__ && now - g.__pdNewsCache__.at < 30 * 60 * 1000) return g.__pdNewsCache__.payload;
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
      const html = await res.text();
      items.push(...parseNdisNewsHtml(html));
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
  const payload = {
    items: unique.slice(0, 16),
    fetchedAt: new Date().toISOString(),
    error: unique.length ? undefined : error,
  };
  g.__pdNewsCache__ = { at: now, payload };
  return payload;
}
