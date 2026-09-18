import { EXTRACTION_META, guardExtractionCache } from './extractionCacheGuard';
import assert from 'node:assert/strict';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import { describe, it } from 'node:test';

const KEY = { promptId: 'extract-open-relblind-v1', promptHash: 'aaa111', llmProvider: 'gemini', llmModel: 'gemini-3.7-flash' };

async function runDir(cached: string[] = []): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'extraction-cache-'));
  await fs.mkdir(path.join(dir, 'extractions'));
  for (const file of cached) await fs.writeFile(path.join(dir, 'extractions', file), '{"entities":[]}');
  return dir;
}

describe('guardExtractionCache', () => {
  it('stamps a fresh run with the prompt hash and the model that fill its cache', async () => {
    const dir = await runDir();
    assert.equal(await guardExtractionCache(dir, KEY), 'fresh');
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(dir, EXTRACTION_META), 'utf8')), KEY);
  });

  it('lets a run resume on a cache made with the same prompt and model', async () => {
    const dir = await runDir(['7.json']);
    await fs.writeFile(path.join(dir, EXTRACTION_META), JSON.stringify(KEY));
    assert.equal(await guardExtractionCache(dir, KEY), 'verified');
  });

  it('refuses a cache made with another version of the prompt', async () => {
    const dir = await runDir(['7.json']);
    await fs.writeFile(path.join(dir, EXTRACTION_META), JSON.stringify(KEY));
    await assert.rejects(guardExtractionCache(dir, { ...KEY, promptHash: 'bbb222' }), /promptHash.*aaa111.*bbb222[\s\S]*new --out/);
  });

  it('refuses a cache made with another model', async () => {
    const dir = await runDir(['7.json']);
    await fs.writeFile(path.join(dir, EXTRACTION_META), JSON.stringify(KEY));
    await assert.rejects(guardExtractionCache(dir, { ...KEY, llmModel: 'gemma4' }), /llmModel/);
  });

  it('refuses cached extractions of unknown origin unless told to adopt them', async () => {
    const dir = await runDir(['7.json']);
    await assert.rejects(guardExtractionCache(dir, KEY), /no extractions\.meta\.json/);
    assert.equal(await guardExtractionCache(dir, KEY, { adopt: true }), 'adopted');
    assert.equal(await guardExtractionCache(dir, KEY), 'verified');
  });
});
