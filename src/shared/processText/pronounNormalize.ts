import type { ReplacementLedgerEntry } from "../apiTypes.js";

/** Deterministic singular they conversion for MVP English coverage — see fixtures. */
export const normalizeEnglishThirdPersonSingularToThey = (
  input: string,
): { text: string; applied: boolean } => {
  let applied = false;
  let cursor = input;

  const swaps: ReadonlyArray<{ pattern: RegExp; replace: string }> = [
    { pattern: /\bHer\b/g, replace: "Them" },
    { pattern: /\bher\b/g, replace: "them" },
    { pattern: /\bHe\b/g, replace: "They" },
    { pattern: /\bhe\b/g, replace: "they" },
    { pattern: /\bShe\b/g, replace: "They" },
    { pattern: /\bshe\b/g, replace: "they" },
    { pattern: /\bHis\b/g, replace: "Their" },
    { pattern: /\bhis\b/g, replace: "their" },
    { pattern: /\bHers\b/g, replace: "Theirs" },
    { pattern: /\bhers\b/g, replace: "theirs" },
    { pattern: /\bHim\b/g, replace: "Them" },
    { pattern: /\bhim\b/g, replace: "them" },
    { pattern: /\bHimself\b/g, replace: "Themself" },
    { pattern: /\bhimself\b/g, replace: "themself" },
    { pattern: /\bHerself\b/g, replace: "Themself" },
    { pattern: /\bherself\b/g, replace: "themself" },
    { pattern: /\bHer\b/g, replace: "Their" },
    { pattern: /\bher\b/g, replace: "their" },
  ];

  for (const { pattern, replace } of swaps) {
    cursor = cursor.replace(pattern, (matched) => {
      void matched;
      applied = true;
      return replace;
    });
  }

  return { text: cursor, applied };
};

/** Residual gendered-token scanner aligned with QA guidance in technical spec. */
export const containsResidualGenderedPronounsEnglish = (
  text: string,
): boolean => /\b(he|she|his|hers|him|himself|herself)\b/i.test(text);
