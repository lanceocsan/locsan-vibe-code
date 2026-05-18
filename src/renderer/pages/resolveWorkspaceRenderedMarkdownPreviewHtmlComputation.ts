const PIPELINE_PREVIEW_FAILURE_BANNER_LITERAL = "Unable to synthesize preview.";

const MARKDOWN_PREVIEW_INTAKE_EMPTINESS_PLACEHOLDER_LITERAL =
  "Paste notes to populate preview…";

type ResolveWorkspaceRenderedMarkdownPreviewHtmlComputationInput = {
  readonly markdownDraftPayloadLiteral: string;
  readonly evaluationDraftHydratedFlag: boolean;
  readonly portableRenderedHtmlEnvelopeObservation: string;
};

/** Maps Markdown draft + hydration flags to sanitized HTML snippet for dangerouslySetInnerHTML. */
export const resolveWorkspaceRenderedMarkdownPreviewHtmlComputation = (
  inputEnvelope: ResolveWorkspaceRenderedMarkdownPreviewHtmlComputationInput,
): string => {
  const previewFaultFlagObservation =
    inputEnvelope.markdownDraftPayloadLiteral ===
    PIPELINE_PREVIEW_FAILURE_BANNER_LITERAL;

  if (previewFaultFlagObservation === true) {
    const faultBannerInlineHtmlOutboundLiteral =
      `<p class="workspace-md-preview-inline-fault-tone">${PIPELINE_PREVIEW_FAILURE_BANNER_LITERAL}</p>`;

    return faultBannerInlineHtmlOutboundLiteral;
  }

  const previewShellEmptyObservation =
    !inputEnvelope.evaluationDraftHydratedFlag ||
    inputEnvelope.markdownDraftPayloadLiteral.trim().length === 0 ||
    inputEnvelope.markdownDraftPayloadLiteral ===
      MARKDOWN_PREVIEW_INTAKE_EMPTINESS_PLACEHOLDER_LITERAL;

  if (previewShellEmptyObservation === true) {
    const mutedPlaceholderInlineHtmlOutboundLiteral =
      `<p class="workspace-md-preview-inline-muted-tone">${MARKDOWN_PREVIEW_INTAKE_EMPTINESS_PLACEHOLDER_LITERAL}</p>`;

    return mutedPlaceholderInlineHtmlOutboundLiteral;
  }

  const portableOutboundHtmlObservation =
    inputEnvelope.portableRenderedHtmlEnvelopeObservation;

  return portableOutboundHtmlObservation;
};
