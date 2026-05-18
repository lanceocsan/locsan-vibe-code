## 1. Foundations & wireframe ingestion

- [x] 1.1 Import Stitch `integrated_workspace/code.html` tokens (colors/spacing/fonts) into the app design tokens module and document deltas vs production branding.
- [x] 1.2 Scaffold Electron+React workspace (preferred) including routing skeleton for Audit Logs footer target.
- [x] 1.3 Wire global layout per `specs/native-workspace-ui/spec.md`: header, footer, confidentiality ribbon, simulated toast portal container.

## 2. Phase 1 — Processing core

- [x] 2.1 Implement `/process-text` handler shim (IPC or Fastify) using payload schema from `docs/ace-eval-generator-spec.md`.
- [x] 2.2 Deliver Regex/name dictionary preprocessing plus replacement ledger structures.
- [x] 2.3 Integrate LLM adjudication pathway with `strictLocal` guard rails.
- [x] 2.4 Implement pronoun normalization regression fixtures.
- [x] 2.5 Build ACE classifier + Markdown composer honoring empty bucket placeholder text verbatim.

## 3. Phase 1 UI — Interaction loop

- [x] 3.1 Construct Raw Feedback textarea, Sharpening Intensity slider (session persistence), ACE cards with label mapping Aptitude⇄Logic wording.
- [x] 3.2 Add debounced split-pane/live preview bridging client state to mocked engine outputs before backend hookup completes.
- [x] 3.3 Replace Stitch CDN reliance with bundled CSS/fonts/icons for offline readiness.

## 4. Phase 2 — Sharpening & feedback polish

- [x] 4.1 Implement sharpening prompt pipeline + grounding ID enforcement retries.
- [x] 4.2 Deliver toast queue component covering Processing, anonymization completion, sharpening warnings, Saved events (no native alerts).
- [x] 4.3 Wire Copy Markdown + clipboard success/failure toasts including accessibility assertions.

## 5. Phase 3 — Persistence, audit, compliance hardening

- [x] 5.1 Implement SQLite migrations for evaluations/revisions/audit_events with repository tests.
- [x] 5.2 Ship `/save-eval` + `/get-history` routes mirroring canonical OpenSpec payloads.
- [x] 5.3 Record integrity hashes + prompt versions on every save revision.
- [x] 5.4 Implement hallucination scorer + finalize gating UX per `specs/local-storage-and-audit/spec.md`.
- [x] 5.5 Add CI smoke proving blocked CDN/external calls in hardened `strictLocal` profile.
