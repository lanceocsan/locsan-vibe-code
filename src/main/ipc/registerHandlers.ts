import fs from "node:fs/promises";
import path from "node:path";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { initialiseDatabase } from "../database/migrate.js";
import { EvaluationRepository } from "../database/evaluationRepository.js";
import { createProcessTextResponse } from "../../shared/processText/processPipeline.js";
import { rasteriseMarkdownToPdfPayloadBufferFromSource } from "../pdf/createMarkdownPdfBuffer.js";
import type {
  ExportMarkdownPdfRequest,
  ExportMarkdownPdfResponseBody,
  ProcessTextRequest,
  SaveEvalRequest,
} from "../../shared/apiTypes.js";
import { sha256HexUtf8 } from "../../shared/hashing.js";
import {
  PROMPT_VERSION_ACE_CLASSIFIER,
  PROMPT_VERSION_ACE_WORKSPACE_MANUAL,
} from "../../shared/policyConstants.js";

type IpcEnvelopeSuccess<TPayload> = { ok: true; data: TPayload };
type IpcEnvelopeFailure = {
  ok: false;
  error: { code: number; message: string };
};

const sanitizePdfSuggestedBasenameStem = (
  suggestedBasenameRawCandidate?: string | null,
): string => {
  const fallbackPdfBasenameStem = "ace-evaluation-export";
  if (!suggestedBasenameRawCandidate || !suggestedBasenameRawCandidate.trim()) {
    return fallbackPdfBasenameStem;
  }
  const alphanumericScrubStem = suggestedBasenameRawCandidate
    .replace(/[<>:"/\\|?*\u0000-\u001f]/gu, "")
    .trim()
    .slice(0, 96);
  return alphanumericScrubStem.length > 0
    ? alphanumericScrubStem
    : fallbackPdfBasenameStem;
};

export const registerIpcHandlers = (): void => {
  const databaseAbsolutePath = path.join(
    app.getPath("userData"),
    "ace-eval.sqlite",
  );
  const databaseInstance = initialiseDatabase(databaseAbsolutePath);
  const repository = new EvaluationRepository(databaseInstance);

  ipcMain.handle(
    "ace:process-text",
    async (_eventContext, envelopeUnknown): Promise<
      | IpcEnvelopeSuccess<Awaited<ReturnType<typeof createProcessTextResponse>>>
      | IpcEnvelopeFailure
    > => {
      try {
        const typedEnvelope = envelopeUnknown as ProcessTextRequest;
        const pipelineOutcome = await createProcessTextResponse(typedEnvelope);
        if ("code" in pipelineOutcome) {
          return {
            ok: false,
            error: {
              code: pipelineOutcome.code,
              message: pipelineOutcome.message,
            },
          };
        }
        return { ok: true, data: pipelineOutcome };
      } catch (thrownProblem) {
        const detail =
          thrownProblem instanceof Error
            ? thrownProblem.message
            : "Unexpected processing failure";
        return {
          ok: false,
          error: { code: 500, message: detail },
        };
      }
    },
  );

  ipcMain.handle(
    "ace:get-history",
    (
      _eventContext,
      queryUnknown,
    ):
      | IpcEnvelopeSuccess<ReturnType<EvaluationRepository["paginateHistory"]>>
      | IpcEnvelopeFailure => {
      try {
        const parsedQueryRecord = queryUnknown as {
          cursor?: string | null;
          limit?: number;
        };
        const paginationOutcome = repository.paginateHistory(
          parsedQueryRecord.cursor ?? null,
          parsedQueryRecord.limit ?? 50,
        );
        return { ok: true, data: paginationOutcome };
      } catch (_thrownPaginationError) {
        return {
          ok: false,
          error: { code: 500, message: "History query failed" },
        };
      }
    },
  );

  ipcMain.handle(
    "ace:save-eval",
    (_evt, savePayloadUnknown):
      | IpcEnvelopeSuccess<ReturnType<EvaluationRepository["persist"]>>
      | IpcEnvelopeFailure => {
      try {
        const savePayload = savePayloadUnknown as SaveEvalRequest;
        const mergedSnapshot = {
          ...savePayload.validationSnapshot,
          rawInputSha256: sha256HexUtf8(savePayload.rawTextOriginal),
          finalOutputSha256: sha256HexUtf8(savePayload.markdownFinal),
          promptVersions: {
            ...(savePayload.validationSnapshot.promptVersions ?? {}),
            aceClassifier: PROMPT_VERSION_ACE_CLASSIFIER,
            aceWorkspaceManual: PROMPT_VERSION_ACE_WORKSPACE_MANUAL,
          },
        };

        const normalisedPayload: SaveEvalRequest = {
          ...savePayload,
          validationSnapshot: mergedSnapshot,
        };

        const persistenceOutcome =
          repository.persist(normalisedPayload);
        return {
          ok: true,
          data: persistenceOutcome,
        };
      } catch (_persistenceThrown) {
        return {
          ok: false,
          error: { code: 500, message: "SAVE_REV_FAILED" },
        };
      }
    },
  );

  ipcMain.handle(
    "ace:export-markdown-pdf",
    async (
      ipcInvocationElectronEvent,
      exportEnvelopePayloadUnknown,
    ): Promise<
      | IpcEnvelopeSuccess<ExportMarkdownPdfResponseBody>
      | IpcEnvelopeFailure
    > => {
      try {
        const typedExportMarkdownEnvelope =
          exportEnvelopePayloadUnknown as ExportMarkdownPdfRequest;
        const markdownExportPayload = typedExportMarkdownEnvelope.markdown;

        if (
          markdownExportPayload === undefined ||
          markdownExportPayload === null ||
          typeof markdownExportPayload !== "string"
        ) {
          return {
            ok: false,
            error: {
              code: 400,
              message: "Markdown_export_payload_missing",
            },
          };
        }

        const rasterPdfPhaseOutcomeEnvelope =
          await rasteriseMarkdownToPdfPayloadBufferFromSource(
            markdownExportPayload,
          );

        if (!rasterPdfPhaseOutcomeEnvelope.rasterisationOk) {
          return {
            ok: false,
            error: {
              code: 500,
              message:
                rasterPdfPhaseOutcomeEnvelope.rasterisationFaultReason,
            },
          };
        }

        const parentBrowserWindowHostingInvoke =
          BrowserWindow.fromWebContents(ipcInvocationElectronEvent.sender);

        const defaultSaveDialogStemLabel = sanitizePdfSuggestedBasenameStem(
          typedExportMarkdownEnvelope.suggestedBasename ?? undefined,
        );

        const filesystemLocationPickerOutcomeEnvelope =
          await dialog.showSaveDialog(
            parentBrowserWindowHostingInvoke ?? undefined,
            {
              defaultPath: `${defaultSaveDialogStemLabel}.pdf`,
              filters: [
                {
                  extensions: ["pdf"],
                  name: "PDF document",
                },
              ],
            },
          );

        const chosenAbsolutePathEnvelope =
          filesystemLocationPickerOutcomeEnvelope.filePath;

        if (
          filesystemLocationPickerOutcomeEnvelope.canceled === true ||
          chosenAbsolutePathEnvelope === undefined
        ) {
          return { ok: true, data: { cancelled: true } };
        }

        await fs.writeFile(
          chosenAbsolutePathEnvelope,
          rasterPdfPhaseOutcomeEnvelope.pdfPayloadBuffer,
        );

        return {
          ok: true,
          data: {
            cancelled: false,
            savedPath: chosenAbsolutePathEnvelope,
          },
        };
      } catch (caughtOutboundDiskWriteFailureEnvelope) {
        console.error(
          "[ace-eval] Markdown PDF save failure",
          caughtOutboundDiskWriteFailureEnvelope,
        );
        const faultOutboundNarrativeLiteral =
          caughtOutboundDiskWriteFailureEnvelope instanceof Error
            ? caughtOutboundDiskWriteFailureEnvelope.message
            : "PDF_export_write_failed";

        return {
          ok: false,
          error: { code: 500, message: faultOutboundNarrativeLiteral },
        };
      }
    },
  );
};
