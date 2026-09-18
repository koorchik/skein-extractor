import { writeJsonAtomic } from '../utils/fsUtils';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

/**
 * A run's `extractions/` directory is a cache of LLM output, and a cached extraction is only valid
 * for the prompt text and the model that produced it. The key is kept NEXT to the directory
 * (`extractions.meta.json`), not inside it, because the offline studies read every file of
 * `extractions/` as an extraction. A run that finds a cache made under another prompt hash or
 * another model stops: a changed configuration is a new run directory, never a silent reuse.
 * When `extractions/` is copied into a new run for a threshold study, the meta file is copied
 * with it.
 */
export const EXTRACTION_META = 'extractions.meta.json';

export interface ExtractionCacheKey {
  promptId: string;
  promptHash: string;
  llmProvider: string;
  llmModel: string;
}

export async function guardExtractionCache(runDir: string, key: ExtractionCacheKey, options: { adopt?: boolean } = {}): Promise<'fresh' | 'verified' | 'adopted'> {
  const metaPath = path.join(runDir, EXTRACTION_META);
  const cacheDir = path.join(runDir, 'extractions');
  const cached = existsSync(cacheDir) ? (await fs.readdir(cacheDir)).filter((file) => file.endsWith('.json')).length : 0;

  if (existsSync(metaPath)) {
    const made = JSON.parse(await fs.readFile(metaPath, 'utf8')) as Partial<ExtractionCacheKey>;
    const changed = (Object.keys(key) as Array<keyof ExtractionCacheKey>).filter((field) => made[field] !== key[field]);
    if (changed.length > 0) {
      throw new Error(
        `${runDir}: the ${cached} cached extraction(s) were made under another configuration (` +
          changed.map((field) => `${field}: ${made[field]} → ${key[field]}`).join('; ') +
          '). They are not valid for this run; use a new --out directory.'
      );
    }
    return 'verified';
  }
  if (cached > 0 && !options.adopt) {
    throw new Error(
      `${runDir}: ${cached} cached extraction(s) and no ${EXTRACTION_META}, so the prompt and the model that made them are unknown. ` +
        `Copy ${EXTRACTION_META} from the run the cache came from, or set SPIKE_ADOPT_CACHE=1 to declare that they were made with ${key.promptId} (${key.promptHash.slice(0, 8)}…) on ${key.llmProvider}/${key.llmModel}.`
    );
  }
  await writeJsonAtomic(metaPath, key);
  return cached > 0 ? 'adopted' : 'fresh';
}
