/**
 * SPIKE (2026-09-16): emergent concept-scheme discovery on a short CERT-UA prefix.
 *
 *   npm run spike-schemes                      # first 20 reports, Gemini stack
 *   SPIKE_DOCS=20 SPIKE_TAU=0.6 npm run spike-schemes -- --out runs/spike/my-run
 *
 * Per document: one category-blind, role-free extraction call (entities with an English gloss,
 * relations with an in-context relation inventory) → embed "name: gloss" (gemini-embedding-2,
 * taskType CLUSTERING) → kNN vote against the members of existing schemes → assign, or pool →
 * pool clustering (single linkage) → a pool cluster spanning ≥ SPIKE_MASS documents gets ONE
 * naming call (new scheme | alias of an existing one). Everything is prefix-causal: no step looks
 * past the current document.
 *
 * Spike doctrine: this file is throwaway-grade. Extraction outputs are cached per document under
 * <out>/extractions so thresholds can be re-tuned without re-calling the LLM; embeddings go
 * through the shared EmbeddingCache. Nothing here touches skein-resolver.
 */
import { EmbeddingCache } from '../src/EmbeddingsClient/EmbeddingCache';
import { EmbeddingsBackendGemini } from '../src/EmbeddingsClient/EmbeddingsBackendGemini';
import { EmbeddingsClient } from '../src/EmbeddingsClient/EmbeddingsClient';
import { CostMeter } from '../src/Experiment/CostMeter';
import { LlmCallLog } from '../src/LlmClient/LlmCallLog';
import { LlmClient } from '../src/LlmClient/LlmClient';
import { createLlmBackend } from '../src/LlmClient/createBackend';
import { prompts } from '../src/Normalization/PromptProvider';
import { writeRunReadme } from '../src/RunReadme/runReadme';
import { ensureDir, sortByNumericId, writeJsonAtomic } from '../src/utils/fsUtils';
import { extractAndParseJson } from '../src/utils/validationUtils';
import { cosineNormalized, l2Normalize, meanPool } from '../src/utils/vectorUtils';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}
const num = (v: string | undefined, d: number) => (v === undefined || v === '' ? d : Number(v));

const CONFIG = {
  docs: num(process.env.SPIKE_DOCS, 20),
  /** skip this many documents of the numeric-id stream before taking `docs` (mid-corpus slices) */
  offset: num(process.env.SPIKE_OFFSET, 0),
  inputDir: process.env.SPIKE_INPUT || 'data/fetched',
  frozenDir: process.env.SPIKE_FROZEN || 'data/extractions/gpt-5',
  llmProvider: process.env.SPIKE_LLM_PROVIDER || 'gemini',
  llmModel: process.env.SPIKE_LLM_MODEL || 'gemini-3.7-flash',
  embedModel: process.env.SPIKE_EMBED_MODEL || 'gemini-embedding-2',
  embedTaskType: process.env.SPIKE_EMBED_TASK || 'CLUSTERING',
  embedDims: num(process.env.SPIKE_DIMS, 768),
  k: num(process.env.SPIKE_K, 10),
  tau: num(process.env.SPIKE_TAU, 0.78), // neighbours below this similarity never vote (combo scale)
  delta: num(process.env.SPIKE_DELTA, 0.1), // min vote-share margin over the runner-up scheme
  poolLink: num(process.env.SPIKE_POOL_LINK, 0.8), // average-linkage cutoff inside the pool (combo scale)
  mass: num(process.env.SPIKE_MASS, 3), // distinct documents a pool cluster needs before naming
  relMerge: num(process.env.SPIKE_REL_MERGE, 0.85), // relation-type near-duplicate cutoff
  /**
   * Mention representation: `combo` = weighted concatenation of the kind-phrase embedding (weight α)
   * and the gloss embedding (1−α), so cosine = α·cos(kind) + (1−α)·cos(gloss); chosen by the
   * offline study (bin/spike-repr.ts, 2026-09-16: d' 5.7 vs ≤ 0.8 for any single text).
   * Any other value is a single-text representation from reprText().
   */
  repr: process.env.SPIKE_REPR || 'combo',
  alpha: num(process.env.SPIKE_ALPHA, 0.7),
  /**
   * Kind-first assignment (0 = off): if the mention's kind phrase has cosine ≥ this value to one
   * of the scheme's dominant kind phrases (the kinds carried by ≥ 20% of its members), assign
   * directly, before the combined-vector kNN vote. Motivated by the spike: vendors were absorbed
   * into Software Product through product glosses that name the vendor, while their kind phrase
   * ("software vendor") matched no product kind.
   */
  kindFirst: num(process.env.SPIKE_KIND_FIRST, 0),
  /** In-context arm (E5): render the current scheme list into the extraction prompt (extract-open-icl-v1). */
  icl: process.env.SPIKE_ICL === '1',
  /** Relation-blind arm (E7): no relation inventory in the prompt; free verb phrases, canonicalized post hoc (extract-open-relblind-v1). */
  relBlind: process.env.SPIKE_REL_BLIND === '1',
  out: arg('out') || process.env.SPIKE_OUT || '',
  cacheDir: process.env.EMBEDDINGS_CACHE || 'runs/embeddings-cache',
};

// ---------- types ----------
interface Mention {
  id: string;
  doc: number;
  name: string;
  kind: string;
  gloss: string;
  scheme: string | null;
  /** assignment history: state after each change, in stream order */
  assign: Array<{ doc: number; scheme: string | null; how: string; score?: number }>;
  category: string | null; // frozen hand category via surface alignment (overlay only)
}
interface Scheme {
  id: string;
  prefLabel: string;
  definition: string;
  altLabels: string[];
  born: number;
  members: string[];
  history: Array<{ doc: number; op: string; detail: string }>;
}
interface RelationType {
  name: string;
  definition: string;
  born: number;
  count: number;
  aliases: string[];
}
interface Extraction {
  entities: Array<{ name: string; kind: string; gloss: string }>;
  relations: Array<{ head: string; type: string; tail: string; evidence: string }>;
  newRelationTypes: Array<{ name: string; definition: string }>;
}

// ---------- helpers ----------
function normSurface(s: string): string {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[«»"'`“”‘’()\[\]{}<>,.;:!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function reprText(repr: string, e: { name: string; kind: string; gloss: string }): string {
  switch (repr) {
    case 'name+gloss':
      return `${e.name}: ${e.gloss}`;
    case 'gloss':
      return e.gloss;
    case 'kind':
      return e.kind;
    case 'kind+gloss':
      return `${e.kind}. ${e.gloss}`;
    case 'name+kind+gloss':
      return `${e.name} (${e.kind}): ${e.gloss}`;
    default:
      throw new Error(`unknown SPIKE_REPR ${repr}`);
  }
}

/**
 * Average-linkage agglomerative clustering with a similarity cutoff (merge while the best pair of
 * clusters has mean pairwise similarity ≥ cutoff). Single linkage chained the whole pool into one
 * cluster on the smoke run; average linkage is the standard remedy and the pool is small.
 */
export function averageLinkage(vecs: number[][], cutoff: number): number[][] {
  const n = vecs.length;
  const sim: number[][] = vecs.map((a) => vecs.map((b) => cosineNormalized(a, b)));
  let clusters: number[][] = vecs.map((_, i) => [i]);
  const linkage = (a: number[], b: number[]) => {
    let total = 0;
    for (const i of a) for (const j of b) total += sim[i][j];
    return total / (a.length * b.length);
  };
  for (;;) {
    let best = -1;
    let bi = -1;
    let bj = -1;
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const l = linkage(clusters[i], clusters[j]);
        if (l > best) {
          best = l;
          bi = i;
          bj = j;
        }
      }
    }
    if (best < cutoff || bi < 0) break;
    const merged = [...clusters[bi], ...clusters[bj]];
    clusters = clusters.filter((_, idx) => idx !== bi && idx !== bj);
    clusters.push(merged);
  }
  return clusters.sort((a, b) => b.length - a.length);
}

/**
 * The free-form reasoning may contain braces despite the instruction, which makes the greedy
 * first-brace match unparseable (doc 2660 on the first spike run). Try each `{` as a start until
 * one yields an object with an `entities` array.
 */
function parseExtraction(text: string): Partial<Extraction> | undefined {
  const first = extractAndParseJson(text) as Partial<Extraction> | undefined;
  if (first && Array.isArray(first.entities)) return first;
  const end = text.lastIndexOf('}');
  let start = text.indexOf('{');
  for (let tries = 0; start !== -1 && start < end && tries < 40; tries++) {
    const candidate = extractAndParseJson(text.slice(start, end + 1)) as Partial<Extraction> | undefined;
    if (candidate && Array.isArray(candidate.entities)) return candidate;
    start = text.indexOf('{', start + 1);
  }
  return undefined;
}

function topK<T>(items: T[], score: (t: T) => number, k: number): Array<{ item: T; s: number }> {
  return items
    .map((item) => ({ item, s: score(item) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, k);
}

class UnionFind {
  parent: number[];
  constructor(n: number) {
    this.parent = [...Array(n).keys()];
  }
  find(i: number): number {
    while (this.parent[i] !== i) {
      this.parent[i] = this.parent[this.parent[i]];
      i = this.parent[i];
    }
    return i;
  }
  union(a: number, b: number) {
    this.parent[this.find(a)] = this.find(b);
  }
}

const HOSTILE_HEAD = /attack|target|compromis|exploit|phish|infect|deliver|distribut|spread|deploy|control|operat|imperson|steal|exfiltrat|send|use|host|conduct|drop|execut|install|scan|hack/;
const HOSTILE_TAIL = /attack|target|compromis|phish|infect|imperson|steal|exfiltrat|hack|affect|victim/;

function deriveRoles(
  relations: Array<{ head: string; type: string; tail: string }>,
  names: string[]
): Record<string, 'attacker' | 'target' | 'related' | null> {
  const roles: Record<string, 'attacker' | 'target' | 'related' | null> = {};
  for (const n of names) roles[n] = null;
  for (const r of relations) {
    if (HOSTILE_HEAD.test(r.type)) roles[r.head] = 'attacker';
    else if (roles[r.head] === null) roles[r.head] = 'related';
    if (HOSTILE_TAIL.test(r.type)) {
      if (roles[r.tail] !== 'attacker') roles[r.tail] = 'target';
    } else if (roles[r.tail] === null) roles[r.tail] = 'related';
  }
  return roles;
}

// ---------- main ----------
async function main() {
  const date = new Date().toISOString().slice(0, 10);
  const outDir = CONFIG.out || `runs/spike/${date}-${CONFIG.llmProvider}-${CONFIG.docs}`;
  await ensureDir(outDir);
  await ensureDir(path.join(outDir, 'extractions'));
  await ensureDir(path.join(outDir, 'artifacts'));

  const runId = path.basename(outDir);
  const costMeter = new CostMeter({ runId });
  const callLog = new LlmCallLog({ dir: path.join(outDir, 'llm-calls'), runId });
  const llm = new LlmClient({
    backend: createLlmBackend({ provider: CONFIG.llmProvider, model: CONFIG.llmModel }),
    costMeter,
    callLog,
    defaultCallOptions: { temperature: 0 },
  });
  const embedBackend = new EmbeddingsBackendGemini({
    model: CONFIG.embedModel,
    apiKey: process.env.GEMINI_API_KEY!,
    taskType: CONFIG.embedTaskType,
  });
  const embeddings = new EmbeddingsClient({
    backend: embedBackend,
    costMeter,
    cache: new EmbeddingCache({
      dir: CONFIG.cacheDir,
      provider: 'gemini',
      model: `${CONFIG.embedModel}@${CONFIG.embedTaskType}@${CONFIG.embedDims}`,
    }),
  });
  const embed = async (texts: string[], docId: number, operator: string) =>
    (await embeddings.embed(texts, { dimensions: CONFIG.embedDims, operator, docId })).map(
      l2Normalize
    );
  /** One unit vector per mention under CONFIG.repr (see the config comment). */
  const embedMentions = async (ents: Array<{ name: string; kind: string; gloss: string }>, docId: number) => {
    if (CONFIG.repr !== 'combo') return { vecs: await embed(ents.map((e) => reprText(CONFIG.repr, e)), docId, 'embed'), kinds: [] as number[][] };
    const kv = await embed(ents.map((e) => e.kind || e.gloss), docId, 'embed-kind');
    const gv = await embed(ents.map((e) => e.gloss || e.kind), docId, 'embed-gloss');
    const a = Math.sqrt(CONFIG.alpha);
    const b = Math.sqrt(1 - CONFIG.alpha);
    return { vecs: kv.map((k, i) => [...k.map((x) => x * a), ...gv[i].map((x) => x * b)]), kinds: kv };
  };

  /** Dominant kind phrases of a scheme: kinds carried by ≥ 20% of members (at least one). */
  function dominantKinds(s: Scheme): string[] {
    const counts = new Map<string, number>();
    for (const id of s.members) {
      const k = mentions.find((m) => m.id === id)?.kind ?? '';
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    return top.filter(([, n]) => n >= Math.max(1, 0.2 * s.members.length)).map(([k]) => k);
  }

  // state
  const mentions: Mention[] = [];
  const vectors = new Map<string, number[]>();
  const kindVectors = new Map<string, number[]>(); // unit kind-phrase vectors (combo mode only)
  const schemes: Scheme[] = [];
  const relationTypes: RelationType[] = [];
  const relVectors = new Map<string, number[]>();
  const events: Array<Record<string, unknown>> = [];
  const perDoc: Array<Record<string, unknown>> = [];
  const docs: Array<{ id: number; date: string; title: string }> = [];
  let schemeSeq = 0;
  const namingAttempted = new Set<string>();

  const eventsPath = path.join(outDir, 'events.jsonl');
  await fs.writeFile(eventsPath, '');
  const logEvent = async (e: Record<string, unknown>) => {
    events.push(e);
    await fs.appendFile(eventsPath, `${JSON.stringify(e)}\n`);
  };

  const schemeByLabel = (label: string) =>
    schemes.find(
      (s) =>
        s.prefLabel.toLowerCase() === label.toLowerCase() ||
        s.altLabels.some((a) => a.toLowerCase() === label.toLowerCase())
    );

  const assigned = () => mentions.filter((m) => m.scheme !== null);

  /**
   * kNN vote. Only neighbours at or above τ vote (first run: three identical Country members at
   * similarity 1.0 were outvoted by seven ~0.6 neighbours from the two largest schemes). Returns
   * the chosen scheme or null (pool), plus diagnostics.
   */
  function tryAssign(m: Mention) {
    const pool = assigned();
    if (pool.length === 0) return { scheme: null as string | null, why: 'no-schemes', score: 0 };
    if (CONFIG.kindFirst > 0 && kindVectors.has(m.id)) {
      // kind-first: exact-or-near kind phrase match against each scheme's dominant kinds
      const kv = kindVectors.get(m.id)!;
      let best: { scheme: string; sim: number; kind: string } | null = null;
      for (const s of schemes) {
        for (const k of dominantKinds(s)) {
          const rep = mentions.find((x) => x.scheme === s.id && x.kind === k);
          if (!rep || !kindVectors.has(rep.id)) continue;
          const sim = cosineNormalized(kv, kindVectors.get(rep.id)!);
          if (!best || sim > best.sim) best = { scheme: s.id, sim, kind: k };
        }
      }
      if (best && best.sim >= CONFIG.kindFirst) return { scheme: best.scheme, why: 'kind-first', score: best.sim, kind: best.kind };
    }
    const v = vectors.get(m.id)!;
    const nn = topK(pool, (o) => cosineNormalized(v, vectors.get(o.id)!), CONFIG.k);
    const top1 = nn[0]?.s ?? 0;
    const voters = nn.filter((x) => x.s >= CONFIG.tau);
    if (voters.length === 0) return { scheme: null, why: 'below-tau', score: top1, nearest: nn[0]?.item.scheme ?? null };
    const votes = new Map<string, { share: number; best: number }>();
    const total = voters.reduce((a, b) => a + b.s, 0);
    for (const { item, s } of voters) {
      const cur = votes.get(item.scheme!) ?? { share: 0, best: 0 };
      cur.share += s / total;
      cur.best = Math.max(cur.best, s);
      votes.set(item.scheme!, cur);
    }
    const ranked = [...votes.entries()].sort((a, b) => b[1].share - a[1].share);
    const [bestId, best] = ranked[0];
    const second = ranked[1]?.[1].share ?? 0;
    if (best.share - second >= CONFIG.delta) {
      return { scheme: bestId, why: 'knn', score: best.best, share: best.share, margin: best.share - second, voters: voters.length };
    }
    return { scheme: null, why: 'ambiguous', score: best.best, share: best.share, margin: best.share - second, nearest: bestId, runnerUp: ranked[1]?.[0] ?? null };
  }

  /** Average-linkage clusters over the pool at CONFIG.poolLink. */
  function poolClusters(): Mention[][] {
    const pool = mentions.filter((m) => m.scheme === null);
    const groups = averageLinkage(pool.map((m) => vectors.get(m.id)!), CONFIG.poolLink);
    return groups.map((g) => g.map((i) => pool[i]));
  }

  async function nameCluster(group: Mention[], docId: number): Promise<void> {
    const members = group
      .slice(0, 40)
      .map((m) => `- ${m.name} [${m.kind}] — ${m.gloss}`)
      .join('\n');
    const known =
      schemes.length === 0
        ? '(none yet)'
        : schemes.map((s) => `- ${s.prefLabel}: ${s.definition}`).join('\n');
    const instructions = prompts.render('scheme-name-v1', { knownSchemes: known, members });
    const response = await llm.send(instructions, 'Decide and name the group now.', {
      operator: 'scheme-name',
      docId,
    });
    const parsed = extractAndParseJson(response.text) as
      | { verdict?: string; target?: string | null; prefLabel?: string; definition?: string; altLabels?: string[]; outliers?: string[] }
      | undefined;
    const targetLabel = parsed?.verdict === 'alias-of' && parsed.target ? parsed.target : null;
    if (!parsed || (!parsed.prefLabel && !targetLabel)) {
      await logEvent({ doc: docId, op: 'name-failed', size: group.length, response: response.text.slice(0, 300) });
      return;
    }
    if (!parsed.prefLabel) parsed.prefLabel = targetLabel!;
    const outliers = new Set((parsed.outliers ?? []).map((n) => normSurface(String(n))));
    const kept = group.filter((m) => !outliers.has(normSurface(m.name)));
    const target = targetLabel ? schemeByLabel(targetLabel) : undefined;
    if (targetLabel && !target) {
      await logEvent({ doc: docId, op: 'alias-unknown-target', target: targetLabel, size: group.length });
    }
    if (target) {
      if (!target.altLabels.includes(parsed.prefLabel) && parsed.prefLabel !== target.prefLabel) {
        target.altLabels.push(parsed.prefLabel);
      }
      for (const m of kept) {
        m.scheme = target.id;
        m.assign.push({ doc: docId, scheme: target.id, how: 'alias-mint' });
        target.members.push(m.id);
      }
      target.history.push({ doc: docId, op: 'absorb', detail: `${kept.length} pooled mentions as "${parsed.prefLabel}"` });
      await logEvent({ doc: docId, op: 'alias', scheme: target.id, label: parsed.prefLabel, size: kept.length, outliers: [...outliers] });
      return;
    }
    const scheme: Scheme = {
      id: `S${++schemeSeq}`,
      prefLabel: parsed.prefLabel,
      definition: parsed.definition ?? '',
      altLabels: parsed.altLabels ?? [],
      born: docId,
      members: kept.map((m) => m.id),
      history: [{ doc: docId, op: 'mint', detail: `${kept.length} mentions from ${new Set(kept.map((m) => m.doc)).size} documents` }],
    };
    schemes.push(scheme);
    for (const m of kept) {
      m.scheme = scheme.id;
      m.assign.push({ doc: docId, scheme: scheme.id, how: 'mint' });
    }
    await logEvent({ doc: docId, op: 'mint', scheme: scheme.id, label: scheme.prefLabel, definition: scheme.definition, size: kept.length, outliers: [...outliers] });
  }

  /** After a mint, pool members may now be near a scheme: retry them (no LLM). */
  async function drainPool(docId: number): Promise<number> {
    let moved = 0;
    for (const m of mentions.filter((x) => x.scheme === null)) {
      const r = tryAssign(m);
      if (r.scheme) {
        m.scheme = r.scheme;
        m.assign.push({ doc: docId, scheme: r.scheme, how: 'drain', score: r.score });
        schemes.find((s) => s.id === r.scheme)!.members.push(m.id);
        moved += 1;
        await logEvent({ doc: docId, op: 'assign', mention: m.id, scheme: r.scheme, how: 'drain', score: r.score });
      }
    }
    return moved;
  }

  async function canonRelationType(name: string, definition: string, docId: number): Promise<string> {
    const key = name.trim().toLowerCase().replace(/\s+/g, '-');
    const exact = relationTypes.find((t) => t.name === key || t.aliases.includes(key));
    if (exact) return exact.name;
    const [v] = await embed([`${key}: ${definition || key}`], docId, 'embed-relation');
    let best: { t: RelationType; s: number } | null = null;
    for (const t of relationTypes) {
      const s = cosineNormalized(v, relVectors.get(t.name)!);
      if (!best || s > best.s) best = { t, s };
    }
    if (best && best.s >= CONFIG.relMerge) {
      best.t.aliases.push(key);
      await logEvent({ doc: docId, op: 'relation-alias', type: key, of: best.t.name, sim: best.s });
      return best.t.name;
    }
    relationTypes.push({ name: key, definition, born: docId, count: 0, aliases: [] });
    relVectors.set(key, v);
    await logEvent({ doc: docId, op: 'relation-type-new', type: key, definition, nearest: best ? { type: best.t.name, sim: best.s } : null });
    return key;
  }

  // ---------- stream ----------
  const files = sortByNumericId(await fs.readdir(CONFIG.inputDir)).slice(CONFIG.offset, CONFIG.offset + CONFIG.docs);
  for (const file of files) {
    const raw = JSON.parse(await fs.readFile(path.join(CONFIG.inputDir, file), 'utf8'));
    const docId = Number(raw.id) || parseInt(file, 10);
    const text = String(raw.text ?? '').replace(/<img[^>]*>/gi, '');
    docs.push({ id: docId, date: raw.date, title: raw.title });
    console.log(`\n=== doc ${docId} (${raw.date}) ${raw.title}`);

    // (a) extraction, cached per document
    const extractionPath = path.join(outDir, 'extractions', file);
    let extraction: Extraction;
    if (existsSync(extractionPath)) {
      extraction = JSON.parse(await fs.readFile(extractionPath, 'utf8'));
      console.log(`  extraction: cached`);
    } else {
      const known =
        relationTypes.length === 0
          ? '(none yet — introduce what the text needs)'
          : relationTypes.map((t) => `- ${t.name}: ${t.definition}`).join('\n');
      const instructions = CONFIG.relBlind
        ? prompts.render('extract-open-relblind-v1', {})
        : CONFIG.icl
        ? prompts.render('extract-open-icl-v1', {
            knownRelationTypes: known,
            knownSchemes:
              schemes.length === 0
                ? '(none yet — use your own wording)'
                : schemes.map((s) => `- ${s.prefLabel}: ${s.definition}${s.altLabels.length ? ` (also: ${s.altLabels.join(', ')})` : ''}`).join('\n'),
          })
        : prompts.render('extract-open-v1', { knownRelationTypes: known });
      const response = await llm.send(instructions, text, { operator: 'extract', docId });
      const parsed = parseExtraction(response.text);
      if (!parsed || !Array.isArray(parsed.entities)) {
        console.error(`  EXTRACTION FAILED for ${file}`);
        await logEvent({ doc: docId, op: 'extract-failed' });
        continue;
      }
      extraction = {
        entities: parsed.entities
          .filter((e) => e && typeof e.name === 'string' && e.name.trim())
          .map((e) => ({ name: e.name.trim(), kind: String(e.kind ?? '').trim().toLowerCase(), gloss: String(e.gloss ?? '').trim() })),
        relations: (parsed.relations ?? []).filter((r) => r && r.head && r.tail && r.type),
        newRelationTypes: parsed.newRelationTypes ?? [],
      };
      await writeJsonAtomic(extractionPath, extraction);
      console.log(`  extraction: ${extraction.entities.length} entities, ${extraction.relations.length} relations, ${response.usage.inputTokens}+${response.usage.outputTokens} tokens`);
    }

    // dedupe by normalized surface within the document
    const seen = new Map<string, { name: string; kind: string; gloss: string }>();
    for (const e of extraction.entities) {
      const key = normSurface(e.name);
      if (!seen.has(key)) seen.set(key, e);
    }
    const entities = [...seen.values()];

    // frozen overlay: surface alignment to the gpt-5 extraction of the same document
    const frozenPath = path.join(CONFIG.frozenDir, file);
    const frozen: Array<{ name: string; category: string; role: string }> = existsSync(frozenPath)
      ? JSON.parse(await fs.readFile(frozenPath, 'utf8')).entities
      : [];
    const frozenIndex = frozen.map((f) => ({ key: normSurface(f.name), category: f.category, role: f.role }));
    const alignCategory = (name: string): string | null => {
      const key = normSurface(name);
      const exact = frozenIndex.find((f) => f.key === key);
      if (exact) return exact.category;
      const contained = frozenIndex.find(
        (f) => key.length >= 4 && f.key.length >= 4 && (f.key.includes(key) || key.includes(f.key))
      );
      return contained ? contained.category : null;
    };

    // (b) embed
    const { vecs, kinds: kindVecs } = await embedMentions(entities, docId);
    const docMentions: Mention[] = entities.map((e, i) => {
      const m: Mention = {
        id: `${docId}:${i}`,
        doc: docId,
        name: e.name,
        kind: e.kind,
        gloss: e.gloss,
        scheme: null,
        assign: [],
        category: alignCategory(e.name),
      };
      vectors.set(m.id, vecs[i]);
      if (kindVecs[i]) kindVectors.set(m.id, kindVecs[i]);
      return m;
    });

    // (c) relation inventory + normalization
    const defs = new Map(extraction.newRelationTypes.map((t) => [t.name.trim().toLowerCase().replace(/\s+/g, '-'), t.definition]));
    const relations: Array<{ head: string; type: string; tail: string; evidence: string }> = [];
    for (const r of extraction.relations) {
      const key = r.type.trim().toLowerCase().replace(/\s+/g, '-');
      const canon = await canonRelationType(key, defs.get(key) ?? '', docId);
      const t = relationTypes.find((x) => x.name === canon)!;
      t.count += 1;
      relations.push({ head: r.head, type: canon, tail: r.tail, evidence: r.evidence ?? '' });
    }

    // (d) assign or pool
    let assignedNow = 0;
    for (const m of docMentions) {
      mentions.push(m);
      const r = tryAssign(m);
      if (r.scheme) {
        m.scheme = r.scheme;
        schemes.find((s) => s.id === r.scheme)!.members.push(m.id);
        assignedNow += 1;
      }
      m.assign.push({ doc: docId, scheme: r.scheme, how: r.why, score: r.score });
      await logEvent({ doc: docId, op: r.scheme ? 'assign' : 'pool', mention: m.id, name: m.name, ...r });
    }

    // (e) novelty gate: name pool clusters with enough support; repeat while something changes.
    // A member set that was already sent to the namer is never sent again (a failed or
    // alias-to-unknown verdict would otherwise loop until the round cap).
    let minted = 0;
    for (let round = 0; round < 8; round++) {
      const ready = poolClusters()
        .filter((g) => new Set(g.map((m) => m.doc)).size >= CONFIG.mass)
        .filter((g) => !namingAttempted.has(g.map((m) => m.id).sort().join('|')));
      if (ready.length === 0) break;
      for (const g of ready) {
        namingAttempted.add(g.map((m) => m.id).sort().join('|'));
        await nameCluster(g, docId);
        minted += 1;
      }
      await drainPool(docId);
    }

    // artifact
    const names = docMentions.map((m) => m.name);
    const roles = deriveRoles(relations, names);
    await writeJsonAtomic(path.join(outDir, 'artifacts', file), {
      docId,
      date: raw.date,
      title: raw.title,
      entities: docMentions.map((m) => ({ id: m.id, name: m.name, kind: m.kind, gloss: m.gloss, scheme: m.scheme, category: m.category, role: roles[m.name] ?? null })),
      relations,
      unclassified: docMentions.filter((m) => m.scheme === null).map((m) => m.id),
    });
    const poolSize = mentions.filter((m) => m.scheme === null).length;
    perDoc.push({ doc: docId, mentions: docMentions.length, assigned: assignedNow, namingCalls: minted, schemes: schemes.length, pool: poolSize, relationTypes: relationTypes.length, relations: relations.length });
    console.log(`  assigned ${assignedNow}/${docMentions.length}, naming calls ${minted}, schemes ${schemes.length}, pool ${poolSize}, relation types ${relationTypes.length}`);
  }

  // ---------- outputs ----------
  await writeJsonAtomic(path.join(outDir, 'schemes.json'), { schemes, config: CONFIG });
  await writeJsonAtomic(path.join(outDir, 'relations-inventory.json'), relationTypes);
  await writeJsonAtomic(path.join(outDir, 'docs.json'), docs);
  await writeJsonAtomic(path.join(outDir, 'mentions.json'), mentions);
  await writeJsonAtomic(
    path.join(outDir, 'embeddings.json'),
    mentions.map((m) => ({ id: m.id, v: vectors.get(m.id)!.map((x) => Number(x.toFixed(5))) }))
  );
  await writeJsonAtomic(path.join(outDir, 'per-doc.json'), perDoc);

  // cross-tab scheme × hand category on the aligned subset
  const crossTab: Record<string, Record<string, number>> = {};
  for (const m of mentions) {
    const s = m.scheme ? schemes.find((x) => x.id === m.scheme)!.prefLabel : '(pool)';
    const c = m.category ?? '(unaligned)';
    ((crossTab[s] ??= {})[c] ??= 0);
    crossTab[s][c] += 1;
  }
  const aligned = mentions.filter((m) => m.category !== null).length;
  const centroids = Object.fromEntries(
    schemes.map((s) => [s.id, meanPool(s.members.map((id) => vectors.get(id)!))])
  );
  const schemeSims: Array<{ a: string; b: string; sim: number }> = [];
  for (let i = 0; i < schemes.length; i++) {
    for (let j = i + 1; j < schemes.length; j++) {
      schemeSims.push({ a: schemes[i].prefLabel, b: schemes[j].prefLabel, sim: cosineNormalized(l2Normalize(centroids[schemes[i].id]), l2Normalize(centroids[schemes[j].id])) });
    }
  }
  const summary = {
    runId,
    config: CONFIG,
    prompts: prompts.hashesFor([CONFIG.relBlind ? 'extract-open-relblind-v1' : CONFIG.icl ? 'extract-open-icl-v1' : 'extract-open-v1', 'scheme-name-v1']),
    embeddings: { config: embedBackend.config, dimensions: embeddings.dimensions, cache: embeddings.cacheStats },
    documents: docs.length,
    mentions: mentions.length,
    schemes: schemes.map((s) => ({ id: s.id, label: s.prefLabel, members: s.members.length, born: s.born, altLabels: s.altLabels })),
    pool: mentions.filter((m) => m.scheme === null).length,
    relationTypes: relationTypes.length,
    overlay: { aligned, coverage: mentions.length ? aligned / mentions.length : 0, crossTab },
    closestSchemePairs: schemeSims.sort((a, b) => b.sim - a.sim).slice(0, 8),
    cost: costMeter.summary(),
  };
  await writeJsonAtomic(path.join(outDir, 'run-card.json'), summary);
  // README.md: the hand-written purpose above the marker is kept, the rest is regenerated
  await writeRunReadme(outDir, process.env.SPIKE_PURPOSE);
  console.log('\n=== SUMMARY');
  console.log(JSON.stringify({ ...summary, overlay: { aligned, coverage: summary.overlay.coverage } }, null, 2));
  console.log(`\nwrote ${outDir}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}
