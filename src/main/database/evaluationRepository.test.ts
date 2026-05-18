import { randomUUID } from "node:crypto";
import Database from "better-sqlite3";
import { describe, expect, test, afterEach } from "vitest";
import { initialiseDatabase } from "./migrate.js";
import { EvaluationRepository } from "./evaluationRepository.js";
import type { SaveEvalRequest } from "../../shared/apiTypes.js";
import { ACE_EMPTY_BUCKET_SUMMARY } from "../../shared/policyConstants.js";

describe("evaluationRepository.sqlite", () => {
  let ephemeralDatabase: Database.Database;

  afterEach(() => {
    ephemeralDatabase?.close();
  });

  test("persists revisions with hashes", () => {
    ephemeralDatabase = initialiseDatabase(":memory:");
    const repositoryUnderTest = new EvaluationRepository(ephemeralDatabase);

    const emptyAceSnapshotStructure = {
      aptitude: {
        summary: ACE_EMPTY_BUCKET_SUMMARY,
        evidence: [] as string[],
      },
      character: {
        summary: ACE_EMPTY_BUCKET_SUMMARY,
        evidence: [] as string[],
      },
      effectiveness: {
        summary: ACE_EMPTY_BUCKET_SUMMARY,
        evidence: [] as string[],
      },
    };

    const savePayloadMinimal: SaveEvalRequest = {
      evaluationId: null,
      requestId: randomUUID(),
      title: "Pilot evaluation",
      rawTextOriginal: "Dr. Patel mentored juniors.",
      anonymizedText: "Evaluatee mentored juniors.",
      aceJson: emptyAceSnapshotStructure,
      aceCategoryScoresJson: { aptitude: 3, character: 3, effectiveness: 3 },
      sharpJson: { nextSteps: [] },
      markdownFinal: "# Draft",
      validationSnapshot: {
        pronounNeutralizationOk: true,
        hallucinationRiskScore: 0,
        flags: [],
      },
      metadata: { createdByOperatorId: null, tags: [] },
    };

    const firstSaveEcho = repositoryUnderTest.persist(savePayloadMinimal);

    expect(firstSaveEcho.evaluationId).toBeTruthy();
    expect(firstSaveEcho.revisionId).toBeTruthy();

    const pagingEnvelope = repositoryUnderTest.paginateHistory(null, 10);
    expect(pagingEnvelope.items).toHaveLength(1);

    const secondSaveContinuation = repositoryUnderTest.persist({
      ...savePayloadMinimal,
      evaluationId: firstSaveEcho.evaluationId,
      title: "Pilot evaluation revised",
      markdownFinal: "# Draft revised",
      rawTextOriginal: "Second pass",
      anonymizedText: "Evaluatee iterated.",
    });

    expect(secondSaveContinuation.revisionId).not.toEqual(firstSaveEcho.revisionId);
    expect(repositoryUnderTest.paginateHistory(null, 10).items).toHaveLength(1);
  });
});
