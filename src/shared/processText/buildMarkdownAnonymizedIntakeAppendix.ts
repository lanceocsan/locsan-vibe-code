const indentObservationLinesMarkdownSafe = (
  plaintextPayloadEnvelope: string,
): string =>
  plaintextPayloadEnvelope
    .split("\n")
    .map((observationSingleLineEnvelope) =>
      observationSingleLineEnvelope.length === 0 ? "" : `    ${observationSingleLineEnvelope}`,
    )
    .join("\n");

export const buildMarkdownAnonymizedIntakeAppendix = (
  anonymizedObservationTextPayloadUtf8: string,
): string => {
  const observationIndentedFenceFreeBlockMarkdown =
    indentObservationLinesMarkdownSafe(anonymizedObservationTextPayloadUtf8);
  const appendixHeadingLiteral = "## Anonymised intake transcript";

  const markdownAppendixBodyPayloadAssembledLiteral = `\n\n${appendixHeadingLiteral}\n\n${observationIndentedFenceFreeBlockMarkdown}\n`;

  return markdownAppendixBodyPayloadAssembledLiteral;
};
