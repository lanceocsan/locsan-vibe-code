## Why

Leadership captures performance observations as unstructured prose. They need those notes translated **instantly** into a consistent ACE (Aptitude, Character, Effectiveness) structure, with **privacy-conscious anonymization**, **gender-neutral wording**, later **grounded sharpening** into actionable next steps, and **local-only** retention—all **without uploading files**.

## What Changes

- Introduce an internal **Integrated Direct-Entry Workspace**: single-page flow with sticky header/footer, raw text input, sharpening intensity control, ACE trio preview, Markdown actions, simulated status toasts modeled on Stitch wireframes.
- Deliver a **local processing pipeline** (Regex + optional LLM) for naming (`Evaluatee`), pronouns (they/them), ACE bucketing with **No specific observations provided.** placeholders, sharpening (phase 2), hallucination/neutralization checks (phase 3).
- Expose **internal APIs**: `POST /process-text`, `GET /get-history`, `POST /save-eval` behind `localhost`/Electron IPC.
- Add **SQLite (or comparable) persistence** plus **immutable-style audit linkage** raw → final revisions.
- Establish **toast-based UX feedback** (`window.alert` forbidden for primary flows).

## Capabilities

### New Capabilities

- `native-workspace-ui`: Layout, typography, Tailwind-aligned tokens, raw entry, preview cards (Logic & Hard Skills / Resilience & Teamwork / Outcomes & KPIs mirrored to Aptitude–Character–Effectiveness), sharpening slider, Copy Markdown / Save to Local Database, footer disclaimers/links, Audit Logs anchor (Phase 3 route).
- `text-processing-engine`: Hybrid anonymization, pronoun neutrality, ACE mapping, sharpening prompts, bias/hallucination validators, Markdown composition, orchestration invoked by `/process-text`.
- `local-storage-and-audit`: Schema for evaluations/revisions/events, implementations of `/save-eval` / `/get-history`, audit hashing, strict-local egress posture.

### Modified Capabilities

- _(none)_ — no baseline specs exist in-repo yet.

## Impact

| Area | Impact |
|------|--------|
| Frontend | New React/Electron workspace; reference HTML in Stitch export for fidelity (replace CDN-only preview with bundled assets later). |
| Backend / runtime | Embedded Node-style server or Electron main IPC hosting SQLite & optional LLM bridge. |
| Docs | Canonical technical detail remains in [`docs/ace-eval-generator-spec.md`](../../../docs/ace-eval-generator-spec.md); apply phase acceptance tables there plus these capability specs during implementation. |
| Compliance | Human-in-loop disclaimer in UI/footer; tooling never implies automated HR decisions; strict local mode default for sensitive pilots. |

## Wireframe Reference

Implement visual/IA parity with:

- `file:///c:/Users/locsan_medgrocer/Desktop/stitch_ace_eval_integrated_workspace/integrated_workspace/code.html`
- Companion screenshot: same folder `screen.png`.

Product naming in the Stitch export (for example PERFORMANCE_INTEL banners) MAY be rebranded so long as structure, cues (“Secure Local Connection”), disclosures, slider, card grid, footer links, toast stack positioning, and confidentiality disclaimer remain consistent.
