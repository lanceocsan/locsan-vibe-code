/** Operator-authored fields for one ACE pillar (summary + two evidence lines + 1–5 score). */
export type ManualAceBucketDraft = {
  summary: string;
  evidencePrimary: string;
  evidenceSecondary: string;
  score: number;
};

export type ManualAceDraft = {
  aptitude: ManualAceBucketDraft;
  character: ManualAceBucketDraft;
  effectiveness: ManualAceBucketDraft;
};

export type AceCategoryScores = {
  aptitude: number;
  character: number;
  effectiveness: number;
};

/** Request body for POST /process-text — mirrors docs/ace-eval-generator-spec §4.1 */
export type ProcessTextRequest = {
  requestId: string;
  rawText: string;
  options?: {
    manualAce: ManualAceDraft;
    strictLocal?: boolean;
    locale?: string;
    aceModelId?: string;
    /** Append anonymised intake as an indented appendix block after ACE Markdown (preview, save, PDF). */
    includeAnonymizedIntakeAppendix?: boolean;
  };
};

export type ReplacementLedgerEntry = {
  span: [number, number];
  originalClass:
    | "PERSON_PROPER"
    | "EMAIL"
    | "PHONE_PATTERN"
    | "PLACEHOLDER_OTHER";
  replacement: string;
  method: "REGEX" | "LLM" | "HEURISTIC";
};

export type AceBucket = {
  summary: string;
  evidence: string[];
};

export type AceStructure = {
  aptitude: AceBucket;
  character: AceBucket;
  effectiveness: AceBucket;
};

export type SharpNextStep = {
  text: string;
  groundedIn: string[];
};

export type ProcessValidation = {
  pronounNeutralizationOk: boolean;
  hallucinationRiskScore: number;
  flags: string[];
};

export type ProcessTextSuccessResponse = {
  requestId: string;
  anonymizedText: string;
  replacements: ReplacementLedgerEntry[];
  ace: AceStructure;
  aceScores: AceCategoryScores;
  sharp: {
    nextSteps: SharpNextStep[];
  };
  validation: ProcessValidation;
  markdown: string;
};

export type ProcessErrorResponse = {
  error: true;
  code: 400 | 422 | 500;
  message: string;
};

export type SaveEvalRequest = {
  requestId: string;
  title: string;
  rawTextOriginal: string;
  anonymizedText: string;
  aceJson: AceStructure;
  aceCategoryScoresJson: AceCategoryScores;
  sharpJson: { nextSteps: SharpNextStep[] };
  markdownFinal: string;
  validationSnapshot: ProcessValidation & {
    rawInputSha256?: string;
    finalOutputSha256?: string;
    promptVersions?: Record<string, string>;
  };
  metadata: {
    createdByOperatorId: string | null;
    tags: string[];
  };
  /** When present reuses evaluation row instead of provisioning a brand new evaluation id */
  evaluationId?: string | null;
};

export type SaveEvalResponseBody = {
  evaluationId: string;
  revisionId: string;
  savedAt: string;
};

export type HistoryItemSummary = {
  evaluationId: string;
  title: string;
  updatedAt: string;
  latestRevisionId: string;
  previewSnippet: string;
};

export type GetHistoryResponseBody = {
  items: HistoryItemSummary[];
  nextCursor: string | null;
};

export type ExportMarkdownPdfRequest = {
  markdown: string;
  suggestedBasename?: string | null;
};

export type ExportMarkdownPdfResponseBody =
  | { cancelled: true }
  | { cancelled: false; savedPath: string };
