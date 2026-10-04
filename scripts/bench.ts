// Offline test bench for the visitor classifier.
// Run:  bun scripts/bench.ts [--protos=base|all] [--out=bench/RESULTS.md]
// Uses the SAME model, prefix, pooling and pure decision rule as the app
// (classifier.ts), downloaded once to a local cache. Nothing ships to users.
import { pipeline, env } from "@huggingface/transformers";
import { writeFileSync, mkdirSync } from "node:fs";
import { CATEGORIES, prototypeList } from "../src/lib/taxonomy";
import { BENCH, BENCH_LANGS, type BenchLang } from "../src/lib/bench-set";
import { TEST_SET } from "../src/lib/test-set";
import { scoreCategories, decide, e5, DEFAULT_THRESHOLDS, type ProtoVec, type Thresholds } from "../src/lib/classifier";

const arg = (k: string, d: string) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const which = arg("protos", "all") as "base" | "all";
const out = arg("out", "");
const set = arg("set", "bench") as "bench" | "test";
env.cacheDir = process.env.BENCH_CACHE ?? "/tmp/hs-bench-cache";

const embedder = await pipeline("feature-extraction", "Xenova/multilingual-e5-small", { dtype: "q8" });
async function embed(texts: string[]): Promise<number[][]> {
  const res: number[][] = [];
  for (let i = 0; i < texts.length; i += 32) {
    const o = await embedder(texts.slice(i, i + 32).map(e5), { pooling: "mean", normalize: true });
    res.push(...(o.tolist() as number[][]));
  }
  return res;
}

const list = prototypeList().filter((p) => which === "all" || p.source === "synthetic");
const pv = await embed(list.map((p) => p.text));
const protos: ProtoVec[] = list.map((p, i) => ({ category: p.category, vec: pv[i]! }));

type Row = { lang: BenchLang; expected: string; best: string; second: number; bestScore: number };
const rows: Row[] = [];
if (set === "test") {
  const vecs = await embed(TEST_SET.map((t) => t.text));
  vecs.forEach((v, i) => {
    const d = decide(scoreCategories(v, protos), { minScore: 0, minMargin: 0 });
    rows.push({ lang: TEST_SET[i]!.lang, expected: TEST_SET[i]!.expected, best: d.bestCategory, bestScore: d.best, second: d.second });
  });
} else for (const lang of BENCH_LANGS) {
  const vecs = await embed(BENCH.map((b) => b.text[lang]));
  vecs.forEach((v, i) => {
    const s = scoreCategories(v, protos);
    const d = decide(s, { minScore: 0, minMargin: 0 });
    rows.push({ lang, expected: BENCH[i]!.expected, best: d.bestCategory, bestScore: d.best, second: d.second });
  });
}

const evalAt = (rs: Row[], t: Thresholds) => {
  let correct = 0, wrong = 0, unsure = 0;
  for (const r of rs) {
    const sure = r.bestScore >= t.minScore && r.bestScore - r.second >= t.minMargin;
    if (!sure) unsure++; else if (r.best === r.expected) correct++; else wrong++;
  }
  return { correct, wrong, unsure, n: rs.length };
};
const pct = (a: number, n: number) => `${((100 * a) / n).toFixed(0)}%`;

// Sweep: pick per-language thresholds that keep wrong answers ≤ 5%, maximising correct.
function best(rs: Row[]): Thresholds & { correct: number; wrong: number } {
  let b = { ...DEFAULT_THRESHOLDS, correct: -1, wrong: 0 };
  for (let s = 0.8; s <= 0.9; s += 0.005)
    for (let m = 0; m <= 0.03; m += 0.002) {
      const e = evalAt(rs, { minScore: s, minMargin: m });
      if (e.wrong / e.n <= 0.05 && e.correct > b.correct) b = { minScore: +s.toFixed(3), minMargin: +m.toFixed(3), correct: e.correct, wrong: e.wrong };
    }
  return b;
}

const lines: string[] = [];
lines.push(set === "test" ? `# Separate test set` : `# Classifier test bench`, ``, set === "test"
  ? `Prototypes: **${which}** (${list.length} examples). Test set: ${TEST_SET.length} held-out messages (EN/FR/DE incl. off-topic), never used for tuning.`
  : `Prototypes: **${which}** (${list.length} examples). Bench: ${BENCH.length} aligned sentences × ${BENCH_LANGS.length} languages.`, ``);
lines.push(`Accuracy = correct among answered messages; "Not sure" = share withheld by the rule.`, ``);
lines.push(`## With current defaults (minScore ${DEFAULT_THRESHOLDS.minScore}, minMargin ${DEFAULT_THRESHOLDS.minMargin})`, ``);
lines.push(`| Lang | Correct | Wrong | Not sure | Accuracy when answered | Top-1 (no rule) |`, `|---|---|---|---|---|---|`);
for (const lang of [...BENCH_LANGS, "all"] as const) {
  const rs = lang === "all" ? rows : rows.filter((r) => r.lang === lang);
  const e = evalAt(rs, DEFAULT_THRESHOLDS);
  const top1 = rs.filter((r) => r.best === r.expected).length;
  lines.push(`| ${lang} | ${pct(e.correct, e.n)} | ${pct(e.wrong, e.n)} | ${pct(e.unsure, e.n)} | ${e.correct + e.wrong ? pct(e.correct, e.correct + e.wrong) : "–"} | ${pct(top1, e.n)} |`);
}
lines.push(``, `## Suggested thresholds per language (wrong ≤ 5%)`, ``, `| Lang | minScore | minMargin | Correct | Wrong |`, `|---|---|---|---|---|`);
for (const lang of BENCH_LANGS) {
  const rs = rows.filter((r) => r.lang === lang);
  const b = best(rs);
  lines.push(`| ${lang} | ${b.minScore} | ${b.minMargin} | ${pct(b.correct, rs.length)} | ${pct(b.wrong, rs.length)} |`);
}
lines.push(``, `## Confusions (top-1, ignoring the not-sure rule)`, ``);
for (const r of rows) if (r.best !== r.expected) lines.push(`- ${r.lang}: expected ${r.expected}, got ${r.best} (${r.bestScore.toFixed(3)}, margin ${(r.bestScore - r.second).toFixed(3)})`);
void CATEGORIES;

const md = lines.join("\n") + "\n";
console.log(md);
if (out) { mkdirSync("bench", { recursive: true }); writeFileSync(out, md); }
