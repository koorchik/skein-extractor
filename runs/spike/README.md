# Spike runs (exploratory, not reportable)

All runs: `gemini-3.7-flash` (extraction and naming, temperature 0), `gemini-embedding-2`
(CLUSTERING, 768 dims), representation 0.7 kind + 0.3 gloss, k = 10, δ = 0.1, mass = 3 documents.
Numbers are from each run's `run-card.json`; interpretation is in
`docs/SPIKE-2026-09-16-emerging-schemes.md`. Open `<run>/scheme-view.html` to browse a run
(regenerate with `npm run scheme-view -- --run <run>`). Each run directory has its own
`README.md` with purpose, configuration, schemes and growth table (`npm run run-readme -- --run <run>`).

| run | documents | differs in | mentions | schemes | pool | relation types | naming calls |
|---|---|---|---|---|---|---|---|
| `2026-09-16-gemini-20` | 1–20 (2019–2020 advisories) | lenient thresholds: τ 0.78, pool link 0.80 | 236 | 9 | 15 | 7 | 9 |
| `2026-09-16-gemini-20-strict` | 1–20 | τ 0.80, pool link 0.85; extractions reused from the run above | 236 | 9 | 31 | 7 | 9 |
| `2026-09-16-gemini-mid20` | 101–120 (2022 CTI reports) | strict thresholds, kNN vote only | 358 | 9 | 22 | 9 | 11 |
| `2026-09-16-gemini-mid20-kindfirst` | 101–120 | kind-first assignment at 0.9; extractions reused from `…-mid20` | 358 | 10 | 22 | 9 | 11 |
| `2026-09-16-gemini-mid20-icl` | 101–120 | in-context arm: scheme list in the extraction prompt (`extract-open-icl-v1`), kind-first 0.9 | 326 | 9 | 16 | 6 | 9 |
| `2026-09-16-gemini-mid20-relblind` | 101–120 | relation-blind arm (`extract-open-relblind-v1`), kind-first 0.9; no viewer file yet | 369 | 11 | 32 | 35 | 13 |

What each run is evidence for:

- `…-20` vs `…-20-strict`: the lenient vote absorbed 17 vendors into Software Product; strict
  thresholds split Software Vendor out at the price of a larger pool. `…-20/repr-study.txt` is the
  representation study (gloss alone does not separate kinds).
- `…-mid20`: on CTI-heavy reports the schemes recover the hand categories (Threat Actor, Domain
  Name, Malware, Country) and add Email Address, IP Address and Vulnerability.
- `…-mid20-kindfirst`: kind-first took 183 of 358 assignments and changed one thing, splitting
  Social Media Platform from Software Product. Adopted as the default configuration.
- `…-mid20-icl`: the scheme list in the prompt suppressed extraction (62 mentions of the blind arm
  missing, the kind "malicious url" gone). Basis for the schema-blind design principle and for E5.
- `…-mid20-relblind`: free relation phrases fragment (60 phrases, 35 types after the 0.85 merge);
  input of `npm run spike-relcanon` and of the planned relation-type pool with naming.

A cost line in a run card covers the last invocation only: runs that reused cached extractions
show naming calls and no extraction calls.

## Relation-layer runs (2026-09-17)

Driver `bin/spike-relations.ts`: entities and schemes are replayed from `2026-09-16-gemini-mid20-relblind`
(read only), the arms differ in how relation statements are produced and typed. Interpretation:
`docs/SPIKE-2026-09-17-relation-cells.md`; side-by-side table: `npm run spike-relcompare -- <runs>`.

| run | differs in | statements | typed | types | cells | naming calls | relation calls |
|---|---|---|---|---|---|---|---|
| `2026-09-17-gemini-mid20-rel-blind-global` | blind phrases, one global cell, τ 0.80, mass 3 (control) | 121 | 89 | 4 | 1 | 4 | 0 |
| `2026-09-17-gemini-mid20-rel-blind-global-tau90` | as above, τ 0.90 | 121 | 71 | 11 | 1 | 13 | 0 |
| `2026-09-17-gemini-mid20-rel-blind-cell` | blind phrases, kNN, pool and naming inside each cell (head scheme → tail scheme), τ 0.80, mass 3 | 121 | 53 | 5 | 4 | 5 | 0 |
| `2026-09-17-gemini-mid20-rel-blind-cell-tau90` | as above, τ 0.90 | 121 | 39 | 6 | 4 | 7 | 0 |
| `2026-09-17-gemini-mid20-rel-blind-cell-tau90-m2` | τ 0.90, mass 2 | 121 | 50 | 10 | 7 | 14 | 0 |
| `2026-09-17-gemini-mid20-rel-blind-cell-final` | τ 0.80, final schemes visible from the first document (not prefix-causal for the scheme layer) | 121 | 53 | 5 | 4 | 5 | 0 |
| `2026-09-17-gemini-mid20-rel-typed-icl` | second call per document (`relate-typed-v1`) with typed entities and the inventory of the document's cells | 123 | 123 | 40 | 20 | 0 | 20 |
| `2026-09-17-gemini-mid20-rel-typed-icl-final` | as above with final schemes (not prefix-causal for the scheme layer) | 135 | 135 | 34 | 24 | 0 | 20 |
