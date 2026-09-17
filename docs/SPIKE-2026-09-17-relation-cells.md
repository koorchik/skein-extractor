# Spike 2026-09-17: relation types inside argument-type cells, blind vs typed in-context

Exploratory. One run per configuration, 20 documents, no replicates, no gold: nothing here is
reportable. Numbers are from the run cards under `runs/spike/2026-09-17-gemini-mid20-rel-*`.

Question: should a relation type be discovered inside its argument-type cell (head scheme → tail
scheme), and is that better done blind (free phrases, then kNN, pool and naming per cell) or in
context (a second call that sees the entities' schemes and the relation inventory of the cells
that can occur in the document)?

Setup. Slice: stream positions 101–120. The entity universe and the scheme layer are held fixed
for every arm: mentions, their assignment trail and the 11 schemes are replayed from
`runs/spike/2026-09-16-gemini-mid20-relblind`, so a mention's scheme at document t is what that
run knew at t. Code: `bin/spike-relations.ts` (driver), `src/RelationDiscovery/relationCells.ts`
(cell registry, vote, deferral), `bin/spike-relcompare.ts` (table below). Prompts:
`relation-name-v1` (verdicts new / alias-of / narrower-than, bare predicate as the label),
`relate-typed-v1` (second call, reports `fit`: exact / loose / new).

Arms.

- `blind-global`: statement text "phrase: definition" embedded; phrase-first, kNN vote (k 10,
  neighbours ≥ τ), otherwise pool; average-linkage pool clusters at 0.85 spanning ≥ m documents get
  one naming call. One global cell. Control for what the cells buy.
- `blind-cell`: the same mechanism inside each cell. A statement with an untyped argument stays
  pending and is released by a later document once both arguments have a scheme.
- `typed-icl`: second call per document; type names are registered per cell (exact name, else
  cosine ≥ 0.85 to a type of the cell, else a new type). No naming call, no mass gate.
- `--schemes final` variants: every mention carries its scheme from the end of the source run.
  This emulates a mature scheme layer on a cold-started mid-corpus slice and is NOT prefix-causal
  for the scheme layer.

## Results

| run | schemes | τ | mass | statements | typed | pool | pending | types | cells | types ≤ 2 | purity | naming calls | relation calls |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `…-rel-blind-global` | ingest | 0.80 | 3 | 121 | 89 (73.6%) | 32 | 0 | 4 | 1 | 0.0% | 44.9% | 4 | 0 |
| `…-rel-blind-global-tau90` | ingest | 0.90 | 3 | 121 | 71 (58.7%) | 50 | 0 | 11 | 1 | 0.0% | 70.4% | 13 | 0 |
| `…-rel-blind-cell` | ingest | 0.80 | 3 | 121 | 53 (43.8%) | 48 | 20 | 5 | 4 | 0.0% | 100.0% | 5 | 0 |
| `…-rel-blind-cell-tau90` | ingest | 0.90 | 3 | 121 | 39 (32.2%) | 62 | 20 | 6 | 4 | 0.0% | 100.0% | 7 | 0 |
| `…-rel-blind-cell-tau90-m2` | ingest | 0.90 | 2 | 121 | 50 (41.3%) | 51 | 20 | 10 | 7 | 20.0% | 100.0% | 14 | 0 |
| `…-rel-blind-cell-final` | final | 0.80 | 3 | 121 | 53 (43.8%) | 48 | 20 | 5 | 4 | 0.0% | 100.0% | 5 | 0 |
| `…-rel-typed-icl` | ingest | | | 123 | 123 (100%) | 0 | 0 | 40 | 20 | 67.5% | 94.3% | 0 | 20 |
| `…-rel-typed-icl-final` | final | | | 135 | 135 (100%) | 0 | 0 | 34 | 24 | 55.9% | 100.0% | 0 | 20 |

Purity: share of typed statements that sit in the dominant final cell of their type. It is 100%
by construction in the cell arms and is therefore not a quality score there.

## Findings

1. **The scheme thresholds do not transfer to relation statements.** At τ 0.80 the kNN vote
   absorbs unrelated phrases, globally and inside a cell. Global: `associated-with` (35) took
   uses-tool, impersonates, located-in and targets-country; `downloads` (43) took hosts-payload,
   abuses-service and acts-as-c2-for. Inside Malware Family → Malware Family: `downloads` (18)
   took is-instance-of (0.811), executes (0.822), creates-file (0.855). The minted clusters
   themselves were clean in every run; the damage is done by the vote and by the drain after a
   mint. While a cell holds one type the margin δ protects nothing, since every neighbour above τ
   votes for that type. "phrase: definition" embeddings of statements with the same argument types
   sit in a narrow high band, so τ must be recalibrated per layer (0.90 removed the gross errors;
   `uses` still holds attributed-to and tracks-activity-of).
2. **Cells remove cross-signature merges and starve the mass gate.** The 121 statements spread
   over 24 cells; 6 cells reach 3 documents. With m = 3 the cell arm types 32–44% of the statements
   against 59–74% globally; m = 2 brings 10 types in 7 cells for 14 naming calls. 20 statements
   (16.5%) never leave pending because an argument never gets a scheme (Threat Actor → untyped
   11: impersonates, uses-infrastructure). The long tail of the scheme layer is inherited by the
   relation layer.
3. **Hard cells block correct merges across split schemes.** At τ 0.90 the global arm forms
   `hosts` over Domain Name → Malware Family (7) and Domain Name → Malicious File (3), `downloads`
   over four Malware Family / Malicious File cells, `exploits` over two. The cell arm cannot: the
   source run split Malware Family from Malicious File. Same observation as the exact-signature
   rule of the 2026-09-16 study; the soft signature remains the better guard.
4. **Typed in-context types every statement and re-invents the same label in every cell.** 40
   (cell, label) types but 25 distinct labels, 11 of them in more than one cell (`hosts-file` in 5
   cells, `targets` in 3). The model writes the same phrase again when the type is hidden for the
   pair at hand (16 cross-cell reuses, 10 with final schemes), so the per-cell inventory is mostly
   one coarse vocabulary sliced by signature. No naming step, hence no definitions curated across
   reports and no broader links; 56–68% of the (cell, label) types carry ≤ 2 statements.
5. **The over-collapse of the untyped in-context arm did not reappear.** With final schemes `uses`
   separates into uses-malware (Threat Actor → Malware Family, 25) and uses-infrastructure
   (Threat Actor → Domain Name, 12); `delivers` separates into contains-malware, drops-and-executes,
   drops-file. Cold start costs the causal variant: 50 of 123 statements have an untyped side and
   11 types land in the cell untyped → untyped, which works as a global in-context list.
6. **`fit` is not a usable signal.** exact 65 / new 58 / loose 0 (ingest), 71 / 63 / 1 (final): the
   model does not admit a loose fit.
7. **Statement extraction varies more than typing does.** On (document, head, tail): blind 121 vs
   typed 123 share 77; blind vs typed-final (135) share 78; the two typed runs, same documents and
   entities, share 88. About a third of the statements differ between any two calls. Without the
   relation gold panel (L1) no arm can be called more correct, and any inventory comparison mixes
   typing with extraction variance.
8. **`narrower-than` was never returned** (39 naming calls across the blind runs; verdicts new and
   alias-of only). Inside a cell there is rarely a broader type to attach to; globally the namer
   preferred `new`. The two-level vocabulary needs either a dedicated roll-up pass or candidates
   shown from other cells.
9. **Cost.** Blind: 4–14 naming calls per 20 documents (4–15k input tokens), no second call. Typed:
   20 relation calls, 66–68k input and 14k output tokens, and the relation cache depends on the
   scheme configuration, so scheme threshold sweeps would re-spend it.

## Reading

- Cells as a HARD identity are not supported: they fragment the evidence (finding 2) and inherit
  the accidents of scheme boundaries (finding 3). Cells as a DESCRIPTION of a type (observed
  signature) and as a soft guard are supported by findings 1 and 3.
- The typed second call is the most complete and, with mature schemes, the most readable
  inventory of this spike, at about ten times the token cost of the blind arms and with no
  curated definitions. It is a strong candidate for Arm F, where the mentions are given and the
  cold start does not exist.
- A combined design to test next: blind extraction, global pool with the soft signature in the
  similarity, τ calibrated on relation statements, naming call that returns the bare predicate
  and the observed signature; cells only as `domainIncludes` / `rangeIncludes` annotations.
- Order of work implied: L1 (relation gold panel) before any further arm comparison (finding 7).
