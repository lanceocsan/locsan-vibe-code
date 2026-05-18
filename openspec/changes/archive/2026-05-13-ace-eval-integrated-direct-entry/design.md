## Context

Stakeholders typed/pasted raw evaluator notes offline today; structuring into ACE consumes time and invites inconsistency/bias risks. Canonical architecture, API payloads, prompts, SQLite sketch, acceptance tables, Mermaid topology, toast rules, hallucination/neutralization checks live in **`docs/ace-eval-generator-spec.md`**. Stitch HTML (`stitch_ace_eval_integrated_workspace/integrated_workspace/code.html`) expresses **layout and visual intent**—Inter typography, muted clinical palette (`#f7f9fb` surface stack + primary `#1d2b3e`), material iconography cues, sharpening slider placeholder, simulated toast stack anchored bottom-right, sticky compliance footer links.

Stakeholders prefer **Electron for USB/air-gappable bundles** vs React+local server—the selection below notes both shapes.

## Goals / Non-Goals

**Goals:**

- Preserve **direct text entry-only** ingestion (no uploads, no drag-drop file surfaces).
- Run pipeline **latency-aware** (<500 ms preview debounce guideline for Phase 1).
- Persist revisions + audits **purely locally** within hardened installs.
- Maintain **Ace ↔ UI card labels**: Aptitude ⇒ “Logic & Hard Skills”; Character ⇒ “Resilience & Teamwork”; Effectiveness ⇒ “Outcomes & KPIs” unless Product requests alternate copy but mapping remains explicit config.

**Non-Goals:**

- Multi-tenant cloud sync UI in this initiative.
- Importing spreadsheets / PDF ingestion.
- Final legal sign-off wording for HRIS sync (handled outside engineering).

## Decisions

1. **Runtime shell — Electron-first** *(default recommendation)*  

   Main process retains SQLite WAL + auditing; Renderer hosts React splits; optionally call `ipc.invoke('process-text', payload)` shaped like REST body. Fallback: CRA/Vite SPA + bundled Fastify on `localhost:17xxx` mirrors same handler signatures.

   *Alternative considered:* pure browser SPA with OPFS/WebCrypto—Rejected for Phase 3 auditing without Node crypto parity.

2. **LLM bridging**  

   Offline models via `llamacpp`/vendored weights **or** org-approved tethered inference service. Controlled by feature flag `strictLocal` (reject remote when true).

   *Mitigation:* include prompt versioning + hashing in audits.

3. **UI fidelity vs Stitch CDN**  

   Wireframe Tailwind CDN + Google Fonts unacceptable for offline compliance builds. Snapshot classes into packaged CSS (PostCSS `@layer`) referencing same token map from HTML config block.

   *Trade-off:* initial dev may hot-reload Stitch HTML verbatim; milestone before pilot strips external CDNs.

4. **Preview layout**  

   Stitch shows ACE cards populated with “Sharpened Actions”; Phase 1 MVP may show summaries/bullets from ACE evidence before sharpening exists—feature flag toggles duplicated labels.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Residual PIIs slipping past Regex layer | Maintain replacement ledger + QA golden fixtures |
| Grammar degradation from pronoun pass | Dedicated regression suite + constrained LLM micro-pass |
| LLM sharpening hallucinates KPIs | Entailment check + grounding IDs + UX block acknowledged by operator |
| External fonts/scripts in Stitch HTML | Automated CI grep forbidding `tailwindcss.com` CDN in production bundle |
| Operators misinterpret disclaimers | Always-on footer ribbon + watermark in exported Markdown |

## Migration Plan

1. Stand up scaffolding + mocks returning static ACE JSON referencing wireframe placeholders.  
2. Integrate deterministic Regex stack; dark-launch anonymization previews.  
3. Enable optional LLM + sharpening behind toggles after audit logging lands.  
4. Flip default persistence on once SQLite migrations stable; provide archival export script for HR archival policy.

Rollback: Disable persistence feature flag → in-memory fallback; prompts revert to bundled previous version hashes recorded in changelog.

## Open Questions

- Final product codename/branding reconciling PERFORMANCE_INTEL motif vs ACE policy naming.
- Mandatory retention TTL vs indefinite local history (legal/reg preference).
- Whether History/Audit Logs open new routes or Electron windows.
- Acceptance of Tailwind-derived tokens versus internal design-system components.
