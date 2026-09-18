import { isProviderContentBlock } from '../bin/spike-schemes';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('spike-schemes: provider content block', () => {
  it('recognises a document the provider refuses to read, which no retry can fix', () => {
    assert.equal(isProviderContentBlock(new Error('Gemini returned no candidates (blockReason: PROHIBITED_CONTENT)')), true);
  });

  it('leaves transient failures to crash and resume', () => {
    assert.equal(isProviderContentBlock(new Error('fetch failed')), false);
    assert.equal(isProviderContentBlock(new Error('Gemini returned no candidates')), false);
    assert.equal(isProviderContentBlock('PROHIBITED_CONTENT'), false);
  });
});
