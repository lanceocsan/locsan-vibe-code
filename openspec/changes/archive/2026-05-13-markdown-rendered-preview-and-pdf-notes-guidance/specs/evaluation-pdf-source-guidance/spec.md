## ADDED Requirements

### Requirement: The workspace MUST explain how raw intake maps to synthesized Markdown/PDF

The UI MUST expose concise guideline copy documenting that raw notes flow through anonymization, ACE structuring, optional sharpening, and Markdown synthesis—explicitly distinguishing raw intake textarea content from ACE bucket summaries/evidence surfaced in Markdown.

#### Scenario: Guidance visible without leaving the workspace

- **WHEN** the operator loads the direct-entry workspace
- **THEN** guidance copy MUST be reachable (non-modal helper region, accordion, tooltip cluster, etc.) explaining the pipeline semantics and reinforcing privacy constraints (exported appendix uses anonymised text only).

### Requirement: Guidance MUST include actionable writing tips influencing PDF fidelity

Guidelines MUST enumerate at minimum: (a) structuring observations clearly, (b) separating distinct accomplishments, (c) signalling measurable outcomes/KPI wording, (d) clarifying sharpening toggle effects. Content MUST steer operators toward richer ACE classifications instead of implying the UI copies raw notes verbatim by default.

#### Scenario: Actionable bullets present

- **WHEN** the operator expands or focuses the guideline region
- **THEN** enumerated practical tips MUST be visible without fetching external portals (offline tolerant)

### Requirement: Operators SHALL optionally append anonymised intake text to Markdown exports

Processing requests MUST accept boolean `includeAnonymizedIntakeAppendix` (`ProcessTextRequest.options`). When enabled, Markdown returned to renderer/IPC persistence/PDF pipelines MUST append a dedicated heading section containing anonymized intake text AFTER ACE composition and BEFORE PROMPT/version diagnostic tail lines documented in backlog code.

#### Scenario: Appendix omission default

- **WHEN** the operator leaves the appendix toggle disabled or unspecified
- **THEN** synthesized Markdown MUST match legacy behaviour omitting verbatim anonymized narrative appendix

#### Scenario: Appendix renders in preview and survives export

- **WHEN** the operator enables appendix mode and executes processing
- **THEN** Markdown preview MUST include the appendix section rendered like other headings
- **AND** PDF exports MUST reproduce that appendix faithfully
