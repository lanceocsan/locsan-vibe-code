## Context

The renderer previews pipeline output inside `<pre>{markdownPreviewRendered}</pre>` while PDF generation builds HTML via `markdown-it` plus a Chromium print stylesheet. Operators lack visual parity and operational guidance tying **raw intake** to **PDF body**.

## Goals / Non-Goals

**Goals:**

- Default workspace experience shows a **readable rendered preview** of the synthesized Markdown string that will export to PDF.
- Maintain **parity of Markdown semantics** (`markdown-it` defaults: `html: false`, linkify/break choices) between renderer preview and PDF HTML generation—centralize configuration in a **`src/shared/`** helper imported by Electron main PDF path and renderer.
- Ship **persistent UI guidance** (collapsible/disclosure region) documenting pipeline flow and actionable tips (“short paragraphs”, “explicit outcomes”, etc.).
- Allow operators to optionally **append anonymized intake** as Markdown under an agreed heading (e.g., `## Anonymized intake notes`) so PDF reviews can cite phrasing preserved after anonymisation.

**Non-Goals:**

- WYSIWYG editing of Markdown in the renderer.
- Showing **pre-anonymization** verbatim source inside exports (privacy conflict); guidance must reinforce that appendix content is anonymized text produced by pipeline.

## Decisions

1. **Rendered preview rendering path** — Use **`markdown-it` in renderer** importing the same factory/options as `@shared` helper; wrap output in `.ace-md-export` container with stylesheet mirroring `createMarkdownPdfBuffer.ts` typography (prefer extracting shared `.css` or template constants to avoid divergence).
2. **Raw vs Markdown modes** — Offer **tabs** (“Rendered” vs “Markdown source”) or toggle to pacify auditors who compare strings; **Rendered becomes default**.
3. **Appendix flag** — Extend `ProcessTextRequest.options` with `includeAnonymizedIntakeAppendix?: boolean` (default `false`). `createProcessTextResponse` appends appendix **after** `composeAceMarkdownExport` result (and PROMPT/meta footer handling moves after appendix or appendix precedes PROMPT/meta—prefer **before** PROMPT/meta so meta remains last diagnostics line unless spec demands otherwise).

   **Chosen order:** `[ACE Markdown][optional appendix][PROMPT meta line]`.

4. **Styling duplication mitigation** — Create `src/shared/markdown/exportDocument.css` (or `.ts` exporting CSS string literal) referenced from both Workspace (import?) and PDF HTML shell; Vite bundles CSS into renderer normally; Electron main reads file via `readFileSync` at runtime **or** duplicative string exported from `.ts` to avoid filesystem coupling—**prefer exporting string from `.ts`** for identical bundling semantics.

## Risks / Trade-offs

- **`dangerouslySetInnerHTML`** — Acceptable risk with `markdown-it`/`html:false` on locally typed content; still avoid third-party Markdown.
- **Bundle size** — `markdown-it` duplicates if both main/renderer ship; mitigation: shared helpers only, tree shaking minimal.
- **Operator confusion if appendix off** — Mitigated via persistent guidance banner clarifying toggle role.

## Migration Plan

- Feature-flag not required—appendix toggled default false retains current outputs.
- Historical SQLite revisions unaffected until reprocessed.

## Open Questions

- Final heading copy for appendix (`Anonymised intake transcript` vs `Anonymised source notes`).
- Localization—English-only acceptable for MVP.
