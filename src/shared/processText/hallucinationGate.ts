import type { SharpNextStep } from "../apiTypes.js";

const collapseWhitespace = (value: string): string =>
  value.toLocaleLowerCase("en-US").replace(/\s+/g, " ").trim();

const corpusSlices = ({
  anonymizedNotes,
  evidencePieces,
}: {
  anonymizedNotes: string;
  evidencePieces: string[];
}): string[] => {
  const combined = [...evidencePieces, anonymizedNotes];
  const snippets = new Set<string>();
  for (const blob of combined) {
    collapseWhitespace(blob)
      .split(/[.;]/)
      .map((chunk) => chunk.trim())
      .filter((chunk) => chunk.length > 8)
      .forEach((chunk) => snippets.add(chunk));
  }
  return Array.from(snippets);
};

/** Lexical overlap sentinel — flagged when sharpening copy diverges materially from excerpts. */
export const estimateHallucinationRisk = ({
  anonymizedNotes,
  evidencePieces,
  nextSteps,
}: {
  anonymizedNotes: string;
  evidencePieces: string[];
  nextSteps: SharpNextStep[];
}): number => {
  if (nextSteps.length === 0) {
    return 0;
  }
  const corpus = corpusSlices({ anonymizedNotes, evidencePieces });
  let penalties = 0;
  nextSteps.forEach((stepRow) => {
    const lowered = collapseWhitespace(stepRow.text);
    const matched = corpus.some((sliceCandidate) =>
      lowered.includes(sliceCandidate.slice(0, Math.min(sliceCandidate.length, 32))),
    );
    penalties += matched ? 0 : 1;
  });
  return Number(Math.min(1, penalties / nextSteps.length).toFixed(2));
};
