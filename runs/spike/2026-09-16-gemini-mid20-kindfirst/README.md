# 2026-09-16-gemini-mid20-kindfirst

Exploratory spike run, not reportable.

**Purpose.** Test kind-first assignment (kind cosine ≥ 0.9 to the dominant kinds of a scheme) ahead
of the kNN vote, on stream positions 101–120.

**Differs from its siblings in:** kind-first 0.9. The extractions are copied from
`2026-09-16-gemini-mid20`, so this invocation made naming calls and no extraction calls.

**Evidence for.** Kind-first took 183 of 358 assignments and changed one thing, splitting Social
Media Platform from Software Product. Adopted as the default configuration. Interpretation:
`docs/SPIKE-2026-09-16-emerging-schemes.md`.

<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->

## At a glance

|  |  |
|---|---|
| Documents | 20 (stream positions 101–120, dated 2022-04-29 to 2022-08-30) |
| Mentions | 358 |
| Schemes | 10 |
| Pool (mentions without a scheme at the end) | 22 (6.1%) |
| Relation types | 9 |
| Naming calls | 11 |
| Hand-category overlay coverage | 251 of 358 mentions (70.1%) |

## Configuration

| Setting | Value |
|---|---|
| Extraction and naming model | gemini/gemini-3.7-flash |
| Embedding model | gemini-embedding-2 (CLUSTERING, 768 dims) |
| Extraction prompt | `extract-open-v1` |
| Representation | 0.7 kind + 0.3 gloss |
| Kind-first assignment | kind cosine ≥ 0.9 |
| kNN vote | k = 10, τ = 0.8, margin δ = 0.1 |
| Pool clustering | average linkage at 0.85, mass gate 3 documents |
| Relation-type merge | cosine ≥ 0.85 |

Prompts:

- `extract-open-v1` sha256 `81914196ec31…`
- `scheme-name-v1` sha256 `bb1b66dab2ce…`

## Schemes

| id | label | members | born at document (id) | alt labels | definition |
|---|---|---|---|---|---|
| S1 | Email Address | 15 | 3 (40125) | E-mail Address, Electronic Mail Address | A unique identifier for an electronic mailbox used to send and receive messages over a network. |
| S2 | Threat Actor | 18 | 3 (40125) | Threat Group, Adversary, Hacker Group | An individual or organized group responsible for malicious or espionage activities against computer systems and networks. |
| S3 | Country | 18 | 3 (40125) | Nation, Sovereign State | A distinct territorial body or sovereign state with its own government and defined geographical borders. |
| S4 | Domain Name | 102 | 4 (40240) | Internet Domain, Domain, FQDN | A human-readable identification string used to locate and address systems or resources on the internet. |
| S5 | IP Address | 29 | 4 (40240) | Internet Protocol Address, IP | A unique numerical identifier assigned to a device connected to a computer network using the Internet Protocol. |
| S6 | Malware | 115 | 4 (40240) | Malware Family, Malicious Software | Malicious software programs or variants designed to compromise, damage, or gain unauthorized access to computer systems and data. |
| S7 | Vulnerability | 5 | 8 (339662) | Software Vulnerability, Security Vulnerability, Common Vulnerabilities and Exposures | A flaw or weakness in software or hardware that can be exploited by threat actors to compromise security. |
| S8 | Software Product | 13 | 10 (375404) | Software, Application, Software Application | A computer program, application, or platform designed to perform specific operational or user tasks. |
| S9 | Organization | 18 | 14 (761668) | Institution, Enterprise | A formal group or entity such as a corporation, government agency, financial institution, or non-profit body. |
| S10 | Social Media Platform | 3 | 20 (1545776) | Social Network, Social Media Service, Online Social Network | An online platform or service that facilitates social networking, user interaction, and content sharing over the internet. |

## Naming verdicts in stream order

- document 3 (40125): `new` S1 Email Address, 6 mentions
- document 3 (40125): `new` S2 Threat Actor, 3 mentions
- document 3 (40125): `new` S3 Country, 3 mentions
- document 4 (40240): `new` S4 Domain Name, 15 mentions
- document 4 (40240): `new` S5 IP Address, 6 mentions
- document 4 (40240): `new` S6 Malware, 3 mentions
- document 8 (339662): `new` S7 Vulnerability, 4 mentions
- document 10 (375404): `new` S8 Software Product, 5 mentions
- document 14 (761668): `new` S9 Organization, 3 mentions
- document 17 (971405): `alias-of` S9 Organization, 11 mentions absorbed
- document 20 (1545776): `new` S10 Social Media Platform, 3 mentions

## Assignment decisions

One event per decision; a pooled mention that is assigned later appears twice. `drain` is a pooled mention re-tested after a mint.

| decision | events |
|---|---|
| assign: kind-first | 183 |
| pool: below-tau | 68 |
| assign: knn | 55 |
| pool: no-schemes | 52 |
| assign: drain | 36 |

## What stayed in the pool

22 mentions, 17 distinct kind phrases: international organization (3), phishing campaign (2), software platform (2), target sector (2), cloud hosting provider (1), cloud platform (1), cloud service (1), dynamic link library (1), exploit builder (1), humanitarian organization (1), law (1), military command (1), military unit (1), registry key (1), software library (1), and 2 more kinds.

## Relation types

| type | relations | aliases | born at document | definition |
|---|---|---|---|---|
| uses | 50 | 0 | 2 | Indicates that a threat actor employs a specific malware, tool, or infrastructure. |
| delivers | 41 | 0 | 2 | Indicates that a file, email, or process drops, extracts, or transmits another payload. |
| part-of | 10 | 0 | 1 | Indicates that an entity is a structural division, subunit, or member of another organization. |
| uses-email | 9 | 0 | 1 | Indicates that an organization or individual uses a specific email address as a point of contact. |
| exploits | 6 | 0 | 6 | Indicates that a malicious file, tool, or threat actor leverages a software vulnerability to execute code or gain access. |
| hosted-on | 5 | 0 | 2 | Indicates that an internet resource or domain is hosted or deployed on a specific service platform. |
| targets | 5 | 0 | 2 | Indicates that a threat actor directs malicious activities against a country, sector, or organization. |
| deploys | 4 | 0 | 1 | Indicates that an organization sets up, runs, or operates an instance of a software system or platform. |
| exfiltrates-to | 3 | 0 | 2 | Indicates that a malware transmits stolen data to a remote address or domain. |

## Scheme × hand category

Overlay by plain surface match against the frozen gpt-5 stream; the hand categories are a reference, not truth.

- (pool): Organization 10, (unaligned) 4, Software 3, Domain 2, Sector 2, Government Body 1
- Country: (unaligned) 14, Country 2, Government Body 2
- Domain Name: Domain 100, Organization 2
- Email Address: Domain 13, (unaligned) 2
- IP Address: (unaligned) 29
- Malware: Software 49, (unaligned) 47, Domain 19
- Organization: Government Body 12, (unaligned) 5, Domain 1
- Social Media Platform: Organization 3
- Software Product: Software 8, Organization 2, (unaligned) 2, Infrastructure 1
- Threat Actor: HackerGroup 14, (unaligned) 4
- Vulnerability: Software 5

## Closest scheme pairs (centroid cosine)

- Threat Actor / Malware: 0.816
- Malware / Vulnerability: 0.791
- Domain Name / IP Address: 0.761
- Email Address / IP Address: 0.761
- Domain Name / Malware: 0.760

## Growth over the stream

Schemes, pool and relation types are cumulative.

| # | doc id | date | title | mentions | naming calls | schemes | pool | relation types |
|---|---|---|---|---|---|---|---|---|
| 1 | 39962 | 2022-04-29 | Щодо обміну інформацією про кіберзагрози | 19 | 0 | 0 | 19 | 3 |
| 2 | 40102 | 2022-05-06 | Кібератака групи APT28 із застосуванням шкідливої програми… | 11 | 0 | 0 | 30 | 8 |
| 3 | 40125 | 2022-05-07 | Масове розповсюдження шкідливої програми JesterStealer з ви… | 22 | 3 | 3 | 40 | 8 |
| 4 | 40240 | 2022-05-12 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 27 | 3 | 6 | 40 | 8 |
| 5 | 40263 | 2022-05-14 | Онлайн-шахрайство з використанням тематики "грошової допомо… | 40 | 0 | 6 | 50 | 8 |
| 6 | 40559 | 2022-06-02 | Кібератака на державні організації України з використанням… | 11 | 0 | 6 | 56 | 9 |
| 7 | 160530 | 2022-06-10 | Масована кібератака на медійні організації України з викори… | 18 | 0 | 6 | 57 | 9 |
| 8 | 339662 | 2022-06-20 | Кібератака групи UAC-0098 на об'єкти критичної інфраструкту… | 21 | 1 | 7 | 43 | 9 |
| 9 | 341128 | 2022-06-20 | Кібератака групи APT28 з використанням шкідливої програми C… | 12 | 0 | 7 | 44 | 9 |
| 10 | 375404 | 2022-06-22 | Кібератаки груп, асоційованих з Китаєм, у відношенні російс… | 17 | 1 | 8 | 39 | 9 |
| 11 | 405538 | 2022-06-24 | Кібератака у відношенні операторів телекомунікацій України… | 16 | 0 | 8 | 41 | 9 |
| 12 | 619229 | 2022-07-06 | Кібератака UAC-0056 на державні організації України з викор… | 6 | 0 | 8 | 41 | 9 |
| 13 | 703548 | 2022-07-11 | Атака групи UAC-0056 на державні організації України з вико… | 11 | 0 | 8 | 41 | 9 |
| 14 | 761668 | 2022-07-14 | Онлайн-шахрайство з використанням тематики "грошової компен… | 17 | 1 | 9 | 27 | 9 |
| 15 | 861292 | 2022-07-20 | Кібератака на державні організації України з використанням… | 12 | 0 | 9 | 28 | 9 |
| 16 | 955924 | 2022-07-25 | Масове розповсюдження стілерів (Formbook, Snake Keylogger)… | 15 | 0 | 9 | 29 | 9 |
| 17 | 971405 | 2022-07-26 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 24 | 1 | 9 | 18 | 9 |
| 18 | 987552 | 2022-07-27 | Онлайн-шахрайство з використанням тематики "допомоги від Че… | 8 | 0 | 9 | 19 | 9 |
| 19 | 1229152 | 2022-08-10 | Кібератаки групи UAC-0010 (Armageddon): шкідливі програми G… | 11 | 0 | 9 | 19 | 9 |
| 20 | 1545776 | 2022-08-30 | Онлайн-шахрайство з використанням тематики «грошових виплат… | 40 | 1 | 10 | 22 | 9 |

## Cost

Covers the last invocation of the driver only. No extraction calls: the extractions were read from the cache in `extractions/`. USD is not recorded (unpriced: gemini/gemini-3.7-flash). Wall clock 47.8 s.

| operator | calls | input tokens | output tokens |
|---|---|---|---|
| scheme-name | 11 | 7854 | 695 |
| total | 11 | 7854 | 695 |

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
