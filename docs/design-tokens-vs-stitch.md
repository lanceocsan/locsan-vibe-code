# Design tokens vs Stitch wireframe

Source wireframe HTML:  
`Desktop/stitch_ace_eval_integrated_workspace/integrated_workspace/code.html`.

## Mapped tokens (`src/renderer/theme/tokens.css`)

| Stitch Tailwind alias | Semantic token | HEX / value |
|----------------------|----------------|--------------|
| `background`, `surface` | `--surface-page` | #f7f9fb |
| `primary` | `--color-primary` | #1d2b3e |
| `on-surface`, `background` pair | `--color-text` | #191c1e |
| `secondary` | `--color-accent` | #006c49 |
| `outline-variant` | `--color-outline` | #c5c6cd |
| `surface-container-lowest` | `--surface-panel` | #ffffff |
| `error` | `--color-danger` | #ba1a1a |

Radii Stitch `borderRadius.DEFAULT` → `--radius-card: 4px`; `-xl` bucket → `--radius-lg: 8px`.

Spacing scale mirrors Stitch semantic keys (`spacing.sm` → 16px, `margin` → 32px) as CSS variables `--space-sm`, `--space-margin`.

Fonts: `--font-body` Inter stack, `--font-mono` JetBrains Mono (loaded locally via `@fontsource` packages — no Google CDN in bundles).

Material Symbols referenced in Stitch are approximated via inline SVG placeholders in renderer components for offline parity (subset: security shield, trending_up); full icon parity can substitute a bundled subset later.

## Product branding deltas

Wireframe headline `PERFORMANCE_INTEL_v4.0` is swapped to **ACE Eval Generator** pending HR/comms naming; confidentiality footer copy retained.
