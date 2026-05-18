## ADDED Requirements

### Requirement: Composed evaluation Markdown MUST be portable

The system SHALL NOT embed HTML-only sentinel markup (including `<span …>` icon hooks) in the canonical evaluation Markdown string produced for preview, persistence, clipboard copy, or PDF export. Those surfaces SHALL render or print without exposing raw tag text to the reader.

#### Scenario: ACE bucket section has no HTML icon placeholders

- **WHEN** the processing pipeline emits Markdown for a successful run
- **THEN** the Markdown MUST NOT contain substring `data-icon=`

#### Scenario: PDF export excludes legacy HTML sentinels

- **WHEN** the operator exports Markdown to PDF
- **THEN** the PDF MUST NOT visibly display markup strings meant for Stitch icon slots (for example sequences beginning with `<span data-icon`)

### Requirement: Optional decorative cues MUST remain Markdown-safe

When the product includes non-semantic cues (for example headings or bullets), they SHALL consist of plain Unicode or Markdown syntax only—not HTML fragments requiring a stylesheet or component runtime.

#### Scenario: No reliance on Stitch runtime for readability

- **WHEN** a reviewer opens Markdown in a plain text editor or prints to PDF
- **THEN** all structure MUST remain understandable without Stitch or custom web components
