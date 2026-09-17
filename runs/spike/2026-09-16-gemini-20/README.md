# 2026-09-16-gemini-20

Exploratory spike run, not reportable.

**Purpose.** First end-to-end exercise of the scheme-discovery mechanism: the first 20 documents of
the stream (2019–2020 advisories), fresh schema-blind extraction, lenient thresholds (τ 0.78, pool
link 0.80), kNN vote only.

**Differs from its siblings in:** the lenient thresholds. `2026-09-16-gemini-20-strict` reuses the
extractions of this run with τ 0.80 and pool link 0.85.

**Evidence for.** The lenient vote absorbed 17 vendors into Software Product. `repr-study.txt` is the
representation study run on this slice: gloss alone does not separate kinds. Interpretation:
`docs/SPIKE-2026-09-16-emerging-schemes.md`.

<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->

## At a glance

|  |  |
|---|---|
| Documents | 20 (stream positions 1–20, dated 2019-06-20 to 2020-07-28) |
| Mentions | 236 |
| Schemes | 9 |
| Pool (mentions without a scheme at the end) | 15 (6.4%) |
| Relation types | 7 |
| Naming calls | 9 |
| Hand-category overlay coverage | 176 of 236 mentions (74.6%) |

## Configuration

| Setting | Value |
|---|---|
| Extraction and naming model | gemini/gemini-3.7-flash |
| Embedding model | gemini-embedding-2 (CLUSTERING, 768 dims) |
| Extraction prompt | `extract-open-v1` |
| Representation | 0.7 kind + 0.3 gloss |
| Kind-first assignment | off |
| kNN vote | k = 10, τ = 0.78, margin δ = 0.1 |
| Pool clustering | average linkage at 0.8, mass gate 3 documents |
| Relation-type merge | cosine ≥ 0.85 |

Prompts:

- `extract-open-v1` sha256 `81914196ec31…`
- `scheme-name-v1` sha256 `bb1b66dab2ce…`

## Schemes

| id | label | members | born at document (id) | alt labels | definition |
|---|---|---|---|---|---|
| S1 | Software Product | 72 | 4 (20) | Software Application, Software Program | A software application, plugin, utility, or platform developed for end users or computing infrastructure. |
| S2 | Security Advisory | 34 | 6 (23) | Security Bulletin, Vulnerability Advisory | An official public notice issued by an organization detailing cybersecurity vulnerabilities, patches, or mitigation recommendations. |
| S3 | Security Vulnerability | 40 | 6 (23) | Vulnerability, Security Flaw, Common Vulnerabilities and Exposures | A flaw or weakness in software, firmware, or hardware that can be exploited to compromise system security. |
| S4 | Operating System | 29 | 6 (23) | OS, Platform | System software that manages computer hardware and software resources and provides common services for computer programs. |
| S5 | Country | 6 | 8 (25) | Nation, Sovereign State | A distinct sovereign nation, state, or recognized territorial entity with defined borders and governance. |
| S6 | Government Agency | 16 | 9 (26) | Government Body, Government Organization, State Agency | An official state department, ministry, or public authority exercising governmental administration and functions. |
| S7 | Malware | 9 | 19 (2659) | Malicious Software, Malware Family, Malicious Payload | Software, scripts, or malicious files designed to compromise, disrupt, damage, or gain unauthorized access to computer systems. |
| S8 | Software Update | 11 | 20 (2660) | Security Patch, Software Patch, Security Update | A software release, patch, or package designed to fix vulnerabilities, address bugs, or update existing programs. |
| S9 | Domain Name | 4 | 20 (2660) | Internet Domain, Domain, FQDN | An identification string defining a realm of administrative autonomy, authority, or control within the internet Domain Name System. |

## Naming verdicts in stream order

- document 4 (20): `new` S1 Software Product, 8 mentions
- document 6 (23): `new` S2 Security Advisory, 16 mentions
- document 6 (23): `new` S3 Security Vulnerability, 12 mentions
- document 6 (23): `new` S4 Operating System, 7 mentions
- document 8 (25): `new` S5 Country, 3 mentions
- document 9 (26): `new` S6 Government Agency, 5 mentions
- document 19 (2659): `new` S7 Malware, 7 mentions
- document 20 (2660): `new` S8 Software Update, 11 mentions
- document 20 (2660): `new` S9 Domain Name, 3 mentions

## Assignment decisions

One event per decision; a pooled mention that is assigned later appears twice. `drain` is a pooled mention re-tested after a mint.

| decision | events |
|---|---|
| assign: knn | 138 |
| pool: below-tau | 63 |
| pool: no-schemes | 35 |
| assign: drain | 11 |

## What stayed in the pool

15 mentions, 12 distinct kind phrases: security patch (4), cybersecurity company (1), educational institution (1), email address (1), higher education institution (1), internet service (1), ip address (1), network protocol (1), non-profit organization (1), online security service (1), online service (1), url (1).

## Relation types

| type | relations | aliases | born at document | definition |
|---|---|---|---|---|
| affects | 57 | 0 | 2 | The subject security flaw or vulnerability impacts or exists within the target software product or system. |
| releases | 30 | 0 | 1 | The subject vendor or organization publishes or issues the object advisory, patch, or software update. |
| mitigates-vulnerability-in | 29 | 0 | 1 | The subject security advisory or patch resolves security vulnerabilities in the target product or system. |
| part-of | 9 | 0 | 4 | The subject entity is a component, sub-product, or constituent part of the target entity. |
| located-in | 7 | 0 | 3 | The subject entity is based, operates, or is geographically situated within the target country or territory. |
| delivers | 2 | 0 | 8 | The subject malware, file, or campaign drops, executes, or installs the target payload or malware. |
| hosts | 1 | 0 | 7 | The subject infrastructure, server, domain, or IP address hosts the target file, resource, or service. |

## Scheme × hand category

Overlay by plain surface match against the frozen gpt-5 stream; the hand categories are a reference, not truth.

- (pool): (unaligned) 6, Organization 5, Domain 3, Software 1
- Country: (unaligned) 4, Country 2
- Domain Name: (unaligned) 2, Domain 2
- Government Agency: Government Body 13, (unaligned) 3
- Malware: Software 9
- Operating System: Software 24, (unaligned) 4, Organization 1
- Security Advisory: Organization 24, (unaligned) 10
- Security Vulnerability: Software 30, (unaligned) 10
- Software Product: Software 35, Organization 26, (unaligned) 10, Device 1
- Software Update: (unaligned) 11

## Closest scheme pairs (centroid cosine)

- Software Product / Operating System: 0.789
- Software Product / Software Update: 0.757
- Software Product / Malware: 0.747
- Security Vulnerability / Malware: 0.745
- Operating System / Malware: 0.731

## Growth over the stream

Schemes, pool and relation types are cumulative.

| # | doc id | date | title | mentions | naming calls | schemes | pool | relation types |
|---|---|---|---|---|---|---|---|---|
| 1 | 16 | 2020-01-17 | Intel, Adobe, Oracle та VMWare опублікували перші, в цьому… | 18 | 0 | 0 | 18 | 2 |
| 2 | 17 | 2020-01-20 | Критичні помилки плагіну WordPress дозволяють зловмисникам… | 7 | 0 | 0 | 25 | 3 |
| 3 | 18 | 2020-01-27 | Безпека вебресурсів та інформаційних систем органів державн… | 5 | 0 | 0 | 30 | 4 |
| 4 | 20 | 2020-02-06 | Коректне налаштування програмного забезпечення MS Office | 5 | 1 | 1 | 22 | 5 |
| 5 | 22 | 2020-02-12 | Cisco випустив патчі для закриття 'CDPwn' | 13 | 0 | 1 | 34 | 5 |
| 6 | 23 | 2020-02-13 | Adobe провела широкомасштабну розробку оновлень безпеки | 19 | 3 | 4 | 11 | 5 |
| 7 | 24 | 2020-02-21 | УВАГА! Спостерігається масова розсилка фішингових листів, я… | 12 | 0 | 4 | 18 | 6 |
| 8 | 25 | 2020-03-24 | Фішингові листи на тему коронавірусу, що приховують у собі… | 12 | 1 | 5 | 23 | 7 |
| 9 | 26 | 2020-04-01 | Звертаємо увагу на використання зловмисниками епідеміологіч… | 4 | 1 | 6 | 21 | 7 |
| 10 | 27 | 2020-04-06 | Вразливість в Zoom для Windows | 3 | 0 | 6 | 21 | 7 |
| 11 | 2492 | 2020-06-08 | Рекомендації з безпеки програмного забезпечення Cisco ASA,… | 17 | 0 | 6 | 21 | 7 |
| 12 | 2496 | 2020-06-05 | Mozilla, VMWare, Apple, Chrome та Cisco випустили оновлення… | 37 | 0 | 6 | 21 | 7 |
| 13 | 2498 | 2020-06-10 | Рекомендації щодо запобігання ризиків з кіберзахисту при ви… | 0 | 0 | 6 | 21 | 7 |
| 14 | 2624 | 2020-01-17 | Перші цьогорічні оновлення безпеки Intel, Adobe, Oracle та… | 18 | 0 | 6 | 21 | 7 |
| 15 | 2625 | 2020-01-15 | Виявлено критичні вразливості операційної системи Windows | 21 | 0 | 6 | 23 | 7 |
| 16 | 2628 | 2020-07-28 | Інформація щодо бази даних реальних ІР-адрес електронних р… | 10 | 0 | 6 | 27 | 7 |
| 17 | 2656 | 2019-09-13 | Угода про наукове та науково-технічне співробітництво | 4 | 0 | 6 | 28 | 7 |
| 18 | 2658 | 2019-09-12 | Підписано Меморандум про взаємодію між (IFES)/IFES Україна… | 4 | 0 | 6 | 29 | 7 |
| 19 | 2659 | 2019-07-30 | Не перевіряйте свої поштові акаунти на фішингових сайтах! | 3 | 1 | 7 | 20 | 7 |
| 20 | 2660 | 2019-06-20 | Нові спроби використання вразливості 2017 року Microsoft Of… | 24 | 2 | 9 | 15 | 7 |

## Cost

Covers the last invocation of the driver only. No extraction calls: the extractions were read from the cache in `extractions/`. USD is not recorded (unpriced: gemini/gemini-3.7-flash). Wall clock 30.9 s.

| operator | calls | input tokens | output tokens |
|---|---|---|---|
| scheme-name | 9 | 6969 | 576 |
| total | 9 | 6969 | 576 |

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
- `repr-study.txt`: output of the representation study (`npm run spike-repr`)
- `run-card.json`: configuration, prompt hashes, headline counts, overlay, cost; the source of every number here
- `scheme-view.html`: self-contained browser view of the run (`npm run scheme-view`)
- `schemes.json`: final scheme inventory with members and history
