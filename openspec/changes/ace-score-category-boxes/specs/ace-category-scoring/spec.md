## ADDED Requirements

### Requirement: Per-category scores on process output

Each ACE category MUST include a numeric score (integer 1–5) supplied by the operator and returned in the process success response alongside `ace` buckets.

#### Scenario: Scores survive processing

- **WHEN** a valid process request completes successfully
- **THEN** the response MUST include three scores keyed by aptitude, character, and effectiveness matching the submitted values within normalisation rules defined in implementation (clamping invalid input to bounds)

### Requirement: Markdown export reflects scores instead of sharpening

Exported Markdown MUST show per-category score information and MUST NOT advertise “Sharpened Actions” or LLM sharpening bullets as part of the default workspace export.

#### Scenario: No sharpen bullets in export

- **WHEN** Markdown is composed after a successful run
- **THEN** the composer MUST omit sharpened next-step bullets and MUST include explicit score lines (or headings) per ACE category derived from response scores

### Requirement: Sharpening pipeline removed

The application MUST NOT call sharpening engines, honour `runSharpening`, or surface sharpening intensity controls in the primary workspace UI for this workflow.

#### Scenario: Sharpen option ignored or absent

- **WHEN** a client omits sharpening options or legacy fields remain in types
- **THEN** processing MUST NOT generate `SharpNextStep` rows and hallucination scoring tied solely to sharpening divergence MUST evaluate as zero-risk from sharpening

### Requirement: Sharpen options removed from contract

Sharpen-specific request options (`runSharpening`, sharpening intensity, sharpen model identifiers) MUST be removed from supported IPC types or MUST be rejected/ignored without invoking sharpening logic; `sharp.nextSteps` MUST be an empty array for successful runs unless a documented compatibility stub states otherwise.

#### Scenario: Response shape stability

- **WHEN** integrators consume `sharp.nextSteps`
- **THEN** the array MUST be empty for new runs and callers MUST migrate to scores and manual evidence as the actionable output
