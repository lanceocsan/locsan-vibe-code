/** Clamps ACE pillar scores from UI or IPC to integers in the inclusive range 1–5. */
export const clampAceCategoryScoreInput = (scoreCandidateEnvelope: unknown): number => {
  const numericInterpretationObservation =
    typeof scoreCandidateEnvelope === "number"
      ? scoreCandidateEnvelope
      : Number(scoreCandidateEnvelope);
  if (!Number.isFinite(numericInterpretationObservation)) {
    return 3;
  }
  const roundedInterpretationObservation = Math.round(
    numericInterpretationObservation,
  );
  return Math.max(1, Math.min(5, roundedInterpretationObservation));
};
