// Splits one visitor message into separate requests ("see the harvest, how much
// is it, and how do I get to town?"). Pure and rule-based (EN/FR/DE), so it
// runs offline and is unit-tested. Each part is then classified on its own.
import type { ClassificationResult, Label } from "./classifier";
import type { Category } from "./taxonomy";

export const MAX_REQUESTS = 3;
const MIN_WORDS = 3;

// Clause boundaries: sentence punctuation, or a comma / connector that starts a new request.
const BOUNDARY =
  /[.!?;]+\s*|,\s*(?:and\s+|et\s+|und\s+)?(?=\S)|\s+(?:and also|and then|also|then|plus|et aussi|et puis|puis|aussi|ainsi que|und auch|außerdem|ausserdem|dann|sowie)\s+|\s+(?:and|et|und)\s+(?=(?:how|what|where|when|can|could|is|are|do|does|i|we|comment|combien|où|quand|est-ce|peut|pouvez|je|nous|wie|was|wo|wann|kann|können|gibt|ich|wir)\b)/giu;

export function splitRequests(text: string): string[] {
  const raw = text.split(BOUNDARY).map((p) => p?.trim()).filter((p): p is string => !!p);
  // Merge fragments too short to be a request into the previous part.
  const parts: string[] = [];
  for (const p of raw) {
    if (parts.length && p.split(/\s+/).length < MIN_WORDS) parts[parts.length - 1] += " " + p;
    else parts.push(p);
  }
  if (parts.length > 1 && parts[0]!.split(/\s+/).length < MIN_WORDS) parts.splice(0, 2, `${parts[0]} ${parts[1]}`);
  return parts.length ? parts : [text.trim()];
}

/** Combine per-part results: distinct confident categories (max 3), else the whole-message result. */
export function combineRequests(parts: ClassificationResult[], whole: ClassificationResult): { labels: Label[]; results: ClassificationResult[] } {
  const seen = new Map<Category, ClassificationResult>();
  for (const r of parts) {
    if (r.label === "not_sure" || r.label === "other") continue;
    const prev = seen.get(r.label);
    if (!prev || r.best > prev.best) seen.set(r.label, r);
  }
  const picked = [...seen.values()].slice(0, MAX_REQUESTS);
  if (picked.length) return { labels: picked.map((r) => r.label), results: picked };
  return { labels: [whole.label], results: [whole] };
}
