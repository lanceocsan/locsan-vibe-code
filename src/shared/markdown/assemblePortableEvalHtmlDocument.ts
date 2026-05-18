import { PORTABLE_EVAL_ACE_MARKDOWN_SELECTOR_EMBEDDED_CSS } from "./aceMarkdownExportSelectorsEmbeddedCss.js";
import { PORTABLE_EVAL_PDF_DOCUMENT_ROOT_SHELL_EMBEDDED_CSS } from "./pdfDocumentRootShellEmbeddedCss.js";

export const assemblePortableEvalHtmlStandaloneDocument = (
  htmlBodyInnerFragmentMarked: string,
): string =>
  `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="color-scheme" content="light"/>
<title>ACE evaluation export</title>
<style>${PORTABLE_EVAL_PDF_DOCUMENT_ROOT_SHELL_EMBEDDED_CSS}${PORTABLE_EVAL_ACE_MARKDOWN_SELECTOR_EMBEDDED_CSS}</style>
</head>
<body>
<article class="ace-md-export">${htmlBodyInnerFragmentMarked}</article>
</body>
</html>`;
