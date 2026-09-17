import { renderRelationViewHtml } from '../RelationView/relationView';
import { VIEW_FILE, runKind, writeRunView } from './runViews';
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
    assert.equal(JSON.parse(payload).triples[0].evidence, '<b>bold</b>');
    assert.equal(JSON.parse(payload).docs[0].title, 'Report </script><script>alert(1)</script>');
  });

  it('treats a run card without a kind as a scheme run and refuses an unknown kind', async () => {
    const runDir = await fs.mkdtemp(path.join(os.tmpdir(), 'run-view-'));
    await fs.writeFile(path.join(runDir, 'run-card.json'), JSON.stringify({ runId: 'x' }));
    assert.equal(await runKind(runDir), 'scheme');
    await fs.writeFile(path.join(runDir, 'run-card.json'), JSON.stringify({ runId: 'x', kind: 'identity' }));
    await assert.rejects(runKind(runDir), /no viewer for run kind "identity"/);
  });

  it('renders the relation viewer from data alone', () => {
    const html = renderRelationViewHtml({ runId: 'r', docs: [], triples: [], types: [], events: [], perDoc: [], runCard: {} });
    assert.match(html, /^<!doctype html>/);
  });
});
