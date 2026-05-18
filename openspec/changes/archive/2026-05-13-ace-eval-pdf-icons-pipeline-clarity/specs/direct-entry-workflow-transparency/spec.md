## ADDED Requirements

### Requirement: Operators MUST understand what the Markdown preview represents

The workspace SHALL communicate that the Markdown preview is an **evaluation draft synthesized** from pipeline outputs—anonymised narrative, ACE bucket classification, and optional sharpening—not a verbatim transcript of the raw notes textarea.

#### Scenario: Transparency near preview surface

- **WHEN** the operator views the primary workspace containing the Markdown preview
- **THEN** the UI MUST present short explanatory copy (adjacent to the preview title or equivalent) distinguishing **raw intake** from **generated draft output**

### Requirement: Raw notes remain the pipeline input artefact

The system SHALL continue to accept evaluator notes exclusively via the paste workspace; downstream Markdown SHALL reflect **processed** results. If verbatim inclusion of anonymised notes in the Markdown draft becomes a requirement, it SHALL be tracked as a separate specification (not silently assumed).

#### Scenario: Behavioural expectation is explicit

- **WHEN** a new operator uses the workspace for the first time
- **THEN** they MUST be able to infer that editing raw notes triggers re-processing and changes ACE-derived content rather than appearing line-for-line inside the Markdown body
