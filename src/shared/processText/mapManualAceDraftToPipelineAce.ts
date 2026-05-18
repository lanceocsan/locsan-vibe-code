import type {
  AceBucket,
  AceCategoryScores,
  AceStructure,
  ManualAceBucketDraft,
  ManualAceDraft,
} from "../apiTypes.js";
import { ACE_EMPTY_BUCKET_SUMMARY } from "../policyConstants.js";
import { clampAceCategoryScoreInput } from "./clampAceCategoryScoreInput.js";

const createEmptyBucket = (): AceBucket => ({
  summary: ACE_EMPTY_BUCKET_SUMMARY,
  evidence: [],
});

const mapSingleBucketFromManual = (
  bucketDraft: ManualAceBucketDraft,
): AceBucket => {
  const summaryTrimmed = bucketDraft.summary.trim();
  const evidenceCandidates = [
    bucketDraft.evidencePrimary.trim(),
    bucketDraft.evidenceSecondary.trim(),
  ].filter((segment) => segment.length > 0);

  const summaryVacant = summaryTrimmed.length === 0;
  const evidenceVacant = evidenceCandidates.length === 0;

  if (summaryVacant && evidenceVacant) {
    return createEmptyBucket();
  }

  if (!summaryVacant) {
    return {
      summary: summaryTrimmed,
      evidence: evidenceCandidates,
    };
  }

  const headlineSummary = evidenceCandidates[0] ?? ACE_EMPTY_BUCKET_SUMMARY;
  const remainderEvidence = evidenceCandidates.slice(1);

  return {
    summary: headlineSummary,
    evidence: remainderEvidence,
  };
};

export const mapManualAceDraftToPipelineAce = (
  manualAceDraft: ManualAceDraft,
): {
  aceStructure: AceStructure;
  aceScores: AceCategoryScores;
} => ({
  aceStructure: {
    aptitude: mapSingleBucketFromManual(manualAceDraft.aptitude),
    character: mapSingleBucketFromManual(manualAceDraft.character),
    effectiveness: mapSingleBucketFromManual(manualAceDraft.effectiveness),
  },
  aceScores: {
    aptitude: clampAceCategoryScoreInput(manualAceDraft.aptitude.score),
    character: clampAceCategoryScoreInput(manualAceDraft.character.score),
    effectiveness: clampAceCategoryScoreInput(manualAceDraft.effectiveness.score),
  },
});
