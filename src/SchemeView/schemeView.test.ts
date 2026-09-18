import { runViewer } from '../RunViews/viewerHarness';
import { loadSchemeViewData, loadSchemeViewRuns, renderSchemeViewHtml } from './schemeView';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, it } from 'node:test';

interface FixtureMention {
  id: string;
  doc: number;
  name: string;
  kind: string;
  v: number[];
  assign: Array<{ doc: number; scheme: string | null; how: string; score?: number }>;
  category?: string;
}

async function schemeRun(name: string, mentions: FixtureMention[], prompt: string): Promise<string> {
  const dir = path.join(await fs.mkdtemp(path.join(os.tmpdir(), 'scheme-view-')), name);
  await fs.mkdir(path.join(dir, 'artifacts'), { recursive: true });
  const write = (file: string, value: unknown) => fs.writeFile(path.join(dir, file), JSON.stringify(value));
  const config = { llmModel: 'm', embedModel: 'e', embedTaskType: 'CLUSTERING', embedDims: 3, repr: 'combo', alpha: 0.7, tau: 0.8, delta: 0.1, poolLink: 0.85, mass: 3, kindFirst: 0.9, docs: 2, offset: 0 };
  await write('docs.json', [{ id: 7, date: '06.05.2022', title: 'First </script><script>alert(1)</script>' }, { id: 8, date: '07.05.2022', title: 'Second' }]);
  await write('mentions.json', mentions.map(({ v, ...m }) => ({ gloss: `gloss of ${m.name}`, scheme: m.assign[m.assign.length - 1].scheme, category: null, ...m })));
  await write('embeddings.json', mentions.map((m) => ({ id: m.id, v: m.v })));
  await write('schemes.json', { config, schemes: [{ id: 'S1', prefLabel: 'Country', definition: 'A sovereign state.', altLabels: [], born: 8, members: [], history: [] }] });
  await write('per-doc.json', [{ doc: 7, schemes: 0, pool: 2, namingCalls: 0, relationTypes: 0 }, { doc: 8, schemes: 1, pool: 1, namingCalls: 1, relationTypes: 0 }]);
  await write('relations-inventory.json', []);
  await write('run-card.json', { runId: name, config, prompts: { [prompt]: 'hash', 'scheme-name-v1': 'hash' }, overlay: { coverage: 0.5, crossTab: { Country: { Country: 1 } } } });
  await fs.writeFile(path.join(dir, 'events.jsonl'), `${JSON.stringify({ doc: 8, op: 'mint', scheme: 'S1', label: 'Country', size: 2 })}\n`);
  for (const doc of [7, 8]) {
    await write(path.join('artifacts', `${doc}.json`), { docId: doc, entities: mentions.filter((m) => m.doc === doc).map((m) => ({ id: m.id, name: m.name, kind: m.kind, gloss: '' })), relations: [] });
  }
  return dir;
}

const pooledThenMinted = [{ doc: 7, scheme: null, how: 'no-schemes', score: 0 }, { doc: 8, scheme: 'S1', how: 'mint' }];
const BLIND: FixtureMention[] = [
  { id: '7:0', doc: 7, name: 'Україна', kind: 'country', v: [1, 0, 0], assign: pooledThenMinted, category: 'Country' },
  { id: '7:1', doc: 7, name: 'http://evil.example/a', kind: 'malicious url', v: [0, 1, 0], assign: [{ doc: 7, scheme: null, how: 'no-schemes', score: 0 }] },
  { id: '8:0', doc: 8, name: 'Польща', kind: 'country', v: [0.9, 0.1, 0], assign: [{ doc: 8, scheme: 'S1', how: 'mint' }] },
];
const IN_CONTEXT: FixtureMention[] = [
  { id: '7:0', doc: 7, name: 'україна', kind: 'state', v: [1, 0, 0], assign: pooledThenMinted },
  { id: '8:0', doc: 8, name: 'Польща', kind: 'country', v: [0.9, 0.1, 0], assign: [{ doc: 8, scheme: 'S1', how: 'mint' }] },
  { id: '8:1', doc: 8, name: 'Remcos', kind: 'malware', v: [0, 0, 1], assign: [{ doc: 8, scheme: null, how: 'below-tau', score: 0.41 }] },
];

async function twoRuns() {
  return loadSchemeViewRuns([await schemeRun('blind', BLIND, 'extract-open-v1'), await schemeRun('in-context', IN_CONTEXT, 'extract-open-icl-v1')]);
}
const payloadOf = (html: string) => JSON.parse(/<script id="data" type="application\/json">([\s\S]*?)<\/script>/.exec(html)![1]);

describe('scheme viewer, several runs in one page', () => {
  it('lays every run out in one map, so the same mention keeps its place across runs', async () => {
    const [blind, inContext] = await twoRuns();
    const a = blind.mentions.find((m) => m.id === '7:0')!;
    const b = inContext.mentions.find((m) => m.id === '7:0')!;
    assert.deepEqual([a.x, a.y], [b.x, b.y]);
    assert.notDeepEqual([a.x, a.y], [blind.mentions[1].x, blind.mentions[1].y]);
  });

  it('aligns mentions between the runs and labels each run by what it differs in', async () => {
    const [blind, inContext] = await twoRuns();
    assert.deepEqual(blind.mentions.find((m) => m.id === '7:0')!.peers, [null, { id: '7:0', how: 'exact' }]);
    assert.deepEqual(blind.mentions.find((m) => m.id === '7:1')!.peers, [null, null]);
    assert.match(blind.label, /extract-open-v1/);
    assert.match(inContext.label, /extract-open-icl-v1/);
  });

  it('embeds every run and keeps document text from closing the data block', async () => {
    const html = renderSchemeViewHtml(await twoRuns());
    assert.equal(html.includes('</script><script>alert(1)'), false);
    const payload = payloadOf(html);
    assert.deepEqual(payload.runs.map((r: { runId: string }) => r.runId), ['blind', 'in-context']);
    assert.equal(payload.runs[0].docs[0].title, 'First </script><script>alert(1)</script>');
  });

  it('shows the run switcher only when there is more than one run', async () => {
    const single = runViewer(renderSchemeViewHtml(await loadSchemeViewData(await schemeRun('blind', BLIND, 'extract-open-v1'))));
    assert.equal(single.el('runswitch').hidden, true);
    assert.equal(single.el('runid').textContent, 'blind');

    const page = runViewer(renderSchemeViewHtml(await twoRuns()));
    assert.equal(page.el('runswitch').hidden, false);
    assert.match(page.el('run').innerHTML, /blind[\s\S]*in-context/);
  });

  it('opens on the run and the compared run named in the URL fragment, and keeps the fragment current', async () => {
    const page = runViewer(renderSchemeViewHtml(await twoRuns()), '#run=in-context&cmp=blind');
    assert.equal(page.el('runid').textContent, 'in-context');
    assert.match(page.el('cmpline').textContent, /./);
    page.fire('run', 'change', { target: { value: '0' } });
    assert.equal(page.el('runid').textContent, 'blind');
    assert.equal(page.hash(), '#run=blind&cmp=in-context');
  });

  it('switches the run and keeps the reading position by document id', async () => {
    const page = runViewer(renderSchemeViewHtml(await twoRuns()));
    page.fire('scrub', 'input', { target: { value: '0' } });
    assert.match(page.el('docline').textContent, /Document 7/);
    page.fire('run', 'change', { target: { value: '1' } });
    assert.equal(page.el('runid').textContent, 'in-context');
    assert.match(page.el('docline').textContent, /Document 7/);
  });

  it('explains a hovered pool mention: kind phrase is the extractor talking, the route is this run, the other run is listed', async () => {
    const page = runViewer(renderSchemeViewHtml(await twoRuns()));
    page.fire('map', 'mousemove', page.over({ id: '7:1', run: '0' }));
    const tip = page.el('tip').innerHTML;
    assert.match(tip, /kind phrase/);
    assert.match(tip, /malicious url/);
    assert.match(tip, /in the pool/);
    assert.match(tip, /no scheme existed yet/);
    assert.match(tip, /in-context[\s\S]*absent/);
    assert.match(tip, /not aligned/);
  });

  it('tells in a hover what the same mention became in the other run', async () => {
    const page = runViewer(renderSchemeViewHtml(await twoRuns()));
    page.fire('map', 'mousemove', page.over({ id: '7:0', run: '0' }));
    const tip = page.el('tip').innerHTML;
    assert.match(tip, /naming call minted this scheme/);
    assert.match(tip, /in-context[\s\S]*state[\s\S]*Country/);
  });

  it('draws what the compared run found and this run did not, and marks what only this run has', async () => {
    const page = runViewer(renderSchemeViewHtml(await twoRuns()));
    assert.match(page.el('map').innerHTML, /data-ghost="1"[^>]*data-id="8:1"|data-id="8:1"[^>]*data-ghost="1"/);
    assert.match(page.el('legend').innerHTML, /only in this run[\s\S]*1/);
    page.fire('map', 'mousemove', page.over({ id: '8:1', run: '1' }));
    assert.match(page.el('tip').innerHTML, /Absent from[\s\S]*blind/);
  });

  it('pins a clicked mention into the side panel', async () => {
    const page = runViewer(renderSchemeViewHtml(await twoRuns()));
    page.fire('map', 'click', page.over({ id: '7:1', run: '0' }));
    assert.match(page.el('pinned').innerHTML, /malicious url/);
  });
});
