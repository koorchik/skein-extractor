# 2026-09-18-gemini-full204-relblind

Exploratory full-stream run (all 204 reports, numeric-id order) with the fully blind extraction prompt extract-open-relblind-v1: no scheme list and no relation inventory in the prompt, so the extraction of a document depends on that document alone. Extraction ran for all documents at once (12 calls in flight) before the sequential fold; kind-first 0.9, tau 0.80, pool link 0.85, mass 3. Source of cached extractions for threshold studies of the scheme layer and of the relation layer. Not pre-registered, not reportable.

<!-- GENERATED below this line by `npm run run-readme` from run-card.json and the run files. Edit only the text above. -->

## At a glance

|  |  |
|---|---|
| Documents | 204 (stream positions 1–204, dated 2018-02-15 to 2025-03-18) |
| Mentions | 3955 |
| Schemes | 34 |
| Pool (mentions without a scheme at the end) | 146 (3.7%) |
| Relation types | 195 |
| Naming calls | 40 |
| Hand-category overlay coverage | 2509 of 3955 mentions (63.4%) |

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
| S1 | Software Product | 332 | 4 (20) | Software Application, Software Program, Software | A software application, program, plugin, utility, or suite developed to perform specific computing tasks or services. |
| S2 | Operating System | 60 | 6 (23) | OS, Operating Platform | System software that manages computer hardware and software resources and provides common services for computer programs. |
| S3 | Software Vendor | 37 | 6 (23) | Software Company, Technology Vendor, Software Developer | An organization or commercial enterprise that develops, manufactures, or distributes software products and technology services. |
| S4 | Security Vulnerability | 117 | 7 (24) | Vulnerability, Software Vulnerability, CVE | A flaw, bug, or weakness in a system or software that can be exploited by an attacker. |
| S5 | Uniform Resource Locator | 151 | 7 (24) | URL, Web Address, Web Link | A web address that specifies the location of a resource on a computer network and the mechanism for retrieving it. |
| S6 | Country | 204 | 8 (25) | Nation, Sovereign State | A distinct territorial body or sovereign state with its own government, borders, and population. |
| S7 | Government Organization | 133 | 9 (26) | Government Agency, Government Body, State Agency | A public sector authority, ministry, department, or agency established by a state to perform specific administrative or regulatory functions. |
| S8 | Security Advisory | 33 | 14 (2624) | Security Bulletin, Vulnerability Advisory | A formal public notice published by a vendor or organization detailing security vulnerabilities, risks, and remediation measures for software or hardware. |
| S9 | Person | 17 | 26 (2691) | Individual, Human | An individual human being, such as a government official, cybersecurity expert, researcher, or public figure. |
| S10 | Company | 58 | 27 (2693) | Commercial Enterprise, Corporation, Business | A commercial business enterprise, corporation, or non-governmental firm providing goods or services. |
| S11 | Cybersecurity Company | 12 | 28 (2695) | Cybersecurity Firm, Security Company, Security Vendor | A commercial organization that provides cybersecurity products, threat intelligence, security research, or information security services. |
| S12 | Malicious File | 775 | 29 (2697) | Malware File, Malicious Attachment, Malicious Payload | A digital file crafted, modified, or distributed by threat actors to execute attacks, deliver malware, or compromise systems. |
| S13 | IP Address | 408 | 30 (2699) | Internet Protocol Address | A unique numerical identifier assigned to a device or network endpoint communicating over the Internet Protocol. |
| S14 | Email Address | 125 | 30 (2699) | E-mail Address, Electronic Mail Address | A unique identifier for an electronic mail account used to send and receive digital messages across a computer network. |
| S15 | Domain Name | 749 | 32 (2703) | Internet Domain, Fully Qualified Domain Name, Domain | A text-based identifier used to name and locate network resources and computers connected to the internet. |
| S16 | Malware Family | 266 | 32 (2703) | Malware, Malicious Software Family | A distinct group, variant, or category of malicious software sharing common code, behavior, or operational characteristics. |
| S17 | Software Component | 19 | 38 (2724) | Software Module, System Component, Software Library | A modular part, library, subsystem, or service integrated within a larger software application or operating system. |
| S18 | International Organization | 13 | 42 (2728) | Intergovernmental Organization, Supranational Organization | An intergovernmental or transnational body established by treaty or agreement among multiple sovereign states. |
| S19 | Threat Actor | 156 | 69 (18163) | Threat Group, Hacker Group, Cyber Threat Actor | An individual, group, or organization that conducts malicious cyber activities, attacks, or espionage campaigns against target systems. |
| S20 | Programming Language | 4 | 87 (38374) | Scripting Language, Coding Language | A formal system of rules, syntax, and symbols used to write instructions and computer programs for software execution. |
| S21 | Hosting Provider | 35 | 97 (39727) | Web Hosting Provider, Cloud Hosting Provider, Hosting Service Provider | An organization that provides computing infrastructure, server capacity, cloud services, or web hosting services to customers. |
| S22 | Social Media Platform | 11 | 105 (40263) | Social Network, Social Media Service | An online platform or service that facilitates social networking, user communication, and content sharing. |
| S23 | Military Organization | 21 | 123 (2394117) | Armed Forces, Military Unit | A state-authorized armed force, defense body, or military unit tasked with national defense and warfare operations. |
| S24 | Online Service | 22 | 136 (4492467) | Web Service, Cloud Service, Online Platform | An internet-hosted platform or application providing specific functionality, APIs, or digital services to users over a network. |
| S25 | Incident Response Team | 9 | 145 (4928679) | Computer Emergency Response Team, CSIRT, CERT | An organization or team responsible for analyzing, handling, and responding to computer security incidents and cyber threats. |
| S26 | Non-Governmental Organization | 5 | 146 (5077168) | NGO, Nonprofit Organization | A non-profit, citizen-based organization that operates independently of government to address social, political, educational, or humanitarian issues. |
| S27 | Social Media Account | 7 | 154 (5436463) | Social Media Channel, Social Media Profile, Online Account | An account, channel, or profile on a social networking or messaging platform used to publish content and communicate with users. |
| S28 | Anonymity Network | 3 | 160 (6123309) | Privacy Network, Overlay Network, Darknet | A specialized overlay network or routing system designed to enable private and anonymous communication over the internet. |
| S29 | Registry Key | 4 | 161 (6276351) | Windows Registry Key, Registry Path, Registry Entry | A database entry or path in an operating system registry used to store configuration settings, application data, or system options. |
| S30 | Email Service Provider | 3 | 165 (6276799) | Email Service, Email Provider, Webmail Provider | A platform, organization, or infrastructure providing electronic mail transmission, hosting, and webmail services to users. |
| S31 | Autonomous System | 6 | 166 (6276824) | Autonomous System Number, ASN, AS Number | A connected group of IP routing prefixes managed by network operators with a single, clearly defined routing policy. |
| S32 | Telecommunications Provider | 3 | 166 (6276824) | Telecommunications Company, Telecom Operator, Telco | An enterprise or organization that provides telecommunications, mobile network, voice, or internet connectivity services. |
| S33 | Messaging Platform | 7 | 175 (6278274) | Instant Messaging Service, Messaging Application, Chat Platform | A digital service or application that enables real-time text, voice, or multimedia messaging and communication between users over the internet. |
| S34 | Scheduled Task | 4 | 190 (6280422) | Scheduled Job, Cron Job | An operating system configuration configured to automatically execute a script, program, or command at specified times or system events. |

## Naming verdicts in stream order

- document 4 (20): `new` S1 Software Product, 8 mentions
- document 6 (23): `new` S2 Operating System, 7 mentions
- document 6 (23): `new` S3 Software Vendor, 6 mentions
- document 7 (24): `new` S4 Security Vulnerability, 7 mentions
- document 7 (24): `new` S5 Uniform Resource Locator, 3 mentions
- document 8 (25): `new` S6 Country, 3 mentions
- document 9 (26): `new` S7 Government Organization, 4 mentions
- document 14 (2624): `new` S8 Security Advisory, 25 mentions
- document 26 (2691): `new` S9 Person, 7 mentions
- document 27 (2693): `new` S10 Company, 4 mentions
- document 28 (2695): `new` S11 Cybersecurity Company, 3 mentions
- document 29 (2697): `new` S12 Malicious File, 6 mentions
- document 30 (2699): `new` S13 IP Address, 5 mentions
- document 30 (2699): `new` S14 Email Address, 4 mentions
- document 32 (2703): `new` S15 Domain Name, 20 mentions
- document 32 (2703): `new` S16 Malware Family, 3 mentions
- document 34 (2718): `alias-of` S15 Domain Name, 5 mentions absorbed
- document 38 (2724): `new` S17 Software Component, 6 mentions
- document 42 (2728): `new` S18 International Organization, 3 mentions
- document 69 (18163): `new` S19 Threat Actor, 3 mentions
- document 87 (38374): `new` S20 Programming Language, 3 mentions
- document 97 (39727): `new` S21 Hosting Provider, 6 mentions
- document 99 (39923): `alias-of` S7 Government Organization, 3 mentions absorbed
- document 105 (40263): `new` S22 Social Media Platform, 3 mentions
- document 123 (2394117): `alias-of` S10 Company, 5 mentions absorbed
- document 123 (2394117): `new` S23 Military Organization, 3 mentions
- document 125 (2698320): `alias-of` S17 Software Component, 3 mentions absorbed
- document 136 (4492467): `new` S24 Online Service, 3 mentions
- document 145 (4928679): `new` S25 Incident Response Team, 4 mentions
- document 146 (5077168): `new` S26 Non-Governmental Organization, 3 mentions
- document 148 (5105791): `alias-of` S24 Online Service, 3 mentions absorbed
- document 152 (5269451): `alias-of` S12 Malicious File, 5 mentions absorbed
- document 154 (5436463): `new` S27 Social Media Account, 7 mentions
- document 160 (6123309): `new` S28 Anonymity Network, 3 mentions
- document 161 (6276351): `new` S29 Registry Key, 4 mentions
- document 165 (6276799): `new` S30 Email Service Provider, 3 mentions
- document 166 (6276824): `new` S31 Autonomous System, 5 mentions
- document 166 (6276824): `new` S32 Telecommunications Provider, 3 mentions
- document 175 (6278274): `new` S33 Messaging Platform, 6 mentions
- document 190 (6280422): `new` S34 Scheduled Task, 4 mentions

## Assignment decisions

One event per decision; a pooled mention that is assigned later appears twice. `drain` is a pooled mention re-tested after a mint.

| decision | events |
|---|---|
| assign: kind-first | 2804 |
| assign: knn | 733 |
| pool: below-tau | 383 |
| assign: drain | 61 |
| pool: no-schemes | 33 |
| pool: ambiguous | 2 |

## What stayed in the pool

146 mentions, 103 distinct kind phrases: data format (4), encryption standard (4), sha1 hash (4), web browser (4), email client (3), law enforcement agency (3), md5 hash (3), tunneling tool (3), web address (3), commercial bank (2), cyber campaign (2), data exfiltration tool (2), diplomatic mission (2), environment variable (2), hardware model (2), and 88 more kinds.

## Relation types

| type | relations | aliases | born at document | definition |
|---|---|---|---|---|
| addresses-vulnerability-in | 85 | 5 | 1 | The security advisory or update provides patches or mitigations for a specific software product. |
| contains-file | 85 | 0 | 32 | An archive or package contains a specific file inside it. |
| uses-malware | 79 | 2 | 54 | The threat actor employs the specified malware family in their operations. |
| uses-tool | 60 | 2 | 55 | The subject employs or integrates the specified software tool or utility to perform its function. |
| communicates-with-c2 | 55 | 3 | 32 | A malware family contacts an external command and control server. |
| downloads-payload | 48 | 4 | 32 | A script or dropper downloads a secondary payload or malicious component. |
| located-in-country | 43 | 1 | 42 | An IP address or infrastructure element is geographically located in a specified country. |
| hosts-file | 41 | 1 | 7 | Indicates that a network resource or URL serves a specific file payload. |
| executes | 38 | 5 | 34 | Indicates that an entity launches or executes another script or program. |
| drops-and-executes | 32 | 3 | 8 | The head file or process extracts, drops, or initiates the execution of the tail malware component. |
| impersonates | 30 | 4 | 9 | Indicates that an entity falsely presents itself as or mimics the identity of another entity. |
| affects | 28 | 2 | 2 | The head vulnerability exists in or impacts the tail software product. |
| hosted-on | 27 | 0 | 41 | A URL is hosted on or belongs to a specific internet domain. |
| hosts-infrastructure-on | 26 | 3 | 82 | The threat actor maintains servers or infrastructure on a specified hosting provider's network. |
| publishes-advisory | 25 | 0 | 1 | The software vendor or organization publishes a security advisory or patch update. |
| subordinate-to | 25 | 3 | 8 | The head organizational entity is structurally or administratively subordinate to the tail entity. |
| targets-sector | 23 | 3 | 30 | The malware or threat actor directs malicious activities against a specific sector or group of organizations. |
| deploys-software | 20 | 4 | 69 | A threat actor or process installs or executes a specific software tool on a target system. |
| is-instance-of | 20 | 4 | 40 | The source file or artifact is an identified sample of the target malware family. |
| operates-from | 20 | 3 | 25 | The subject threat actor conducts operations from or is located in the target geographic area. |
| associated-with-activity | 19 | 5 | 79 | The threat actor is associated with or responsible for the campaign deploying the specified tool or malware. |
| exploited-vulnerability | 18 | 2 | 20 | Identifies a security vulnerability leveraged by malware or a threat actor to execute code or compromise a system. |
| resolves-to-ip | 17 | 0 | 30 | A domain name or hostname resolves to a specific IP address. |
| delivers | 15 | 3 | 67 | The subject malware or tool is used to distribute or deploy the target payload. |
| steals-credentials-from | 15 | 2 | 46 | The subject malware contains functionality specifically designed to harvest stored passwords or authentication data from the target software product. |
| attributed-to-country | 14 | 5 | 54 | The threat actor is associated with or sponsored by a specified nation-state. |
| executes-payload | 14 | 3 | 78 | Indicates that a loader or injector decodes, loads, and executes a final payload. |
| uses-service | 14 | 3 | 49 | The malware or threat actor uses an online infrastructure service for operational capabilities. |
| distributes-malware | 13 | 2 | 43 | Specifies that an entity or address sends or spreads malicious software. |
| government-body-of | 12 | 4 | 62 | Indicates that a government department or ministry belongs to a specific country. |
| hosted-on-ip | 10 | 1 | 7 | Specifies the IP address associated with a particular network address or URL. |
| targets-user-credentials-of | 10 | 3 | 141 | A malicious resource or attack activity is designed to steal user credentials or sessions for a specified platform. |
| contains | 9 | 1 | 67 | The subject file or package embeds or bundles the target tool or payload inside itself. |
| develops-software | 9 | 3 | 12 | The vendor or organization creates, develops, or maintains the software product. |
| hosts | 9 | 0 | 107 | Indicates that an IP address or infrastructure hosts or distributes a specific malicious file. |
| implemented-as | 9 | 2 | 83 | A malware family or payload is realized and distributed in the form of a specific binary or library file. |
| protected-by | 9 | 1 | 42 | A software file or binary is obfuscated, packed, or protected by a specific security or packing software. |
| belongs-to-network-of | 8 | 2 | 53 | The subject IP address is allocated to or belongs to the network infrastructure of the object organization. |
| downloads-from | 8 | 1 | 57 | The source software or malware initiates network connections to retrieve content from the target URL or address. |
| executes-script-via | 8 | 3 | 28 | The malware or malicious file executes scripts or commands using the specified tool or interpreter. |
| installs-software | 8 | 2 | 53 | The subject installer or executable installs or deploys the object software product. |
| uses-contact-email | 8 | 1 | 101 | The subject organization uses the target email address for official communication or incident reporting. |
| distributes-file | 7 | 0 | 42 | An email address or sender sends an attachment or file to targets. |
| exfiltrates-data-to-email | 7 | 4 | 49 | The malware transmits stolen or harvested data to the specified email address. |
| is-component-of | 7 | 1 | 4 | Indicates that the head entity is a sub-component, application, or module of the tail software suite or system. |
| abuses-tool | 6 | 0 | 119 | The subject uses or leverages a legitimate system utility or tool for malicious execution. |
| affects-technology | 6 | 0 | 37 | The subject vulnerability or attack technique compromises or impacts the target software or standard. |
| leads-organization | 6 | 1 | 22 | An individual holds the primary leadership or secretarial office of an organization. |
| targets-region | 6 | 2 | 44 | The subject malware or threat actor conducts attacks against entities located in a specific geographic region. |
| tracked-as | 6 | 0 | 36 | Identifies the standard vulnerability identifier (such as CVE) assigned to a named vulnerability or attack technique. |
| uses-domain | 6 | 0 | 117 | Links an email address or resource to the internet domain it is registered under. |
| creates-file | 5 | 0 | 49 | The subject creates, drops, or writes the specified file to the file system. |
| drops-malware | 5 | 0 | 100 | Indicates that an executable or component installs or infects the host with a specific malware family. |
| has-component | 5 | 0 | 82 | The malware suite includes the specified functional module or plugin component. |
| operates-in-country | 5 | 1 | 8 | The head entity belongs to or operates within the jurisdiction of the tail country. |
| registered-domain | 5 | 2 | 128 | The head email address was used to register the tail domain name. |
| registered-with | 5 | 1 | 97 | The subject domain name is registered through the object domain name registrar. |
| targets-os | 5 | 1 | 84 | The malware is designed to execute against or impact components of the specified operating system. |
| associated-with-group | 4 | 2 | 100 | Indicates an operational or organizational link between two threat actors or groups. |
| conducted | 4 | 3 | 147 | The threat actor carried out the specified campaign or operation. |
| connects-to-ip | 4 | 2 | 125 | The source malware or application establishes a network connection to the target IP address. |
| delivers-file | 4 | 0 | 41 | A URL provides or serves a specific file. |
| identifies-vulnerability-in | 4 | 1 | 37 | The subject CVE identifier formally catalogs a security vulnerability found in the target software or standard. |
| injects-into-process | 4 | 1 | 40 | The source malware family or executable injects its code into or compromises the target system process. |
| is-part-of | 4 | 2 | 71 | Identifies a sub-unit, branch, or component belonging to a parent organization. |
| opens-decoy | 4 | 1 | 34 | Specifies that an entity opens a decoy document to mislead the user. |
| operates-instance-of | 4 | 0 | 101 | The subject entity hosts, deploys, or operates a local instance of the target software platform. |
| redirects-to | 4 | 0 | 19 | Indicates that a script or web page forwards the victim's browser to an external destination URL. |
| unpacks-file | 4 | 0 | 47 | Indicates that an executable or dropper extracts or unpacks a payload file onto the system. |
| displays-cryptocurrency-address | 3 | 1 | 68 | Indicates that a malware sample or document presents a specific cryptocurrency wallet address to the victim. |
| distributed-via | 3 | 1 | 183 | The malware is propagated or delivered using a specific service or platform. |
| has-hash | 3 | 0 | 68 | Specifies a cryptographic hash value associated with a malware sample or file. |
| hosted-on-platform | 3 | 1 | 105 | The subject resource or page is published or hosted on the object online service or platform. |
| implements | 3 | 1 | 80 | The source file or component is an instance or implementation of the target malware family. |
| operates-autonomous-system | 3 | 1 | 74 | The organization or company operates the specified autonomous system on the internet. |
| operates-on-platform | 3 | 2 | 114 | The threat actor conducts malicious or fraudulent activities using a specific social media or online platform. |
| operates-scheme | 3 | 2 | 114 | The threat actor manages or deploys a specific fraudulent brand, pretext, or scheme. |
| tracks-activity-using | 3 | 2 | 96 | The threat group or tracking identifier is associated with malicious activity involving the target entity. |
| abuses-domain | 2 | 0 | 136 | The threat actor uses or exploits the specified internet domain to deliver payloads or receive exfiltrated data. |
| affects-hardware | 2 | 0 | 5 | Identifies hardware devices or equipment models impacted by a specific security vulnerability. |
| associated-with-crypter-for | 2 | 0 | 96 | The threat group is associated with the crypter software used to protect the target file. |
| associated-with-domain | 2 | 1 | 34 | Specifies that an IP address is linked to or provides a service hosted under a given domain. |
| communicates-with | 2 | 0 | 57 | The source entity establishes network communication or sends data to the target endpoint. |
| compromised | 2 | 0 | 25 | The subject threat actor gained unauthorized access to or breached the target software, system, or organization. |
| connects-to | 2 | 1 | 72 | A script or program initiates a network connection to an external service or host. |
| consolidated-with | 2 | 1 | 133 | Indicates that one threat actor identifier or tracking cluster is merged or tracked together with another. |
| contains-script | 2 | 1 | 19 | Indicates that a malicious file contains or embeds a specific script or payload. |
| created-with | 2 | 0 | 184 | A file or executable was built or packaged using the specified software tool. |
| distributes-link | 2 | 0 | 42 | An email address or sender delivers a message containing a specific URL. |
| has-alias | 2 | 1 | 117 | Identifies an alternate name or pseudonym for an entity. |
| hosted-by-provider | 2 | 0 | 149 | The network address or resource is hosted or managed by the specified service provider. |
| hosts-ip | 2 | 0 | 145 | The hosting provider or autonomous system provides infrastructure hosting for an IP address. |
| impersonates-organization | 2 | 1 | 169 | Head threat actor mimics or uses the name of the tail organization as a lure in social engineering attacks. |
| impersonates-system | 2 | 0 | 191 | The subject malicious file or artifact masquerades as the legitimate software system. |
| implements-standard | 2 | 0 | 61 | Indicates that an organization adopts, introduces, or implements a specific regulatory document, framework, or standard. |
| includes-software | 2 | 0 | 149 | The software suite or platform includes the specified component or executable binary. |
| is-variant-of | 2 | 1 | 119 | The subject is a technical re-implementation, version, or derivation of the target software/malware. |
| maintains-standard | 2 | 0 | 51 | An organization develops, supports, or manages a technical specification or standard. |
| mimics-service | 2 | 0 | 195 | A domain, link, or asset masquerades as a legitimate service or brand. |
| obfuscated-with | 2 | 0 | 162 | The source program or binary has been protected or obfuscated using the target software product. |
| originates-from-ip | 2 | 1 | 29 | Indicates the source IP address from which an email or network transmission was sent. |
| provides-information-on | 2 | 0 | 66 | The URL or resource contains documentation or technical details concerning the entity. |
| published-advisory-at | 2 | 1 | 21 | Indicates that an organization published a security advisory or guidance at the specified URL. |
| publishes-to | 2 | 1 | 51 | An entity publishes data, code, or resources to an external platform or service. |
| registers-domains-via | 2 | 0 | 165 | The threat actor uses the specified domain registrar to register malicious domain names. |
| runs-on | 2 | 0 | 10 | Indicates the operating system or computing platform on which a software product executes. |
| signs-agreement-with | 2 | 1 | 17 | An entity formally signs a cooperation or bilateral agreement with another entity. |
| spawns-process | 2 | 0 | 47 | Indicates that a process launches another process during execution. |
| spoofs | 2 | 1 | 48 | Indicates that a malicious entity or domain mimics the identity or name of a legitimate one. |
| supports | 2 | 1 | 23 | An entity provides assistance, funding, or backing to another entity or state. |
| targets-software | 2 | 0 | 134 | Indicates that a malware implant is designed to integrate with or operate inside a specific software product. |
| written-in | 2 | 0 | 70 | The head software or malware was authored using the tail programming language. |
| abuses-account | 1 | 0 | 202 | Denotes that an attacker compromises and uses an email or system account to facilitate further attacks. |
| acted-as-head-of | 1 | 0 | 26 | The head person served as the director or acting leader of the tail organization. |
| affects-vendor-products | 1 | 0 | 122 | The vulnerability affects products developed by the specified vendor. |
| affiliated-with | 1 | 0 | 159 | The subject person or entity is associated with or manages the object organization. |
| allows-unauthorized-access-to | 1 | 0 | 77 | Indicates a file, component, or system that can be accessed without proper authorization due to a vulnerability. |
| authored-tool | 1 | 0 | 78 | Indicates that a person or developer created a specific software tool or malware. |
| based-on | 1 | 0 | 51 | A format, technology, or standard is built upon or derived from another format or standard. |
| belongs-to-domain | 1 | 0 | 181 | The email address is hosted under or derived from the specified internet domain. |
| classified-as | 1 | 0 | 135 | Specifies the malware family or detection signature category assigned to a file. |
| co-chairs | 1 | 0 | 22 | An individual serves as a co-chairperson of a committee, commission, or working body. |
| collaborates-with | 1 | 0 | 23 | An entity works in partnership or cooperation with another entity. |
| compromises-devices-from | 1 | 0 | 74 | The malware or botnet compromises and leverages hardware products produced by the specified vendor. |
| contains-malware | 1 | 0 | 84 | The archive or container file carries the specified malware executable or code. |
| created-filter | 1 | 0 | 196 | The exploit or incident resulted in the creation of the specified email filter rule. |
| creates-service | 1 | 0 | 69 | A software program or malware creates a system service on the host for persistence or background execution. |
| directs-threat-actor | 1 | 0 | 151 | A government body or sponsor commands or coordinates a threat actor's activities. |
| disables | 1 | 0 | 67 | The subject tool or command deactivates or stops the operation of the target security software. |
| disclosed-vulnerability | 1 | 0 | 66 | The entity publicly released information or an advisory regarding a security vulnerability. |
| distributed-as | 1 | 0 | 190 | The head malware is instantiated or distributed under the filename of the tail entity. |
| documents-vulnerability-in | 1 | 0 | 65 | The subject is a security advisory describing a vulnerability in the target software product. |
| embeds-code-of | 1 | 0 | 181 | The file or script incorporates source code from the specified application or project. |
| employs-technique | 1 | 0 | 119 | The threat actor applies a specific tactic, technique, or operational method during attacks. |
| established-group | 1 | 0 | 22 | An organization or authority created or constituted a specific working group or expert panel. |
| establishes-persistence-via | 1 | 0 | 138 | A malware program creates or configures an artifact such as a scheduled task to maintain survival across reboots. |
| executes-module | 1 | 0 | 184 | A program component loads, calls, or executes another software library or module. |
| exfiltrates-data-from | 1 | 0 | 139 | A tool or malware collects and exfiltrates data generated by another component. |
| formerly-known-as | 1 | 0 | 172 | Indicates a previous brand name or identity previously operated by a threat group. |
| founded | 1 | 0 | 23 | The person founded or established the organization. |
| funds-project | 1 | 0 | 187 | An entity sponsors, finances, or provides grant funding for an initiative or project. |
| has-associated-email | 1 | 0 | 76 | An organization or digital certificate is registered with or tied to a specific email address. |
| has-website | 1 | 0 | 118 | The entity maintains or is accessible via the specified web address. |
| head-of | 1 | 0 | 56 | The head or executive leader of an organization or government agency. |
| held-in | 1 | 0 | 26 | The head event took place in the tail geographic location. |
| held-meeting-with | 1 | 0 | 24 | Indicates that the head entity organized, hosted, or participated in an official meeting or consultation with the tail entity. |
| houses-facility | 1 | 0 | 56 | A physical center or organization hosts or contains a specialized sub-facility or unit. |
| implements-project | 1 | 0 | 187 | An organization manages or executes an operational program or project. |
| injected-into-cms | 1 | 0 | 99 | Indicates that a malicious script or payload is embedded into websites running a specific content management system. |
| installs-component | 1 | 0 | 200 | The head script or program installs the tail software component on the target host. |
| is-controlled-by | 1 | 0 | 148 | The subject entity is directed, managed, or controlled by the object entity. |
| is-domain-zone-of | 1 | 0 | 50 | Identifies the country or governing entity to which an internet domain zone is designated. |
| is-national-bank-of | 1 | 0 | 114 | Identifies the central bank entity as the national banking authority of a specific country. |
| is-subsystem-of | 1 | 0 | 141 | An entity is a functional component or sub-service of a larger technical system. |
| issued-directive | 1 | 0 | 15 | The subject authority issued the specified security directive or policy. |
| links-to | 1 | 0 | 145 | A document or webpage contains a hyperlink directing users to a specified URL. |
| loads | 1 | 0 | 67 | The subject entity decrypts, unpacks, or executes the target component in memory or on disk. |
| maintains | 1 | 0 | 2 | The head entity develops, supports, or maintains the tail software product. |
| mentioned-in | 1 | 0 | 96 | The source entity is documented or cited within the target report or advisory. |
| mines-cryptocurrency | 1 | 0 | 41 | A software tool or malware program mines a specific cryptocurrency. |
| modifies-registry-key | 1 | 0 | 161 | Malware creates or alters a specific Windows registry key to achieve persistence or modify system behavior. |
| modifies-software | 1 | 0 | 191 | The threat actor or entity alters or trojanizes the target legitimate software application. |
| obfuscates | 1 | 0 | 115 | The source tool or software protects, obfuscates, or packs the target file. |
| official-domain-of | 1 | 0 | 48 | Identifies the legitimate or authorized domain address used by a system or organization. |
| official-website-of | 1 | 0 | 56 | A web address or URL serving as the official online presence for an organization or initiative. |
| opens-file | 1 | 0 | 100 | Indicates that a script or program launches or displays a document file. |
| operates-on-behalf-of | 1 | 0 | 150 | The subject acts under the direction, control, or service of the object organization or government. |
| operates-via-software | 1 | 0 | 201 | Specifies the software application or platform through which an account, address, or identifier functions. |
| orchestrated | 1 | 0 | 157 | The threat actor created or directed the execution of the specified malicious file or attack. |
| orchestrates-plugins-of | 1 | 0 | 190 | The head component manages or controls the execution of plugins for the tail malware family. |
| owns-ip-prefix | 1 | 0 | 74 | The autonomous system or organization legally holds or is allocated the specified IP network prefix. |
| part-of | 1 | 0 | 168 | The head entity is a sub-unit, branch, or component of the tail entity. |
| potentially-linked-to | 1 | 0 | 156 | An actor or activity group is assessed with some degree of uncertainty to be connected to another group. |
| produces | 1 | 0 | 171 | The vendor develops or publishes the specified software product. |
| proprietary-protocol-of | 1 | 0 | 5 | Indicates that a network protocol is proprietary to or developed by a specific vendor or organization. |
| publicized-activity-of | 1 | 0 | 129 | Indicates that an online channel or media outlet specifically publishes reports or claims about operations conducted by a threat actor. |
| publicized-attack-on | 1 | 0 | 137 | The subject entity published or publicized information about a cyberattack targeting the object organization. |
| queries-dns-service | 1 | 0 | 149 | The malware contacts the specified DNS provider to resolve domain names. |
| released-patch | 1 | 0 | 15 | The software vendor released the specified security patch or update collection. |
| reported-on | 1 | 0 | 147 | The entity publicly disclosed or published research regarding the specified activity. |
| resembles-threat-actor | 1 | 0 | 128 | The head threat actor or activity cluster shares technical characteristics or overlaps with the tail threat actor. |
| sends-notifications-to | 1 | 0 | 116 | The head malware transmits status updates or alerts to the tail messaging platform. |
| shares-code-with | 1 | 0 | 68 | Indicates that two software or malware families share significant binary or source code similarities. |
| shortened-via | 1 | 0 | 141 | A shortened URL entity was generated through a specific URL shortening service. |
| subdomain-of | 1 | 0 | 128 | The head domain is a subdomain under the tail parent domain. |
| suspected-author-of | 1 | 0 | 86 | The head threat actor is linked or attributed with some level of confidence to the creation or use of the tail artifact. |
| targeted | 1 | 0 | 129 | Indicates that a threat actor directed cyber attacks or reconnaissance against a specific entity. |
| targets-file | 1 | 0 | 119 | The threat actor modifies, infects, or targets a specific file or template. |
| targets-protocol | 1 | 0 | 5 | Indicates that a vulnerability exists within the implementation or design of a specific network or communication protocol. |
| tunnels-traffic-for | 1 | 0 | 134 | Indicates that a networking or tunneling tool exposes or routes traffic for a specific malware implant or service. |
| used-by-software | 1 | 0 | 66 | The component or driver is utilized by the specified software application or server service. |
| used-to-send | 1 | 0 | 133 | Indicates that an IP address or infrastructure was utilized to distribute a specific payload or message. |
| uses-library | 1 | 0 | 125 | The source software or malware component relies on the target library or software module for functionality. |
| uses-lure-theme | 1 | 0 | 120 | A threat actor uses a specific theme, narrative, or fictitious entity as a phishing lure. |
| uses-plugin | 1 | 0 | 196 | The rule or mechanism was implemented using the specified software plugin. |

## Scheme × hand category

Overlay by plain surface match against the frozen gpt-5 stream; the hand categories are a reference, not truth.

- (pool): (unaligned) 59, Software 42, Organization 29, Government Body 7, Infrastructure 4, Device 2, Sector 2, Country 1
- Anonymity Network: (unaligned) 2, Infrastructure 1
- Autonomous System: Organization 3, Infrastructure 2, (unaligned) 1
- Company: Organization 45, (unaligned) 6, Device 6, Software 1
- Country: (unaligned) 156, Country 29, Government Body 12, Sector 4, Organization 2, Software 1
- Cybersecurity Company: Organization 10, Software 1, (unaligned) 1
- Domain Name: Domain 733, (unaligned) 7, Organization 7, Software 1, Infrastructure 1
- Email Address: Domain 85, (unaligned) 38, Country 1, Organization 1
- Email Service Provider: Organization 2, Domain 1
- Government Organization: Government Body 83, (unaligned) 44, Sector 5, Country 1
- Hosting Provider: Organization 22, (unaligned) 5, Domain 5, Software 3
- Incident Response Team: Government Body 8, Organization 1
- International Organization: Organization 9, (unaligned) 4
- IP Address: (unaligned) 404, Domain 4
- Malicious File: (unaligned) 535, Software 236, Organization 3, Government Body 1
- Malware Family: Software 257, (unaligned) 9
- Messaging Platform: Software 6, Organization 1
- Military Organization: Government Body 14, (unaligned) 6, Sector 1
- Non-Governmental Organization: Organization 4, (unaligned) 1
- Online Service: Domain 9, Organization 9, (unaligned) 4
- Operating System: Software 35, (unaligned) 22, Device 2, Organization 1
- Person: Individual 16, (unaligned) 1
- Programming Language: Software 2, (unaligned) 2
- Registry Key: (unaligned) 4
- Scheduled Task: (unaligned) 4
- Security Advisory: Organization 18, (unaligned) 14, Software 1
- Security Vulnerability: Software 103, (unaligned) 14
- Social Media Account: HackerGroup 6, Organization 1
- Social Media Platform: (unaligned) 6, Organization 5
- Software Component: Software 16, (unaligned) 3
- Software Product: Software 254, (unaligned) 55, Organization 21, Device 2
- Software Vendor: Organization 31, Software 2, Device 2, (unaligned) 2
- Telecommunications Provider: Organization 3
- Threat Actor: HackerGroup 142, (unaligned) 14
- Uniform Resource Locator: Domain 99, (unaligned) 23, Organization 18, Software 11

## Closest scheme pairs (centroid cosine)

- Software Product / Software Component: 0.889
- Hosting Provider / Online Service: 0.879
- Software Product / Software Vendor: 0.841
- Malware Family / Threat Actor: 0.827
- Malicious File / Malware Family: 0.804

## Growth over the stream

Schemes, pool and relation types are cumulative.

| # | doc id | date | title | mentions | naming calls | schemes | pool | relation types |
|---|---|---|---|---|---|---|---|---|
| 1 | 16 | 2020-01-17 | Intel, Adobe, Oracle та VMWare опублікували перші, в цьому… | 18 | 0 | 0 | 18 | 2 |
| 2 | 17 | 2020-01-20 | Критичні помилки плагіну WordPress дозволяють зловмисникам… | 6 | 0 | 0 | 24 | 4 |
| 3 | 18 | 2020-01-27 | Безпека вебресурсів та інформаційних систем органів державн… | 3 | 0 | 0 | 27 | 4 |
| 4 | 20 | 2020-02-06 | Коректне налаштування програмного забезпечення MS Office | 6 | 1 | 1 | 24 | 5 |
| 5 | 22 | 2020-02-12 | Cisco випустив патчі для закриття 'CDPwn' | 13 | 0 | 1 | 37 | 8 |
| 6 | 23 | 2020-02-13 | Adobe провела широкомасштабну розробку оновлень безпеки | 14 | 2 | 3 | 32 | 8 |
| 7 | 24 | 2020-02-21 | УВАГА! Спостерігається масова розсилка фішингових листів, я… | 8 | 2 | 5 | 23 | 10 |
| 8 | 25 | 2020-03-24 | Фішингові листи на тему коронавірусу, що приховують у собі… | 14 | 1 | 6 | 29 | 13 |
| 9 | 26 | 2020-04-01 | Звертаємо увагу на використання зловмисниками епідеміологіч… | 4 | 1 | 7 | 28 | 14 |
| 10 | 27 | 2020-04-06 | Вразливість в Zoom для Windows | 3 | 0 | 7 | 29 | 15 |
| 11 | 2492 | 2020-06-08 | Рекомендації з безпеки програмного забезпечення Cisco ASA,… | 17 | 0 | 7 | 30 | 15 |
| 12 | 2496 | 2020-06-05 | Mozilla, VMWare, Apple, Chrome та Cisco випустили оновлення… | 38 | 0 | 7 | 35 | 16 |
| 13 | 2498 | 2020-06-10 | Рекомендації щодо запобігання ризиків з кіберзахисту при ви… | 0 | 0 | 7 | 35 | 16 |
| 14 | 2624 | 2020-01-17 | Перші цьогорічні оновлення безпеки Intel, Adobe, Oracle та… | 18 | 1 | 8 | 21 | 16 |
| 15 | 2625 | 2020-01-15 | Виявлено критичні вразливості операційної системи Windows | 20 | 0 | 8 | 25 | 18 |
| 16 | 2628 | 2020-07-28 | Інформація щодо бази даних реальних ІР-адрес електронних р… | 9 | 0 | 8 | 29 | 18 |
| 17 | 2656 | 2019-09-13 | Угода про наукове та науково-технічне співробітництво | 4 | 0 | 8 | 30 | 19 |
| 18 | 2658 | 2019-09-12 | Підписано Меморандум про взаємодію між (IFES)/IFES Україна… | 4 | 0 | 8 | 31 | 19 |
| 19 | 2659 | 2019-07-30 | Не перевіряйте свої поштові акаунти на фішингових сайтах! | 3 | 0 | 8 | 33 | 21 |
| 20 | 2660 | 2019-06-20 | Нові спроби використання вразливості 2017 року Microsoft Of… | 14 | 0 | 8 | 35 | 22 |
| 21 | 2661 | 2020-01-15 | Критична вразливість в старих версіях ОС Windows | 16 | 0 | 8 | 36 | 23 |
| 22 | 2681 | 2019-12-06 | Вісім правил кібербезпеки. Що пропонують в ООН | 10 | 0 | 8 | 43 | 26 |
| 23 | 2683 | 2019-10-31 | Конференція «Дезінформація та кібербезпека під час виборів… | 16 | 0 | 8 | 51 | 29 |
| 24 | 2685 | 2019-10-29 | Проведено зустріч з Фондом "Альянс Демократій" | 4 | 0 | 8 | 52 | 30 |
| 25 | 2687 | 2019-10-22 | Новини зі світу кібербезпеки | 9 | 0 | 8 | 55 | 32 |
| 26 | 2691 | 2019-09-23 | XVIІI Міжнародна науково-практична конференція «Побудова ін… | 7 | 1 | 9 | 51 | 34 |
| 27 | 2693 | 2019-03-30 | Фішингова розсилка на тему виборів | 4 | 1 | 10 | 47 | 34 |
| 28 | 2695 | 2019-02-28 | Зараз в Україні активно розповсюджується шкідливе програмне… | 13 | 1 | 11 | 50 | 35 |
| 29 | 2697 | 2019-02-04 | Архів листування російської терористки М.Колєди | 7 | 1 | 12 | 49 | 36 |
| 30 | 2699 | 2019-01-29 | Чергова фішинг-атака на органи державної влади | 20 | 2 | 14 | 52 | 38 |
| 31 | 2701 | 2019-01-28 | Глобальна кампанія з підміни DNS-записів | 4 | 0 | 14 | 52 | 38 |
| 32 | 2703 | 2019-01-17 | Нові поширення шифрувальника Troldesh/Shade | 27 | 2 | 16 | 50 | 41 |
| 33 | 2707 | 2018-12-13 | Нові хвилі масових розсилок листів з #Smokeloader | 10 | 0 | 16 | 50 | 41 |
| 34 | 2718 | 2018-11-15 | Розсилка шкідливого програмного забезпечення бекдор-заванта… | 22 | 1 | 16 | 41 | 44 |
| 35 | 2720 | 2018-05-23 | Деструктивне шкідливе програмне забезпечення VPNFilter | 25 | 0 | 16 | 42 | 44 |
| 36 | 2722 | 2018-05-15 | Популярні вразливості в українському сегменті мережі Інтерн… | 31 | 0 | 16 | 43 | 45 |
| 37 | 2723 | 2018-05-15 | EFAIL - Критична вразливість в PGP та S/MIME (Оновлюється). | 10 | 0 | 16 | 49 | 47 |
| 38 | 2724 | 2018-05-11 | Microsoft випустила оновлення, які усувають велику кількіст… | 27 | 1 | 17 | 47 | 47 |
| 39 | 2725 | 2018-04-26 | Вразливість в CMS Drupal «Drupalgeddon2». | 4 | 0 | 17 | 47 | 47 |
| 40 | 2726 | 2018-03-22 | Поширення банківського трояна Ursnif | 12 | 0 | 17 | 47 | 49 |
| 41 | 2727 | 2018-02-22 | Поширення Monero Mining, через Smokeloader | 12 | 0 | 17 | 48 | 52 |
| 42 | 2728 | 2018-02-15 | Масова розсилка фішингових листів зі шкідливим програмним з… | 20 | 1 | 18 | 46 | 56 |
| 43 | 2803 | 2018-11-15 | Нові хвилі масових розсилок вірусу-шифрувальника Troldesh | 9 | 0 | 18 | 46 | 57 |
| 44 | 2804 | 2018-10-22 | Виявлено нове шкідливе програмне забезпечення GreyEnergy | 35 | 0 | 18 | 48 | 58 |
| 45 | 2805 | 2018-09-14 | Масова розсилка вірусу-шифрувальника GandCrab / Troldesh | 24 | 0 | 18 | 49 | 58 |
| 46 | 2806 | 2018-09-18 | Розсилка шкідливого програмного забезпечення AZORult | 15 | 0 | 18 | 49 | 59 |
| 47 | 2807 | 2018-09-03 | Масова розсилка шпигунського програмного забезпечення типу… | 20 | 0 | 18 | 49 | 61 |
| 48 | 2808 | 2018-08-07 | Як убезпечитися від фішингового сайта? | 4 | 0 | 18 | 50 | 63 |
| 49 | 3028 | 2020-08-07 | Agent Tesla (шкідливе програмне забезпечення) | 10 | 0 | 18 | 54 | 66 |
| 50 | 4475 | 2020-10-22 | Увага!!! Відбуваються фішингові розсилки на працівників дер… | 5 | 0 | 18 | 54 | 67 |
| 51 | 9483 | 2020-12-14 | Хакери отримали доступ до спеціалізованого програмного забе… | 13 | 0 | 18 | 60 | 70 |
| 52 | 9668 | 2020-12-28 | Вітаємо з нагоди 14-ї річниці ІСЗЗІ КПІ ім. Сікорського | 8 | 0 | 18 | 62 | 70 |
| 53 | 10011 | 2021-01-21 | Масштабна фішингова атака на державні установи України 19.0… | 14 | 0 | 18 | 63 | 72 |
| 54 | 10702 | 2021-03-03 | Поновлення кібератак з використанням ШПЗ Pterodo хакерськог… | 34 | 0 | 18 | 64 | 74 |
| 55 | 11113 | 2021-03-17 | Державним центром кіберзахисту Держспецзв’язку вживаються з… | 15 | 0 | 18 | 69 | 75 |
| 56 | 12081 | 2021-05-13 | Президент України Володимир Зеленський відкрив Кіберцентр U… | 9 | 0 | 18 | 71 | 78 |
| 57 | 13156 | 2021-07-13 | Зафіксовано атаку на державні органи України з використання… | 19 | 0 | 18 | 71 | 80 |
| 58 | 14624 | 2021-08-03 | Виявлено шахрайські дії з викрадення даних платіжних карток… | 16 | 0 | 18 | 74 | 80 |
| 59 | 14958 | 2021-08-20 | Рекомендації для попередження та зменшення наслідків впливу… | 3 | 0 | 18 | 75 | 80 |
| 60 | 16295 | 2021-10-26 | Щорічне оцінювання фізичної підготовки особового складу Дер… | 5 | 0 | 18 | 77 | 80 |
| 61 | 16905 | 2021-11-10 | Правила обміну інформацією про кіберінциденти та Перелік ка… | 8 | 0 | 18 | 80 | 81 |
| 62 | 17474 | 2021-12-16 | Робоча нарада з представниками енергетичного сектору | 7 | 0 | 18 | 83 | 82 |
| 63 | 17580 | 2021-12-24 | РЕКОМЕНДАЦІЇ ДЕРЖАВНОГО ЦЕНТРУ КІБЕРЗАХИСТУ | 6 | 0 | 18 | 84 | 82 |
| 64 | 17696 | 2022-01-04 | Перший щорічний звіт за результатами роботи системи виявлен… | 5 | 0 | 18 | 85 | 82 |
| 65 | 17899 | 2022-01-14 | Кібератака на сайти державних органів | 11 | 0 | 18 | 87 | 83 |
| 66 | 17961 | 2022-01-18 | Інформація щодо вразливості в продуктах Microsoft CVE-2022-… | 9 | 0 | 18 | 87 | 86 |
| 67 | 18101 | 2022-01-26 | Фрагмент дослідження кібератак 14.01.2022 | 25 | 0 | 18 | 88 | 90 |
| 68 | 18108 | 2022-01-26 | Порівняльний аналіз ШПЗ WhisperKill та WhiteBlackCrypt | 18 | 0 | 18 | 96 | 93 |
| 69 | 18163 | 2022-01-28 | Кібератака на організації та установи України з використанн… | 15 | 1 | 19 | 94 | 95 |
| 70 | 18273 | 2022-01-31 | Кібератака на державні організації України з використанням… | 24 | 0 | 19 | 96 | 96 |
| 71 | 18365 | 2022-02-01 | Кібератака групи UAC-0010 (Armageddon) на державні організа… | 15 | 0 | 19 | 98 | 97 |
| 72 | 18419 | 2022-02-02 | Кібератака групи UAC-0056 на державні організації України з… | 17 | 0 | 19 | 98 | 98 |
| 73 | 37121 | 2022-02-17 | Довідкова інформація з питань діяльності CERT-UA за фактами… | 1 | 0 | 19 | 98 | 98 |
| 74 | 37139 | 2022-02-18 | Інформація щодо кібератак 15 лютого 2022 року | 17 | 0 | 19 | 110 | 101 |
| 75 | 37211 | 2022-02-21 | Попередження щодо можливих кібератак | 5 | 0 | 19 | 111 | 101 |
| 76 | 37246 | 2022-02-21 | Інформація щодо активності групи UAC-0008 (Buhtrap) (CERT-… | 40 | 0 | 19 | 113 | 102 |
| 77 | 37287 | 2022-02-22 | Вразливості в Zabbix (CVE-2022-23131, CVE-2022-23134) | 4 | 0 | 19 | 113 | 103 |
| 78 | 37626 | 2022-03-07 | Кібератака групи UAC-0057 (unc1151) на державні організації… | 18 | 0 | 19 | 117 | 105 |
| 79 | 37688 | 2022-03-09 | Кібератака на державні організації України з використанням… | 12 | 0 | 19 | 117 | 106 |
| 80 | 37704 | 2022-03-11 | Кібератака на державні організації України з використанням… | 23 | 0 | 19 | 118 | 107 |
| 81 | 37788 | 2022-03-16 | Фішингова кампанія з використанням тематики сервісу UKR.NET… | 12 | 0 | 19 | 120 | 107 |
| 82 | 37815 | 2022-03-17 | Кібератака групи UAC-0020 (Vermin) на державні організації… | 52 | 0 | 19 | 128 | 109 |
| 83 | 37829 | 2022-03-18 | Кібератака групи UAC-0035 (InvisiMole) на державні організа… | 12 | 0 | 19 | 129 | 110 |
| 84 | 38088 | 2022-03-22 | Кібератака на українські підприємства з використанням прогр… | 8 | 0 | 19 | 129 | 112 |
| 85 | 38097 | 2022-03-22 | Кібератака групи UAC-0026 з використанням шкідливої програм… | 14 | 0 | 19 | 131 | 112 |
| 86 | 38155 | 2022-03-23 | Кібератака на державні організації України з використанням… | 15 | 0 | 19 | 131 | 113 |
| 87 | 38374 | 2022-03-28 | Кібератака групи UAC-0056 на державні органи України з вико… | 13 | 1 | 20 | 127 | 113 |
| 88 | 38606 | 2022-03-30 | Масове розповсюдження шкідливої програми MarsStealer серед… | 13 | 0 | 20 | 127 | 113 |
| 89 | 39086 | 2022-04-04 | Кібератака групи UAC-0010 (Armageddon) на державні інституц… | 14 | 0 | 20 | 127 | 113 |
| 90 | 39138 | 2022-04-04 | Кібератака групи UAC-0010 (Armageddon) на державні організа… | 22 | 0 | 20 | 127 | 113 |
| 91 | 39253 | 2022-04-05 | Інформація щодо кібератак, спрямованих на отримання доступу… | 11 | 0 | 20 | 128 | 113 |
| 92 | 39386 | 2022-04-07 | Кібератака групи UAC-0010 (Armageddon) на державні організа… | 27 | 0 | 20 | 129 | 113 |
| 93 | 39518 | 2022-04-12 | Кібератака групи Sandworm (UAC-0082) на об’єкти енергетики… | 28 | 0 | 20 | 129 | 113 |
| 94 | 39606 | 2022-04-14 | Кібератака на державні організації України з використанням… | 12 | 0 | 20 | 130 | 113 |
| 95 | 39609 | 2022-04-14 | Кібератака на державні організації України з використанням… | 34 | 0 | 20 | 130 | 113 |
| 96 | 39708 | 2022-04-18 | Кібератака на державні організації України з використанням… | 14 | 0 | 20 | 132 | 116 |
| 97 | 39727 | 2022-04-19 | Онлайн-шахрайство з використанням тематики "грошової допомо… | 46 | 1 | 21 | 129 | 117 |
| 98 | 39882 | 2022-04-26 | Кібератака групи UAC-0056 з використанням шкідливих програм… | 11 | 0 | 21 | 129 | 117 |
| 99 | 39923 | 2022-04-28 | Дослідження DDoS-атак, що здійснюються в результаті ураженн… | 42 | 1 | 21 | 129 | 118 |
| 100 | 39934 | 2022-04-28 | Кібератака групи UAC-0098 на державні органи України із зас… | 12 | 0 | 21 | 130 | 121 |
| 101 | 39962 | 2022-04-29 | Щодо обміну інформацією про кіберзагрози | 14 | 0 | 21 | 131 | 123 |
| 102 | 40102 | 2022-05-06 | Кібератака групи APT28 із застосуванням шкідливої програми… | 11 | 0 | 21 | 133 | 123 |
| 103 | 40125 | 2022-05-07 | Масове розповсюдження шкідливої програми JesterStealer з ви… | 19 | 0 | 21 | 134 | 123 |
| 104 | 40240 | 2022-05-12 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 32 | 0 | 21 | 134 | 123 |
| 105 | 40263 | 2022-05-14 | Онлайн-шахрайство з використанням тематики "грошової допомо… | 40 | 1 | 22 | 132 | 124 |
| 106 | 40559 | 2022-06-02 | Кібератака на державні організації України з використанням… | 11 | 0 | 22 | 132 | 124 |
| 107 | 160530 | 2022-06-10 | Масована кібератака на медійні організації України з викори… | 19 | 0 | 22 | 133 | 125 |
| 108 | 339662 | 2022-06-20 | Кібератака групи UAC-0098 на об'єкти критичної інфраструкту… | 21 | 0 | 22 | 133 | 125 |
| 109 | 341128 | 2022-06-20 | Кібератака групи APT28 з використанням шкідливої програми C… | 12 | 0 | 22 | 133 | 125 |
| 110 | 375404 | 2022-06-22 | Кібератаки груп, асоційованих з Китаєм, у відношенні російс… | 16 | 0 | 22 | 133 | 125 |
| 111 | 405538 | 2022-06-24 | Кібератака у відношенні операторів телекомунікацій України… | 16 | 0 | 22 | 133 | 125 |
| 112 | 619229 | 2022-07-06 | Кібератака UAC-0056 на державні організації України з викор… | 11 | 0 | 22 | 133 | 125 |
| 113 | 703548 | 2022-07-11 | Атака групи UAC-0056 на державні організації України з вико… | 15 | 0 | 22 | 134 | 125 |
| 114 | 761668 | 2022-07-14 | Онлайн-шахрайство з використанням тематики "грошової компен… | 16 | 0 | 22 | 135 | 128 |
| 115 | 861292 | 2022-07-20 | Кібератака на державні організації України з використанням… | 15 | 0 | 22 | 138 | 129 |
| 116 | 955924 | 2022-07-25 | Масове розповсюдження стілерів (Formbook, Snake Keylogger)… | 15 | 0 | 22 | 139 | 130 |
| 117 | 971405 | 2022-07-26 | Кібератаки групи UAC-0010 (Armageddon) з використанням шкід… | 25 | 0 | 22 | 139 | 132 |
| 118 | 987552 | 2022-07-27 | Онлайн-шахрайство з використанням тематики "допомоги від Че… | 9 | 0 | 22 | 140 | 133 |
| 119 | 1229152 | 2022-08-10 | Кібератаки групи UAC-0010 (Armageddon): шкідливі програми G… | 10 | 0 | 22 | 141 | 137 |
| 120 | 1545776 | 2022-08-30 | Онлайн-шахрайство з використанням тематики «грошових виплат… | 50 | 0 | 22 | 143 | 138 |
| 121 | 1563322 | 2022-08-31 | Масове розповсюдження шкідливої програми AgentTesla (CERT-U… | 27 | 0 | 22 | 143 | 138 |
| 122 | 1751036 | 2022-09-12 | Щодо невідкладних заходів кіберзахисту | 22 | 0 | 22 | 144 | 139 |
| 123 | 2394117 | 2022-10-22 | Кібератака на державні організації України з використанням… | 17 | 2 | 23 | 134 | 139 |
| 124 | 2681855 | 2022-11-08 | Кібератака групи UAC-0010: розсилання електронних листів, н… | 27 | 0 | 23 | 134 | 139 |
| 125 | 2698320 | 2022-11-09 | Розповсюдження електронних листів з фейковим сканером, наче… | 11 | 1 | 23 | 131 | 141 |
| 126 | 2724253 | 2022-11-11 | Інформація щодо кібератак групи UAC-0118 (FRwL) з використа… | 52 | 0 | 23 | 131 | 141 |
| 127 | 3192088 | 2022-12-08 | Кібератака на державні організації з використанням тематики… | 14 | 0 | 23 | 131 | 141 |
| 128 | 3349703 | 2022-12-18 | Кібератака на користувачів системи DELTA з використанням шк… | 24 | 0 | 23 | 131 | 144 |
| 129 | 3718487 | 2023-01-27 | Кібератака Sandworm на інформаційно-комунікаційну систему У… | 17 | 0 | 23 | 134 | 146 |
| 130 | 3761023 | 2023-02-01 | Активність групи UAC-0114 (Winter Vivern) у відношенні держ… | 21 | 0 | 23 | 136 | 146 |
| 131 | 3804703 | 2023-02-06 | Кібератака UAC-0050 у відношенні державних органів України… | 27 | 0 | 23 | 138 | 146 |
| 132 | 3863542 | 2023-02-13 | Кібератака на організації та установи України з використанн… | 27 | 0 | 23 | 139 | 146 |
| 133 | 3931296 | 2023-02-21 | Кібератака групи UAC-0050 (UAC-0096) з використанням програ… | 35 | 0 | 23 | 139 | 148 |
| 134 | 3947787 | 2023-02-23 | Кібератака, спрямована на порушення цілісності та доступнос… | 16 | 0 | 23 | 139 | 150 |
| 135 | 4279195 | 2023-04-03 | Використання неліцензійних програм Microsoft Office як вект… | 19 | 0 | 23 | 140 | 151 |
| 136 | 4492467 | 2023-04-28 | Кібератака групи APT28: розповсюдження електронних листів з… | 11 | 1 | 24 | 134 | 152 |
| 137 | 4501891 | 2023-04-29 | WinRAR як "кіберзброя". Деструктивна кібератака UAC-0165 (й… | 18 | 0 | 24 | 137 | 153 |
| 138 | 4555802 | 2023-05-05 | Повернення UAC-0006: масове розповсюдження SmokeLoader з ви… | 31 | 0 | 24 | 138 | 154 |
| 139 | 4697016 | 2023-05-22 | Шпигунська активність UAC-0063 у відношенні України, Казахс… | 31 | 0 | 24 | 139 | 155 |
| 140 | 4755642 | 2023-05-29 | Кібератака UAC-0006: розповсюдження SmokeLoader з використа… | 36 | 0 | 24 | 139 | 155 |
| 141 | 4789582 | 2023-06-02 | Розсилання SMS-повідомлень з темою судових повісток з викор… | 75 | 0 | 24 | 143 | 158 |
| 142 | 4818341 | 2023-06-05 | UAC-0099: кібершпигунство у відношенні державних організаці… | 19 | 0 | 24 | 143 | 158 |
| 143 | 4905718 | 2023-06-16 | Кібератака групи UAC-0057 (GhostWriter) у відношенні держав… | 20 | 0 | 24 | 144 | 158 |
| 144 | 4905829 | 2023-06-20 | Групою APT28 застосовано три експлойти для Roundcube (CVE-2… | 37 | 0 | 24 | 145 | 158 |
| 145 | 4928679 | 2023-06-19 | Цільові кібератаки UAC-0102 у відношенні користувачів серві… | 16 | 1 | 25 | 138 | 160 |
| 146 | 5077168 | 2023-07-05 | Цільова атака з використанням тематики членства України в О… | 20 | 1 | 26 | 135 | 160 |
| 147 | 5098518 | 2023-07-07 | Цільова кібератака UAC-0057 у відношенні державних органів… | 24 | 0 | 26 | 136 | 162 |
| 148 | 5105791 | 2023-07-08 | Фішингові атаки групи APT28 (UAC-0028) з метою отримання ав… | 30 | 1 | 26 | 134 | 163 |
| 149 | 5158006 | 2023-07-13 | Кібератака UAC-0006: розповсюдження SmokeLoader з використа… | 22 | 0 | 26 | 135 | 166 |
| 150 | 5160737 | 2023-07-13 | Зведена інформація щодо діяльності угрупування UAC-0010 ста… | 21 | 0 | 26 | 135 | 167 |
| 151 | 5213167 | 2023-07-18 | Цільові атаки Turla (UAC-0024, UAC-0003) з використанням шк… | 29 | 0 | 26 | 136 | 168 |
| 152 | 5269451 | 2023-07-24 | Рівень загрози для бухгалтерів зростає: угрупуванням UAC-00… | 60 | 1 | 26 | 131 | 168 |
| 153 | 5391805 | 2023-08-05 | MerlinAgent: новий open-source інструмент для здійснення кі… | 22 | 0 | 26 | 131 | 168 |
| 154 | 5436463 | 2023-08-09 | Як бути відповідальним та втримати кіберфронт | 30 | 1 | 27 | 129 | 168 |
| 155 | 5455833 | 2023-08-11 | "Змініть пароль до Roundcube": чергова фішингова атака з ви… | 11 | 0 | 27 | 129 | 168 |
| 156 | 5628441 | 2023-08-28 | UAC-0173: органи юстиції та нотаріат "під прицілом" (CERT-U… | 17 | 0 | 27 | 131 | 169 |
| 157 | 5661411 | 2023-08-31 | Кібератака UAC-0057: експлойт для CVE-2023-38831, JavaScrip… | 23 | 0 | 27 | 131 | 170 |
| 158 | 5702579 | 2023-09-04 | Кібератака APT28: msedge як завантажувач, TOR та сервіси mo… | 27 | 0 | 27 | 131 | 170 |
| 159 | 6032734 | 2023-10-06 | Нарощування темпів UAC-0006, мільйонні збитки (CERT-UA#7648… | 40 | 0 | 27 | 131 | 171 |
| 160 | 6123309 | 2023-10-15 | Особливості деструктивних кібератак Sandworm у відношенні у… | 18 | 1 | 28 | 127 | 171 |
| 161 | 6276351 | 2023-11-13 | Кібератака UAC-0050 з використанням Remcos RAT, замаскована… | 26 | 1 | 29 | 124 | 172 |
| 162 | 6276567 | 2023-11-30 | "Повістка до суду": чергова цільова атака UAC-0050 з викори… | 14 | 0 | 29 | 124 | 173 |
| 163 | 6276584 | 2023-12-01 | Зведена інформація щодо діяльності угрупування UAC-0006 ста… | 17 | 0 | 29 | 124 | 173 |
| 164 | 6276652 | 2023-12-07 | Масова кібератака UAC-0050 з використанням RemcosRAT/Meduza… | 46 | 0 | 29 | 124 | 173 |
| 165 | 6276799 | 2023-12-19 | Modus operandi UAC-0177 (JokerDPR) на прикладі однієї з кіб… | 38 | 1 | 30 | 122 | 174 |
| 166 | 6276824 | 2023-12-21 | "Заборгованість Київстар", "Запит СБУ": нова атака UAC-0050… | 20 | 2 | 32 | 118 | 174 |
| 167 | 6276894 | 2023-12-28 | APT28: від первинного ураження до створення загроз для конт… | 29 | 0 | 32 | 118 | 174 |
| 168 | 6276988 | 2024-01-06 | UAC-0184: Цільові атаки у відношенні українських військовос… | 23 | 0 | 32 | 119 | 175 |
| 169 | 6277063 | 2024-01-11 | RemcosRAT, QuasarRAT, RemoteUtilities на озброєнні UAC-0050… | 19 | 0 | 32 | 119 | 176 |
| 170 | 6277285 | 2024-01-22 | Листи нібито від Держспецзв'язку та ДСНС - атака UAC-0050 з… | 38 | 0 | 32 | 119 | 176 |
| 171 | 6277422 | 2024-01-31 | UAC-0027: DIRTYMOE (PURPLEFOX) уражено більше 2000 комп'юте… | 14 | 0 | 32 | 119 | 177 |
| 172 | 6277822 | 2024-02-22 | Щодо обстановки в сфері кібер на 23-24 лютого 2024 року | 16 | 0 | 32 | 119 | 178 |
| 173 | 6277849 | 2024-02-24 | UAC-0149: Цільові вибіркові атаки у відношенні Сил оборони… | 18 | 0 | 32 | 119 | 178 |
| 174 | 6277896 | 2024-02-28 | АНОНС: Практичний семінар для кіберфахівців | 10 | 0 | 32 | 120 | 178 |
| 175 | 6278274 | 2024-04-01 | Фактор кібербезпеки | 14 | 1 | 33 | 118 | 178 |
| 176 | 6278521 | 2024-04-16 | Месенджери та сайти знайомств - нові способи проведення ата… | 24 | 0 | 33 | 120 | 178 |
| 177 | 6278620 | 2024-04-18 | Чергова кібератака UAC-0149 з використанням Signal, вразлив… | 16 | 0 | 33 | 120 | 178 |
| 178 | 6278706 | 2024-04-19 | Плани UAC-0133 (Sandworm) щодо кібердиверсії на майже 20 об… | 15 | 0 | 33 | 126 | 178 |
| 179 | 6278735 | 2024-04-20 | Викрадення акаунту WhatsApp під виглядом голосування за еле… | 39 | 0 | 33 | 126 | 178 |
| 180 | 6279366 | 2024-05-21 | Весняне загострення: UAC-0006 активізувало кібератаки | 25 | 0 | 33 | 126 | 178 |
| 181 | 6279419 | 2024-05-23 | UAC-0188: Цільові кібератаки з використанням SuperOps RMM (… | 33 | 0 | 33 | 127 | 180 |
| 182 | 6279561 | 2024-06-04 | UAC-0200: Цільові кібератаки з використанням DarkCrystal RA… | 17 | 0 | 33 | 127 | 181 |
| 183 | 6279600 | 2024-06-05 | UAC-0020 (Vermin) атакує Сили оборони України з використанн… | 51 | 0 | 33 | 131 | 183 |
| 184 | 6280099 | 2024-07-17 | Цільові кібератаки UAC-0180 у відношенні оборонних підприєм… | 22 | 0 | 33 | 131 | 183 |
| 185 | 6280129 | 2024-07-21 | UAC-0063 атакує науково-дослідні установи України: HATVIBE… | 24 | 0 | 33 | 131 | 183 |
| 186 | 6280159 | 2024-07-24 | Точковий сплеск активності UAC-0057 (CERT-UA#10340) | 31 | 0 | 33 | 133 | 185 |
| 187 | 6280183 | 2024-07-24 | Кібератаки UAC-0102 з метою викрадення автентифікаційних да… | 24 | 0 | 33 | 133 | 185 |
| 188 | 6280345 | 2024-08-12 | UAC-0198: Масове розповсюдження ANONVNC (MESHAGENT) серед д… | 32 | 0 | 33 | 133 | 185 |
| 189 | 6280422 | 2024-08-19 | Кібератака UAC-0020 (Vermin) з використанням тематики війсь… | 29 | 1 | 34 | 128 | 187 |
| 190 | 6280563 | 2024-09-04 | Спроби кібератак на військові системи за допомогою шкідливи… | 30 | 0 | 34 | 132 | 189 |
| 191 | 6281009 | 2024-10-15 | Тріада UAC-0050: кібершпигунство, фінансові злочини, інформ… | 15 | 0 | 34 | 132 | 189 |
| 192 | 6281018 | 2024-10-16 | Розповсюдження MEDUZASTEALER засобами Telegram, начебто, ві… | 37 | 0 | 34 | 133 | 189 |
| 193 | 6281076 | 2024-10-23 | Файли конфігурацій RDP як засіб отримання віддаленого досту… | 21 | 0 | 34 | 133 | 189 |
| 194 | 6281095 | 2024-10-24 | Тематика рахунків на озброєнні UAC-0218: викрадення файлів… | 25 | 0 | 34 | 134 | 190 |
| 195 | 6281123 | 2024-10-25 | Кібератака UAC-0001 (APT28): PowerShell-команда в буфері об… | 21 | 0 | 34 | 143 | 192 |
| 196 | 6281202 | 2024-10-30 | Кібератака UAC-0050 з використанням податкової тематики та… | 22 | 0 | 34 | 143 | 192 |
| 197 | 6281632 | 2024-12-07 | Цільові кібератаки UAC-0185 у відношенні Сил оборони та під… | 36 | 0 | 34 | 143 | 192 |
| 198 | 6281681 | 2024-12-14 | "Повідомлення про порушення" від UAC-0099 (CERT-UA#12463) | 26 | 0 | 34 | 143 | 192 |
| 199 | 6281701 | 2024-12-18 | Кібератака UAC-0125 з використанням тематики "Армія+" (CERT… | 27 | 0 | 34 | 143 | 193 |
| 200 | 6282069 | 2025-01-17 | Спроби здійснення кібератак з використанням AnyDesk, нібито… | 3 | 0 | 34 | 144 | 194 |
| 201 | 6282517 | 2025-02-23 | Цільова активність UAC-0212 у відношенні розробників та пос… | 25 | 0 | 34 | 144 | 195 |
| 202 | 6282536 | 2025-02-25 | UAC-0173 проти Нотаріату України (CERT-UA#13738) | 20 | 0 | 34 | 146 | 195 |
| 203 | 6282737 | 2025-03-18 | UAC-0200: Шпигунство за оборонно-промисловим комплексом за… | 26 | 0 | 34 | 146 | 195 |

## Cost

Covers the last invocation of the driver only. USD is not recorded (unpriced: gemini/gemini-3.7-flash, gemini/gemini-embedding-2). Wall clock 1993.9 s.

| operator | calls | input tokens | output tokens |
|---|---|---|---|
| extract | 203 | 804791 | 340222 |
| embed-gloss | 200 | 0 | 0 |
| embed-relation | 345 | 0 | 0 |
| scheme-name | 40 | 40704 | 2478 |
| embed-kind | 68 | 0 | 0 |
| total | 856 | 845495 | 342700 |

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
