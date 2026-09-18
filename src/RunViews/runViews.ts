import { loadRelationViewRuns, renderRelationViewHtml } from '../RelationView/relationView';
import { loadSchemeViewRuns, renderSchemeViewHtml } from '../SchemeView/schemeView';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

/**
 * One entry point for the self-contained HTML viewers of a run directory. The viewer is chosen by
 * the kind of run recorded in run-card.json, so every driver can end with `writeRunView(outDir)`
 * and every run directory gets a file to open in a browser.
 *
 *   scheme run (bin/spike-schemes.ts)            → scheme-view.html   (src/SchemeView)
 *   relation-layer run (bin/spike-relations.ts)  → relation-view.html (src/RelationView)
 *
 * Several runs of one kind go into ONE page behind a run switcher (`writeRunViews`), so that runs
 * can be compared on the same document; `writeComparePages` does that for every kind of run found
 * under a directory.
 *
 * A new kind of run adds a viewer module and one entry here.
 */
export type RunKind = 'scheme' | 'relation-layer';

export const VIEW_FILE: Record<RunKind, string> = {
  scheme: 'scheme-view.html',
  'relation-layer': 'relation-view.html',
};

/** The page that holds every run of a kind under one parent directory. */
export const COMPARE_FILE: Record<RunKind, string> = {
  scheme: 'scheme-runs.html',
  'relation-layer': 'relation-runs.html',
};

export async function runKind(runDir: string): Promise<RunKind> {
  const card = JSON.parse(await fs.readFile(path.join(runDir, 'run-card.json'), 'utf8')) as { kind?: string };
  if (card.kind === undefined) return 'scheme';
  if (card.kind === 'relation-layer') return 'relation-layer';
  throw new Error(`${runDir}: no viewer for run kind "${card.kind}"; add one to src/RunViews/runViews.ts`);
}

async function renderRuns(kind: RunKind, runDirs: string[]): Promise<string> {
  return kind === 'relation-layer' ? renderRelationViewHtml(await loadRelationViewRuns(runDirs)) : renderSchemeViewHtml(await loadSchemeViewRuns(runDirs));
}

/** Writes the viewer that fits the run and returns its path. */
export async function writeRunView(runDir: string): Promise<string> {
  const kind = await runKind(runDir);
  const out = path.join(runDir, VIEW_FILE[kind]);
  await fs.writeFile(out, await renderRuns(kind, [runDir]));
  return out;
}

/** Writes ONE page with a run switcher for several runs of the same kind and returns its path. */
export async function writeRunViews(runDirs: string[], out: string): Promise<string> {
  const kinds = new Set<RunKind>();
  for (const runDir of runDirs) kinds.add(await runKind(runDir));
  if (kinds.size !== 1) throw new Error(`one kind of run per page, got: ${[...kinds].join(', ') || 'no runs'}`);
  await fs.writeFile(out, await renderRuns([...kinds][0], runDirs));
  return out;
}

/** One compare page per run kind with at least two runs among the subdirectories of `parentDir`. */
export async function writeComparePages(parentDir: string): Promise<string[]> {
  const byKind = new Map<RunKind, string[]>();
  for (const name of (await fs.readdir(parentDir)).sort()) {
    const runDir = path.join(parentDir, name);
    if (!existsSync(path.join(runDir, 'run-card.json'))) continue;
    const kind = await runKind(runDir);
    byKind.set(kind, [...(byKind.get(kind) ?? []), runDir]);
  }
  const written: string[] = [];
  for (const [kind, runDirs] of byKind) if (runDirs.length > 1) written.push(await writeRunViews(runDirs, path.join(parentDir, COMPARE_FILE[kind])));
  return written;
}
