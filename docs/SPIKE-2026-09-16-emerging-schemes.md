# Spike 2026-09-16: emergent concept schemes on 20 CERT-UA reports (Gemini stack)

Question: does "extract entities with an LLM-written description → embed → kNN against existing
scheme clusters → pool the rest → name a pool cluster once it spans enough documents" produce a
usable, prefix-causal concept-scheme registry, and at what cost?

Stack: `gemini-3.7-flash` (extraction + naming, temperature 0), `gemini-embedding-2`
(taskType CLUSTERING, 768 dims, re-normalized). Corpus: the first 20 reports of the paper stream
(numeric-id order; 2019–2020 advisories and phishing notes). Code: `bin/spike-schemes.ts`
(driver), `bin/spike-repr.ts` (offline representation study), `bin/scheme-view.ts` +
`src/SchemeView/schemeView.ts` (viewer). Runs: `runs/spike/2026-09-16-gemini-20` (τ 0.78,
pool link 0.80) and `runs/spike/2026-09-16-gemini-20-strict` (τ 0.80, pool link 0.85); each has a
`scheme-view.html`.

## Findings

1. **Instance descriptions alone do not cluster into kinds.** Embedding `name: gloss` (or the
   gloss alone) separates same-kind from different-kind pairs weakly: d' ≤ 0.8 for every single
   text, at 768 and at 3072 dims (`repr-study.txt`). Glosses share vocabulary across neighbouring
   kinds (software product vs software vendor, government body vs country) and cosine sits in a
   narrow 0.5–0.7 band.
2. **The extractor's own free-text `kind` phrase is the signal.** Asked for a 1–4 word kind with
   no fixed list, the model used a near-canonical vocabulary over 236 mentions (38 phrases; the
   top six cover 68%: vulnerability identifier 38, software product 33, security advisory 33,
   operating system 23, software vendor 17, government body 16). Embedding the kind phrase gives
   d' 0.8 against the frozen hand categories and recovers the kind partition itself trivially.
3. **Weighted kind + gloss is the working representation.** cosine = 0.7·cos(kind) + 0.3·cos(gloss)
   (weighted concatenation of two unit vectors). Average-linkage clustering at cutoff 0.80 yields
   30 clusters, all pure by kind (ARI 0.98 vs the kind partition); at 0.75 close synonyms merge
   (ARI 0.92); at 0.70 vendors merge into products and countries into government bodies.
4. **Streaming discovery works with ~0.5 naming calls per document.** Both runs: 9 naming calls
   for 20 documents, 9 schemes. Lenient run: Software Product 72 (contaminated: 17 vendors),
   Security Advisory 34, Security Vulnerability 40, Operating System 29, Country 6, Government
   Agency 16, Malware 9, Software Update 11, Domain Name 4; 15 pooled. Strict run: Software
   Product 50, Software Vendor 17 (all hand-Organization), Security Advisory 33, Security
   Vulnerability 40, Operating System 29, Country 6, Government Agency 16, Software Update 11,
   Internet Domain 3; 31 pooled (malware family split across "malware", "malware file",
   "ransomware family" and never reached the 3-document mass).
5. **Failure modes seen and fixed during the spike.** (a) Count-based kNN vote: three identical
   Country neighbours at similarity 1.0 were outvoted by seven ~0.6 neighbours from the two largest
   schemes; only neighbours ≥ τ may vote now. (b) Single-linkage chained the whole pool into one
   cluster; average linkage replaced it. (c) A pool cluster whose naming call failed was re-sent
   eight times per document; member sets sent to the namer are now remembered. (d) An
   `alias-of` verdict without a prefLabel was read as a failure. (e) Free-form reasoning with
   braces broke the greedy JSON parser (1 of 20 documents); the parser now scans candidate starts.
6. **Failure modes still open (design input for the article).** (a) *Early-mint absorption*: a
   freshly minted scheme's kNN neighbourhood pulls in adjacent kinds whose glosses mention its
   members (product glosses name the vendor); a kind-phrase-first rule (assign on kind cosine ≥ 0.9
   to the scheme's dominant kinds, otherwise strict combined τ) should remove it. (b) *Long-tail
   kinds never reach mass*: universities, non-profits, companies, IOC-like items (ip address, email
   address, url) stay pooled under any threshold; the pool needs a coarser second-level gate
   (e.g. a lower cutoff on the gloss vector only) or a parent-scheme mechanism. (c) *The frozen
   hand categories are coarser than the open kinds*: security advisories, patches and CVE ids were
   Software/Organization in the frozen gpt-5 stream, so the cross-tab measures schema
   granularity mismatch as much as error; the paper's Arm F/Arm O evaluation must treat the hand
   schema as one reference, not as truth. (d) Overlay coverage by surface alignment is 75%.
7. **Cost.** Extraction 19 docs ≈ 41k input / 24k output tokens; naming 9 calls ≈ 7k / 0.6k;
   embeddings 2 batches per document. Models are unpriced in `config/model-prices.json`
   (`gemini-3.7-flash`, `gemini-embedding-2`); fill from the dashboard before quoting USD.

## Recommendation (go, with the changes below)

- Keep the mechanism; promote the driver into `src/SchemeDiscovery/` with: kind-phrase-first
  assignment, the ≥ τ vote, average-linkage pool, naming with attempted-set memory, additive
  scheme mappings and rename history (Def. 7 (iii)), and a second-level pool gate for long-tail
  kinds. Defaults from this spike: α 0.7, τ 0.80, pool link 0.85, mass 3 documents.
- Add the `kind` phrase to the article's design as part of the LLM-written description (it is
  still category-blind: no list is given), and report the representation study (finding 1–3) as
  the first result: description embeddings need the type phrase, the gloss alone is not enough.
- Extend the offline study to the full 204 documents before pre-registration; re-check the
  cutoffs on the Arm F stream, where the mention set is fixed.

## Addendum (same day): mid-corpus slice, kind-first assignment, blind vs in-context extraction

Runs: `runs/spike/2026-09-16-gemini-mid20` (documents 101–120 of the stream, 29.04–30.08.2022,
strict thresholds τ 0.80 / pool link 0.85), `…-mid20-kindfirst` (same extractions, kind-first
assignment at kind-phrase cosine ≥ 0.9 before the kNN vote), `…-mid20-icl` (re-extraction with the
current scheme list rendered in the prompt as KNOWN KINDS, `prompts/extract-open-icl-v1.md`).

8. **On CTI-heavy reports the emergent schemes recover the hand categories and refine them.**
   358 mentions, 11 naming calls, 9 schemes: Threat Actor (18; hand HackerGroup 14/18), Domain
   Name (102; Domain 100/102), Malware (115; hand Software 49 plus malicious attachments),
   Organization (18; Government Body 12 + central banks 5), Country (18), Software Product (16),
   plus three kinds the 2025 schema lacked or merged: Email Address (15; hand Domain), IP Address
   (29; absent), Vulnerability (5; hand Software). Relation inventory: 9 types (uses 50, delivers 41,
   part-of 10, uses-email 9, exploits 6, targets 5, hosted-on 5, deploys 4, exfiltrates-to 3).
9. **Kind-first assignment is safe and cheap.** 183/358 assignments took the kind-phrase route;
   the only difference from the kNN-only run is that "social network" (3) separated from Software
   Product. Adopted as the default (`SPIKE_KIND_FIRST=0.9`).
10. **A scheme list in the extraction prompt suppresses extraction, not just assignment.** The
    in-context arm looks more compact (326 vs 358 mentions, 32 vs 47 kind phrases, 9 vs 11 naming
    calls, pool 16 vs 22) but dropped 62 mentions the blind arm found (11 malicious URLs, 3 phishing
    URLs, 11 malicious files, 2 malicious archives, 2 target sectors, 2 phishing campaigns) and
    added 30 (14 domain names); the kind "malicious url" vanished from its vocabulary. The other
    164 differences are relabellings ("internet domain" → "domain name"). The long-tail loss
    predicted for the in-context arm therefore appears at extraction time and is invisible to
    every scheme-level metric; E5 must report mention-level recall between arms. This is the
    empirical basis for the schema-blind extractor as a stated design principle of the article.
11. **Granularity inside Malware.** The model distinguishes "malware family" (16), "malware"
    (13), "malicious file" (40) and "file" (12); the scheme merged them. ISO 25964 would keep
    family and sample as separate schemes with an instantial (BTI) link; a candidate for the
    hierarchy layer rather than a flat scheme.
12. **Overlay coverage is 70%** because Ukrainian case forms ("України" vs "Україна") do not
    align by plain surface match; E0a needs the transliteration/morphology channels of the
    SKEIN-R blocker.
