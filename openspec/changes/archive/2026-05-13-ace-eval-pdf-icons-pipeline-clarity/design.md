## Context

`composeAceMarkdownExport` (`src/shared/processText/composeMarkdown.ts`) prepends each ACE bucket body with `<span data-icon="…"></span>` placeholders intended for a richer UI (Stitch). **`markdown-it`** is configured with `html: false`, so these tags are emitted as **escaped text** in the HTML used for PDF rasterisation, which shows up in PDFs as meaningless markup strings.

The processing pipeline (`processPipeline.ts`) builds **anonymized** narrative text, runs **ACE classification** and optional **sharpening**, then composes Markdown that structures **Aptitude / Character / Effectiveness** summaries and evidence—not a copy of the paste box. Operators who expect their raw paste to appear verbatim in the preview will be confused.

## Goals / Non-Goals

**Goals:**

- Ensure **PDF and copied Markdown** contain only portable, reader-meaningful content (no Stitch-only HTML sentinels).
- Keep a **single canonical** Markdown string used for preview, SQLite `markdownFinal`, and PDF (avoid silent divergence unless explicitly specified later).
- Surface **short, accurate copy** in the workspace explaining what the preview is (derived evaluation draft from anonymized + classified content).

**Non-Goals:**

- Full redesign of Stitch parity (Material icons, interactive chips) inside Electron preview in this change.
- Adding a new “paste transcript” section to Markdown output (could be a future change if product wants raw or anonymized notes echoed in the draft).

## Decisions

1. **Drop `data-icon` spans from composed Markdown**  
   - **Rationale**: Spans add no value in PDF/plain Markdown and force downstream sanitisers. Prefer either **no icon line** or a **single Unicode bullet** per bucket (optional) that renders everywhere.  
   - **Alternative considered**: Strip spans only in PDF path—rejected to keep one Markdown source of truth and cleaner copy/paste.

2. **Optional visual affordance**  
   - If design needs a cue, use Markdown-only tokens (e.g., leading `###` section without extra line, or emoji like `### 🧠 Sharpened Actions` with product approval). Default in this design: **omit** extra icon line entirely to stay professional/neutral unless spec demands otherwise.

3. **Transparency copy**  
   - Add concise UI helper text near the Markdown preview heading (one sentence + link/tooltip pattern if needed later) stating: preview is generated from anonymized/classified ACE output, not a transcript of raw notes.

## Risks / Trade-offs

- **Breaking consumers** of Markdown that relied on spans for regex—unlikely externally; SQLite-stored drafts lose spans → **Mitigation**: spans were never rendered in Electron preview as icons anyway.
- **Operator expectation gap** persists if they need verbatim notes in export → **Mitigation**: spec captures workflow transparency; future “include anonymized notes block” as separate change.

## Migration Plan

- Ship updated `composeMarkdown`; existing DB rows retain old Markdown until reprocessed (optional one-off “re-save” not required).

## Open Questions

- Does leadership want an **explicit “Anonymized source”** subsection in Markdown for audits? (Out of scope unless product confirms.)
