## 1. Types & IPC contracts

- [x] 1.1 Extend shared types (`apiTypes.ts` and save-eval payloads) with manual ACE triplets and per-category `score`; remove or obsolete sharpen-only request fields per design
- [x] 1.2 Wire `registerHandlers.ts` so `processText` receives and forwards manual ACE plus scores to the pipeline

## 2. Pipeline & composition

- [x] 2.1 Update `createProcessTextResponse` to construct `AceStructure` from manual fields when supplied; stop calling regex-based classifier for that path; remove sharpen engine invocation and sharpen-related validation flags where obsolete
- [x] 2.2 Normalize and clamp scores in one place in the pipeline; attach scores to response (new field shape per design)
- [x] 2.3 Rewrite `composeAceMarkdownExport` to render scores per section and drop sharpened-bullet priority path; rename section headings appropriately

## 3. Renderer workspace

- [x] 3.1 Replace sharpening controls (`runSharpening`, intensity slider, acknowledgement gate) with three text areas and one numeric score control per ACE category—nine text areas plus three scores total
- [x] 3.2 Pass structured manual ACE and scores through `window.aceDeskApi.processTextRequest`
- [x] 3.3 Update on-page explanatory copy referencing sharpening to describe manual buckets and scores instead

## 4. Cleanup & classifier

- [x] 4.1 Remove regex term constants and obsolete mapping from `aceClassifier.ts`, or isolate unused code behind deprecation with no workspace call path
- [x] 4.2 Delete or narrow `sharpenEngine.ts`, `useSharpeningSessionPercent.ts`, and dead imports; update `hallucinationGate` callers if signatures change
- [x] 4.3 Fix or add tests covering manual ACE mapping, score passthrough, Markdown output, and absence of sharpen rows
