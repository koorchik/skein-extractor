import { renderRelationViewHtml } from '../RelationView/relationView';
import { COMPARE_FILE, VIEW_FILE, runKind, writeComparePages, writeRunView, writeRunViews } from './runViews';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, it } from 'node:test';

const RELATION_RUN = {
  'run-card.json': {
    runId: 'rel-run', kind: 'relation-layer',
    config: { arm: 'blind-cell', schemes: 'ingest', llmModel: 'm', embedModel: 'e', k: 10, tau: 0.8, delta: 0.1, poolLink: 0.85, mass: 3, merge: 0.85 },
    source: { run: 'runs/spike/source', schemes: 2 },
    triples: { total: 1, typed: 1, pool: 0, pending: 0, unresolved: 0 },
    relationTypes: 1, cellsWithTypes: 1, tailShare: 1, finalSignaturePurity: 1, namingCalls: 1, fit: {},
    cost: { totals: { inputTokens: 1, outputTokens: 1 } },
  },
  'docs.json': [{ id: 7, date: '06.05.2022', title: 'Report </script><script>alert(1)</script>' }],
  'triples.json': [
    {
      id: '7:r0', doc: 7, headName: 'APT28', tailName: 'CredoMap', phrase: 'uses-tool', definition: '', evidence: '<b>bold</b>', cell: 'S1→S2', type: 'R1',
      assign: [{ doc: 7, cell: 'S1→S2', type: 'R1', how: 'mint' }], cellLabel: 'Threat Actor → Malware', finalCellLabel: 'Threat Actor → Malware',
    },
  ],
  'relation-types.json': [
    { id: 'R1', cell: 'S1→S2', cellLabel: 'Threat Actor → Malware', prefLabel: 'uses', definition: 'd', altLabels: [], broader: null, born: 7, members: ['7:r0'], history: [] },
  ],
  'per-doc.json': [{ doc: 7, triples: 1, typed: 1, pool: 0, pending: 0, types: 1, cells: 1, namingCalls: 1 }],
};

describe('runViews', () => {
  it('writes the viewer that fits a relation-layer run, with the data embedded safely', async () => {
    const runDir = await fs.mkdtemp(path.join(os.tmpdir(), 'run-view-'));
    for (const [name, value] of Object.entries(RELATION_RUN)) await fs.writeFile(path.join(runDir, name), JSON.stringify(value));
    await fs.writeFile(path.join(runDir, 'events.jsonl'), `${JSON.stringify({ doc: 7, op: 'mint', label: 'uses', size: 1 })}\n`);

    assert.equal(await runKind(runDir), 'relation-layer');
    const file = await writeRunView(runDir);
    assert.equal(path.basename(file), VIEW_FILE['relation-layer']);
    const html = await fs.readFile(file, 'utf8');
    assert.match(html, /<title>SKEIN-E relation types — /);
    assert.equal(html.includes('</script><script>alert(1)'), false, 'document text must not close the data block');
    const payload = /<script id="data" type="application\/json">([\s\S]*?)<\/script>/.exec(html)![1];
    assert.equal(JSON.parse(payload).runs[0].triples[0].evidence, '<b>bold</b>');
    assert.equal(JSON.parse(payload).runs[0].docs[0].title, 'Report </script><script>alert(1)</script>');
  });

  async function relationRuns(names: string[]): Promise<string> {
    const parent = await fs.mkdtemp(path.join(os.tmpdir(), 'run-views-'));
    for (const name of names) {
      await fs.mkdir(path.join(parent, name));
      for (const [file, value] of Object.entries(RELATION_RUN)) await fs.writeFile(path.join(parent, name, file), JSON.stringify(value));
      await fs.writeFile(path.join(parent, name, 'events.jsonl'), '');
    }
    return parent;
  }
  const runIds = async (file: string) => {
    const payload = /<script id="data" type="application\/json">([\s\S]*?)<\/script>/.exec(await fs.readFile(file, 'utf8'))![1];
    return JSON.parse(payload).runs.map((r: { runId: string }) => r.runId);
  };

  it('writes several runs of one kind into one page with a run switcher', async () => {
    const parent = await relationRuns(['rel-a', 'rel-b']);
    const out = path.join(parent, 'both.html');
    assert.equal(await writeRunViews([path.join(parent, 'rel-a'), path.join(parent, 'rel-b')], out), out);
    assert.deepEqual(await runIds(out), ['rel-a', 'rel-b']);
  });

  it('refuses to put runs of different kinds into one page', async () => {
    const parent = await relationRuns(['rel-a', 'scheme-a']);
    await fs.writeFile(path.join(parent, 'scheme-a', 'run-card.json'), JSON.stringify({ runId: 'scheme-a' }));
    await assert.rejects(writeRunViews([path.join(parent, 'rel-a'), path.join(parent, 'scheme-a')], path.join(parent, 'x.html')), /one kind of run per page/);
  });

  it('writes one compare page per run kind that has at least two runs under a directory', async () => {
    const parent = await relationRuns(['rel-a', 'rel-b']);
    await fs.mkdir(path.join(parent, 'not-a-run'));
    const written = await writeComparePages(parent);
    assert.deepEqual(written, [path.join(parent, COMPARE_FILE['relation-layer'])]);
    assert.deepEqual(await runIds(written[0]), ['rel-a', 'rel-b']);
  });

  it('treats a run card without a kind as a scheme run and refuses an unknown kind', async () => {
    const runDir = await fs.mkdtemp(path.join(os.tmpdir(), 'run-view-'));
    await fs.writeFile(path.join(runDir, 'run-card.json'), JSON.stringify({ runId: 'x' }));
    assert.equal(await runKind(runDir), 'scheme');
    await fs.writeFile(path.join(runDir, 'run-card.json'), JSON.stringify({ runId: 'x', kind: 'identity' }));
    await assert.rejects(runKind(runDir), /no viewer for run kind "identity"/);
  });

  it('renders the relation viewer from data alone', () => {
    const html = renderRelationViewHtml({ runId: 'r', label: '', docs: [], triples: [], types: [], events: [], perDoc: [], runCard: {} });
    assert.match(html, /^<!doctype html>/);
  });
});
