# Highrise Build Investments — Copilot Instructions

## Project Overview

Premium static website for **Highrise Build Investments**, a construction and property investment company based in **Epworth, Harare, Zimbabwe**.

Built with **Vite** (no framework — plain HTML, CSS, JavaScript).

## Design Identity: Wakanda-Epworth Granite

This site draws from Epworth's iconic identity — the **Chiremba balancing rocks** (featured on Zimbabwe's currency) and **Great Zimbabwe** stone architecture. The aesthetic is:

- **Dark granite surfaces** with warm amber light
- **Copper-bronze accents** (`#C8732A`, `#E8A855`) — the colour of Zimbabwean granite
- **Futuristic African** — Wakanda-era construction: ancient stone heritage meets advanced technology
- **Cinematic, premium** — never cheap, never corporate-generic

## Color Tokens

| Token | Value | Role |
|---|---|---|
| `--stone-void` | `#0A0806` | Deepest background |
| `--stone-dark` | `#131009` | Primary surface |
| `--stone-mid` | `#201910` | Card surface |
| `--stone-warm` | `#3A3020` | Elevated / hover |
| `--copper` | `#C8732A` | Primary accent |
| `--copper-light` | `#E8A855` | Hover / highlight |
| `--vibranium` | `#5B3FBF` | Futuristic accent (sparingly) |
| `--text-primary` | `#F2EDE4` | Body text |
| `--text-muted` | `#9C8E7A` | Secondary text |
| `--border` | `rgba(200,115,42,0.18)` | Border |

## Typography

- **Space Grotesk** — headings, section titles, nav brand, stats
- **Inter** — body copy, card text, form fields

## File Structure

```
highrise-build-investments/
├── index.html          — single-page markup
├── style.css           — all styles (design system tokens, layouts, components)
├── main.js             — all JS (nav toggle, scroll animations, count-up, active links)
├── images/             — AI-generated images (do not edit manually)
├── package.json        — Vite project
├── vite.config.js
└── scripts/
    └── generate-highrise-images.ts
```

## Architecture Rules

- **No framework** — plain HTML, CSS, JS only. No React, Vue, Svelte.
- **No Tailwind** — custom CSS variables only (design system defined in `:root`).
- **Single page** — all sections in `index.html`, navigate with anchor links.
- **Images are AI-generated** — paths are `images/<filename>.png`.
- **No backend** — contact form uses `action="mailto:"`.
- **JS is vanilla** — Intersection Observer, `requestAnimationFrame`, no libraries.

## Page Sections (in order)

1. Navbar — fixed, with "Get a Quote" copper CTA button
2. `#hero` — Full-screen hero with `images/hero-bg.png`
3. `#about` — Split layout (text + `images/about-image.png`)
4. `.stats` — Count-up stats bar (copper background band)
5. `#services` — 6 service cards with image thumbnails
6. `#projects` — 4-card portfolio grid
7. `#why` — Why Choose Us (SVG icons, no emoji)
8. `#testimonials` — 3 testimonial cards
9. `#contact` — Contact form + Google Maps embed
10. `footer` — 3-column footer

## Contact Details (never change these)

- Phone: +263 774 202 451
- Email: highrisebuildinvest@gmail.com
- WhatsApp: +263 775 202 451
- Location: Epworth, Harare, Zimbabwe
- Logo: `https://alpharobertking.github.io/image_2026-02-18_230254173.png`

## Change Constraints

- Never change the color tokens without updating all usages.
- `--vibranium` is used sparingly — maximum one visual element per section.
- All section titles use `Space Grotesk`, weight 700.
- The `.divider` under every section title: copper, 3px tall, 60px wide, `border-radius: 2px`.
- Images referenced as `images/<filename>.png` — always relative paths.
- The WhatsApp float button stays fixed bottom-right on all viewports.
