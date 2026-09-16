import fs from 'fs/promises';
import path from 'path';

/**
 * Emerging-scheme viewer (SKEIN-E spike): ONE self-contained HTML file that replays, document by
 * document, how concept schemes emerged from a spike run (bin/spike-schemes.ts).
 *
 * Same doctrine as src/RunView/runView.ts: no dependencies, no network, light/dark, every string
 * escaped, data embedded as JSON, works from file://. Panels: document stepper with playback;
 * scheme cards (label, definition, alt labels, members with kind + gloss, birth, history); a 2-D
 * PCA map of every mention (computed here, in TypeScript) coloured by scheme or by the frozen hand
 * category; growth curves (|Σ_t|, pool, naming calls, relation types); the current document's
 * entities, relations and derived roles; and a final scheme × hand-category cross-tab.
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
  config: Record<string, unknown>;
  docs: Array<{ id: number; date: string; title: string }>;
  mentions: Array<Mention & { x: number; y: number }>;
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

export async function loadSchemeViewData(runDir: string): Promise<SchemeViewData> {
  const read = async (file: string) => JSON.parse(await fs.readFile(path.join(runDir, file), 'utf8'));
  const mentions: Mention[] = await read('mentions.json');
  const embeddings: Array<{ id: string; v: number[] }> = await read('embeddings.json');
  const byId = new Map(embeddings.map((e) => [e.id, e.v]));
  const coords = pca2(mentions.map((m) => byId.get(m.id)!));
  const events = (await fs.readFile(path.join(runDir, 'events.jsonl'), 'utf8'))
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
  const artifactFiles = (await fs.readdir(path.join(runDir, 'artifacts'))).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  const artifacts = [];
  for (const f of artifactFiles) artifacts.push(await read(path.join('artifacts', f)));
  const schemesFile = await read('schemes.json');
  return {
    runId: path.basename(runDir),
    config: schemesFile.config,
    docs: await read('docs.json'),
    mentions: mentions.map((m, i) => ({ ...m, x: coords[i][0], y: coords[i][1] })),
    schemes: schemesFile.schemes,
    events,
    perDoc: await read('per-doc.json'),
    artifacts,
    relationTypes: await read('relations-inventory.json'),
    runCard: await read('run-card.json'),
  };
}

function esc(s: unknown): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderSchemeViewHtml(data: SchemeViewData): string {
  const payload = JSON.stringify(data).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="data:,">
<title>SKEIN-E emerging schemes — ${esc(data.runId)}</title>
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
  .pos { font-variant-numeric:tabular-nums; color:var(--muted); font-size:12px; }
  main { display:grid; grid-template-columns:300px 1fr 360px; gap:0; }
  @media (max-width:1100px) { main { grid-template-columns:1fr; } }
  nav, aside { padding:10px 12px; font-size:13px; }
  nav { border-right:1px solid var(--line); }
  aside { border-left:1px solid var(--line); }
  section.middle { padding:10px 14px; min-width:0; }
  h2 { font-size:12px; text-transform:uppercase; letter-spacing:.04em; color:var(--muted); margin:12px 0 6px; }
  .card { border:1px solid var(--line); border-radius:8px; padding:6px 8px; margin:6px 0; background:var(--panel); }
  .card.new { box-shadow:0 0 0 2px var(--hl) inset; }
  .card .lbl { font-weight:600; display:flex; align-items:center; gap:6px; }
  .card .def { color:var(--muted); font-size:12px; margin:2px 0 4px; }
  .card .alt { font-size:11px; color:var(--muted); }
  .sw { display:inline-block; width:10px; height:10px; border-radius:50%; border:1px solid rgba(0,0,0,.25); }
  details summary { cursor:pointer; font-size:12px; color:var(--accent); }
  ul.members { list-style:none; padding-left:0; margin:4px 0 0; font-size:12px; max-height:220px; overflow:auto; }
  ul.members li { padding:1px 0; border-top:1px dashed var(--line); }
  ul.members .k { color:var(--muted); }
  svg { width:100%; height:auto; background:var(--panel); border:1px solid var(--line); border-radius:8px; }
  .legend { display:flex; flex-wrap:wrap; gap:4px 12px; font-size:12px; margin:6px 0; }
  .legend span { display:inline-flex; align-items:center; gap:4px; }
  .ev { border-top:1px solid var(--line); padding:3px 0; font-size:12px; overflow-wrap:anywhere; }
  .ev b.mint { color:#1a7f37; } .ev b.alias { color:#8250df; } .ev b.pool { color:#9a6700; } .ev b.assign { color:var(--accent); } .ev b.relation-type-new { color:#bf3989; }
  table { border-collapse:collapse; font-size:12px; margin-top:6px; }
  th, td { border:1px solid var(--line); padding:2px 6px; text-align:right; }
  th:first-child, td:first-child { text-align:left; }
  .role { font-size:11px; border-radius:8px; padding:0 6px; background:var(--hl); margin-left:4px; }
  .rel { font-size:12px; padding:1px 0; }
  .rel .t { color:var(--accent); }
  .muted { color:var(--muted); }
  .tip { position:fixed; pointer-events:none; background:var(--bg); border:1px solid var(--line); border-radius:6px; padding:6px 8px; font-size:12px; max-width:360px; box-shadow:0 4px 14px rgba(0,0,0,.15); display:none; z-index:9; }
</style>
</head>
<body>
<header>
  <h1>SKEIN-E emerging schemes — <code id="runid"></code></h1>
  <div class="sub" id="meta"></div>
  <div class="controls">
    <button id="back" title="one document back">⏮</button>
    <button id="play">▶</button>
    <button id="fwd" title="one document forward">⏭</button>
    <input type="range" id="scrub" min="0" value="0">
    <span class="pos" id="pos"></span>
    <label class="pos">colour: <select id="colour"><option value="scheme">emergent scheme</option><option value="category">frozen hand category</option><option value="kind">extractor kind phrase</option></select></label>
  </div>
  <div class="sub" id="docline"></div>
</header>
<main>
  <nav>
    <h2>Schemes after this document (<span id="nschemes"></span>) · pool <span id="npool"></span></h2>
    <div id="schemes"></div>
  </nav>
  <section class="middle">
    <h2>Mention map (PCA of the combined kind+gloss embedding) — filled = assigned, hollow = pool, ring = current document</h2>
    <svg id="map" viewBox="0 0 800 520"></svg>
    <div class="legend" id="legend"></div>
    <h2>Growth along the stream</h2>
    <svg id="curves" viewBox="0 0 800 220"></svg>
    <h2>Final cross-tab: emergent scheme × frozen hand category (aligned mentions only)</h2>
    <div id="crosstab"></div>
  </section>
  <aside>
    <h2>This document</h2>
    <div id="doc"></div>
    <h2>Events in this document</h2>
    <div id="events"></div>
    <h2>Relation inventory (<span id="nrel"></span>)</h2>
    <div id="rels" class="muted" style="font-size:12px"></div>
  </aside>
</main>
<div class="tip" id="tip"></div>
<script id="data" type="application/json">${payload}</script>
<script>
(function(){
  const D = JSON.parse(document.getElementById('data').textContent);
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const PALETTE = ['#0969da','#cf222e','#1a7f37','#8250df','#bf8700','#0598bc','#e16f24','#6e7781','#a475f9','#3fb950','#d4a72c','#f778ba','#57606a','#0550ae','#a40e26','#116329','#953800','#0a3069','#6639ba','#7d4e00'];
  const docs = D.docs; const docIndexById = new Map(docs.map((d,i)=>[d.id,i]));
  const schemeById = new Map(D.schemes.map(s=>[s.id,s]));
  const catList = [...new Set(D.mentions.map(m=>m.category).filter(Boolean))].sort();
  const kindList = [...new Set(D.mentions.map(m=>m.kind))].sort();
  const colourFor = (key, list) => key==null ? null : PALETTE[list.indexOf(key) % PALETTE.length];

  // state of a mention after document index t (stream position): last assignment with doc <= docs[t].id
  function schemeAt(m, t) {
    if (docIndexById.get(m.doc) > t) return undefined; // not yet seen
    let s = null;
    for (const a of m.assign) if (docIndexById.get(a.doc) <= t) s = a.scheme;
    return s;
  }
  function schemesAt(t) {
    const born = D.schemes.filter(s => docIndexById.get(s.born) <= t);
    const counts = new Map(born.map(s=>[s.id,0]));
    for (const m of D.mentions) { const s = schemeAt(m,t); if (s && counts.has(s)) counts.set(s, counts.get(s)+1); }
    return born.map(s => ({...s, count: counts.get(s.id)}));
  }

  let t = docs.length - 1; let timer = null;
  const scrub = $('scrub'); scrub.max = docs.length - 1; scrub.value = t;
  $('runid').textContent = D.runId;
  const cfg = D.config;
  $('meta').textContent = 'LLM ' + cfg.llmModel + ' · embeddings ' + cfg.embedModel + ' (' + (cfg.embedTaskType||'') + ', ' + cfg.embedDims + ' dims, repr ' + cfg.repr + (cfg.repr==='combo' ? ' α=' + cfg.alpha : '') + ') · τ=' + cfg.tau + ' δ=' + cfg.delta + ' pool-link=' + cfg.poolLink + ' mass=' + cfg.mass + ' docs · ' + D.mentions.length + ' mentions · ' + D.schemes.length + ' schemes final';

  // bounds for the map
  const xs = D.mentions.map(m=>m.x), ys = D.mentions.map(m=>m.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const sx = (x) => 20 + (x - minX) / ((maxX - minX) || 1) * 760;
  const sy = (y) => 20 + (y - minY) / ((maxY - minY) || 1) * 480;

  function render() {
    const doc = docs[t];
    $('pos').textContent = (t+1) + ' / ' + docs.length;
    $('docline').textContent = 'Document ' + doc.id + ' · ' + doc.date + ' · ' + doc.title;
    const current = schemesAt(t);
    const pool = D.mentions.filter(m => schemeAt(m,t) === null).length;
    $('nschemes').textContent = current.length; $('npool').textContent = pool;

    // scheme cards
    $('schemes').innerHTML = current.map((s, i) => {
      const members = D.mentions.filter(m => schemeAt(m,t) === s.id);
      const kinds = new Map(); for (const m of members) kinds.set(m.kind, (kinds.get(m.kind)||0)+1);
      const kindStr = [...kinds.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4).map(([k,n])=>k+'×'+n).join(', ');
      const isNew = s.born === doc.id;
      return '<div class="card' + (isNew?' new':'') + '"><div class="lbl"><span class="sw" style="background:' + colourFor(s.id, D.schemes.map(x=>x.id)) + '"></span>' + esc(s.prefLabel) + ' <span class="muted">(' + members.length + ')</span></div>' +
        '<div class="def">' + esc(s.definition) + '</div>' +
        (s.altLabels.length ? '<div class="alt">alt: ' + esc(s.altLabels.join(' · ')) + '</div>' : '') +
        '<div class="alt">born doc ' + s.born + ' · kinds: ' + esc(kindStr) + '</div>' +
        '<details><summary>members</summary><ul class="members">' + members.map(m => '<li><b>' + esc(m.name) + '</b> <span class="k">[' + esc(m.kind) + ']</span> — ' + esc(m.gloss) + (m.category ? ' <span class="k">· frozen: ' + esc(m.category) + '</span>' : '') + '</li>').join('') + '</ul></details></div>';
    }).join('') || '<div class="muted">no schemes yet — everything is in the pool</div>';

    // map
    const mode = $('colour').value;
    const schemeIds = D.schemes.map(s=>s.id);
    let svg = '';
    for (const m of D.mentions) {
      const s = schemeAt(m,t); if (s === undefined) continue;
      const key = mode==='scheme' ? s : mode==='category' ? m.category : m.kind;
      const list = mode==='scheme' ? schemeIds : mode==='category' ? catList : kindList;
      const c = colourFor(key, list) || '#999';
      const filled = mode==='scheme' ? s !== null : key != null;
      const isCur = m.doc === doc.id;
      svg += '<circle data-id="' + esc(m.id) + '" cx="' + sx(m.x).toFixed(1) + '" cy="' + sy(m.y).toFixed(1) + '" r="' + (isCur?6:4) + '" fill="' + (filled?c:'none') + '" stroke="' + c + '" stroke-width="' + (isCur?2.5:1.2) + '" opacity="0.85"></circle>';
    }
    $('map').innerHTML = svg;
    const legendItems = mode==='scheme' ? current.map(s=>[s.id, s.prefLabel]) : mode==='category' ? catList.map(c=>[c,c]) : kindList.filter(k => D.mentions.some(m => m.kind===k && schemeAt(m,t)!==undefined)).map(k=>[k,k]);
    const legendList = mode==='scheme' ? schemeIds : mode==='category' ? catList : kindList;
    $('legend').innerHTML = legendItems.map(([k,l]) => '<span><span class="sw" style="background:' + colourFor(k, legendList) + '"></span>' + esc(l) + '</span>').join('') + (mode!=='scheme' ? '<span><span class="sw" style="background:#999"></span>unaligned</span>' : '');

    // curves
    const pd = D.perDoc.slice(0, t+1);
    const series = [['schemes','#1a7f37'],['pool','#9a6700'],['relationTypes','#bf3989'],['namingCalls','#8250df']];
    const maxV = Math.max(1, ...pd.flatMap(r => series.map(([k]) => r[k]||0)));
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
        const s = schemeAt(D.mentions.find(m=>m.id===e.id), t);
        return '<div><b>' + esc(e.name) + '</b> <span class="muted">[' + esc(e.kind) + ']</span> → ' + (s ? '<span style="color:' + colourFor(s, schemeIds) + '">' + esc(schemeById.get(s).prefLabel) + '</span>' : '<span class="muted">pool</span>') + rolesHtml(e.role) + (e.category ? ' <span class="muted">· frozen: ' + esc(e.category) + '</span>' : '') + '<div class="muted">' + esc(e.gloss) + '</div></div>';
      }).join('') + '</div><h2>Relations (' + art.relations.length + ')</h2>' + (art.relations.map(r => '<div class="rel">' + esc(r.head) + ' <span class="t">' + esc(r.type) + '</span> ' + esc(r.tail) + '</div>').join('') || '<div class="muted">none</div>');
    } else $('doc').innerHTML = '<div class="muted">extraction failed for this document</div>';

    // events of this doc
    const evs = D.events.filter(e => e.doc === doc.id && e.op !== 'assign' && e.op !== 'pool');
    const assigns = D.events.filter(e => e.doc === doc.id && (e.op === 'assign' || e.op === 'pool'));
    $('events').innerHTML = evs.map(e => '<div class="ev"><b class="' + esc(e.op) + '">' + esc(e.op) + '</b> ' + esc(e.label || e.type || '') + (e.definition ? ' — <span class="muted">' + esc(e.definition) + '</span>' : '') + (e.size ? ' <span class="muted">(' + e.size + ' mentions)</span>' : '') + (e.of ? ' <span class="muted">→ ' + esc(e.of) + '</span>' : '') + '</div>').join('') +
      '<div class="ev muted">' + assigns.filter(e=>e.op==='assign').length + ' assigned by kNN, ' + assigns.filter(e=>e.op==='pool').length + ' pooled (' + assigns.filter(e=>e.op==='pool' && e.why==='below-tau').length + ' below τ, ' + assigns.filter(e=>e.op==='pool' && e.why==='ambiguous').length + ' ambiguous)</div>';

    // relation inventory as of now
    const rt = D.relationTypes.filter(r => docIndexById.get(r.born) <= t);
    $('nrel').textContent = rt.length;
    $('rels').innerHTML = rt.map(r => '<div><b>' + esc(r.name) + '</b> ×' + r.count + (r.aliases.length ? ' <span class="muted">(aliases: ' + esc(r.aliases.join(', ')) + ')</span>' : '') + '<div>' + esc(r.definition) + '</div></div>').join('');
  }

  // cross-tab (final)
  (function(){
    const ct = D.runCard.overlay.crossTab; const cats = catList.concat(['(unaligned)']);
    let h = '<table><tr><th>scheme</th>' + cats.map(c=>'<th>'+esc(c)+'</th>').join('') + '<th>total</th></tr>';
    for (const [s,row] of Object.entries(ct)) { const tot = Object.values(row).reduce((a,b)=>a+b,0); h += '<tr><td>' + esc(s) + '</td>' + cats.map(c=>'<td>'+(row[c]||'')+'</td>').join('') + '<td>' + tot + '</td></tr>'; }
    h += '</table><div class="muted" style="font-size:12px">overlay coverage ' + (D.runCard.overlay.coverage*100).toFixed(0) + '% of mentions aligned by surface to the frozen gpt-5 extraction</div>';
    $('crosstab').innerHTML = h;
  })();

  // tooltip
  const tip = $('tip');
  $('map').addEventListener('mousemove', (ev) => {
    const el = ev.target.closest('circle'); if (!el) { tip.style.display='none'; return; }
    const m = D.mentions.find(x => x.id === el.dataset.id); const s = schemeAt(m, t);
    tip.innerHTML = '<b>' + esc(m.name) + '</b> [' + esc(m.kind) + ']<br>' + esc(m.gloss) + '<br><span class="muted">doc ' + m.doc + ' · ' + (s ? schemeById.get(s).prefLabel : 'pool') + (m.category ? ' · frozen: ' + esc(m.category) : '') + '</span>';
    tip.style.display='block'; tip.style.left = (ev.clientX + 12) + 'px'; tip.style.top = (ev.clientY + 12) + 'px';
  });
  $('map').addEventListener('mouseleave', () => tip.style.display='none');

  scrub.addEventListener('input', () => { t = Number(scrub.value); render(); });
  $('colour').addEventListener('change', render);
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
