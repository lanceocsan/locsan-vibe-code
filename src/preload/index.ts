import { contextBridge, ipcRenderer } from "electron";
import type {
  ExportMarkdownPdfRequest,
  ExportMarkdownPdfResponseBody,
  GetHistoryResponseBody,
  ProcessTextRequest,
  ProcessTextSuccessResponse,
  SaveEvalRequest,
  SaveEvalResponseBody,
} from "../shared/apiTypes.js";

type SuccessWrap<TPayload> = { ok: true; data: TPayload };
type FaultWrap = { ok: false; error: { code: number; message: string } };

export type AceDeskApi = {
  processTextRequest: (
    payload: ProcessTextRequest,
  ) => Promise<
    SuccessWrap<ProcessTextSuccessResponse> | FaultWrap
  >;
  getHistoryPage: (
    query: {
      cursor?: string | null;
      limit?: number;
    },
  ) => Promise<SuccessWrap<GetHistoryResponseBody> | FaultWrap>;
  saveEvaluationRevision: (
    payload: SaveEvalRequest,
  ) => Promise<SuccessWrap<SaveEvalResponseBody> | FaultWrap>;
  exportMarkdownPdf: (
    payload: ExportMarkdownPdfRequest,
  ) => Promise<SuccessWrap<ExportMarkdownPdfResponseBody> | FaultWrap>;
};

const deskApiImplementation: AceDeskApi = {
  processTextRequest: (payloadEnvelope) =>
    ipcRenderer.invoke("ace:process-text", payloadEnvelope),
  getHistoryPage: (incomingQueryEnvelope) =>
    ipcRenderer.invoke("ace:get-history", incomingQueryEnvelope),
  saveEvaluationRevision: (incomingSaveEnvelope) =>
    ipcRenderer.invoke("ace:save-eval", incomingSaveEnvelope),
  exportMarkdownPdf: (incomingExportEnvelope) =>
    ipcRenderer.invoke("ace:export-markdown-pdf", incomingExportEnvelope),
};

contextBridge.exposeInMainWorld("aceDeskApi", deskApiImplementation);
