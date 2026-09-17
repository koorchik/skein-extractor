import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

/**
 * Human-readable README.md for one scheme-discovery run directory (bin/spike-schemes.ts output).
 *
 * The file has two parts separated by GENERATED_MARKER. The text above the marker is written by
 * hand (purpose of the run, what it differs in, what it is evidence for) and survives
 * regeneration. Everything below the marker is derived from run-card.json and the run files, so
 * no number is typed by hand; the output carries no timestamp and regenerating is idempotent.
 */

export const GENERATED_MARKER =
  '<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->';

interface SchemeRecord {
  id: string;
  prefLabel: string;
  definition: string;
  altLabels: string[];
  born: number;
  members: string[];
}
interface MentionRecord {
  id: string;
  kind: string;
  scheme: string | null;
}
interface RelationTypeRecord {
  name: string;
  definition: string;
  born: number;
  count: number;
  aliases: unknown[];
}
interface OperatorCost {
  calls: number;
  inputTokens: number;
  outputTokens: number;
  wallClockMs: number;
}
interface RunCard {
  runId: string;
  config: Record<string, unknown>;
  prompts: Record<string, string>;
  embeddings?: { cache?: { hits: number; misses: number } };
  documents: number;
  mentions: number;
  pool: number;
  relationTypes: number;
  overlay?: { aligned: number; coverage: number; crossTab: Record<string, Record<string, number>> };
  closestSchemePairs?: Array<{ a: string; b: string; sim: number }>;
  cost?: { totals: OperatorCost; byOperator: Record<string, OperatorCost>; unpricedModels?: string[] };
}

export interface RunReadmeData {
  runCard: RunCard;
  docs: Array<{ id: number; date: string; title: string }>;
  schemes: SchemeRecord[];
  mentions: MentionRecord[];
  relationTypes: RelationTypeRecord[];
  perDoc: Array<Record<string, number>>;
  events: Array<Record<string, unknown>>;
  /** Names of the files and directories present in the run directory. */
  files: string[];
}

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await fs.readFile(file, 'utf8')) as T;
}

export async function loadRunReadmeData(runDir: string): Promise<RunReadmeData> {
  const at = (name: string) => path.join(runDir, name);
  const eventsText = existsSync(at('events.jsonl')) ? await fs.readFile(at('events.jsonl'), 'utf8') : '';
  return {
    runCard: await readJson<RunCard>(at('run-card.json')),
    docs: await readJson(at('docs.json')),
    schemes: (await readJson<{ schemes: SchemeRecord[] }>(at('schemes.json'))).schemes,
    mentions: await readJson(at('mentions.json')),
    relationTypes: await readJson(at('relations-inventory.json')),
    perDoc: await readJson(at('per-doc.json')),
    events: eventsText
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line)),
    files: (await fs.readdir(runDir)).sort(),
  };
}

/** The hand-written part of an existing README (everything above the marker), or null. */
export function extractPreamble(existing: string | null): string | null {
  if (existing === null) return null;
  const index = existing.indexOf(GENERATED_MARKER);
  const preamble = (index === -1 ? existing : existing.slice(0, index)).trim();
  return preamble === '' ? null : preamble;
}

export function defaultPreamble(runId: string, purpose?: string): string {
  return `# ${runId}\n\n${purpose ?? 'Purpose: not written yet.'}`;
}

const cell = (value: unknown) => String(value ?? '').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const table = (header: string[], rows: unknown[][]) =>
  [
    `| ${header.join(' | ')} |`,
    `|${header.map(() => '---').join('|')}|`,
    ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`),
  ].join('\n');
const truncate = (text: string, max: number) => (text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`);
const fixed = (value: number, digits = 3) => value.toFixed(digits);

/** dd.mm.yyyy → yyyy-mm-dd (sortable); anything else is returned unchanged. */
function isoDate(date: string): string {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date.trim());
  return match ? `${match[3]}-${match[2]}-${match[1]}` : date;
}

function countBy<T>(items: T[], key: (item: T) => string): Array<[string, number]> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

const FILE_GUIDE: Record<string, string> = {
  'run-card.json': 'configuration, prompt hashes, headline counts, overlay, cost; the source of every number here',
  'schemes.json': 'final scheme inventory with members and history',
  'relations-inventory.json': 'final relation types with definitions, counts and aliases',
  'mentions.json': 'every mention with kind, gloss, final scheme and its assignment trail',
  'per-doc.json': 'per-prefix counters (the growth table above)',
  'events.jsonl': 'every pool, assign, mint, alias and relation-type decision in stream order',
  'docs.json': 'the document slice in stream order',
  'embeddings.json': 'one vector per mention, for offline threshold and representation studies',
  extractions: 'cached raw extraction output per document',
  artifacts: 'per-document artifact with schemes, overlay categories and derived roles',
  'llm-calls': 'full LLM transcripts, one subdirectory per document that triggered a call',
  'scheme-view.html': 'self-contained browser view of the run (`npm run make-view`)',
  'repr-study.txt': 'output of the representation study (`npm run spike-repr`)',
};

export function renderGenerated(data: RunReadmeData): string {
  const { runCard, docs, schemes, mentions, relationTypes, perDoc, events } = data;
  const config = runCard.config;
  const sections: string[] = [];
  const position = new Map(docs.map((doc, index) => [doc.id, index + 1]));
  const offset = Number(config.offset ?? 0);
  const namingCalls = perDoc.reduce((sum, row) => sum + (row.namingCalls ?? 0), 0);
  const dates = docs.map((doc) => isoDate(doc.date)).sort();

  // ---------- at a glance ----------
  const glance: unknown[][] = [
    ['Documents', `${runCard.documents} (stream positions ${offset + 1}–${offset + docs.length}, dated ${dates[0]} to ${dates[dates.length - 1]})`],
    ['Mentions', runCard.mentions],
    ['Schemes', schemes.length],
    ['Pool (mentions without a scheme at the end)', `${runCard.pool} (${fixed((100 * runCard.pool) / Math.max(1, runCard.mentions), 1)}%)`],
    ['Relation types', runCard.relationTypes],
    ['Naming calls', namingCalls],
  ];
  if (runCard.overlay) {
    glance.push(['Hand-category overlay coverage', `${runCard.overlay.aligned} of ${runCard.mentions} mentions (${fixed(100 * runCard.overlay.coverage, 1)}%)`]);
  }
  sections.push(`## At a glance\n\n${table(['', ''], glance)}`);

  // ---------- configuration ----------
  const extractPrompt = Object.keys(runCard.prompts).find((id) => id.startsWith('extract')) ?? '(none)';
  const kindFirst = Number(config.kindFirst ?? 0);
  const configRows: unknown[][] = [
    ['Extraction and naming model', `${config.llmProvider}/${config.llmModel}`],
    ['Embedding model', `${config.embedModel} (${config.embedTaskType}, ${config.embedDims} dims)`],
    ['Extraction prompt', `\`${extractPrompt}\``],
    ['Representation', config.repr === 'combo' ? `${config.alpha} kind + ${fixed(1 - Number(config.alpha), 1)} gloss` : config.repr],
    ['Kind-first assignment', kindFirst > 0 ? `kind cosine ≥ ${kindFirst}` : 'off'],
    ['kNN vote', `k = ${config.k}, τ = ${config.tau}, margin δ = ${config.delta}`],
    ['Pool clustering', `average linkage at ${config.poolLink}, mass gate ${config.mass} documents`],
    ['Relation-type merge', `cosine ≥ ${config.relMerge}`],
  ];
  const promptLines = Object.entries(runCard.prompts).map(([id, hash]) => `- \`${id}\` sha256 \`${hash.slice(0, 12)}…\``);
  sections.push(`## Configuration\n\n${table(['Setting', 'Value'], configRows)}\n\nPrompts:\n\n${promptLines.join('\n')}`);

  // ---------- schemes ----------
  const schemeRows = schemes.map((scheme) => [
    scheme.id,
    scheme.prefLabel,
    scheme.members.length,
    `${position.get(scheme.born) ?? '?'} (${scheme.born})`,
    scheme.altLabels.join(', '),
    scheme.definition,
  ]);
  sections.push(
    `## Schemes\n\n${table(['id', 'label', 'members', 'born at document (id)', 'alt labels', 'definition'], schemeRows)}`
  );

  // ---------- naming verdicts ----------
  const labelOf = new Map(schemes.map((scheme) => [scheme.id, scheme.prefLabel]));
  const verdicts = events.filter((event) => event.op === 'mint' || event.op === 'alias');
  if (verdicts.length > 0) {
    const lines = verdicts.map((event) => {
      const where = `document ${position.get(Number(event.doc)) ?? '?'} (${event.doc})`;
      const label = event.label ?? labelOf.get(String(event.scheme));
      return event.op === 'mint'
        ? `- ${where}: \`new\` ${event.scheme} ${label}, ${event.size} mentions`
        : `- ${where}: \`alias-of\` ${event.scheme} ${label}, ${event.size} mentions absorbed`;
    });
    sections.push(`## Naming verdicts in stream order\n\n${lines.join('\n')}`);
  }

  // ---------- assignment decisions ----------
  const decisions = countBy(
    events.filter((event) => event.op === 'assign' || event.op === 'pool'),
    (event) => `${event.op}: ${event.why ?? event.how ?? 'unspecified'}`
  );
  if (decisions.length > 0) {
    sections.push(
      `## Assignment decisions\n\nOne event per decision; a pooled mention that is assigned later appears twice. ` +
        `\`drain\` is a pooled mention re-tested after a mint.\n\n${table(['decision', 'events'], decisions)}`
    );
  }

  // ---------- pool ----------
  const pooled = mentions.filter((mention) => mention.scheme === null);
  if (pooled.length > 0) {
    const kinds = countBy(pooled, (mention) => mention.kind.toLowerCase());
    const shown = kinds.slice(0, 15).map(([kind, count]) => `${kind} (${count})`);
    const rest = kinds.length > 15 ? `, and ${kinds.length - 15} more kinds` : '';
    sections.push(`## What stayed in the pool\n\n${pooled.length} mentions, ${kinds.length} distinct kind phrases: ${shown.join(', ')}${rest}.`);
  }

  // ---------- relation types ----------
  if (relationTypes.length > 0) {
    const relationRows = [...relationTypes]
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .map((type) => [type.name, type.count, type.aliases.length, `${position.get(type.born) ?? '?'}`, type.definition]);
    sections.push(`## Relation types\n\n${table(['type', 'relations', 'aliases', 'born at document', 'definition'], relationRows)}`);
  }

  // ---------- overlay ----------
  if (runCard.overlay) {
    const lines = Object.entries(runCard.overlay.crossTab)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([scheme, row]) => {
        const parts = Object.entries(row)
          .sort((a, b) => b[1] - a[1])
          .map(([category, count]) => `${category} ${count}`);
        return `- ${scheme}: ${parts.join(', ')}`;
      });
    sections.push(
      `## Scheme × hand category\n\nOverlay by plain surface match against the frozen gpt-5 stream; the hand categories are a reference, not truth.\n\n${lines.join('\n')}`
    );
  }

  // ---------- closest pairs ----------
  if (runCard.closestSchemePairs && runCard.closestSchemePairs.length > 0) {
    const lines = runCard.closestSchemePairs.slice(0, 5).map((pair) => `- ${pair.a} / ${pair.b}: ${fixed(pair.sim)}`);
    sections.push(`## Closest scheme pairs (centroid cosine)\n\n${lines.join('\n')}`);
  }

  // ---------- growth ----------
  const docById = new Map(docs.map((doc) => [doc.id, doc]));
  const growthRows = perDoc.map((row, index) => {
    const doc = docById.get(row.doc);
    return [index + 1, row.doc, doc ? isoDate(doc.date) : '', truncate(doc?.title ?? '', 60), row.mentions, row.namingCalls, row.schemes, row.pool, row.relationTypes];
  });
  sections.push(
    `## Growth over the stream\n\nSchemes, pool and relation types are cumulative.\n\n${table(['#', 'doc id', 'date', 'title', 'mentions', 'naming calls', 'schemes', 'pool', 'relation types'], growthRows)}`
  );

  // ---------- cost ----------
  if (runCard.cost) {
    const costRows = Object.entries(runCard.cost.byOperator).map(([operator, cost]) => [operator, cost.calls, cost.inputTokens, cost.outputTokens]);
    const totals = runCard.cost.totals;
    costRows.push(['total', totals.calls, totals.inputTokens, totals.outputTokens]);
    const notes = ['Covers the last invocation of the driver only.'];
    if (!('extract' in runCard.cost.byOperator)) notes.push('No extraction calls: the extractions were read from the cache in `extractions/`.');
    if (runCard.cost.unpricedModels?.length) notes.push(`USD is not recorded (unpriced: ${runCard.cost.unpricedModels.join(', ')}).`);
    notes.push(`Wall clock ${fixed(totals.wallClockMs / 1000, 1)} s.`);
    sections.push(`## Cost\n\n${notes.join(' ')}\n\n${table(['operator', 'calls', 'input tokens', 'output tokens'], costRows)}`);
  }

  // ---------- files ----------
  const fileLines = data.files.filter((name) => name in FILE_GUIDE).map((name) => `- \`${name}${name.includes('.') ? '' : '/'}\`: ${FILE_GUIDE[name]}`);
  sections.push(`## Files\n\n${fileLines.join('\n')}`);

  return sections.join('\n\n');
}

// ---------- relation-layer runs (bin/spike-relations.ts) ----------

interface RelationRunCard {
  runId: string;
  kind: 'relation-layer';
  config: Record<string, unknown>;
  source: { run: string; schemes: number; mentionsSha256: string; schemesSha256: string };
  prompts: Record<string, string>;
  documents: number;
  triples: { total: number; typed: number; pool: number; pending: number; unresolved: number };
  relationTypes: number;
  cellsWithTypes: number;
  narrowerTypes: number;
  tailShare: number;
  finalSignaturePurity: number;
  namingCalls: number;
  extractionFailures: number;
  fit: Record<string, number>;
  cost?: { totals: OperatorCost; byOperator: Record<string, OperatorCost>; unpricedModels?: string[] };
}
interface RelationTypeRow {
  id: string;
  cellLabel: string;
  prefLabel: string;
  definition: string;
  altLabels: string[];
  broader: string | null;
  born: number;
  members: string[];
}
interface TripleRow {
  id: string;
  phrase: string;
  type: string | null;
  cell: string | null;
  cellLabel: string | null;
  finalCellLabel: string;
}

export interface RelationRunReadmeData {
  runCard: RelationRunCard;
  docs: Array<{ id: number; date: string; title: string }>;
  types: RelationTypeRow[];
  triples: TripleRow[];
  perDoc: Array<Record<string, number>>;
  events: Array<Record<string, unknown>>;
  files: string[];
}

const RELATION_FILE_GUIDE: Record<string, string> = {
  'run-card.json': 'configuration, source scheme run with hashes, prompt hashes, headline counts, cost; the source of every number here',
  'relation-types.json': 'final relation types with cell, label, definition, alt labels, broader type, members and history',
  'triples.json': 'every relation statement with its phrase, cell, final type and assignment trail',
  'per-doc.json': 'per-prefix counters (the growth table above)',
  'events.jsonl': 'every pending, release, pool, assign, mint and alias decision in stream order',
  'docs.json': 'the document slice in stream order',
  relations: 'cached output of the second (relation) call per document',
  'relation-view.html': 'self-contained browser view of the run (`npm run make-view`)',
  'llm-calls': 'full LLM transcripts, one subdirectory per document that triggered a call',
};

export async function loadRelationRunReadmeData(runDir: string): Promise<RelationRunReadmeData> {
  const at = (name: string) => path.join(runDir, name);
  const eventsText = existsSync(at('events.jsonl')) ? await fs.readFile(at('events.jsonl'), 'utf8') : '';
  return {
    runCard: await readJson<RelationRunCard>(at('run-card.json')),
    docs: await readJson(at('docs.json')),
    types: await readJson(at('relation-types.json')),
    triples: await readJson(at('triples.json')),
    perDoc: await readJson(at('per-doc.json')),
    events: eventsText
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line)),
    files: (await fs.readdir(runDir)).sort(),
  };
}

export function renderRelationGenerated(data: RelationRunReadmeData): string {
  const { runCard, docs, types, triples, perDoc, events } = data;
  const config = runCard.config;
  const sections: string[] = [];
  const position = new Map(docs.map((doc, index) => [doc.id, index + 1]));
  const share = (n: number) => `${n} (${fixed((100 * n) / Math.max(1, runCard.triples.total), 1)}%)`;

  const glance: unknown[][] = [
    ['Arm', `\`${config.arm}\``],
    ['Source scheme run (entities and schemes replayed from it)', `\`${runCard.source.run}\`, ${runCard.source.schemes} schemes`],
    ['Scheme state seen by the relation layer', config.schemes === 'final' ? 'final schemes of the source run (mature-scheme emulation, NOT prefix-causal for the scheme layer)' : 'scheme known at the current document (prefix-causal)'],
    ['Documents', runCard.documents],
    ['Relation statements (triples)', runCard.triples.total],
    ['Typed', share(runCard.triples.typed)],
    ['Pool (in a cell, no type)', share(runCard.triples.pool)],
    ['Pending (an argument never got a scheme)', share(runCard.triples.pending)],
    ['Relation types', `${runCard.relationTypes} in ${runCard.cellsWithTypes} cells, ${runCard.narrowerTypes} with a broader type`],
    ['Types with at most 2 statements', `${fixed(100 * runCard.tailShare, 1)}%`],
    ['Signature purity (typed statements in the dominant final cell of their type)', `${fixed(100 * runCard.finalSignaturePurity, 1)}%`],
    ['Naming calls', runCard.namingCalls],
  ];
  if (runCard.triples.unresolved > 0) glance.push(['Statements dropped (head or tail not among the entities)', runCard.triples.unresolved]);
  if (runCard.extractionFailures > 0) glance.push(['Failed relation calls', runCard.extractionFailures]);
  if (Object.keys(runCard.fit).length > 0) {
    glance.push(['Fit reported by the model', Object.entries(runCard.fit).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(', ')]);
  }
  sections.push(`## At a glance\n\n${table(['', ''], glance)}`);

  const configRows: unknown[][] = [
    ['Model', `${config.llmProvider}/${config.llmModel}`],
    ['Embedding model', `${config.embedModel} (${config.embedTaskType}, ${config.embedDims} dims); statement text = "phrase: definition"`],
  ];
  if (config.arm === 'typed-icl') configRows.push(['Registration of a type name', `exact name inside the cell, else cosine ≥ ${config.merge} to a type of the cell, else a new type`]);
  else {
    configRows.push(['Assignment', `phrase-first, then kNN vote k = ${config.k}, τ = ${config.tau}, margin δ = ${config.delta}${config.arm === 'blind-global' ? '; one global cell' : '; inside the cell (head scheme → tail scheme)'}`]);
    configRows.push(['Pool clustering', `average linkage at ${config.poolLink}, mass gate ${config.mass} documents`]);
  }
  const promptLines = Object.entries(runCard.prompts).map(([id, hash]) => `- \`${id}\` sha256 \`${hash.slice(0, 12)}…\``);
  sections.push(`## Configuration\n\n${table(['Setting', 'Value'], configRows)}\n\nPrompts:\n\n${promptLines.join('\n')}`);

  const labelOf = new Map(types.map((type) => [type.id, type.prefLabel]));
  const phrasesOf = (type: RelationTypeRow) => {
    const members = new Set(type.members);
    return countBy(triples.filter((x) => members.has(x.id)), (x) => x.phrase).map(([phrase, n]) => `${phrase} (${n})`).join(', ');
  };
  const typeRows = [...types]
    .sort((a, b) => a.cellLabel.localeCompare(b.cellLabel) || b.members.length - a.members.length)
    .map((type) => [type.cellLabel, type.id, type.prefLabel, type.members.length, type.broader ? labelOf.get(type.broader) ?? type.broader : '', position.get(type.born) ?? '?', phrasesOf(type), type.definition]);
  sections.push(`## Relation types\n\n${table(['cell', 'id', 'label', 'statements', 'broader', 'born at document', 'phrases', 'definition'], typeRows)}`);

  const decisions = countBy(
    events.filter((event) => event.op === 'assign' || event.op === 'pool'),
    (event) => `${event.op}: ${event.why ?? 'unspecified'}`
  );
  if (decisions.length > 0) sections.push(`## Assignment decisions\n\n${table(['decision', 'events'], decisions)}`);

  const leftovers = triples.filter((x) => x.type === null);
  if (leftovers.length > 0) {
    const byCell = countBy(leftovers, (x) => (x.cell === null ? `pending, final cell ${x.finalCellLabel}` : x.cellLabel ?? x.cell));
    const lines = byCell.map(([cell, n]) => {
      const phrases = countBy(leftovers.filter((x) => (x.cell === null ? `pending, final cell ${x.finalCellLabel}` : x.cellLabel ?? x.cell) === cell), (x) => x.phrase);
      return `- ${cell}: ${n} (${phrases.slice(0, 6).map(([p, k]) => `${p} ${k}`).join(', ')}${phrases.length > 6 ? ', …' : ''})`;
    });
    sections.push(`## Statements without a type\n\n${lines.join('\n')}`);
  }

  const docById = new Map(docs.map((doc) => [doc.id, doc]));
  const growthRows = perDoc.map((row, index) => [index + 1, row.doc, truncate(docById.get(row.doc)?.title ?? '', 50), row.triples, row.typed, row.pool, row.pending, row.types, row.cells, row.namingCalls]);
  sections.push(
    `## Growth over the stream\n\nTyped, pool, pending, types and cells are cumulative.\n\n${table(['#', 'doc id', 'title', 'new statements', 'typed', 'pool', 'pending', 'types', 'cells with types', 'naming calls'], growthRows)}`
  );

  if (runCard.cost) {
    const costRows = Object.entries(runCard.cost.byOperator).map(([operator, cost]) => [operator, cost.calls, cost.inputTokens, cost.outputTokens]);
    const totals = runCard.cost.totals;
    costRows.push(['total', totals.calls, totals.inputTokens, totals.outputTokens]);
    const notes = ['Covers the last invocation of the driver only. Entity extraction and scheme naming belong to the source run and are not counted here.'];
    if (runCard.cost.unpricedModels?.length) notes.push(`USD is not recorded (unpriced: ${runCard.cost.unpricedModels.join(', ')}).`);
    sections.push(`## Cost\n\n${notes.join(' ')}\n\n${table(['operator', 'calls', 'input tokens', 'output tokens'], costRows)}`);
  }

  const fileLines = data.files.filter((name) => name in RELATION_FILE_GUIDE).map((name) => `- \`${name}${name.includes('.') ? '' : '/'}\`: ${RELATION_FILE_GUIDE[name]}`);
  sections.push(`## Files\n\n${fileLines.join('\n')}`);
  return sections.join('\n\n');
}

export function renderRunReadme(data: RunReadmeData, preamble: string | null, purpose?: string): string {
  const head = preamble ?? defaultPreamble(data.runCard.runId, purpose);
  return `${head}\n\n${GENERATED_MARKER}\n\n${renderGenerated(data)}\n`;
}

/** Writes <runDir>/README.md, keeping the hand-written text above the marker if the file exists. */
export async function writeRunReadme(runDir: string, purpose?: string): Promise<string> {
  const file = path.join(runDir, 'README.md');
  const existing = existsSync(file) ? await fs.readFile(file, 'utf8') : null;
  const card = await readJson<{ runId: string; kind?: string }>(path.join(runDir, 'run-card.json'));
  const generated =
    card.kind === 'relation-layer' ? renderRelationGenerated(await loadRelationRunReadmeData(runDir)) : renderGenerated(await loadRunReadmeData(runDir));
  const head = extractPreamble(existing) ?? defaultPreamble(card.runId, purpose);
  await fs.writeFile(file, `${head}\n\n${GENERATED_MARKER}\n\n${generated}\n`);
  return file;
}
