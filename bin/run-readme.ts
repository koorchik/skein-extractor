import { writeRunReadme } from '../src/RunReadme/runReadme';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

/**
 * Run README CLI (SKEIN-E spike):
 *
 *   npm run run-readme -- --run runs/spike/<dir> [--purpose "<one paragraph>"]
 *   npm run run-readme -- --all runs/spike
 *
 * Writes <runDir>/README.md: the hand-written text above the marker line is kept as it is, the
 * part below it is regenerated from run-card.json and the run files. --purpose seeds the
 * hand-written part of a README that does not exist yet. --all covers every subdirectory that
 * has a run-card.json.
 */
function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main() {
  const runDir = arg('run');
  const parent = arg('all');
  if (!runDir && !parent) {
    console.error('Usage: npm run run-readme -- --run <runDir> [--purpose <text>] | --all <parentDir>');
    process.exit(1);
  }
  const runDirs = runDir
    ? [runDir]
    : (await fs.readdir(parent!))
        .sort()
        .map((name) => path.join(parent!, name))
        .filter((dir) => existsSync(path.join(dir, 'run-card.json')));
  for (const dir of runDirs) console.log(`wrote ${await writeRunReadme(dir, arg('purpose'))}`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
