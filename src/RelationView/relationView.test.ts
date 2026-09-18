import { runViewer } from '../RunViews/viewerHarness';
import { loadRelationViewData, loadRelationViewRuns, renderRelationViewHtml } from './relationView';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, it } from 'node:test';

type Step = { doc: number; cell: string | null; type: string | null; how: string; score?: number };
interface FixtureTriple {
  id: string;
  doc: number;
  headName: string;
  tailName: string;
  phrase: string;
  assign: Step[];
  finalCellLabel: string;
}

async function relationRun(name: string, arm: string, triples: FixtureTriple[], types: Array<{ id: string; prefLabel: string; born: number }>): Promise<string> {
  const dir = path.join(await fs.mkdtemp(path.join(os.tmpdir(), 'relation-view-')), name);
  await fs.mkdir(dir, { recursive: true });
  const write = (file: string, value: unknown) => fs.writeFile(path.join(dir, file), JSON.stringify(value));
  await write('docs.json', [{ id: 7, date: '06.05.2022', title: 'First' }, { id: 8, date: '07.05.2022', title: 'Second' }]);
  await write('triples.json', triples.map((x) => {
    const last = x.assign[x.assign.length - 1];
    return { definition: `definition of ${x.phrase}`, evidence: '', cell: last.cell, type: last.type, cellLabel: last.cell ? x.finalCellLabel : null, ...x };
  }));
  await write('relation-types.json', types.map((t) => ({ cell: 'S1→S2', cellLabel: 'Threat Actor → Malware', definition: 'd', altLabels: [], broader: null, members: [], history: [], ...t })));
  await write('per-doc.json', [{ doc: 7, triples: 1, typed: 0, pool: 1, pending: 0, types: 0, cells: 1, namingCalls: 0 }, { doc: 8, triples: 2, typed: 1, pool: 0, pending: 1, types: 1, cells: 1, namingCalls: 1 }]);
  await write('run-card.json', {
    runId: name, kind: 'relation-layer',
    config: { arm, schemes: 'ingest', llmModel: 'm', embedModel: 'e', k: 10, tau: 0.9, delta: 0.1, poolLink: 0.85, mass: 3, merge: 0.85 },
    source: { run: 'runs/spike/source', schemes: 2 },
    triples: { total: triples.length, typed: 1, pool: 0, pending: 1, unresolved: 0 },
    relationTypes: types.length, cellsWithTypes: 1, tailShare: 1, finalSignaturePurity: 1, namingCalls: 1, fit: {},
    cost: { totals: { inputTokens: 1, outputTokens: 1 } },
  });
  await fs.writeFile(path.join(dir, 'events.jsonl'), '');
  return dir;
}

const CELL = 'S1→S2';
const BLIND: FixtureTriple[] = [
  { id: '7:r0', doc: 7, headName: 'APT28', tailName: 'CredoMap', phrase: 'uses-tool', finalCellLabel: 'Threat Actor → Malware', assign: [{ doc: 7, cell: CELL, type: null, how: 'no-types', score: 0 }, { doc: 8, cell: CELL, type: 'R1', how: 'mint' }] },
  { id: '8:r0', doc: 8, headName: 'APT28', tailName: 'Ukraine', phrase: 'targets-country', finalCellLabel: 'Threat Actor → (untyped)', assign: [{ doc: 8, cell: null, type: null, how: 'pending' }] },
];
const TYPED: FixtureTriple[] = [
  { id: '7:r0', doc: 7, headName: 'apt28', tailName: 'CredoMap stealer', phrase: 'uses-malware', finalCellLabel: 'Threat Actor → Malware', assign: [{ doc: 7, cell: CELL, type: 'R1', how: 'icl-new' }] },
  { id: '7:r1', doc: 7, headName: 'CredoMap', tailName: 'evil.example', phrase: 'exfiltrates-to', finalCellLabel: 'Malware → Domain Name', assign: [{ doc: 7, cell: 'S2→S3', type: 'R2', how: 'icl-new' }] },
];

async function twoRuns() {
  return loadRelationViewRuns([
    await relationRun('rel-blind-cell', 'blind-cell', BLIND, [{ id: 'R1', prefLabel: 'uses', born: 8 }]),
    await relationRun('rel-typed-icl', 'typed-icl', TYPED, [{ id: 'R1', prefLabel: 'uses-malware', born: 7 }, { id: 'R2', prefLabel: 'exfiltrates-to', born: 7 }]),
  ]);
}

describe('relation viewer, several runs in one page', () => {
  it('aligns statements between runs by document, head and tail, and labels each run by its arm', async () => {
    const [blind, typed] = await twoRuns();
    assert.deepEqual(blind.triples[0].peers, [null, { id: '7:r0', how: 'contains' }]);
    assert.deepEqual(blind.triples[1].peers, [null, null]);
    assert.deepEqual(typed.triples[1].peers, [null, null]);
    assert.match(blind.label, /blind-cell.*τ 0\.9.*mass 3/);
    assert.match(typed.label, /typed-icl/);
  });

  it('shows the run switcher only when there is more than one run', async () => {
    const single = runViewer(renderRelationViewHtml(await loadRelationViewData(await relationRun('rel-blind-cell', 'blind-cell', BLIND, [{ id: 'R1', prefLabel: 'uses', born: 8 }]))));
    assert.equal(single.el('runswitch').hidden, true);
    const page = runViewer(renderRelationViewHtml(await twoRuns()));
    assert.equal(page.el('runswitch').hidden, false);
    assert.match(page.el('run').innerHTML, /rel-blind-cell[\s\S]*rel-typed-icl/);
  });

  it('opens on the run and the compared run named in the URL fragment, and keeps the fragment current', async () => {
    const page = runViewer(renderRelationViewHtml(await twoRuns()), '#run=rel-typed-icl&cmp=rel-blind-cell');
    assert.equal(page.el('runid').textContent, 'rel-typed-icl');
    assert.match(page.el('cmpline').textContent, /./);
    page.fire('run', 'change', { target: { value: '0' } });
    assert.equal(page.el('runid').textContent, 'rel-blind-cell');
    assert.equal(page.hash(), '#run=rel-blind-cell&cmp=rel-typed-icl');
  });

  it('switches the run and keeps the reading position by document id', async () => {
    const page = runViewer(renderRelationViewHtml(await twoRuns()));
    page.fire('scrub', 'input', { target: { value: '0' } });
    page.fire('run', 'change', { target: { value: '1' } });
    assert.equal(page.el('runid').textContent, 'rel-typed-icl');
    assert.match(page.el('docline').textContent, /Document 7/);
  });

  it('puts the compared run next to every statement, with what is only here and what is absent here', async () => {
    const page = runViewer(renderRelationViewHtml(await twoRuns()));
    const table = page.el('statements').innerHTML;
    assert.match(table, /uses-tool[\s\S]*uses-malware/, 'the compared run typed the same statement differently');
    assert.match(table, /targets-country[\s\S]*only in this run/);
    assert.match(table, /absent here[\s\S]*exfiltrates-to|exfiltrates-to[\s\S]*absent here/);
  });

  it('filters the statements by their relation to the compared run', async () => {
    const page = runViewer(renderRelationViewHtml(await twoRuns()));
    page.fire('filters', 'click', page.over({ filter: 'absent' }));
    const table = page.el('statements').innerHTML;
    assert.match(table, /exfiltrates-to/);
    assert.equal(/targets-country/.test(table), false);
  });

  it('explains a clicked statement: the extractor, the route in this run, the other runs', async () => {
    const page = runViewer(renderRelationViewHtml(await twoRuns()));
    page.fire('statements', 'click', page.over({ id: '7:r0', run: '0' }));
    const panel = page.el('pinned').innerHTML;
    assert.match(panel, /Extractor said[\s\S]*uses-tool/);
    assert.match(panel, /its cell had no relation type yet/);
    assert.match(panel, /naming call minted this type/);
    assert.match(panel, /rel-typed-icl[\s\S]*uses-malware/);
  });
});
