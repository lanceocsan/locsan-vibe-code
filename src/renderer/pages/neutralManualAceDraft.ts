import type { ManualAceDraft } from "../../shared/apiTypes.js";

const emptyBucketSketch = (): ManualAceDraft["aptitude"] => ({
  summary: "",
  evidencePrimary: "",
  evidenceSecondary: "",
  score: 3,
});

/** Default manual ACE scaffold before operators author pillars. */
export const readNeutralManualAceDraftSkeleton = (): ManualAceDraft => ({
  aptitude: emptyBucketSketch(),
  character: emptyBucketSketch(),
  effectiveness: emptyBucketSketch(),
});
