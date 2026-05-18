import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import type {
  GetHistoryResponseBody,
  SaveEvalRequest,
  SaveEvalResponseBody,
  HistoryItemSummary,
} from "../../shared/apiTypes.js";
import {
  PROMPT_VERSION_ACE_CLASSIFIER,
  PROMPT_VERSION_ACE_WORKSPACE_MANUAL,
} from "../../shared/policyConstants.js";
import { sha256HexUtf8 } from "../../shared/hashing.js";

export class EvaluationRepository {
  constructor(private readonly database: Database.Database) {}

  persist(request: SaveEvalRequest): SaveEvalResponseBody {
    const evaluationIdentifier = request.evaluationId ?? randomUUID();
    const revisionIdentifier = randomUUID();
    const persistedAt = new Date().toISOString();

    const upsertEvaluationStatement = this.database.prepare(`
      INSERT INTO evaluations (
        evaluation_id,
        title,
        created_at,
        updated_at
      ) VALUES (
        @evaluationIdentifier,
        @title,
        @persistedAt,
        @persistedAt
      )
      ON CONFLICT(evaluation_id)
      DO UPDATE SET
        title = excluded.title,
        updated_at = excluded.updated_at
    `);

    upsertEvaluationStatement.run({
      evaluationIdentifier,
      title: request.title.slice(0, 180),
      persistedAt,
    });

    const pinnedPromptVersionsRecord = {
      ...(request.validationSnapshot.promptVersions ?? {}),
      aceClassifierVersion: PROMPT_VERSION_ACE_CLASSIFIER,
      aceWorkspaceManualVersion: PROMPT_VERSION_ACE_WORKSPACE_MANUAL,
    };

    const rawHashFingerprint = sha256HexUtf8(request.rawTextOriginal);
    const anonymizedFingerprint = sha256HexUtf8(request.anonymizedText);
    const markdownFingerprint = sha256HexUtf8(request.markdownFinal);

    const validatorPayload = JSON.stringify({
      snapshot: request.validationSnapshot,
      hashes: {
        raw: rawHashFingerprint,
        anonymized: anonymizedFingerprint,
        markdown: markdownFingerprint,
      },
      pinnedPromptVersions: pinnedPromptVersionsRecord,
    });

    const revisionPayloadSerialized = JSON.stringify({
      requestId: request.requestId,
      anonymizedText: request.anonymizedText,
      aceJson: request.aceJson,
      aceCategoryScoresJson: request.aceCategoryScoresJson,
      sharpJson: request.sharpJson,
      metadata: request.metadata,
    });

    const insertRevisionStatement = this.database.prepare(`
      INSERT INTO evaluation_revisions (
        revision_id,
        evaluation_id,
        payload_json,
        markdown,
        validator_json,
        raw_hash,
        anonymized_hash,
        prompt_versions,
        created_at
      ) VALUES (
        @revisionIdentifier,
        @evaluationIdentifier,
        @revisionPayloadSerialized,
        @markdownFinal,
        @validatorPayload,
        @rawHashFingerprint,
        @anonymizedFingerprint,
        @promptVersionsSerialized,
        @persistedAt
      )
    `);

    insertRevisionStatement.run({
      revisionIdentifier,
      evaluationIdentifier,
      revisionPayloadSerialized,
      markdownFinal: request.markdownFinal,
      validatorPayload,
      rawHashFingerprint,
      anonymizedFingerprint,
      promptVersionsSerialized: JSON.stringify(pinnedPromptVersionsRecord),
      persistedAt,
    });

    const auditIdentifier = randomUUID();
    const integritySeed = `${rawHashFingerprint}:${markdownFingerprint}:${revisionIdentifier}:${persistedAt}`;

    const insertAuditStatement = this.database.prepare(`
      INSERT INTO audit_events (
        event_id,
        evaluation_id,
        revision_id,
        event_type,
        payload_json,
        integrity_hash,
        created_at
      ) VALUES (
        @auditIdentifier,
        @evaluationIdentifier,
        @revisionIdentifier,
        'SAVE',
        @revisionPayloadSerialized,
        @integrityHashValue,
        @persistedAt
      )
    `);

    insertAuditStatement.run({
      auditIdentifier,
      evaluationIdentifier,
      revisionIdentifier,
      revisionPayloadSerialized,
      integrityHashValue: sha256HexUtf8(integritySeed),
      persistedAt,
    });

    return {
      evaluationId: evaluationIdentifier,
      revisionId: revisionIdentifier,
      savedAt: persistedAt,
    };
  }

  paginateHistory(
    cursorToken: string | null | undefined,
    requestedLimit = 50,
  ): GetHistoryResponseBody {
    const limit = Math.min(Math.max(requestedLimit, 5), 100);
    const offsetParsed =
      typeof cursorToken === "string" &&
      /^[0-9]+$/.test(cursorToken)
        ? Number(cursorToken)
        : 0;

    const sqlText = `
      SELECT
        revisions.evaluation_id AS evaluation_identifier,
        evaluations.title AS title_value,
        evaluations.updated_at AS updated_stamp,
        revisions.revision_id AS latest_revision_identifier,
        substr(revisions.markdown, 1, 160) AS preview_snippet
      FROM evaluation_revisions revisions
      INNER JOIN evaluations
        ON evaluations.evaluation_id = revisions.evaluation_id
      INNER JOIN (
        SELECT evaluation_id, MAX(created_at) AS latest_stamp
        FROM evaluation_revisions
        GROUP BY evaluation_id
      ) latest_bundle
        ON latest_bundle.evaluation_id = revisions.evaluation_id
        AND latest_bundle.latest_stamp = revisions.created_at
      ORDER BY evaluations.updated_at DESC
      LIMIT ?
      OFFSET ?
    `;

    const rowsIterator = this.database.prepare(sqlText).all(limit, offsetParsed) as Array<{
      evaluation_identifier: string;
      title_value: string;
      updated_stamp: string;
      latest_revision_identifier: string;
      preview_snippet: string | null;
    }>;

    const items: HistoryItemSummary[] = rowsIterator.map((rowEntry) => ({
      evaluationId: rowEntry.evaluation_identifier,
      title: rowEntry.title_value,
      updatedAt: rowEntry.updated_stamp,
      latestRevisionId: rowEntry.latest_revision_identifier,
      previewSnippet: rowEntry.preview_snippet ?? "",
    }));

    const nextCursorValue =
      items.length === limit ? `${offsetParsed + limit}` : null;
    return { items, nextCursor: nextCursorValue };
  }
}
