# 2026-09-18-gemini-full204-icl

Exploratory full-stream run (all 204 reports, numeric-id order) of the in-context comparison arm: extract-open-icl-v1 with the current scheme list in the extraction prompt, kind-first 0.9, tau 0.80, pool link 0.85, mass 3. In-context arm of the blind vs in-context pair of 2026-09-18 (E5 preview). Not pre-registered, not reportable.

<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->

## At a glance

|  |  |
|---|---|
| Documents | 204 (stream positions 1–204, dated 2018-02-15 to 2025-03-18) |
| Mentions | 3709 |
| Schemes | 14 |
| Pool (mentions without a scheme at the end) | 31 (0.8%) |
| Relation types | 10 |
| Naming calls | 14 |
| Hand-category overlay coverage | 2389 of 3709 mentions (64.4%) |

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
| S1 | Vulnerability | 134 | 6 (23) | Security Flaw, Security Vulnerability | A flaw or weakness in software, hardware, or a system that can be exploited to compromise security. |
| S2 | Software Product | 424 | 6 (23) | Software Application, Software Program, Software | A program, application, operating system, or software component designed for end users or computing systems. |
| S3 | Technology Vendor | 57 | 6 (23) | Software Vendor, Vendor, Technology Company | A company or organization that develops, manufactures, or supplies software, hardware, or technology services. |
| S4 | Country | 189 | 8 (25) | Nation, Sovereign State | A sovereign nation, state, or distinct territorial body with its own government. |
| S5 | Government Agency | 179 | 9 (26) | Government Body, Government Organization, State Authority | An official institution, ministry, department, or administrative body operating under the authority of a national or regional government. |
| S6 | Malware | 298 | 20 (2660) | Malicious Software, Malware Family, Malware Strain | Software, code, or executable files intentionally designed to disrupt, damage, or gain unauthorized access to computer systems or data. |
| S7 | Uniform Resource Locator | 376 | 23 (2683) | URL, Web Address, Link | A standardized web address identifying the location of a specific resource or endpoint on a computer network. |
| S8 | Person | 21 | 26 (2691) | Individual, Human | An individual human being, such as a government official, cybersecurity professional, diplomat, or other public figure. |
| S9 | IP Address | 368 | 30 (2699) | Internet Protocol Address | A numerical label assigned to a device or network interface to identify its location on a computer network. |
| S10 | Email Address | 126 | 30 (2699) | E-mail Address, Email | A unique identifier used to send and receive electronic mail messages over a computer network. |
| S11 | Computer File | 665 | 46 (2806) | File, Digital File | A digital file, script, document, or archive stored on a filesystem or transmitted across a network. |
| S12 | Company | 89 | 62 (17474) | Commercial Enterprise, Business, Corporation | A commercial business, corporation, or enterprise operating within a specific industry or market. |
| S13 | Domain Name | 594 | 69 (18163) | Internet Domain, Domain, Fully Qualified Domain Name | A unique identification string that defines a realm of administrative autonomy, authority, or control within the Internet. |
| S14 | Threat Actor | 158 | 69 (18163) | Threat Group, Hacker Group, Advanced Persistent Threat | An individual or organized group responsible for conducting malicious cyber activities, attacks, or espionage campaigns. |

## Naming verdicts in stream order

- document 6 (23): `new` S1 Vulnerability, 12 mentions
- document 6 (23): `new` S2 Software Product, 11 mentions
- document 6 (23): `new` S3 Technology Vendor, 3 mentions
- document 8 (25): `new` S4 Country, 3 mentions
- document 9 (26): `new` S5 Government Agency, 4 mentions
- document 20 (2660): `new` S6 Malware, 6 mentions
- document 23 (2683): `new` S7 Uniform Resource Locator, 3 mentions
- document 26 (2691): `new` S8 Person, 7 mentions
- document 30 (2699): `new` S9 IP Address, 5 mentions
- document 30 (2699): `new` S10 Email Address, 4 mentions
- document 46 (2806): `new` S11 Computer File, 10 mentions
- document 62 (17474): `new` S12 Company, 4 mentions
- document 69 (18163): `new` S13 Domain Name, 6 mentions
- document 69 (18163): `new` S14 Threat Actor, 3 mentions

## Assignment decisions

One event per decision; a pooled mention that is assigned later appears twice. `drain` is a pooled mention re-tested after a mint.

| decision | events |
|---|---|
| assign: kind-first | 3521 |
| pool: below-tau | 86 |
| pool: no-schemes | 64 |
| assign: drain | 38 |
| assign: knn | 38 |

## What stayed in the pool

31 mentions, 23 distinct kind phrases: operating system (6), academic institution (2), non-governmental organization (2), working group (2), commission (1), cryptocurrency (1), cybersecurity company (1), educational institution (1), geographic location (1), hardware (1), infrastructure (1), international organization (1), network protocol (1), non-profit organization (1), office suite (1), and 8 more kinds.

## Relation types

| type | relations | aliases | born at document | definition |
|---|---|---|---|---|
| uses | 312 | 0 | 54 | The subject threat actor or malware utilizes the object tool, infrastructure, or malware. |
| delivers | 256 | 0 | 8 | The subject malware, file, or campaign installs, drops, or initiates the execution of the object malware payload. |
| affects | 190 | 1 | 2 | The subject vulnerability or malware impacts, targets, or compromises the object software, system, or organization. |
| hosts | 182 | 0 | 7 | The subject network infrastructure, host, or server hosts or provides access to the object resource or payload. |
| located-in | 132 | 0 | 3 | The subject entity is based in, operates within, or belongs to the object country or geographic area. |
| part-of | 117 | 0 | 4 | The head entity is a component, sub-application, or structural member of the tail entity. |
| publishes-advisory | 22 | 0 | 1 | The subject vendor or organization releases or issues a security advisory or patch update. |
| exploits | 16 | 0 | 20 | The subject threat actor or malware leverages or abuses the object security vulnerability to compromise systems. |
| fixes-vulnerability-in | 11 | 0 | 1 | The subject security advisory or update remediates vulnerabilities found in the object software product. |
| redirects-to | 2 | 0 | 19 | The subject script, webpage, or file redirects user traffic or execution to the object URL or host. |

## Scheme × hand category

Overlay by plain surface match against the frozen gpt-5 stream; the hand categories are a reference, not truth.

- (pool): Organization 13, (unaligned) 9, Software 7, Domain 1, Infrastructure 1
- Company: Organization 77, (unaligned) 8, Domain 3, Software 1
- Computer File: (unaligned) 509, Software 151, Organization 4, Government Body 1
- Country: (unaligned) 135, Country 36, Government Body 9, Sector 8, Organization 1
- Domain Name: Domain 589, (unaligned) 4, Infrastructure 1
- Email Address: Domain 83, (unaligned) 41, Country 1, Organization 1
- Government Agency: Government Body 121, (unaligned) 43, Organization 13, Sector 2
- IP Address: (unaligned) 364, Domain 4
- Malware: Software 288, (unaligned) 10
- Person: Individual 16, (unaligned) 5
- Software Product: Software 312, (unaligned) 71, Organization 29, Device 5, Infrastructure 4, Domain 3
- Technology Vendor: Organization 46, Device 8, (unaligned) 2, Software 1
- Threat Actor: HackerGroup 145, (unaligned) 11, Organization 1, Infrastructure 1
- Uniform Resource Locator: Domain 213, (unaligned) 88, Software 50, Organization 24, Government Body 1
- Vulnerability: Software 100, (unaligned) 20, Organization 14

## Closest scheme pairs (centroid cosine)

- Software Product / Technology Vendor: 0.832
- Vulnerability / Malware: 0.804
- Malware / Threat Actor: 0.801
- Uniform Resource Locator / Domain Name: 0.793
- IP Address / Domain Name: 0.783

## Growth over the stream

Schemes, pool and relation types are cumulative.

| # | doc id | date | title | mentions | naming calls | schemes | pool | relation types |
|---|---|---|---|---|---|---|---|---|
| 1 | 16 | 2020-01-17 | Intel, Adobe, Oracle та VMWare опублікували перші, в цьому… | 17 | 0 | 0 | 17 | 2 |
| 2 | 17 | 2020-01-20 | Критичні помилки плагіну WordPress дозволяють зловмисникам… | 7 | 0 | 0 | 24 | 3 |
| 3 | 18 | 2020-01-27 | Безпека вебресурсів та інформаційних систем органів державн… | 2 | 0 | 0 | 26 | 4 |
| 4 | 20 | 2020-02-06 | Коректне налаштування програмного забезпечення MS Office | 6 | 0 | 0 | 32 | 5 |
| 5 | 22 | 2020-02-12 | Cisco випустив патчі для закриття 'CDPwn' | 13 | 0 | 0 | 45 | 5 |
| 6 | 23 | 2020-02-13 | Adobe провела широкомасштабну розробку оновлень безпеки | 19 | 3 | 3 | 35 | 5 |
| 7 | 24 | 2020-02-21 | УВАГА! Спостерігається масова розсилка фішингових листів, я… | 16 | 0 | 3 | 43 | 6 |
| 8 | 25 | 2020-03-24 | Фішингові листи на тему коронавірусу, що приховують у собі… | 12 | 1 | 4 | 47 | 7 |
| 9 | 26 | 2020-04-01 | Звертаємо увагу на використання зловмисниками епідеміологіч… | 4 | 1 | 5 | 45 | 7 |
| 10 | 27 | 2020-04-06 | Вразливість в Zoom для Windows | 3 | 0 | 5 | 45 | 7 |
| 11 | 2492 | 2020-06-08 | Рекомендації з безпеки програмного забезпечення Cisco ASA,… | 17 | 0 | 5 | 45 | 7 |
| 12 | 2496 | 2020-06-05 | Mozilla, VMWare, Apple, Chrome та Cisco випустили оновлення… | 29 | 0 | 5 | 45 | 7 |
| 13 | 2498 | 2020-06-10 | Рекомендації щодо запобігання ризиків з кіберзахисту при ви… | 0 | 0 | 5 | 45 | 7 |
| 14 | 2624 | 2020-01-17 | Перші цьогорічні оновлення безпеки Intel, Adobe, Oracle та… | 17 | 0 | 5 | 47 | 7 |
| 15 | 2625 | 2020-01-15 | Виявлено критичні вразливості операційної системи Windows | 15 | 0 | 5 | 47 | 7 |
| 16 | 2628 | 2020-07-28 | Інформація щодо бази даних реальних ІР-адрес електронних р… | 8 | 0 | 5 | 47 | 7 |
| 17 | 2656 | 2019-09-13 | Угода про наукове та науково-технічне співробітництво | 4 | 0 | 5 | 48 | 7 |
| 18 | 2658 | 2019-09-12 | Підписано Меморандум про взаємодію між (IFES)/IFES Україна… | 5 | 0 | 5 | 50 | 7 |
| 19 | 2659 | 2019-07-30 | Не перевіряйте свої поштові акаунти на фішингових сайтах! | 3 | 0 | 5 | 53 | 8 |
| 20 | 2660 | 2019-06-20 | Нові спроби використання вразливості 2017 року Microsoft Of… | 14 | 1 | 6 | 30 | 9 |
| 21 | 2661 | 2020-01-15 | Критична вразливість в старих версіях ОС Windows | 12 | 0 | 6 | 30 | 9 |
| 22 | 2681 | 2019-12-06 | Вісім правил кібербезпеки. Що пропонують в ООН | 9 | 0 | 6 | 36 | 9 |
| 23 | 2683 | 2019-10-31 | Конференція «Дезінформація та кібербезпека під час виборів… | 16 | 1 | 7 | 35 | 9 |
| 24 | 2685 | 2019-10-29 | Проведено зустріч з Фондом "Альянс Демократій" | 4 | 0 | 7 | 36 | 9 |
| 25 | 2687 | 2019-10-22 | Новини зі світу кібербезпеки | 13 | 0 | 7 | 42 | 9 |
| 26 | 2691 | 2019-09-23 | XVIІI Міжнародна науково-практична конференція «Побудова ін… | 6 | 1 | 8 | 37 | 9 |
| 27 | 2693 | 2019-03-30 | Фішингова розсилка на тему виборів | 4 | 0 | 8 | 38 | 9 |
| 28 | 2695 | 2019-02-28 | Зараз в Україні активно розповсюджується шкідливе програмне… | 13 | 0 | 8 | 38 | 9 |
| 29 | 2697 | 2019-02-04 | Архів листування російської терористки М.Колєди | 6 | 0 | 8 | 41 | 9 |
| 30 | 2699 | 2019-01-29 | Чергова фішинг-атака на органи державної влади | 15 | 2 | 10 | 36 | 9 |
| 31 | 2701 | 2019-01-28 | Глобальна кампанія з підміни DNS-записів | 4 | 0 | 10 | 36 | 9 |
| 32 | 2703 | 2019-01-17 | Нові поширення шифрувальника Troldesh/Shade | 28 | 0 | 10 | 37 | 9 |
| 33 | 2707 | 2018-12-13 | Нові хвилі масових розсилок листів з #Smokeloader | 9 | 0 | 10 | 37 | 9 |
| 34 | 2718 | 2018-11-15 | Розсилка шкідливого програмного забезпечення бекдор-заванта… | 11 | 0 | 10 | 37 | 9 |
| 35 | 2720 | 2018-05-23 | Деструктивне шкідливе програмне забезпечення VPNFilter | 26 | 0 | 10 | 37 | 9 |
| 36 | 2722 | 2018-05-15 | Популярні вразливості в українському сегменті мережі Інтерн… | 18 | 0 | 10 | 37 | 9 |
| 37 | 2723 | 2018-05-15 | EFAIL - Критична вразливість в PGP та S/MIME (Оновлюється). | 16 | 0 | 10 | 37 | 9 |
| 38 | 2724 | 2018-05-11 | Microsoft випустила оновлення, які усувають велику кількіст… | 28 | 0 | 10 | 37 | 9 |
| 39 | 2725 | 2018-04-26 | Вразливість в CMS Drupal «Drupalgeddon2». | 3 | 0 | 10 | 37 | 9 |
| 40 | 2726 | 2018-03-22 | Поширення банківського трояна Ursnif | 12 | 0 | 10 | 39 | 9 |
| 41 | 2727 | 2018-02-22 | Поширення Monero Mining, через Smokeloader | 7 | 0 | 10 | 40 | 9 |
| 42 | 2728 | 2018-02-15 | Масова розсилка фішингових листів зі шкідливим програмним з… | 14 | 0 | 10 | 40 | 9 |
| 43 | 2803 | 2018-11-15 | Нові хвилі масових розсилок вірусу-шифрувальника Troldesh | 9 | 0 | 10 | 40 | 9 |
| 44 | 2804 | 2018-10-22 | Виявлено нове шкідливе програмне забезпечення GreyEnergy | 7 | 0 | 10 | 40 | 9 |
| 45 | 2805 | 2018-09-14 | Масова розсилка вірусу-шифрувальника GandCrab / Troldesh | 18 | 0 | 10 | 40 | 9 |
| 46 | 2806 | 2018-09-18 | Розсилка шкідливого програмного забезпечення AZORult | 14 | 1 | 11 | 34 | 9 |
| 47 | 2807 | 2018-09-03 | Масова розсилка шпигунського програмного забезпечення типу… | 17 | 0 | 11 | 34 | 9 |
| 48 | 2808 | 2018-08-07 | Як убезпечитися від фішингового сайта? | 4 | 0 | 11 | 34 | 9 |
| 49 | 3028 | 2020-08-07 | Agent Tesla (шкідливе програмне забезпечення) | 14 | 0 | 11 | 34 | 9 |
| 50 | 4475 | 2020-10-22 | Увага!!! Відбуваються фішингові розсилки на працівників дер… | 4 | 0 | 11 | 35 | 9 |
| 51 | 9483 | 2020-12-14 | Хакери отримали доступ до спеціалізованого програмного забе… | 12 | 0 | 11 | 35 | 9 |
| 52 | 9668 | 2020-12-28 | Вітаємо з нагоди 14-ї річниці ІСЗЗІ КПІ ім. Сікорського | 7 | 0 | 11 | 36 | 9 |
| 53 | 10011 | 2021-01-21 | Масштабна фішингова атака на державні установи України 19.0… | 14 | 0 | 11 | 36 | 9 |
| 54 | 10702 | 2021-03-03 | Поновлення кібератак з використанням ШПЗ Pterodo хакерськог… | 21 | 0 | 11 | 37 | 10 |
| 55 | 11113 | 2021-03-17 | Державним центром кіберзахисту Держспецзв’язку вживаються з… | 19 | 0 | 11 | 37 | 10 |
| 56 | 12081 | 2021-05-13 | Президент України Володимир Зеленський відкрив Кіберцентр U… | 9 | 0 | 11 | 37 | 10 |
| 57 | 13156 | 2021-07-13 | Зафіксовано атаку на державні органи України з використання… | 19 | 0 | 11 | 39 | 10 |
| 58 | 14624 | 2021-08-03 | Виявлено шахрайські дії з викрадення даних платіжних карток… | 14 | 0 | 11 | 39 | 10 |
| 59 | 14958 | 2021-08-20 | Рекомендації для попередження та зменшення наслідків впливу… | 7 | 0 | 11 | 39 | 10 |
| 60 | 16295 | 2021-10-26 | Щорічне оцінювання фізичної підготовки особового складу Дер… | 5 | 0 | 11 | 39 | 10 |
| 61 | 16905 | 2021-11-10 | Правила обміну інформацією про кіберінциденти та Перелік ка… | 7 | 0 | 11 | 39 | 10 |
| 62 | 17474 | 2021-12-16 | Робоча нарада з представниками енергетичного сектору | 6 | 1 | 12 | 34 | 10 |
| 63 | 17580 | 2021-12-24 | РЕКОМЕНДАЦІЇ ДЕРЖАВНОГО ЦЕНТРУ КІБЕРЗАХИСТУ | 5 | 0 | 12 | 34 | 10 |
| 64 | 17696 | 2022-01-04 | Перший щорічний звіт за результатами роботи системи виявлен… | 5 | 0 | 12 | 34 | 10 |
| 65 | 17899 | 2022-01-14 | Кібератака на сайти державних органів | 13 | 0 | 12 | 34 | 10 |
| 66 | 17961 | 2022-01-18 | Інформація щодо вразливості в продуктах Microsoft CVE-2022-… | 9 | 0 | 12 | 34 | 10 |
| 67 | 18101 | 2022-01-26 | Фрагмент дослідження кібератак 14.01.2022 | 20 | 0 | 12 | 34 | 10 |
| 68 | 18108 | 2022-01-26 | Порівняльний аналіз ШПЗ WhisperKill та WhiteBlackCrypt | 12 | 0 | 12 | 34 | 10 |
| 69 | 18163 | 2022-01-28 | Кібератака на організації та установи України з використанн… | 16 | 2 | 14 | 28 | 10 |
| 70 | 18273 | 2022-01-31 | Кібератака на державні організації України з використанням… | 30 | 0 | 14 | 28 | 10 |
| 71 | 18365 | 2022-02-01 | Кібератака групи UAC-0010 (Armageddon) на державні організа… | 16 | 0 | 14 | 28 | 10 |
| 72 | 18419 | 2022-02-02 | Кібератака групи UAC-0056 на державні організації України з… | 27 | 0 | 14 | 28 | 10 |
| 73 | 37121 | 2022-02-17 | Довідкова інформація з питань діяльності CERT-UA за фактами… | 1 | 0 | 14 | 28 | 10 |
| 74 | 37139 | 2022-02-18 | Інформація щодо кібератак 15 лютого 2022 року | 18 | 0 | 14 | 28 | 10 |
| 75 | 37211 | 2022-02-21 | Попередження щодо можливих кібератак | 3 | 0 | 14 | 29 | 10 |
| 76 | 37246 | 2022-02-21 | Інформація щодо активності групи UAC-0008 (Buhtrap) (CERT-… | 39 | 0 | 14 | 29 | 10 |
| 77 | 37287 | 2022-02-22 | Вразливості в Zabbix (CVE-2022-23131, CVE-2022-23134) | 11 | 0 | 14 | 29 | 10 |
| 78 | 37626 | 2022-03-07 | Кібератака групи UAC-0057 (unc1151) на державні організації… | 15 | 0 | 14 | 29 | 10 |
| 79 | 37688 | 2022-03-09 | Кібератака на державні організації України з використанням… | 11 | 0 | 14 | 29 | 10 |
| 80 | 37704 | 2022-03-11 | Кібератака на державні організації України з використанням… | 21 | 0 | 14 | 29 | 10 |
| 81 | 37788 | 2022-03-16 | Фішингова кампанія з використанням тематики сервісу UKR.NET… | 12 | 0 | 14 | 29 | 10 |
| 82 | 37815 | 2022-03-17 | Кібератака групи UAC-0020 (Vermin) на державні організації… | 44 | 0 | 14 | 29 | 10 |
| 83 | 37829 | 2022-03-18 | Кібератака групи UAC-0035 (InvisiMole) на державні організа… | 11 | 0 | 14 | 29 | 10 |
| 84 | 38088 | 2022-03-22 | Кібератака на українські підприємства з використанням прогр… | 8 | 0 | 14 | 29 | 10 |
| 85 | 38097 | 2022-03-22 | Кібератака групи UAC-0026 з використанням шкідливої програм… | 15 | 0 | 14 | 29 | 10 |
| 86 | 38155 | 2022-03-23 | Кібератака на державні організації України з використанням… | 15 | 0 | 14 | 29 | 10 |
| 87 | 38374 | 2022-03-28 | Кібератака групи UAC-0056 на державні органи України з вико… | 15 | 0 | 14 | 29 | 10 |
| 88 | 38606 | 2022-03-30 | Масове розповсюдження шкідливої програми MarsStealer серед… | 13 | 0 | 14 | 29 | 10 |
| 89 | 39086 | 2022-04-04 | Кібератака групи UAC-0010 (Armageddon) на державні інституц… | 20 | 0 | 14 | 29 | 10 |
| 90 | 39138 | 2022-04-04 | Кібератака групи UAC-0010 (Armageddon) на державні організа… | 23 | 0 | 14 | 29 | 10 |
| 91 | 39253 | 2022-04-05 | Інформація щодо кібератак, спрямованих на отримання доступу… | 12 | 0 | 14 | 29 | 10 |
| 92 | 39386 | 2022-04-07 | Кібератака групи UAC-0010 (Armageddon) на державні організа… | 29 | 0 | 14 | 29 | 10 |
| 93 | 39518 | 2022-04-12 | Кібератака групи Sandworm (UAC-0082) на об’єкти енергетики… | 25 | 0 | 14 | 29 | 10 |
| 94 | 39606 | 2022-04-14 | Кібератака на державні організації України з використанням… | 11 | 0 | 14 | 29 | 10 |
| 95 | 39609 | 2022-04-14 | Кібератака на державні організації України з використанням… | 34 | 0 | 14 | 29 | 10 |
| 96 | 39708 | 2022-04-18 | Кібератака на державні організації України з використанням… | 14 | 0 | 14 | 29 | 10 |
| 97 | 39727 | 2022-04-19 | Онлайн-шахрайство з використанням тематики "грошової допомо… | 46 | 0 | 14 | 29 | 10 |
| 98 | 39882 | 2022-04-26 | Кібератака групи UAC-0056 з використанням шкідливих програм… | 14 | 0 | 14 | 29 | 10 |
| 99 | 39923 | 2022-04-28 | Дослідження DDoS-атак, що здійснюються в результаті ураженн… | 42 | 0 | 14 | 29 | 10 |
| 100 | 39934 | 2022-04-28 | Кібератака групи UAC-0098 на державні органи України із зас… | 11 | 0 | 14 | 29 | 10 |
| 101 | 39962 | 2022-04-29 | Щодо обміну інформацією про кіберзагрози | 17 | 0 | 14 | 29 | 10 |
| 102 | 40102 | 2022-05-06 | Кібератака групи APT28 із застосуванням шкідливої програми… | 12 | 0 | 14 | 29 | 10 |
| 103 | 40125 | 2022-05-07 | Масове розповсюдження шкідливої програми JesterStealer з ви… | 29 | 0 | 14 | 29 | 10 |
| 104 | 40240 | 2022-05-12 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 33 | 0 | 14 | 29 | 10 |
| 105 | 40263 | 2022-05-14 | Онлайн-шахрайство з використанням тематики "грошової допомо… | 40 | 0 | 14 | 29 | 10 |
| 106 | 40559 | 2022-06-02 | Кібератака на державні організації України з використанням… | 10 | 0 | 14 | 29 | 10 |
| 107 | 160530 | 2022-06-10 | Масована кібератака на медійні організації України з викори… | 19 | 0 | 14 | 29 | 10 |
| 108 | 339662 | 2022-06-20 | Кібератака групи UAC-0098 на об'єкти критичної інфраструкту… | 24 | 0 | 14 | 29 | 10 |
| 109 | 341128 | 2022-06-20 | Кібератака групи APT28 з використанням шкідливої програми C… | 15 | 0 | 14 | 29 | 10 |
| 110 | 375404 | 2022-06-22 | Кібератаки груп, асоційованих з Китаєм, у відношенні російс… | 18 | 0 | 14 | 29 | 10 |
| 111 | 405538 | 2022-06-24 | Кібератака у відношенні операторів телекомунікацій України… | 17 | 0 | 14 | 29 | 10 |
| 112 | 619229 | 2022-07-06 | Кібератака UAC-0056 на державні організації України з викор… | 10 | 0 | 14 | 29 | 10 |
| 113 | 703548 | 2022-07-11 | Атака групи UAC-0056 на державні організації України з вико… | 14 | 0 | 14 | 29 | 10 |
| 114 | 761668 | 2022-07-14 | Онлайн-шахрайство з використанням тематики "грошової компен… | 15 | 0 | 14 | 29 | 10 |
| 115 | 861292 | 2022-07-20 | Кібератака на державні організації України з використанням… | 15 | 0 | 14 | 29 | 10 |
| 116 | 955924 | 2022-07-25 | Масове розповсюдження стілерів (Formbook, Snake Keylogger)… | 23 | 0 | 14 | 29 | 10 |
| 117 | 971405 | 2022-07-26 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 24 | 0 | 14 | 29 | 10 |
| 118 | 987552 | 2022-07-27 | Онлайн-шахрайство з використанням тематики "допомоги від Че… | 8 | 0 | 14 | 29 | 10 |
| 119 | 1229152 | 2022-08-10 | Кібератаки групи UAC-0010 (Armageddon): шкідливі програми G… | 10 | 0 | 14 | 29 | 10 |
| 120 | 1545776 | 2022-08-30 | Онлайн-шахрайство з використанням тематики «грошових виплат… | 49 | 0 | 14 | 29 | 10 |
| 121 | 1563322 | 2022-08-31 | Масове розповсюдження шкідливої програми AgentTesla (CERT-U… | 29 | 0 | 14 | 29 | 10 |
| 122 | 1751036 | 2022-09-12 | Щодо невідкладних заходів кіберзахисту | 27 | 0 | 14 | 29 | 10 |
| 123 | 2394117 | 2022-10-22 | Кібератака на державні організації України з використанням… | 19 | 0 | 14 | 29 | 10 |
| 124 | 2681855 | 2022-11-08 | Кібератака групи UAC-0010: розсилання електронних листів, н… | 26 | 0 | 14 | 29 | 10 |
| 125 | 2698320 | 2022-11-09 | Розповсюдження електронних листів з фейковим сканером, наче… | 12 | 0 | 14 | 29 | 10 |
| 126 | 2724253 | 2022-11-11 | Інформація щодо кібератак групи UAC-0118 (FRwL) з використа… | 31 | 0 | 14 | 29 | 10 |
| 127 | 3192088 | 2022-12-08 | Кібератака на державні організації з використанням тематики… | 16 | 0 | 14 | 29 | 10 |
| 128 | 3349703 | 2022-12-18 | Кібератака на користувачів системи DELTA з використанням шк… | 23 | 0 | 14 | 29 | 10 |
| 129 | 3718487 | 2023-01-27 | Кібератака Sandworm на інформаційно-комунікаційну систему У… | 28 | 0 | 14 | 29 | 10 |
| 130 | 3761023 | 2023-02-01 | Активність групи UAC-0114 (Winter Vivern) у відношенні держ… | 25 | 0 | 14 | 29 | 10 |
| 131 | 3804703 | 2023-02-06 | Кібератака UAC-0050 у відношенні державних органів України… | 27 | 0 | 14 | 29 | 10 |
| 132 | 3863542 | 2023-02-13 | Кібератака на організації та установи України з використанн… | 30 | 0 | 14 | 29 | 10 |
| 133 | 3931296 | 2023-02-21 | Кібератака групи UAC-0050 (UAC-0096) з використанням програ… | 35 | 0 | 14 | 29 | 10 |
| 134 | 3947787 | 2023-02-23 | Кібератака, спрямована на порушення цілісності та доступнос… | 26 | 0 | 14 | 29 | 10 |
| 135 | 4279195 | 2023-04-03 | Використання неліцензійних програм Microsoft Office як вект… | 15 | 0 | 14 | 29 | 10 |
| 136 | 4492467 | 2023-04-28 | Кібератака групи APT28: розповсюдження електронних листів з… | 21 | 0 | 14 | 29 | 10 |
| 137 | 4501891 | 2023-04-29 | WinRAR як "кіберзброя". Деструктивна кібератака UAC-0165 (й… | 18 | 0 | 14 | 29 | 10 |
| 138 | 4555802 | 2023-05-05 | Повернення UAC-0006: масове розповсюдження SmokeLoader з ви… | 29 | 0 | 14 | 29 | 10 |
| 139 | 4697016 | 2023-05-22 | Шпигунська активність UAC-0063 у відношенні України, Казахс… | 38 | 0 | 14 | 29 | 10 |
| 140 | 4755642 | 2023-05-29 | Кібератака UAC-0006: розповсюдження SmokeLoader з використа… | 29 | 0 | 14 | 29 | 10 |
| 141 | 4789582 | 2023-06-02 | Розсилання SMS-повідомлень з темою судових повісток з викор… | 17 | 0 | 14 | 29 | 10 |
| 142 | 4818341 | 2023-06-05 | UAC-0099: кібершпигунство у відношенні державних організаці… | 20 | 0 | 14 | 29 | 10 |
| 143 | 4905718 | 2023-06-16 | Кібератака групи UAC-0057 (GhostWriter) у відношенні держав… | 23 | 0 | 14 | 29 | 10 |
| 144 | 4905829 | 2023-06-20 | Групою APT28 застосовано три експлойти для Roundcube (CVE-2… | 37 | 0 | 14 | 29 | 10 |
| 145 | 4928679 | 2023-06-19 | Цільові кібератаки UAC-0102 у відношенні користувачів серві… | 16 | 0 | 14 | 29 | 10 |
| 146 | 5077168 | 2023-07-05 | Цільова атака з використанням тематики членства України в О… | 20 | 0 | 14 | 29 | 10 |
| 147 | 5098518 | 2023-07-07 | Цільова кібератака UAC-0057 у відношенні державних органів… | 17 | 0 | 14 | 29 | 10 |
| 148 | 5105791 | 2023-07-08 | Фішингові атаки групи APT28 (UAC-0028) з метою отримання ав… | 39 | 0 | 14 | 29 | 10 |
| 149 | 5158006 | 2023-07-13 | Кібератака UAC-0006: розповсюдження SmokeLoader з використа… | 15 | 0 | 14 | 29 | 10 |
| 150 | 5160737 | 2023-07-13 | Зведена інформація щодо діяльності угрупування UAC-0010 ста… | 23 | 0 | 14 | 29 | 10 |
| 151 | 5213167 | 2023-07-18 | Цільові атаки Turla (UAC-0024, UAC-0003) з використанням шк… | 17 | 0 | 14 | 29 | 10 |
| 152 | 5269451 | 2023-07-24 | Рівень загрози для бухгалтерів зростає: угрупуванням UAC-00… | 20 | 0 | 14 | 29 | 10 |
| 153 | 5391805 | 2023-08-05 | MerlinAgent: новий open-source інструмент для здійснення кі… | 17 | 0 | 14 | 29 | 10 |
| 154 | 5436463 | 2023-08-09 | Як бути відповідальним та втримати кіберфронт | 24 | 0 | 14 | 29 | 10 |
| 155 | 5455833 | 2023-08-11 | "Змініть пароль до Roundcube": чергова фішингова атака з ви… | 15 | 0 | 14 | 29 | 10 |
| 156 | 5628441 | 2023-08-28 | UAC-0173: органи юстиції та нотаріат "під прицілом" (CERT-U… | 19 | 0 | 14 | 29 | 10 |
| 157 | 5661411 | 2023-08-31 | Кібератака UAC-0057: експлойт для CVE-2023-38831, JavaScrip… | 25 | 0 | 14 | 29 | 10 |
| 158 | 5702579 | 2023-09-04 | Кібератака APT28: msedge як завантажувач, TOR та сервіси mo… | 25 | 0 | 14 | 29 | 10 |
| 159 | 6032734 | 2023-10-06 | Нарощування темпів UAC-0006, мільйонні збитки (CERT-UA#7648… | 25 | 0 | 14 | 29 | 10 |
| 160 | 6123309 | 2023-10-15 | Особливості деструктивних кібератак Sandworm у відношенні у… | 15 | 0 | 14 | 29 | 10 |
| 161 | 6276351 | 2023-11-13 | Кібератака UAC-0050 з використанням Remcos RAT, замаскована… | 26 | 0 | 14 | 29 | 10 |
| 162 | 6276567 | 2023-11-30 | "Повістка до суду": чергова цільова атака UAC-0050 з викори… | 15 | 0 | 14 | 29 | 10 |
| 163 | 6276584 | 2023-12-01 | Зведена інформація щодо діяльності угрупування UAC-0006 ста… | 30 | 0 | 14 | 29 | 10 |
| 164 | 6276652 | 2023-12-07 | Масова кібератака UAC-0050 з використанням RemcosRAT/Meduza… | 23 | 0 | 14 | 29 | 10 |
| 165 | 6276799 | 2023-12-19 | Modus operandi UAC-0177 (JokerDPR) на прикладі однієї з кіб… | 38 | 0 | 14 | 29 | 10 |
| 166 | 6276824 | 2023-12-21 | "Заборгованість Київстар", "Запит СБУ": нова атака UAC-0050… | 20 | 0 | 14 | 29 | 10 |
| 167 | 6276894 | 2023-12-28 | APT28: від первинного ураження до створення загроз для конт… | 27 | 0 | 14 | 29 | 10 |
| 168 | 6276988 | 2024-01-06 | UAC-0184: Цільові атаки у відношенні українських військовос… | 18 | 0 | 14 | 29 | 10 |
| 169 | 6277063 | 2024-01-11 | RemcosRAT, QuasarRAT, RemoteUtilities на озброєнні UAC-0050… | 23 | 0 | 14 | 30 | 10 |
| 170 | 6277285 | 2024-01-22 | Листи нібито від Держспецзв'язку та ДСНС - атака UAC-0050 з… | 38 | 0 | 14 | 30 | 10 |
| 171 | 6277422 | 2024-01-31 | UAC-0027: DIRTYMOE (PURPLEFOX) уражено більше 2000 комп'юте… | 20 | 0 | 14 | 30 | 10 |
| 172 | 6277822 | 2024-02-22 | Щодо обстановки в сфері кібер на 23-24 лютого 2024 року | 21 | 0 | 14 | 30 | 10 |
| 173 | 6277849 | 2024-02-24 | UAC-0149: Цільові вибіркові атаки у відношенні Сил оборони… | 15 | 0 | 14 | 30 | 10 |
| 174 | 6277896 | 2024-02-28 | АНОНС: Практичний семінар для кіберфахівців | 7 | 0 | 14 | 30 | 10 |
| 175 | 6278274 | 2024-04-01 | Фактор кібербезпеки | 13 | 0 | 14 | 30 | 10 |
| 176 | 6278521 | 2024-04-16 | Месенджери та сайти знайомств - нові способи проведення ата… | 25 | 0 | 14 | 30 | 10 |
| 177 | 6278620 | 2024-04-18 | Чергова кібератака UAC-0149 з використанням Signal, вразлив… | 18 | 0 | 14 | 30 | 10 |
| 178 | 6278706 | 2024-04-19 | Плани UAC-0133 (Sandworm) щодо кібердиверсії на майже 20 об… | 17 | 0 | 14 | 30 | 10 |
| 179 | 6278735 | 2024-04-20 | Викрадення акаунту WhatsApp під виглядом голосування за еле… | 39 | 0 | 14 | 30 | 10 |
| 180 | 6279366 | 2024-05-21 | Весняне загострення: UAC-0006 активізувало кібератаки | 26 | 0 | 14 | 30 | 10 |
| 181 | 6279419 | 2024-05-23 | UAC-0188: Цільові кібератаки з використанням SuperOps RMM (… | 36 | 0 | 14 | 30 | 10 |
| 182 | 6279561 | 2024-06-04 | UAC-0200: Цільові кібератаки з використанням DarkCrystal RA… | 17 | 0 | 14 | 30 | 10 |
| 183 | 6279600 | 2024-06-05 | UAC-0020 (Vermin) атакує Сили оборони України з використанн… | 14 | 0 | 14 | 30 | 10 |
| 184 | 6280099 | 2024-07-17 | Цільові кібератаки UAC-0180 у відношенні оборонних підприєм… | 22 | 0 | 14 | 30 | 10 |
| 185 | 6280129 | 2024-07-21 | UAC-0063 атакує науково-дослідні установи України: HATVIBE… | 33 | 0 | 14 | 30 | 10 |
| 186 | 6280159 | 2024-07-24 | Точковий сплеск активності UAC-0057 (CERT-UA#10340) | 11 | 0 | 14 | 30 | 10 |
| 187 | 6280183 | 2024-07-24 | Кібератаки UAC-0102 з метою викрадення автентифікаційних да… | 24 | 0 | 14 | 30 | 10 |
| 188 | 6280345 | 2024-08-12 | UAC-0198: Масове розповсюдження ANONVNC (MESHAGENT) серед д… | 30 | 0 | 14 | 30 | 10 |
| 189 | 6280422 | 2024-08-19 | Кібератака UAC-0020 (Vermin) з використанням тематики війсь… | 15 | 0 | 14 | 30 | 10 |
| 190 | 6280563 | 2024-09-04 | Спроби кібератак на військові системи за допомогою шкідливи… | 38 | 0 | 14 | 30 | 10 |
| 191 | 6281009 | 2024-10-15 | Тріада UAC-0050: кібершпигунство, фінансові злочини, інформ… | 17 | 0 | 14 | 30 | 10 |
| 192 | 6281018 | 2024-10-16 | Розповсюдження MEDUZASTEALER засобами Telegram, начебто, ві… | 25 | 0 | 14 | 31 | 10 |
| 193 | 6281076 | 2024-10-23 | Файли конфігурацій RDP як засіб отримання віддаленого досту… | 20 | 0 | 14 | 31 | 10 |
| 194 | 6281095 | 2024-10-24 | Тематика рахунків на озброєнні UAC-0218: викрадення файлів… | 22 | 0 | 14 | 31 | 10 |
| 195 | 6281123 | 2024-10-25 | Кібератака UAC-0001 (APT28): PowerShell-команда в буфері об… | 14 | 0 | 14 | 31 | 10 |
| 196 | 6281202 | 2024-10-30 | Кібератака UAC-0050 з використанням податкової тематики та… | 24 | 0 | 14 | 31 | 10 |
| 197 | 6281632 | 2024-12-07 | Цільові кібератаки UAC-0185 у відношенні Сил оборони та під… | 28 | 0 | 14 | 31 | 10 |
| 198 | 6281681 | 2024-12-14 | "Повідомлення про порушення" від UAC-0099 (CERT-UA#12463) | 25 | 0 | 14 | 31 | 10 |
| 199 | 6281701 | 2024-12-18 | Кібератака UAC-0125 з використанням тематики "Армія+" (CERT… | 29 | 0 | 14 | 31 | 10 |
| 200 | 6282069 | 2025-01-17 | Спроби здійснення кібератак з використанням AnyDesk, нібито… | 2 | 0 | 14 | 31 | 10 |
| 201 | 6282517 | 2025-02-23 | Цільова активність UAC-0212 у відношенні розробників та пос… | 20 | 0 | 14 | 31 | 10 |
| 202 | 6282536 | 2025-02-25 | UAC-0173 проти Нотаріату України (CERT-UA#13738) | 19 | 0 | 14 | 31 | 10 |
| 203 | 6282737 | 2025-03-18 | UAC-0200: Шпигунство за оборонно-промисловим комплексом за… | 32 | 0 | 14 | 31 | 10 |

## Cost

Covers the last invocation of the driver only. USD is not recorded (unpriced: gemini/gemini-3.7-flash, gemini/gemini-embedding-2). Wall clock 240.2 s.

| operator | calls | input tokens | output tokens |
|---|---|---|---|
| scheme-name | 14 | 10685 | 885 |
| extract | 22 | 170902 | 37223 |
| embed-gloss | 22 | 0 | 0 |
| embed-kind | 2 | 0 | 0 |
| total | 60 | 181587 | 38108 |

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
