# 2026-09-17-gemini-mid20-rel-typed-icl-final

Exploratory spike run, not reportable. Relation layer only: entities and schemes are replayed from `2026-09-16-gemini-mid20-relblind` (stream positions 101–120), so the arms of this family differ in how relation statements are produced and typed.

**Arm.** Two calls, as `…-rel-typed-icl`, with the FINAL schemes of the source run visible from the first document (mature-scheme emulation, not prefix-causal for the scheme layer).

<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->

## At a glance

|  |  |
|---|---|
| Arm | `typed-icl` |
| Source scheme run (entities and schemes replayed from it) | `runs/spike/2026-09-16-gemini-mid20-relblind`, 11 schemes |
| Scheme state seen by the relation layer | final schemes of the source run (mature-scheme emulation, NOT prefix-causal for the scheme layer) |
| Documents | 20 |
| Relation statements (triples) | 135 |
| Typed | 135 (100.0%) |
| Pool (in a cell, no type) | 0 (0.0%) |
| Pending (an argument never got a scheme) | 0 (0.0%) |
| Relation types | 34 in 24 cells, 0 with a broader type |
| Types with at most 2 statements | 55.9% |
| Signature purity (typed statements in the dominant final cell of their type) | 100.0% |
| Naming calls | 0 |
| Fit reported by the model | exact 71, new 63, loose 1 |

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
| (untyped) → Malware Family | R20 | contains-file | 1 |  | 8 | contains-file (1) | An archive or container file encapsulates another specified file or malware component. |
| Domain Name → Malicious File | R7 | hosts-file | 4 |  | 3 | hosts-file (4) | The web resource, server, or domain hosts a malicious or dropper file for download. |
| Domain Name → Malware Family | R8 | hosts-file | 13 |  | 3 | hosts-file (13) | The web resource, server, or domain hosts a malicious or dropper file for download. |
| Government Agency → Email Address | R2 | uses-email-address | 4 |  | 1 | uses-email-address (4) | An organization uses or publishes an email address as its contact or communication point. |
| Government Agency → Software Product | R1 | deploys | 4 |  | 1 | deploys (4) | An organization deploys, installs, or hosts a specific software product or platform instance. |
| IP Address → Domain Name | R11 | hosted-by | 1 |  | 5 | hosted-by (1) | The head entity's infrastructure is hosted or provided by the service provider specified by the tail entity. |
| IP Address → Malicious File | R17 | hosts-file | 2 |  | 7 | hosts-file (2) | The IP address or network resource hosts a downloadable malicious file or malware component. |
| IP Address → Malware Family | R18 | hosts-file | 4 |  | 7 | hosts-file (4) | The IP address or network resource hosts a downloadable malicious file or malware component. |
| Malicious File → Country | R13 | targets | 3 |  | 6 | targets (3) | The malicious file or threat activity is directed against the specified target country, sector, or organization. |
| Malicious File → Malicious File | R23 | executes | 1 |  | 13 | executes (1) | The source file initiates or triggers the execution of the target malicious file. |
| Malicious File → Malicious File | R27 | drops-file | 1 |  | 15 | drops-file (1) | The source file creates or extracts a secondary payload or file onto the target system. |
| Malicious File → Malware Family | R16 | contains-malware | 7 |  | 7 | contains-malware (7) | The malicious file executes, delivers, or represents an instance of the specified malware family. |
| Malicious File → Malware Family | R28 | drops-file | 1 |  | 15 | drops-file (1) | The source file creates or extracts a secondary payload or file onto the target system. |
| Malicious File → Malware Family | R29 | executes | 1 |  | 15 | executes (1) | The source entity triggers or initiates the execution of the target executable or malware component. |
| Malicious File → Vulnerability | R14 | exploits-vulnerability | 4 |  | 6 | exploits-vulnerability (4) | The malicious file or tool leverages the specified vulnerability to execute arbitrary code or compromise a system. |
| Malware Family → (untyped) | R5 | exfiltrates-data-to | 3 |  | 2 | exfiltrates-data-to (3) | The malware transmits stolen or collected data to a target service, domain, or server. |
| Malware Family → (untyped) | R30 | obfuscated-with | 1 |  | 15 | obfuscated-with (1) | The malware or file is protected, packed, or obfuscated using the specified software tool or protector. |
| Malware Family → (untyped) | R32 | downloads-payload-from | 1 |  | 16 | downloads-payload-from (1) | The malware downloads secondary payloads, components, or files from a specified hosting service or platform. |
| Malware Family → Domain Name | R21 | uses-c2-domain | 2 |  | 11 | uses-c2-domain (2) | The malware utilizes the specified domain name as its command and control (C2) server. |
| Malware Family → Domain Name | R6 | exfiltrates-data-to | 1 |  | 2 | exfiltrates-data-to (1) | The malware transmits stolen or collected data to a target service, domain, or server. |
| Malware Family → Malicious File | R31 | downloads | 1 |  | 15 | downloads (1) | The source malware family or executable retrieves a secondary file or payload from a remote resource. |
| Malware Family → Malware Family | R22 | drops-and-executes | 7 |  | 12 | drops-and-executes (6), drops (1) | The source malware creates/drops a secondary malware file on the victim system and initiates its execution. |
| Malware Family → Malware Family | R4 | contains-file | 5 |  | 2 | contains-file (5) | An archive or container file encapsulates another specified file or malware component. |
| Malware Family → Vulnerability | R19 | exploits-vulnerability | 2 |  | 8 | exploits-vulnerability (2) | The malware or malicious file exploits a specific security vulnerability to achieve code execution or payload delivery. |
| Threat Actor → (untyped) | R34 | uses-infrastructure | 3 |  | 18 | uses-infrastructure (3) | The threat actor utilizes a specific URL, domain, or infrastructure to carry out attacks or fraudulent activities. |
| Threat Actor → (untyped) | R24 | conducts-campaign | 2 |  | 14 | conducts-campaign (2) | The threat actor executes or is responsible for a specific campaign or fraudulent scheme. |
| Threat Actor → (untyped) | R25 | leverages-platform | 2 |  | 14 | leverages-platform (2) | The threat actor makes use of a third-party platform or social network to spread lures or conduct fraudulent activity. |
| Threat Actor → Domain Name | R26 | uses-infrastructure | 12 |  | 14 | uses-infrastructure (12) | The threat actor uses or controls the specified network infrastructure or domain name. |
| Threat Actor → Government Agency | R33 | impersonates | 1 |  | 17 | impersonates (1) | The threat actor poses as or masquerades under the identity of a specific organization or entity to conduct social engineering attacks. |
| Threat Actor → Malware Family | R3 | uses-malware | 25 |  | 2 | uses-malware (25) | The threat actor deploys, operates, or is attributed to using a specific malware family. |
| Threat Actor → Threat Actor | R15 | associated-with | 1 |  | 7 | associated-with (1) | The threat actor cluster is linked, attributed to, or affiliated with another threat actor group. |
| URL → (untyped) | R9 | hosted-on | 11 |  | 5 | hosted-on (11) | The head entity is hosted on or located within the platform specified by the tail entity. |
| URL → (untyped) | R10 | impersonates | 2 |  | 5 | impersonates (2) | The head entity falsely portrays or mimics the legitimate organization or brand specified by the tail entity. |
| URL → Domain Name | R12 | registered-through | 2 |  | 5 | registered-through (2) | The head entity is registered using the domain registrar or hosting service specified by the tail entity. |

## Assignment decisions

| decision | events |
|---|---|
| assign: icl-known | 100 |
| assign: icl-new | 34 |
| assign: icl-alias | 1 |

## Growth over the stream

Typed, pool, pending, types and cells are cumulative.

| # | doc id | title | new statements | typed | pool | pending | types | cells with types | naming calls |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 39962 | Щодо обміну інформацією про кіберзагрози | 8 | 8 | 0 | 0 | 2 | 2 | 0 |
| 2 | 40102 | Кібератака групи APT28 із застосуванням шкідливої… | 5 | 13 | 0 | 0 | 6 | 6 | 0 |
| 3 | 40125 | Масове розповсюдження шкідливої програми JesterSt… | 9 | 22 | 0 | 0 | 8 | 8 | 0 |
| 4 | 40240 | Кібератаки групи UAC-0010 (Armageddon) з використ… | 5 | 27 | 0 | 0 | 8 | 8 | 0 |
| 5 | 40263 | Онлайн-шахрайство з використанням тематики "грошо… | 5 | 32 | 0 | 0 | 12 | 11 | 0 |
| 6 | 40559 | Кібератака на державні організації України з вико… | 4 | 36 | 0 | 0 | 14 | 13 | 0 |
| 7 | 160530 | Масована кібератака на медійні організації Україн… | 9 | 45 | 0 | 0 | 18 | 17 | 0 |
| 8 | 339662 | Кібератака групи UAC-0098 на об'єкти критичної ін… | 6 | 51 | 0 | 0 | 20 | 19 | 0 |
| 9 | 341128 | Кібератака групи APT28 з використанням шкідливої… | 6 | 57 | 0 | 0 | 20 | 19 | 0 |
| 10 | 375404 | Кібератаки груп, асоційованих з Китаєм, у відноше… | 3 | 60 | 0 | 0 | 20 | 19 | 0 |
| 11 | 405538 | Кібератака у відношенні операторів телекомунікаці… | 6 | 66 | 0 | 0 | 21 | 19 | 0 |
| 12 | 619229 | Кібератака UAC-0056 на державні організації Украї… | 6 | 72 | 0 | 0 | 22 | 19 | 0 |
| 13 | 703548 | Атака групи UAC-0056 на державні організації Укра… | 5 | 77 | 0 | 0 | 23 | 20 | 0 |
| 14 | 761668 | Онлайн-шахрайство з використанням тематики "грошо… | 13 | 90 | 0 | 0 | 26 | 22 | 0 |
| 15 | 861292 | Кібератака на державні організації України з вико… | 9 | 99 | 0 | 0 | 31 | 23 | 0 |
| 16 | 955924 | Масове розповсюдження стілерів (Formbook, Snake K… | 11 | 110 | 0 | 0 | 32 | 23 | 0 |
| 17 | 971405 | Кібератаки групи UAC-0010 (Armageddon) з використ… | 2 | 112 | 0 | 0 | 33 | 24 | 0 |
| 18 | 987552 | Онлайн-шахрайство з використанням тематики "допом… | 3 | 115 | 0 | 0 | 34 | 24 | 0 |
| 19 | 1229152 | Кібератаки групи UAC-0010 (Armageddon): шкідливі… | 7 | 122 | 0 | 0 | 34 | 24 | 0 |
| 20 | 1545776 | Онлайн-шахрайство з використанням тематики «грошо… | 13 | 135 | 0 | 0 | 34 | 24 | 0 |

## Cost

Covers the last invocation of the driver only. Entity extraction and scheme naming belong to the source run and are not counted here. USD is not recorded (unpriced: gemini/gemini-3.7-flash, gemini/gemini-embedding-2).

| operator | calls | input tokens | output tokens |
|---|---|---|---|
| relate | 20 | 65831 | 14621 |
| embed-relation | 30 | 0 | 0 |
| total | 50 | 65831 | 14621 |

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
