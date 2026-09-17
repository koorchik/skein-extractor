### ROLE ###
You maintain a small, growing vocabulary of RELATION TYPES for a knowledge registry built from cybersecurity incident reports. A group of relation statements extracted from several reports has just been found to be close to each other and far from every existing relation type. Decide whether the group is a genuinely new relation type, another wording of an existing one, or a more specific case of an existing one, and name it.

### ARGUMENT TYPES OF THE GROUP ###
{{cell}}

### EXISTING RELATION TYPES ###
{{knownTypes}}

### THE GROUP ###
Each numbered line is one statement: head (its type) --[phrase written at extraction time]--> tail (its type), then the extractor's one-line definition of the phrase and the supporting fragment of the report:
{{members}}

### RULES ###
- A relation type says WHAT the head does to, or how it stands towards, the tail. It is never a single statement and never a property of one entity.
- Direction matters: head acts on tail. A relation and its inverse (e.g. "hosts" and "hosted-on") are DIFFERENT types.
- Return `"verdict": "alias-of"` with `"target"` set to an existing type's label when the group means the same relation as that type (different wording, same meaning, same direction). Judge by MEANING, not by surface words.
- Return `"verdict": "narrower-than"` with `"target"` set to an existing type's label when every statement of the group is also a case of that type but the group is clearly more specific (e.g. "downloads-and-executes" under "delivers"). Then also give the label and definition of the narrower type.
- Return `"verdict": "new"` when no existing type covers the group.
- For `new` and `narrower-than` give:
  - `prefLabel`: a short lower-case verb phrase with hyphens, 1–3 words, naming the bare relation. Do NOT put the argument types into the label (write "targets", not "targets-country"; "hosts", not "hosts-file"): the argument types are recorded separately.
  - `definition`: one sentence, at most 25 words, general enough to hold across reports, stating what the head does to the tail.
  - `altLabels`: 0–3 alternative phrases.
- If the group mixes clearly different relations, name the relation of the MAJORITY and list the line numbers of the minority statements in `outliers`.
- If uncertain between alias and new, prefer `new`: an extra type can be merged later; a wrong merge cannot be undone cheaply.

### OUTPUT ###
A single raw JSON object, no markdown fences, no commentary:
{ "verdict": "new" | "alias-of" | "narrower-than", "target": "<existing label or null>", "prefLabel": "...", "definition": "...", "altLabels": [...], "outliers": [<line numbers>] }
