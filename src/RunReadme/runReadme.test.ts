import { GENERATED_MARKER, extractPreamble, loadRunReadmeData, renderRunReadme, writeRunReadme } from './runReadme';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { before, describe, it } from 'node:test';

const RUN_CARD = {
  runId: 'test-run',
  config: { docs: 2, offset: 100, llmProvider: 'gemini', llmModel: 'm', embedModel: 'e', embedTaskType: 'CLUSTERING', embedDims: 768, k: 10, tau: 0.8, delta: 0.1, poolLink: 0.85, mass: 3, relMerge: 0.85, repr: 'combo', alpha: 0.7, kindFirst: 0.9 },
  prompts: { 'extract-open-v1': 'a'.repeat(64), 'scheme-name-v1': 'b'.repeat(64) },
  documents: 2,
  mentions: 3,
  pool: 1,
  relationTypes: 1,
  overlay: { aligned: 2, coverage: 2 / 3, crossTab: { Malware: { Software: 2 }, '(pool)': { '(unaligned)': 1 } } },
  closestSchemePairs: [],
  cost: {
    totals: { calls: 1, inputTokens: 10, outputTokens: 5, wallClockMs: 1500 },
    byOperator: { 'scheme-name': { calls: 1, inputTokens: 10, outputTokens: 5, wallClockMs: 1500 } },
    unpricedModels: ['gemini/m'],
  },
};

describe('runReadme', () => {
  let runDir: string;

  before(async () => {
    runDir = await fs.mkdtemp(path.join(os.tmpdir(), 'run-readme-'));
    const write = (name: string, value: unknown) => fs.writeFile(path.join(runDir, name), JSON.stringify(value));
    await write('run-card.json', RUN_CARD);
    await write('docs.json', [
      { id: 7, date: '06.05.2022', title: 'First | report' },
      { id: 9, date: '29.04.2022', title: 'Second report' },
    ]);
    await write('schemes.json', {
      schemes: [{ id: 'S1', prefLabel: 'Malware', definition: 'Malicious software.', altLabels: ['Malicious Software'], born: 9, members: ['7:0', '9:0'] }],
    });
    await write('mentions.json', [
      { id: '7:0', kind: 'malware family', scheme: 'S1' },
      { id: '9:0', kind: 'malware', scheme: 'S1' },
      { id: '9:1', kind: 'Registry Key', scheme: null },
    ]);
    await write('relations-inventory.json', [{ name: 'uses', definition: 'Employs a tool.', born: 7, count: 4, aliases: [] }]);
    await write('per-doc.json', [
      { doc: 7, mentions: 1, namingCalls: 0, schemes: 0, pool: 1, relationTypes: 1 },
      { doc: 9, mentions: 2, namingCalls: 1, schemes: 1, pool: 1, relationTypes: 1 },
    ]);
    await fs.writeFile(
      path.join(runDir, 'events.jsonl'),
      [
        { doc: 7, op: 'pool', mention: '7:0', why: 'no-schemes' },
        { doc: 9, op: 'mint', scheme: 'S1', label: 'Malware', size: 2 },
        { doc: 9, op: 'assign', mention: '9:0', scheme: 'S1', how: 'drain' },
      ]
        .map((event) => JSON.stringify(event))
        .join('\n') + '\n'
    );
  });

  it('renders the headline numbers, stream positions and derived sections', async () => {
    const text = renderRunReadme(await loadRunReadmeData(runDir), null);
    assert.match(text, /^# test-run\n\nPurpose: not written yet\./);
    assert.match(text, /\| Documents \| 2 \(stream positions 101–102, dated 2022-04-29 to 2022-05-06\) \|/);
    assert.match(text, /\| Pool \(mentions without a scheme at the end\) \| 1 \(33\.3%\) \|/);
    assert.match(text, /\| Naming calls \| 1 \|/);
    assert.match(text, /\| S1 \| Malware \| 2 \| 2 \(9\) \|/);
    assert.match(text, /- document 2 \(9\): `new` S1 Malware, 2 mentions/);
    assert.match(text, /\| assign: drain \| 1 \|/);
    assert.match(text, /1 mentions, 1 distinct kind phrases: registry key \(1\)\./);
    assert.match(text, /No extraction calls/);
    assert.match(text, /First \\\| report/);
    assert.match(text, /- `run-card\.json`:/);
  });

  it('keeps the hand-written text above the marker and is idempotent', async () => {
    const file = await writeRunReadme(runDir, 'Seeded purpose.');
    const first = await fs.readFile(file, 'utf8');
    assert.match(first, /^# test-run\n\nSeeded purpose\./);

    const edited = first.replace('Seeded purpose.', 'Hand-written purpose.').replace('| Mentions | 3 |', '| Mentions | 999 |');
    await fs.writeFile(file, edited);
    await writeRunReadme(runDir, 'ignored because a preamble exists');
    const second = await fs.readFile(file, 'utf8');
    assert.match(second, /Hand-written purpose\./);
    assert.match(second, /\| Mentions \| 3 \|/);
    assert.equal(second.split(GENERATED_MARKER).length, 2);

    await writeRunReadme(runDir);
    assert.equal(await fs.readFile(file, 'utf8'), second);
  });

  it('treats a README without the marker as hand-written text', () => {
    assert.equal(extractPreamble('# run\n\nNotes.\n'), '# run\n\nNotes.');
    assert.equal(extractPreamble(`${GENERATED_MARKER}\nold`), null);
    assert.equal(extractPreamble(null), null);
  });
});
