# skein-extractor (SKEIN-E)

Experiment repository for the **SKEIN-E** paper (article 3 of the series): *emergent
concept-scheme discovery for a streaming SKOS registry*. Where SKEIN-R resolves entity identity
inside a fixed set of concept schemes, SKEIN-E discovers the schemes themselves
(`skos:ConceptScheme`, the entity types) and the relation types from the document stream, and
measures whether that inventory converges.

Status (2026-09-17): **spike stage.** The mechanism has been exercised on two 20-document slices
with the cloud stack; there is no full-corpus run, no pre-registration and no reportable number
yet. Everything under `runs/spike/` is exploratory evidence.

## The mechanism in one paragraph

Per document, one **schema-blind** LLM extraction call emits entities with a free-text *kind
phrase* (1–4 words, the model's own wording) and a one-sentence *gloss*, plus relations. The call
never sees the current scheme list. Each mention is embedded as a weighted pair (0.7 kind phrase,
0.3 gloss) and assigned to an existing scheme either kind-first (kind cosine ≥ 0.9 to a scheme's
dominant kinds) or by a kNN vote in which only neighbours above τ may vote; anything else goes to
a **pool**. Pool clusters (average linkage) that span at least three distinct documents get
**one naming call** (verdict `new` or `alias-of`, prefLabel, definition, altLabels). Every step
is prefix-causal: nothing looks past the current document. The headline measurement is schema
convergence ν(t), the rate of newly minted types over the stream, per layer (entity kinds,
relation types) and as a family indexed by the thresholds.

## Finding your way around

- **What is decided, what the spike showed, what is open:** the working page of record lives in
  the dissertation wiki, `~/work/kpi/dissert/wiki/notes/concept-scheme-discovery-design.md`.
- **Every spike number:** [`docs/SPIKE-2026-09-16-emerging-schemes.md`](docs/SPIKE-2026-09-16-emerging-schemes.md).
- **Planned experiments E0–E9 and their status:** [`docs/EXPERIMENT-PLAN.md`](docs/EXPERIMENT-PLAN.md).
- **How to run anything:** [`docs/RUNBOOK.md`](docs/RUNBOOK.md).
- **Look at a run:** read `runs/spike/<run>/README.md` (purpose plus numbers generated from the run
  card), or open the run's viewer in a browser (`scheme-view.html` or `relation-view.html`, self-contained, no server); to read one run against
  another open `runs/spike/scheme-runs.html` or `runs/spike/relation-runs.html` (run switcher); one
  line per run in [`runs/spike/README.md`](runs/spike/README.md).
- **Paper vocabulary versus code vocabulary:** [`docs/TERMINOLOGY-ALIGNMENT.md`](docs/TERMINOLOGY-ALIGNMENT.md).

## Layout

- `bin/spike-schemes.ts` — the streaming scheme-discovery driver (spike-grade, to be promoted into
  `src/SchemeDiscovery/`); `bin/spike-repr.ts` — offline representation study;
  `bin/spike-relcanon.ts` — offline relation-phrase canonicalization study;
  `bin/scheme-view.ts` + `src/SchemeView/` — the emerging-scheme viewer.
- `prompts/` — every LLM instruction, hashed in `manifest.json` (see `prompts/README.md`).
  Article-3 prompts: `extract-open-v1`, `extract-open-icl-v1`, `extract-open-relblind-v1`,
  `scheme-name-v1`.
- `src/`, remaining `bin/` — the inherited SKEIN-R streaming identity pipeline and scorer
  (TypeScript, ts-node, no build step). Kept because experiment E6 feeds the emergent schemes into
  it and because the evaluation, bootstrap, embedding-cache and LLM-client code is shared.
- `data/fetched/` — the frozen corpus (204 CERT-UA reports); `data/extractions/gpt-5/` — the
  frozen fixed-schema extractions (the Arm F mention universe and the hand-category reference);
  `data/obf-extractions/` — the pseudonymized twin; `data/baselines/` — scorer fixtures.
- `gold/` — the frozen SKEIN-R gold table, read-only here (see `gold/README.md`).
- `runs/spike/` — committed spike runs with full LLM transcripts; `runs/embeddings-cache/` is
  git-ignored.
- `analysis/figures.py` — the inherited figure script; its plots are SKEIN-R's, its sizing and
  font contract (3.0 in wide, STIX, no tight bbox, one panel per figure) is the one to reuse.

Quick start: `npm install`, copy `.env.example` to `.env`, fill `GEMINI_API_KEY`, then
`npm run spike-schemes` (see the runbook for slices and arms). `npm run typecheck` and `npm test`
must stay green.

## Provenance

Copy-and-trim fork of [`skein-resolver`](https://github.com/koorchik/skein-resolver) at commit
`23cdfc2`, made 2026-09-16 with a fresh git history. `skein-resolver` is the frozen artifact of
the SKEIN-R paper and is never modified from here; its experiment runs, claims matrix, figures
and experiment browser were not carried over.

Series: (1) V. Turskyi, *A Formal Model for Constructing Sensitive Data Graphs from Cyber Reports
using Large Language Models*, TACS 7(2), 2025, batch pipeline with a hand-written schema;
(2) SKEIN-R, streaming identity and typed hierarchy within fixed concept schemes; (3) SKEIN-E,
this repository, which discovers the schemes and relation types; (4) SKOS roll-up
(`~/work/kpi/skein-skos-rollup`), aggregation along `skos:broader` without an LLM.
