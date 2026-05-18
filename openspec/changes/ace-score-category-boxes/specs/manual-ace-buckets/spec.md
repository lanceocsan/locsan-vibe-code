## ADDED Requirements

### Requirement: Manual triple-field capture per ACE category

The workspace SHALL expose three distinct free-text inputs for each ACE category (aptitude, character, effectiveness). Operators MUST NOT be required to use predefined keywords or phrases for the classifier to route content into buckets.

#### Scenario: Nine fields bind to ACE structure

- **WHEN** the operator submits a process request from the workspace
- **THEN** the main process MUST construct each `AceBucket` from only that category’s three manual strings (trimmed), with field one as `summary` and non-empty fields two and three appended in order as `evidence` entries

### Requirement: Regex term classifier inactive for workspace path

The application MUST NOT rely on fixed regex term lists such as those previously defined in `aceClassifier.ts` to populate ACE buckets for the interactive workspace workflow.

#### Scenario: No keyword gating on anonymised prose

- **WHEN** anonymised intake text contains no ACE keywords but manual fields contain content
- **THEN** resulting `ace` buckets MUST reflect manual fields only and MUST NOT synthesize buckets from anonymised sentence keyword matches

### Requirement: IPC carries manual bucket payload

`ProcessTextRequest` (or equivalent IPC contract) MUST include a structured manual ACE payload sufficient to build all three buckets without inferring them from sentence splitting of `rawText`.

#### Scenario: Pipeline receives structured manual ACE

- **WHEN** `processTextRequest` is invoked with the manual ACE block populated
- **THEN** `createProcessTextResponse` MUST prefer that block to classify ACE content instead of `mapAceFromAnonymisedText` on anonymised fragments
