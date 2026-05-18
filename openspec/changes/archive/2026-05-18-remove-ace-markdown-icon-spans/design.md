## Context

`composeAceMarkdownExport` prefixes each pillar block with `<span data-icon="${iconCue}"></span>`. The desktop app does not hydrate those attributes into icons in the Markdown preview or portable HTML/PDF flows, so the spans are inert noise carried from an earlier Stitch-oriented wireframe.

## Goals / Non-Goals

**Goals:**

- Remove decorative `data-icon` HTML from generated ACE Markdown while keeping `##` pillar titles and score/evidence structure intact.

**Non-Goals:**

- Replacing icons with emoji, SVG, or another visual system (out of scope unless product requests it later).
- Changing canonical pillar titles (“Logic & Hard Skills”, etc.).

## Decisions

1. **Removal vs. conditional feature flag** — **Choice:** delete the span line entirely for all exports. **Rationale:** zero known consumer depends on it; feature flags add dead code. **Alternative considered:** strip only in PDF path — rejected because preview and copy/paste Markdown would still leak HTML.

2. **Data model** — **Choice:** collapse `headers` entries to `{ eyebrow: string }` and delete `iconCue` to avoid resurrecting unused fields. **Rationale:** keeps one source of truth for section labels.

## Risks / Trade-offs

- **[Risk]** External tooling scraped `data-icon` for analytics — **[Mitigation]** none observed in-repo; changelog note only.

## Migration Plan

1. Ship composer change + tests.
2. Existing saved SQLite revisions retain historic Markdown verbatim—no automatic rewrite required.

## Open Questions

- None pending unless design wants emoji prefixes later.
