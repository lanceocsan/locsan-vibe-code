import type { ReplacementLedgerEntry } from "../apiTypes.js";

export type ProcessTextErrorStub = {
  status: "unavailable_local";
  code: 422;
  detail: string;
};

export type LlmAdjustment = {
  text: string;
  ledgerAdds: ReplacementLedgerEntry[];
};

/**
 * Stub LLM adjudication pathway — honours strict-local by skipping remote calls until a real bridge ships.
 * When `aceModelId` is requested (aceModelConfigured=true) and strict-local is true, callers must fail closed.
 */
export const applyLlmNameAdjudication = async ({
  anonymizedDraft,
  strictLocal,
  aceModelConfigured,
}: {
  anonymizedDraft: string;
  strictLocal?: boolean;
  aceModelConfigured: boolean;
}): Promise<LlmAdjustment | ProcessTextErrorStub> => {
  if (!aceModelConfigured) {
    return { text: anonymizedDraft, ledgerAdds: [] };
  }
  const enforceLocal = Boolean(strictLocal ?? true);
  if (enforceLocal) {
    return {
      status: "unavailable_local",
      code: 422,
      detail: "Model unavailable while strict-local mode enforced",
    };
  }
  return { text: anonymizedDraft, ledgerAdds: [] };
};

export function isProcessTextErrorStub(
  value: LlmAdjustment | ProcessTextErrorStub,
): value is ProcessTextErrorStub {
  return "status" in value && value.status === "unavailable_local";
}
