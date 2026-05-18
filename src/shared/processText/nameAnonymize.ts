import type { ReplacementLedgerEntry } from "../apiTypes.js";

const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_RE = /\b(?:\+?\d{1,2}\s*)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

/** Simple capitalised token sequence treated as probable person names — regex-only MVP. */
const PROPER_PAIR_RE =
  /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b|\b(?:Mr\.|Ms\.|Mrs\.|Dr\.)\s+([A-Z][a-z]+)\b/g;

const applyReplacement = (
  input: string,
  start: number,
  endExclusive: number,
  replacement: string,
  ledger: ReplacementLedgerEntry[],
  klass: ReplacementLedgerEntry["originalClass"],
  method: ReplacementLedgerEntry["method"],
): string => {
  const before = input.slice(0, start);
  const after = input.slice(endExclusive);
  ledger.push({
    span: [start, endExclusive],
    originalClass: klass,
    replacement,
    method,
  });
  return `${before}${replacement}${after}`;
};

/**
 * Regex preprocessing for emails, plausible phone fragments, heuristic proper names.
 * Offsets rebuilt after sequential replacements applied right-to-left to avoid drift.
 */
export const runRegexDictionaryPass = (
  rawText: string,
): {
  anonymizedFragment: string;
  replacements: ReplacementLedgerEntry[];
} => {
  const ledger: ReplacementLedgerEntry[] = [];
  let cursor = rawText;

  type Hit = {
    match: RegExpExecArray | null;
    re: RegExp;
    classify: ReplacementLedgerEntry["originalClass"];
  };

  const collect = (re: RegExp, classify: ReplacementLedgerEntry["originalClass"]) => {
    const hits: { start: number; end: number; text: string; klass: typeof classify }[] = [];
    let matchResult: RegExpExecArray | null;
    const local = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
    while ((matchResult = local.exec(cursor)) !== null) {
      const text = matchResult[0];
      const start = matchResult.index;
      const end = start + text.length;
      hits.push({ start, end, text, klass: classify });
    }
    return hits;
  };

  const mergeHits = () => [
    ...collect(EMAIL_RE, "EMAIL"),
    ...collect(PHONE_RE, "PHONE_PATTERN"),
  ];

  const properHits = () => {
    const list: {
      start: number;
      end: number;
      text: string;
      klass: "PERSON_PROPER";
    }[] = [];
    let matchResult: RegExpExecArray | null;
    const re = new RegExp(PROPER_PAIR_RE.source, "g");
    while ((matchResult = re.exec(cursor)) !== null) {
      const text = matchResult[0];
      const start = matchResult.index;
      const end = start + text.length;
      list.push({ start, end, text, klass: "PERSON_PROPER" });
    }
    return list;
  };

  const allHits = [...mergeHits(), ...properHits()].sort((first, second) => second.start - first.start);

  for (const hit of allHits) {
    cursor = applyReplacement(cursor, hit.start, hit.end, "Evaluatee", ledger, hit.klass, "REGEX");
  }

  return { anonymizedFragment: cursor, replacements: ledger.reverse() };
};
