import { RELATION_HOW, SCHEME_HOW } from './howLabels';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'fs';
import path from 'path';
import { describe, it } from 'node:test';

const SPIKE = path.join(__dirname, '..', '..', 'runs', 'spike');

function howCodes(file: string): Set<string> {
  const codes = new Set<string>();
  for (const run of readdirSync(SPIKE)) {
    const full = path.join(SPIKE, run, file);
    if (!existsSync(full)) continue;
    for (const item of JSON.parse(readFileSync(full, 'utf8')) as Array<{ assign: Array<{ how: string }> }>) for (const step of item.assign) codes.add(step.how);
  }
  return codes;
}

describe('howLabels', () => {
  it('has a plain-language label for every assignment route recorded in a scheme run', () => {
    const codes = howCodes('mentions.json');
    assert.ok(codes.size > 0, 'no scheme runs found');
    assert.deepEqual([...codes].filter((code) => !SCHEME_HOW[code]), []);
  });

  it('has a plain-language label for every assignment route recorded in a relation-layer run', () => {
    const codes = howCodes('triples.json');
    assert.ok(codes.size > 0, 'no relation-layer runs found');
    assert.deepEqual([...codes].filter((code) => !RELATION_HOW[code]), []);
  });
});
