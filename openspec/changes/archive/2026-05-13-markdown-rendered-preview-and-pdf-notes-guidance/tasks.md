## 1. Shared Markdown parity

- [x] 1.1 Extract `markdown-it` configuration (factories/token rules) plus export CSS string literals into `src/shared/markdown/` for reuse across renderer preview and `createMarkdownPdfBuffer.ts`.
- [x] 1.2 Update PDF HTML shell to consume shared typography exports (replacing inlined duplicate CSS strings where practical).
- [x] 1.3 Add regression check (Vitest parsing smoke) asserting preview helper + appendix composition remain stable fixtures.

## 2. Appendix option (raw notes visibility on PDF)

- [x] 2.1 Extend `ProcessTextRequest.options` (`includeAnonymizedIntakeAppendix?: boolean`).
- [x] 2.2 Extend `IPC` payloads from renderer respecting toggle state (persist toggle default to `sessionStorage`).
- [x] 2.3 Append appendix block in `createProcessTextResponse` after `composeAceMarkdownExport`; choose stable heading wording per design/Open Questions consensus.
- [x] 2.4 Ensure Clipboard copy/SQLite persistence pick up appendix automatically.

## 3. Renderer preview UX

- [x] 3.1 Replace standalone `<pre>` default with rendered `<article>` using sanitized `markdown-it` output + shared stylesheet class hooks.
- [x] 3.2 Add Rendered/Source toggle (persist last choice in `localStorage`).
- [x] 3.3 Respect empty states + processing spinner overlay without flashing HTML during pipeline runs.

## 4. Operator guidance

- [x] 4.1 Implement disclosure/accordion labelled “How your notes become this PDF draft” aligning with specs (pipeline + tips + privacy note).
- [x] 4.2 Cross-link appendix toggle copy (“Include anonymised intake notes in Markdown/PDF appendix”) inside guidance.

## 5. Verification

- [ ] 5.1 Manual: Rendered preview vs exported PDF typography alignment snapshot.
- [ ] 5.2 Manual appendix: toggle on/off verifying PDF diff.
- [x] 5.3 Update `docs/ace-eval-generator-spec.md` appendix workflow subsection.
