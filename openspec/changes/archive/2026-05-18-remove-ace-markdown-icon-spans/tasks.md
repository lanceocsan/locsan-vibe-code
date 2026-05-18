## 1. Composer implementation

- [x] 1.1 Remove `<span data-icon="…"></span>` lines from `composeAceMarkdownExport` pillar assembly and drop unused `iconCue` metadata from the pillar header map

## 2. Verification

- [x] 2.1 Extend or adjust Markdown exporter tests to assert exported strings contain no `data-icon` substring while preserving pillar `##` headings
