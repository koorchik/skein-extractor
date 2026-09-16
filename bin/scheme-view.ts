import { loadSchemeViewData, renderSchemeViewHtml } from '../src/SchemeView/schemeView';
import fs from 'fs/promises';
import path from 'path';

/**
 * Emerging-scheme viewer CLI (SKEIN-E spike):
 *
 *   npm run scheme-view -- --run runs/spike/<dir> [--out <file>]
 *
 * Reads the spike run's mentions.json, embeddings.json, schemes.json, events.jsonl, per-doc.json,
 * artifacts/ and run-card.json and writes ONE self-contained HTML file (default:
 * <runDir>/scheme-view.html). Open it in any browser — no server, no network.
 */
function arg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main() {
  const runDir = arg('run');
  if (!runDir) {
    console.error('Usage: npm run scheme-view -- --run <runDir> [--out <file>]');
    process.exit(1);
  }
  const out = arg('out') ?? path.join(runDir, 'scheme-view.html');
  const data = await loadSchemeViewData(runDir);
  await fs.writeFile(out, renderSchemeViewHtml(data));
  console.log(
    `${data.runId}: ${data.docs.length} documents, ${data.mentions.length} mentions, ` +
      `${data.schemes.length} schemes, ${data.events.length} events → ${out}`
  );
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
