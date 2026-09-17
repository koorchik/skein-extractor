# 2026-09-17-gemini-mid20-rel-typed-icl

Exploratory spike run, not reportable. Relation layer only: entities and schemes are replayed from `2026-09-16-gemini-mid20-relblind` (stream positions 101–120), so the arms of this family differ in how relation statements are produced and typed.

**Arm.** Two calls: after the schema-blind entity call and the scheme step, a second call (`relate-typed-v1`) extracts relations with the entities' schemes and the relation inventory of the cells that can occur in the document. Schemes as known at the current document; on this cold-started slice most early entities are untyped.

<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->

## At a glance

|  |  |
|---|---|
| Arm | `typed-icl` |
| Source scheme run (entities and schemes replayed from it) | `runs/spike/2026-09-16-gemini-mid20-relblind`, 11 schemes |
| Scheme state seen by the relation layer | scheme known at the current document (prefix-causal) |
| Documents | 20 |
| Relation statements (triples) | 123 |
| Typed | 123 (100.0%) |
| Pool (in a cell, no type) | 0 (0.0%) |
| Pending (an argument never got a scheme) | 0 (0.0%) |
| Relation types | 40 in 20 cells, 0 with a broader type |
| Types with at most 2 statements | 67.5% |
| Signature purity (typed statements in the dominant final cell of their type) | 94.3% |
| Naming calls | 0 |
| Fit reported by the model | exact 65, new 58 |

## Configuration

| Setting | Value |
|---|---|
| Model | gemini/gemini-3.7-flash |
| Embedding model | gemini-embedding-2 (CLUSTERING, 768 dims); statement text = "phrase: definition" |
| Registration of a type name | exact name inside the cell, else cosine ≥ 0.85 to a type of the cell, else a new type |

Prompts:

- `relate-typed-v1` sha256 `4dc134ecdb1a…`

## Relation types

| cell | id | label | statements | broader | born at document | phrases | definition |
|---|---|---|---|---|---|---|---|
| (untyped) → (untyped) | R6 | hosted-on | 9 |  | 2 | hosted-on (9) | The head domain, infrastructure, or resource is hosted or deployed on the tail platform or hosting service. |
| (untyped) → (untyped) | R1 | operates-instance-of | 4 |  | 1 | operates-instance-of (4) | The head entity hosts, deploys, or manages an instance or node of the software product specified as the tail. |
| (untyped) → (untyped) | R2 | has-contact-email | 4 |  | 1 | has-contact-email (4) | The head entity maintains or uses the tail email address for official communication or incident reporting. |
| (untyped) → (untyped) | R10 | creates | 3 |  | 4 | creates (3) | The head entity generates, extracts, drops, or writes the tail file onto the victim's filesystem. |
| (untyped) → (untyped) | R4 | uses-malware | 2 |  | 2 | uses-malware (2) | The head threat actor utilizes or deploys the tail malware family in their operations. |
| (untyped) → (untyped) | R5 | contains-file | 2 |  | 2 | contains-file (2) | The head archive or container file encloses the tail file. |
| (untyped) → (untyped) | R11 | downloads-and-executes | 2 |  | 4 | downloads-and-executes (2) | The head entity downloads the tail payload from a remote resource and initiates its execution. |
| (untyped) → (untyped) | R16 | exploits-vulnerability | 2 |  | 6 | exploits-vulnerability (2) | The head entity takes advantage of the tail vulnerability to compromise a system. |
| (untyped) → (untyped) | R3 | subordinate-to | 1 |  | 1 | subordinate-to (1) | The head entity is an administrative unit, working body, or subdivision of the tail government body. |
| (untyped) → (untyped) | R7 | exfiltrates-data-to | 1 |  | 3 | exfiltrates-data-to (1) | The head malware transmits stolen information to the tail platform, service, or destination. |
| (untyped) → (untyped) | R8 | routes-traffic-through | 1 |  | 3 | routes-traffic-through (1) | The head malware routes or proxies its network communications through the tail network or proxy service. |
| (untyped) → Country | R15 | targets | 1 |  | 6 | targets (1) | The head entity aims its malicious activity or campaign at the tail country or organization. |
| (untyped) → Domain Name | R14 | registered-with | 2 |  | 5 | registered-with (2) | The head domain or URL is registered through the tail domain registrar. |
| (untyped) → Malware Family | R17 | delivers | 2 |  | 6 | delivers (2) | The head file or process installs, runs, or deploys the tail malware family. |
| Domain Name → (untyped) | R12 | hosts-file | 4 |  | 4 | hosts-file (4) | The head domain or server infrastructure hosts the tail downloadable file or payload. |
| Domain Name → Malicious File | R36 | hosts-file | 1 |  | 15 | hosts-file (1) | The head domain hosts or serves the tail downloadable payload or file. |
| Domain Name → Malware Family | R26 | hosts-file | 5 |  | 9 | hosts-file (5) | The head domain name hosts or serves the tail file or payload. |
| Domain Name → Malware Family | R28 | command-and-control-for | 1 |  | 11 | command-and-control-for (1) | The head domain or network infrastructure serves as a command and control server for the tail malware family. |
| IP Address → (untyped) | R13 | hosted-on | 1 |  | 5 | hosted-on (1) | The head IP address or infrastructure is hosted on or provided by the tail hosting service. |
| IP Address → Malicious File | R22 | hosts-file | 2 |  | 7 | hosts-file (2) | The head IP address hosts or serves the tail malicious file or payload. |
| IP Address → Malware Family | R23 | hosts-file | 5 |  | 7 | hosts-file (5) | The head IP address hosts or serves the tail malicious file or payload. |
| Malicious File → Country | R32 | targets | 1 |  | 15 | targets (1) | The head entity directs malicious activity or campaigns against the tail target entity or country. |
| Malicious File → Malicious File | R20 | downloads-and-executes | 2 |  | 7 | downloads-and-executes (2) |  |
| Malicious File → Malicious File | R29 | executes | 1 |  | 13 | executes (1) | The head malicious file or script runs or launches the tail executable or file on the system. |
| Malicious File → Malicious File | R31 | creates | 1 |  | 15 | creates (1) | The head entity drops, writes, or generates the tail file on the victim's filesystem. |
| Malicious File → Malware Family | R21 | delivers | 14 |  | 7 | delivers (14) |  |
| Malware Family → (untyped) | R33 | obfuscated-with | 1 |  | 15 | obfuscated-with (1) | The head malware executable is protected or obfuscated using the tail software tool. |
| Malware Family → (untyped) | R37 | downloads-payload-from | 1 |  | 16 | downloads-payload-from (1) | The head malware retrieves or fetches its secondary payload from the tail cloud service or remote resource. |
| Malware Family → (untyped) | R38 | exfiltrates-data-via | 1 |  | 16 | exfiltrates-data-via (1) | The head malware transmits or exfiltrates stolen data using the tail messaging platform or service API. |
| Malware Family → Malicious File | R34 | downloads-file | 1 |  | 15 | downloads-file (1) | The head malware program retrieves the tail file from a remote source. |
| Malware Family → Malware Family | R25 | downloads-file | 6 |  | 8 | downloads-file (3), drops-file (2), downloads-and-executes (1) | The head malware family or document requests and retrieves the tail file from a network location. |
| Malware Family → Malware Family | R35 | executes | 4 |  | 15 | executes (4) | The head malware executable launches or runs the tail executable. |
| Malware Family → Malware Family | R27 | contains-file | 2 |  | 11 | contains-file (2) | The head archive or container file contains or embeds the tail file. |
| Malware Family → Malware Family | R40 | is-reimplementation-of | 1 |  | 19 | is-reimplementation-of (1) | The head malware family is a rewritten or newly implemented version in another language of the tail malware family. |
| Malware Family → Vulnerability | R24 | exploits-vulnerability | 2 |  | 8 | exploits-vulnerability (2) | The head malware family or file leverages the tail software vulnerability to achieve execution or compromise. |
| Threat Actor → (untyped) | R39 | uses-phishing-url | 3 |  | 18 | uses-phishing-url (3) | The head threat actor utilizes the tail phishing web address in its malicious operations. |
| Threat Actor → (untyped) | R30 | conducts-campaign | 2 |  | 14 | conducts-campaign (2) | The head threat actor conducts or executes the tail malicious or fraudulent campaign. |
| Threat Actor → (untyped) | R19 | associated-with | 1 |  | 7 | associated-with (1) | The head threat actor is linked or attributed with a certain level of confidence to the tail threat group. |
| Threat Actor → Country | R18 | targets | 3 |  | 7 | targets (3) | The head threat actor directs its malicious campaign or operations against the tail country or organization. |
| Threat Actor → Malware Family | R9 | uses-malware | 21 |  | 4 | uses-malware (21) |  |

## Assignment decisions

| decision | events |
|---|---|
| assign: icl-known | 81 |
| assign: icl-new | 40 |
| assign: icl-alias | 2 |

## Growth over the stream

Typed, pool, pending, types and cells are cumulative.

| # | doc id | title | new statements | typed | pool | pending | types | cells with types | naming calls |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 39962 | Щодо обміну інформацією про кіберзагрози | 9 | 9 | 0 | 0 | 3 | 1 | 0 |
| 2 | 40102 | Кібератака групи APT28 із застосуванням шкідливої… | 3 | 12 | 0 | 0 | 6 | 1 | 0 |
| 3 | 40125 | Масове розповсюдження шкідливої програми JesterSt… | 10 | 22 | 0 | 0 | 8 | 1 | 0 |
| 4 | 40240 | Кібератаки групи UAC-0010 (Armageddon) з використ… | 9 | 31 | 0 | 0 | 12 | 3 | 0 |
| 5 | 40263 | Онлайн-шахрайство з використанням тематики "грошо… | 4 | 35 | 0 | 0 | 14 | 5 | 0 |
| 6 | 40559 | Кібератака на державні організації України з вико… | 6 | 41 | 0 | 0 | 17 | 7 | 0 |
| 7 | 160530 | Масована кібератака на медійні організації Україн… | 9 | 50 | 0 | 0 | 23 | 13 | 0 |
| 8 | 339662 | Кібератака групи UAC-0098 на об'єкти критичної ін… | 9 | 59 | 0 | 0 | 25 | 15 | 0 |
| 9 | 341128 | Кібератака групи APT28 з використанням шкідливої… | 7 | 66 | 0 | 0 | 26 | 16 | 0 |
| 10 | 375404 | Кібератаки груп, асоційованих з Китаєм, у відноше… | 6 | 72 | 0 | 0 | 26 | 16 | 0 |
| 11 | 405538 | Кібератака у відношенні операторів телекомунікаці… | 9 | 81 | 0 | 0 | 28 | 16 | 0 |
| 12 | 619229 | Кібератака UAC-0056 на державні організації Украї… | 4 | 85 | 0 | 0 | 28 | 16 | 0 |
| 13 | 703548 | Атака групи UAC-0056 на державні організації Укра… | 5 | 90 | 0 | 0 | 29 | 16 | 0 |
| 14 | 761668 | Онлайн-шахрайство з використанням тематики "грошо… | 1 | 91 | 0 | 0 | 30 | 16 | 0 |
| 15 | 861292 | Кібератака на державні організації України з вико… | 8 | 99 | 0 | 0 | 36 | 20 | 0 |
| 16 | 955924 | Масове розповсюдження стілерів (Formbook, Snake K… | 10 | 109 | 0 | 0 | 38 | 20 | 0 |
| 17 | 971405 | Кібератаки групи UAC-0010 (Armageddon) з використ… | 1 | 110 | 0 | 0 | 38 | 20 | 0 |
| 18 | 987552 | Онлайн-шахрайство з використанням тематики "допом… | 4 | 114 | 0 | 0 | 39 | 20 | 0 |
| 19 | 1229152 | Кібератаки групи UAC-0010 (Armageddon): шкідливі… | 8 | 122 | 0 | 0 | 40 | 20 | 0 |
| 20 | 1545776 | Онлайн-шахрайство з використанням тематики «грошо… | 1 | 123 | 0 | 0 | 40 | 20 | 0 |

## Cost

Covers the last invocation of the driver only. Entity extraction and scheme naming belong to the source run and are not counted here. USD is not recorded (unpriced: gemini/gemini-3.7-flash, gemini/gemini-embedding-2).

| operator | calls | input tokens | output tokens |
|---|---|---|---|
| relate | 20 | 68163 | 13774 |
| embed-relation | 41 | 0 | 0 |
| total | 61 | 68163 | 13774 |

## Files

- `docs.json`: the document slice in stream order
- `events.jsonl`: every pending, release, pool, assign, mint and alias decision in stream order
- `llm-calls/`: full LLM transcripts, one subdirectory per document that triggered a call
- `per-doc.json`: per-prefix counters (the growth table above)
- `relation-types.json`: final relation types with cell, label, definition, alt labels, broader type, members and history
- `relation-view.html`: self-contained browser view of the run (`npm run make-view`)
- `relations/`: cached output of the second (relation) call per document
- `run-card.json`: configuration, source scheme run with hashes, prompt hashes, headline counts, cost; the source of every number here
- `triples.json`: every relation statement with its phrase, cell, final type and assignment trail
