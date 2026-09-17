# skein-extractor (SKEIN-E): experiment repo for article 3

Emergent concept-scheme discovery and relation-type discovery over the CERT-UA report stream.
Fork of `skein-resolver` (SKEIN-R, article 2). The paper text lives in the dissertation repo
(`~/work/kpi/dissert`), this repo holds code, prompts, runs and the numbers.

## Hard rules

- **Never commit without the author's explicit confirmation. Never add Co-Authored-By or any
  other trailer.**
- **`~/work/kpi/skein-resolver` is frozen** (the SKEIN-R paper artifact). Read it, never edit it.
- `gold/`, `data/fetched/`, `data/extractions/gpt-5/`, `data/obf-extractions/` are frozen inputs.
  Never edit in place; new gold or new extraction streams get new file or directory names.
  `npm run hash-input -- data/extractions/gpt-5` must keep printing `37d57e47…`.
- Runs are committed in full, LLM transcripts included (`runs/**/llm-calls/`). Never delete or
  rewrite a run directory; a changed configuration is a new run directory.
- Never print, log or commit `.env`. Keys: `GEMINI_API_KEY`, `OLLAMA_API_KEY`.
- A prompt is an experimental variable. Editing `prompts/*.md` makes `npm test` fail until
  `prompts/manifest.json` is updated deliberately; for a new arm prefer a new prompt id.
- No reportable number exists before `docs/PREREG-SCHEME.md` is written and committed. Spike
  numbers are exploratory and are labelled so wherever they are quoted.

## Where the truth lives

| What | Where |
|---|---|
| Design decisions, open problems, next steps | `~/work/kpi/dissert/wiki/notes/concept-scheme-discovery-design.md` (page of record) |
| Related work to engage with | `~/work/kpi/dissert/wiki/notes/skein-e-reading-map.md` |
| Spike numbers | `docs/SPIKE-2026-09-16-emerging-schemes.md`, `docs/SPIKE-2026-09-17-relation-cells.md`, `runs/spike/*/run-card.json` |
| Experiment plan E0–E9 and status | `docs/EXPERIMENT-PLAN.md` |
| Commands | `docs/RUNBOOK.md` |
| Paper vocabulary | `docs/TERMINOLOGY-ALIGNMENT.md` |
| Formal anchor | SKEIN-R paper, Def. 7 (Ψ_scheme: prefix-causal, anytime, additive re-description) in `dissert/wiki/raw-papers/my/skein-skos-registry/paper.md` |
| Inherited statistics and gold protocol | `docs/statistical-protocol.md`, `docs/GOLD-TABLE.md`, `gold/README.md` (unchanged SKEIN-R documents, still referenced from code) |

When this repo and the wiki design page disagree on a decision, the wiki page wins; when they
disagree on a number, the run card wins.

## Design decisions that code must respect

1. **Schema-blind extractor.** The extraction prompt never contains the scheme list and never
   uses the word "category". It asks for a kind phrase in the model's own words plus a gloss of
   what the thing is (not what it did in the incident). The in-context variant
   (`extract-open-icl-v1`) exists only as the comparison arm of E5.
2. **No roles in extraction.** Attacker/Target/Neutral are derived from relation types at fold
   time (E7b).
3. **Representation:** cosine = 0.7·cos(kind) + 0.3·cos(gloss), implemented as two unit vectors
   concatenated with weights √0.7 and √0.3 (gemini-embedding-2, taskType CLUSTERING, 768 dims,
   re-normalized). Gloss-only and name+gloss representations do not separate kinds.
4. **Assignment:** kind-first at kind cosine ≥ 0.9 to a scheme's dominant kinds; otherwise kNN
   (k = 10) where only neighbours ≥ τ = 0.80 vote, margin δ = 0.1; otherwise pool.
5. **Novelty gate and naming:** average-linkage pool clustering at 0.85; a cluster spanning ≥ 3
   distinct documents gets one naming call (`scheme-name-v1`: `new` | `alias-of`). A member set
   sent to the namer once is never re-sent.
6. **Prefix-causality:** no step reads past the current document. Scheme merges, splits and
   renames are additive mappings with history, never rewrites of earlier document artifacts.
7. **Thresholds are reported as sweeps,** never as one hand-picked value: inventory size is a
   function of the merge threshold, so ν(t) is a threshold-indexed family.
8. **Two evaluation arms:** Arm F (frozen gpt-5 mention universe plus a describe-and-relate call)
   and Arm O (fresh open extraction). The hand categories are one reference, never truth.
9. **Relations (planned):** same pool, mass gate and naming mechanism with verdicts `new` |
   `alias-of` | `narrower-than`; soft argument signature as the merge guard.

## Code map

- Article-3 code: `bin/spike-schemes.ts` (driver; exports `averageLinkage`, `reprText`),
  `bin/spike-repr.ts`, `bin/spike-relcanon.ts`, `bin/scheme-view.ts`, `src/SchemeView/`,
  `bin/run-readme.ts`, `src/RunReadme/` (per-run `README.md`, generated below its marker),
  `bin/spike-relations.ts`, `bin/spike-relcompare.ts`, `src/RelationDiscovery/` (relation layer
  replayed over a finished scheme run: blind per cell, blind global, typed in-context). Spike
  grade: the promotion target is `src/SchemeDiscovery/` with tests.
- Shared infrastructure used by the spike: `src/LlmClient/`, `src/EmbeddingsClient/` (with
  `EmbeddingCache`), `src/Experiment/CostMeter.ts`, `src/Normalization/PromptProvider.ts`,
  `src/utils/`.
- Inherited SKEIN-R pipeline (needed for E6 and for scoring): `bin/app.ts` with
  `scripts/run-arm.sh`, `src/Normalization/`, `src/DataProcessors/`, `src/Repair/`,
  `src/ConceptRegistry/`, `src/SchemaRegistry/`, `src/Evaluation/` (cluster metrics, bootstrap,
  stream curves), `bin/evaluate.ts`, `bin/stats.ts`, `bin/order-ari.ts`. Do not refactor it for
  taste; change it only when an experiment needs it.
- TypeScript through ts-node, no build step, Node ≥ 22. `npm run typecheck` and `npm test`
  (node:test, 758 tests) must pass before any hand-off.

## Working conventions

- Small local tests before any full 204-document run; extraction outputs are cached per document
  under `<run>/extractions`, so threshold studies cost naming calls only. Copy the cache into a
  new run directory instead of re-extracting.
- Models in use: `gemini-3.7-flash` (extraction, naming, temperature 0), `gemini-embedding-2`;
  planned local replicate: gemma4 through Ollama with `embeddinggemma`. Both Gemini models are
  missing from `config/model-prices.json`: token counts are recorded, USD is not.
- Every new run gets a line in `runs/spike/README.md` (or `runs/experiments/README.md` once
  pre-registered runs start) stating its purpose and what it differs in.
- Figures follow the TACS column contract of `analysis/figures.py`: 3.0 in wide, STIXGeneral,
  saved without `bbox_inches='tight'`, one panel per figure.
- Documentation in this repo is English. Prose that may end up in the paper follows the
  dissertation repo's style audit: no em dashes, no first person, no emphasis italics.
