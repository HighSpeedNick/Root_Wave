// Splits one visitor message into separate requests ("see the harvest, how much
// is it, and how do I get to town?"). Pure and rule-based (EN/FR/DE), so it
// runs offline and is unit-tested. Each part is then classified on its own.
import type { ClassificationResult, Label } from "./classifier";
import type { Category } from "./taxonomy";

export const MAX_REQUESTS = 3;
const MIN_WORDS = 3;

// Clause boundaries: sentence punctuation, or a comma / connector that starts a new request.
const BOUNDARY =
  /[.!?;]+\s*|,\s*(?:and\s+|et\s+|und\s+)?(?=\S)|\s+(?:and also|and then|also|then|plus|et aussi|et puis|puis|aussi|ainsi que|und auch|außerdem|ausserdem|dann|sowie)\s+|\s+(?:and|et|und)\s+(?=(?:how|what|where|when|can|could|is|are|do|does|i|we|ask|know|see|visit|taste|try|eat|get|find|learn|watch|walk|comment|combien|où|quand|est-ce|peut|pouvez|je|nous|demander|savoir|voir|visiter|goûter|manger|trouver|wie|was|wo|wann|kann|können|gibt|ich|wir|fragen|wissen|sehen|besuchen|probieren|essen|finden|den\s+(?:weg|transport|bus|taxi))\b)/giu;

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

const EXPLICIT_CATEGORY: { category: Category; pattern: RegExp }[] = [
  { category: "harvest_walk", pattern: /\b(?:harvest|harvesting|récolte|cueillette|ernte|pflücken)\b/iu },
  { category: "prices", pattern: /\b(?:cost|price|prices|how much|coût|coûte|prix|combien|kostet|kosten|preis|wie viel)\b/iu },
  { category: "transport", pattern: /\b(?:get there|directions?|way to|bus|taxi|transport|pickup|pick us up|venir|chemin|bus|taxi|transport|abholen|weg|anfahrt)\b/iu },
];

/** Use narrow, explicit request words when a short clause is too small for the embedding model. */
export function applyExplicitRequestRule(text: string, result: ClassificationResult): ClassificationResult {
  const category = EXPLICIT_CATEGORY.find((rule) => rule.pattern.test(text))?.category;
  if (!category || result.label === category) return result;
  const categoryScore = result.scores[category] ?? result.best;
  const alternatives = (Object.entries(result.scores) as [Category, number][])
    .filter(([candidate]) => candidate !== category)
    .sort((a, b) => b[1] - a[1]);
  const second = alternatives[0];
  return {
    ...result,
    label: category,
    bestCategory: category,
    best: categoryScore,
    secondCategory: second?.[0] ?? result.secondCategory,
    second: second?.[1] ?? result.second,
  };
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
