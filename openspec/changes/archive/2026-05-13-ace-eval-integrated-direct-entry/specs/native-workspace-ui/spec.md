## ADDED Requirements

### Requirement: Direct text entry workspace without uploads

The system SHALL accept evaluator input only via manual typing or pasting plain text inside the Raw Feedback Entry surface. It MUST NOT expose file upload controls (including `<input type="file">`), drag-and-drop file targets, or photo/camera capture workflows.

#### Scenario: Paste-only onboarding

- **WHEN** an operator selects the Raw Feedback Entry control
- **THEN** paste and keyboard composition work while no upload widgets are rendered anywhere in MVP scope

### Requirement: Stitch-aligned layout and responsiveness

The system SHALL replicate the Stitch reference structure: sticky top header with shielded system status, centrally constrained max width (`max-w-7xl` equivalent), stacked mobile layout collapsing the preview grid to one column ≥ md breakpoint restores three ACE cards side-by-side, sticky compliance footer duplicated across light/dark token pairs.

Absolute asset paths SHOULD reference `c:/Users/locsan_medgrocer/Desktop/stitch_ace_eval_integrated_workspace/integrated_workspace/` during design QA; bundled builds MUST inline or pack equivalent typography/icons.

#### Scenario: Three-card ACE preview parity

- **WHEN** preview data exists for Aptitude/Character/Effectiveness
- **THEN** Logic & Hard Skills, Resilience & Teamwork, and Outcomes & KPIs cards populate with headings/icons matching Stitch HTML semantics

### Requirement: Sharpening intensity control

The system SHALL expose a labeled range control (“Sharpening Intensity”) defaulting near mid/high per wireframe baseline and SHALL bind slider values to sharpening aggressiveness thresholds in the processing engine configuration.

#### Scenario: Slider persists per session

- **WHEN** an operator adjusts the slider
- **THEN** subsequent processing requests include normalized intensity (percent or enum) matching stored session defaults until cleared

### Requirement: Markdown output actions

The system SHALL expose primary actions mirrored from Stitch: Copy Markdown plus Save to Local Database (wired to persistence in Phase 3).

#### Scenario: Clipboard success feedback

- **WHEN** an operator activates Copy Markdown
- **THEN** a non-blocking toast indicates success rather than invoking `window.alert`

### Requirement: Footer compliance disclosures

The system SHALL reproduce the Stitch footer elements: confidentiality strip, Leadership review mandate copy, anchored links placeholders for Data Privacy / Audit Logs / Protocol Documentation routed to eventual internal routes/pages.

#### Scenario: Audit Logs navigation hook

- **WHEN** operators click Audit Logs in footer
- **THEN** Phase 3 implementations navigate to audited history respecting auth stub rules

### Requirement: Feedback via toast notifications only

Toast notifications MUST cover lifecycle states enumerated in Stitch mock (`Anonymizing…`, Saved to Local Database, bias validation outcomes, processing spinners). Blocking browser dialogs MUST NOT gate normal processing feedback.

#### Scenario: Toast stack placement

- **WHEN** multiple notifications occur sequentially
- **THEN** stacking matches bottom-right anchored column with accessibility roles (`role="status"`, focus management documented)
