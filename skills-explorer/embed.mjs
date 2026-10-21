// Embeds every job title with the exact model the browser demo uses (transformers.js, quantized all-MiniLM-L6-v2),
// then measures candidate methods honestly with leave-one-out: hide one job ad, suggest 10 skills for its title from
// the *other* ads, and compare with its real skill list. The best method that works from a title alone is used in
// the demo (its settings go to eval.json). Usage: node embed.mjs (reads jobs.json)
import { pipeline } from "@huggingface/transformers";
import fs from "node:fs";

const TOP = 10, dim = 384;
const jobs = JSON.parse(fs.readFileSync("jobs.json", "utf8"));
const embed = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", { dtype: "q8" });
const all = new Float32Array(jobs.length * dim);
for (let i = 0; i < jobs.length; i++) all.set((await embed(jobs[i].t, { pooling: "mean", normalize: true })).data, i * dim);
fs.writeFileSync("embeddings.bin", Buffer.from(all.buffer));

const top = m => [...m].sort((a, b) => b[1] - a[1]).slice(0, TOP).map(([s]) => s);
const add = (m, s, w) => m.set(s, (m.get(s) || 0) + w);
// Skill shares per category, without job `skip`.
function catShares(cat, skip) {
  const m = new Map(); let n = 0;
  jobs.forEach((j, i) => { if (i !== skip && j.c === cat) { n++; for (const s of j.s) add(m, s, 1); } });
  for (const [s, c] of m) m.set(s, c / n);
  return m;
}
// near = [[similarity, index]] of the K most similar other ads. Same logic as index.html.
function suggest(near, w, skip) {
  const m = new Map(), votes = new Map();
  for (const [, i] of near) { for (const s of jobs[i].s) add(m, s, 1 / near.length); add(votes, jobs[i].c, 1); }
  if (w > 0) { const cat = top(votes)[0]; for (const [s, v] of catShares(cat, skip)) add(m, s, w * v); }
  return top(m);
}

const methods = { "category (true area, not available from a title)": [] };
for (const k of [5, 10, 25]) for (const w of [0, 1]) methods[`similar k=${k} w=${w}`] = [];
for (let i = 0; i < jobs.length; i++) {
  const order = jobs.map((_, j) => { let s = 0; for (let d = 0; d < dim; d++) s += all[i * dim + d] * all[j * dim + d]; return [s, j]; })
    .filter(([, j]) => j !== i).sort((a, b) => b[0] - a[0]);
  const truth = new Set(jobs[i].s);
  const hit = pred => [pred.filter(s => truth.has(s)).length / TOP, pred.filter(s => truth.has(s)).length / truth.size];
  methods["category (true area, not available from a title)"].push(hit(top(catShares(jobs[i].c, i))));
  for (const k of [5, 10, 25]) for (const w of [0, 1]) methods[`similar k=${k} w=${w}`].push(hit(suggest(order.slice(0, k), w, i)));
}
const result = { jobs: jobs.length, skills: new Set(jobs.flatMap(j => j.s)).size, methods: {} };
for (const [name, rows] of Object.entries(methods))
  result.methods[name] = { precision_at_10: +(rows.reduce((a, r) => a + r[0], 0) / rows.length).toFixed(3), recall_at_10: +(rows.reduce((a, r) => a + r[1], 0) / rows.length).toFixed(3) };
const best = Object.keys(result.methods).filter(n => n.startsWith("similar")).sort((a, b) => result.methods[b].precision_at_10 - result.methods[a].precision_at_10)[0];
const [, k, w] = best.match(/k=(\d+) w=(\d+)/);
result.demo = { method: best, k: +k, w: +w, ...result.methods[best] };
fs.writeFileSync("eval.json", JSON.stringify(result));
fs.writeFileSync("jobs.min.json", JSON.stringify(jobs.map(j => [j.t, j.c, j.s])));
console.log("Leave-one-out evaluation:", JSON.stringify(result, null, 1));
