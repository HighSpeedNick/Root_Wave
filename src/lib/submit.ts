import { classifyText } from "./ai";
import { addFeedback, getSettings } from "./db";
import type { FeedbackRecord } from "./opportunity";
import type { VisitorLang } from "./taxonomy";
import { extractDetails } from "./details";
import { combineRequests, splitRequests } from "./requests";

/** Classify locally and store only minimal records (no raw text, no identity).
 *  A message with several requests becomes one record per distinct category,
 *  all sharing the visitor's anonymous session, so each counts once per category. */
export async function submitFeedback(text: string, language: VisitorLang, sessionId: string, inputMode: "text" | "voice") {
  const s = await getSettings();
  const whole = await classifyText(text, s);
  const parts = splitRequests(text);
  const partResults = parts.length > 1 ? await Promise.all(parts.map((p) => classifyText(p, s))) : [whole];
  const { results } = combineRequests(partResults, whole);
  const ts = Date.now();
  const recs: FeedbackRecord[] = results.map((r) => {
    const src = parts.length > 1 ? parts[partResults.indexOf(r)] ?? text : text;
    return {
      id: crypto.randomUUID(),
      sessionId,
      label: r.label,
      score: r.best,
      secondCategory: r.secondCategory,
      second: r.second,
      language,
      inputMode,
      ts,
      details: r.label === "not_sure" ? [] : extractDetails(src),
    };
  });
  for (const rec of recs) await addFeedback(rec);
  return { recs, rec: recs[0]!, result: results[0]! };
}
