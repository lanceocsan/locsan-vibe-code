/** Selectors rooted at `.ace-md-export` shared by Chromium PDF HTML and renderer preview. */
export const PORTABLE_EVAL_ACE_MARKDOWN_SELECTOR_EMBEDDED_CSS = `
  .ace-md-export h1 {
    font-size: 17pt;
    margin: 1.4em 0 0.5em;
  }
  .ace-md-export h2 {
    font-size: 14pt;
    margin: 1.2em 0 0.45em;
  }
  .ace-md-export h3 {
    font-size: 12.5pt;
    margin: 1em 0 0.4em;
  }
  .ace-md-export p {
    margin: 0.45em 0;
  }
  .ace-md-export ul,
  .ace-md-export ol {
    margin: 0.5em 0 0.5em 1.25em;
    padding-left: 0.85em;
  }
  .ace-md-export blockquote {
    margin: 0.8em 0;
    padding: 0.35em 0.85em;
    border-left: 3px solid #c9d8e9;
    color: #2d3f52;
    background: #f4f8fc;
  }
  .ace-md-export code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.92em;
    background: #f0f4f8;
    padding: 0.12em 0.35em;
    border-radius: 4px;
  }
  .ace-md-export pre {
    padding: 0.75em 0.95em;
    border-radius: 6px;
    background: #0f172a;
    color: #e2e8f0;
    overflow-x: auto;
    font-size: 9pt;
    line-height: 1.4;
    page-break-inside: avoid;
  }
  .ace-md-export pre code {
    background: transparent;
    padding: 0;
    font-size: inherit;
    color: inherit;
  }
  .ace-md-export hr {
    border: none;
    border-top: 1px solid #d5dee8;
    margin: 1.25em 0;
  }
  .ace-md-export table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.85em 0;
    font-size: 10pt;
    page-break-inside: avoid;
  }
  .ace-md-export th,
  .ace-md-export td {
    border: 1px solid #c5d3e2;
    padding: 6px 8px;
    vertical-align: top;
  }
  .ace-md-export th {
    background: #eaf1f9;
    text-align: left;
  }
  .ace-md-export a {
    color: #0956b8;
    text-decoration: underline;
    word-break: break-word;
  }
`;
