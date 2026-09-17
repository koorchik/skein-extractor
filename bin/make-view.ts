import { writeRunView } from '../src/RunViews/runViews';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

/**
 * Run viewer CLI (SKEIN-E spike):
 *
 *   npm run make-view -- --run runs/spike/<dir>
 *   npm run make-view -- --all runs/spike
 *
 * Writes the self-contained HTML viewer that fits the run (scheme-view.html for a scheme run,
 * relation-view.html for a relation-layer run; see src/RunViews/runViews.ts). Both drivers call
 * the same function at the end of a run; this command regenerates viewers after a viewer changes.
 * --all covers every subdirectory that has a run-card.json. No LLM calls, no network.
 */
function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main() {
  const runDir = arg('run');
  const parent = arg('all');
  if (!runDir && !parent) {
    console.error('Usage: npm run make-view -- --run <runDir> | --all <parentDir>');
    process.exit(1);
  }
  const runDirs = runDir
    ? [runDir]
    : (await fs.readdir(parent!))
        .sort()
        .map((name) => path.join(parent!, name))
        .filter((dir) => existsSync(path.join(dir, 'run-card.json')));
  for (const dir of runDirs) console.log(`wrote ${await writeRunView(dir)}`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
