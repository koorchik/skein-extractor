import { normSurface } from '../RelationDiscovery/relationCells';

/**
 * Alignment of items (entity mentions, relation statements) between runs, for the multi-run
 * viewers. Runs extract independently, so ids do not carry over; two items are taken to be the
 * same thing when they come from the same document and every surface part (a mention: its name;
 * a statement: head name and tail name) is equal after `normSurface`, or, for what is left, when
 * one surface contains the other. Pairing is one-to-one inside a document and pairwise between
 * runs (not transitive). A viewer aid: it is not the mention-level agreement measure of E0d/E5.
 */
export interface CrossItem {
  id: string;
  doc: number;
  parts: string[];
}
export type MatchHow = 'exact' | 'contains';
export interface Peer {
  id: string;
  how: MatchHow;
}
/** For one run: item id → one slot per run (run order), null for the run itself and for no match. */
export type PeerTable = Record<string, Array<Peer | null>>;

/** Containment on shorter surfaces pairs unrelated things ("US" inside "Russia"). */
const MIN_CONTAINED = 4;

function contains(a: string, b: string): boolean {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= MIN_CONTAINED && long.includes(short);
}

function pairRuns(a: CrossItem[], b: CrossItem[]): Array<[string, string, MatchHow]> {
  const norm = (x: CrossItem) => x.parts.map(normSurface);
  const byDoc = new Map<number, Array<{ id: string; parts: string[] }>>();
  for (const x of b) byDoc.set(x.doc, [...(byDoc.get(x.doc) ?? []), { id: x.id, parts: norm(x) }]);
  const taken = new Set<string>();
  const pairs: Array<[string, string, MatchHow]> = [];
  const pass = (how: MatchHow, same: (p: string, q: string) => boolean, left: CrossItem[]) =>
    left.filter((x) => {
      const parts = norm(x);
      const hit = (byDoc.get(x.doc) ?? []).find((y) => !taken.has(y.id) && y.parts.length === parts.length && parts.every((p, i) => same(p, y.parts[i])));
      if (!hit) return true;
      taken.add(hit.id);
      pairs.push([x.id, hit.id, how]);
      return false;
    });
  pass('contains', contains, pass('exact', (p, q) => p === q, a));
  return pairs;
}

export function matchAcrossRuns(runs: CrossItem[][]): PeerTable[] {
  const tables: PeerTable[] = runs.map((items) => Object.fromEntries(items.map((x) => [x.id, runs.map(() => null)])));
  for (let r = 0; r < runs.length; r++) {
    for (let q = r + 1; q < runs.length; q++) {
      for (const [idA, idB, how] of pairRuns(runs[r], runs[q])) {
        tables[r][idA][q] = { id: idB, how };
        tables[q][idB][r] = { id: idA, how };
      }
    }
  }
  return tables;
}
