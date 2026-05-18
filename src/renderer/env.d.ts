/// <reference types="vite/client" />

import type {
  ExportMarkdownPdfRequest,
  ExportMarkdownPdfResponseBody,
  ProcessTextRequest,
  ProcessTextSuccessResponse,
  GetHistoryResponseBody,
  SaveEvalRequest,
  SaveEvalResponseBody,
} from "../shared/apiTypes.js";

type SuccessWrap<TPayload> = { ok: true; data: TPayload };
type FaultWrap = { ok: false; error: { code: number; message: string } };

declare global {
  interface Window {
    aceDeskApi: {
      processTextRequest: (
        payload: ProcessTextRequest,
      ) => Promise<SuccessWrap<ProcessTextSuccessResponse> | FaultWrap>;
      getHistoryPage: (query: {
        cursor?: string | null;
        limit?: number;
      }) => Promise<SuccessWrap<GetHistoryResponseBody> | FaultWrap>;
      saveEvaluationRevision: (
        payload: SaveEvalRequest,
      ) => Promise<SuccessWrap<SaveEvalResponseBody> | FaultWrap>;
      exportMarkdownPdf: (
        payload: ExportMarkdownPdfRequest,
      ) => Promise<SuccessWrap<ExportMarkdownPdfResponseBody> | FaultWrap>;
    };
  }
}
