/**
 * SPIKE (2026-09-17): relation-type discovery over argument-type cells, on top of a FINISHED
 * scheme run.
 *
 *   npm run spike-relations -- --source runs/spike/<scheme run> --arm blind-cell   --out runs/spike/<new dir>
 *   npm run spike-relations -- --source runs/spike/<scheme run> --arm blind-global --out runs/spike/<new dir>
 *   npm run spike-relations -- --source runs/spike/<scheme run> --arm typed-icl    --out runs/spike/<new dir>
 *
 * The entity universe and the scheme layer are held fixed: mentions, their assignment trail and the
 * schemes are read from the source run and REPLAYED (a mention's scheme at document t is the last
 * trail step at or before t), so the arms differ in the relation layer only and no scheme naming
 * call is spent.
 *
 *   blind-cell    free relation phrases of the source run's (relation-blind) extractions; a triple
 *                 is typed inside its cell (head scheme → tail scheme): phrase-first, kNN vote
 *                 (neighbours ≥ τ), otherwise the cell's pool; pool clusters spanning ≥ mass
 *                 documents get one `relation-name-v1` call (new | alias-of | narrower-than).
 *                 A triple with an untyped argument stays pending until both arguments are typed.
 *   blind-global  the same mechanism with ONE global cell (control: what the cells buy).
 *   typed-icl     second call per document (`relate-typed-v1`): entities with their scheme at t
 *                 and the relation inventory of the cells that can occur in the document; the
 *                 model's type names are registered per cell (exact name, else cosine ≥ merge to a
 *                 type of the same cell, else a new type). No naming calls, no mass gate.
 *
 * Every step is prefix-causal, except under `--schemes final` (see CONFIG.schemes). Spike grade,
 * like bin/spike-schemes.ts.
 */
import { averageLinkage } from './spike-schemes';
import { EmbeddingCache } from '../src/EmbeddingsClient/EmbeddingCache';
import { EmbeddingsBackendGemini } from '../src/EmbeddingsClient/EmbeddingsBackendGemini';
import { EmbeddingsClient } from '../src/EmbeddingsClient/EmbeddingsClient';
import { CostMeter } from '../src/Experiment/CostMeter';
import { LlmCallLog } from '../src/LlmClient/LlmCallLog';
import { LlmClient } from '../src/LlmClient/LlmClient';
import { createLlmBackend } from '../src/LlmClient/createBackend';
import { prompts } from '../src/Normalization/PromptProvider';
import {
  GLOBAL_CELL,
  RelationCellRegistry,
  RelationType,
  TrailMention,
  Triple,
  UNTYPED,
  cellKey,
  normPhrase,
  normSurface,
  schemeAt,
  tailShare,
} from '../src/RelationDiscovery/relationCells';
import { writeRunReadme } from '../src/RunReadme/runReadme';
import { writeRunView } from '../src/RunViews/runViews';
import { ensureDir, writeJsonAtomic } from '../src/utils/fsUtils';
import { extractAndParseJson } from '../src/utils/validationUtils';
import { cosineNormalized, l2Normalize } from '../src/utils/vectorUtils';
import crypto from 'crypto';
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

type Arm = 'blind-cell' | 'blind-global' | 'typed-icl';

const CONFIG = {
  arm: (arg('arm') || 'blind-cell') as Arm,
  source: arg('source') || '',
  /**
   * `ingest` (default): a mention's scheme is the one known at the current document (prefix-causal).
   * `final`: every mention carries its scheme from the END of the source run, which emulates a mature
   * scheme layer on a cold-started mid-corpus slice. NOT prefix-causal with respect to the scheme
   * layer; the relation inventory itself still grows causally.
   */
  schemes: (arg('schemes') || 'ingest') as 'ingest' | 'final',
  out: arg('out') || '',
  /** process only the first N documents of the source run (0 = all); for smoke tests */
  docs: num(process.env.REL_DOCS, 0),
  inputDir: process.env.SPIKE_INPUT || 'data/fetched',
  llmProvider: process.env.SPIKE_LLM_PROVIDER || 'gemini',
  llmModel: process.env.SPIKE_LLM_MODEL || 'gemini-3.7-flash',
  embedModel: process.env.SPIKE_EMBED_MODEL || 'gemini-embedding-2',
  embedTaskType: process.env.SPIKE_EMBED_TASK || 'CLUSTERING',
  embedDims: num(process.env.SPIKE_DIMS, 768),
  k: num(process.env.REL_K, 10),
  tau: num(process.env.REL_TAU, 0.8), // neighbours below this similarity never vote
  delta: num(process.env.REL_DELTA, 0.1),
  poolLink: num(process.env.REL_POOL_LINK, 0.85), // average-linkage cutoff inside a cell's pool
  mass: num(process.env.REL_MASS, 3), // distinct documents a pool cluster needs before naming
  merge: num(process.env.REL_MERGE, 0.85), // typed-icl: near-duplicate cutoff for a new type name inside its cell
  namingMembers: 25, // at most this many statements are rendered into one naming call
  cacheDir: process.env.EMBEDDINGS_CACHE || 'runs/embeddings-cache',
};

interface SourceScheme {
  id: string;
  prefLabel: string;
  definition: string;
}
interface BlindExtraction {
  relations: Array<{ head: string; type: string; tail: string; evidence?: string }>;
  newRelationTypes?: Array<{ name: string; definition: string }>;
}
interface TypedRelations {
  relations: Array<{ head: string; type: string; tail: string; evidence?: string; fit?: string }>;
  newRelationTypes: Array<{ name: string; definition: string }>;
}

/** The reasoning preamble may contain braces: try each `{` until an object with `key` parses. */
function parseObjectWith<T>(text: string, key: string): T | undefined {
  const has = (o: unknown): o is T => !!o && typeof o === 'object' && Array.isArray((o as Record<string, unknown>)[key]);
  const first = extractAndParseJson(text);
  if (has(first)) return first;
  const end = text.lastIndexOf('}');
  let start = text.indexOf('{');
  for (let tries = 0; start !== -1 && start < end && tries < 40; tries++) {
    const candidate = extractAndParseJson(text.slice(start, end + 1));
    if (has(candidate)) return candidate;
    start = text.indexOf('{', start + 1);
  }
  return undefined;
}

const sha256File = async (file: string) => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');

async function main() {
  if (!CONFIG.source || !CONFIG.out || !['blind-cell', 'blind-global', 'typed-icl'].includes(CONFIG.arm) || !['ingest', 'final'].includes(CONFIG.schemes)) {
    console.error('Usage: npm run spike-relations -- --source <scheme run dir> --arm blind-cell|blind-global|typed-icl [--schemes ingest|final] --out <new run dir>');
    process.exit(1);
  }
  const outDir = CONFIG.out;
  if (existsSync(path.join(outDir, 'run-card.json'))) {
    console.error(`${outDir} already holds a run; a changed configuration is a new run directory`);
    process.exit(1);
  }
  await ensureDir(outDir);
  const useCells = CONFIG.arm !== 'blind-global';

  // ---------- source run (frozen here: read only) ----------
  const src = (name: string) => path.join(CONFIG.source, name);
  const allDocs: Array<{ id: number; date: string; title: string }> = JSON.parse(await fs.readFile(src('docs.json'), 'utf8'));
  const docs = CONFIG.docs > 0 ? allDocs.slice(0, CONFIG.docs) : allDocs;
  const sourceMentions: TrailMention[] = JSON.parse(await fs.readFile(src('mentions.json'), 'utf8'));
  const sourceSchemes: SourceScheme[] = JSON.parse(await fs.readFile(src('schemes.json'), 'utf8')).schemes;
  const position = new Map(allDocs.map((d, i) => [d.id, i]));
  const mentionById = new Map(sourceMentions.map((m) => [m.id, m]));
  const mentionsOfDoc = new Map<number, TrailMention[]>();
  for (const m of sourceMentions) mentionsOfDoc.set(m.doc, [...(mentionsOfDoc.get(m.doc) ?? []), m]);
  const schemeById = new Map(sourceSchemes.map((s) => [s.id, s]));
  const label = (schemeId: string | null) => (schemeId ? schemeById.get(schemeId)?.prefLabel ?? schemeId : UNTYPED);
  const cellLabel = (cell: string) => (cell === GLOBAL_CELL ? '(global)' : cell.split('→').map((s) => (s === UNTYPED ? s : label(s))).join(' → '));

  // ---------- clients ----------
  const runId = path.basename(outDir);
  const costMeter = new CostMeter({ runId });
  const llm = new LlmClient({
    backend: createLlmBackend({ provider: CONFIG.llmProvider, model: CONFIG.llmModel }),
    costMeter,
    callLog: new LlmCallLog({ dir: path.join(outDir, 'llm-calls'), runId }),
    defaultCallOptions: { temperature: 0 },
  });
  const embeddings = new EmbeddingsClient({
    backend: new EmbeddingsBackendGemini({ model: CONFIG.embedModel, apiKey: process.env.GEMINI_API_KEY!, taskType: CONFIG.embedTaskType }),
    costMeter,
    cache: new EmbeddingCache({ dir: CONFIG.cacheDir, provider: 'gemini', model: `${CONFIG.embedModel}@${CONFIG.embedTaskType}@${CONFIG.embedDims}` }),
  });
  const embed = async (texts: string[], docId: number) =>
    texts.length === 0 ? [] : (await embeddings.embed(texts, { dimensions: CONFIG.embedDims, operator: 'embed-relation', docId })).map(l2Normalize);

  // ---------- state ----------
  const registry = new RelationCellRegistry();
  const typeVectors = new Map<string, number[]>(); // typed-icl: vector of "label: definition" per type
  const perDoc: Array<Record<string, number>> = [];
  const namingAttempted = new Set<string>();
  let namingCalls = 0;
  let unresolved = 0;
  let extractionFailures = 0;
  const eventsPath = path.join(outDir, 'events.jsonl');
  await fs.writeFile(eventsPath, '');
  const logEvent = (e: Record<string, unknown>) => fs.appendFile(eventsPath, `${JSON.stringify(e)}\n`);

  const schemeNow = (m: TrailMention, t: number) => (CONFIG.schemes === 'final' ? m.scheme : schemeAt(m, position, t));
  const resolve = (docId: number, name: string) => {
    const key = normSurface(name);
    return (mentionsOfDoc.get(docId) ?? []).find((m) => normSurface(m.name) === key);
  };
  const argText = (mentionId: string, t: number) => {
    const m = mentionById.get(mentionId)!;
    const s = schemeNow(m, t);
    return s ? label(s) : `untyped: ${m.kind}`;
  };

  // ---------- naming (blind arms) ----------
  async function nameCluster(cell: string, group: Triple[], docId: number, t: number) {
    const shown = group.slice(0, CONFIG.namingMembers);
    const known = registry.typesIn(cell);
    const [headScheme, tailScheme] = cell === GLOBAL_CELL ? [null, null] : cell.split('→').map((id) => schemeById.get(id));
    const instructions = prompts.render('relation-name-v1', {
      cell:
        cell === GLOBAL_CELL
          ? '(mixed: the argument types are given on each statement)'
          : `Head type: ${headScheme!.prefLabel}: ${headScheme!.definition}\nTail type: ${tailScheme!.prefLabel}: ${tailScheme!.definition}`,
      knownTypes:
        known.length === 0
          ? '(none yet)'
          : known
              .map((type) => {
                const phrases = [...new Set(type.members.map((id) => registry.triples.find((x) => x.id === id)!.phrase))].slice(0, 6);
                return `- ${type.prefLabel}: ${type.definition} (phrases seen: ${phrases.join(', ')})`;
              })
              .join('\n'),
      members: shown
        .map((x, i) => `${i + 1}. ${x.headName} (${argText(x.head, t)}) --[${x.phrase}]--> ${x.tailName} (${argText(x.tail, t)}) | ${x.definition || '(no definition)'} | "${x.evidence}"`)
        .join('\n'),
    });
    const response = await llm.send(instructions, 'Decide and name the group now.', { operator: 'relation-name', docId });
    namingCalls += 1;
    const parsed = extractAndParseJson(response.text) as
      | { verdict?: string; target?: string | null; prefLabel?: string; definition?: string; altLabels?: string[]; outliers?: unknown[] }
      | undefined;
    const target = parsed?.target && parsed.verdict !== 'new' ? registry.typeByLabel(cell, parsed.target) : undefined;
    if (!parsed || (!parsed.prefLabel && !target)) {
      await logEvent({ doc: docId, op: 'name-failed', cell, size: group.length, response: response.text.slice(0, 300) });
      return;
    }
    const outliers = new Set((parsed.outliers ?? []).map((n) => Number(n)).filter((n) => Number.isInteger(n)));
    const kept = group.filter((_, i) => !outliers.has(i + 1));
    if (parsed.verdict !== 'new' && parsed.target && !target) {
      await logEvent({ doc: docId, op: 'unknown-target', cell, verdict: parsed.verdict, target: parsed.target, size: group.length });
    }
    if (parsed.verdict === 'alias-of' && target) {
      const alias = parsed.prefLabel ? normPhrase(parsed.prefLabel) : '';
      if (alias && alias !== normPhrase(target.prefLabel) && !target.altLabels.includes(alias)) target.altLabels.push(alias);
      for (const x of kept) registry.place(x, target, docId, 'alias-mint');
      target.history.push({ doc: docId, op: 'absorb', detail: `${kept.length} pooled statements as "${parsed.prefLabel ?? target.prefLabel}"` });
      await logEvent({ doc: docId, op: 'alias', cell, type: target.id, label: target.prefLabel, size: kept.length, outliers: [...outliers] });
      return;
    }
    if (!parsed.prefLabel) return;
    const broader = parsed.verdict === 'narrower-than' && target ? target.id : null;
    const type = registry.mint({
      cell,
      prefLabel: normPhrase(parsed.prefLabel),
      definition: parsed.definition ?? '',
      altLabels: (parsed.altLabels ?? []).map(normPhrase),
      broader,
      doc: docId,
      members: kept,
    });
    await logEvent({ doc: docId, op: broader ? 'mint-narrower' : 'mint', cell, cellLabel: cellLabel(cell), type: type.id, label: type.prefLabel, broader, definition: type.definition, size: kept.length, outliers: [...outliers] });
  }

  const assignOptions = { k: CONFIG.k, tau: CONFIG.tau, delta: CONFIG.delta };
  async function assignOrPool(x: Triple, docId: number, how?: string) {
    const r = registry.tryAssign(x, assignOptions);
    if (r.type) registry.place(x, registry.typeById(r.type)!, docId, how ?? r.why, r.score);
    else if (!how) x.assign.push({ doc: docId, cell: x.cell, type: null, how: r.why, score: r.score });
    if (r.type || !how) await logEvent({ doc: docId, op: r.type ? 'assign' : 'pool', triple: x.id, phrase: x.phrase, cell: x.cell, type: r.type, why: how ?? r.why, score: r.score });
    return r.type !== null;
  }

  // ---------- stream ----------
  for (let t = 0; t < docs.length; t++) {
    const docId = docs[t].id;
    console.log(`\n=== doc ${t + 1}/${docs.length} ${docId} ${docs[t].title}`);
    let newTriples = 0;

    if (CONFIG.arm === 'typed-icl') {
      // ----- second call: relations against the inventory of the cells that can occur here -----
      const docMentions = mentionsOfDoc.get(docId) ?? [];
      const typeOf = new Map(docMentions.map((m) => [m.id, schemeNow(m, t)]));
      const sides = [...new Set(docMentions.map((m) => typeOf.get(m.id) ?? null))];
      const cachePath = path.join(outDir, 'relations', `${docId}.json`);
      await ensureDir(path.dirname(cachePath));
      let typed: TypedRelations;
      if (existsSync(cachePath)) {
        typed = JSON.parse(await fs.readFile(cachePath, 'utf8'));
      } else {
        const groups: string[] = [];
        for (const h of sides) for (const tl of sides) {
          const types = registry.typesIn(cellKey(h, tl));
          if (types.length === 0) continue;
          groups.push(`Head [${label(h)}] -> Tail [${label(tl)}]:\n${types.map((x) => `- ${x.prefLabel}: ${x.definition}`).join('\n')}`);
        }
        const instructions = prompts.render('relate-typed-v1', {
          entities: docMentions.map((m) => `- ${m.name} [${typeOf.get(m.id) ? label(typeOf.get(m.id)!) : `untyped: ${m.kind}`}] ${m.gloss}`).join('\n'),
          knownRelationTypes: groups.length === 0 ? '(none yet for the argument types of this report: write your own phrases)' : groups.join('\n\n'),
        });
        const raw = JSON.parse(await fs.readFile(path.join(CONFIG.inputDir, `${docId}.json`), 'utf8'));
        const text = String(raw.text ?? '').replace(/<img[^>]*>/gi, '');
        const response = await llm.send(instructions, text, { operator: 'relate', docId });
        const parsed = parseObjectWith<TypedRelations>(response.text, 'relations');
        if (!parsed) {
          console.error(`  RELATION CALL FAILED for ${docId}`);
          extractionFailures += 1;
          await logEvent({ doc: docId, op: 'relate-failed' });
          perDoc.push({ doc: docId, triples: 0, typed: 0, pool: 0, pending: 0, types: registry.types.length, cells: registry.cells().length, namingCalls: 0 });
          continue;
        }
        typed = { relations: parsed.relations.filter((r) => r && r.head && r.tail && r.type), newRelationTypes: parsed.newRelationTypes ?? [] };
        await writeJsonAtomic(cachePath, typed);
      }
      const defs = new Map(typed.newRelationTypes.map((x) => [normPhrase(x.name), x.definition]));
      for (const [i, r] of typed.relations.entries()) {
        const head = resolve(docId, r.head);
        const tail = resolve(docId, r.tail);
        if (!head || !tail) {
          unresolved += 1;
          await logEvent({ doc: docId, op: 'unresolved', head: r.head, tail: r.tail, phrase: r.type });
          continue;
        }
        const phrase = normPhrase(r.type);
        const cell = cellKey(typeOf.get(head.id) ?? null, typeOf.get(tail.id) ?? null);
        const x: Triple & { fit?: string } = {
          id: `${docId}:r${i}`, doc: docId, head: head.id, tail: tail.id, headName: head.name, tailName: tail.name,
          phrase, definition: defs.get(phrase) ?? '', evidence: r.evidence ?? '', cell, type: null, assign: [], fit: r.fit ?? 'unspecified',
        };
        registry.add(x, []);
        newTriples += 1;
        let type = registry.typeByLabel(cell, phrase);
        let how = 'icl-known';
        if (!type) {
          const elsewhere = registry.types.find((y) => y.cell !== cell && normPhrase(y.prefLabel) === phrase);
          if (elsewhere) await logEvent({ doc: docId, op: 'cross-cell-name', phrase, cell, cellLabel: cellLabel(cell), knownIn: cellLabel(elsewhere.cell), fit: x.fit });
          const [v] = await embed([`${phrase}: ${x.definition || phrase}`], docId);
          let best: { type: RelationType; s: number } | null = null;
          for (const candidate of registry.typesIn(cell)) {
            const s = cosineNormalized(v, typeVectors.get(candidate.id)!);
            if (!best || s > best.s) best = { type: candidate, s };
          }
          if (best && best.s >= CONFIG.merge) {
            type = best.type;
            how = 'icl-alias';
            if (!type.altLabels.includes(phrase)) type.altLabels.push(phrase);
            await logEvent({ doc: docId, op: 'alias', cell, type: type.id, label: type.prefLabel, phrase, sim: best.s });
          } else {
            type = registry.mint({ cell, prefLabel: phrase, definition: x.definition, altLabels: [], broader: null, doc: docId, members: [] });
            typeVectors.set(type.id, v);
            how = 'icl-new';
            await logEvent({ doc: docId, op: 'mint', cell, cellLabel: cellLabel(cell), type: type.id, label: phrase, definition: x.definition, nearest: best ? { label: best.type.prefLabel, sim: best.s } : null });
          }
        }
        registry.place(x, type, docId, how);
        await logEvent({ doc: docId, op: 'assign', triple: x.id, phrase, cell, type: type.id, why: how, fit: x.fit });
      }
    } else {
      // ----- blind arms: free phrases of the source extraction -----
      const extraction: BlindExtraction = JSON.parse(await fs.readFile(src(path.join('extractions', `${docId}.json`)), 'utf8'));
      const defs = new Map((extraction.newRelationTypes ?? []).map((x) => [normPhrase(x.name), x.definition]));
      const fresh: Triple[] = [];
      for (const [i, r] of extraction.relations.entries()) {
        const head = resolve(docId, r.head);
        const tail = resolve(docId, r.tail);
        if (!head || !tail) {
          unresolved += 1;
          await logEvent({ doc: docId, op: 'unresolved', head: r.head, tail: r.tail, phrase: r.type });
          continue;
        }
        const phrase = normPhrase(r.type);
        fresh.push({
          id: `${docId}:r${i}`, doc: docId, head: head.id, tail: tail.id, headName: head.name, tailName: tail.name,
          phrase, definition: defs.get(phrase) ?? '', evidence: r.evidence ?? '', cell: useCells ? null : GLOBAL_CELL, type: null, assign: [],
        });
      }
      const vecs = await embed(fresh.map((x) => `${x.phrase}: ${x.definition || x.phrase}`), docId);
      fresh.forEach((x, i) => registry.add(x, vecs[i]));
      newTriples = fresh.length;

      // release: a triple enters its cell once both arguments are typed (global arm: at once)
      const entering = useCells ? registry.pending() : fresh;
      for (const x of entering) {
        if (useCells) {
          const h = schemeNow(mentionById.get(x.head)!, t);
          const tl = schemeNow(mentionById.get(x.tail)!, t);
          if (!h || !tl) {
            if (x.doc === docId) x.assign.push({ doc: docId, cell: null, type: null, how: 'pending' });
            continue;
          }
          x.cell = cellKey(h, tl);
          if (x.doc !== docId) await logEvent({ doc: docId, op: 'release', triple: x.id, cell: x.cell, cellLabel: cellLabel(x.cell), waitedSince: x.doc });
        }
        await assignOrPool(x, docId);
      }

      // novelty gate per cell; a member set sent to the namer once is never re-sent
      for (let round = 0; round < 8; round++) {
        let named = 0;
        for (const cell of registry.cells()) {
          const pool = registry.pool(cell);
          if (pool.length === 0) continue;
          const clusters = averageLinkage(pool.map((x) => registry.vectors.get(x.id)!), CONFIG.poolLink).map((c) => c.map((i) => pool[i]));
          for (const group of clusters) {
            const key = group.map((x) => x.id).sort().join('|');
            if (new Set(group.map((x) => x.doc)).size < CONFIG.mass || namingAttempted.has(key)) continue;
            namingAttempted.add(key);
            await nameCluster(cell, group, docId, t);
            named += 1;
          }
          if (named > 0) for (const x of registry.pool(cell)) await assignOrPool(x, docId, 'drain');
        }
        if (named === 0) break;
      }
    }

    const callsSoFar = perDoc.reduce((sum, row) => sum + row.namingCalls, 0);
    perDoc.push({
      doc: docId,
      triples: newTriples,
      typed: registry.triples.filter((x) => x.type !== null).length,
      pool: registry.pool().length,
      pending: registry.pending().length,
      types: registry.types.length,
      cells: new Set(registry.types.map((x) => x.cell)).size,
      namingCalls: namingCalls - callsSoFar,
    });
    const row = perDoc[perDoc.length - 1];
    console.log(`  triples ${row.triples}, typed ${row.typed}, pool ${row.pool}, pending ${row.pending}, types ${row.types} in ${row.cells} cells, naming calls ${row.namingCalls}`);
  }

  // ---------- outputs ----------
  const finalCell = (x: Triple) => cellKey(mentionById.get(x.head)!.scheme, mentionById.get(x.tail)!.scheme);
  let pureTriples = 0;
  for (const type of registry.types) {
    const counts = new Map<string, number>();
    for (const id of type.members) {
      const c = finalCell(registry.triples.find((x) => x.id === id)!);
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    pureTriples += Math.max(0, ...counts.values());
  }
  const typedTriples = registry.triples.filter((x) => x.type !== null);
  const fit: Record<string, number> = {};
  for (const x of registry.triples as Array<Triple & { fit?: string }>) if (x.fit) fit[x.fit] = (fit[x.fit] ?? 0) + 1;

  await writeJsonAtomic(path.join(outDir, 'docs.json'), docs);
  await writeJsonAtomic(path.join(outDir, 'triples.json'), registry.triples.map((x) => ({ ...x, cellLabel: x.cell ? cellLabel(x.cell) : null, finalCellLabel: cellLabel(finalCell(x)) })));
  await writeJsonAtomic(path.join(outDir, 'relation-types.json'), registry.types.map((x) => ({ ...x, cellLabel: cellLabel(x.cell) })));
  await writeJsonAtomic(path.join(outDir, 'per-doc.json'), perDoc);
  const promptIds = CONFIG.arm === 'typed-icl' ? ['relate-typed-v1'] : ['relation-name-v1'];
  await writeJsonAtomic(path.join(outDir, 'run-card.json'), {
    runId,
    kind: 'relation-layer',
    config: CONFIG,
    source: {
      run: CONFIG.source,
      mentionsSha256: await sha256File(src('mentions.json')),
      schemesSha256: await sha256File(src('schemes.json')),
      schemes: sourceSchemes.length,
    },
    prompts: prompts.hashesFor(promptIds),
    embeddings: { cache: embeddings.cacheStats },
    documents: docs.length,
    triples: {
      total: registry.triples.length,
      typed: typedTriples.length,
      pool: registry.pool().length,
      pending: registry.pending().length,
      unresolved,
    },
    relationTypes: registry.types.length,
    cellsWithTypes: new Set(registry.types.map((x) => x.cell)).size,
    narrowerTypes: registry.types.filter((x) => x.broader).length,
    tailShare: tailShare(registry.types),
    finalSignaturePurity: typedTriples.length ? pureTriples / typedTriples.length : 0,
    namingCalls,
    extractionFailures,
    fit,
    cost: costMeter.summary(),
  });
  await writeRunView(outDir);
  await writeRunReadme(outDir, process.env.SPIKE_PURPOSE);
  console.log(`\nwrote ${outDir}: ${registry.triples.length} triples, ${typedTriples.length} typed, ${registry.types.length} types, ${namingCalls} naming calls`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}
