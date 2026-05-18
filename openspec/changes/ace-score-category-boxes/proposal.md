## Why

Operators need to capture ACE feedback using their own wording without relying on fixed keyword lists, and they want a simple per-category score derived from what they type instead of an extra “sharpening” step that generates grounded next-step bullets. The current regex-based `aceClassifier` and optional sharpening pipeline add friction and do not match this workflow.

## What Changes

- Remove the sharpening action from the workspace and process pipeline (no `runSharpening`, intensity control, sharpened bullets, or sharpen-related acknowledgement gates).
- Replace automatic sentence-to-bucket routing with **three manual text inputs per ACE category** (Aptitude, Character, Effectiveness), mapped deterministically into `AceBucket` fields (summary + evidence) without term-list matching on the anonymised narrative.
- Add a **per-category numeric score** (or parsed score from manual input) computed or supplied alongside those fields and surfaced in exported Markdown and API responses.
- **BREAKING**: `ProcessTextRequest.options.runSharpening`, `sharpeningIntensityPercent`, and sharpen-related response fields become unused or are removed; clients that depended on `sharp.nextSteps` or sharpen UI must migrate to scores and manual bucket text.

## Capabilities

### New Capabilities

- `manual-ace-buckets`: Structured manual entry (three fields per ACE dimension) feeding the pipeline instead of `mapAceFromAnonymisedText` over split anonymised sentences.
- `ace-category-scoring`: Per-category score from operator input (numeric entry and/or deterministic parsing), Markdown and types updated; sharpening removed end-to-end.

### Modified Capabilities

- _(none — `openspec/specs/` has no baseline specs yet)_

## Impact

- **UI**: `WorkspacePage.tsx` and related session hooks — replace sharpen controls with nine manual fields (three × three categories) and score inputs; adjust copy and layout.
- **IPC / types**: `apiTypes.ts`, `registerHandlers.ts`, save/load eval payloads — extend request/response for manual buckets + scores; drop or stub sharpen fields.
- **Pipeline**: `processPipeline.ts`, `composeMarkdown.ts` — build ACE from manual input; remove `sharpenEngine` usage; change Markdown sections from “Sharpened Actions” to score-focused output.
- **Classifier**: `aceClassifier.ts` — retired or reduced to a thin helper only if a legacy path remains; no keyword regex lists for default bucketing.
- **Tests**: Any integration tests asserting sharpen flags or sharpened Markdown must be updated.
