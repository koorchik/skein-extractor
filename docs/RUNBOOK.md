# RUNBOOK: commands for SKEIN-E

Replaces the SKEIN-R `REPRODUCE.md` (the article-2 arms are reproduced from `skein-resolver`, not
from here). Two parts: the article-3 scheme-discovery tools, and the inherited identity pipeline
that experiment E6 reuses.

## Environment

`npm install`; copy `.env.example` to `.env`. The cloud stack needs `GEMINI_API_KEY`; the
open-weight stack needs a local Ollama server (`ollama pull embeddinggemma`, a gemma4 tag) or
`OLLAMA_API_KEY` with `OLLAMA_CLOUD=1`. Checks that cost nothing: `npm run typecheck`,
`npm test`, `npm run hash-input -- data/extractions/gpt-5` (must print `37d57e47…`).

## 1. Scheme discovery (article 3)

### 1.1 Streaming driver

```bash
# first 20 reports of the numeric-id stream, cloud stack, adopted thresholds
SPIKE_TAU=0.8 SPIKE_POOL_LINK=0.85 SPIKE_KIND_FIRST=0.9 \
  npm run spike-schemes -- --out runs/spike/<date>-<label>

# mid-corpus slice: documents 101–120
SPIKE_OFFSET=100 SPIKE_DOCS=20 SPIKE_TAU=0.8 SPIKE_POOL_LINK=0.85 SPIKE_KIND_FIRST=0.9 \
  npm run spike-schemes -- --out runs/spike/<date>-<label>
```

Note that the driver's built-in defaults are the lenient first-run values (τ 0.78, pool link
0.80, kind-first off); the adopted configuration is the explicit one above.

| env | default | meaning |
|---|---|---|
| `SPIKE_DOCS`, `SPIKE_OFFSET` | 20, 0 | slice of the numeric-id stream |
| `SPIKE_INPUT`, `SPIKE_FROZEN` | `data/fetched`, `data/extractions/gpt-5` | reports; frozen stream for the hand-category overlay |
| `SPIKE_LLM_PROVIDER`, `SPIKE_LLM_MODEL` | `gemini`, `gemini-3.7-flash` | extraction and naming model |
| `SPIKE_EMBED_MODEL`, `SPIKE_EMBED_TASK`, `SPIKE_DIMS` | `gemini-embedding-2`, `CLUSTERING`, 768 | encoder |
| `SPIKE_REPR`, `SPIKE_ALPHA` | `combo`, 0.7 | mention representation; α = weight of the kind phrase |
| `SPIKE_KIND_FIRST` | 0 (off) | kind-phrase cosine for direct assignment; adopted value 0.9 |
| `SPIKE_K`, `SPIKE_TAU`, `SPIKE_DELTA` | 10, 0.78, 0.1 | kNN size, voting floor, vote-share margin |
| `SPIKE_POOL_LINK`, `SPIKE_MASS` | 0.80, 3 | pool average-linkage cutoff; documents needed before naming |
| `SPIKE_REL_MERGE` | 0.85 | near-duplicate cutoff for relation types |
| `SPIKE_ICL=1` | off | in-context arm (E5): scheme list rendered into `extract-open-icl-v1` |
| `SPIKE_REL_BLIND=1` | off | relation-blind arm (E7): `extract-open-relblind-v1`, free verb phrases |
| `SPIKE_PURPOSE` | none | one paragraph that seeds the hand-written part of a new `<out>/README.md` |
| `EMBEDDINGS_CACHE` | `runs/embeddings-cache` | shared embedding cache (git-ignored) |

Output directory: `extractions/` (per-document cache of the raw extraction), `artifacts/`,
`mentions.json`, `embeddings.json`, `schemes.json`, `relations-inventory.json`, `events.jsonl`,
`per-doc.json`, `docs.json`, `llm-calls/`, `run-card.json` (configuration, prompt hashes, counts,
hand-category overlay, closest scheme pairs, token cost).

**Re-tuning without LLM extraction calls.** The driver skips extraction for every document whose
file already exists in `<out>/extractions/`. To study thresholds or assignment rules, copy the
`extractions/` directory of an existing run into the new `--out` directory first; only naming
calls are then spent. `…-mid20-kindfirst` was produced this way from `…-mid20`.

### 1.2 Viewer

```bash
npm run scheme-view -- --run runs/spike/<dir>        # writes <dir>/scheme-view.html
```

One self-contained HTML file: document stepper with playback, scheme cards (label, definition,
altLabels, members with glosses, birth document), 2-D embedding map coloured by scheme or by
hand category, ν(t) and inventory curves, per-document triples, scheme × hand-category cross-tab.

### 1.3 Run README

```bash
npm run run-readme -- --run runs/spike/<dir> [--purpose "<one paragraph>"]
npm run run-readme -- --all runs/spike               # every subdirectory with a run-card.json
```

Every run directory carries a `README.md`. The text above the marker line is written by hand
(purpose, what the run differs in, what it is evidence for) and is kept on regeneration; the part
below it (headline counts, configuration, schemes, naming verdicts, assignment decisions, pool
kinds, relation types, cross-tab, growth table, cost, file guide) is rebuilt from `run-card.json`
and the run files, so no number is typed by hand. The driver writes the file at the end of a run;
the command above refreshes it after the generator changes.

### 1.4 Relation layer on top of a finished scheme run

```bash
npm run spike-relations -- --source runs/spike/<scheme run> --arm blind-cell|blind-global|typed-icl \
  [--schemes ingest|final] --out runs/spike/<new dir>
npm run spike-relcompare -- runs/spike/<run A> runs/spike/<run B> ...   # table and statement overlap
```

Entities and schemes are replayed from the source run (read only), so only the relation layer
differs between arms. `blind-*` read the free relation phrases of the source run's extractions
(the source must be a relation-blind run) and spend naming calls only; `typed-icl` spends one
`relate-typed-v1` call per document, cached under `<out>/relations/`. Thresholds: `REL_TAU` (0.80),
`REL_POOL_LINK` (0.85), `REL_MASS` (3), `REL_K` (10), `REL_DELTA` (0.1), `REL_MERGE` (0.85);
`REL_DOCS=N` limits a smoke test to the first N documents. `--schemes final` shows every mention
with its final scheme and is not prefix-causal for the scheme layer. The driver refuses an `--out`
that already holds a run card.

### 1.5 Offline studies (zero LLM calls, embeddings cached)

```bash
# which text representation separates kinds (d′, clustering vs hand categories or vs kind phrases)
npm run spike-repr -- --run runs/spike/<dir> [--dims 768,3072] \
  [--reprs name+gloss,gloss,kind,kind+gloss,name+kind+gloss] [--cutoffs 0.6,0.7,0.8] \
  [--gold hand|kind] [--print kind+gloss@0.8]

# relation-phrase canonicalization with an argument-signature guard (relation-blind runs only)
npm run spike-relcanon -- --run runs/spike/<relblind run> [--cutoff 0.85] [--penalty 0.25]
```

## 2. Inherited identity pipeline (for E6 and for scoring)

All identity arms run through `scripts/run-arm.sh`, which automates the two-phase pre-seed of the
frozen gpt-5 extractions. Replicates of one configuration must use distinct `CONDITION` names
(`…-r1/-r2/-r3`): the condition is folded into the run id, and two runs with the same id resume
each other instead of replicating.

```bash
# cloud stack
CONDITION=<name>-r1 LLM_PROVIDER=gemini LLM_MODEL=gemini-3.7-flash TEMPERATURE=0 \
  EMBEDDINGS_PROVIDER=gemini EMBEDDINGS_MODEL=gemini-embedding-2 scripts/run-arm.sh

# open-weight stack
CONDITION=<name>-r1 LLM_PROVIDER=ollama LLM_MODEL=gemma4:31b OLLAMA_CLOUD=1 \
  OLLAMA_NUM_CTX=65536 scripts/run-arm.sh
```

Scoring is free of LLM calls:

```bash
# test split (reportable)
npm run evaluate -- --gold gold/gold.json --hierarchy-all-splits --exclude-category Domain \
  --run runs/experiments/<dir> [--run …]

# 22-document dev subset (iteration only, never reportable as absolutes)
npm run make-subset -- --list gold/subsets/dev-software-22.txt --from data/fetched \
  --to /tmp/subset-dev-software
npm run evaluate -- --gold gold/gold.json --split dev --allow-dev --category Software \
  --hierarchy-all-splits --run runs/experiments/<dir>
```

Other inherited tools: `npm run stats` (bootstrap CIs and permutation tests per
`docs/statistical-protocol.md`), `npm run order-ari` (cross-order agreement; the pattern E4 will
reuse at the scheme layer), `npm run blocker-bench`, `npm run fold`, `npm run export-skos`,
`npm run view` / `regen-view` (the SKEIN-R run viewer), `scripts/score-runs.py` (writes
`metrics.json` into run directories), `scripts/make-obfuscated.py` (pseudonymized twin),
`scripts/gold-slice.py`.

Not yet built for article 3 (see `docs/EXPERIMENT-PLAN.md`): the Arm F describe-and-relate
extractor, gold alignment for Arm O, scheme-level metrics and ν(t) export, the relation-type pool
with naming, the second-level gate for long-tail kinds.
