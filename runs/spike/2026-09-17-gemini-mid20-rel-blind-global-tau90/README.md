# 2026-09-17-gemini-mid20-rel-blind-global-tau90

Exploratory spike run, not reportable. Relation layer only: entities, schemes and free relation phrases are replayed from `2026-09-16-gemini-mid20-relblind` (stream positions 101–120).

**Arm.** Blind, one global cell, τ 0.90: control for `…-rel-blind-cell-tau90`.

<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->

## At a glance

|  |  |
|---|---|
| Arm | `blind-global` |
| Source scheme run (entities and schemes replayed from it) | `runs/spike/2026-09-16-gemini-mid20-relblind`, 11 schemes |
| Scheme state seen by the relation layer | scheme known at the current document (prefix-causal) |
| Documents | 20 |
| Relation statements (triples) | 121 |
| Typed | 71 (58.7%) |
| Pool (in a cell, no type) | 50 (41.3%) |
| Pending (an argument never got a scheme) | 0 (0.0%) |
| Relation types | 11 in 1 cells, 0 with a broader type |
| Types with at most 2 statements | 0.0% |
| Signature purity (typed statements in the dominant final cell of their type) | 70.4% |
| Naming calls | 13 |

## Configuration

| Setting | Value |
|---|---|
| Model | gemini/gemini-3.7-flash |
| Embedding model | gemini-embedding-2 (CLUSTERING, 768 dims); statement text = "phrase: definition" |
| Assignment | phrase-first, then kNN vote k = 10, τ = 0.9, margin δ = 0.1; one global cell |
| Pool clustering | average linkage at 0.85, mass gate 3 documents |

Prompts:

- `relation-name-v1` sha256 `4d5a297326c1…`

## Relation types

| cell | id | label | statements | broader | born at document | phrases | definition |
|---|---|---|---|---|---|---|---|
| (global) | R6 | uses | 12 |  | 13 | uses-tool (7), associated-with-activity (1), conducts (1), conducts-activity (1), conducts-campaign (1), operates (1) | Specifies that the source entity utilizes, employs, or deploys the target malware, tool, or resource. |
| (global) | R5 | hosts | 10 |  | 11 | hosts-file (8), hosts-payload (2) | Specifies that the source infrastructure or server stores or serves the target file, payload, or resource. |
| (global) | R2 | downloads | 9 |  | 8 | downloads (4), downloads-and-executes (3), downloads-file (2) | Specifies that the source entity retrieves the target file, payload, or resource from a remote location. |
| (global) | R8 | delivers | 8 |  | 15 | delivers-payload (2), deploys (2), deploys-malware (2), delivers (1), delivers-malware (1) | Specifies that the source entity installs, drops, deploys, or delivers the target malware or payload. |
| (global) | R10 | impersonates | 7 |  | 17 | impersonates (6), impersonates-entity (1) | Specifies that the source entity mimics, masquerades as, or falsely claims the identity of the target entity. |
| (global) | R1 | contains | 6 |  | 8 | contains-file (6) | Specifies that the source container or file encapsulates or holds the target file or payload. |
| (global) | R7 | located-in | 6 |  | 14 | located-in (6) | Specifies that the source entity is physically, geographically, or administratively situated within the target location. |
| (global) | R3 | exploits | 4 |  | 9 | exploits-vulnerability (4) | Specifies that the source entity leverages or takes advantage of the target security vulnerability. |
| (global) | R4 | associated-with | 3 |  | 9 | associated-with (1), associated-with-group (1), associated-with-malware (1) | Specifies that the source entity is linked, related, or attributed to the target entity. |
| (global) | R9 | exfiltrates-to | 3 |  | 16 | exfiltrates-data-to (2), exfiltrates-to (1) | Specifies that the source entity transmits stolen data to the target destination, service, or endpoint. |
| (global) | R11 | executes | 3 |  | 17 | executes (3) | Specifies that the source entity runs, launches, or interprets the target code, file, or malware. |

## Assignment decisions

| decision | events |
|---|---|
| pool: below-tau | 56 |
| pool: no-types | 49 |
| assign: phrase-first | 15 |
| assign: knn | 1 |

## Statements without a type

- (global): 50 (deploys-software 4, uses-email-address 4, uses-infrastructure 3, abuses-service 2, contains-payload 2, creates-and-executes 2, …)

## Growth over the stream

Typed, pool, pending, types and cells are cumulative.

| # | doc id | title | new statements | typed | pool | pending | types | cells with types | naming calls |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 39962 | Щодо обміну інформацією про кіберзагрози | 9 | 0 | 9 | 0 | 0 | 0 | 0 |
| 2 | 40102 | Кібератака групи APT28 із застосуванням шкідливої… | 4 | 0 | 13 | 0 | 0 | 0 | 0 |
| 3 | 40125 | Масове розповсюдження шкідливої програми JesterSt… | 10 | 0 | 23 | 0 | 0 | 0 | 0 |
| 4 | 40240 | Кібератаки групи UAC-0010 (Armageddon) з використ… | 6 | 0 | 29 | 0 | 0 | 0 | 0 |
| 5 | 40263 | Онлайн-шахрайство з використанням тематики "грошо… | 5 | 0 | 34 | 0 | 0 | 0 | 0 |
| 6 | 40559 | Кібератака на державні організації України з вико… | 5 | 0 | 39 | 0 | 0 | 0 | 0 |
| 7 | 160530 | Масована кібератака на медійні організації Україн… | 5 | 0 | 44 | 0 | 0 | 0 | 0 |
| 8 | 339662 | Кібератака групи UAC-0098 на об'єкти критичної ін… | 5 | 8 | 41 | 0 | 2 | 1 | 2 |
| 9 | 341128 | Кібератака групи APT28 з використанням шкідливої… | 5 | 16 | 38 | 0 | 4 | 1 | 2 |
| 10 | 375404 | Кібератаки груп, асоційованих з Китаєм, у відноше… | 4 | 16 | 42 | 0 | 4 | 1 | 0 |
| 11 | 405538 | Кібератака у відношенні операторів телекомунікаці… | 7 | 29 | 36 | 0 | 5 | 1 | 1 |
| 12 | 619229 | Кібератака UAC-0056 на державні організації Украї… | 4 | 29 | 40 | 0 | 5 | 1 | 0 |
| 13 | 703548 | Атака групи UAC-0056 на державні організації Укра… | 6 | 32 | 43 | 0 | 6 | 1 | 1 |
| 14 | 761668 | Онлайн-шахрайство з використанням тематики "грошо… | 3 | 36 | 42 | 0 | 7 | 1 | 1 |
| 15 | 861292 | Кібератака на державні організації України з вико… | 10 | 40 | 48 | 0 | 8 | 1 | 1 |
| 16 | 955924 | Масове розповсюдження стілерів (Formbook, Snake K… | 7 | 45 | 50 | 0 | 9 | 1 | 1 |
| 17 | 971405 | Кібератаки групи UAC-0010 (Armageddon) з використ… | 7 | 56 | 46 | 0 | 11 | 1 | 3 |
| 18 | 987552 | Онлайн-шахрайство з використанням тематики "допом… | 3 | 56 | 49 | 0 | 11 | 1 | 0 |
| 19 | 1229152 | Кібератаки групи UAC-0010 (Armageddon): шкідливі… | 8 | 65 | 48 | 0 | 11 | 1 | 1 |
| 20 | 1545776 | Онлайн-шахрайство з використанням тематики «грошо… | 8 | 71 | 50 | 0 | 11 | 1 | 0 |

## Cost

Covers the last invocation of the driver only. Entity extraction and scheme naming belong to the source run and are not counted here. USD is not recorded (unpriced: gemini/gemini-3.7-flash).

| operator | calls | input tokens | output tokens |
|---|---|---|---|
| relation-name | 13 | 15277 | 814 |
| total | 13 | 15277 | 814 |

## Files

- `docs.json`: the document slice in stream order
- `events.jsonl`: every pending, release, pool, assign, mint and alias decision in stream order
- `llm-calls/`: full LLM transcripts, one subdirectory per document that triggered a call
- `per-doc.json`: per-prefix counters (the growth table above)
- `relation-types.json`: final relation types with cell, label, definition, alt labels, broader type, members and history
- `run-card.json`: configuration, source scheme run with hashes, prompt hashes, headline counts, cost; the source of every number here
- `triples.json`: every relation statement with its phrase, cell, final type and assignment trail
