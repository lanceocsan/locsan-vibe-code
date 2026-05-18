## ADDED Requirements

### Requirement: Markdown pillar bodies omit decorative icon spans

Generated ACE evaluation Markdown MUST NOT include HTML elements carrying `data-icon` attributes ahead of pillar sections.

#### Scenario: Composer omits psychology span for aptitude section

- **WHEN** `composeAceMarkdownExport` renders output containing the aptitude pillar
- **THEN** the Markdown MUST NOT contain the substring `data-icon`
- **AND** the aptitude pillar MUST still begin with the markdown heading `## Logic & Hard Skills`

### Requirement: Character and effectiveness pillars stay span-free

The composer MUST apply the same “no decorative icon markup” rule consistently across character and effectiveness pillars.

#### Scenario: No emoji_events or trending_up spans appear

- **WHEN** Markdown export completes for any valid ACE payload
- **THEN** the payload MUST NOT contain `<span data-icon="emoji_events"` or `<span data-icon="trending_up"`
