## Why

Operators export to PDF expecting the on-screen Markdown draft to resemble the printed layout, but the workspace shows **raw Markdown in a monospace `<pre>`**, so typography and structure diverge from the Chromium `printToPDF` path. It also remains unclear **how pasted raw notes influence**—or can be shown on—the evaluation PDF without reading internal pipeline code.

## What Changes

- Add a **rendered HTML preview** of the synthesized evaluation Markdown so structure (headings, lists, summaries) resembles the PDF export before the operator saves (with an optional paired “source Markdown” disclosure for parity checks).
- Add **operator guidance** in the workspace: short, plain-language explanation of the anonymize → classify → sharpen → compose flow plus practical tips so evaluators maximize traceability from intake to buckets.
- Add an explicit **toggle (or persisted preference)** to **append anonymized intake text** as a fenced section in the composed Markdown draft so verbatim narrative (post-anonymization) CAN appear on the PDF when the operator chooses—which answers “how do I get my notes on the PDF?” without implying the ACE summary is a transcript.

## Capabilities

### New Capabilities

- `rendered-markdown-preview`: Rendered preview surface for the synthesized evaluation Markdown aligned with portable Markdown rules and PDF typography intent.
- `evaluation-pdf-source-guidance`: In-product guidelines and configurable inclusion of anonymized source notes inside the Markdown body used for preview, SQLite persistence, Clipboard, and PDF.

### Modified Capabilities

<!-- openspec/specs has no archived capability deltas in-repo needing modification. -->

## Impact

- `src/renderer/pages/WorkspacePage.tsx` (+ possible small extracted preview component/CSS).
- `src/shared/processText/processPipeline.ts` and `composeMarkdown.ts` (optional appendix blocks).
- `src/shared/apiTypes.ts` (`ProcessTextRequest.options` extension).
- `src/main/pdf/createMarkdownPdfBuffer.ts` (consume shared typography helpers / CSS parity if extracted).
- New shared module(s) under `src/shared/` for Markdown rendering configuration parity (renderer + main).
