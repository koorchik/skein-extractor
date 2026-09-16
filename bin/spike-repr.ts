/**
 * SPIKE companion: offline representation study over the cached extractions of a spike run.
 *
 *   npm run spike-repr -- --run runs/spike/<dir> [--dims 768,3072] [--reprs kind+gloss,gloss,...]
 *
 * For every (representation × dimensionality): embed every extracted mention, then on the subset
 * aligned to the frozen gpt-5 hand categories report (a) same-category vs different-category
 * cosine distributions and (b) average-linkage clustering at several cutoffs scored against the
 * hand categories (ARI, B³ F1, cluster count). No LLM calls; embeddings are cached.
 */
import { averageLinkage, reprText } from './spike-schemes';
import { EmbeddingCache } from '../src/EmbeddingsClient/EmbeddingCache';
import { EmbeddingsBackendGemini } from '../src/EmbeddingsClient/EmbeddingsBackendGemini';
import { EmbeddingsClient } from '../src/EmbeddingsClient/EmbeddingsClient';
import { sortByNumericId } from '../src/utils/fsUtils';
import { cosineNormalized, l2Normalize } from '../src/utils/vectorUtils';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function normSurface(s: string): string {
  return s.normalize('NFKC').toLowerCase().replace(/[«»"'`“”‘’()\[\]{}<>,.;:!?]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Adjusted Rand index between two labelings. */
function ari(a: number[], b: number[]): number {
  const n = a.length;
  const table = new Map<string, number>();
  const ra = new Map<number, number>();
  const rb = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    table.set(`${a[i]}|${b[i]}`, (table.get(`${a[i]}|${b[i]}`) ?? 0) + 1);
    ra.set(a[i], (ra.get(a[i]) ?? 0) + 1);
    rb.set(b[i], (rb.get(b[i]) ?? 0) + 1);
  }
  const c2 = (x: number) => (x * (x - 1)) / 2;
  const sumIj = [...table.values()].reduce((s, v) => s + c2(v), 0);
  const sumA = [...ra.values()].reduce((s, v) => s + c2(v), 0);
  const sumB = [...rb.values()].reduce((s, v) => s + c2(v), 0);
  const expected = (sumA * sumB) / c2(n);
  const max = (sumA + sumB) / 2;
  return max === expected ? 1 : (sumIj - expected) / (max - expected);
}

/** B-cubed F1 of predicted labels against gold labels. */
function bcubed(pred: number[], gold: number[]): number {
  const n = pred.length;
  let p = 0;
  let r = 0;
  for (let i = 0; i < n; i++) {
    let samePred = 0;
    let sameGold = 0;
    let both = 0;
    for (let j = 0; j < n; j++) {
      const sp = pred[i] === pred[j];
      const sg = gold[i] === gold[j];
      if (sp) samePred += 1;
      if (sg) sameGold += 1;
      if (sp && sg) both += 1;
    }
    p += both / samePred;
    r += both / sameGold;
  }
  p /= n;
  r /= n;
  return p + r === 0 ? 0 : (2 * p * r) / (p + r);
}

async function main() {
  const runDir = arg('run');
  if (!runDir) throw new Error('--run <spike run dir> is required');
  const dimsList = (arg('dims') ?? '768,3072').split(',').map(Number);
  const reprs = (arg('reprs') ?? 'name+gloss,gloss,kind,kind+gloss,name+kind+gloss').split(',');
  const cutoffs = (arg('cutoffs') ?? '0.6,0.65,0.7,0.75,0.8,0.85').split(',').map(Number);
  /** hand = frozen gpt-5 categories (aligned subset only); kind = the extractor's own free-text kind phrase (all mentions). */
  const goldKind = (arg('gold') ?? 'hand') as 'hand' | 'kind';
  const printSpec = arg('print'); // e.g. kind@0.8 — print the clusters of one configuration
  const frozenDir = process.env.SPIKE_FROZEN || 'data/extractions/gpt-5';
  const model = process.env.SPIKE_EMBED_MODEL || 'gemini-embedding-2';
  const taskType = process.env.SPIKE_EMBED_TASK || 'CLUSTERING';

  // mentions with hand category (aligned subset only)
  const files = sortByNumericId(await fs.readdir(path.join(runDir, 'extractions')));
  const items: Array<{ name: string; kind: string; gloss: string; category: string }> = [];
  for (const file of files) {
    const ex = JSON.parse(await fs.readFile(path.join(runDir, 'extractions', file), 'utf8'));
    let frozen: Array<{ name: string; category: string }> = [];
    try {
      frozen = JSON.parse(await fs.readFile(path.join(frozenDir, file), 'utf8')).entities;
    } catch {
      continue;
    }
    const index = frozen.map((f) => ({ key: normSurface(f.name), category: f.category }));
    const seen = new Set<string>();
    for (const e of ex.entities) {
      const key = normSurface(e.name);
      if (seen.has(key)) continue;
      seen.add(key);
      const hit = index.find((f) => f.key === key) ?? index.find((f) => key.length >= 4 && f.key.length >= 4 && (f.key.includes(key) || key.includes(f.key)));
      if (goldKind === 'kind') items.push({ name: e.name, kind: e.kind ?? '', gloss: e.gloss ?? '', category: String(e.kind ?? '').toLowerCase() });
      else if (hit) items.push({ name: e.name, kind: e.kind ?? '', gloss: e.gloss ?? '', category: hit.category });
    }
  }
  const cats = [...new Set(items.map((i) => i.category))];
  const gold = items.map((i) => cats.indexOf(i.category));
  console.log(`${items.length} mentions over ${cats.length} ${goldKind} categories: ${cats.map((c) => `${c}=${gold.filter((g) => g === cats.indexOf(c)).length}`).join(', ')}`);

  const rows: string[] = [];
  for (const dims of dimsList) {
    const client = new EmbeddingsClient({
      backend: new EmbeddingsBackendGemini({ model, apiKey: process.env.GEMINI_API_KEY!, taskType }),
      cache: new EmbeddingCache({ dir: process.env.EMBEDDINGS_CACHE || 'runs/embeddings-cache', provider: 'gemini', model: `${model}@${taskType}@${dims}` }),
    });
    // kind-phrase similarity matrix for the most frequent kinds (picks the kind cutoff by eye)
    if (dims === dimsList[0]) {
      const kindCount = new Map<string, number>();
      for (const i of items) kindCount.set(i.kind, (kindCount.get(i.kind) ?? 0) + 1);
      const top = [...kindCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k]) => k);
      const kv = (await client.embed(top, { dimensions: dims })).map(l2Normalize);
      console.log('--- kind-phrase cosine matrix (top kinds)');
      console.log('   ' + top.map((k) => k.slice(0, 10).padEnd(11)).join(''));
      top.forEach((k, i) => console.log(k.slice(0, 22).padEnd(24) + kv.map((v) => cosineNormalized(kv[i], v).toFixed(2).padEnd(11)).join('')));
    }
    for (const repr of reprs) {
      let vecs: number[][];
      let simFn: (i: number, j: number) => number;
      if (repr.startsWith('combo:')) {
        // weighted sum of kind-phrase cosine and gloss cosine; α weights the kind phrase
        const alpha = Number(repr.slice(6));
        const kv = (await client.embed(items.map((i) => i.kind), { dimensions: dims })).map(l2Normalize);
        const gv = (await client.embed(items.map((i) => i.gloss), { dimensions: dims })).map(l2Normalize);
        // concatenation with weights sqrt(α), sqrt(1-α) makes the dot product exactly the weighted sum
        vecs = kv.map((k, i) => [...k.map((x) => x * Math.sqrt(alpha)), ...gv[i].map((x) => x * Math.sqrt(1 - alpha))]);
        simFn = (i, j) => cosineNormalized(vecs[i], vecs[j]);
      } else {
        vecs = (await client.embed(items.map((i) => reprText(repr, i)), { dimensions: dims })).map(l2Normalize);
        simFn = (i, j) => cosineNormalized(vecs[i], vecs[j]);
      }
      const same: number[] = [];
      const diff: number[] = [];
      for (let i = 0; i < vecs.length; i++) {
        for (let j = i + 1; j < vecs.length; j++) {
          (gold[i] === gold[j] ? same : diff).push(simFn(i, j));
        }
      }
      const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
      const sd = (xs: number[]) => Math.sqrt(mean(xs.map((x) => (x - mean(xs)) ** 2)));
      const dPrime = (mean(same) - mean(diff)) / Math.sqrt((sd(same) ** 2 + sd(diff) ** 2) / 2);
      let best = { cutoff: 0, ari: -1, b3: 0, k: 0 };
      const perCut: string[] = [];
      for (const cutoff of cutoffs) {
        const clusters = averageLinkage(vecs, cutoff);
        const pred = new Array(vecs.length).fill(0);
        clusters.forEach((c, ci) => c.forEach((i) => (pred[i] = ci)));
        const a = ari(pred, gold);
        const b3 = bcubed(pred, gold);
        perCut.push(`@${cutoff}: k=${clusters.length} ARI=${a.toFixed(3)} B3=${b3.toFixed(3)}`);
        if (printSpec === `${repr}@${cutoff}` && dims === dimsList[0]) {
          console.log(`--- clusters for ${printSpec} (dims ${dims})`);
          for (const c of clusters) {
            const kinds = new Map<string, number>();
            for (const i of c) kinds.set(items[i].kind, (kinds.get(items[i].kind) ?? 0) + 1);
            const cats2 = new Map<string, number>();
            for (const i of c) cats2.set(items[i].category, (cats2.get(items[i].category) ?? 0) + 1);
            console.log(`  [${c.length}] kinds: ${[...kinds.entries()].sort((x, y) => y[1] - x[1]).map(([k, n]) => `${k}×${n}`).join(', ')} | names: ${c.slice(0, 6).map((i) => items[i].name).join('; ')}`);
          }
        }
        if (a > best.ari) best = { cutoff, ari: a, b3, k: clusters.length };
      }
      const line = `dims=${dims} repr=${repr.padEnd(16)} same=${mean(same).toFixed(3)}±${sd(same).toFixed(3)} diff=${mean(diff).toFixed(3)}±${sd(diff).toFixed(3)} d'=${dPrime.toFixed(2)} | best @${best.cutoff}: k=${best.k} ARI=${best.ari.toFixed(3)} B3=${best.b3.toFixed(3)}`;
      console.log(line);
      console.log('   ' + perCut.join('  '));
      rows.push(line);
    }
  }
  await fs.writeFile(path.join(runDir, 'repr-study.txt'), rows.join('\n') + '\n');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
