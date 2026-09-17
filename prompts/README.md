# Prompts

Every LLM instruction the code sends. Loaded by `src/Normalization/PromptProvider.ts`; the sha256
of every prompt a run used is written into its run card (for the inherited pipeline it is also
folded into the `runId`).

## Format

Plain text with `{{placeholder}}` variables. `PromptProvider.render()` is strict in both
directions: every placeholder must be supplied and every supplied variable must be used, so a
literal `{{knownSchemes}}` can never reach the model.

`manifest.json` records per prompt its file, byte length, sha256 and placeholders.
`PromptProvider.test.ts` checks the live files against it.

## Editing a prompt

Prompt text is an experimental variable, not an implementation detail.

1. Edit the `.md` file.
2. `npm test` fails: the manifest hash no longer matches. That failure is the feature.
3. Update `sha256` and `bytes` in `manifest.json` deliberately (the values are those reported by
   `prompts.get(id)`).
4. A new prompt file needs a new manifest entry, or the "finds every extracted prompt" test fails.

For an experiment arm that needs different text, add a new prompt id instead of editing: the
baseline text stays pinned and the comparison stays honest. Wording rule for the article-3
extraction prompts: ask "what kind of thing, in your own words", never use the word "category",
and never list the current schemes outside the in-context arm.

## Article-3 prompts (SKEIN-E)

| id | used by | variables | role |
|---|---|---|---|
| `extract-open-v1` | `bin/spike-schemes.ts` (default) | `knownRelationTypes` | Schema-blind, role-free extraction: entities with a kind phrase and a gloss; relations against an in-context relation inventory, new relation types allowed with a definition |
| `extract-open-icl-v1` | `bin/spike-schemes.ts` with `SPIKE_ICL=1` | `knownSchemes`, `knownRelationTypes` | In-context comparison arm of E5: the current scheme list is rendered as KNOWN KINDS |
| `extract-open-relblind-v1` | `bin/spike-schemes.ts` with `SPIKE_REL_BLIND=1` | none | Relation-blind arm of E7: no relation inventory, free verb phrases, canonicalized downstream |
| `scheme-name-v1` | `bin/spike-schemes.ts` (naming call) | `knownSchemes`, `members` | One call per promoted pool cluster: verdict `new` or `alias-of`, prefLabel, definition, altLabels, outliers |

Planned: `describe-frozen-v1` (Arm F: glosses and relations for a given mention list),
`relation-name-v1` (relation-type naming with `new` / `alias-of` / `narrower-than`).

## Inherited SKEIN-R prompts

Kept byte-identical to `skein-resolver` because E6 reruns the identity pipeline and the tests pin
them. Do not edit; do not delete without removing the decision strategy and tests that load them.

| id | used by | note |
|---|---|---|
| `listwise-id-v1` | `ListwiseGraphDecision` when `DECOUPLE=1` | identity pass of the SKEIN-R headline configuration |
| `listwise-skos-v7` | review pass (`REVIEW_PROMPT_ID` default) | hierarchy and review pass of the headline configuration |
| `listwise-skos-v1` … `v6`, `listwise-graph-v2` | `ListwiseGraphDecision` via `LISTWISE_PROMPT_ID` | superseded variants and article-2 ablation arms |
| `listwise-select`, `listwise-select-compact-v1` | `ListwiseMintCandidateDecision` | baseline numbered choice with an explicit new-entity option |
| `comem-select` | `ComemSelectDecision` | article-2 comparison strategy |
| `link-judge` | `StreamingNormalizer` | built-in link / mint / defer judge |
| `repair-judge`, `repair-judge-compact-v1` | `StreamingRepairer` | suspect-component adjudication |
| `extract-streaming`, `type-judge` | `StreamingExtractor`, `SchemaRegistry` | prompt-side type proposals with string matching: the E2 baseline that article 3 argues against |
| `psi-norm-batch` | batch normalization baseline | the published 2025 Ψ_norm prompt |
