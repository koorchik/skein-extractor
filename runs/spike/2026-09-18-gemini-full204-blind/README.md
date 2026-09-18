# 2026-09-18-gemini-full204-blind

Exploratory full-stream run (all 204 reports, numeric-id order) of the adopted schema-blind configuration: extract-open-v1, kind-first 0.9, tau 0.80, pool link 0.85, mass 3. First look at the whole picture of emergent schemes; blind arm of the blind vs in-context pair of 2026-09-18. Not pre-registered, not reportable.

<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->

## At a glance

|  |  |
|---|---|
| Documents | 204 (stream positions 1–204, dated 2018-02-15 to 2025-03-18) |
| Mentions | 3371 |
| Schemes | 24 |
| Pool (mentions without a scheme at the end) | 112 (3.3%) |
| Relation types | 12 |
| Naming calls | 27 |
| Hand-category overlay coverage | 2202 of 3371 mentions (65.3%) |

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
| S1 | Software Vendor | 81 | 5 (22) | Technology Vendor, Software Company, IT Vendor | A company or organization that develops, publishes, sells, or maintains software, hardware, or related technology products. |
| S2 | Security Vulnerability | 116 | 6 (23) | Software Vulnerability, Vulnerability, CVE | A flaw, weakness, or bug in software, hardware, or a system that can be exploited to compromise security. |
| S3 | Software Product | 362 | 6 (23) | Software Application, Software Package | An application, utility, plugin, or system software package designed for end users or computing environments. |
| S4 | Operating System | 60 | 8 (25) | OS, Operating Environment | System software that manages computer hardware and software resources and provides common services for computer programs. |
| S5 | Country | 183 | 8 (25) | Nation, Sovereign State | A distinct sovereign state, nation, or territorial body with its own government and defined geographical borders. |
| S6 | Government Agency | 136 | 9 (26) | Government Body, State Agency, Government Organization | An official department, ministry, service, or administrative organization operating as part of a state or sovereign government. |
| S7 | Security Advisory | 33 | 14 (2624) | Security Bulletin, Vulnerability Advisory | A formal public notice or bulletin issued by an organization detailing security vulnerabilities, remediation steps, or software updates. |
| S8 | Person | 14 | 26 (2691) | Individual, Public Figure | An individual human being, such as a government official, cybersecurity expert, researcher, or executive. |
| S9 | Malicious File | 911 | 28 (2695) | Malicious Document, Malicious Attachment, Weaponized File | A computer file, document, script, or archive used as an attack vector, payload carrier, or indicator of compromise. |
| S10 | Cybersecurity Company | 14 | 28 (2695) | Cybersecurity Firm, Security Vendor, Information Security Company | A commercial company or organization that provides information security products, threat intelligence, incident response, or security research services. |
| S11 | IP Address | 391 | 29 (2697) | Internet Protocol Address, IP | A numerical label assigned to a device connected to a computer network utilizing the Internet Protocol for communication. |
| S12 | Internet Domain | 596 | 30 (2699) | Domain Name, Domain, FQDN | An identification string or namespace defining a realm of administrative autonomy or authority within the Domain Name System. |
| S13 | Email Address | 114 | 30 (2699) | E-mail Address, Mailbox Address | A unique identifier representing an electronic mail destination used to send and receive digital messages across networks. |
| S14 | International Organization | 11 | 42 (2728) | Intergovernmental Organization, Supranational Organization | An intergovernmental or transnational institution established by treaty or agreement among sovereign states. |
| S15 | Threat Actor | 150 | 70 (18273) | Threat Group, Cyber Threat Actor, Advanced Persistent Threat | An individual or organized group responsible for conducting malicious cyber activities, attacks, or cyberespionage campaigns. |
| S16 | Social Media Platform | 10 | 105 (40263) | Social Network, Social Media Service | An online platform or service that facilitates social networking, user interaction, and content sharing. |
| S17 | Military Organization | 27 | 128 (3349703) | Military Unit, Armed Forces | An armed force, military unit, command, or defense institution operating as part of a state's armed services. |
| S18 | Online Service | 16 | 145 (4928679) | Web Service, Online Platform, Cloud Service | An internet-hosted platform, application, or utility providing specific online functionality, content, or API services to users. |
| S19 | Non-Governmental Organization | 7 | 146 (5077168) | NGO, Non-Profit Organization, Civil Society Organization | A non-profit, citizen-based group or civil society organization operating independently of any government. |
| S20 | Research Organization | 5 | 151 (5213167) | Think Tank, Research Institute, Research Group | An institute, think tank, or specialized unit dedicated to conducting scientific, policy, strategic, or security research. |
| S21 | Autonomous System | 6 | 166 (6276824) | Autonomous System Number, ASN | A collection of connected Internet Protocol routing prefixes under the control of network operators presenting a single, clearly defined routing policy. |
| S22 | Telecommunications Provider | 3 | 166 (6276824) | Telecommunications Company, Telecom Operator, Internet Service Provider | A company or organization that provides voice, data, mobile, or internet communication services to subscribers. |
| S23 | City | 4 | 174 (6277896) | Town, Municipality | A large human settlement, municipality, or designated urban administrative area. |
| S24 | Incident Response Team | 9 | 181 (6279419) | Computer Emergency Response Team, CSIRT, CERT | An organization or specialized team responsible for monitoring, analyzing, and responding to cybersecurity incidents and threats. |

## Naming verdicts in stream order

- document 5 (22): `new` S1 Software Vendor, 6 mentions
- document 6 (23): `new` S2 Security Vulnerability, 12 mentions
- document 6 (23): `new` S3 Software Product, 10 mentions
- document 8 (25): `new` S4 Operating System, 8 mentions
- document 8 (25): `new` S5 Country, 3 mentions
- document 9 (26): `new` S6 Government Agency, 4 mentions
- document 14 (2624): `new` S7 Security Advisory, 27 mentions
- document 26 (2691): `new` S8 Person, 7 mentions
- document 27 (2693): `alias-of` S1 Software Vendor, 3 mentions absorbed
- document 28 (2695): `new` S9 Malicious File, 4 mentions
- document 28 (2695): `new` S10 Cybersecurity Company, 3 mentions
- document 29 (2697): `new` S11 IP Address, 3 mentions
- document 30 (2699): `new` S12 Internet Domain, 6 mentions
- document 30 (2699): `new` S13 Email Address, 4 mentions
- document 42 (2728): `new` S14 International Organization, 3 mentions
- document 70 (18273): `new` S15 Threat Actor, 3 mentions
- document 99 (39923): `alias-of` S6 Government Agency, 3 mentions absorbed
- document 105 (40263): `new` S16 Social Media Platform, 3 mentions
- document 128 (3349703): `new` S17 Military Organization, 4 mentions
- document 138 (4555802): `alias-of` S9 Malicious File, 3 mentions absorbed
- document 145 (4928679): `new` S18 Online Service, 3 mentions
- document 146 (5077168): `new` S19 Non-Governmental Organization, 4 mentions
- document 151 (5213167): `new` S20 Research Organization, 2 mentions
- document 166 (6276824): `new` S21 Autonomous System, 5 mentions
- document 166 (6276824): `new` S22 Telecommunications Provider, 3 mentions
- document 174 (6277896): `new` S23 City, 3 mentions
- document 181 (6279419): `new` S24 Incident Response Team, 3 mentions

## Assignment decisions

One event per decision; a pooled mention that is assigned later appears twice. `drain` is a pooled mention re-tested after a mint.

| decision | events |
|---|---|
| assign: kind-first | 2110 |
| assign: knn | 917 |
| pool: below-tau | 297 |
| assign: drain | 90 |
| pool: no-schemes | 46 |
| pool: ambiguous | 1 |

## What stayed in the pool

112 mentions, 86 distinct kind phrases: communication protocol (3), content management system (3), cryptographic hash (3), encryption standard (3), web browser (3), backdoor (2), commercial bank (2), data standard (2), diplomatic mission (2), dynamic dns service (2), geographic region (2), higher education institution (2), indicator format (2), media organization (2), network protocol (2), and 71 more kinds.

## Relation types

| type | relations | aliases | born at document | definition |
|---|---|---|---|---|
| delivers | 214 | 0 | 7 | An exploit, campaign, or delivery mechanism drops or downloads a payload onto a target system. |
| uses-malware | 205 | 1 | 54 | A threat actor utilizes or deploys a specific malware tool or family in their operations. |
| located-in | 153 | 0 | 3 | An organization, entity, or infrastructure is geographically or administratively based in a country or location. |
| hosts | 135 | 0 | 7 | An IP address, server, or domain hosts a specific file, malware payload, or service. |
| affects | 128 | 0 | 2 | A security vulnerability compromises or impacts a specific software product or component. |
| part-of | 121 | 0 | 4 | An entity or component is a constituent sub-part of a larger system, suite, or organization. |
| communicates-with | 65 | 0 | 40 | A malware payload or host establishes network connections to an external IP address or server. |
| attacks | 54 | 0 | 25 | A threat actor compromises, targets, or executes unauthorized actions against a system, service, or organization. |
| publishes | 32 | 0 | 1 | An organization or vendor officially releases or issues a security advisory, bulletin, or patch. |
| exploits | 18 | 0 | 20 | A threat actor, malware, or campaign leverages a specific security vulnerability to compromise systems. |
| addresses-vulnerability-in | 15 | 0 | 1 | A security advisory or patch provides fixes for security vulnerabilities affecting a software product. |
| attributed-to | 2 | 0 | 200 | A threat cluster, campaign, or activity is attributed to or associated with another threat group. |

## Scheme × hand category

Overlay by plain surface match against the frozen gpt-5 stream; the hand categories are a reference, not truth.

- (pool): Software 38, (unaligned) 32, Organization 30, Domain 4, Government Body 4, Infrastructure 3, Device 1
- Autonomous System: Organization 3, Infrastructure 2, (unaligned) 1
- City: (unaligned) 4
- Country: (unaligned) 134, Country 36, Government Body 8, Sector 4, Software 1
- Cybersecurity Company: Organization 13, (unaligned) 1
- Email Address: Domain 77, (unaligned) 35, Country 1, Organization 1
- Government Agency: Government Body 95, (unaligned) 31, Sector 9, Country 1
- Incident Response Team: Government Body 7, Organization 2
- International Organization: Organization 7, (unaligned) 4
- Internet Domain: Domain 586, (unaligned) 5, Organization 4, Infrastructure 1
- IP Address: (unaligned) 387, Domain 4
- Malicious File: Software 441, (unaligned) 406, Domain 59, Organization 4, Government Body 1
- Military Organization: Government Body 16, (unaligned) 10, Sector 1
- Non-Governmental Organization: Organization 5, (unaligned) 2
- Online Service: Organization 7, Domain 6, (unaligned) 3
- Operating System: Software 39, (unaligned) 18, Device 2, Organization 1
- Person: Individual 13, (unaligned) 1
- Research Organization: Organization 5
- Security Advisory: Organization 20, (unaligned) 12, Software 1
- Security Vulnerability: Software 106, (unaligned) 10
- Social Media Platform: (unaligned) 5, Organization 4, HackerGroup 1
- Software Product: Software 262, (unaligned) 52, Organization 42, Device 2, Infrastructure 2, Domain 2
- Software Vendor: Organization 66, Device 8, (unaligned) 5, Software 2
- Telecommunications Provider: Organization 3
- Threat Actor: HackerGroup 139, (unaligned) 11

## Closest scheme pairs (centroid cosine)

- Software Vendor / Software Product: 0.860
- Software Vendor / Cybersecurity Company: 0.848
- Malicious File / Threat Actor: 0.801
- Cybersecurity Company / Incident Response Team: 0.795
- Software Product / Malicious File: 0.791

## Growth over the stream

Schemes, pool and relation types are cumulative.

| # | doc id | date | title | mentions | naming calls | schemes | pool | relation types |
|---|---|---|---|---|---|---|---|---|
| 1 | 16 | 2020-01-17 | Intel, Adobe, Oracle та VMWare опублікували перші, в цьому… | 17 | 0 | 0 | 17 | 2 |
| 2 | 17 | 2020-01-20 | Критичні помилки плагіну WordPress дозволяють зловмисникам… | 7 | 0 | 0 | 24 | 3 |
| 3 | 18 | 2020-01-27 | Безпека вебресурсів та інформаційних систем органів державн… | 4 | 0 | 0 | 28 | 4 |
| 4 | 20 | 2020-02-06 | Коректне налаштування програмного забезпечення MS Office | 5 | 0 | 0 | 33 | 5 |
| 5 | 22 | 2020-02-12 | Cisco випустив патчі для закриття 'CDPwn' | 13 | 1 | 1 | 40 | 5 |
| 6 | 23 | 2020-02-13 | Adobe провела широкомасштабну розробку оновлень безпеки | 14 | 2 | 3 | 30 | 5 |
| 7 | 24 | 2020-02-21 | УВАГА! Спостерігається масова розсилка фішингових листів, я… | 7 | 0 | 3 | 34 | 7 |
| 8 | 25 | 2020-03-24 | Фішингові листи на тему коронавірусу, що приховують у собі… | 17 | 2 | 5 | 34 | 7 |
| 9 | 26 | 2020-04-01 | Звертаємо увагу на використання зловмисниками епідеміологіч… | 4 | 1 | 6 | 33 | 7 |
| 10 | 27 | 2020-04-06 | Вразливість в Zoom для Windows | 5 | 0 | 6 | 36 | 7 |
| 11 | 2492 | 2020-06-08 | Рекомендації з безпеки програмного забезпечення Cisco ASA,… | 17 | 0 | 6 | 37 | 7 |
| 12 | 2496 | 2020-06-05 | Mozilla, VMWare, Apple, Chrome та Cisco випустили оновлення… | 40 | 0 | 6 | 50 | 7 |
| 13 | 2498 | 2020-06-10 | Рекомендації щодо запобігання ризиків з кіберзахисту при ви… | 0 | 0 | 6 | 50 | 7 |
| 14 | 2624 | 2020-01-17 | Перші цьогорічні оновлення безпеки Intel, Adobe, Oracle та… | 17 | 1 | 7 | 32 | 7 |
| 15 | 2625 | 2020-01-15 | Виявлено критичні вразливості операційної системи Windows | 20 | 0 | 7 | 34 | 7 |
| 16 | 2628 | 2020-07-28 | Інформація щодо бази даних реальних ІР-адрес електронних р… | 10 | 0 | 7 | 39 | 7 |
| 17 | 2656 | 2019-09-13 | Угода про наукове та науково-технічне співробітництво | 4 | 0 | 7 | 40 | 7 |
| 18 | 2658 | 2019-09-12 | Підписано Меморандум про взаємодію між (IFES)/IFES Україна… | 5 | 0 | 7 | 42 | 7 |
| 19 | 2659 | 2019-07-30 | Не перевіряйте свої поштові акаунти на фішингових сайтах! | 3 | 0 | 7 | 45 | 7 |
| 20 | 2660 | 2019-06-20 | Нові спроби використання вразливості 2017 року Microsoft Of… | 15 | 0 | 7 | 48 | 8 |
| 21 | 2661 | 2020-01-15 | Критична вразливість в старих версіях ОС Windows | 12 | 0 | 7 | 48 | 8 |
| 22 | 2681 | 2019-12-06 | Вісім правил кібербезпеки. Що пропонують в ООН | 10 | 0 | 7 | 55 | 8 |
| 23 | 2683 | 2019-10-31 | Конференція «Дезінформація та кібербезпека під час виборів… | 16 | 0 | 7 | 64 | 8 |
| 24 | 2685 | 2019-10-29 | Проведено зустріч з Фондом "Альянс Демократій" | 4 | 0 | 7 | 65 | 8 |
| 25 | 2687 | 2019-10-22 | Новини зі світу кібербезпеки | 10 | 0 | 7 | 71 | 9 |
| 26 | 2691 | 2019-09-23 | XVIІI Міжнародна науково-практична конференція «Побудова ін… | 7 | 1 | 8 | 67 | 9 |
| 27 | 2693 | 2019-03-30 | Фішингова розсилка на тему виборів | 4 | 1 | 8 | 63 | 9 |
| 28 | 2695 | 2019-02-28 | Зараз в Україні активно розповсюджується шкідливе програмне… | 9 | 2 | 10 | 48 | 9 |
| 29 | 2697 | 2019-02-04 | Архів листування російської терористки М.Колєди | 6 | 1 | 11 | 49 | 9 |
| 30 | 2699 | 2019-01-29 | Чергова фішинг-атака на органи державної влади | 15 | 2 | 13 | 44 | 9 |
| 31 | 2701 | 2019-01-28 | Глобальна кампанія з підміни DNS-записів | 4 | 0 | 13 | 46 | 9 |
| 32 | 2703 | 2019-01-17 | Нові поширення шифрувальника Troldesh/Shade | 27 | 0 | 13 | 47 | 9 |
| 33 | 2707 | 2018-12-13 | Нові хвилі масових розсилок листів з #Smokeloader | 10 | 0 | 13 | 47 | 9 |
| 34 | 2718 | 2018-11-15 | Розсилка шкідливого програмного забезпечення бекдор-заванта… | 21 | 0 | 13 | 47 | 9 |
| 35 | 2720 | 2018-05-23 | Деструктивне шкідливе програмне забезпечення VPNFilter | 24 | 0 | 13 | 48 | 9 |
| 36 | 2722 | 2018-05-15 | Популярні вразливості в українському сегменті мережі Інтерн… | 20 | 0 | 13 | 52 | 9 |
| 37 | 2723 | 2018-05-15 | EFAIL - Критична вразливість в PGP та S/MIME (Оновлюється). | 9 | 0 | 13 | 55 | 9 |
| 38 | 2724 | 2018-05-11 | Microsoft випустила оновлення, які усувають велику кількіст… | 27 | 0 | 13 | 55 | 9 |
| 39 | 2725 | 2018-04-26 | Вразливість в CMS Drupal «Drupalgeddon2». | 4 | 0 | 13 | 55 | 9 |
| 40 | 2726 | 2018-03-22 | Поширення банківського трояна Ursnif | 12 | 0 | 13 | 55 | 10 |
| 41 | 2727 | 2018-02-22 | Поширення Monero Mining, через Smokeloader | 7 | 0 | 13 | 56 | 10 |
| 42 | 2728 | 2018-02-15 | Масова розсилка фішингових листів зі шкідливим програмним з… | 18 | 1 | 14 | 52 | 10 |
| 43 | 2803 | 2018-11-15 | Нові хвилі масових розсилок вірусу-шифрувальника Troldesh | 9 | 0 | 14 | 54 | 10 |
| 44 | 2804 | 2018-10-22 | Виявлено нове шкідливе програмне забезпечення GreyEnergy | 32 | 0 | 14 | 54 | 10 |
| 45 | 2805 | 2018-09-14 | Масова розсилка вірусу-шифрувальника GandCrab / Troldesh | 25 | 0 | 14 | 55 | 10 |
| 46 | 2806 | 2018-09-18 | Розсилка шкідливого програмного забезпечення AZORult | 14 | 0 | 14 | 55 | 10 |
| 47 | 2807 | 2018-09-03 | Масова розсилка шпигунського програмного забезпечення типу… | 18 | 0 | 14 | 56 | 10 |
| 48 | 2808 | 2018-08-07 | Як убезпечитися від фішингового сайта? | 4 | 0 | 14 | 57 | 10 |
| 49 | 3028 | 2020-08-07 | Agent Tesla (шкідливе програмне забезпечення) | 7 | 0 | 14 | 57 | 10 |
| 50 | 4475 | 2020-10-22 | Увага!!! Відбуваються фішингові розсилки на працівників дер… | 4 | 0 | 14 | 57 | 10 |
| 51 | 9483 | 2020-12-14 | Хакери отримали доступ до спеціалізованого програмного забе… | 12 | 0 | 14 | 66 | 10 |
| 52 | 9668 | 2020-12-28 | Вітаємо з нагоди 14-ї річниці ІСЗЗІ КПІ ім. Сікорського | 8 | 0 | 14 | 69 | 10 |
| 53 | 10011 | 2021-01-21 | Масштабна фішингова атака на державні установи України 19.0… | 13 | 0 | 14 | 72 | 10 |
| 54 | 10702 | 2021-03-03 | Поновлення кібератак з використанням ШПЗ Pterodo хакерськог… | 19 | 0 | 14 | 73 | 11 |
| 55 | 11113 | 2021-03-17 | Державним центром кіберзахисту Держспецзв’язку вживаються з… | 19 | 0 | 14 | 78 | 11 |
| 56 | 12081 | 2021-05-13 | Президент України Володимир Зеленський відкрив Кіберцентр U… | 9 | 0 | 14 | 82 | 11 |
| 57 | 13156 | 2021-07-13 | Зафіксовано атаку на державні органи України з використання… | 12 | 0 | 14 | 82 | 11 |
| 58 | 14624 | 2021-08-03 | Виявлено шахрайські дії з викрадення даних платіжних карток… | 16 | 0 | 14 | 87 | 11 |
| 59 | 14958 | 2021-08-20 | Рекомендації для попередження та зменшення наслідків впливу… | 2 | 0 | 14 | 87 | 11 |
| 60 | 16295 | 2021-10-26 | Щорічне оцінювання фізичної підготовки особового складу Дер… | 5 | 0 | 14 | 89 | 11 |
| 61 | 16905 | 2021-11-10 | Правила обміну інформацією про кіберінциденти та Перелік ка… | 6 | 0 | 14 | 90 | 11 |
| 62 | 17474 | 2021-12-16 | Робоча нарада з представниками енергетичного сектору | 7 | 0 | 14 | 91 | 11 |
| 63 | 17580 | 2021-12-24 | РЕКОМЕНДАЦІЇ ДЕРЖАВНОГО ЦЕНТРУ КІБЕРЗАХИСТУ | 5 | 0 | 14 | 92 | 11 |
| 64 | 17696 | 2022-01-04 | Перший щорічний звіт за результатами роботи системи виявлен… | 5 | 0 | 14 | 94 | 11 |
| 65 | 17899 | 2022-01-14 | Кібератака на сайти державних органів | 11 | 0 | 14 | 95 | 11 |
| 66 | 17961 | 2022-01-18 | Інформація щодо вразливості в продуктах Microsoft CVE-2022-… | 9 | 0 | 14 | 96 | 11 |
| 67 | 18101 | 2022-01-26 | Фрагмент дослідження кібератак 14.01.2022 | 19 | 0 | 14 | 97 | 11 |
| 68 | 18108 | 2022-01-26 | Порівняльний аналіз ШПЗ WhisperKill та WhiteBlackCrypt | 13 | 0 | 14 | 99 | 11 |
| 69 | 18163 | 2022-01-28 | Кібератака на організації та установи України з використанн… | 13 | 0 | 14 | 102 | 11 |
| 70 | 18273 | 2022-01-31 | Кібератака на державні організації України з використанням… | 20 | 1 | 15 | 99 | 11 |
| 71 | 18365 | 2022-02-01 | Кібератака групи UAC-0010 (Armageddon) на державні організа… | 16 | 0 | 15 | 100 | 11 |
| 72 | 18419 | 2022-02-02 | Кібератака групи UAC-0056 на державні організації України з… | 15 | 0 | 15 | 101 | 11 |
| 73 | 37121 | 2022-02-17 | Довідкова інформація з питань діяльності CERT-UA за фактами… | 1 | 0 | 15 | 101 | 11 |
| 74 | 37139 | 2022-02-18 | Інформація щодо кібератак 15 лютого 2022 року | 17 | 0 | 15 | 109 | 11 |
| 75 | 37211 | 2022-02-21 | Попередження щодо можливих кібератак | 7 | 0 | 15 | 112 | 11 |
| 76 | 37246 | 2022-02-21 | Інформація щодо активності групи UAC-0008 (Buhtrap) (CERT-… | 31 | 0 | 15 | 112 | 11 |
| 77 | 37287 | 2022-02-22 | Вразливості в Zabbix (CVE-2022-23131, CVE-2022-23134) | 5 | 0 | 15 | 113 | 11 |
| 78 | 37626 | 2022-03-07 | Кібератака групи UAC-0057 (unc1151) на державні організації… | 15 | 0 | 15 | 115 | 11 |
| 79 | 37688 | 2022-03-09 | Кібератака на державні організації України з використанням… | 10 | 0 | 15 | 115 | 11 |
| 80 | 37704 | 2022-03-11 | Кібератака на державні організації України з використанням… | 23 | 0 | 15 | 116 | 11 |
| 81 | 37788 | 2022-03-16 | Фішингова кампанія з використанням тематики сервісу UKR.NET… | 9 | 0 | 15 | 118 | 11 |
| 82 | 37815 | 2022-03-17 | Кібератака групи UAC-0020 (Vermin) на державні організації… | 41 | 0 | 15 | 121 | 11 |
| 83 | 37829 | 2022-03-18 | Кібератака групи UAC-0035 (InvisiMole) на державні організа… | 12 | 0 | 15 | 121 | 11 |
| 84 | 38088 | 2022-03-22 | Кібератака на українські підприємства з використанням прогр… | 8 | 0 | 15 | 121 | 11 |
| 85 | 38097 | 2022-03-22 | Кібератака групи UAC-0026 з використанням шкідливої програм… | 13 | 0 | 15 | 122 | 11 |
| 86 | 38155 | 2022-03-23 | Кібератака на державні організації України з використанням… | 12 | 0 | 15 | 122 | 11 |
| 87 | 38374 | 2022-03-28 | Кібератака групи UAC-0056 на державні органи України з вико… | 12 | 0 | 15 | 122 | 11 |
| 88 | 38606 | 2022-03-30 | Масове розповсюдження шкідливої програми MarsStealer серед… | 13 | 0 | 15 | 122 | 11 |
| 89 | 39086 | 2022-04-04 | Кібератака групи UAC-0010 (Armageddon) на державні інституц… | 13 | 0 | 15 | 122 | 11 |
| 90 | 39138 | 2022-04-04 | Кібератака групи UAC-0010 (Armageddon) на державні організа… | 15 | 0 | 15 | 122 | 11 |
| 91 | 39253 | 2022-04-05 | Інформація щодо кібератак, спрямованих на отримання доступу… | 11 | 0 | 15 | 122 | 11 |
| 92 | 39386 | 2022-04-07 | Кібератака групи UAC-0010 (Armageddon) на державні організа… | 24 | 0 | 15 | 123 | 11 |
| 93 | 39518 | 2022-04-12 | Кібератака групи Sandworm (UAC-0082) на об’єкти енергетики… | 16 | 0 | 15 | 123 | 11 |
| 94 | 39606 | 2022-04-14 | Кібератака на державні організації України з використанням… | 12 | 0 | 15 | 124 | 11 |
| 95 | 39609 | 2022-04-14 | Кібератака на державні організації України з використанням… | 34 | 0 | 15 | 124 | 11 |
| 96 | 39708 | 2022-04-18 | Кібератака на державні організації України з використанням… | 14 | 0 | 15 | 126 | 11 |
| 97 | 39727 | 2022-04-19 | Онлайн-шахрайство з використанням тематики "грошової допомо… | 45 | 0 | 15 | 132 | 11 |
| 98 | 39882 | 2022-04-26 | Кібератака групи UAC-0056 з використанням шкідливих програм… | 6 | 0 | 15 | 132 | 11 |
| 99 | 39923 | 2022-04-28 | Дослідження DDoS-атак, що здійснюються в результаті ураженн… | 42 | 1 | 15 | 118 | 11 |
| 100 | 39934 | 2022-04-28 | Кібератака групи UAC-0098 на державні органи України із зас… | 11 | 0 | 15 | 119 | 11 |
| 101 | 39962 | 2022-04-29 | Щодо обміну інформацією про кіберзагрози | 15 | 0 | 15 | 119 | 11 |
| 102 | 40102 | 2022-05-06 | Кібератака групи APT28 із застосуванням шкідливої програми… | 11 | 0 | 15 | 119 | 11 |
| 103 | 40125 | 2022-05-07 | Масове розповсюдження шкідливої програми JesterStealer з ви… | 19 | 0 | 15 | 119 | 11 |
| 104 | 40240 | 2022-05-12 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 27 | 0 | 15 | 119 | 11 |
| 105 | 40263 | 2022-05-14 | Онлайн-шахрайство з використанням тематики "грошової допомо… | 40 | 1 | 16 | 109 | 11 |
| 106 | 40559 | 2022-06-02 | Кібератака на державні організації України з використанням… | 10 | 0 | 16 | 109 | 11 |
| 107 | 160530 | 2022-06-10 | Масована кібератака на медійні організації України з викори… | 19 | 0 | 16 | 110 | 11 |
| 108 | 339662 | 2022-06-20 | Кібератака групи UAC-0098 на об'єкти критичної інфраструкту… | 21 | 0 | 16 | 110 | 11 |
| 109 | 341128 | 2022-06-20 | Кібератака групи APT28 з використанням шкідливої програми C… | 12 | 0 | 16 | 110 | 11 |
| 110 | 375404 | 2022-06-22 | Кібератаки груп, асоційованих з Китаєм, у відношенні російс… | 16 | 0 | 16 | 111 | 11 |
| 111 | 405538 | 2022-06-24 | Кібератака у відношенні операторів телекомунікацій України… | 14 | 0 | 16 | 112 | 11 |
| 112 | 619229 | 2022-07-06 | Кібератака UAC-0056 на державні організації України з викор… | 8 | 0 | 16 | 112 | 11 |
| 113 | 703548 | 2022-07-11 | Атака групи UAC-0056 на державні організації України з вико… | 12 | 0 | 16 | 112 | 11 |
| 114 | 761668 | 2022-07-14 | Онлайн-шахрайство з використанням тематики "грошової компен… | 16 | 0 | 16 | 112 | 11 |
| 115 | 861292 | 2022-07-20 | Кібератака на державні організації України з використанням… | 12 | 0 | 16 | 114 | 11 |
| 116 | 955924 | 2022-07-25 | Масове розповсюдження стілерів (Formbook, Snake Keylogger)… | 15 | 0 | 16 | 114 | 11 |
| 117 | 971405 | 2022-07-26 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 25 | 0 | 16 | 115 | 11 |
| 118 | 987552 | 2022-07-27 | Онлайн-шахрайство з використанням тематики "допомоги від Че… | 8 | 0 | 16 | 115 | 11 |
| 119 | 1229152 | 2022-08-10 | Кібератаки групи UAC-0010 (Armageddon): шкідливі програми G… | 9 | 0 | 16 | 115 | 11 |
| 120 | 1545776 | 2022-08-30 | Онлайн-шахрайство з використанням тематики «грошових виплат… | 40 | 0 | 16 | 117 | 11 |
| 121 | 1563322 | 2022-08-31 | Масове розповсюдження шкідливої програми AgentTesla (CERT-U… | 24 | 0 | 16 | 117 | 11 |
| 122 | 1751036 | 2022-09-12 | Щодо невідкладних заходів кіберзахисту | 25 | 0 | 16 | 118 | 11 |
| 123 | 2394117 | 2022-10-22 | Кібератака на державні організації України з використанням… | 18 | 0 | 16 | 118 | 11 |
| 124 | 2681855 | 2022-11-08 | Кібератака групи UAC-0010: розсилання електронних листів, н… | 28 | 0 | 16 | 118 | 11 |
| 125 | 2698320 | 2022-11-09 | Розповсюдження електронних листів з фейковим сканером, наче… | 8 | 0 | 16 | 119 | 11 |
| 126 | 2724253 | 2022-11-11 | Інформація щодо кібератак групи UAC-0118 (FRwL) з використа… | 11 | 0 | 16 | 119 | 11 |
| 127 | 3192088 | 2022-12-08 | Кібератака на державні організації з використанням тематики… | 14 | 0 | 16 | 119 | 11 |
| 128 | 3349703 | 2022-12-18 | Кібератака на користувачів системи DELTA з використанням шк… | 18 | 1 | 17 | 109 | 11 |
| 129 | 3718487 | 2023-01-27 | Кібератака Sandworm на інформаційно-комунікаційну систему У… | 29 | 0 | 17 | 113 | 11 |
| 130 | 3761023 | 2023-02-01 | Активність групи UAC-0114 (Winter Vivern) у відношенні держ… | 19 | 0 | 17 | 115 | 11 |
| 131 | 3804703 | 2023-02-06 | Кібератака UAC-0050 у відношенні державних органів України… | 27 | 0 | 17 | 117 | 11 |
| 132 | 3863542 | 2023-02-13 | Кібератака на організації та установи України з використанн… | 26 | 0 | 17 | 118 | 11 |
| 133 | 3931296 | 2023-02-21 | Кібератака групи UAC-0050 (UAC-0096) з використанням програ… | 34 | 0 | 17 | 119 | 11 |
| 134 | 3947787 | 2023-02-23 | Кібератака, спрямована на порушення цілісності та доступнос… | 14 | 0 | 17 | 122 | 11 |
| 135 | 4279195 | 2023-04-03 | Використання неліцензійних програм Microsoft Office як вект… | 13 | 0 | 17 | 123 | 11 |
| 136 | 4492467 | 2023-04-28 | Кібератака групи APT28: розповсюдження електронних листів з… | 10 | 0 | 17 | 125 | 11 |
| 137 | 4501891 | 2023-04-29 | WinRAR як "кіберзброя". Деструктивна кібератака UAC-0165 (й… | 16 | 0 | 17 | 125 | 11 |
| 138 | 4555802 | 2023-05-05 | Повернення UAC-0006: масове розповсюдження SmokeLoader з ви… | 28 | 1 | 17 | 114 | 11 |
| 139 | 4697016 | 2023-05-22 | Шпигунська активність UAC-0063 у відношенні України, Казахс… | 24 | 0 | 17 | 115 | 11 |
| 140 | 4755642 | 2023-05-29 | Кібератака UAC-0006: розповсюдження SmokeLoader з використа… | 30 | 0 | 17 | 115 | 11 |
| 141 | 4789582 | 2023-06-02 | Розсилання SMS-повідомлень з темою судових повісток з викор… | 25 | 0 | 17 | 118 | 11 |
| 142 | 4818341 | 2023-06-05 | UAC-0099: кібершпигунство у відношенні державних організаці… | 15 | 0 | 17 | 118 | 11 |
| 143 | 4905718 | 2023-06-16 | Кібератака групи UAC-0057 (GhostWriter) у відношенні держав… | 19 | 0 | 17 | 119 | 11 |
| 144 | 4905829 | 2023-06-20 | Групою APT28 застосовано три експлойти для Roundcube (CVE-2… | 26 | 0 | 17 | 120 | 11 |
| 145 | 4928679 | 2023-06-19 | Цільові кібератаки UAC-0102 у відношенні користувачів серві… | 13 | 1 | 18 | 114 | 11 |
| 146 | 5077168 | 2023-07-05 | Цільова атака з використанням тематики членства України в О… | 21 | 1 | 19 | 109 | 11 |
| 147 | 5098518 | 2023-07-07 | Цільова кібератака UAC-0057 у відношенні державних органів… | 11 | 0 | 19 | 109 | 11 |
| 148 | 5105791 | 2023-07-08 | Фішингові атаки групи APT28 (UAC-0028) з метою отримання ав… | 25 | 0 | 19 | 112 | 11 |
| 149 | 5158006 | 2023-07-13 | Кібератака UAC-0006: розповсюдження SmokeLoader з використа… | 15 | 0 | 19 | 112 | 11 |
| 150 | 5160737 | 2023-07-13 | Зведена інформація щодо діяльності угрупування UAC-0010 ста… | 23 | 0 | 19 | 112 | 11 |
| 151 | 5213167 | 2023-07-18 | Цільові атаки Turla (UAC-0024, UAC-0003) з використанням шк… | 23 | 1 | 20 | 107 | 11 |
| 152 | 5269451 | 2023-07-24 | Рівень загрози для бухгалтерів зростає: угрупуванням UAC-00… | 18 | 0 | 20 | 107 | 11 |
| 153 | 5391805 | 2023-08-05 | MerlinAgent: новий open-source інструмент для здійснення кі… | 16 | 0 | 20 | 108 | 11 |
| 154 | 5436463 | 2023-08-09 | Як бути відповідальним та втримати кіберфронт | 29 | 0 | 20 | 108 | 11 |
| 155 | 5455833 | 2023-08-11 | "Змініть пароль до Roundcube": чергова фішингова атака з ви… | 10 | 0 | 20 | 108 | 11 |
| 156 | 5628441 | 2023-08-28 | UAC-0173: органи юстиції та нотаріат "під прицілом" (CERT-U… | 17 | 0 | 20 | 109 | 11 |
| 157 | 5661411 | 2023-08-31 | Кібератака UAC-0057: експлойт для CVE-2023-38831, JavaScrip… | 21 | 0 | 20 | 109 | 11 |
| 158 | 5702579 | 2023-09-04 | Кібератака APT28: msedge як завантажувач, TOR та сервіси mo… | 25 | 0 | 20 | 109 | 11 |
| 159 | 6032734 | 2023-10-06 | Нарощування темпів UAC-0006, мільйонні збитки (CERT-UA#7648… | 24 | 0 | 20 | 109 | 11 |
| 160 | 6123309 | 2023-10-15 | Особливості деструктивних кібератак Sandworm у відношенні у… | 15 | 0 | 20 | 109 | 11 |
| 161 | 6276351 | 2023-11-13 | Кібератака UAC-0050 з використанням Remcos RAT, замаскована… | 27 | 0 | 20 | 109 | 11 |
| 162 | 6276567 | 2023-11-30 | "Повістка до суду": чергова цільова атака UAC-0050 з викори… | 11 | 0 | 20 | 109 | 11 |
| 163 | 6276584 | 2023-12-01 | Зведена інформація щодо діяльності угрупування UAC-0006 ста… | 17 | 0 | 20 | 109 | 11 |
| 164 | 6276652 | 2023-12-07 | Масова кібератака UAC-0050 з використанням RemcosRAT/Meduza… | 7 | 0 | 20 | 109 | 11 |
| 165 | 6276799 | 2023-12-19 | Modus operandi UAC-0177 (JokerDPR) на прикладі однієї з кіб… | 12 | 0 | 20 | 109 | 11 |
| 166 | 6276824 | 2023-12-21 | "Заборгованість Київстар", "Запит СБУ": нова атака UAC-0050… | 20 | 2 | 22 | 101 | 11 |
| 167 | 6276894 | 2023-12-28 | APT28: від первинного ураження до створення загроз для конт… | 24 | 0 | 22 | 101 | 11 |
| 168 | 6276988 | 2024-01-06 | UAC-0184: Цільові атаки у відношенні українських військовос… | 20 | 0 | 22 | 101 | 11 |
| 169 | 6277063 | 2024-01-11 | RemcosRAT, QuasarRAT, RemoteUtilities на озброєнні UAC-0050… | 23 | 0 | 22 | 101 | 11 |
| 170 | 6277285 | 2024-01-22 | Листи нібито від Держспецзв'язку та ДСНС - атака UAC-0050 з… | 36 | 0 | 22 | 101 | 11 |
| 171 | 6277422 | 2024-01-31 | UAC-0027: DIRTYMOE (PURPLEFOX) уражено більше 2000 комп'юте… | 18 | 0 | 22 | 101 | 11 |
| 172 | 6277822 | 2024-02-22 | Щодо обстановки в сфері кібер на 23-24 лютого 2024 року | 15 | 0 | 22 | 102 | 11 |
| 173 | 6277849 | 2024-02-24 | UAC-0149: Цільові вибіркові атаки у відношенні Сил оборони… | 16 | 0 | 22 | 104 | 11 |
| 174 | 6277896 | 2024-02-28 | АНОНС: Практичний семінар для кіберфахівців | 10 | 1 | 23 | 100 | 11 |
| 175 | 6278274 | 2024-04-01 | Фактор кібербезпеки | 13 | 0 | 23 | 101 | 11 |
| 176 | 6278521 | 2024-04-16 | Месенджери та сайти знайомств - нові способи проведення ата… | 25 | 0 | 23 | 105 | 11 |
| 177 | 6278620 | 2024-04-18 | Чергова кібератака UAC-0149 з використанням Signal, вразлив… | 14 | 0 | 23 | 107 | 11 |
| 178 | 6278706 | 2024-04-19 | Плани UAC-0133 (Sandworm) щодо кібердиверсії на майже 20 об… | 31 | 0 | 23 | 107 | 11 |
| 179 | 6278735 | 2024-04-20 | Викрадення акаунту WhatsApp під виглядом голосування за еле… | 39 | 0 | 23 | 107 | 11 |
| 180 | 6279366 | 2024-05-21 | Весняне загострення: UAC-0006 активізувало кібератаки | 17 | 0 | 23 | 107 | 11 |
| 181 | 6279419 | 2024-05-23 | UAC-0188: Цільові кібератаки з використанням SuperOps RMM (… | 18 | 1 | 24 | 100 | 11 |
| 182 | 6279561 | 2024-06-04 | UAC-0200: Цільові кібератаки з використанням DarkCrystal RA… | 18 | 0 | 24 | 100 | 11 |
| 183 | 6279600 | 2024-06-05 | UAC-0020 (Vermin) атакує Сили оборони України з використанн… | 33 | 0 | 24 | 102 | 11 |
| 184 | 6280099 | 2024-07-17 | Цільові кібератаки UAC-0180 у відношенні оборонних підприєм… | 26 | 0 | 24 | 102 | 11 |
| 185 | 6280129 | 2024-07-21 | UAC-0063 атакує науково-дослідні установи України: HATVIBE… | 21 | 0 | 24 | 102 | 11 |
| 186 | 6280159 | 2024-07-24 | Точковий сплеск активності UAC-0057 (CERT-UA#10340) | 23 | 0 | 24 | 103 | 11 |
| 187 | 6280183 | 2024-07-24 | Кібератаки UAC-0102 з метою викрадення автентифікаційних да… | 25 | 0 | 24 | 103 | 11 |
| 188 | 6280345 | 2024-08-12 | UAC-0198: Масове розповсюдження ANONVNC (MESHAGENT) серед д… | 31 | 0 | 24 | 103 | 11 |
| 189 | 6280422 | 2024-08-19 | Кібератака UAC-0020 (Vermin) з використанням тематики війсь… | 13 | 0 | 24 | 104 | 11 |
| 190 | 6280563 | 2024-09-04 | Спроби кібератак на військові системи за допомогою шкідливи… | 33 | 0 | 24 | 105 | 11 |
| 191 | 6281009 | 2024-10-15 | Тріада UAC-0050: кібершпигунство, фінансові злочини, інформ… | 16 | 0 | 24 | 105 | 11 |
| 192 | 6281018 | 2024-10-16 | Розповсюдження MEDUZASTEALER засобами Telegram, начебто, ві… | 15 | 0 | 24 | 105 | 11 |
| 193 | 6281076 | 2024-10-23 | Файли конфігурацій RDP як засіб отримання віддаленого досту… | 17 | 0 | 24 | 106 | 11 |
| 194 | 6281095 | 2024-10-24 | Тематика рахунків на озброєнні UAC-0218: викрадення файлів… | 16 | 0 | 24 | 106 | 11 |
| 195 | 6281123 | 2024-10-25 | Кібератака UAC-0001 (APT28): PowerShell-команда в буфері об… | 22 | 0 | 24 | 107 | 11 |
| 196 | 6281202 | 2024-10-30 | Кібератака UAC-0050 з використанням податкової тематики та… | 19 | 0 | 24 | 107 | 11 |
| 197 | 6281632 | 2024-12-07 | Цільові кібератаки UAC-0185 у відношенні Сил оборони та під… | 30 | 0 | 24 | 108 | 11 |
| 198 | 6281681 | 2024-12-14 | "Повідомлення про порушення" від UAC-0099 (CERT-UA#12463) | 25 | 0 | 24 | 108 | 11 |
| 199 | 6281701 | 2024-12-18 | Кібератака UAC-0125 з використанням тематики "Армія+" (CERT… | 27 | 0 | 24 | 110 | 12 |
| 200 | 6282069 | 2025-01-17 | Спроби здійснення кібератак з використанням AnyDesk, нібито… | 3 | 0 | 24 | 111 | 12 |
| 201 | 6282517 | 2025-02-23 | Цільова активність UAC-0212 у відношенні розробників та пос… | 15 | 0 | 24 | 111 | 12 |
| 202 | 6282536 | 2025-02-25 | UAC-0173 проти Нотаріату України (CERT-UA#13738) | 23 | 0 | 24 | 112 | 12 |
| 203 | 6282737 | 2025-03-18 | UAC-0200: Шпигунство за оборонно-промисловим комплексом за… | 12 | 0 | 24 | 112 | 12 |

## Cost

Covers the last invocation of the driver only. USD is not recorded (unpriced: gemini/gemini-3.7-flash, gemini/gemini-embedding-2). Wall clock 296.0 s.

| operator | calls | input tokens | output tokens |
|---|---|---|---|
| scheme-name | 27 | 23743 | 1696 |
| extract | 22 | 160328 | 36578 |
| embed-gloss | 22 | 0 | 0 |
| embed-kind | 11 | 0 | 0 |
| embed-relation | 1 | 0 | 0 |
| total | 83 | 184071 | 38274 |

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
