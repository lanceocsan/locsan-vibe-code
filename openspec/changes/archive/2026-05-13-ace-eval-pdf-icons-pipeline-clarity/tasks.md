## 1. Markdown composition

- [ ] 1.1 Remove `<span data-icon="…"></span>` lines from `composeAceMarkdownExport` in `src/shared/processText/composeMarkdown.ts`, keeping headings, sharpening bullets, and summary italics intact.
- [ ] 1.2 Add or adjust a unit test (or snapshot test) asserting composed Markdown never contains `data-icon`.
- [ ] 1.3 Run `npx electron-vite build` and manually export PDF to confirm no HTML sentinel lines appear.

## 2. Workflow transparency (UI)

- [ ] 2.1 Add concise helper text beside the “Markdown preview” heading in `src/renderer/pages/WorkspacePage.tsx` explaining that output is generated from anonymized/classified ACE content (not a raw transcript).
- [ ] 2.2 Verify copy meets accessibility contrast and does not duplicate confidential footer noise.

## 3. Documentation alignment (optional but recommended)

- [ ] 3.1 Add a short subsection to `docs/ace-eval-generator-spec.md` mirroring the pipeline: raw → anonymize → ACE → optional sharpen → compose Markdown.
