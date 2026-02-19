---
description: 'Color and styling rules for the Highrise Build Investments dark granite design system'
applyTo: '**/*.html, **/*.css, **/*.js'
---

# HTML/CSS Style Guide — Highrise Build Investments

This project uses a **dark warm granite** palette. Apply the 60-30-10 rule within the dark token system:

- **60%** — Stone surfaces (`--stone-void`, `--stone-dark`, `--stone-mid`)
- **30%** — Warm text and borders (`--text-primary`, `--text-muted`, `--border`)
- **10%** — Copper accent (`--copper`, `--copper-light`)

## Rules

### Backgrounds
- Always use stone tokens: `var(--stone-void)`, `var(--stone-dark)`, `var(--stone-mid)`, `var(--stone-warm)`.
- Never use white or off-white backgrounds on any section.
- The stats bar uses `var(--copper)` as background — the only section with a full copper background.

### Text
- Body text: `var(--text-primary)` on dark surfaces.
- Secondary text: `var(--text-muted)`.
- Never use pure white for body text.
- Never use yellow or hot colors for text.

### Accents
- Primary interactive elements: `var(--copper)`.
- Hover states: `var(--copper-light)`.
- `--vibranium` (`#5B3FBF`) — reserve for one decorative element per section only.
- Never use `--vibranium` for text or interactive states.

### Gradients
- Gradients use stone-to-stone transitions: e.g. `#0A0806` → `#201910`.
- Hero overlay: `linear-gradient(to bottom, rgba(10,8,6,0.55), rgba(10,8,6,0.88))`.
- Avoid mixing copper into gradients — use it as a solid accent only.

### Borders
- Default: `1px solid var(--border)` (`rgba(200,115,42,0.18)`).
- Highlight / focused card: `1px solid var(--copper)`.

### Box Shadows
- Card hover glow: `0 0 24px rgba(200,115,42,0.3)`.
- CTA button: `0 4px 20px rgba(200,115,42,0.4)`.
- Never use blue or purple glows.
