export type WorkspaceMarkdownPreviewSurfaceLiteralsPreference =
  | "rendered"
  | "source";

export const readInitialMarkdownPreviewSurfaceFromWebStorage =
  (): WorkspaceMarkdownPreviewSurfaceLiteralsPreference => {
    try {
      const storedPreviewSurfaceLiteralObservation =
        window.localStorage.getItem(
          "ace-eval.local.markdown_preview_surface_preference.v1",
        );

      if (storedPreviewSurfaceLiteralObservation === "source") {
        const sourceSurfaceOutboundLiteral: WorkspaceMarkdownPreviewSurfaceLiteralsPreference =
          "source";

        return sourceSurfaceOutboundLiteral;
      }

      if (storedPreviewSurfaceLiteralObservation === "rendered") {
        const renderedSurfaceOutboundLiteral: WorkspaceMarkdownPreviewSurfaceLiteralsPreference =
          "rendered";

        return renderedSurfaceOutboundLiteral;
      }

      const defaultRenderedOutboundLiteral: WorkspaceMarkdownPreviewSurfaceLiteralsPreference =
        "rendered";

      return defaultRenderedOutboundLiteral;
    } catch (_persistedPeekFaultEnvelopeObservation) {
      const fallbackRenderedOutboundLiteral: WorkspaceMarkdownPreviewSurfaceLiteralsPreference =
        "rendered";

      return fallbackRenderedOutboundLiteral;
    }
  };

export const persistMarkdownPreviewSurfaceLiteralsEnvelope = (
  nextSurfaceEnvelope: WorkspaceMarkdownPreviewSurfaceLiteralsPreference,
): void => {
  try {
    window.localStorage.setItem(
      "ace-eval.local.markdown_preview_surface_preference.v1",
      nextSurfaceEnvelope,
    );
  } catch (_persistedPersistFaultEnvelopeObservation) {}
};
