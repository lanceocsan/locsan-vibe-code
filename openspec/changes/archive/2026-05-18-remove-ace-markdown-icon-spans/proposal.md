## Why

Exported ACE Markdown currently begins each pillar section with bare HTML such as `<span data-icon="psychology"></span>`. Those tokens were legacy layout cues for an icon-rich viewer but never render meaningfully in the Electron Markdown preview or PDF pipeline, so reviewers see unexplained markup instead of clean prose.

## What Changes

- Drop the first-line `<span data-icon="…"></span>` emission from `composeAceMarkdownExport` for every ACE pillar section (`psychology`, `emoji_events`, `trending_up`).
- Optionally simplify pillar metadata so only human-readable headings remain (no unused `iconCue` constants).
- Update Markdown composition tests so fixtures assert absence of `data-icon` spans.

_No **BREAKING** API or persistence contract changes—the Markdown string shape tightens cosmetically only._

## Capabilities

### New Capabilities

- `ace-markdown-body-format`: Requirements for plain Markdown pillar bodies free of decorative HTML icon placeholders.

### Modified Capabilities

- _(none — baseline `openspec/specs/` is empty)_

## Impact

- **Code**: `src/shared/processText/composeMarkdown.ts`, `src/shared/processText/manualAceComposer.test.ts` (or adjacent tests) if they snapshot exporter output.
- **Product copy**: Section titles such as “Logic & Hard Skills” stay as `##` headings; only the stray span line is removed.
