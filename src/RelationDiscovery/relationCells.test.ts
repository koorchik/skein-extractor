import { RelationCellRegistry, TrailMention, Triple, cellKey, normPhrase, schemeAt, tailShare } from './relationCells';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const unit = (x: number, y: number) => {
  const len = Math.hypot(x, y);
  return [x / len, y / len];
};
const triple = (id: string, doc: number, phrase: string, cell: string | null): Triple => ({
  id, doc, head: `${doc}:0`, tail: `${doc}:1`, headName: 'h', tailName: 't', phrase, definition: '', evidence: '', cell, type: null, assign: [],
});
const OPTIONS = { k: 10, tau: 0.8, delta: 0.1 };

describe('relationCells', () => {
  it('replays the scheme of a mention by stream position, not by document id', () => {
    const position = new Map([[900, 0], [17, 1], [40, 2]]);
    const mention: TrailMention = {
      id: '900:0', doc: 900, name: 'x', kind: 'k', gloss: 'g', scheme: 'S1',
      assign: [{ doc: 900, scheme: null, how: 'no-schemes' }, { doc: 40, scheme: 'S1', how: 'mint' }],
    };
    assert.equal(schemeAt(mention, position, 0), null);
    assert.equal(schemeAt(mention, position, 1), null);
    assert.equal(schemeAt(mention, position, 2), 'S1');
    assert.equal(cellKey('S1', null), 'S1→(untyped)');
    assert.equal(normPhrase(' Hosts File '), 'hosts-file');
  });

  it('votes only inside the cell of the triple', () => {
    const registry = new RelationCellRegistry();
    const a = triple('1:r0', 1, 'hosts-file', 'S1→S2');
    const b = triple('2:r0', 2, 'uses-tool', 'S3→S2');
    registry.add(a, unit(1, 0));
    registry.add(b, unit(1, 0.05));
    registry.mint({ cell: 'S1→S2', prefLabel: 'hosts', definition: '', altLabels: [], broader: null, doc: 1, members: [a] });
    const other = registry.mint({ cell: 'S3→S2', prefLabel: 'uses', definition: '', altLabels: [], broader: null, doc: 2, members: [b] });

    const sameVectorOtherCell = triple('3:r0', 3, 'serves-payload', 'S3→S2');
    registry.add(sameVectorOtherCell, unit(1, 0));
    assert.deepEqual(registry.tryAssign(sameVectorOtherCell, OPTIONS).type, other.id);

    const emptyCell = triple('3:r1', 3, 'serves-payload', 'S9→S9');
    registry.add(emptyCell, unit(1, 0));
    assert.equal(registry.tryAssign(emptyCell, OPTIONS).why, 'no-types');
  });

  it('assigns phrase-first, pools below τ and refuses a tied vote', () => {
    const registry = new RelationCellRegistry();
    const cell = 'S1→S2';
    const a = triple('1:r0', 1, 'hosts-file', cell);
    const b = triple('1:r1', 1, 'exploits', cell);
    registry.add(a, unit(1, 0));
    registry.add(b, unit(0, 1));
    const hosts = registry.mint({ cell, prefLabel: 'hosts', definition: '', altLabels: ['hosts-payload'], broader: null, doc: 1, members: [a] });
    registry.mint({ cell, prefLabel: 'exploits', definition: '', altLabels: [], broader: hosts.id, doc: 1, members: [b] });

    const samePhrase = triple('2:r0', 2, 'hosts-file', cell);
    registry.add(samePhrase, unit(0, 1)); // the vector points at the other type: the phrase wins
    assert.deepEqual(registry.tryAssign(samePhrase, OPTIONS), { type: hosts.id, why: 'phrase-first', score: 1 });

    const far = triple('2:r1', 2, 'registered-with', cell);
    registry.add(far, unit(-1, -1));
    assert.equal(registry.tryAssign(far, OPTIONS).why, 'below-tau');

    const between = triple('2:r2', 2, 'serves', cell);
    registry.add(between, unit(1, 1));
    assert.equal(registry.tryAssign(between, { ...OPTIONS, tau: 0.7 }).why, 'ambiguous');

    assert.equal(registry.typeByLabel(cell, 'Hosts Payload')?.id, hosts.id);
    assert.equal(registry.pool(cell).length, 3);
    assert.equal(tailShare(registry.types), 1);
  });

  it('keeps a pending triple out of every pool', () => {
    const registry = new RelationCellRegistry();
    registry.add(triple('1:r0', 1, 'uses', null), unit(1, 0));
    assert.equal(registry.pending().length, 1);
    assert.equal(registry.pool().length, 0);
    assert.deepEqual(registry.cells(), []);
  });
});
