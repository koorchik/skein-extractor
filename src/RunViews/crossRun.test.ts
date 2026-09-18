import { CrossItem, matchAcrossRuns } from './crossRun';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const item = (id: string, doc: number, ...parts: string[]): CrossItem => ({ id, doc, parts });

describe('matchAcrossRuns', () => {
  it('pairs items of the same document whose surface is equal after normalization', () => {
    const peers = matchAcrossRuns([[item('a0', 7, 'Служба безпеки України')], [item('b0', 7, '«служба  безпеки україни»')]]);
    assert.deepEqual(peers[0].a0, [null, { id: 'b0', how: 'exact' }]);
    assert.deepEqual(peers[1].b0, [{ id: 'a0', how: 'exact' }, null]);
  });

  it('never pairs items of different documents', () => {
    const peers = matchAcrossRuns([[item('a0', 7, 'Remcos')], [item('b0', 8, 'Remcos')]]);
    assert.deepEqual(peers[0].a0, [null, null]);
    assert.deepEqual(peers[1].b0, [null, null]);
  });

  it('falls back to containment when no equal surface is left, and prefers the equal one', () => {
    const peers = matchAcrossRuns([
      [item('a0', 7, 'Remcos'), item('a1', 7, 'Remcos RAT loader')],
      [item('b0', 7, 'Remcos RAT'), item('b1', 7, 'Remcos')],
    ]);
    assert.deepEqual(peers[0].a0[1], { id: 'b1', how: 'exact' });
    assert.deepEqual(peers[0].a1[1], { id: 'b0', how: 'contains' });
  });

  it('is one-to-one: an item already paired is not offered again', () => {
    const peers = matchAcrossRuns([[item('a0', 7, 'Cobalt Strike'), item('a1', 7, 'Cobalt Strike Beacon')], [item('b0', 7, 'Cobalt Strike')]]);
    assert.deepEqual(peers[0].a0[1], { id: 'b0', how: 'exact' });
    assert.equal(peers[0].a1[1], null);
  });

  it('does not use containment for very short surfaces', () => {
    const peers = matchAcrossRuns([[item('a0', 7, 'US')], [item('b0', 7, 'Russia')]]);
    assert.equal(peers[0].a0[1], null);
  });

  it('requires every part to match (statements: head and tail)', () => {
    const peers = matchAcrossRuns([
      [item('a0', 7, 'APT28', 'CredoMap'), item('a1', 7, 'APT28', 'Ukraine')],
      [item('b0', 7, 'APT28', 'CredoMap stealer'), item('b1', 7, 'Sandworm', 'Ukraine')],
    ]);
    assert.deepEqual(peers[0].a0[1], { id: 'b0', how: 'contains' });
    assert.equal(peers[0].a1[1], null);
  });

  it('keeps one slot per run, in run order', () => {
    const peers = matchAcrossRuns([[item('a0', 7, 'Emotet')], [], [item('c0', 7, 'emotet')]]);
    assert.deepEqual(peers[0].a0, [null, null, { id: 'c0', how: 'exact' }]);
    assert.deepEqual(peers[2].c0, [{ id: 'a0', how: 'exact' }, null, null]);
  });
});
