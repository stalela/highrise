# Highrise Build Investments

Premium construction company website for **Highrise Build Investments** — built with a Wakanda-Epworth granite aesthetic inspired by the ancient stone architecture of Zimbabwe and the Chiremba balancing rocks of Epworth.

🌐 **Live site**: [highrise-build-investments.vercel.app](https://highrise-build-investments.vercel.app)

---

## Stack

- **Vite 6** — zero-config static build
- **Vanilla HTML / CSS / JS** — no framework overhead
- **DashScope qwen-image-max** — AI-generated site imagery

## Design System

| Token | Value | Usage |
|---|---|---|
| `--stone-void` | `#0a0a0c` | Page background |
| `--stone-dark` | `#121217` | Card surfaces |
| `--copper` | `#a4785a` | Primary accent |
| `--copper-light` | `#d4a574` | Hover / highlight |
| `--vibranium` | `#7c5cff` | Secondary accent |

Fonts: **Space Grotesk** (headings) + **Inter** (body)

## Sections

1. Hero — full-bleed AI-generated background, CTA
2. About — mission + values with image
3. Stats — animated count-up (15+ years, 500+ projects, 50+ awards, 200+ clients)
4. Services — Construction, Property Development, Renovation, Consultancy, Investments, Equipment
5. Projects — 4 featured portfolio items
6. Why Us — 4 differentiators with SVG icons
7. Testimonials — 3 client quotes
8. Contact — form + embedded map
9. Footer + WhatsApp float

## Local Dev

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # preview production build
```

## Image Generation

Images are AI-generated via DashScope. Requires a `DASHSCOPE_API_KEY` in `.env.local`:

```bash
echo "DASHSCOPE_API_KEY=sk-..." > .env.local
npx ts-node --esm scripts/generate-highrise-images.ts

# Regenerate a single image
npx ts-node --esm scripts/generate-highrise-images.ts --only hero-bg --force
```

## Deployment

Deployed on **Vercel** — auto-deploys on push to `main`. Config in `vercel.json`.
