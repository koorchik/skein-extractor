import { mapWithConcurrency } from './concurrency';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const tick = () => new Promise<void>((resolve) => setImmediate(resolve));

describe('mapWithConcurrency', () => {
  it('returns the results in input order, whatever order the work finishes in', async () => {
    const out = await mapWithConcurrency([30, 10, 20], 3, async (ms) => {
      await new Promise((resolve) => setTimeout(resolve, ms));
      return ms * 2;
    });
    assert.deepEqual(out, [60, 20, 40]);
  });

  it('never runs more than the limit at once and still runs everything', async () => {
    let running = 0;
    let peak = 0;
    const out = await mapWithConcurrency(Array.from({ length: 12 }, (_, i) => i), 4, async (i) => {
      running += 1;
      peak = Math.max(peak, running);
      await tick();
      await tick();
      running -= 1;
      return i;
    });
    assert.equal(peak, 4);
    assert.equal(out.length, 12);
  });

  it('rejects with the first error and starts no further work after it', async () => {
    const started: number[] = [];
    await assert.rejects(
      mapWithConcurrency([1, 2, 3, 4, 5, 6], 2, async (i) => {
        started.push(i);
        await tick();
        if (i === 1) throw new Error('boom');
        return i;
      }),
      /boom/
    );
    assert.ok(started.length < 6, `started ${started.join(',')}`);
    assert.equal(started.includes(6), false);
  });
});
