## Why

Exported PDFs and other Markdown consumers show Stitch-oriented HTML placeholders such as `<span data-icon="psychology"></span>`, which carry no glyph in Chromium print/PDF output and confuse readers. Operators also cannot tell how pasted **raw notes** relate to the **Markdown preview** because the synthesized document is ACE-structured summary material built from **anonymized** text—not a transcript of what they typed.

## What Changes

- Remove or replace non-portable `<span data-icon="…"></span>` hooks in Markdown (or strip them reliably on export) so PDF and shareable Markdown contain only plain, readable content (headings, lists, summaries, optional Unicode/icon replacement).
- Make the **direct-entry workflow** explicit in product behavior: clarify (in UX copy and/or spec) that Markdown is generated from pipeline outputs (anonymized notes → ACE buckets → sharpening), not an echo of raw input; optionally define follow-up UX for “show my wording” when that remains a gap.

## Capabilities

### New Capabilities

- `markdown-export-portable`: Composition and export surfaces (Markdown string, PDF) MUST NOT expose HTML-only sentinel markup meant for Stitch; portable representations (titles, headings, bullets) only.
- `direct-entry-workflow-transparency`: The workspace MUST make clear what the Markdown preview represents (derived ACE/evaluation draft vs. pasted raw notes), so operators know how to reach their outcomes (e.g., ensuring anonymized narrative quality, sharpening toggles).

### Modified Capabilities

<!-- None: openspec/specs currently has no prior capability deltas in-repo. -->

## Impact

- `src/shared/processText/composeMarkdown.ts` (source of `data-icon` spans).
- `src/main/pdf/createMarkdownPdfBuffer.ts` (optional sanitizer if composition keeps legacy hooks).
- `src/renderer/pages/WorkspacePage.tsx` (helper text / disclosure near preview or toolbar).
- Human-facing docs: `docs/ace-eval-generator-spec.md` or inline UI only (per design).
