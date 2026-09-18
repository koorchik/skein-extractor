import { Peer, matchAcrossRuns } from '../RunViews/crossRun';
import { SCHEME_HOW } from '../RunViews/howLabels';
import fs from 'fs/promises';
import path from 'path';

/**
 * Emerging-scheme viewer (SKEIN-E spike): ONE self-contained HTML file that replays, document by
 * document, how concept schemes emerged from a spike run (bin/spike-schemes.ts).
 *
 * Same doctrine as src/RunView/runView.ts: no dependencies, no network, light/dark, every string
 * escaped, data embedded as JSON, works from file://. Panels: document stepper with playback;
 * scheme cards (label, definition, alt labels, members with kind + gloss, birth, history); a 2-D
 * PCA map of every mention (computed here, in TypeScript) coloured by scheme, by the frozen hand
 * category or by the extractor's kind phrase; growth curves (|Σ_t|, pool, naming calls, relation
 * types); the current document's entities, relations and derived roles; and a final scheme ×
 * hand-category cross-tab. Hovering a point explains it in labelled parts (what the extractor
 * said, the route the mention took in this run, the hand reference, the other runs); a click pins
 * the explanation.
 *
 * Several runs go into ONE page behind a run switcher (as in skein-resolver's bin/view.ts). The
 * runs are laid out in one PCA so a mention keeps its place across runs, mentions are aligned
 * between runs by document and surface (src/RunViews/crossRun.ts), and the map marks what only
 * this run has and what only the compared run has. Nothing is merged: every run keeps its own
 * schemes, events and curves.
 */

interface Mention {
  id: string;
  doc: number;
  name: string;
  kind: string;
  gloss: string;
  scheme: string | null;
  assign: Array<{ doc: number; scheme: string | null; how: string; score?: number }>;
  category: string | null;
}
interface Scheme {
  id: string;
  prefLabel: string;
  definition: string;
  altLabels: string[];
  born: number;
  members: string[];
  history: Array<{ doc: number; op: string; detail: string }>;
}

export interface SchemeViewData {
  runId: string;
  /** What the run differs in, for the run switcher. */
  label: string;
  config: Record<string, unknown>;
  docs: Array<{ id: number; date: string; title: string }>;
  /** `peers`: the same mention in every run of the page (run order; null for the run itself and for no match). */
  mentions: Array<Mention & { x: number; y: number; peers: Array<Peer | null> }>;
  schemes: Scheme[];
  events: Array<Record<string, unknown>>;
  perDoc: Array<Record<string, unknown>>;
  artifacts: Array<Record<string, unknown>>;
  relationTypes: Array<Record<string, unknown>>;
  runCard: Record<string, unknown>;
}

/** Top-2 principal components by power iteration; enough for a map, no dependency needed. */
export function pca2(vectors: number[][]): Array<[number, number]> {
  const n = vectors.length;
  if (n === 0) return [];
  const d = vectors[0].length;
  const mean = new Array(d).fill(0);
  for (const v of vectors) for (let j = 0; j < d; j++) mean[j] += v[j] / n;
  const X = vectors.map((v) => v.map((x, j) => x - mean[j]));
  const matVec = (w: number[]) => {
    // X^T (X w)
    const xw = X.map((row) => row.reduce((s, x, j) => s + x * w[j], 0));
    const out = new Array(d).fill(0);
    for (let i = 0; i < n; i++) for (let j = 0; j < d; j++) out[j] += X[i][j] * xw[i];
    return out;
  };
  const normalize = (w: number[]) => {
    const len = Math.sqrt(w.reduce((s, x) => s + x * x, 0)) || 1;
    return w.map((x) => x / len);
  };
  const components: number[][] = [];
  for (let c = 0; c < 2; c++) {
    let w = normalize(Array.from({ length: d }, (_, j) => Math.sin(j * (c + 1) + 1)));
    for (let it = 0; it < 60; it++) {
      let next = matVec(w);
      for (const p of components) {
        const dotp = next.reduce((s, x, j) => s + x * p[j], 0);
        next = next.map((x, j) => x - dotp * p[j]);
      }
      w = normalize(next);
    }
    components.push(w);
  }
  return X.map((row) => [
    row.reduce((s, x, j) => s + x * components[0][j], 0),
    row.reduce((s, x, j) => s + x * components[1][j], 0),
  ]);
}

function runLabel(card: { config?: Record<string, unknown>; prompts?: Record<string, string> }): string {
  const c = card.config ?? {};
  const parts: string[] = [];
  if (c.docs !== undefined) parts.push(`docs ${Number(c.offset ?? 0) + 1}–${Number(c.offset ?? 0) + Number(c.docs)}`);
  const prompt = Object.keys(card.prompts ?? {}).find((id) => id.startsWith('extract'));
  if (prompt) parts.push(prompt);
  parts.push(c.kindFirst ? `kind-first ${c.kindFirst}` : 'kNN only', `τ ${c.tau}`, `pool-link ${c.poolLink}`);
  return parts.join(' · ');
}

/**
 * Loads runs for one page. The PCA is fitted on the mentions of all the runs together, so the map
 * has one pair of axes and a mention with the same kind and gloss sits at the same place in every
 * run.
 */
export async function loadSchemeViewRuns(runDirs: string[]): Promise<SchemeViewData[]> {
  const raws = [];
  for (const runDir of runDirs) {
    const read = async (file: string) => JSON.parse(await fs.readFile(path.join(runDir, file), 'utf8'));
    const mentions: Mention[] = await read('mentions.json');
    const embeddings: Array<{ id: string; v: number[] }> = await read('embeddings.json');
    const byId = new Map(embeddings.map((e) => [e.id, e.v]));
    const events = (await fs.readFile(path.join(runDir, 'events.jsonl'), 'utf8'))
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l));
    const artifactFiles = (await fs.readdir(path.join(runDir, 'artifacts'))).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    const artifacts = [];
    for (const f of artifactFiles) artifacts.push(await read(path.join('artifacts', f)));
    const schemesFile = await read('schemes.json');
    const runCard = await read('run-card.json');
    raws.push({
      mentions,
      vectors: mentions.map((m) => byId.get(m.id)!),
      rest: {
        runId: path.basename(runDir),
        label: runLabel(runCard),
        config: schemesFile.config,
        docs: await read('docs.json'),
        schemes: schemesFile.schemes,
        events,
        perDoc: await read('per-doc.json'),
        artifacts,
        relationTypes: await read('relations-inventory.json'),
        runCard,
      },
    });
  }
  const coords = pca2(raws.flatMap((raw) => raw.vectors));
  const peers = matchAcrossRuns(raws.map((raw) => raw.mentions.map((m) => ({ id: m.id, doc: m.doc, parts: [m.name] }))));
  let offset = 0;
  return raws.map((raw, r) => {
    const mentions = raw.mentions.map((m, i) => ({ ...m, x: coords[offset + i][0], y: coords[offset + i][1], peers: peers[r][m.id] }));
    offset += raw.mentions.length;
    return { ...raw.rest, mentions };
  });
}

export async function loadSchemeViewData(runDir: string): Promise<SchemeViewData> {
  return (await loadSchemeViewRuns([runDir]))[0];
}

function esc(s: unknown): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Renders the page for one run, or for several runs in ONE page with a run switcher. */
export function renderSchemeViewHtml(input: SchemeViewData | SchemeViewData[]): string {
  const runs = Array.isArray(input) ? input : [input];
  if (runs.length === 0) throw new Error('renderSchemeViewHtml needs at least one run');
  const payload = JSON.stringify({ runs, howLabels: SCHEME_HOW }).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:,">
<title>SKEIN-E emerging schemes — ${esc(runs.length === 1 ? runs[0].runId : `${runs.length} runs`)}</title>
<style>
  :root { --bg:#fff; --fg:#1f2328; --muted:#656d76; --line:#d0d7de; --panel:#f6f8fa; --hl:#fff3b8; --accent:#0969da; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0d1117; --fg:#e6edf3; --muted:#8d96a0; --line:#30363d; --panel:#161b22; --hl:#4d3800; --accent:#58a6ff; } }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:14px/1.45 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
  header { padding:10px 16px; border-bottom:1px solid var(--line); position:sticky; top:0; background:var(--bg); z-index:5; }
  header h1 { font-size:16px; margin:0 0 4px; }
  .sub { color:var(--muted); font-size:12px; }
  .controls { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:8px; }
  .controls input[type=range] { flex:1; min-width:200px; }
  button, select { background:var(--panel); color:var(--fg); border:1px solid var(--line); border-radius:6px; padding:3px 10px; cursor:pointer; font-size:13px; }
  select { max-width:100%; }
  #runswitch { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top:6px; font-size:12px; color:var(--muted); }
  #runswitch[hidden] { display:none; }
  .pos { font-variant-numeric:tabular-nums; color:var(--muted); font-size:12px; }
  main { display:grid; grid-template-columns:300px 1fr 360px; gap:0; }
  @media (max-width:1100px) { main { grid-template-columns:1fr; } }
  nav, aside { padding:10px 12px; font-size:13px; min-width:0; }
  nav { border-right:1px solid var(--line); }
  aside { border-left:1px solid var(--line); }
  section.middle { padding:10px 14px; min-width:0; }
  h2 { font-size:12px; text-transform:uppercase; letter-spacing:.04em; color:var(--muted); margin:12px 0 6px; }
  .card { border:1px solid var(--line); border-radius:8px; padding:6px 8px; margin:6px 0; background:var(--panel); }
  .card.new { box-shadow:0 0 0 2px var(--hl) inset; }
  .card .lbl { font-weight:600; display:flex; align-items:center; gap:6px; }
  .card .def { color:var(--muted); font-size:12px; margin:2px 0 4px; }
  .card .alt { font-size:11px; color:var(--muted); }
  .sw { display:inline-block; width:10px; height:10px; border-radius:50%; border:1px solid rgba(0,0,0,.25); flex:none; }
  details summary { cursor:pointer; font-size:12px; color:var(--accent); }
  ul.members { list-style:none; padding-left:0; margin:4px 0 0; font-size:12px; max-height:220px; overflow:auto; }
  ul.members li { padding:1px 0; border-top:1px dashed var(--line); }
  ul.members .k { color:var(--muted); }
  svg { width:100%; height:auto; background:var(--panel); border:1px solid var(--line); border-radius:8px; }
  #map [data-id] { cursor:pointer; }
  .legend { font-size:12px; margin:6px 0; }
  .legend .row { display:flex; flex-wrap:wrap; gap:3px 12px; align-items:center; padding:3px 0; border-top:1px dashed var(--line); }
  .legend .row:first-child { border-top:0; }
  .legend .row > b { font-weight:600; color:var(--muted); min-width:64px; }
  .legend .row span { display:inline-flex; align-items:center; gap:4px; }
  .legend svg { width:14px; height:14px; background:none; border:0; flex:none; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; margin:6px 0; }
  .chips[hidden] { display:none; }
  .chips button.on { border-color:var(--accent); color:var(--accent); font-weight:600; }
  .ev { border-top:1px solid var(--line); padding:3px 0; font-size:12px; overflow-wrap:anywhere; }
  .ev b.mint { color:#1a7f37; } .ev b.alias { color:#8250df; } .ev b.pool { color:#9a6700; } .ev b.assign { color:var(--accent); } .ev b.relation-type-new { color:#bf3989; }
  table { border-collapse:collapse; font-size:12px; margin-top:6px; }
  th, td { border:1px solid var(--line); padding:2px 6px; text-align:right; }
  th:first-child, td:first-child { text-align:left; }
  .role { font-size:11px; border-radius:8px; padding:0 6px; background:var(--hl); margin-left:4px; }
  .rel { font-size:12px; padding:1px 0; }
  .rel .t { color:var(--accent); }
  .muted { color:var(--muted); }
  .tip { position:fixed; pointer-events:none; background:var(--bg); border:1px solid var(--line); border-radius:6px; padding:8px 10px; font-size:12px; width:400px; max-width:90vw; box-shadow:0 4px 14px rgba(0,0,0,.15); display:none; z-index:9; overflow-wrap:anywhere; }
  .mention .sec { font-size:10.5px; text-transform:uppercase; letter-spacing:.04em; color:var(--muted); margin:7px 0 1px; padding-top:5px; border-top:1px solid var(--line); }
  .mention .sec span { text-transform:none; letter-spacing:0; }
  .mention ol.trail { margin:2px 0 0; padding-left:18px; }
  .mention ol.trail li.later { color:var(--muted); }
  .mention .absent { background:var(--hl); border-radius:4px; padding:2px 6px; margin-bottom:4px; }
  .mention .diff { background:var(--hl); border-radius:3px; padding:0 3px; }
  #pinned { font-size:12px; overflow-wrap:anywhere; }
</style>
</head>
<body>
<header>
  <h1>SKEIN-E emerging schemes — <code id="runid"></code></h1>
  <div class="sub" id="meta"></div>
  <div id="runswitch" hidden>
    <label>run <select id="run"></select></label>
    <label>compare with <select id="cmp"></select></label>
    <span id="cmpline"></span>
  </div>
  <div class="controls">
    <button id="back" title="one document back">⏮</button>
    <button id="play">▶</button>
    <button id="fwd" title="one document forward">⏭</button>
    <input type="range" id="scrub" min="0" value="0">
    <span class="pos" id="pos"></span>
    <label class="pos">colour: <select id="colour"><option value="scheme">emergent scheme (this run's result)</option><option value="category">frozen hand category (reference)</option><option value="kind">extractor kind phrase (input)</option></select></label>
  </div>
  <div class="sub" id="docline"></div>
</header>
<main>
  <nav>
    <h2>Schemes after this document (<span id="nschemes"></span>) · pool <span id="npool"></span></h2>
    <div id="schemes"></div>
  </nav>
  <section class="middle">
    <h2>Mention map: one point per extracted mention (PCA of the kind+gloss embedding, one projection for every run of the page). Hover explains a point, click pins it.</h2>
    <div class="chips" id="filters" hidden></div>
    <svg id="map" viewBox="0 0 800 520"></svg>
    <div class="legend" id="legend"></div>
    <h2>Growth along the stream</h2>
    <svg id="curves" viewBox="0 0 800 220"></svg>
    <h2>Final cross-tab: emergent scheme × frozen hand category (aligned mentions only)</h2>
    <div id="crosstab"></div>
  </section>
  <aside>
    <h2>Selected mention</h2>
    <div id="pinned" class="mention"></div>
    <h2>This document</h2>
    <div id="doc"></div>
    <h2>Events in this document</h2>
    <div id="events"></div>
    <h2>Relation inventory (<span id="nrel"></span>)</h2>
    <div id="rels" class="muted" style="font-size:12px"></div>
  </aside>
</main>
<div class="tip mention" id="tip"></div>
<script id="data" type="application/json">${payload}</script>
<script>
(function(){
  const P = JSON.parse(document.getElementById('data').textContent);
  const RUNS = P.runs; const HOW = P.howLabels;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const PALETTE = ['#0969da','#cf222e','#1a7f37','#8250df','#bf8700','#0598bc','#e16f24','#a475f9','#3fb950','#d4a72c','#f778ba','#0550ae','#a40e26','#116329','#953800','#6639ba','#7d4e00','#1b7c83','#b35900','#5e4db2'];
  const NEUTRAL = '#8c959f';
  const uniq = (list) => [...new Set(list)];

  // One colour list for the whole page: a scheme label, a hand category or a kind phrase keeps its colour in every run.
  const schemeLabels = uniq(RUNS.flatMap(r => r.schemes.map(s => s.prefLabel))).sort();
  const catList = uniq(RUNS.flatMap(r => r.mentions.map(m => m.category).filter(Boolean))).sort();
  const kindTotals = new Map(); RUNS.forEach(r => r.mentions.forEach(m => kindTotals.set(m.kind, (kindTotals.get(m.kind)||0)+1)));
  const kindTop = [...kindTotals.entries()].sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0])).slice(0, 14).map(e => e[0]);
  const colourFor = (key, list) => { const i = key == null ? -1 : list.indexOf(key); return i === -1 ? NEUTRAL : PALETTE[i % PALETTE.length]; };

  const IDX = RUNS.map(r => ({
    docIndex: new Map(r.docs.map((d,i) => [d.id,i])),
    schemeById: new Map(r.schemes.map(s => [s.id,s])),
    mentionById: new Map(r.mentions.map(m => [m.id,m])),
  }));

  // map bounds over every run, so a point does not move when the run changes
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  RUNS.forEach(r => r.mentions.forEach(m => { minX = Math.min(minX, m.x); maxX = Math.max(maxX, m.x); minY = Math.min(minY, m.y); maxY = Math.max(maxY, m.y); }));
  const sx = (x) => 20 + (x - minX) / ((maxX - minX) || 1) * 760;
  const sy = (y) => 20 + (y - minY) / ((maxY - minY) || 1) * 480;

  // R = the run on screen, C = the run it is compared with (-1 on a one-run page)
  let R = 0, C = RUNS.length > 1 ? 1 : -1, t = 0, timer = null, mode = 'scheme', filter = 'all', pinned = null;
  const scrub = $('scrub');

  // state of a mention of run q after stream position pos: undefined = not seen yet, null = pool
  function schemeAt(q, m, pos) {
    const di = IDX[q].docIndex;
    if (di.get(m.doc) > pos) return undefined;
    let s = null;
    for (const a of m.assign) if (di.get(a.doc) <= pos) s = a.scheme;
    return s;
  }
  // stream position of the current document in run q; a run without the document is read at its end
  function posIn(q) {
    if (q === R) return t;
    const i = IDX[q].docIndex.get(RUNS[R].docs[t].id);
    return i === undefined ? RUNS[q].docs.length - 1 : i;
  }
  const labelOf = (q, s) => s ? IDX[q].schemeById.get(s).prefLabel : null;
  const keyOf = (q, m, pos) => mode === 'scheme' ? labelOf(q, schemeAt(q, m, pos)) : mode === 'category' ? m.category : (kindTop.indexOf(m.kind) === -1 ? null : m.kind);
  const listOf = () => mode === 'scheme' ? schemeLabels : mode === 'category' ? catList : kindTop;
  const peerOf = (m, p) => m.peers[p] ? IDX[p].mentionById.get(m.peers[p].id) : null;
  const sameKind = (a, b) => a.kind.trim().toLowerCase() === b.kind.trim().toLowerCase();
  // a mention of the run on screen against the compared run: na (not comparable), only, kind, same
  function versus(m) {
    if (C < 0 || !IDX[C].docIndex.has(m.doc)) return 'na';
    const p = peerOf(m, C);
    return !p ? 'only' : sameKind(p, m) ? 'same' : 'kind';
  }
  // mentions of the compared run that this run does not have, for the documents seen so far
  function ghosts() {
    if (C < 0) return [];
    const di = IDX[R].docIndex;
    return RUNS[C].mentions.filter(g => !g.peers[R] && di.has(g.doc) && di.get(g.doc) <= t);
  }

  function schemesAt(pos) {
    const D = RUNS[R];
    const born = D.schemes.filter(s => IDX[R].docIndex.get(s.born) <= pos);
    const counts = new Map(born.map(s=>[s.id,0]));
    for (const m of D.mentions) { const s = schemeAt(R, m, pos); if (s && counts.has(s)) counts.set(s, counts.get(s)+1); }
    return born.map(s => ({...s, count: counts.get(s.id)}));
  }

  const stateHtml = (q, s) => s === undefined ? '<span class="muted">not seen yet</span>' : s === null ? '<b>in the pool</b> <span class="muted">(no scheme)</span>' : 'in scheme <b style="color:' + colourFor(labelOf(q, s), schemeLabels) + '">' + esc(labelOf(q, s)) + '</b>';

  // the explanation of one mention of run q, in labelled parts; used by the hover and by the pinned panel
  function describe(q, m) {
    const run = RUNS[q], di = IDX[q].docIndex, pos = posIn(q);
    let h = '';
    if (q !== R) h += '<div class="absent">' + (IDX[R].docIndex.has(m.doc) ? 'Absent from ' + esc(RUNS[R].runId) + ': only ' + esc(run.runId) + ' extracted it from this document.' : 'A mention of ' + esc(run.runId) + '; the document is not part of ' + esc(RUNS[R].runId) + '.') + '</div>';
    h += '<div><b>' + esc(m.name) + '</b></div><div class="muted">document ' + (di.get(m.doc)+1) + ' of ' + run.docs.length + ' (' + m.doc + ') · ' + esc(run.docs[di.get(m.doc)].date) + '</div>';
    h += '<div class="sec">Extractor said <span>(its own words: a kind phrase is not a scheme, every mention has one)</span></div>' +
      '<div>kind phrase: <b>' + esc(m.kind) + '</b></div><div class="muted">' + esc(m.gloss) + '</div>';
    h += '<div class="sec">Route in run <span>' + esc(run.runId) + '</span></div><div>state after document ' + (pos+1) + ': ' + stateHtml(q, schemeAt(q, m, pos)) + '</div>' +
      '<ol class="trail">' + m.assign.map(a => {
        const later = di.get(a.doc) > pos;
        return '<li class="' + (later ? 'later' : '') + '">document ' + (di.get(a.doc)+1) + ': ' + esc(HOW[a.how] || a.how) + (a.score ? ' (cosine ' + Number(a.score).toFixed(2) + ')' : '') +
          (a.scheme ? ' → <b>' + esc(labelOf(q, a.scheme)) + '</b>' : '') + (later ? ' (after the current document)' : '') + '</li>';
      }).join('') + '</ol>';
    h += '<div class="sec">Hand reference <span>(frozen gpt-5 stream)</span></div>' + (m.category ? '<div>' + esc(m.category) + '</div>' : '<div class="muted">not aligned: no mention with this surface in the frozen extraction of the document</div>');
    if (RUNS.length > 1) {
      h += '<div class="sec">In the other runs <span>(same document, same or containing name)</span></div>' + RUNS.map((other, p) => {
        if (p === q) return '';
        let line;
        if (!IDX[p].docIndex.has(m.doc)) line = '<span class="muted">the document is not part of this run</span>';
        else {
          const x = peerOf(m, p);
          if (!x) line = '<b>absent</b>: no mention with this name in the document';
          else line = 'kind phrase ' + (sameKind(x, m) ? esc(x.kind) : '<span class="diff">' + esc(x.kind) + '</span>') + ' · final state: ' + stateHtml(p, x.scheme) + (m.peers[p].how === 'contains' ? ' · matched as “' + esc(x.name) + '”' : '');
        }
        return '<div>' + esc(other.runId) + (p === C && q === R ? ' <span class="muted">(compared)</span>' : '') + ': ' + line + '</div>';
      }).join('');
    }
    return h;
  }

  function mark(q, m, colour, filled, o) {
    const x = sx(m.x), y = sy(m.y), r = o.cur ? 6 : 4;
    const attrs = ' data-id="' + esc(m.id) + '" data-run="' + q + '"' + (o.ghost ? ' data-ghost="1"' : '') + ' opacity="' + (o.dim ? 0.08 : o.ghost ? 0.75 : 0.85) + '"';
    const pin = o.pinned ? '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r+6) + '" fill="none" stroke="var(--accent)" stroke-width="2"></circle>' : '';
    if (o.ghost) {
      const d = 'M' + (x-r).toFixed(1) + ' ' + (y-r).toFixed(1) + 'L' + (x+r).toFixed(1) + ' ' + (y+r).toFixed(1) + 'M' + (x-r).toFixed(1) + ' ' + (y+r).toFixed(1) + 'L' + (x+r).toFixed(1) + ' ' + (y-r).toFixed(1);
      return pin + '<g' + attrs + '><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r+2) + '" fill="transparent"></circle><path d="' + d + '" stroke="' + colour + '" stroke-width="2" fill="none"></path></g>';
    }
    const paint = ' fill="' + (filled ? colour : 'var(--panel)') + '" stroke="' + colour + '" stroke-width="' + (o.cur ? 2.5 : 1.4) + '"';
    if (o.only) {
      const k = r * 1.45;
      return pin + '<path' + attrs + paint + ' d="M' + x.toFixed(1) + ' ' + (y-k).toFixed(1) + 'L' + (x+k).toFixed(1) + ' ' + y.toFixed(1) + 'L' + x.toFixed(1) + ' ' + (y+k).toFixed(1) + 'L' + (x-k).toFixed(1) + ' ' + y.toFixed(1) + 'Z"></path>';
    }
    return pin + '<circle' + attrs + paint + ' cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '"></circle>';
  }
  const glyph = (shape, colour, filled) => '<svg viewBox="0 0 14 14">' + (shape === 'x' ? '<path d="M3 3L11 11M3 11L11 3" stroke="' + colour + '" stroke-width="2"/>' : shape === 'diamond' ? '<path d="M7 1L13 7L7 13L1 7Z" fill="' + (filled ? colour : 'none') + '" stroke="' + colour + '" stroke-width="1.5"/>' : '<circle cx="7" cy="7" r="' + (shape === 'big' ? 5.5 : 4.5) + '" fill="' + (filled ? colour : 'none') + '" stroke="' + colour + '" stroke-width="' + (shape === 'big' ? 2.5 : 1.5) + '"/>') + '</svg>';

  function render() {
    const D = RUNS[R], docs = D.docs, doc = docs[t], di = IDX[R].docIndex;
    $('pos').textContent = (t+1) + ' / ' + docs.length;
    $('docline').textContent = 'Document ' + doc.id + ' · ' + doc.date + ' · ' + doc.title;
    const current = schemesAt(t);
    const seen = D.mentions.filter(m => schemeAt(R, m, t) !== undefined);
    const pool = seen.filter(m => schemeAt(R, m, t) === null).length;
    $('nschemes').textContent = current.length; $('npool').textContent = pool;

    // scheme cards
    $('schemes').innerHTML = current.map((s) => {
      const members = D.mentions.filter(m => schemeAt(R, m, t) === s.id);
      const kinds = new Map(); for (const m of members) kinds.set(m.kind, (kinds.get(m.kind)||0)+1);
      const kindStr = [...kinds.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([k,n])=>k+'×'+n).join(', ');
      const isNew = s.born === doc.id;
      return '<div class="card' + (isNew?' new':'') + '"><div class="lbl"><span class="sw" style="background:' + colourFor(s.prefLabel, schemeLabels) + '"></span>' + esc(s.prefLabel) + ' <span class="muted">(' + members.length + ')</span></div>' +
        '<div class="def">' + esc(s.definition) + '</div>' +
        (s.altLabels.length ? '<div class="alt">alt: ' + esc(s.altLabels.join(' · ')) + '</div>' : '') +
        '<div class="alt">born doc ' + s.born + ' · kinds: ' + esc(kindStr) + '</div>' +
        '<details><summary>members</summary><ul class="members">' + members.map(m => '<li><b>' + esc(m.name) + '</b> <span class="k">[' + esc(m.kind) + ']</span> — ' + esc(m.gloss) + (m.category ? ' <span class="k">· frozen: ' + esc(m.category) + '</span>' : '') + '</li>').join('') + '</ul></details></div>';
    }).join('') || '<div class="muted">no schemes yet — everything is in the pool</div>';

    // map: colour = the chosen colouring, fill = state in this run, shape = against the compared run
    const gone = ghosts();
    const tally = { only: 0, kind: 0, same: 0, na: 0, exact: 0, contains: 0 };
    const keyCounts = new Map(); let noKey = 0;
    let svg = '';
    for (const m of seen) {
      const v = versus(m); tally[v] += 1;
      if (C >= 0 && m.peers[C]) tally[m.peers[C].how] += 1;
      const key = keyOf(R, m, t);
      if (key == null) noKey += 1; else keyCounts.set(key, (keyCounts.get(key)||0)+1);
      const dim = filter !== 'all' && filter !== v;
      svg += mark(R, m, colourFor(key, listOf()), schemeAt(R, m, t) !== null, { cur: m.doc === doc.id, only: v === 'only', dim, pinned: pinned && pinned.q === R && pinned.id === m.id });
    }
    for (const g of gone) {
      const gp = posIn(C);
      svg += mark(C, g, colourFor(keyOf(C, g, gp), listOf()), false, { ghost: true, cur: g.doc === doc.id, dim: filter !== 'all' && filter !== 'absent', pinned: pinned && pinned.q === C && pinned.id === g.id });
    }
    $('map').innerHTML = svg;

    const noKeyLabel = mode === 'scheme' ? 'pool: no scheme yet' : mode === 'category' ? 'not aligned to the hand reference' : 'a rarer kind phrase (' + (kindTotals.size - kindTop.length) + ' more; hover for the phrase)';
    const colourRow = listOf().filter(k => keyCounts.has(k)).map(k => '<span><span class="sw" style="background:' + colourFor(k, listOf()) + '"></span>' + esc(k) + ' ' + keyCounts.get(k) + '</span>').join('') +
      (noKey ? '<span><span class="sw" style="background:' + NEUTRAL + '"></span>' + noKeyLabel + ' ' + noKey + '</span>' : '');
    let legend = '<div class="row"><b>colour</b>' + colourRow + '</div>' +
      '<div class="row"><b>fill</b><span>' + glyph('dot', NEUTRAL, true) + 'in a scheme of this run ' + (seen.length - pool) + '</span><span>' + glyph('dot', NEUTRAL, false) + 'in the pool: extracted, no scheme yet ' + pool + '</span><span>' + glyph('big', NEUTRAL, false) + 'mention of the current document</span></div>';
    if (C >= 0) legend += '<div class="row"><b>shape</b><span>' + glyph('dot', NEUTRAL, true) + 'also in ' + esc(RUNS[C].runId) + ' ' + (tally.same + tally.kind) + ' (same name ' + tally.exact + ', containing name ' + tally.contains + ')</span><span>' + glyph('diamond', NEUTRAL, true) + 'only in this run ' + tally.only + '</span><span>' + glyph('x', NEUTRAL, false) + 'absent here, extracted by ' + esc(RUNS[C].runId) + ' ' + gone.length + '</span>' + (tally.na ? '<span class="muted">' + tally.na + ' from documents outside the compared run</span>' : '') + '</div>';
    $('legend').innerHTML = legend;
    if (C >= 0) {
      $('filters').innerHTML = [['all', 'all mentions'], ['only', 'only in this run · ' + tally.only], ['absent', 'absent here · ' + gone.length], ['kind', 'kind phrase differs · ' + tally.kind], ['same', 'same kind phrase · ' + tally.same]]
        .map(([k, label]) => '<button data-filter="' + k + '" class="' + (filter === k ? 'on' : '') + '">' + esc(label) + '</button>').join('');
      $('cmpline').textContent = 'after this document: ' + (tally.same + tally.kind) + ' shared, ' + tally.only + ' only here, ' + gone.length + ' only there, ' + tally.kind + ' with another kind phrase';
    }

    // curves
    const pd = D.perDoc.slice(0, t+1);
    const series = [['schemes','#0969da'],['pool','#9a6700'],['namingCalls','#8250df'],['relationTypes','#bf3989']];
    const maxV = Math.max(1, ...D.perDoc.map(r => Math.max(...series.map(([k]) => r[k]||0))));
    const cx = (i) => 40 + i / Math.max(1, docs.length-1) * 740;
    const cy = (v) => 200 - v / maxV * 180;
    let cs = '<line x1="40" y1="200" x2="780" y2="200" stroke="var(--line)"/><text x="4" y="24" font-size="11" fill="var(--muted)">' + maxV + '</text><text x="4" y="204" font-size="11" fill="var(--muted)">0</text>';
    series.forEach(([k,col], si) => {
      const pts = pd.map((r,i) => cx(i).toFixed(1) + ',' + cy(r[k]||0).toFixed(1)).join(' ');
      cs += '<polyline points="' + pts + '" fill="none" stroke="' + col + '" stroke-width="2"/>';
      cs += '<text x="' + (60 + si*170) + '" y="216" font-size="11" fill="' + col + '">' + k + (pd.length ? ' = ' + (pd[pd.length-1][k]||0) : '') + '</text>';
    });
    $('curves').innerHTML = cs;

    // current document
    const art = D.artifacts.find(a => a.docId === doc.id);
    if (art) {
      const rolesHtml = (r) => r ? '<span class="role">' + esc(r) + '</span>' : '';
      $('doc').innerHTML = '<div style="font-size:12px">' + art.entities.map(e => {
        const s = schemeAt(R, IDX[R].mentionById.get(e.id), t);
        return '<div><b>' + esc(e.name) + '</b> <span class="muted">[' + esc(e.kind) + ']</span> → ' + (s ? '<span style="color:' + colourFor(labelOf(R, s), schemeLabels) + '">' + esc(labelOf(R, s)) + '</span>' : '<span class="muted">pool</span>') + rolesHtml(e.role) + (e.category ? ' <span class="muted">· frozen: ' + esc(e.category) + '</span>' : '') + '<div class="muted">' + esc(e.gloss) + '</div></div>';
      }).join('') + '</div><h2>Relations (' + art.relations.length + ')</h2>' + (art.relations.map(r => '<div class="rel">' + esc(r.head) + ' <span class="t">' + esc(r.type) + '</span> ' + esc(r.tail) + '</div>').join('') || '<div class="muted">none</div>');
    } else $('doc').innerHTML = '<div class="muted">extraction failed for this document</div>';

    // events of this doc
    const evs = D.events.filter(e => e.doc === doc.id && e.op !== 'assign' && e.op !== 'pool');
    const assigns = D.events.filter(e => e.doc === doc.id && (e.op === 'assign' || e.op === 'pool'));
    $('events').innerHTML = evs.map(e => '<div class="ev"><b class="' + esc(e.op) + '">' + esc(e.op) + '</b> ' + esc(e.label || e.type || '') + (e.definition ? ' — <span class="muted">' + esc(e.definition) + '</span>' : '') + (e.size ? ' <span class="muted">(' + e.size + ' mentions)</span>' : '') + (e.of ? ' <span class="muted">→ ' + esc(e.of) + '</span>' : '') + '</div>').join('') +
      '<div class="ev muted">' + assigns.filter(e=>e.op==='assign').length + ' assigned, ' + assigns.filter(e=>e.op==='pool').length + ' pooled (' + assigns.filter(e=>e.op==='pool' && e.why==='below-tau').length + ' below τ, ' + assigns.filter(e=>e.op==='pool' && e.why==='ambiguous').length + ' ambiguous)</div>';

    // relation inventory as of now
    const rt = D.relationTypes.filter(r => di.get(r.born) <= t);
    $('nrel').textContent = rt.length;
    $('rels').innerHTML = rt.map(r => '<div><b>' + esc(r.name) + '</b> ×' + r.count + (r.aliases.length ? ' <span class="muted">(aliases: ' + esc(r.aliases.join(', ')) + ')</span>' : '') + '<div>' + esc(r.definition) + '</div></div>').join('');

    renderPinned();
  }

  function renderPinned() {
    const m = pinned && IDX[pinned.q].mentionById.get(pinned.id);
    $('pinned').innerHTML = m ? describe(pinned.q, m) + '<div style="margin-top:6px"><button data-unpin="1">clear</button></div>' : '<div class="muted">Click a point of the map to keep its explanation here.</div>';
  }

  const remember = () => { if (C >= 0) history.replaceState(null, '', '#run=' + encodeURIComponent(RUNS[R].runId) + '&cmp=' + encodeURIComponent(RUNS[C].runId)); };

  // everything that depends on the run on screen but not on the stream position
  function bind(index, keepDocId) {
    if (index === C) C = R;
    R = index;
    const D = RUNS[R], cfg = D.config;
    const kept = keepDocId == null ? undefined : IDX[R].docIndex.get(keepDocId);
    t = kept === undefined ? D.docs.length - 1 : kept;
    scrub.max = String(D.docs.length - 1); scrub.value = String(t);
    $('runid').textContent = D.runId;
    $('meta').textContent = 'LLM ' + cfg.llmModel + ' · embeddings ' + cfg.embedModel + ' (' + (cfg.embedTaskType||'') + ', ' + cfg.embedDims + ' dims, repr ' + cfg.repr + (cfg.repr==='combo' ? ' α=' + cfg.alpha : '') + ') · τ=' + cfg.tau + ' δ=' + cfg.delta + ' pool-link=' + cfg.poolLink + ' mass=' + cfg.mass + ' docs · ' + D.mentions.length + ' mentions · ' + D.schemes.length + ' schemes final';
    if (RUNS.length > 1) {
      const option = (r, i, chosen) => '<option value="' + i + '"' + (i === chosen ? ' selected' : '') + '>' + esc(r.runId) + ' — ' + esc(r.label) + '</option>';
      $('runswitch').hidden = false; $('filters').hidden = false;
      $('run').innerHTML = RUNS.map((r, i) => option(r, i, R)).join(''); $('run').value = String(R);
      $('cmp').innerHTML = RUNS.map((r, i) => i === R ? '' : option(r, i, C)).join(''); $('cmp').value = String(C);
    }
    if (pinned && pinned.q !== R) { const m = IDX[pinned.q].mentionById.get(pinned.id); if (m && m.peers[R]) pinned = { q: R, id: m.peers[R].id }; }

    const overlay = D.runCard.overlay; const cats = catList.concat(['(unaligned)']);
    let h = '<table><tr><th>scheme</th>' + cats.map(c=>'<th>'+esc(c)+'</th>').join('') + '<th>total</th></tr>';
    for (const [s,row] of Object.entries(overlay.crossTab)) { const tot = Object.values(row).reduce((a,b)=>a+b,0); h += '<tr><td>' + esc(s) + '</td>' + cats.map(c=>'<td>'+(row[c]||'')+'</td>').join('') + '<td>' + tot + '</td></tr>'; }
    $('crosstab').innerHTML = h + '</table><div class="muted" style="font-size:12px">overlay coverage ' + (overlay.coverage*100).toFixed(0) + '% of mentions aligned by surface to the frozen gpt-5 extraction</div>';
    remember(); render();
  }

  // hover explains, click pins
  const tip = $('tip');
  const pointed = (ev) => { const el = ev.target.closest('[data-id]'); if (!el) return null; const q = Number(el.dataset.run); const m = IDX[q].mentionById.get(el.dataset.id); return m ? { q, m } : null; };
  $('map').addEventListener('mousemove', (ev) => {
    const hit = pointed(ev); if (!hit) { tip.style.display = 'none'; return; }
    tip.innerHTML = describe(hit.q, hit.m);
    tip.style.display = 'block';
    const right = ev.clientX > window.innerWidth / 2, low = ev.clientY > window.innerHeight / 2;
    tip.style.left = right ? '' : (ev.clientX + 14) + 'px'; tip.style.right = right ? (window.innerWidth - ev.clientX + 14) + 'px' : '';
    tip.style.top = low ? '' : (ev.clientY + 14) + 'px'; tip.style.bottom = low ? (window.innerHeight - ev.clientY + 14) + 'px' : '';
  });
  $('map').addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  $('map').addEventListener('click', (ev) => { const hit = pointed(ev); pinned = hit ? { q: hit.q, id: hit.m.id } : null; render(); });
  $('pinned').addEventListener('click', (ev) => { if (ev.target.closest('[data-unpin]')) { pinned = null; render(); } });
  $('filters').addEventListener('click', (ev) => { const b = ev.target.closest('[data-filter]'); if (!b) return; filter = b.dataset.filter; render(); });

  $('run').addEventListener('change', (ev) => bind(Number(ev.target.value), RUNS[R].docs[t].id));
  $('cmp').addEventListener('change', (ev) => { C = Number(ev.target.value); remember(); filter = 'all'; render(); });
  $('colour').addEventListener('change', (ev) => { mode = ev.target.value; render(); });
  scrub.addEventListener('input', (ev) => { t = Number(ev.target.value); render(); });
  const last = () => RUNS[R].docs.length - 1;
  $('back').onclick = () => { t = Math.max(0, t-1); scrub.value = String(t); render(); };
  $('fwd').onclick = () => { t = Math.min(last(), t+1); scrub.value = String(t); render(); };
  $('play').onclick = () => {
    if (timer) { clearInterval(timer); timer = null; $('play').textContent = '▶'; return; }
    if (t >= last()) t = -1;
    $('play').textContent = '⏸';
    timer = setInterval(() => { if (t >= last()) { clearInterval(timer); timer=null; $('play').textContent='▶'; return; } t += 1; scrub.value = String(t); render(); }, 900);
  };
  // '#run=<runId>&cmp=<runId>' opens the page on a comparison and follows the switcher, so a link can point at one
  const asked = new Map(location.hash.replace(/^#/, '').split('&').map(part => part.split('=').map(decodeURIComponent)));
  const indexOfRun = (id) => RUNS.findIndex(r => r.runId === id);
  const first = Math.max(0, indexOfRun(asked.get('run')));
  if (indexOfRun(asked.get('cmp')) >= 0 && indexOfRun(asked.get('cmp')) !== first) C = indexOfRun(asked.get('cmp'));
  else if (first === C) C = 0;
  R = first;
  bind(first, null);
})();
</script>
</body>
</html>`;
}
