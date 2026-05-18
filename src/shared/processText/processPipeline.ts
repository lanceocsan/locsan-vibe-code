import type {
  AceStructure,
  ProcessTextRequest,
  ProcessTextSuccessResponse,
  SharpNextStep,
} from "../apiTypes.js";
import {
  PROMPT_VERSION_ACE_CLASSIFIER,
  PROMPT_VERSION_ACE_WORKSPACE_MANUAL,
} from "../policyConstants.js";
import { composeAceMarkdownExport } from "./composeMarkdown.js";
import { mapManualAceDraftToPipelineAce } from "./mapManualAceDraftToPipelineAce.js";
import { runRegexDictionaryPass } from "./nameAnonymize.js";
import {
  applyLlmNameAdjudication,
  isProcessTextErrorStub,
} from "./llmAdjudicate.js";
import {
  containsResidualGenderedPronounsEnglish,
  normalizeEnglishThirdPersonSingularToThey,
} from "./pronounNormalize.js";
import { estimateHallucinationRisk } from "./hallucinationGate.js";
import { buildMarkdownAnonymizedIntakeAppendix } from "./buildMarkdownAnonymizedIntakeAppendix.js";

export type ProcessTextFault =
  | { code: 400 | 422 | 500; message: string };

const collectEvidenceStrings = (aceBuckets: AceStructure): string[] => [
  ...aceBuckets.aptitude.evidence,
  ...aceBuckets.character.evidence,
  ...aceBuckets.effectiveness.evidence,
];

const emptySharpRows: SharpNextStep[] = [];

/** Runs anonymisation → manual ACE buckets → validation artefacts. */
export const createProcessTextResponse = async (
  incoming: ProcessTextRequest,
): Promise<ProcessTextSuccessResponse | ProcessTextFault> => {
  const sanitisedIncoming = incoming.rawText.trim();
  if (!sanitisedIncoming) {
    return { code: 400, message: "rawText MUST NOT be empty" };
  }

  const manualAceDraft = incoming.options?.manualAce;
  if (!manualAceDraft) {
    return { code: 422, message: "options.manualAce is required" };
  }

  const {
    strictLocal = true,
    aceModelId,
    locale,
    includeAnonymizedIntakeAppendix = false,
  } = incoming.options ?? {};

  void locale;

  const regexPass = runRegexDictionaryPass(sanitisedIncoming);
  const pronounPass = normalizeEnglishThirdPersonSingularToThey(
    regexPass.anonymizedFragment,
  );

  const adjudicationOutcome = await applyLlmNameAdjudication({
    anonymizedDraft: pronounPass.text,
    aceModelConfigured: Boolean(aceModelId),
    strictLocal,
  });

  if (isProcessTextErrorStub(adjudicationOutcome)) {
    return {
      code: adjudicationOutcome.code,
      message: adjudicationOutcome.detail,
    };
  }

  const ledgerAccumulator = [...regexPass.replacements, ...adjudicationOutcome.ledgerAdds];

  const anonymizedTextFinal = adjudicationOutcome.text.trim().replace(/\s+/g, " ");

  const { aceStructure: aceBuckets, aceScores } =
    mapManualAceDraftToPipelineAce(manualAceDraft);

  const evidencePieces = collectEvidenceStrings(aceBuckets);

  const hallucinationRisk = estimateHallucinationRisk({
    anonymizedNotes: anonymizedTextFinal,
    evidencePieces,
    nextSteps: emptySharpRows,
  });

  const pronounsOkAfterPass = !containsResidualGenderedPronounsEnglish(
    anonymizedTextFinal,
  );

  const flags: string[] = [];
  if (!pronounsOkAfterPass) {
    flags.push("pronoun_residual_tokens");
  }

  let markdownRendered = composeAceMarkdownExport({
    ace: aceBuckets,
    aceScores,
  });

  const anonymizedAppendixEnabledLiteral = includeAnonymizedIntakeAppendix === true;

  if (anonymizedAppendixEnabledLiteral) {
    markdownRendered += buildMarkdownAnonymizedIntakeAppendix(anonymizedTextFinal);
  }

  markdownRendered += `\n\n_PROMPT_META_ACE:${PROMPT_VERSION_ACE_CLASSIFIER};WORKSPACE:${PROMPT_VERSION_ACE_WORKSPACE_MANUAL}_\n`;

  return {
    requestId: incoming.requestId,
    anonymizedText: anonymizedTextFinal,
    replacements: ledgerAccumulator,
    ace: aceBuckets,
    aceScores,
    sharp: { nextSteps: emptySharpRows },
    validation: {
      pronounNeutralizationOk: pronounsOkAfterPass,
      hallucinationRiskScore: hallucinationRisk,
      flags,
    },
    markdown: markdownRendered,
  };
};
