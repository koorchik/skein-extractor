import { writeComparePages, writeRunView, writeRunViews } from '../src/RunViews/runViews';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

/**
 * Run viewer CLI (SKEIN-E spike):
 *
 *   npm run make-view -- --run runs/spike/<dir>
 *   npm run make-view -- --all runs/spike
 *   npm run make-view -- --run <runA> --run <runB> [--run …] --out <file>
 *   npm run make-view -- --compare runs/spike
 *
 * Writes the self-contained HTML viewer that fits the run (scheme-view.html for a scheme run,
 * relation-view.html for a relation-layer run; see src/RunViews/runViews.ts). Both drivers call
 * the same function at the end of a run; this command regenerates viewers after a viewer changes.
 * --all covers every subdirectory that has a run-card.json. No LLM calls, no network.
 *
 * Passing --run more than once puts the runs (all of one kind) into ONE page behind a run
 * switcher; --out is then required, since the page belongs to no single run. --compare does that
 * for every kind of run under a directory and writes <dir>/scheme-runs.html and
 * <dir>/relation-runs.html.
 */
function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

function args(name: string): string[] {
  return process.argv.flatMap((token, index) => (token === `--${name}` && process.argv[index + 1] ? [process.argv[index + 1]] : []));
}

async function main() {
  const runs = args('run');
  const parent = arg('all');
  const compare = arg('compare');
  const out = arg('out');
  if (runs.length === 0 && !parent && !compare) {
    console.error('Usage: npm run make-view -- --run <runDir> | --all <parentDir> | --run <runDir> --run <runDir> … --out <file> | --compare <parentDir>');
    process.exit(1);
  }
  if (compare) {
    for (const file of await writeComparePages(compare)) console.log(`wrote ${file}`);
    return;
  }
  if (runs.length > 1) {
    if (!out) {
      console.error('--out is required when more than one --run is given');
      process.exit(1);
    }
    console.log(`wrote ${await writeRunViews(runs, out)} — ${runs.length} runs, switchable in-page`);
    return;
  }
  const runDirs = runs.length === 1
    ? runs
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
