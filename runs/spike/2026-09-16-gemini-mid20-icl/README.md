# 2026-09-16-gemini-mid20-icl

Exploratory spike run, not reportable.

**Purpose.** In-context comparison arm: the current scheme list is placed in the extraction prompt
(`extract-open-icl-v1`), stream positions 101–120, kind-first 0.9.

**Differs from its siblings in:** the extraction prompt. Fresh extraction, so the mention set is not
the one of `…-mid20` and `…-mid20-kindfirst`.

**Evidence for.** The scheme list in the prompt suppressed extraction: 62 mentions of the blind arm
are missing and the kind "malicious url" is gone. Basis for the schema-blind design principle and
for E5. Interpretation: `docs/SPIKE-2026-09-16-emerging-schemes.md`.

<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->

## At a glance

|  |  |
|---|---|
| Documents | 20 (stream positions 101–120, dated 2022-04-29 to 2022-08-30) |
| Mentions | 326 |
| Schemes | 9 |
| Pool (mentions without a scheme at the end) | 16 (4.9%) |
| Relation types | 6 |
| Naming calls | 9 |
| Hand-category overlay coverage | 240 of 326 mentions (73.6%) |

## Configuration

| Setting | Value |
|---|---|
| Extraction and naming model | gemini/gemini-3.7-flash |
| Embedding model | gemini-embedding-2 (CLUSTERING, 768 dims) |
| Extraction prompt | `extract-open-icl-v1` |
| Representation | 0.7 kind + 0.3 gloss |
| Kind-first assignment | kind cosine ≥ 0.9 |
| kNN vote | k = 10, τ = 0.8, margin δ = 0.1 |
| Pool clustering | average linkage at 0.85, mass gate 3 documents |
| Relation-type merge | cosine ≥ 0.85 |

Prompts:

- `extract-open-icl-v1` sha256 `c7a8ef1ae00b…`
- `scheme-name-v1` sha256 `bb1b66dab2ce…`

## Schemes

| id | label | members | born at document (id) | alt labels | definition |
|---|---|---|---|---|---|
| S1 | Email Address | 15 | 3 (40125) | Email, E-mail Address | A unique electronic mail identifier used to send, receive, or route digital messages across networks. |
| S2 | Country | 18 | 3 (40125) | Nation, Sovereign State | A distinct sovereign nation, state, or territorial body with its own government and defined geographical borders. |
| S3 | Threat Actor | 18 | 3 (40125) | Threat Group, Cyber Threat Actor, Hacking Group | An individual or organized group responsible for conducting malicious cyber activities, espionage, or computer network attacks. |
| S4 | Domain Name | 120 | 4 (40240) | Domain, Internet Domain, FQDN | A human-readable string identifying a specific network address or resource within the Domain Name System. |
| S5 | IP Address | 29 | 4 (40240) | IP, Internet Protocol Address | A numerical label assigned to a device or interface connected to a computer network using the Internet Protocol. |
| S6 | Malware Family | 71 | 4 (40240) | Malware, Malicious Software | A malicious software program, variant, or family designed to compromise systems, exfiltrate data, or disrupt computer operations. |
| S7 | Software Vulnerability | 5 | 8 (339662) | Vulnerability, Security Flaw, CVE | A security flaw or weakness in software, hardware, or system architecture that can be exploited by threat actors. |
| S8 | Software Product | 17 | 11 (405538) | Software Application, Software Tool | A legitimate software program, application, operating system, or utility used for computational tasks or system administration. |
| S9 | Government Agency | 17 | 17 (971405) | Government Body, Government Organization, State Agency | An official administrative body, department, ministry, or public institution operating under the authority of a sovereign state or government. |

## Naming verdicts in stream order

- document 3 (40125): `new` S1 Email Address, 6 mentions
- document 3 (40125): `new` S2 Country, 3 mentions
- document 3 (40125): `new` S3 Threat Actor, 3 mentions
- document 4 (40240): `new` S4 Domain Name, 16 mentions
- document 4 (40240): `new` S5 IP Address, 6 mentions
- document 4 (40240): `new` S6 Malware Family, 3 mentions
- document 8 (339662): `new` S7 Software Vulnerability, 4 mentions
- document 11 (405538): `new` S8 Software Product, 3 mentions
- document 17 (971405): `new` S9 Government Agency, 9 mentions

## Assignment decisions

One event per decision; a pooled mention that is assigned later appears twice. `drain` is a pooled mention re-tested after a mint.

| decision | events |
|---|---|
| assign: kind-first | 221 |
| pool: no-schemes | 46 |
| pool: below-tau | 35 |
| assign: knn | 24 |
| assign: drain | 12 |

## What stayed in the pool

16 mentions, 13 distinct kind phrases: central bank (2), payload file (2), software library (2), anonymity network (1), cloud service (1), encryption standard (1), international organization (1), malicious archive (1), media organization (1), military organization (1), military unit (1), online platform (1), url (1).

## Relation types

| type | relations | aliases | born at document | definition |
|---|---|---|---|---|
| uses | 45 | 0 | 1 | Indicates that an organization or actor employs a specific tool, platform, standard, or contact mechanism. |
| delivers | 21 | 0 | 6 | Indicates that a file, program, or channel drops, downloads, or installs a payload. |
| located-in | 14 | 0 | 1 | Specifies the geographical country or territory where an organization or entity is located or based. |
| hosts | 12 | 0 | 6 | Indicates that network infrastructure or a domain stores and serves a file or service. |
| exploits | 5 | 0 | 6 | Indicates that an entity takes advantage of a specific security vulnerability. |
| part-of | 4 | 0 | 1 | Indicates that an entity is a structural component, agency, or division of another entity. |

## Scheme × hand category

Overlay by plain surface match against the frozen gpt-5 stream; the hand categories are a reference, not truth.

- (pool): Software 7, Organization 4, Government Body 2, (unaligned) 2, Infrastructure 1
- Country: (unaligned) 13, Government Body 3, Sector 1, Country 1
- Domain Name: Domain 117, Organization 3
- Email Address: Domain 13, (unaligned) 2
- Government Agency: Government Body 8, (unaligned) 6, Organization 3
- IP Address: (unaligned) 29
- Malware Family: Software 44, (unaligned) 27
- Software Product: Software 8, Organization 5, (unaligned) 3, Domain 1
- Software Vulnerability: Software 5
- Threat Actor: HackerGroup 14, (unaligned) 4

## Closest scheme pairs (centroid cosine)

- Threat Actor / Malware Family: 0.800
- Malware Family / Software Vulnerability: 0.782
- Domain Name / IP Address: 0.774
- Email Address / Domain Name: 0.762
- Email Address / IP Address: 0.756

## Growth over the stream

Schemes, pool and relation types are cumulative.

| # | doc id | date | title | mentions | naming calls | schemes | pool | relation types |
|---|---|---|---|---|---|---|---|---|
| 1 | 39962 | 2022-04-29 | Щодо обміну інформацією про кіберзагрози | 15 | 0 | 0 | 15 | 3 |
| 2 | 40102 | 2022-05-06 | Кібератака групи APT28 із застосуванням шкідливої програми… | 11 | 0 | 0 | 26 | 3 |
| 3 | 40125 | 2022-05-07 | Масове розповсюдження шкідливої програми JesterStealer з ви… | 20 | 3 | 3 | 34 | 3 |
| 4 | 40240 | 2022-05-12 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 18 | 3 | 6 | 15 | 3 |
| 5 | 40263 | 2022-05-14 | Онлайн-шахрайство з використанням тематики "грошової допомо… | 39 | 0 | 6 | 19 | 3 |
| 6 | 40559 | 2022-06-02 | Кібератака на державні організації України з використанням… | 9 | 0 | 6 | 21 | 6 |
| 7 | 160530 | 2022-06-10 | Масована кібератака на медійні організації України з викори… | 18 | 0 | 6 | 22 | 6 |
| 8 | 339662 | 2022-06-20 | Кібератака групи UAC-0098 на об'єкти критичної інфраструкту… | 21 | 1 | 7 | 20 | 6 |
| 9 | 341128 | 2022-06-20 | Кібератака групи APT28 з використанням шкідливої програми C… | 11 | 0 | 7 | 21 | 6 |
| 10 | 375404 | 2022-06-22 | Кібератаки груп, асоційованих з Китаєм, у відношенні російс… | 16 | 0 | 7 | 22 | 6 |
| 11 | 405538 | 2022-06-24 | Кібератака у відношенні операторів телекомунікацій України… | 15 | 1 | 8 | 19 | 6 |
| 12 | 619229 | 2022-07-06 | Кібератака UAC-0056 на державні організації України з викор… | 7 | 0 | 8 | 19 | 6 |
| 13 | 703548 | 2022-07-11 | Атака групи UAC-0056 на державні організації України з вико… | 11 | 0 | 8 | 21 | 6 |
| 14 | 761668 | 2022-07-14 | Онлайн-шахрайство з використанням тематики "грошової компен… | 15 | 0 | 8 | 22 | 6 |
| 15 | 861292 | 2022-07-20 | Кібератака на державні організації України з використанням… | 12 | 0 | 8 | 23 | 6 |
| 16 | 955924 | 2022-07-25 | Масове розповсюдження стілерів (Formbook, Snake Keylogger)… | 11 | 0 | 8 | 23 | 6 |
| 17 | 971405 | 2022-07-26 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 24 | 1 | 9 | 16 | 6 |
| 18 | 987552 | 2022-07-27 | Онлайн-шахрайство з використанням тематики "допомоги від Че… | 7 | 0 | 9 | 16 | 6 |
| 19 | 1229152 | 2022-08-10 | Кібератаки групи UAC-0010 (Armageddon): шкідливі програми G… | 8 | 0 | 9 | 16 | 6 |
| 20 | 1545776 | 2022-08-30 | Онлайн-шахрайство з використанням тематики «грошових виплат… | 38 | 0 | 9 | 16 | 6 |

## Cost

Covers the last invocation of the driver only. USD is not recorded (unpriced: gemini/gemini-3.7-flash, gemini/gemini-embedding-2). Wall clock 207.3 s.

| operator | calls | input tokens | output tokens |
|---|---|---|---|
| extract | 20 | 64181 | 23740 |
| embed-kind | 8 | 0 | 0 |
| embed-gloss | 20 | 0 | 0 |
| embed-relation | 6 | 0 | 0 |
| scheme-name | 9 | 6342 | 580 |
| total | 63 | 70523 | 24320 |

## Files

- `artifacts/`: per-document artifact with schemes, overlay categories and derived roles
- `docs.json`: the document slice in stream order
- `embeddings.json`: one vector per mention, for offline threshold and representation studies
- `events.jsonl`: every pool, assign, mint, alias and relation-type decision in stream order
- `extractions/`: cached raw extraction output per document
- `llm-calls/`: full LLM transcripts, one subdirectory per document that triggered a call
- `mentions.json`: every mention with kind, gloss, final scheme and its assignment trail
- `per-doc.json`: per-prefix counters (the growth table above)
- `relations-inventory.json`: final relation types with definitions, counts and aliases
- `run-card.json`: configuration, prompt hashes, headline counts, overlay, cost; the source of every number here
- `scheme-view.html`: self-contained browser view of the run (`npm run make-view`)
- `schemes.json`: final scheme inventory with members and history
