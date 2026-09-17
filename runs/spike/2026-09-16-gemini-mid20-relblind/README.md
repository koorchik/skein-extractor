# 2026-09-16-gemini-mid20-relblind

Exploratory spike run, not reportable.

**Purpose.** Relation-blind arm: the extraction prompt (`extract-open-relblind-v1`) carries no
relation inventory, relation phrases are free text merged at cosine 0.85. Stream positions 101–120,
kind-first 0.9.

**Differs from its siblings in:** the extraction prompt (fresh extraction). No `scheme-view.html`
has been generated for this run yet.

**Evidence for.** Free relation phrases fragment: 60 phrases, 35 types after the 0.85 merge. Input of
`npm run spike-relcanon` and of the planned relation-type pool with naming (L2, E7). Interpretation:
`docs/SPIKE-2026-09-16-emerging-schemes.md`.

<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->

## At a glance

|  |  |
|---|---|
| Documents | 20 (stream positions 101–120, dated 2022-04-29 to 2022-08-30) |
| Mentions | 369 |
| Schemes | 11 |
| Pool (mentions without a scheme at the end) | 32 (8.7%) |
| Relation types | 35 |
| Naming calls | 13 |
| Hand-category overlay coverage | 259 of 369 mentions (70.2%) |

## Configuration

| Setting | Value |
|---|---|
| Extraction and naming model | gemini/gemini-3.7-flash |
| Embedding model | gemini-embedding-2 (CLUSTERING, 768 dims) |
| Extraction prompt | `extract-open-relblind-v1` |
| Representation | 0.7 kind + 0.3 gloss |
| Kind-first assignment | kind cosine ≥ 0.9 |
| kNN vote | k = 10, τ = 0.8, margin δ = 0.1 |
| Pool clustering | average linkage at 0.85, mass gate 3 documents |
| Relation-type merge | cosine ≥ 0.85 |

Prompts:

- `extract-open-relblind-v1` sha256 `23d45dcac0f7…`
- `scheme-name-v1` sha256 `bb1b66dab2ce…`

## Schemes

| id | label | members | born at document (id) | alt labels | definition |
|---|---|---|---|---|---|
| S1 | Email Address | 15 | 3 (40125) | E-mail Address, Email | An electronic mail address used for communication, contact, or observed in cyber threat activity. |
| S2 | Domain Name | 114 | 4 (40240) | Internet Domain, FQDN | An internet domain name or subdomain used for network communication, hosting services, or cyber threat infrastructure. |
| S3 | IP Address | 29 | 4 (40240) | Internet Protocol Address, IPv4 Address | A numerical label assigned to a device connected to a computer network, used for routing, hosting, or threat infrastructure. |
| S4 | Country | 18 | 4 (40240) | Nation, Sovereign State | A sovereign state or recognized nation involved as a threat origin, target location, or geopolitical context in cyber incident reporting. |
| S5 | Malware Family | 73 | 4 (40240) | Malware, Malicious Software | A distinct family, variant, or strain of malicious software designed to disrupt, compromise, or extract data from computer systems. |
| S6 | Threat Actor | 18 | 4 (40240) | Threat Group, Adversary, Hacker Group | An individual, group, or organization responsible for initiating or conducting malicious cyber operations. |
| S7 | Malicious File | 26 | 7 (160530) | Malicious Document, Malicious Artifact, Payload File | A computer file, document, or script used, delivered, or generated as part of malicious cyber activity. |
| S8 | Vulnerability | 5 | 8 (339662) | Software Vulnerability, Security Vulnerability, CVE | A security flaw or weakness in software, hardware, or system components that can be exploited by threat actors. |
| S9 | Software Product | 4 | 10 (375404) | Software, Software Application, Software Tool | A computer program, application, or software platform used for operational, administrative, security, or general computing purposes. |
| S10 | Government Agency | 17 | 12 (619229) | Government Body, State Agency, Public Institution | An official state department, ministry, agency, or public institution involved in governance, national defense, regulation, or public administration. |
| S11 | URL | 18 | 15 (861292) | Uniform Resource Locator, Web Address | A web address or resource identifier specifying the network location and protocol used to access online content or infrastructure. |

## Naming verdicts in stream order

- document 3 (40125): `new` S1 Email Address, 6 mentions
- document 4 (40240): `new` S2 Domain Name, 14 mentions
- document 4 (40240): `new` S3 IP Address, 6 mentions
- document 4 (40240): `new` S4 Country, 3 mentions
- document 4 (40240): `new` S5 Malware Family, 3 mentions
- document 4 (40240): `new` S6 Threat Actor, 3 mentions
- document 7 (160530): `new` S7 Malicious File, 8 mentions
- document 8 (339662): `new` S8 Vulnerability, 4 mentions
- document 9 (341128): `alias-of` S6 Threat Actor, 3 mentions absorbed
- document 10 (375404): `new` S9 Software Product, 3 mentions
- document 12 (619229): `new` S10 Government Agency, 8 mentions
- document 15 (861292): `new` S11 URL, 7 mentions
- document 18 (987552): `alias-of` S10 Government Agency, 3 mentions absorbed

## Assignment decisions

One event per decision; a pooled mention that is assigned later appears twice. `drain` is a pooled mention re-tested after a mint.

| decision | events |
|---|---|
| assign: kind-first | 209 |
| pool: below-tau | 79 |
| pool: no-schemes | 48 |
| assign: knn | 32 |
| assign: drain | 25 |
| pool: ambiguous | 1 |

## What stayed in the pool

32 mentions, 25 distinct kind phrases: phishing url (3), international organization (2), messaging service (2), social media platform (2), web address (2), web platform (2), anonymity network (1), cloud platform (1), cloud service (1), cryptographic standard (1), fraudulent campaign (1), fraudulent scheme (1), humanitarian organization (1), legitimate web service (1), malicious archive (1), and 10 more kinds.

## Relation types

| type | relations | aliases | born at document | definition |
|---|---|---|---|---|
| downloads-and-executes | 11 | 3 | 4 | The source file initiates the download and execution of the target payload. |
| delivers-payload | 10 | 5 | 6 | The subject file or dropper executes, drops, or installs the object malware payload. |
| hosts-file | 10 | 1 | 3 | Indicates that an internet domain or web server hosts a specific downloadable file. |
| uses-tool | 8 | 1 | 10 | The threat actor utilizes the specified tool, malware, or utility in operations. |
| impersonates | 7 | 1 | 5 | The head entity falsely portrays itself as or mimics the brand, identity, or resource of the tail entity. |
| contains-file | 6 | 0 | 2 | An archive or container file encapsulates another specified file. |
| located-in | 6 | 0 | 5 | The head entity is physically, administratively, or geographically located in the tail country or jurisdiction. |
| creates-file | 5 | 2 | 4 | The source file decodes, extracts, or writes the target file to the system. |
| executes | 5 | 1 | 9 | Indicates that a specific file or binary runs a particular program or malware family. |
| exploits-vulnerability | 5 | 1 | 6 | The subject file, script, or campaign leverages a specific security vulnerability. |
| deploys-software | 4 | 0 | 1 | An organization installs, hosts, or operates a specific software product or system. |
| uses-email-address | 4 | 0 | 1 | An entity uses an email address for communication or point of contact. |
| associated-with | 3 | 2 | 9 | Identifies an association between a threat actor and a campaign, tool, or malicious activity. |
| associated-with-malware | 3 | 2 | 2 | The threat actor or group is linked to or operates the specified malware. |
| exfiltrates-data-to | 3 | 1 | 2 | A malware program transmits stolen data to a remote network endpoint or domain. |
| uses-infrastructure | 3 | 0 | 18 | The threat actor or activity utilizes specific network infrastructure such as domains, URLs, or servers. |
| abuses-service | 2 | 0 | 17 | The actor or malware leverages a legitimate third-party service or domain for malicious purposes. |
| conducts-campaign | 2 | 1 | 8 | Specifies that a threat actor is responsible for or deploys a particular malicious artifact or campaign. |
| hosts-url | 2 | 0 | 15 | The source domain hosts the network resource specified by the target URL. |
| is-instance-of | 2 | 0 | 7 | Indicates that a specific file is a compiled binary or artifact belonging to a given malware family. |
| is-part-of | 2 | 1 | 1 | An organization or organizational unit is a component or subdivision of another body. |
| registered-with | 2 | 0 | 5 | The head domain or URL resource was registered through the tail registrar or service provider. |
| spreads-via | 2 | 1 | 14 | The campaign or threat activity is distributed or advertised across the specified platform. |
| targets-entities-in | 2 | 1 | 6 | The subject malware or attack campaign targets organizations or individuals located in the object country. |
| tracks-activity-using | 2 | 1 | 3 | Identifies an activity tracking identifier associated with the use of a specific tool or malware family. |
| acts-as-c2-for | 1 | 0 | 11 | Specifies that a domain or IP address serves as command-and-control infrastructure for a malware family. |
| communicates-with-domain | 1 | 0 | 10 | The malware contacts or establishes network communication with the specified domain name. |
| downloads-from | 1 | 0 | 16 | The malware or actor downloads data or payloads from the specified hosting service or server. |
| drops | 1 | 0 | 12 | Writes or deposits a secondary payload or file onto the host storage. |
| hosted-on-infrastructure-of | 1 | 0 | 5 | The head network resource is hosted on the infrastructure or network provided by the tail service provider. |
| infects-file | 1 | 0 | 19 | The actor or malware modifies, injects code into, or compromises a specific target file. |
| launches-executable | 1 | 0 | 15 | The source file or script initiates the execution of the target executable program. |
| obfuscates-file | 1 | 0 | 15 | The source software tool is used to protect or obfuscate the code of the target file. |
| routes-traffic-through | 1 | 0 | 3 | Indicates that network communication passes through an intermediary network or proxy service. |
| uses-lure | 1 | 0 | 20 | The threat actor uses a specific fictitious theme, scheme, or brand name as social engineering bait. |

## Scheme × hand category

Overlay by plain surface match against the frozen gpt-5 stream; the hand categories are a reference, not truth.

- (pool): Organization 14, Domain 7, (unaligned) 5, Software 4, Infrastructure 1, Government Body 1
- Country: (unaligned) 14, Country 2, Government Body 2
- Domain Name: Domain 111, Organization 3
- Email Address: Domain 13, (unaligned) 2
- Government Agency: Government Body 9, (unaligned) 7, Sector 1
- IP Address: (unaligned) 29
- Malicious File: (unaligned) 17, Software 9
- Malware Family: Software 45, (unaligned) 28
- Software Product: Software 3, (unaligned) 1
- Threat Actor: HackerGroup 14, (unaligned) 4
- URL: Organization 10, Domain 5, (unaligned) 3
- Vulnerability: Software 5

## Closest scheme pairs (centroid cosine)

- Malware Family / Malicious File: 0.930
- Malware Family / Threat Actor: 0.806
- Threat Actor / Malicious File: 0.785
- Email Address / IP Address: 0.765
- Domain Name / IP Address: 0.763

## Growth over the stream

Schemes, pool and relation types are cumulative.

| # | doc id | date | title | mentions | naming calls | schemes | pool | relation types |
|---|---|---|---|---|---|---|---|---|
| 1 | 39962 | 2022-04-29 | Щодо обміну інформацією про кіберзагрози | 16 | 0 | 0 | 16 | 3 |
| 2 | 40102 | 2022-05-06 | Кібератака групи APT28 із застосуванням шкідливої програми… | 11 | 0 | 0 | 27 | 6 |
| 3 | 40125 | 2022-05-07 | Масове розповсюдження шкідливої програми JesterStealer з ви… | 21 | 1 | 1 | 42 | 9 |
| 4 | 40240 | 2022-05-12 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 28 | 5 | 6 | 39 | 11 |
| 5 | 40263 | 2022-05-14 | Онлайн-шахрайство з використанням тематики "грошової допомо… | 40 | 0 | 6 | 47 | 15 |
| 6 | 40559 | 2022-06-02 | Кібератака на державні організації України з використанням… | 11 | 0 | 6 | 54 | 18 |
| 7 | 160530 | 2022-06-10 | Масована кібератака на медійні організації України з викори… | 18 | 1 | 7 | 45 | 19 |
| 8 | 339662 | 2022-06-20 | Кібератака групи UAC-0098 на об'єкти критичної інфраструкту… | 21 | 1 | 8 | 44 | 20 |
| 9 | 341128 | 2022-06-20 | Кібератака групи APT28 з використанням шкідливої програми C… | 12 | 1 | 8 | 26 | 22 |
| 10 | 375404 | 2022-06-22 | Кібератаки груп, асоційованих з Китаєм, у відношенні російс… | 16 | 1 | 9 | 24 | 24 |
| 11 | 405538 | 2022-06-24 | Кібератака у відношенні операторів телекомунікацій України… | 16 | 0 | 9 | 26 | 25 |
| 12 | 619229 | 2022-07-06 | Кібератака UAC-0056 на державні організації України з викор… | 8 | 1 | 10 | 19 | 26 |
| 13 | 703548 | 2022-07-11 | Атака групи UAC-0056 на державні організації України з вико… | 14 | 0 | 10 | 21 | 26 |
| 14 | 761668 | 2022-07-14 | Онлайн-шахрайство з використанням тематики "грошової компен… | 16 | 0 | 10 | 24 | 27 |
| 15 | 861292 | 2022-07-20 | Кібератака на державні організації України з використанням… | 14 | 1 | 11 | 22 | 30 |
| 16 | 955924 | 2022-07-25 | Масове розповсюдження стілерів (Formbook, Snake Keylogger)… | 15 | 0 | 11 | 24 | 31 |
| 17 | 971405 | 2022-07-26 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 24 | 0 | 11 | 24 | 32 |
| 18 | 987552 | 2022-07-27 | Онлайн-шахрайство з використанням тематики "допомоги від Че… | 8 | 1 | 11 | 26 | 33 |
| 19 | 1229152 | 2022-08-10 | Кібератаки групи UAC-0010 (Armageddon): шкідливі програми G… | 10 | 0 | 11 | 26 | 34 |
| 20 | 1545776 | 2022-08-30 | Онлайн-шахрайство з використанням тематики «грошових виплат… | 50 | 0 | 11 | 32 | 35 |

## Cost

Covers the last invocation of the driver only. USD is not recorded (unpriced: gemini/gemini-3.7-flash, gemini/gemini-embedding-2). Wall clock 293.4 s.

| operator | calls | input tokens | output tokens |
|---|---|---|---|
| extract | 20 | 56546 | 31408 |
| embed-kind | 12 | 0 | 0 |
| embed-gloss | 20 | 0 | 0 |
| embed-relation | 60 | 0 | 0 |
| scheme-name | 13 | 9804 | 799 |
| total | 125 | 66350 | 32207 |

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
- `schemes.json`: final scheme inventory with members and history
