## ADDED Requirements

### Requirement: Hybrid anonymization pipeline

The engine SHALL deterministically preprocess known patterns via Regex/roster dictionaries and SHALL escalate residual spans to constrained LLM classification. Detected evaluatee-identifying proper nouns MUST be rewritten to Evaluatee tokens with traceable Replacement ledger metadata.

#### Scenario: Ledger coverage

- **WHEN** processing completes successfully
- **THEN** `/process-text` responses include replacements array entries describing method/class per OpenSpec §4 schema

### Requirement: Gender-neutral pronoun normalization

The engine MUST convert masculine/feminine third-person singular pronouns in English source text outputs to singular they/them equivalents or HR-approved wording while minimizing grammatical corruption; failures MUST raise validation warnings.

#### Scenario: Failure flag surfaced

- **WHEN** post-pass lint still finds gendered pronoun tokens (`he`, `she`, `his`, `hers`, limited exceptions)
- **THEN** bias validation arrays include `pronounNeutralizationOk:false`

### Requirement: ACE mapping fidelity

Structured output SHALL include Aptitude, Character, and Effectiveness summaries with verbatim evidence excerpts. Buckets lacking evidence MUST literal-string output `No specific observations provided.` and empty evidence arrays per policy.

#### Scenario: Empty aptitude evidence

- **WHEN** classifier finds no aptitude-aligned clauses
- **THEN** aptitude summary equals mandated placeholder verbatim

### Requirement: Sharpened next steps grounding

Sharpening mode SHALL emit at minimum three actionable next steps when non-empty textual evidence exists, each referencing grounded evidence identifiers; vague praise SHALL be rewritten only when tied to excerpts.

#### Scenario: Grounding omission retry

- **WHEN** a sharpened bullet lacks grounding IDs
- **THEN** orchestrator retries stricter prompting once then surfaces operator-facing warning toast

### Requirement: Internal REST/IPC symmetry

Expose `POST /api/v1/process-text` equivalents (Electron IPC permissible) adhering to payloads documented in `docs/ace-eval-generator-spec.md` including options for `runSharpening`, `strictLocal`, and locale cues.

#### Scenario: Strict-local rejection

- **WHEN** `strictLocal` is true and remote LLM transport unavailable
- **THEN** request resolves with documented 422 class error without emitting external payloads

### Requirement: Prompt lifecycle governance

System prompts defined for ACE classification and sharpening MUST be version stamped and persisted alongside audits when outputs save.

#### Scenario: Prompt pinning

- **WHEN** evaluation revision commits
- **THEN** revision metadata captures active prompt semver/hash pair
