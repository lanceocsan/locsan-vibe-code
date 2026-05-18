## ADDED Requirements

### Requirement: SQLite-backed evaluation revisions

Persisted histories SHALL use normalized tables (`evaluations`, `evaluation_revisions`, `audit_events`) abstracted behind repository interfaces enabling future Postgres swap-out but defaulting to SQLite with filesystem permissions limited to executing OS user.

#### Scenario: Successful save emits identifiers

- **WHEN** `POST /api/v1/save-eval` accepts well-formed payloads
- **THEN** responses return `evaluationId`, `revisionId`, ISO timestamps

### Requirement: History pagination API

Consumers MUST retrieve paginated summaries through `GET /api/v1/get-history` honoring cursor semantics with stable ordering descending by modification time.

#### Scenario: Pagination continuation

- **WHEN** `nextCursor` is non-null
- **THEN** subsequent requests omit previously returned rows without duplication

### Requirement: Audit trail integrity

Audit entries SHALL hash canonical UTF-8 raw input fingerprints and final Markdown/JSON outputs, storing prompt/ruleset identifiers and validation snapshots for bias reviews.

#### Scenario: Diff trace linkage

- **WHEN** an audit reviewer queries an evaluation identifier
- **THEN** chronological revision list surfaces raw-vs-final fingerprints plus escalation flags without exposing blocked third-party egress metadata

### Requirement: Hallucination and bias escalation controls

Hallucination risk scoring MUST quantify unsupported sharpened assertions; thresholds SHALL trigger UI acknowledgements preventing silent finalize when exceeding policy limits.

#### Scenario: Blocking finalize UX

- **WHEN** `hallucinationRiskScore` exceeds configured maximum
- **THEN** finalize/save workflows require acknowledged override or sharpening regeneration

### Requirement: Data residency guardrails

Hardened distribution builds MUST prevent outbound telemetry by default (`strictLocal` packaging) and SHOULD integrate OS-level proxies/firewall attestations validated in QA checklists referencing Phase 3 acceptance rows.

#### Scenario: Offline pilot mode

- **WHEN** device operates without WAN connectivity during smoke tests
- **THEN** all persistence and sharpening optional paths either succeed locally or fail closed without external leaks
