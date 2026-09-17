import { cosineNormalized } from '../utils/vectorUtils';

/**
 * Relation-type discovery over argument-type cells (SKEIN-E spike, 2026-09-17).
 *
 * A relation statement (triple) is typed inside a CELL: the pair (scheme of the head, scheme of
 * the tail) as known at the current document. The mechanism mirrors the scheme layer: phrase-first
 * assignment, kNN vote among the typed triples of the same cell where only neighbours ≥ τ vote,
 * otherwise the cell's pool; pool clusters with enough document mass are named by one LLM call
 * (made by the driver). A triple whose arguments have no scheme yet stays PENDING and is released
 * by a later document once both arguments are typed, so no decision reads past the current
 * document. With `useCells = false` every triple lives in one global cell (the control arm).
 *
 * Pure state and decisions only: embeddings, clustering and LLM calls belong to the driver
 * (bin/spike-relations.ts).
 */

export const GLOBAL_CELL = '*';
export const UNTYPED = '(untyped)';

export interface TrailMention {
  id: string;
  doc: number;
  name: string;
  kind: string;
  gloss: string;
  scheme: string | null;
  assign: Array<{ doc: number; scheme: string | null; how: string }>;
}

/** Same normalization as the scheme driver's in-document dedupe (bin/spike-schemes.ts). */
export function normSurface(s: string): string {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[«»"'`“”‘’()\[\]{}<>,.;:!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const normPhrase = (s: string) => s.trim().toLowerCase().replace(/[\s_]+/g, '-');

/**
 * Scheme of a mention as it was known after the document at stream position `t` (replayed from
 * the assignment trail of a finished scheme run; `position` maps document id → stream position).
 */
export function schemeAt(mention: TrailMention, position: Map<number, number>, t: number): string | null {
  let scheme: string | null = null;
  for (const step of mention.assign) {
    const at = position.get(step.doc);
    if (at !== undefined && at <= t) scheme = step.scheme;
  }
  return scheme;
}

export const cellKey = (head: string | null, tail: string | null) => `${head ?? UNTYPED}→${tail ?? UNTYPED}`;

export interface Triple {
  id: string;
  doc: number;
  head: string; // mention id
  tail: string; // mention id
  headName: string;
  tailName: string;
  phrase: string;
  definition: string;
  evidence: string;
  cell: string | null; // null while pending
  type: string | null; // null while pending or pooled
  assign: Array<{ doc: number; cell: string | null; type: string | null; how: string; score?: number }>;
}

export interface RelationType {
  id: string;
  cell: string;
  prefLabel: string;
  definition: string;
  altLabels: string[];
  broader: string | null;
  born: number;
  members: string[];
  history: Array<{ doc: number; op: string; detail: string }>;
}

export interface AssignOptions {
  k: number;
  tau: number;
  delta: number;
}

export interface AssignResult {
  type: string | null;
  why: 'phrase-first' | 'knn' | 'no-types' | 'below-tau' | 'ambiguous';
  score: number;
}

export class RelationCellRegistry {
  readonly triples: Triple[] = [];
  readonly types: RelationType[] = [];
  readonly vectors = new Map<string, number[]>();
  #seq = 0;

  add(triple: Triple, vector: number[]) {
    this.triples.push(triple);
    this.vectors.set(triple.id, vector);
  }

  pending = () => this.triples.filter((t) => t.cell === null);
  pool = (cell?: string) => this.triples.filter((t) => t.cell !== null && t.type === null && (cell === undefined || t.cell === cell));
  typed = (cell: string) => this.triples.filter((t) => t.cell === cell && t.type !== null);
  typesIn = (cell: string) => this.types.filter((t) => t.cell === cell);
  cells = () => [...new Set(this.triples.map((t) => t.cell).filter((c): c is string => c !== null))];
  typeById = (id: string) => this.types.find((t) => t.id === id);

  typeByLabel(cell: string, label: string): RelationType | undefined {
    const key = normPhrase(label);
    return this.typesIn(cell).find((t) => normPhrase(t.prefLabel) === key || t.altLabels.some((a) => normPhrase(a) === key));
  }

  /** Phrase-first (the phrase is already carried by members of one type of this cell), then the kNN vote. */
  tryAssign(triple: Triple, options: AssignOptions): AssignResult {
    const cell = triple.cell;
    if (cell === null) throw new Error(`tryAssign on a pending triple ${triple.id}`);
    const typed = this.typed(cell);
    if (typed.length === 0) return { type: null, why: 'no-types', score: 0 };

    const samePhrase = new Map<string, number>();
    for (const other of typed) {
      if (other.phrase === triple.phrase) samePhrase.set(other.type!, (samePhrase.get(other.type!) ?? 0) + 1);
    }
    if (samePhrase.size > 0) {
      const [type] = [...samePhrase.entries()].sort((a, b) => b[1] - a[1])[0];
      return { type, why: 'phrase-first', score: 1 };
    }

    const v = this.vectors.get(triple.id)!;
    const neighbours = typed
      .map((other) => ({ other, s: cosineNormalized(v, this.vectors.get(other.id)!) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, options.k)
      .filter((n) => n.s >= options.tau);
    if (neighbours.length === 0) return { type: null, why: 'below-tau', score: 0 };
    const votes = new Map<string, number>();
    for (const n of neighbours) votes.set(n.other.type!, (votes.get(n.other.type!) ?? 0) + 1);
    const ranked = [...votes.entries()].sort((a, b) => b[1] - a[1]);
    const share = ranked[0][1] / neighbours.length;
    const runnerUp = ranked.length > 1 ? ranked[1][1] / neighbours.length : 0;
    if (share - runnerUp < options.delta) return { type: null, why: 'ambiguous', score: neighbours[0].s };
    return { type: ranked[0][0], why: 'knn', score: neighbours[0].s };
  }

  mint(input: { cell: string; prefLabel: string; definition: string; altLabels: string[]; broader: string | null; doc: number; members: Triple[] }): RelationType {
    const type: RelationType = {
      id: `R${++this.#seq}`,
      cell: input.cell,
      prefLabel: input.prefLabel,
      definition: input.definition,
      altLabels: input.altLabels,
      broader: input.broader,
      born: input.doc,
      members: [],
      history: [
        {
          doc: input.doc,
          op: input.broader ? 'mint-narrower' : 'mint',
          detail: `${input.members.length} statements from ${new Set(input.members.map((m) => m.doc)).size} documents`,
        },
      ],
    };
    this.types.push(type);
    for (const member of input.members) this.place(member, type, input.doc, 'mint');
    return type;
  }

  place(triple: Triple, type: RelationType, doc: number, how: string, score?: number) {
    triple.type = type.id;
    triple.assign.push({ doc, cell: triple.cell, type: type.id, how, ...(score === undefined ? {} : { score }) });
    type.members.push(triple.id);
  }
}

/** Share of relation types carrying at most `max` statements (the long tail of the inventory). */
export function tailShare(types: Array<{ members: string[] }>, max = 2): number {
  return types.length === 0 ? 0 : types.filter((t) => t.members.length <= max).length / types.length;
}
