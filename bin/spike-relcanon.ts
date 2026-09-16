/**
 * SPIKE companion: offline relation-type canonicalization study over a relation-blind run.
 *
 *   npm run spike-relcanon -- --run runs/spike/<relblind run> [--cutoff 0.85]
 *
 * Question: does "phrase similarity AND compatible argument signature" merge the free relation
 * phrases better than phrase similarity alone? Each raw phrase gets (a) an embedding of
 * "phrase: definition" (cache hits from the run) and (b) a signature = distribution of
 * (head scheme, tail scheme) over its triples. Two phrases are merged by average linkage on
 * cos(phrase) if their dominant signatures agree on head and tail scheme (pool/unknown counts as
 * agreeing), and on cos(phrase) − penalty otherwise. Zero LLM calls.
 */
import { averageLinkage } from './spike-schemes';
import { EmbeddingCache } from '../src/EmbeddingsClient/EmbeddingCache';
import { EmbeddingsBackendGemini } from '../src/EmbeddingsClient/EmbeddingsBackendGemini';
import { EmbeddingsClient } from '../src/EmbeddingsClient/EmbeddingsClient';
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

async function main() {
  const runDir = arg('run');
  if (!runDir) throw new Error('--run <run dir> required');
  const cutoff = Number(arg('cutoff') ?? '0.85');
  const penalty = Number(arg('penalty') ?? '0.25');

  const mentions: Array<{ id: string; doc: number; name: string; scheme: string | null }> = JSON.parse(await fs.readFile(path.join(runDir, 'mentions.json'), 'utf8'));
  // scheme centroids (combined kind+gloss vectors) for the soft signature variant
  const embById = new Map((JSON.parse(await fs.readFile(path.join(runDir, 'embeddings.json'), 'utf8')) as Array<{ id: string; v: number[] }>).map((e) => [e.id, e.v]));
  const schemes: Array<{ id: string; prefLabel: string }> = JSON.parse(await fs.readFile(path.join(runDir, 'schemes.json'), 'utf8')).schemes;
  const label = new Map(schemes.map((s) => [s.id, s.prefLabel]));
  const centroid = new Map<string, number[]>();
  for (const sch of schemes) {
    const vs = mentions.filter((m) => m.scheme === sch.id).map((m) => embById.get(m.id)!).filter(Boolean);
    if (vs.length) centroid.set(sch.prefLabel, l2Normalize(vs[0].map((_, j) => vs.reduce((acc, v) => acc + v[j], 0) / vs.length)));
  }
  /** similarity of two scheme labels: 1 if equal or either is pool/unknown, else centroid cosine */
  const schemeSim = (a: string, b: string) => (a === b || a.startsWith('(') || b.startsWith('(') ? 1 : centroid.has(a) && centroid.has(b) ? cosineNormalized(centroid.get(a)!, centroid.get(b)!) : 0.5);
  const schemeOf = new Map(mentions.map((m) => [`${m.doc}|${normSurface(m.name)}`, m.scheme ? label.get(m.scheme)! : '(pool)']));

  // raw phrases, definitions, signatures
  const defs = new Map<string, string>();
  const sig = new Map<string, Map<string, number>>();
  const count = new Map<string, number>();
  const files = (await fs.readdir(path.join(runDir, 'extractions'))).filter((f) => f.endsWith('.json'));
  for (const file of files) {
    const ex = JSON.parse(await fs.readFile(path.join(runDir, 'extractions', file), 'utf8'));
    const docId = parseInt(file, 10);
    for (const t of ex.newRelationTypes ?? []) {
      const k = String(t.name).trim().toLowerCase().replace(/\s+/g, '-');
      if (!defs.has(k) && t.definition) defs.set(k, t.definition);
    }
    for (const r of ex.relations ?? []) {
      const k = String(r.type).trim().toLowerCase().replace(/\s+/g, '-');
      count.set(k, (count.get(k) ?? 0) + 1);
      const h = schemeOf.get(`${docId}|${normSurface(r.head)}`) ?? '(unknown)';
      const t = schemeOf.get(`${docId}|${normSurface(r.tail)}`) ?? '(unknown)';
      const s = sig.get(k) ?? new Map();
      s.set(`${h}→${t}`, (s.get(`${h}→${t}`) ?? 0) + 1);
      sig.set(k, s);
    }
  }
  const phrases = [...count.keys()].sort((a, b) => count.get(b)! - count.get(a)!);
  const dominant = (k: string) => [...(sig.get(k) ?? new Map()).entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '(unknown)→(unknown)';
  const compatible = (a: string, b: string) => {
    const [ha, ta] = dominant(a).split('→');
    const [hb, tb] = dominant(b).split('→');
    const ok = (x: string, y: string) => x === y || x.startsWith('(') || y.startsWith('(');
    return ok(ha, hb) && ok(ta, tb);
  };

  const model = process.env.SPIKE_EMBED_MODEL || 'gemini-embedding-2';
  const taskType = process.env.SPIKE_EMBED_TASK || 'CLUSTERING';
  const dims = Number(process.env.SPIKE_DIMS || 768);
  const client = new EmbeddingsClient({
    backend: new EmbeddingsBackendGemini({ model, apiKey: process.env.GEMINI_API_KEY!, taskType }),
    cache: new EmbeddingCache({ dir: process.env.EMBEDDINGS_CACHE || 'runs/embeddings-cache', provider: 'gemini', model: `${model}@${taskType}@${dims}` }),
  });
  const vecs = (await client.embed(phrases.map((k) => `${k}: ${defs.get(k) || k}`), { dimensions: dims })).map(l2Normalize);
  console.log(`${phrases.length} raw phrases, ${[...count.values()].reduce((a, b) => a + b, 0)} triples; embedding cache: ${JSON.stringify(client.cacheStats)}`);

  // Two similarity matrices → average linkage over a precomputed matrix. averageLinkage takes
  // vectors, so build both variants as explicit clusterings on a similarity matrix here.
  const n = phrases.length;
  const cluster = (simAt: (i: number, j: number) => number) => {
    let clusters: number[][] = phrases.map((_, i) => [i]);
    const link = (a: number[], b: number[]) => {
      let total = 0;
      for (const i of a) for (const j of b) total += simAt(i, j);
      return total / (a.length * b.length);
    };
    for (;;) {
      let best = -1;
      let bi = -1;
      let bj = -1;
      for (let i = 0; i < clusters.length; i++) for (let j = i + 1; j < clusters.length; j++) {
        const l = link(clusters[i], clusters[j]);
        if (l > best) { best = l; bi = i; bj = j; }
      }
      if (best < cutoff || bi < 0) break;
      const merged = [...clusters[bi], ...clusters[bj]];
      clusters = clusters.filter((_, idx) => idx !== bi && idx !== bj);
      clusters.push(merged);
    }
    return clusters.sort((a, b) => b.length - a.length);
  };
  const phraseOnly = cluster((i, j) => cosineNormalized(vecs[i], vecs[j]));
  const withSig = cluster((i, j) => cosineNormalized(vecs[i], vecs[j]) - (compatible(phrases[i], phrases[j]) ? 0 : penalty));
  // soft: penalty scales with how dissimilar the head and tail schemes are (min over head/tail)
  const softCompat = (a: string, b: string) => {
    const [ha, ta] = dominant(a).split('→');
    const [hb, tb] = dominant(b).split('→');
    return Math.min(schemeSim(ha, hb), schemeSim(ta, tb));
  };
  const withSoft = cluster((i, j) => cosineNormalized(vecs[i], vecs[j]) - penalty * (1 - softCompat(phrases[i], phrases[j])));

  const show = (title: string, clusters: number[][]) => {
    console.log(`\n=== ${title}: ${clusters.length} canonical types (cutoff ${cutoff})`);
    for (const c of clusters) {
      const total = c.reduce((s, i) => s + count.get(phrases[i])!, 0);
      const sigs = new Set(c.map((i) => dominant(phrases[i])));
      const flag = sigs.size > 1 ? '  ⚠ mixed signatures: ' + [...sigs].join(' | ') : '';
      console.log(`  [${total}] ${c.map((i) => `${phrases[i]}×${count.get(phrases[i])}`).join(', ')}${flag}`);
    }
  };
  show('phrase similarity only', phraseOnly);
  show('phrase similarity + argument signature (exact)', withSig);
  show('phrase similarity + soft signature (centroid similarity of argument schemes)', withSoft);
  console.log('\nscheme centroid cosines: ' + [...centroid.keys()].flatMap((a, i, arr) => arr.slice(i + 1).map((b) => `${a}~${b}=${cosineNormalized(centroid.get(a)!, centroid.get(b)!).toFixed(2)}`)).filter((x) => /Malware|File/.test(x)).join(', '));
  void averageLinkage; // imported for parity with spike-repr; the matrix variant above is used
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
