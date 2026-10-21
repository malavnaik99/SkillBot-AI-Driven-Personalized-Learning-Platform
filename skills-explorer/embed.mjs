// Embeds every job title with the exact model the browser demo uses (transformers.js, quantized all-MiniLM-L6-v2),
// then measures the demo's method honestly with leave-one-out: hide one job, predict its skills from the
// 5 most similar *other* job titles, and compare with its real skill list. Baseline: the 10 most common
// skills in the job's own category. Usage: node embed.mjs (reads jobs.json)
import { pipeline } from "@huggingface/transformers";
import fs from "node:fs";

const K = 5, TOP = 10, dim = 384;
const jobs = JSON.parse(fs.readFileSync("jobs.json", "utf8"));
const embed = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { dtype: "q8" });
const all = new Float32Array(jobs.length * dim);
for (let i = 0; i < jobs.length; i++) all.set((await embed(jobs[i].t, { pooling: "mean", normalize: true })).data, i * dim);
fs.writeFileSync("embeddings.bin", Buffer.from(all.buffer));

// Same as the demo: top K similar jobs, skills ranked by how many of them list it.
function predict(sims, skip) {
  const near = sims.map((s, i) => [s, i]).filter(([, i]) => i !== skip).sort((a, b) => b[0] - a[0]).slice(0, K);
  const count = new Map();
  for (const [, i] of near) for (const s of jobs[i].s) count.set(s, (count.get(s) || 0) + 1);
  return [...count].sort((a, b) => b[1] - a[1]).slice(0, TOP).map(([s]) => s);
}
const score = (pred, truth) => { const hit = pred.filter(s => truth.includes(s)).length; return [hit / TOP, hit / truth.length]; };

const totals = { similar: [0, 0], category: [0, 0] };
for (let i = 0; i < jobs.length; i++) {
  const sims = jobs.map((_, j) => { let s = 0; for (let d = 0; d < dim; d++) s += all[i * dim + d] * all[j * dim + d]; return s; });
  const cat = new Map();
  jobs.forEach((j, n) => { if (n !== i && j.c === jobs[i].c) for (const s of j.s) cat.set(s, (cat.get(s) || 0) + 1); });
  const base = [...cat].sort((a, b) => b[1] - a[1]).slice(0, TOP).map(([s]) => s);
  for (const [name, pred] of [["similar", predict(sims, i)], ["category", base]]) {
    const [p, r] = score(pred, jobs[i].s); totals[name][0] += p; totals[name][1] += r;
  }
}
const result = { jobs: jobs.length, k: K, top: TOP };
for (const [name, [p, r]] of Object.entries(totals)) result[name] = { precision_at_10: +(p / jobs.length).toFixed(3), recall_at_10: +(r / jobs.length).toFixed(3) };
fs.writeFileSync("eval.json", JSON.stringify(result));
fs.writeFileSync("jobs.min.json", JSON.stringify(jobs.map(j => [j.t, j.c, j.s])));
console.log("Leave-one-out evaluation:", JSON.stringify(result));
