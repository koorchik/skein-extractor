# Experiment plan for article 3 (SKEIN-E)

Status as of 2026-09-17. Design decisions and their rationale are in the wiki page of record
(`~/work/kpi/dissert/wiki/notes/concept-scheme-discovery-design.md`); this file tracks what is to
be measured, against what, and how far each item is. Nothing here is pre-registered yet: the
pre-registration file `docs/PREREG-SCHEME.md` is written after the local tests below and before
any full-corpus run.

## Claims the paper may make (and may not)

1. First measured schema-convergence curves ν(t), per layer (entity kinds, relation types), in a
   streaming LLM pipeline, reported as a threshold-indexed family.
2. A streaming assign-or-pool-then-name operator with a document-mass gate that satisfies
   SKEIN-R Def. 7 (prefix-causal, anytime, additive re-description), set against fixed-K
   streaming assignment and fixed-k LLM-named clustering.
3. SKOS concept-scheme output with definitions and mappings.
4. The measured effect of emergent schemes on downstream identity resolution (E6).
5. The measured mention-level cost of putting the scheme list into the extraction prompt (E5).

Not claimed: schema induction as such, extraction followed by clustering as a novel composition,
LLM canonicalization, description-based typing as a representation.

## Two arms

| | Arm F (frozen-anchored) | Arm O (open) |
|---|---|---|
| Mention universe | frozen gpt-5 stream, 204 documents, 4,071 mentions (equals the gold universe) | fresh schema-blind extraction from the raw reports |
| Extra LLM call | one describe-and-relate call per document (kind, gloss, relations for the given mentions) | one open extraction call per document |
| Category reference | the 10 hand categories, exact | projection onto the gold by surface alignment, silver labels for the rest |
| Identity gold (E6) | applies exactly | aligned subset only |
| Isolates | the scheme mechanism with extraction held fixed | mechanism plus extraction variance plus blind spots of the fixed schema |

## Local tests before any full run (agreed 2026-09-16)

| # | Test | Needs | Status |
|---|---|---|---|
| L1 | Relation gold panel: about 10 documents, about 100 triples, ensemble proposes, the author adjudicates; first triple P/R for both relation arms | author time | not started |
| L2 | Relation-type pool, mass gate and naming with `new` / `alias-of` / `narrower-than`, soft argument signature as merge guard, on the cached relation-blind extractions | naming calls only | not started |
| L3 | Second-level gate for long-tail kinds (coarser cutoff on the gloss vector, or parent schemes), on cached extractions | no extraction calls | not started |
| L4 | Open-weight replicate of the mid slice (gemma4 through Ollama, embeddinggemma) | local GPU or Ollama cloud | not started |
| L5 | Freeze the design into the paper's Method section, write `docs/PREREG-SCHEME.md` | L1–L4 | not started |

## Experiments

| # | Question | Metric and baseline | Status |
|---|---|---|---|
| E0a | Category reference for Arm O | Surface alignment to `gold/inventory.json` (exact, case and diacritics fold, transliteration skeleton; no embeddings, so the alignment is not circular); ensemble labels plus expert sample for the rest; share of "none of these" | not built; spike overlay by plain surface match covers 70–75%, Ukrainian case forms are the loss |
| E0b | Relation gold panel | dev: `gold/subsets/dev-software-22.txt`; test: fresh 40-document slice; inventory grown during annotation | not built (L1 is its pilot) |
| E0c | Parametric-leakage probe | Each backbone lists CTI categories with no documents; overlap with the 10 hand categories and with STIX classes bounds what "recovery" can mean | not built |
| E0d | Extraction agreement (Arm O vs frozen stream) | Mention-level P/R with fuzzy surface match; novel and dropped shares by hand category | not built |
| E1 | Which representation clusters into kinds | d′, B³ F1, ARI, V-measure for {name, gloss, name+gloss, kind, kind+gloss} × encoder × dims; pseudonymized twin | spike: `bin/spike-repr.ts` on 20 documents (gloss-only d′ ≤ 0.8; kind+gloss 0.7/0.3 d′ 5.7, pure clusters at cutoff 0.80); full corpus pending |
| E2 | Headline: streaming Ψ_scheme over the 204-document date-ordered stream, both arms | Inventory size and ν(t) per prefix, per layer; final partition B³/ARI/V-measure; hierarchical P/R/F for nested hand categories; unclassified share; naming quality (expert κ on label and definition); retroactive consistency (assignment at ingest vs under the final scheme set); cross-arm ARI. Baselines: fixed hand schema classified by the LLM, offline batch clustering, prompt-side type proposals with string matching (the inherited `StreamingExtractor`), one-scheme and one-scheme-per-mention trivial baselines | spike on two 20-document slices only |
| E3 | Novelty-gate ablations | Mass m ∈ {1, 3, 5, 10}; τ and pool-cutoff sweeps reported as area under the curve; kNN vote vs centroid vs LLM-in-the-loop assignment; margin on/off; kind-first on/off | kind-first and strict vs lenient thresholds tried on one slice each |
| E4 | Order robustness at the scheme layer | Date order, reverse, two seeded shuffles; ARI between final scheme partitions, inventory spread, label stability | not started |
| E5 | Blind vs in-context extraction (primary contrast); seeded with the 10 hand categories vs cold start (sub-arm) | Mention-level recall between arms, ν(t), final inventory, rare-kind recall, naming calls, artifact-level order ARI | spike, mid slice: in-context arm dropped 62 of 358 mentions and the kind "malicious url" |
| E6 | Downstream identity | SKEIN-R identity and review passes fed with (a) emergent schemes, (b) hand categories, (c) one catch-all scheme; pairwise F1, B³, NIL F1, identity calls per document | not started; needs the inherited pipeline (`scripts/run-arm.sh`) |
| E7 | Relation layer | ν_rel(t); cluster metrics of relation types vs the E0b inventory; triple P/R/F1 with fuzzy matching; recovery of the 8 hand relation types; in-context inventory vs post-hoc canonicalization vs pool-and-name | spike, mid slice: in-context over-collapses (9 types, "uses" spans 7 argument signatures), blind fragments (60 phrases, 35–42 types), soft signature removes wrong merges; 2026-09-17 (`docs/SPIKE-2026-09-17-relation-cells.md`): hard argument-type cells starve the mass gate and block merges across split schemes, scheme thresholds do not transfer (τ 0.80 absorbs), typed second call types every statement but repeats labels across cells, a third of the statements differ between any two extraction calls |
| E7b | Roles derived from relations vs the frozen roles | Accuracy, per-role confusion, share of relation-less mentions | not started |
| E8 | Cost | Calls, tokens, USD by stage; naming calls per document over the stream | token counts recorded; both Gemini models unpriced in `config/model-prices.json` |
| E9 | Stack factorial (cloud vs open-weight), 3 replicates, Holm-adjusted | same protocol as E2; statistics code inherited (`src/Evaluation/bootstrap.ts`, `bin/stats.ts`) | not started (L4 is its first point) |

Reporting rules carried over from SKEIN-R: pre-registration before E2, deviations disclosed,
BCa 95% confidence intervals, per-stratum tables, replicates because temperature 0 is not
deterministic, threats to validity (LLM judge, single corpus, gold built with LLM assistance).

## Known problem spots to design for

Long-tail kinds never reach the document mass; early-mint absorption of adjacent kinds;
granularity inside a scheme (malware family, malware, malicious file, file); relation inventory
over-collapse in context and fragmentation when blind; overlay coverage lost to Ukrainian case
forms; hand categories coarser than open kinds; inventory size as a function of the merge
threshold. Details and numbers: the wiki design page and the spike report.

## Code to build (promotion out of the spike)

1. `src/SchemeDiscovery/`: scheme registry with member embeddings, pool, kind-first and kNN
   assignment, mass gate, naming with attempted-set memory, additive mappings and rename history.
2. Extraction in two modes (`--mode open|frozen`), with `prompts/describe-frozen-v1.md` for Arm F;
   streams frozen by `npm run hash-input`.
3. `bin/align-open-to-gold.ts` (E0a), `bin/extraction-agreement.ts` (E0d), `gold/relations-v1.json` (E0b).
4. `src/Evaluation/schemeMetrics.ts`, `relationMetrics.ts`, `bin/evaluate-scheme.ts`; ν(t) through
   the existing `src/Evaluation/streamCurves.ts`.
5. `src/Fold/deriveRoles.ts` with a rule table next to the relation inventory (E7b).
6. Runs under `runs/experiments/s-*` with `metrics.json` keys `scheme.*` and `relations.*`.
