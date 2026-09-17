# Terminology alignment for article 3: project vocabulary → community vocabulary

Purpose: keep the SKEIN-E paper legible to reviewers from the information-extraction,
knowledge-graph, ontology-learning and clustering communities. The code keeps its internal names;
the paper introduces each internal name once, in parentheses after the standard term. The
article-2 alignment (mint = NIL verdict, registry = entity store, blocker = blocking, judge =
LLM-as-judge, and so on) still holds for everything inherited and lives in `skein-resolver`.

Anchors are citekeys of `~/work/kpi/dissert/references/references.bib`. "No anchor yet" means the
wiki has no peer-reviewed source for the term as of 2026-09-17: the paper must not use the term
as a claim until one is ingested (see `dissert/wiki/notes/skein-e-reading-map.md`, gap list).

## 1. What to call the task

> **Streaming schema induction for LLM-based knowledge-graph construction**: open-world
> assignment of extracted entity mentions to an incrementally discovered type inventory, with
> LLM labelling of newly formed clusters, the inventory being published as **SKOS concept
> schemes**; evaluated by the **convergence of the inventory** over the document stream.

"Emergent concept-scheme discovery" is the paper's own name for it (SKEIN-R Def. 7) and needs
the sentence above next to it on first use. Do not present "extract, then cluster into a schema"
as a new composition: Open IE with canonicalization already is that. The contribution is the
streaming operator with a reject option and a mass gate, and the measurement.

## 2. Extraction

| Project term | Community term | Anchor | Paper usage |
|---|---|---|---|
| schema-blind extractor | **schema-free / open extraction**; unconstrained generation followed by structuring | `banko2007openie`, `jiang2024genres`, `li2024simple` | "schema-free extraction (the extractor is *schema-blind*: the current inventory is never in the prompt)" |
| in-context arm (ICL) | **schema-in-prompt / schema-guided extraction** | `finch2026schema` (keeps the schema in the prompt, with success), `zhang2024edc` | name it as the established route; E5 is the comparison against it |
| kind phrase | **free-form entity type** (open-vocabulary typing) | `zhou2023universalner` for the long-tail datapoint (13,020 distinct types); ultra-fine entity typing: no anchor yet | "free-form type phrase (*kind phrase*)" |
| gloss | **gloss / LLM-written definition** | `zhang2024edc` (definitions as the canonicalization signal) | "gloss" is already the community's word |
| frozen stream, Arm F | fixed-mention (oracle-mention) condition | standard in entity linking | "gold-mention condition" is understood; say once that mentions come from the 2025 fixed-schema extraction |
| Arm O | end-to-end condition | standard | — |
| hand categories / hand schema | **manually authored schema** (reference typing) | `turskyi2025formal` | one reference among several, never "ground truth" |

## 3. Assignment, pool, naming

| Project term | Community term | Anchor | Paper usage |
|---|---|---|---|
| scheme | **entity type** realised as `skos:ConceptScheme` | `w3c2009skos`, `iso2011thesauri` | "concept scheme (entity type)" once, then scheme |
| scheme set Σ_t, inventory | **type inventory / induced schema** | `bai2026autoschemakg`, `zhang2024edc` | — |
| assign | **open-world (open-set) classification** by nearest neighbours | kNN with a reject option: no anchor yet; NIL as an explicit outcome: `dong2023reveal` | "kNN assignment with a reject option" |
| only neighbours ≥ τ vote | similarity-thresholded kNN vote | — | describe; no citation needed |
| kind-first | lexical-type shortcut before the vector vote | — | describe |
| pool | **reject set / unassigned buffer**; batch cousin: thresholded clustering with unassignment | `douglas2026prism` | "buffer of unassigned mentions (*pool*)" |
| pool clustering | average-linkage **agglomerative clustering** (UPGMA) at a fixed cutoff | textbook; no anchor needed | — |
| mass gate (≥ 3 documents) | **redundancy-based promotion**; frequency gate | `banko2007openie` (≥ 10 supporting sentences), `finch2026schema` (frequency gate beats LLM revision) | "document-frequency gate" |
| mint (a scheme) | **novel class discovery / cluster creation** | generalized category discovery, stream clustering with cluster creation: no anchor yet | "creation of a new type"; avoid "novel class discovery" as a claim until anchored |
| naming call | **LLM cluster labelling** | `diazrodriguez2026kllmmeans` (LLM summary as the cluster representation), `islam2026clusterrefinement` (coherence check and label grounding) | "one labelling call per promoted cluster" |
| verdict `alias-of` | **redundancy adjudication / cluster merge** | `islam2026clusterrefinement` | — |
| verdict `narrower-than` (relations) | sub-property, `rdfs:subPropertyOf`; relation hierarchy | no anchor yet | — |
| additive re-description | **monotone (append-only) schema evolution** with mappings | `w3c2009skos` mapping properties | keep the Def. 7 wording, gloss it once |
| early-mint absorption | **rich-get-richer / first-cluster bias** of incremental clustering | `gruenheid2014incremental` (greedy insertion degrades) | — |
| streaming assignment to fixed K | the contrasting pole | `lin2026snapkg` (check that the version of record exists before citing) | — |

## 4. Relation layer

| Project term | Community term | Anchor | Paper usage |
|---|---|---|---|
| relation-blind extraction | **Open IE relation phrases** | `banko2007openie` | — |
| relation canonicalization | **relation (predicate) canonicalization** of open KBs | `vashishth2018cesi`, `zhang2024edc` | EDC is the baseline to name for this layer |
| argument signature | **type signature / domain and range; selectional preference** | lineage only: `banko2007openie` (synonymy needs argument types), `vashishth2018cesi` (over-merges from missing type information); dedicated source: no anchor yet | "argument-type signature" |
| soft signature | similarity of argument-type centroids | — | describe |
| over-collapse / fragmentation | under- and over-segmentation of the predicate inventory | `jiang2024genres` (a fixed relation menu forces wrong relations) | — |
| roles derived from relations | role as a derived view of typed relations | `turskyi2025formal` for the enum being replaced | — |

## 5. Evaluation

| Project term | Community term | Anchor | Paper usage |
|---|---|---|---|
| ν(t) | **inventory growth rate; schema convergence**; type–token growth (Heaps-type law), species-accumulation curve | no anchor yet for Heaps' law or richness estimators; nearest measured analogue: `buehler2025agentic` (new items per step, power-law fit on graph topology) | state the prediction only with a source behind it |
| threshold-indexed family | **threshold sweep**, area under the purity–coverage curve | `douglas2026prism`; threshold sensitivity of cluster counts: `islam2026clusterrefinement` | never one hand-picked τ |
| cross-tab vs hand categories | **clustering agreement**: B³, ARI, V-measure, macro/micro/pairwise F1 | `vashishth2018cesi` for macro/micro/pairwise; primary sources for B³, ARI and V-measure are not in the bib yet | — |
| recovery of the hand schema | **schema matching against a reference**; parametric-leakage caveat | `finch2026schema` (gold schemas recalled from memory; embedding matchers disagree with humans), `li2023schema` | match schemes to references with human validation |
| retroactive consistency | agreement between at-ingest and final assignment; the price of prefix-causality | own metric | define formally |
| naming quality | human agreement on cluster labels (κ) | `islam2026clusterrefinement` (κ = 0.82 protocol) | — |
| replicates at temperature 0 | run-to-run nondeterminism of LLM pipelines | `mezzi2025unreliable`, `lairgi2026atom` | — |
| cloud vs open-weight stack | — | `islam2026clusterrefinement` (assignment accuracy by model), `douglas2026prism` (local encoder distilled from LLM labels) | RQ0 continuity with SKEIN-R |

## 6. Words to avoid

- "category" in prompts (pulls the extractor toward NER labels) and "ground truth" for the hand
  schema.
- "novel" for the extract-then-cluster composition; "schema induction" as the contribution.
- "arm" is fine in English text; in Ukrainian text use an established Ukrainian term, never a
  transliterated anglicism.
