# Highrise Build Investments — Premium Redesign Implementation Plan

## Overview

Rebuild the site with Vite (dev server + build), a completely new **"Wakanda-Epworth Granite"** design system, and 4 new sections. All imagery replaced with an AI-generation script using the DashScope API (same pattern as the Stalela website scripts).

**Design identity:** Epworth, Harare is home to the iconic Chiremba balancing rocks — ancient granite formations that appear on the Zimbabwean dollar. Great Zimbabwe stone architecture provides the vocabulary of layered, stacked stone. The site should feel like a Wakanda-era construction company: deeply African heritage expressed through a futuristic, ultra-premium lens. Dark granite surfaces, warm copper-bronze accents, dramatic lighting.

---

## Phase 1 — Project Structure (Vite)

Convert the project from a bare HTML file to a Vite project.

### Files to create / modify

```
highrise-build-investments/
├── package.json                          ← NEW — Vite devDependency, dev/build/preview scripts
├── vite.config.js                        ← NEW — minimal config (no framework)
├── index.html                            ← REPLACE — rebuilt markup
├── style.css                             ← REPLACE — full design system rewrite
├── main.js                               ← NEW — extracted + enhanced JS (scroll animations, count-up)
├── images/                               ← NEW — AI-generated images land here
│   └── .gitkeep
└── scripts/
    └── generate-highrise-images.ts       ← NEW — DashScope image generation script
```

### `package.json`

```json
{
  "name": "highrise-build-investments",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  },
  "dependencies": {
    "dotenv": "^16.0.0",
    "tsx": "^4.0.0"
  }
}
```

### Commands

```bash
cd robert/highrise-build-investments
npm install
npm run dev          # → http://localhost:5173
npm run build        # → dist/
```

---

## Phase 2 — Design System

### Color Tokens (CSS custom properties on `:root`)

| Token | Value | Meaning |
|---|---|---|
| `--stone-void` | `#0A0806` | Deepest background — night sky over Epworth granite |
| `--stone-dark` | `#131009` | Primary surface — dark granite slab |
| `--stone-mid` | `#201910` | Card surface — warm stone grain |
| `--stone-warm` | `#3A3020` | Elevated / hover surface |
| `--copper` | `#C8732A` | Primary accent — Epworth reddish granite / copper |
| `--copper-light` | `#E8A855` | Hover glow, highlights |
| `--copper-dim` | `rgba(200,115,42,0.15)` | Subtle tints, borders |
| `--vibranium` | `#5B3FBF` | Futuristic accent — used sparingly (energy lines, badges) |
| `--text-primary` | `#F2EDE4` | Warm off-white body text |
| `--text-muted` | `#9C8E7A` | Secondary / caption text |
| `--border` | `rgba(200,115,42,0.18)` | Default border colour |

### Typography

Replace Inter-only with a dual font stack:

- **`Space Grotesk`** — headings, section titles, stats, nav brand (geometric, futuristic)
- **`Inter`** — body copy, card text, form fields

Both loaded from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Visual Motifs

- **Stacked-stone section transitions** — `clip-path: polygon(...)` on certain section tops/bottoms to evoke the angular layering of balancing rocks strata
- **Granite noise overlay** — pseudo-element with `opacity: 0.04` SVG noise filter replicating stone texture
- **Copper glow** — `box-shadow: 0 0 24px rgba(200,115,42,0.35)` on primary CTAs and cards on hover
- **Strata bands** — thin horizontal copper lines (1–2 px) used as section decorators and card top-borders
- **Count-up numbers** in stats section — Intersection Observer triggers animation on first scroll into view

---

## Phase 3 — Page Sections

### 3.1 Navbar

- Background: `var(--stone-void)` with `backdrop-filter: blur(16px)` and `border-bottom: 1px solid var(--border)`
- Font: `Space Grotesk`
- Active/hover: copper underline accent (unchanged mechanic, restyled)
- **Add "Get a Quote" button** — filled copper, right side of nav, links to `#contact`
- Mobile: hamburger to X animation; mobile menu uses `var(--stone-dark)` background

### 3.2 Hero

- Min-height: `100vh`
- Background: `images/hero-bg.png` at full coverage + dark gradient overlay `linear-gradient(to bottom, rgba(10,8,6,0.55), rgba(10,8,6,0.88))`
- Tagline: **"Forged from Stone. Built for Generations."**
- Sub-tagline: *"Premium construction and property investment from the heart of Epworth, Harare."*
- Two CTA buttons:
  - **"View Our Work"** — ghost/outline style → `#projects`
  - **"Get a Quote"** — filled copper → `#contact`
- Copper shimmer divider line below main heading (CSS `@keyframes` shimmer)
- Subtle animated scroll indicator arrow at bottom

### 3.3 About

- **Two-column layout** — text left, image right (stacks to single column on mobile)
- Left: section title + 3 short paragraphs mentioning Epworth roots, expertise, vision
- Right: `images/about-image.png` — construction team against granite landscape; styled with a copper border offset frame effect
- Background: `var(--stone-dark)` with a subtle angular top clip

### 3.4 Stats Bar *(NEW)*

- Full-width band between About and Services
- Background: `var(--copper)` gradient (copper-to-deep-copper left-to-right) — high contrast
- 4 animated count-up numbers:
  - **50+** Projects Completed
  - **10** Years Experience  
  - **100+** Satisfied Clients
  - **5,000 m²** Built
- *Placeholder values — confirm real figures with Robert before going live*
- Count-up animation: Intersection Observer + `requestAnimationFrame`, 1.5 s duration

### 3.5 Services

- **6 service cards** (existing 5 + **Building Investments**, which is mentioned in About but missing from the current grid)
- Card structure: AI-generated thumbnail image at top, copper top-border, title, short description
- Dark surface: `var(--stone-mid)`, border: `var(--border)`
- Hover: image scales slightly (`transform: scale(1.04)` on the img), card lifts with copper glow
- Services:

| # | Title | Image key |
|---|---|---|
| 1 | Construction | `service-construction` |
| 2 | Property Development | `service-property` |
| 3 | Renovations | `service-renovation` |
| 4 | Consultancy | `service-consultancy` |
| 5 | Building Investments | `service-investments` |
| 6 | Equipment Supply | `service-equipment` |

### 3.6 Projects / Portfolio *(NEW)*

- Section ID: `projects`
- 2×2 grid on desktop (1 column on mobile)
- Each card: full-bleed image, copper overlay on hover revealing project name + type badge
- Overlay animation: `opacity: 0 → 1`, `transform: translateY(16px) → translateY(0)`
- "Start Your Project →" CTA button at section bottom → `#contact`

| Card | Image key | Name | Type |
|---|---|---|---|
| 1 | `project-1` | Epworth Residential Estate | Construction |
| 2 | `project-2` | Harare Central Commercial Block | Property Development |
| 3 | `project-3` | Borrowdale Interior Renovation | Renovation |
| 4 | `project-4` | Chitungwiza Site Development | Construction |

*Placeholder project names — replace with real portfolio when available.*

### 3.7 Why Choose Us

- Replace emoji icons with inline SVGs (copper-filled, no external dependency)
- Keep 4-card grid with copper top-border per card
- Background: `var(--stone-dark)` + faint repeating strata pattern via CSS

| Card | SVG Icon | Title |
|---|---|---|
| 1 | hard-hat | Expert Team |
| 2 | clock | On-Time Delivery |
| 3 | shield-check | Quality Assurance |
| 4 | handshake | Client Focus |

### 3.8 Testimonials *(NEW)*

- 3 testimonials in a horizontal row on desktop, single column on mobile
- Card: `var(--stone-mid)` surface, large copper `"` opening quote in `Space Grotesk 4xl`, text, name + location
- Background: `var(--stone-void)` with a subtle strata band separator at top
- *Placeholder quotes — Robert to supply real client testimonials*

### 3.9 Contact

- **Two-column layout**:
  - Left: phone, email, address (with inline SVG icons) + embedded Google Maps iframe (Epworth, Harare)
  - Right: contact form
- Form fields: Name, Phone, Email, Service (dropdown), Message, Submit
- Form action: `mailto:highrisebuildinvest@gmail.com`, `enctype="text/plain"` — no backend required
- Submit button: full-width copper fill, hover glow

### 3.10 Footer

- **Three-column layout**:
  - Brand logo + tagline
  - Quick links (anchor links to all sections)
  - Contact details
- Bottom bar: `© 2026 Highrise Build Investments · Epworth, Harare, Zimbabwe`
- Background: `#070502` (slightly warmer than pure black)

---

## Phase 4 — `main.js`

Extract and enhance all current inline `<script>` logic:

```
main.js
├── Hamburger menu toggle
├── Close menu on link click
├── Active nav link on scroll (Intersection Observer replacing scroll event)
├── Section fade-in-up on scroll (IntersectionObserver, CSS class toggle)
└── Stats count-up animation (IntersectionObserver + rAF)
```

Scroll animation: add `data-animate` attribute to sections/cards → `main.js` adds class `visible` when in viewport → CSS handles the transition (`opacity: 0, translateY(32px)` → `opacity: 1, translateY(0)`, duration `0.6s ease`).

---

## Phase 5 — Image Generation Script

**File:** `scripts/generate-highrise-images.ts`  
**Pattern:** Identical to `website/scripts/generate-studio-images.ts`  
**Output dir:** `../images/` (relative to the scripts folder → `images/` in project root)  
**Model:** `qwen-image-max`  
**API:** `https://dashscope-intl.aliyuncs.com`  
**Env var:** `DASHSCOPE_API_KEY` (loaded from `.env.local` in project root)

### Brand Prefix (injected into every prompt)

```
"Cinematic, hyperrealistic architectural photography. Dark and dramatic atmosphere. 
Zimbabwe landscape setting with ancient granite boulders — the Epworth Chiremba 
balancing rocks and Great Zimbabwe stone walls as the visual vocabulary. Deep 
charcoal and warm copper-bronze colour palette (#0A0806, #C8732A). Futuristic 
'Wakanda-style' construction aesthetic — advanced technology meets African stone 
heritage. Ultra-premium quality, sharp details, moody dramatic lighting."
```

### Image Definitions

| Key | Filename | Size | Prompt Focus |
|---|---|---|---|
| `hero-bg` | `hero-bg.png` | 1664×928 | Dramatic dusk sky; futuristic high-rise under construction rising behind ancient stacked Epworth granite boulders; construction cranes illuminated in warm copper light; Zimbabwean skyline |
| `about-image` | `about-image.png` | 928×928 | Diverse African construction professionals in hard hats reviewing architectural blueprints; ancient granite boulder landscape visible behind them; pride and expertise |
| `service-construction` | `service-construction.png` | 928×928 | Residential building construction in progress — concrete foundations, steel frame rising, skilled workers; Zimbabwean landscape with kopjes (granite hills) in background |
| `service-property` | `service-property.png` | 928×928 | Completed modern residential property in a Zimbabwean context; clean architecture, landscaped surrounds, warm afternoon light |
| `service-renovation` | `service-renovation.png` | 928×928 | Interior renovation in progress — fresh plastered walls, new tiled flooring being laid, power tools; warm transformation energy |
| `service-consultancy` | `service-consultancy.png` | 928×928 | Architect at a desk reviewing detailed architectural drawings; rolled blueprints, copper-toned CAD screen, precision tools; professional consultancy atmosphere |
| `service-investments` | `service-investments.png` | 928×928 | Property investment concept — miniature building model on a table with documents, a pen, and a confident handshake above rising graph lines |
| `service-equipment` | `service-equipment.png` | 928×928 | Premium construction equipment: excavator, scaffold towers, stacked building materials; organised, powerful, industrial |
| `project-1` | `project-1.png` | 1024×768 | Completed modern residential house in Epworth/Harare suburban style; warm evening light, well-maintained garden |
| `project-2` | `project-2.png` | 1024×768 | Sleek commercial office building exterior — dark glass and concrete, Harare urban context |
| `project-3` | `project-3.png` | 1024×768 | Renovated modern interior — open-plan living area, warm lighting, clean finishes, contemporary furnishings |
| `project-4` | `project-4.png` | 1024×768 | Aerial perspective of active construction site in Zimbabwean landscape; granite outcrops visible beyond the site perimeter |

### Usage

```bash
# Generate all images (skips existing)
npx tsx scripts/generate-highrise-images.ts

# Generate one specific image
npx tsx scripts/generate-highrise-images.ts --only hero-bg

# Full flow
cd robert/highrise-build-investments
cp ../../website/.env.local .env.local   # or set DASHSCOPE_API_KEY manually
npx tsx scripts/generate-highrise-images.ts
```

---

## Phase 6 — Verification Checklist

| # | Check | Command / Action |
|---|---|---|
| 1 | Dependencies install cleanly | `npm install` — no errors |
| 2 | Dev server starts, all sections visible | `npm run dev` → `localhost:5173` |
| 3 | Mobile menu works on narrow viewport | Resize browser to < 768 px |
| 4 | Stats count-up fires on scroll | Scroll to stats section |
| 5 | Portfolio hover overlay renders | Hover project cards |
| 6 | Contact form opens email client | Fill form, click Submit |
| 7 | WhatsApp button shows correct number | Check `href` on float button |
| 8 | One test image generates | `npx tsx scripts/generate-highrise-images.ts --only hero-bg` |
| 9 | All 12 images generate without error | `npx tsx scripts/generate-highrise-images.ts` |
| 10 | Production build has no errors | `npm run build` → `dist/` |
| 11 | Built site opens in browser | Open `dist/index.html` directly |

---

## Notes & Decisions

- **Vite** chosen for HMR during development + optimised static build output; result is still plain HTML/CSS/JS deployable on any host (Netlify, Vercel static, cPanel, GitHub Pages)
- **Contact form** uses `action="mailto:"` — no backend or third-party service needed; opens the user's default email client
- **Stats values are placeholders** — 50+ projects, 10 years, 100+ clients, 5,000 m² — Robert must confirm real numbers
- **Testimonials are stub cards** — placeholder text only; Robert must supply real client names and quotes
- **Portfolio project names are fictional** — replace with real project names and images when available
- **`.env.local`** is not committed; developer must set `DASHSCOPE_API_KEY` locally to run image generation
- Images live in `images/` and are referenced directly in `index.html` with relative paths — Vite serves them from `public/` equivalent (move to `public/images/` if Vite asset pipeline is desired)
