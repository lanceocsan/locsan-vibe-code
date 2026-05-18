## ADDED Requirements

### Requirement: Operators SHALL preview rendered Markdown before PDF export

The primary workspace MUST provide a readable HTML preview that reflects the synthesized evaluation Markdown (`ProcessTextSuccessResponse.markdown`) before the operator invokes PDF export.

#### Scenario: Rendered preview available after pipeline success

- **WHEN** processing completes successfully and Markdown body is present
- **THEN** the UI MUST surface a rendered view using portable Markdown semantics and MUST NOT rely solely on monospace raw Markdown presentation as the default visual review surface

### Requirement: Preview rendering MUST stay aligned with portable Markdown parsing

Markdown rendering rules for preview (`markdown-it`, `html:false` unless superseded centrally) MUST match PDF generation configuration so headings, paragraphs, bullets, fenced blocks, emphasis, links, tables, horizontal rules behave consistently between preview generation and Electron `printToPDF` Markdown→HTML conversions.

#### Scenario: Typography parity guideline

- **WHEN** the operator switches between Markdown preview pane and exported PDF inspecting same evaluation revision
- **THEN** hierarchical structure (`#`, `##`, `###` lists etc.) SHOULD map identically modulo pagination and font substitutions inherent to Chromium print margins

### Requirement: Operators MAY inspect raw Markdown source optionally

There MUST remain an affordance (tabs, toggle, or secondary collapsible pane) exposing the verbatim Markdown source string alongside the rendered preview without blocking primary workflow progression.

#### Scenario: Source peek for audits

- **WHEN** the operator activates the Markdown source peek mode
- **THEN** they MUST view the canonical Markdown payload prior to sanitisation overlays unrelated to Markdown composition
