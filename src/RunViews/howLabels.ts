/**
 * Plain-language labels for the `how` codes of an assignment trail, shown by the viewers next to
 * each step of a mention's or a statement's history. A driver that records a new code makes
 * howLabels.test.ts fail until the code gets a label here.
 */
const SHARED: Record<string, string> = {
  'below-tau': 'pooled: no neighbour reached τ',
  ambiguous: 'pooled: the vote margin stayed below δ',
  knn: 'assigned by the kNN vote',
  drain: 'taken out of the pool by the re-vote that follows a mint',
};

export const SCHEME_HOW: Record<string, string> = {
  ...SHARED,
  'no-schemes': 'pooled: no scheme existed yet',
  'kind-first': 'assigned by its kind phrase (close to a dominant kind of the scheme)',
  mint: 'its pool cluster passed the mass gate and the naming call minted this scheme',
  'alias-mint': 'its pool cluster passed the mass gate and the naming call answered alias-of this scheme',
};

export const RELATION_HOW: Record<string, string> = {
  ...SHARED,
  pending: 'pending: an argument has no scheme yet, so the statement has no cell',
  'no-types': 'pooled: its cell had no relation type yet',
  'phrase-first': 'assigned by its phrase (equal to a phrase of the type)',
  mint: 'its pool cluster passed the mass gate and the naming call minted this type',
  'alias-mint': 'its pool cluster passed the mass gate and the naming call answered alias-of this type',
  'icl-known': 'typed by the second call with a label already known in the cell',
  'icl-alias': 'typed by the second call; the new label merged into a type of the cell',
  'icl-new': 'typed by the second call with a label new to the cell, which became a type at once',
};
