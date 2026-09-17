/**
 * SPIKE (2026-09-17): side-by-side table of relation-layer runs (bin/spike-relations.ts) and the
 * statement overlap between them. Zero LLM calls, reads run directories only.
 *
 *   npm run spike-relcompare -- runs/spike/<run A> runs/spike/<run B> [...]
 *
 * Overlap is counted on (document, head mention, tail mention) pairs, direction-sensitive: two
 * arms that typed the same pair differently still share the statement.
 */
import fs from 'fs/promises';
import path from 'path';

interface Card {
  runId: string;
  config: { arm: string; schemes: string; tau: number; poolLink: number; mass: number };
  triples: { total: number; typed: number; pool: number; pending: number };
  relationTypes: number;
  cellsWithTypes: number;
  tailShare: number;
  finalSignaturePurity: number;
  namingCalls: number;
  fit: Record<string, number>;
  cost: { totals: { calls: number; inputTokens: number; outputTokens: number }; byOperator: Record<string, { calls: number }> };
}
interface TripleRow {
  doc: number;
  head: string;
  tail: string;
  type: string | null;
}

const pct = (x: number) => `${(100 * x).toFixed(1)}%`;

async function main() {
  const dirs = process.argv.slice(2);
  if (dirs.length === 0) {
    console.error('Usage: npm run spike-relcompare -- <relation run dir> [...]');
    process.exit(1);
  }
  const runs = await Promise.all(
    dirs.map(async (dir) => ({
      card: JSON.parse(await fs.readFile(path.join(dir, 'run-card.json'), 'utf8')) as Card,
      triples: JSON.parse(await fs.readFile(path.join(dir, 'triples.json'), 'utf8')) as TripleRow[],
    }))
  );

  const header = ['run', 'schemes', 'τ', 'link', 'mass', 'statements', 'typed', 'pool', 'pending', 'types', 'cells', 'types ≤ 2', 'purity', 'naming calls', 'relation calls', 'in / out tokens'];
  console.log(`| ${header.join(' | ')} |`);
  console.log(`|${header.map(() => '---').join('|')}|`);
  for (const { card } of runs) {
    const c = card.config;
    const blind = c.arm !== 'typed-icl';
    console.log(
      `| ${[
        `\`${card.runId}\``, c.schemes, blind ? c.tau : '', blind ? c.poolLink : '', blind ? c.mass : '',
        card.triples.total, `${card.triples.typed} (${pct(card.triples.typed / Math.max(1, card.triples.total))})`, card.triples.pool, card.triples.pending,
        card.relationTypes, card.cellsWithTypes, pct(card.tailShare), pct(card.finalSignaturePurity), card.namingCalls,
        card.cost.byOperator.relate?.calls ?? 0, `${card.cost.totals.inputTokens} / ${card.cost.totals.outputTokens}`,
      ].join(' | ')} |`
    );
  }

  console.log('\nStatement overlap on (document, head, tail):\n');
  const pairs = runs.map(({ triples }) => new Set(triples.map((x) => `${x.doc}|${x.head}|${x.tail}`)));
  const seen = new Set<string>();
  for (let i = 0; i < runs.length; i++) {
    for (let j = i + 1; j < runs.length; j++) {
      const shared = [...pairs[i]].filter((p) => pairs[j].has(p)).length;
      const line = `${pairs[i].size} vs ${pairs[j].size}, shared ${shared}`;
      const key = `${[...pairs[i]].sort().join()}#${[...pairs[j]].sort().join()}`;
      if (shared === pairs[i].size && shared === pairs[j].size) continue; // same statement universe
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`- \`${runs[i].card.runId}\` vs \`${runs[j].card.runId}\`: ${line}`);
    }
  }
  for (const { card } of runs) {
    if (Object.keys(card.fit).length > 0) console.log(`\nFit reported in \`${card.runId}\`: ${Object.entries(card.fit).map(([k, n]) => `${k} ${n}`).join(', ')}`);
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
