// Rule-based request details, modelled on MASSIVE slot types
// (timeofday, date, food_type, people/group). Pure, deterministic, offline.
// Only the anonymous TAG is stored — never the matched words or the raw text.
export const DETAILS = ["morning", "afternoon", "evening", "weekend", "children", "group", "vegetarian"] as const;
export type Detail = (typeof DETAILS)[number];

const RULES: Record<Detail, RegExp> = {
  morning: /\b(morning|mornings|matin|matinée|morgens?|vormittags?|mañana por la mañana|por la mañana|mattin[ao]|mattinata|breakfast|petit[- ]déjeuner|frühstück|desayuno|colazione)\b/i,
  afternoon: /\b(afternoon|après-midi|nachmittags?|tarde|pomeriggio)\b/i,
  evening: /\b(evening|tonight|dinner|soir|soirée|dîner|abends?|abendessen|noche|cena|cenare|sera|stasera)\b/i,
  weekend: /\b(weekend|week-end|wochenende|fin de semana|fine settimana|saturday|sunday|samedi|dimanche|samstag|sonntag|sábado|domingo|sabato|domenica)\b/i,
  children: /\b(kids?|children|child|family|enfants?|famille|kinder|kind|familie|niños|hijos|familia|bambini|figli|famiglia)\b/i,
  group: /\b(group|groupe|gruppe|grupo|gruppo|(\d{1,2}|five|six|seven|eight|ten|twelve|cinq|fünf|zehn|cinco|cinque|dieci)\s+(people|persons|personnes|personen|leute|personas|persone))\b/i,
  vegetarian: /\b(vegetarian|vegan|végétarien(ne)?|végane?|vegetarisch|vegan|vegetariano|vegetariana|vegano)\b/i,
};

export function extractDetails(text: string): Detail[] {
  return DETAILS.filter((d) => RULES[d].test(text));
}

/** Counts each tag once per anonymous session; most frequent first. */
export function topDetails(records: { sessionId: string; details?: Detail[] }[]): { detail: Detail; count: number }[] {
  const per = new Map<Detail, Set<string>>();
  for (const r of records) for (const d of r.details ?? []) (per.get(d) ?? per.set(d, new Set()).get(d)!).add(r.sessionId);
  return [...per].map(([detail, s]) => ({ detail, count: s.size })).sort((a, b) => b.count - a.count);
}
