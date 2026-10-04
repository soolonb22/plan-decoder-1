/** Best-effort removal before a draft leaves the device. Not a guarantee. The person still reviews the text. */

const REMOVED = "[removed]";

export function stripIdentifiers(input: string): string {
  let text = String(input || "");

  text = text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, REMOVED);
  text = text.replace(/(?:\+?61[\s-]?|0)4\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/g, REMOVED);
  text = text.replace(/\b0[2378][\s-]?\d{4}[\s-]?\d{4}\b/g, REMOVED);
  text = text.replace(/\b(?:NDIS(?:\s*number)?|CRN)\s*[:#]?\s*[A-Z0-9][A-Z0-9\s-]{5,}\b/gi, REMOVED);
  text = text.replace(/\b(?:medicare|centrelink|tfn|tax file(?: number)?)\s*[:#]?\s*[\d\s]{6,}\b/gi, REMOVED);
  text = text.replace(/\b(?:dob|d\.o\.b\.|date of birth|born(?: on)?)\s*[:#]?\s*\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}\b/gi, REMOVED);
  text = text.replace(
    /\b\d{1,5}\s+[A-Za-z]+(?:\s+[A-Za-z]+){0,3}\s+(?:Street|St|Road|Rd|Avenue|Ave|Drive|Dr|Court|Ct|Crescent|Cres|Lane|Ln|Parade|Pde|Place|Pl|Way|Boulevard|Blvd|Terrace|Tce)\b\.?/gi,
    REMOVED,
  );
  text = text.replace(/\blives at\s+[^.\n]{0,80}/gi, `lives at ${REMOVED}`);
  text = text.replace(
    /\b(?:at|from)\s+[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+){0,3}\s+(?:School|High|College|University|Preschool|Kindergarten)\b/g,
    `at ${REMOVED}`,
  );
  text = text.replace(/\b(?:works at|working at|employer is)\s+[^.\n,]{0,60}/gi, `works at ${REMOVED}`);
  text = text.replace(/\b(?:Dr|Doctor|Mr|Mrs|Ms)\.?\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?/g, REMOVED);
  text = text.replace(
    /\b(mum|mom|dad|mother|father|partner|husband|wife|worker|support worker|carer|doctor|gp)\s+[A-Z][a-z]+\b/gi,
    "$1",
  );
  text = text.replace(/^Name\/nickname:.*$/gim, "Name/nickname: [removed]");
  text = text.replace(/[ \t]{2,}/g, " ");
  return text.trim();
}
