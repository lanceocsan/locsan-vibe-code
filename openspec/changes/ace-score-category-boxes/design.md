## Context

The desktop ACE workspace runs `createProcessTextResponse`: anonymise intake → `mapAceFromAnonymisedText` (regex term lists + long-sentence fallback) → optional `sharpenWithGroundingRetries` → `composeAceMarkdownExport` (bullets favour sharpened rows over evidence). Operators want explicit control: three free-text areas per ACE pillar and scores tied to what they enter, without sharpening or brittle term matching.

## Goals / Non-Goals

**Goals:**

- Nine manual text fields total (three per aptitude / character / effectiveness), always mapped into `AceStructure` deterministically (no classifier regex lists on the anonymised corpus for default bucketing).
- Per-category score available in-process and in Markdown export; sharpening removed completely from UI, IPC option surface, pipeline, and composer.
- Maintain anonymisation + validation that still applies to the overall intake narrative.

**Non-Goals:**

- Replacing anonymisation or LLM name adjudication.
- ML-based scoring rubrics or LLM-generated scores (beyond optional future hooks); v1 stays deterministic / explicit numeric entry.
- Mobile or web clients outside this Electron app.

## Decisions

1. **Field mapping (three boxes → `AceBucket`)**  
   - **Choice**: Treat box 1 as `summary`; treat boxes 2 and 3 as two optional evidence strings (trimmed non-empty strings become `evidence` array entries).  
   - **Rationale**: Matches existing `AceBucket` shape without inventing parallel storage.  
   - **Alternative considered**: Concatenate boxes 2–3 into one evidence string — rejected to preserve two distinct bullets when desired.

2. **Score representation**  
   - **Choice**: Add `score` (integer 1–5 per bucket, validated server-side with clamp) supplied from the renderer; derivation is “use the operator’s explicit score,” not text analysis in v1.  
   - **Rationale**: Fully traceable and testable; satisfies “score from raw input I manually enter.” If product later wants parsing from free text, extend with a small parser without changing the wire shape.  
   - **Alternative considered**: Derive score only from text length / heuristics — rejected as opaque and surprising.

3. **Request shape**  
   - **Choice**: Extend `ProcessTextRequest.options` with `manualAce?: { aptitude, character, effectiveness }: { summary, evidencePrimary, evidenceSecondary, score }` (field names camelCase consistent with codebase). Pipeline uses manual ACE when provided; falls back only if explicitly needed for migration (spec can require manual mode always-on for workspace).  
   - **Rationale**: Clear contract; avoids overloading `rawText` parsing.  
   - **Alternative considered**: Separate IPC — rejected to minimize bridge churn.

4. **Sharpening removal**  
   - **Choice**: Delete sharpen calls and UI; omit `SharpNextStep[]` generation; `estimateHallucinationRisk` stays but receives empty `nextSteps` (risk 0); remove sharpen-related flags except those still useful (`sharpening_skipped_*` dropped). Markdown section title changes from sharpened bullets to scored summary lines.  
   - **Rationale**: Hallucination gate today only penalizes sharpened divergence; without sharpening it is benign at 0.

5. **`aceClassifier.ts`**  
   - **Choice**: Remove regex term constants and regex bucketing path used by the workspace path; optionally keep `mapAceFromAnonymisedText` as deprecated no-op mapper or delete if unused. Workspace always sends manual buckets.  
   - **Rationale**: User explicitly does not want term lists.

## Risks / Trade-offs

- **[Risk]** Saved evaluations and Stitch integrations expect `sharpJson` shape → **[Mitigation]** Keep `sharp: { nextSteps: [] }` for one release or version save format; document **BREAKING** in release notes.

- **[Risk]** Operators forget to fill all nine fields → **[Mitigation]** Allow empty strings; empty bucket uses existing `ACE_EMPTY_BUCKET_SUMMARY` policy for that bucket.

- **[Risk]** Score validation mismatch between renderer and main process → **[Mitigation]** Clamp and normalize in pipeline single source of truth.

## Migration Plan

1. Ship types + IPC with manual ACE block and optional sharpening removal (breaking).  
2. Update renderer to collect nine fields + three scores before `processTextRequest`.  
3. Migrate any stored eval readers to tolerate absent sharpen rows.  
4. Remove dead sharpen modules/tests in a follow-up if desired.

## Open Questions

- Whether any external consumer still requires sharpen Markdown sections (confirm with Stitch/eval reviewers).  
- Final labels for the three boxes (product copy vs. engineering placeholders).
