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
 * events.
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
  docs: Array<{ id: number; date: string; title: string }>;
  triples: TripleRow[];
  types: TypeRow[];
  events: Array<Record<string, unknown>>;
  perDoc: Array<Record<string, number>>;
  runCard: Record<string, unknown>;
}

export async function loadRelationViewData(runDir: string): Promise<RelationViewData> {
  const read = async (file: string) => JSON.parse(await fs.readFile(path.join(runDir, file), 'utf8'));
  const events = (await fs.readFile(path.join(runDir, 'events.jsonl'), 'utf8'))
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
  return {
    runId: path.basename(runDir),
    docs: await read('docs.json'),
    triples: await read('triples.json'),
    types: await read('relation-types.json'),
    events,
    perDoc: await read('per-doc.json'),
    runCard: await read('run-card.json'),
  };
}

function esc(s: unknown): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderRelationViewHtml(data: RelationViewData): string {
  const payload = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:,">
<title>SKEIN-E relation types — ${esc(data.runId)}</title>
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
</style>
</head>
<body>
<header>
  <h1>SKEIN-E relation types — <code id="runid"></code></h1>
  <div class="sub" id="meta"></div>
  <div class="sub warn" id="warn"></div>
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
    <h2>Statements (<span id="nstat"></span>)</h2>
    <div class="scroll" id="statements"></div>
  </section>
  <aside>
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
  const D = JSON.parse(document.getElementById('data').textContent);
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const PALETTE = ['#0969da','#cf222e','#1a7f37','#8250df','#bf8700','#0598bc','#e16f24','#6e7781','#a475f9','#3fb950','#d4a72c','#f778ba','#57606a','#0550ae','#a40e26','#116329','#953800','#0a3069','#6639ba','#7d4e00'];
  const docs = D.docs; const docIndexById = new Map(docs.map((d,i)=>[d.id,i]));
  const typeById = new Map(D.types.map(x=>[x.id,x]));
  const typeIds = D.types.map(x=>x.id);
  const colourOf = (typeId) => PALETTE[typeIds.indexOf(typeId) % PALETTE.length];
  const cfg = D.runCard.config; const card = D.runCard;

  // state of a statement after stream position t: undefined = not seen yet
  function stateAt(x, t) {
    if (docIndexById.get(x.doc) > t) return undefined;
    let last = null;
    for (const a of x.assign) if (docIndexById.get(a.doc) <= t) last = a;
    if (!last) return { status: 'pending', type: null, how: '', score: undefined };
    if (last.type) return { status: 'typed', type: last.type, how: last.how, score: last.score };
    return { status: last.cell === null ? 'pending' : 'pool', type: null, how: last.how, score: last.score };
  }
  const split = (label) => { const i = label.indexOf(' → '); return i === -1 ? [label, label] : [label.slice(0,i), label.slice(i+3)]; };
  const heads = [...new Set(D.triples.map(x => split(x.finalCellLabel)[0]))].sort();
  const tails = [...new Set(D.triples.map(x => split(x.finalCellLabel)[1]))].sort();

  let t = docs.length - 1; let timer = null; let filter = null;
  const scrub = $('scrub'); scrub.max = docs.length - 1; scrub.value = t;
  $('runid').textContent = D.runId;
  const blind = cfg.arm !== 'typed-icl';
  $('meta').textContent = 'arm ' + cfg.arm + ' · LLM ' + cfg.llmModel + ' · embeddings ' + cfg.embedModel + (blind ? ' · k=' + cfg.k + ' τ=' + cfg.tau + ' δ=' + cfg.delta + ' pool-link=' + cfg.poolLink + ' mass=' + cfg.mass + ' docs' : ' · name merge ≥ ' + cfg.merge + ' inside a cell') + ' · source ' + card.source.run + ' (' + card.source.schemes + ' schemes)';
  $('warn').textContent = cfg.schemes === 'final' ? 'Scheme state: FINAL schemes of the source run visible from the first document (mature-scheme emulation, not prefix-causal for the scheme layer).' : '';

  function render() {
    const doc = docs[t];
    $('pos').textContent = (t+1) + ' / ' + docs.length;
    $('docline').textContent = 'Document ' + doc.id + ' · ' + doc.date + ' · ' + doc.title;
    const seen = []; for (const x of D.triples) { const s = stateAt(x, t); if (s) seen.push([x, s]); }
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
        return '<div class="card' + (x.born === doc.id ? ' new' : '') + '"><div class="lbl"><span class="sw" style="background:' + colourOf(x.id) + '"></span>' + esc(x.prefLabel) + ' <span class="muted">(' + members.length + ')</span>' + broader + '</div>' +
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

    // statement table
    const rows = seen.filter(([x]) => inFilter(x)).sort((a,b) => (a[1].type||'~'+a[1].status).localeCompare(b[1].type||'~'+b[1].status) || a[0].phrase.localeCompare(b[0].phrase));
    $('nstat').textContent = rows.length + (filter === null ? '' : ' in ' + filter);
    $('statements').innerHTML = '<table><tr><th>doc</th><th>head</th><th>phrase</th><th>tail</th><th>cell (final)</th><th>type</th><th>how</th></tr>' + rows.map(([x, s]) =>
      '<tr class="' + (touched.has(x.id) ? 'cur' : '') + '"><td>' + (docIndexById.get(x.doc)+1) + '</td><td>' + esc(x.headName) + '</td><td title="' + esc(x.definition) + '">' + esc(x.phrase) + '</td><td>' + esc(x.tailName) + '</td><td class="muted">' + esc(x.finalCellLabel) + '</td><td>' +
      (s.type ? '<span class="sw" style="background:' + colourOf(s.type) + '"></span> ' + esc(typeById.get(s.type).prefLabel) : '<span class="tag ' + s.status + '">' + s.status + '</span>') + '</td><td class="muted">' + esc(s.how) + (s.score !== undefined && s.score !== 1 && s.score !== 0 ? ' ' + Number(s.score).toFixed(2) : '') + (x.fit ? ' · fit ' + esc(x.fit) : '') + '</td></tr>').join('') + '</table>';

    // this document
    const mine = seen.filter(([x]) => x.doc === doc.id);
    $('doc').innerHTML = mine.map(([x, s]) => '<div class="rel"><b>' + esc(x.headName) + '</b> <span class="t">' + esc(x.phrase) + '</span> <b>' + esc(x.tailName) + '</b> → ' +
      (s.type ? '<span style="color:' + colourOf(s.type) + '">' + esc(typeById.get(s.type).prefLabel) + '</span>' : '<span class="tag ' + s.status + '">' + s.status + '</span>') +
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
  }

  $('card').innerHTML = [
    ['statements', card.triples.total], ['typed', card.triples.typed], ['pool', card.triples.pool], ['pending', card.triples.pending],
    ['relation types', card.relationTypes + ' in ' + card.cellsWithTypes + ' cells'], ['types with ≤ 2 statements', (100*card.tailShare).toFixed(1) + '%'],
    ['signature purity', (100*card.finalSignaturePurity).toFixed(1) + '%'], ['naming calls', card.namingCalls],
    ['fit', Object.entries(card.fit || {}).map(([k,n]) => k + ' ' + n).join(', ') || 'n/a'],
    ['tokens in / out', card.cost.totals.inputTokens + ' / ' + card.cost.totals.outputTokens],
  ].map(([k,v]) => '<div>' + esc(k) + ': <b>' + esc(v) + '</b></div>').join('');

  $('matrix').addEventListener('click', (ev) => {
    const td = ev.target.closest('td[data-cell]'); if (!td) return;
    filter = filter === td.dataset.cell ? null : td.dataset.cell; render();
  });
  $('clear').onclick = () => { filter = null; render(); };
  scrub.addEventListener('input', () => { t = Number(scrub.value); render(); });
  $('back').onclick = () => { t = Math.max(0, t-1); scrub.value = t; render(); };
  $('fwd').onclick = () => { t = Math.min(docs.length-1, t+1); scrub.value = t; render(); };
  $('play').onclick = () => {
    if (timer) { clearInterval(timer); timer = null; $('play').textContent = '▶'; return; }
    if (t >= docs.length-1) t = -1;
    $('play').textContent = '⏸';
    timer = setInterval(() => { if (t >= docs.length-1) { clearInterval(timer); timer=null; $('play').textContent='▶'; return; } t += 1; scrub.value = t; render(); }, 900);
  };
  render();
})();
</script>
</body>
</html>`;
}
