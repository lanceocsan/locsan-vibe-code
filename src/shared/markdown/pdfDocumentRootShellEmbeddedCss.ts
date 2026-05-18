/**
 * Typography + margin rules injected only into Electron full-document PDF HTML.
 * Omit from renderer preview (`body{}` must not leak into the SPA shell).
 */
export const PORTABLE_EVAL_PDF_DOCUMENT_ROOT_SHELL_EMBEDDED_CSS = `
  @page {
    margin: 18mm 16mm;
  }
  body {
    font-family: ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.45;
    color: #14191f;
  }
`;
