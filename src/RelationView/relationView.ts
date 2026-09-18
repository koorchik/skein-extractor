import { Peer, matchAcrossRuns } from '../RunViews/crossRun';
import { RELATION_HOW } from '../RunViews/howLabels';
import fs from 'fs/promises';
import path from 'path';

/**
 * Relation-layer viewer (SKEIN-E spike): ONE self-contained HTML file that replays, document by
 * document, how relation types emerged in a relation-layer run (bin/spike-relations.ts).
 *
 * Same doctrine as src/SchemeView/schemeView.ts: no dependencies, no network, light/dark, every
 * string escaped, data embedded as JSON, works from file://. Panels: document stepper with
 * playback; relation-type cards grouped by cell (label, definition, broader, alt labels, phrases,
 * member statements); the argument-type matrix (head scheme × tail scheme, by the FINAL schemes of
 * the arguments so that every arm is laid out the same way) with typed / pool / pending counts and
 * click-to-filter; growth curves; the statement table; the current document's statements and
 * events. A click on a statement explains it in labelled parts (what the extractor said, the route
 * in this run, the other runs).
 *
 * Several runs go into ONE page behind a run switcher. Statements are aligned between runs by
 * document, head and tail (src/RunViews/crossRun.ts); the statement table puts the compared run
 * next to every statement and lists what only the compared run extracted. Nothing is merged.
 */

interface TripleRow {
  id: string;
  doc: number;
  headName: string;
  tailName: string;
  phrase: string;
  definition: string;
  evidence: string;
  cell: string | null;
  type: string | null;
  assign: Array<{ doc: number; cell: string | null; type: string | null; how: string; score?: number }>;
  fit?: string;
  cellLabel: string | null;
  finalCellLabel: string;
  /** The same statement in every run of the page (run order; null for the run itself and for no match). */
  peers: Array<Peer | null>;
}
interface TypeRow {
  id: string;
  cell: string;
  cellLabel: string;
  prefLabel: string;
  definition: string;
  altLabels: string[];
  broader: string | null;
  born: number;
  members: string[];
  history: Array<{ doc: number; op: string; detail: string }>;
}

export interface RelationViewData {
  runId: string;
  /** What the run differs in, for the run switcher. */
  label: string;
  docs: Array<{ id: number; date: string; title: string }>;
  triples: TripleRow[];
  types: TypeRow[];
  events: Array<Record<string, unknown>>;
  perDoc: Array<Record<string, number>>;
  runCard: Record<string, unknown>;
}

function runLabel(card: { config?: Record<string, unknown> }): string {
  const c = card.config ?? {};
  const typed = c.arm === 'typed-icl';
  return [String(c.arm), `${c.schemes} schemes`, ...(typed ? [`name merge ≥ ${c.merge}`] : [`τ ${c.tau}`, `mass ${c.mass}`])].join(' · ');
}

export async function loadRelationViewRuns(runDirs: string[]): Promise<RelationViewData[]> {
  const runs: RelationViewData[] = [];
  for (const runDir of runDirs) {
    const read = async (file: string) => JSON.parse(await fs.readFile(path.join(runDir, file), 'utf8'));
    const events = (await fs.readFile(path.join(runDir, 'events.jsonl'), 'utf8'))
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => JSON.parse(l));
    const runCard = await read('run-card.json');
    runs.push({
      runId: path.basename(runDir),
      label: runLabel(runCard),
      docs: await read('docs.json'),
      triples: await read('triples.json'),
      types: await read('relation-types.json'),
      events,
      perDoc: await read('per-doc.json'),
      runCard,
    });
  }
  const peers = matchAcrossRuns(runs.map((run) => run.triples.map((x) => ({ id: x.id, doc: x.doc, parts: [x.headName, x.tailName] }))));
  runs.forEach((run, r) => run.triples.forEach((x) => (x.peers = peers[r][x.id])));
  return runs;
}

export async function loadRelationViewData(runDir: string): Promise<RelationViewData> {
  return (await loadRelationViewRuns([runDir]))[0];
}

function esc(s: unknown): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Renders the page for one run, or for several runs in ONE page with a run switcher. */
export function renderRelationViewHtml(input: RelationViewData | RelationViewData[]): string {
  const runs = Array.isArray(input) ? input : [input];
  if (runs.length === 0) throw new Error('renderRelationViewHtml needs at least one run');
  const payload = JSON.stringify({ runs, howLabels: RELATION_HOW }).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:,">
<title>SKEIN-E relation types — ${esc(runs.length === 1 ? runs[0].runId : `${runs.length} runs`)}</title>
<style>
  :root { --bg:#fff; --fg:#1f2328; --muted:#656d76; --line:#d0d7de; --panel:#f6f8fa; --hl:#fff3b8; --accent:#0969da; --typed:#1a7f37; --pool:#bf8700; --pending:#8c959f; }
  @media (prefers-color-scheme: dark) { :root { --bg:#0d1117; --fg:#e6edf3; --muted:#8d96a0; --line:#30363d; --panel:#161b22; --hl:#4d3800; --accent:#58a6ff; --typed:#3fb950; --pool:#d29922; --pending:#6e7681; } }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--fg); font:14px/1.45 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; }
  header { padding:10px 16px; border-bottom:1px solid var(--line); position:sticky; top:0; background:var(--bg); z-index:5; }
  header h1 { font-size:16px; margin:0 0 4px; }
  .sub { color:var(--muted); font-size:12px; }
  .warn { color:#9a6700; }
  .controls { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-top:8px; }
  .controls input[type=range] { flex:1; min-width:200px; }
  button, select { background:var(--panel); color:var(--fg); border:1px solid var(--line); border-radius:6px; padding:3px 10px; cursor:pointer; font-size:13px; }
  .pos { font-variant-numeric:tabular-nums; color:var(--muted); font-size:12px; }
  main { display:grid; grid-template-columns:320px 1fr 360px; gap:0; }
  @media (max-width:1100px) { main { grid-template-columns:1fr; } }
  nav, aside { padding:10px 12px; font-size:13px; min-width:0; }
  nav { border-right:1px solid var(--line); }
  aside { border-left:1px solid var(--line); }
  section.middle { padding:10px 14px; min-width:0; }
  h2 { font-size:12px; text-transform:uppercase; letter-spacing:.04em; color:var(--muted); margin:12px 0 6px; }
  h3 { font-size:12px; margin:10px 0 2px; color:var(--muted); font-weight:600; }
  .card { border:1px solid var(--line); border-radius:8px; padding:6px 8px; margin:6px 0; background:var(--panel); }
  .card.new { box-shadow:0 0 0 2px var(--hl) inset; }
  .card .lbl { font-weight:600; display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
  .card .def { color:var(--muted); font-size:12px; margin:2px 0 4px; }
  .card .alt { font-size:11px; color:var(--muted); overflow-wrap:anywhere; }
  .sw { display:inline-block; width:10px; height:10px; border-radius:50%; border:1px solid rgba(0,0,0,.25); flex:none; }
  details summary { cursor:pointer; font-size:12px; color:var(--accent); }
  ul.members { list-style:none; padding-left:0; margin:4px 0 0; font-size:12px; max-height:240px; overflow:auto; }
  ul.members li { padding:2px 0; border-top:1px dashed var(--line); overflow-wrap:anywhere; }
  .k, .muted { color:var(--muted); }
  svg { width:100%; height:auto; background:var(--panel); border:1px solid var(--line); border-radius:8px; }
  .scroll { overflow:auto; max-width:100%; }
  table { border-collapse:collapse; font-size:12px; margin-top:6px; }
  th, td { border:1px solid var(--line); padding:2px 6px; text-align:left; vertical-align:top; }
  table.matrix th { font-weight:600; background:var(--panel); white-space:nowrap; }
  table.matrix th.col { writing-mode:vertical-rl; transform:rotate(180deg); text-align:left; padding:6px 2px; }
  table.matrix td { min-width:44px; height:34px; padding:2px 3px; cursor:pointer; text-align:center; }
  table.matrix td.empty { cursor:default; }
  table.matrix td.sel { outline:2px solid var(--accent); outline-offset:-2px; }
  table.matrix td.cur { background:var(--hl); }
  .n { font-variant-numeric:tabular-nums; font-weight:600; }
  .bar { display:flex; height:5px; margin-top:2px; border-radius:2px; overflow:hidden; background:var(--line); }
  .bar i { display:block; height:100%; }
  .typed { background:var(--typed); } .pool { background:var(--pool); } .pending { background:var(--pending); }
  .legend { display:flex; flex-wrap:wrap; gap:4px 12px; font-size:12px; margin:6px 0; align-items:center; }
  .legend span { display:inline-flex; align-items:center; gap:4px; }
  .legend i { display:inline-block; width:12px; height:6px; border-radius:2px; }
  .tag { font-size:11px; border-radius:8px; padding:0 6px; border:1px solid var(--line); white-space:nowrap; }
  .tag.typed, .tag.pool, .tag.pending { color:#fff; border-color:transparent; }
  tr.cur td { background:var(--hl); }
  .ev { border-top:1px solid var(--line); padding:3px 0; font-size:12px; overflow-wrap:anywhere; }
  .ev b.mint, .ev b.mint-narrower { color:#1a7f37; } .ev b.alias { color:#8250df; } .ev b.release { color:var(--accent); } .ev b.cross-cell-name { color:#bf3989; } .ev b.name-failed, .ev b.unknown-target, .ev b.unresolved, .ev b.relate-failed { color:#cf222e; }
  .rel { font-size:12px; padding:2px 0; border-top:1px dashed var(--line); overflow-wrap:anywhere; }
  .rel .t { color:var(--accent); }
  select { max-width:100%; }
  #runswitch { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top:6px; font-size:12px; color:var(--muted); }
  #runswitch[hidden] { display:none; }
  .chips { display:flex; flex-wrap:wrap; gap:6px; margin:6px 0; }
  .chips[hidden] { display:none; }
  .chips button.on { border-color:var(--accent); color:var(--accent); font-weight:600; }
  #statements table { width:100%; }
  #statements td:nth-child(2), #statements td:nth-child(4) { overflow-wrap:anywhere; }
  #statements tr[data-id] { cursor:pointer; }
  #statements tr.sel td { outline:2px solid var(--accent); outline-offset:-2px; }
  #statements tr.ghost td { color:var(--muted); font-style:italic; }
  .tag.only, .tag.absent { background:var(--hl); border-color:transparent; font-style:normal; color:var(--fg); }
  .diff { background:var(--hl); border-radius:3px; padding:0 3px; }
  .statement { font-size:12px; overflow-wrap:anywhere; }
  .statement .sec { font-size:10.5px; text-transform:uppercase; letter-spacing:.04em; color:var(--muted); margin:7px 0 1px; padding-top:5px; border-top:1px solid var(--line); }
  .statement .sec span { text-transform:none; letter-spacing:0; }
  .statement ol.trail { margin:2px 0 0; padding-left:18px; }
  .statement ol.trail li.later { color:var(--muted); }
  .statement .absent { background:var(--hl); border-radius:4px; padding:2px 6px; margin-bottom:4px; }
</style>
</head>
<body>
<header>
  <h1>SKEIN-E relation types — <code id="runid"></code></h1>
  <div class="sub" id="meta"></div>
  <div class="sub warn" id="warn"></div>
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
    <button id="clear" title="show all cells">all cells</button>
  </div>
  <div class="sub" id="docline"></div>
</header>
<main>
  <nav>
    <h2>Relation types after this document (<span id="ntypes"></span>)<span id="filterline"></span></h2>
    <div id="types"></div>
  </nav>
  <section class="middle">
    <h2>Argument-type matrix: head scheme (rows) × tail scheme (columns), final schemes of the arguments. Click a cell to filter.</h2>
    <div class="legend"><span><i class="typed"></i>typed</span><span><i class="pool"></i>pool (in a cell, no type)</span><span><i class="pending"></i>pending (an argument has no scheme yet)</span><span class="muted">number = statements seen so far · highlighted = touched by this document</span></div>
    <div class="scroll" id="matrix"></div>
    <h2>Growth along the stream</h2>
    <svg id="curves" viewBox="0 0 800 220"></svg>
    <h2>Statements (<span id="nstat"></span>). Click a row to explain it.</h2>
    <div class="chips" id="filters" hidden></div>
    <div class="scroll" id="statements"></div>
  </section>
  <aside>
    <h2>Selected statement</h2>
    <div id="pinned" class="statement"></div>
    <h2>This document</h2>
    <div id="doc"></div>
    <h2>Events in this document</h2>
    <div id="events"></div>
    <h2>Run card</h2>
    <div id="card" class="muted" style="font-size:12px"></div>
  </aside>
</main>
<script id="data" type="application/json">${payload}</script>
<script>
(function(){
  const P = JSON.parse(document.getElementById('data').textContent);
  const RUNS = P.runs; const HOW = P.howLabels;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const PALETTE = ['#0969da','#cf222e','#1a7f37','#8250df','#bf8700','#0598bc','#e16f24','#6e7781','#a475f9','#3fb950','#d4a72c','#f778ba','#57606a','#0550ae','#a40e26','#116329','#953800','#0a3069','#6639ba','#7d4e00'];
  // one colour list for the page: a type label keeps its colour in every run
  const typeLabels = [...new Set(RUNS.flatMap(r => r.types.map(x => x.prefLabel)))].sort();
  const IDX = RUNS.map(r => ({
    docIndex: new Map(r.docs.map((d,i) => [d.id,i])),
    typeById: new Map(r.types.map(x => [x.id,x])),
    tripleById: new Map(r.triples.map(x => [x.id,x])),
  }));
  const colourOf = (q, typeId) => PALETTE[typeLabels.indexOf(IDX[q].typeById.get(typeId).prefLabel) % PALETTE.length];

  // R = the run on screen, C = the run it is compared with (-1 on a one-run page)
  let R = 0, C = RUNS.length > 1 ? 1 : -1, t = 0, timer = null, filter = null, vs = 'all', pinned = null, heads = [], tails = [];
  const scrub = $('scrub');

  // state of a statement of run q after stream position pos: undefined = not seen yet
  function stateAt(q, x, pos) {
    const di = IDX[q].docIndex;
    if (di.get(x.doc) > pos) return undefined;
    let last = null;
    for (const a of x.assign) if (di.get(a.doc) <= pos) last = a;
    if (!last) return { status: 'pending', type: null, how: '', score: undefined };
    if (last.type) return { status: 'typed', type: last.type, how: last.how, score: last.score };
    return { status: last.cell === null ? 'pending' : 'pool', type: null, how: last.how, score: last.score };
  }
  // stream position of the current document in run q; a run without the document is read at its end
  function posIn(q) {
    if (q === R) return t;
    const i = IDX[q].docIndex.get(RUNS[R].docs[t].id);
    return i === undefined ? RUNS[q].docs.length - 1 : i;
  }
  const split = (label) => { const i = label.indexOf(' → '); return i === -1 ? [label, label] : [label.slice(0,i), label.slice(i+3)]; };
  const peerOf = (x, p) => x.peers[p] ? IDX[p].tripleById.get(x.peers[p].id) : null;
  // what a run made of a statement: the label of its type, or pool / pending
  const outcome = (q, s) => !s ? null : s.type ? IDX[q].typeById.get(s.type).prefLabel : s.status;
  const outcomeHtml = (q, s) => !s ? '<span class="muted">not seen yet</span>' : s.type ? '<span class="sw" style="background:' + colourOf(q, s.type) + '"></span> ' + esc(IDX[q].typeById.get(s.type).prefLabel) : '<span class="tag ' + s.status + '">' + s.status + '</span>';
  // a statement of the run on screen against the compared run: na (not comparable), only, differs, same
  function versus(x) {
    if (C < 0 || !IDX[C].docIndex.has(x.doc)) return 'na';
    const p = peerOf(x, C);
    if (!p) return 'only';
    return outcome(R, stateAt(R, x, t)) === outcome(C, stateAt(C, p, posIn(C))) ? 'same' : 'differs';
  }
  // statements of the compared run that this run does not have, for the documents seen so far
  function ghosts() {
    if (C < 0) return [];
    const di = IDX[R].docIndex;
    return RUNS[C].triples.filter(g => !g.peers[R] && di.has(g.doc) && di.get(g.doc) <= t);
  }

  // the explanation of one statement of run q, in labelled parts
  function describe(q, x) {
    const run = RUNS[q], di = IDX[q].docIndex, pos = posIn(q);
    let h = '';
    if (q !== R) h += '<div class="absent">' + (IDX[R].docIndex.has(x.doc) ? 'Absent from ' + esc(RUNS[R].runId) + ': only ' + esc(run.runId) + ' extracted it from this document.' : 'A statement of ' + esc(run.runId) + '; the document is not part of ' + esc(RUNS[R].runId) + '.') + '</div>';
    h += '<div><b>' + esc(x.headName) + '</b> → <b>' + esc(x.tailName) + '</b></div><div class="muted">document ' + (di.get(x.doc)+1) + ' of ' + run.docs.length + ' (' + x.doc + ') · arguments: ' + esc(x.finalCellLabel) + '</div>';
    h += '<div class="sec">Extractor said <span>(its own words: a phrase is not a relation type, every statement has one)</span></div>' +
      '<div>phrase: <b>' + esc(x.phrase) + '</b>' + (x.fit ? ' <span class="muted">· fit ' + esc(x.fit) + '</span>' : '') + '</div>' + (x.definition ? '<div class="muted">' + esc(x.definition) + '</div>' : '') + (x.evidence ? '<div class="muted">“' + esc(x.evidence) + '”</div>' : '');
    h += '<div class="sec">Route in run <span>' + esc(run.runId) + '</span></div><div>state after document ' + (pos+1) + ': ' + outcomeHtml(q, stateAt(q, x, pos)) + '</div>' +
      '<ol class="trail">' + x.assign.map(a => {
        const later = di.get(a.doc) > pos;
        return '<li class="' + (later ? 'later' : '') + '">document ' + (di.get(a.doc)+1) + ': ' + esc(HOW[a.how] || a.how) + (a.score && a.score !== 1 ? ' (cosine ' + Number(a.score).toFixed(2) + ')' : '') +
          (a.cell ? ' <span class="muted">[cell ' + esc(a.cell === x.cell && x.cellLabel ? x.cellLabel : a.cell) + ']</span>' : '') + (a.type ? ' → <b>' + esc(IDX[q].typeById.get(a.type).prefLabel) + '</b>' : '') + (later ? ' (after the current document)' : '') + '</li>';
      }).join('') + '</ol>';
    if (RUNS.length > 1) {
      h += '<div class="sec">In the other runs <span>(same document, same or containing head and tail)</span></div>' + RUNS.map((other, p) => {
        if (p === q) return '';
        let line;
        if (!IDX[p].docIndex.has(x.doc)) line = '<span class="muted">the document is not part of this run</span>';
        else {
          const y = peerOf(x, p);
          if (!y) line = '<b>absent</b>: no statement between these two in the document';
          else line = 'phrase ' + (y.phrase === x.phrase ? esc(y.phrase) : '<span class="diff">' + esc(y.phrase) + '</span>') + ' · final state: ' + outcomeHtml(p, stateAt(p, y, other.docs.length - 1)) + (x.peers[p].how === 'contains' ? ' · matched as ' + esc(y.headName) + ' → ' + esc(y.tailName) : '');
        }
        return '<div>' + esc(other.runId) + (p === C && q === R ? ' <span class="muted">(compared)</span>' : '') + ': ' + line + '</div>';
      }).join('');
    }
    return h;
  }

  function render() {
    const D = RUNS[R], docs = D.docs, doc = docs[t], docIndexById = IDX[R].docIndex, typeById = IDX[R].typeById;
    $('pos').textContent = (t+1) + ' / ' + docs.length;
    $('docline').textContent = 'Document ' + doc.id + ' · ' + doc.date + ' · ' + doc.title;
    const seen = []; for (const x of D.triples) { const s = stateAt(R, x, t); if (s) seen.push([x, s]); }
    const inFilter = (x) => filter === null || x.finalCellLabel === filter;
    const touched = new Set(D.events.filter(e => e.doc === doc.id && e.triple).map(e => e.triple));
    for (const [x] of seen) if (x.doc === doc.id) touched.add(x.id);

    // type cards, grouped by the cell the type lives in
    const current = D.types.filter(x => docIndexById.get(x.born) <= t);
    const membersAt = new Map(current.map(x => [x.id, []]));
    for (const [x, s] of seen) if (s.type && membersAt.has(s.type)) membersAt.get(s.type).push(x);
    const shown = current.filter(x => filter === null || membersAt.get(x.id).some(inFilter));
    $('ntypes').textContent = shown.length + (filter === null ? '' : ' of ' + current.length);
    $('filterline').innerHTML = filter === null ? '' : ' · <span style="color:var(--accent);text-transform:none">' + esc(filter) + '</span>';
    const groups = new Map(); for (const x of shown) { if (!groups.has(x.cellLabel)) groups.set(x.cellLabel, []); groups.get(x.cellLabel).push(x); }
    $('types').innerHTML = [...groups.entries()].sort((a,b) => a[0].localeCompare(b[0])).map(([cellLabel, list]) =>
      '<h3>' + esc(cellLabel) + '</h3>' + list.sort((a,b) => membersAt.get(b.id).length - membersAt.get(a.id).length).map(x => {
        const members = membersAt.get(x.id);
        const phrases = new Map(); for (const m of members) phrases.set(m.phrase, (phrases.get(m.phrase)||0)+1);
        const phraseStr = [...phrases.entries()].sort((a,b)=>b[1]-a[1]).map(([p,n]) => p + '×' + n).join(', ');
        const broader = x.broader && typeById.get(x.broader) ? ' <span class="tag">narrower than ' + esc(typeById.get(x.broader).prefLabel) + '</span>' : '';
        return '<div class="card' + (x.born === doc.id ? ' new' : '') + '"><div class="lbl"><span class="sw" style="background:' + colourOf(R, x.id) + '"></span>' + esc(x.prefLabel) + ' <span class="muted">(' + members.length + ')</span>' + broader + '</div>' +
          (x.definition ? '<div class="def">' + esc(x.definition) + '</div>' : '') +
          (x.altLabels.length ? '<div class="alt">alt: ' + esc(x.altLabels.join(' · ')) + '</div>' : '') +
          '<div class="alt">born doc ' + (docIndexById.get(x.born)+1) + ' (' + x.born + ') · phrases: ' + esc(phraseStr) + '</div>' +
          '<details><summary>statements</summary><ul class="members">' + members.map(m => '<li><b>' + esc(m.headName) + '</b> <span class="k">' + esc(m.phrase) + '</span> <b>' + esc(m.tailName) + '</b><div class="k">' + esc(m.finalCellLabel) + (m.evidence ? ' · “' + esc(m.evidence) + '”' : '') + '</div></li>').join('') + '</ul></details></div>';
      }).join('')
    ).join('') || '<div class="muted">no relation types yet</div>';

    // matrix
    const counts = new Map();
    for (const [x, s] of seen) {
      const c = counts.get(x.finalCellLabel) || { typed:0, pool:0, pending:0, cur:false };
      c[s.status] += 1; if (touched.has(x.id)) c.cur = true; counts.set(x.finalCellLabel, c);
    }
    let h = '<table class="matrix"><tr><th>head \\\\ tail</th>' + tails.map(c => '<th class="col">' + esc(c) + '</th>').join('') + '</tr>';
    for (const r of heads) {
      h += '<tr><th>' + esc(r) + '</th>';
      for (const c of tails) {
        const key = r + ' → ' + c; const v = counts.get(key);
        if (!v) { h += '<td class="empty"></td>'; continue; }
        const total = v.typed + v.pool + v.pending;
        h += '<td data-cell="' + esc(key) + '" class="' + (filter === key ? 'sel ' : '') + (v.cur ? 'cur' : '') + '" title="' + esc(key) + ': ' + v.typed + ' typed, ' + v.pool + ' pool, ' + v.pending + ' pending"><span class="n">' + total + '</span>' +
          '<div class="bar"><i class="typed" style="width:' + (100*v.typed/total) + '%"></i><i class="pool" style="width:' + (100*v.pool/total) + '%"></i><i class="pending" style="width:' + (100*v.pending/total) + '%"></i></div></td>';
      }
      h += '</tr>';
    }
    $('matrix').innerHTML = h + '</table>';

    // curves
    const pd = D.perDoc.slice(0, t+1);
    const series = [['typed','var(--typed)'],['pool','var(--pool)'],['pending','var(--pending)'],['types','#8250df'],['namingCalls','#bf3989']];
    const cumulative = (k, i) => k === 'namingCalls' ? pd.slice(0, i+1).reduce((a,r) => a + (r[k]||0), 0) : (pd[i][k]||0);
    const maxV = Math.max(1, ...D.perDoc.map((_, i) => i < pd.length ? Math.max(...series.map(([k]) => cumulative(k, i))) : 0));
    const cx = (i) => 40 + i / Math.max(1, docs.length-1) * 740;
    const cy = (v) => 200 - v / maxV * 180;
    let cs = '<line x1="40" y1="200" x2="780" y2="200" stroke="var(--line)"/><text x="4" y="24" font-size="11" fill="var(--muted)">' + maxV + '</text><text x="4" y="204" font-size="11" fill="var(--muted)">0</text>';
    series.forEach(([k,col], si) => {
      const pts = pd.map((r,i) => cx(i).toFixed(1) + ',' + cy(cumulative(k, i)).toFixed(1)).join(' ');
      cs += '<polyline points="' + pts + '" fill="none" stroke="' + col + '" stroke-width="2"/>';
      cs += '<text x="' + (50 + si*150) + '" y="216" font-size="11" fill="' + col + '">' + k + (pd.length ? ' = ' + cumulative(k, pd.length-1) : '') + '</text>';
    });
    $('curves').innerHTML = cs;

    // statement table: this run, the compared run next to it, then what only the compared run has
    const tally = { only: 0, differs: 0, same: 0, na: 0 };
    const cellRows = seen.filter(([x]) => inFilter(x)).map(([x, s]) => { const v = versus(x); tally[v] += 1; return [x, s, v]; });
    const gone = ghosts().filter(inFilter);
    const rows = cellRows.filter(r => vs === 'all' || vs === r[2]).sort((a,b) => (a[1].type||'~'+a[1].status).localeCompare(b[1].type||'~'+b[1].status) || a[0].phrase.localeCompare(b[0].phrase));
    const goneRows = vs === 'all' || vs === 'absent' ? gone : [];
    const isPinned = (q, x) => pinned && pinned.q === q && pinned.id === x.id;
    $('nstat').textContent = rows.length + (filter === null ? '' : ' in ' + filter) + (goneRows.length ? ' + ' + goneRows.length + ' absent here' : '');
    const cmpCell = (x, v) => {
      if (C < 0) return '';
      if (v === 'na') return '<td class="muted">document not in that run</td>';
      if (v === 'only') return '<td><span class="tag only">only in this run</span></td>';
      const p = peerOf(x, C);
      return '<td>' + (p.phrase === x.phrase ? '' : '<span class="muted">' + esc(p.phrase) + '</span> → ') + (v === 'differs' ? '<span class="diff">' : '') + outcomeHtml(C, stateAt(C, p, posIn(C))) + (v === 'differs' ? '</span>' : '') + '</td>';
    };
    $('statements').innerHTML = '<table><tr><th>doc</th><th>head</th><th>phrase</th><th>tail</th><th>cell (final)</th><th>type</th><th>how</th>' + (C >= 0 ? '<th title="' + esc(RUNS[C].runId) + '">compared run</th>' : '') + '</tr>' + rows.map(([x, s, v]) =>
      '<tr data-id="' + esc(x.id) + '" data-run="' + R + '" class="' + (touched.has(x.id) ? 'cur' : '') + (isPinned(R, x) ? ' sel' : '') + '"><td>' + (docIndexById.get(x.doc)+1) + '</td><td>' + esc(x.headName) + '</td><td title="' + esc(x.definition) + '">' + esc(x.phrase) + '</td><td>' + esc(x.tailName) + '</td><td class="muted">' + esc(x.finalCellLabel) + '</td><td>' +
      outcomeHtml(R, s) + '</td><td class="muted" title="' + esc(HOW[s.how] || '') + '">' + esc(s.how) + (s.score !== undefined && s.score !== 1 && s.score !== 0 ? ' ' + Number(s.score).toFixed(2) : '') + (x.fit ? ' · fit ' + esc(x.fit) : '') + '</td>' + cmpCell(x, v) + '</tr>').join('') +
      goneRows.map(g => '<tr data-id="' + esc(g.id) + '" data-run="' + C + '" class="ghost' + (isPinned(C, g) ? ' sel' : '') + '"><td>' + (docIndexById.get(g.doc)+1) + '</td><td>' + esc(g.headName) + '</td><td title="' + esc(g.definition) + '">' + esc(g.phrase) + '</td><td>' + esc(g.tailName) + '</td><td>' + esc(g.finalCellLabel) + '</td><td><span class="tag absent">absent here</span></td><td></td><td>' + outcomeHtml(C, stateAt(C, g, posIn(C))) + '</td></tr>').join('') + '</table>';
    if (C >= 0) {
      $('filters').innerHTML = [['all', 'all statements'], ['only', 'only in this run · ' + tally.only], ['absent', 'absent here · ' + gone.length], ['differs', 'typed differently · ' + tally.differs], ['same', 'same outcome · ' + tally.same]]
        .map(([k, label]) => '<button data-filter="' + k + '" class="' + (vs === k ? 'on' : '') + '">' + esc(label) + '</button>').join('');
      $('cmpline').textContent = 'after this document' + (filter === null ? '' : ', in ' + filter) + ': ' + (tally.same + tally.differs) + ' shared statements (' + tally.differs + ' typed differently), ' + tally.only + ' only here, ' + gone.length + ' only there';
    }

    // this document
    const mine = seen.filter(([x]) => x.doc === doc.id);
    $('doc').innerHTML = mine.map(([x, s]) => '<div class="rel"><b>' + esc(x.headName) + '</b> <span class="t">' + esc(x.phrase) + '</span> <b>' + esc(x.tailName) + '</b> → ' +
      (s.type ? '<span style="color:' + colourOf(R, s.type) + '">' + esc(typeById.get(s.type).prefLabel) + '</span>' : '<span class="tag ' + s.status + '">' + s.status + '</span>') +
      '<div class="muted">' + esc(x.finalCellLabel) + (x.evidence ? ' · “' + esc(x.evidence) + '”' : '') + '</div></div>').join('') || '<div class="muted">no relation statements in this document</div>';

    // events of this document
    const evs = D.events.filter(e => e.doc === doc.id);
    const major = evs.filter(e => e.op !== 'assign' && e.op !== 'pool');
    const why = new Map(); for (const e of evs) if (e.op === 'assign' || e.op === 'pool') { const k = e.op + ': ' + (e.why || ''); why.set(k, (why.get(k)||0)+1); }
    $('events').innerHTML = major.map(e => '<div class="ev"><b class="' + esc(e.op) + '">' + esc(e.op) + '</b> ' + esc(e.label || e.phrase || e.triple || '') +
      (e.cellLabel ? ' <span class="muted">[' + esc(e.cellLabel) + ']</span>' : '') + (e.knownIn ? ' <span class="muted">already known in ' + esc(e.knownIn) + '</span>' : '') +
      (e.definition ? ' — <span class="muted">' + esc(e.definition) + '</span>' : '') + (e.size ? ' <span class="muted">(' + e.size + ' statements)</span>' : '') +
      (e.waitedSince ? ' <span class="muted">waited since doc ' + e.waitedSince + '</span>' : '') + '</div>').join('') +
      '<div class="ev muted">' + ([...why.entries()].map(([k,n]) => n + ' × ' + k).join(', ') || 'no assignment decisions') + '</div>';

    const px = pinned && IDX[pinned.q].tripleById.get(pinned.id);
    $('pinned').innerHTML = px ? describe(pinned.q, px) + '<div style="margin-top:6px"><button data-unpin="1">clear</button></div>' : '<div class="muted">Click a row of the statement table to keep its explanation here.</div>';
  }

  const remember = () => { if (C >= 0) history.replaceState(null, '', '#run=' + encodeURIComponent(RUNS[R].runId) + '&cmp=' + encodeURIComponent(RUNS[C].runId)); };

  // everything that depends on the run on screen but not on the stream position
  function bind(index, keepDocId) {
    if (index === C) C = R;
    R = index;
    const D = RUNS[R], card = D.runCard, cfg = card.config;
    const kept = keepDocId == null ? undefined : IDX[R].docIndex.get(keepDocId);
    t = kept === undefined ? D.docs.length - 1 : kept;
    scrub.max = String(D.docs.length - 1); scrub.value = String(t);
    heads = [...new Set(D.triples.map(x => split(x.finalCellLabel)[0]))].sort();
    tails = [...new Set(D.triples.map(x => split(x.finalCellLabel)[1]))].sort();
    if (filter !== null && !D.triples.some(x => x.finalCellLabel === filter)) filter = null;
    $('runid').textContent = D.runId;
    const blind = cfg.arm !== 'typed-icl';
    $('meta').textContent = 'arm ' + cfg.arm + ' · LLM ' + cfg.llmModel + ' · embeddings ' + cfg.embedModel + (blind ? ' · k=' + cfg.k + ' τ=' + cfg.tau + ' δ=' + cfg.delta + ' pool-link=' + cfg.poolLink + ' mass=' + cfg.mass + ' docs' : ' · name merge ≥ ' + cfg.merge + ' inside a cell') + ' · source ' + card.source.run + ' (' + card.source.schemes + ' schemes)';
    $('warn').textContent = cfg.schemes === 'final' ? 'Scheme state: FINAL schemes of the source run visible from the first document (mature-scheme emulation, not prefix-causal for the scheme layer).' : '';
    if (RUNS.length > 1) {
      const option = (r, i, chosen) => '<option value="' + i + '"' + (i === chosen ? ' selected' : '') + '>' + esc(r.runId) + ' — ' + esc(r.label) + '</option>';
      $('runswitch').hidden = false; $('filters').hidden = false;
      $('run').innerHTML = RUNS.map((r, i) => option(r, i, R)).join(''); $('run').value = String(R);
      $('cmp').innerHTML = RUNS.map((r, i) => i === R ? '' : option(r, i, C)).join(''); $('cmp').value = String(C);
    }
    if (pinned && pinned.q !== R) { const x = IDX[pinned.q].tripleById.get(pinned.id); if (x && x.peers[R]) pinned = { q: R, id: x.peers[R].id }; }
    $('card').innerHTML = [
      ['statements', card.triples.total], ['typed', card.triples.typed], ['pool', card.triples.pool], ['pending', card.triples.pending],
      ['relation types', card.relationTypes + ' in ' + card.cellsWithTypes + ' cells'], ['types with ≤ 2 statements', (100*card.tailShare).toFixed(1) + '%'],
      ['signature purity', (100*card.finalSignaturePurity).toFixed(1) + '%'], ['naming calls', card.namingCalls],
      ['fit', Object.entries(card.fit || {}).map(([k,n]) => k + ' ' + n).join(', ') || 'n/a'],
      ['tokens in / out', card.cost.totals.inputTokens + ' / ' + card.cost.totals.outputTokens],
    ].map(([k,v]) => '<div>' + esc(k) + ': <b>' + esc(v) + '</b></div>').join('');
    remember(); render();
  }

  $('matrix').addEventListener('click', (ev) => {
    const td = ev.target.closest('td[data-cell]'); if (!td) return;
    filter = filter === td.dataset.cell ? null : td.dataset.cell; render();
  });
  $('statements').addEventListener('click', (ev) => {
    const tr = ev.target.closest('tr[data-id]'); if (!tr) return;
    const q = Number(tr.dataset.run);
    pinned = pinned && pinned.q === q && pinned.id === tr.dataset.id ? null : { q, id: tr.dataset.id }; render();
  });
  $('pinned').addEventListener('click', (ev) => { if (ev.target.closest('[data-unpin]')) { pinned = null; render(); } });
  $('filters').addEventListener('click', (ev) => { const b = ev.target.closest('[data-filter]'); if (!b) return; vs = b.dataset.filter; render(); });
  $('run').addEventListener('change', (ev) => bind(Number(ev.target.value), RUNS[R].docs[t].id));
  $('cmp').addEventListener('change', (ev) => { C = Number(ev.target.value); remember(); vs = 'all'; render(); });
  $('clear').onclick = () => { filter = null; render(); };
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
