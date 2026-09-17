import { loadRelationViewData, renderRelationViewHtml } from '../RelationView/relationView';
import { loadSchemeViewData, renderSchemeViewHtml } from '../SchemeView/schemeView';
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
 * A new kind of run adds a viewer module and one entry here.
 */
export type RunKind = 'scheme' | 'relation-layer';

export const VIEW_FILE: Record<RunKind, string> = {
  scheme: 'scheme-view.html',
  'relation-layer': 'relation-view.html',
};

export async function runKind(runDir: string): Promise<RunKind> {
  const card = JSON.parse(await fs.readFile(path.join(runDir, 'run-card.json'), 'utf8')) as { kind?: string };
  if (card.kind === undefined) return 'scheme';
  if (card.kind === 'relation-layer') return 'relation-layer';
  throw new Error(`${runDir}: no viewer for run kind "${card.kind}"; add one to src/RunViews/runViews.ts`);
}

/** Writes the viewer that fits the run and returns its path. */
export async function writeRunView(runDir: string): Promise<string> {
  const kind = await runKind(runDir);
  const out = path.join(runDir, VIEW_FILE[kind]);
  const html = kind === 'relation-layer' ? renderRelationViewHtml(await loadRelationViewData(runDir)) : renderSchemeViewHtml(await loadSchemeViewData(runDir));
  await fs.writeFile(out, html);
  return out;
}
