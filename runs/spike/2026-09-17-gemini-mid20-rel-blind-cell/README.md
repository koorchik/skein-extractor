# 2026-09-17-gemini-mid20-rel-blind-cell

Exploratory spike run, not reportable. Relation layer only: entities, schemes and free relation phrases are replayed from `2026-09-16-gemini-mid20-relblind` (stream positions 101–120), so the arms of this family differ in how relation statements are typed.

**Arm.** Blind, per cell: a statement is typed inside its cell (head scheme → tail scheme) by phrase-first and a kNN vote, pooled otherwise; pool clusters spanning 3 documents get one `relation-name-v1` call. Statements with an untyped argument wait until both arguments have a scheme.

<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->

## At a glance

|  |  |
|---|---|
| Arm | `blind-cell` |
| Source scheme run (entities and schemes replayed from it) | `runs/spike/2026-09-16-gemini-mid20-relblind`, 11 schemes |
| Scheme state seen by the relation layer | scheme known at the current document (prefix-causal) |
| Documents | 20 |
| Relation statements (triples) | 121 |
| Typed | 53 (43.8%) |
| Pool (in a cell, no type) | 48 (39.7%) |
| Pending (an argument never got a scheme) | 20 (16.5%) |
| Relation types | 5 in 4 cells, 0 with a broader type |
| Types with at most 2 statements | 0.0% |
| Signature purity (typed statements in the dominant final cell of their type) | 100.0% |
| Naming calls | 5 |

## Configuration

| Setting | Value |
|---|---|
| Model | gemini/gemini-3.7-flash |
| Embedding model | gemini-embedding-2 (CLUSTERING, 768 dims); statement text = "phrase: definition" |
| Assignment | phrase-first, then kNN vote k = 10, τ = 0.8, margin δ = 0.1; inside the cell (head scheme → tail scheme) |
| Pool clustering | average linkage at 0.85, mass gate 3 documents |

Prompts:

- `relation-name-v1` sha256 `4d5a297326c1…`

## Relation types

| cell | id | label | statements | broader | born at document | phrases | definition |
|---|---|---|---|---|---|---|---|
| Domain Name → Malware Family | R3 | hosts | 7 |  | 11 | hosts-file (5), hosts-payload (2) | Specifies that the domain or network infrastructure hosts or serves the malware for download or distribution. |
| Government Agency → Country | R5 | located-in | 6 |  | 18 | located-in (6) | Is geographically, administratively, or physically located within or affiliated with the specified country or jurisdiction. |
| Malware Family → Malware Family | R2 | downloads | 18 |  | 11 | downloads-and-executes (3), creates-and-executes (2), deploys (2), executes (2), creates-file (1), delivers-malware (1), delivers-payload (1), downloads (1), downloads-file (1), drops (1), drops-and-executes (1), executes-file (1), is-instance-of (1) | Specifies that the head malware or file fetches and optionally executes the tail payload or file over a network. |
| Malware Family → Malware Family | R1 | contains | 5 |  | 11 | contains-file (5) | Specifies that the head container, archive, or executable encapsulates or holds the tail component or file. |
| Threat Actor → Malware Family | R4 | uses | 17 |  | 13 | uses-tool (7), associated-with (1), associated-with-activity (1), associated-with-malware (1), attributed-to (1), conducts-activity (1), delivers-payload (1), deploys-malware (1), operates (1), tracks-activity-of (1), tracks-activity-using (1) | Indicates that the threat actor utilizes, deploys, or operates the specified malware family in cyber operations. |

## Assignment decisions

| decision | events |
|---|---|
| pool: no-types | 80 |
| assign: drain | 11 |
| assign: phrase-first | 11 |
| assign: knn | 9 |
| pool: below-tau | 1 |

## Statements without a type

- pending, final cell Threat Actor → (untyped): 11 (impersonates 4, uses-infrastructure 3, conducts 1, conducts-campaign 1, conducts-fraud-on 1, uses-lure 1)
- Malicious File → Malware Family: 8 (contains-payload 2, delivers 1, deploys-malware 1, downloads 1, drops-file 1, is-instance-of 1, …)
- Government Agency → Email Address: 4 (uses-email-address 4)
- Government Agency → Software Product: 4 (deploys-software 4)
- Malicious File → Malicious File: 4 (downloads 2, drops-and-executes 1, drops-file 1)
- pending, final cell Malware Family → (untyped): 4 (downloads-from 1, exfiltrates-data-to 1, exfiltrates-to 1, routes-traffic-through 1)
- Domain Name → Malicious File: 3 (hosts-file 3)
- Malicious File → Vulnerability: 3 (exploits-vulnerability 3)
- Domain Name → URL: 2 (hosts-url 2)
- Government Agency → Government Agency: 2 (is-part-of 1, subordinate-to 1)
- Malware Family → Domain Name: 2 (communicates-with-domain 1, exfiltrates-data-to 1)
- pending, final cell (untyped) → Malware Family: 2 (contains-file 1, obfuscates-file 1)
- Threat Actor → Domain Name: 2 (abuses-service 2)
- Threat Actor → Government Agency: 2 (impersonates 1, impersonates-entity 1)
- URL → Domain Name: 2 (registered-with 2)
- Domain Name → Malware Family: 1 (acts-as-c2-for 1)
- IP Address → Domain Name: 1 (hosted-on-infrastructure-of 1)
- Malicious File → Country: 1 (targets-entities-in 1)
- Malware Family → Malicious File: 1 (downloads-file 1)
- Malware Family → Software Product: 1 (exploits-vulnerability-in 1)
- Malware Family → Vulnerability: 1 (exploits-vulnerability 1)
- pending, final cell (untyped) → (untyped): 1 (spreads-via 1)
- pending, final cell (untyped) → Malicious File: 1 (executes-file 1)
- pending, final cell URL → (untyped): 1 (impersonates 1)
- Software Product → Malware Family: 1 (executes 1)
- Threat Actor → Country: 1 (targets-country 1)
- Threat Actor → Malware Family: 1 (infects-file 1)
- Threat Actor → Threat Actor: 1 (associated-with-group 1)

## Growth over the stream

Typed, pool, pending, types and cells are cumulative.

| # | doc id | title | new statements | typed | pool | pending | types | cells with types | naming calls |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 39962 | Щодо обміну інформацією про кіберзагрози | 9 | 0 | 0 | 9 | 0 | 0 | 0 |
| 2 | 40102 | Кібератака групи APT28 із застосуванням шкідливої… | 4 | 0 | 0 | 13 | 0 | 0 | 0 |
| 3 | 40125 | Масове розповсюдження шкідливої програми JesterSt… | 10 | 0 | 0 | 23 | 0 | 0 | 0 |
| 4 | 40240 | Кібератаки групи UAC-0010 (Armageddon) з використ… | 6 | 0 | 3 | 26 | 0 | 0 | 0 |
| 5 | 40263 | Онлайн-шахрайство з використанням тематики "грошо… | 5 | 0 | 3 | 31 | 0 | 0 | 0 |
| 6 | 40559 | Кібератака на державні організації України з вико… | 5 | 0 | 3 | 36 | 0 | 0 | 0 |
| 7 | 160530 | Масована кібератака на медійні організації Україн… | 5 | 0 | 18 | 26 | 0 | 0 | 0 |
| 8 | 339662 | Кібератака групи UAC-0098 на об'єкти критичної ін… | 5 | 0 | 22 | 27 | 0 | 0 | 0 |
| 9 | 341128 | Кібератака групи APT28 з використанням шкідливої… | 5 | 0 | 36 | 18 | 0 | 0 | 0 |
| 10 | 375404 | Кібератаки груп, асоційованих з Китаєм, у відноше… | 4 | 0 | 40 | 18 | 0 | 0 | 0 |
| 11 | 405538 | Кібератака у відношенні операторів телекомунікаці… | 7 | 19 | 28 | 18 | 3 | 2 | 3 |
| 12 | 619229 | Кібератака UAC-0056 на державні організації Украї… | 4 | 22 | 39 | 8 | 3 | 2 | 0 |
| 13 | 703548 | Атака групи UAC-0056 на державні організації Укра… | 6 | 32 | 35 | 8 | 4 | 3 | 1 |
| 14 | 761668 | Онлайн-шахрайство з використанням тематики "грошо… | 3 | 32 | 35 | 11 | 4 | 3 | 0 |
| 15 | 861292 | Кібератака на державні організації України з вико… | 10 | 34 | 43 | 11 | 4 | 3 | 0 |
| 16 | 955924 | Масове розповсюдження стілерів (Formbook, Snake K… | 7 | 39 | 43 | 13 | 4 | 3 | 0 |
| 17 | 971405 | Кібератаки групи UAC-0010 (Armageddon) з використ… | 7 | 40 | 49 | 13 | 4 | 3 | 0 |
| 18 | 987552 | Онлайн-шахрайство з використанням тематики "допом… | 3 | 44 | 47 | 14 | 5 | 4 | 1 |
| 19 | 1229152 | Кібератаки групи UAC-0010 (Armageddon): шкідливі… | 8 | 51 | 48 | 14 | 5 | 4 | 0 |
| 20 | 1545776 | Онлайн-шахрайство з використанням тематики «грошо… | 8 | 53 | 48 | 20 | 5 | 4 | 0 |

## Cost

Covers the last invocation of the driver only. Entity extraction and scheme naming belong to the source run and are not counted here. USD is not recorded (unpriced: gemini/gemini-3.7-flash, gemini/gemini-embedding-2).

| operator | calls | input tokens | output tokens |
|---|---|---|---|
| embed-relation | 8 | 0 | 0 |
| relation-name | 5 | 5030 | 328 |
| total | 13 | 5030 | 328 |

## Files

- `docs.json`: the document slice in stream order
- `events.jsonl`: every pending, release, pool, assign, mint and alias decision in stream order
- `llm-calls/`: full LLM transcripts, one subdirectory per document that triggered a call
- `per-doc.json`: per-prefix counters (the growth table above)
- `relation-types.json`: final relation types with cell, label, definition, alt labels, broader type, members and history
- `run-card.json`: configuration, source scheme run with hashes, prompt hashes, headline counts, cost; the source of every number here
- `triples.json`: every relation statement with its phrase, cell, final type and assignment trail
