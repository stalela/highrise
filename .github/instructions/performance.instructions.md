---
description: 'Frontend performance rules for the Highrise Build Investments static Vite site'
applyTo: '**/*.html, **/*.css, **/*.js'
---

# Performance Rules — Highrise Build Investments

## Images

- Use `loading="lazy"` on all `<img>` tags below the fold (everything except the hero logo).
- Hero background is CSS `background-image` — not an `<img>` tag.
- Never load images from external CDNs. All images live in `images/`.

## JavaScript

- No external JS libraries — no jQuery, no lodash, no Alpine.
- Use **Intersection Observer** instead of scroll event listeners for all scroll-triggered effects.
- Count-up animation uses `requestAnimationFrame` — cancel via the returned ID when the element leaves the viewport.
- Debounce resize handlers with 100ms threshold if any are needed.
- All JS lives in `main.js` — no inline `<script>` tags.

## CSS

- Use CSS custom properties (`var(--token)`) for all design values — no scattered hex values.
- Use CSS `transition` and `@keyframes` for animations — not JS style manipulation.
- `will-change: transform` only on actively animating elements — do not apply it globally.
- All styles in `style.css` — no inline `style` attributes, no `<style>` blocks in HTML.

## Fonts

- Google Fonts loaded via `<link rel="preconnect">` + `<link>` in `<head>` with `&display=swap`.
- Only load the weights used: Space Grotesk 400, 500, 600, 700; Inter 400, 500, 600, 700.

## Build

- `npm run build` produces `dist/` via Vite — do not manually edit `dist/`.
- Vite handles minification and asset hashing automatically.
- Do not add PostCSS or extra Vite plugins unless strictly required.

## Scroll Animations

- Add `data-animate` attribute to sections and cards.
- `main.js` observes these elements and adds class `visible` when they enter the viewport.
- CSS handles the transition: `opacity: 0, translateY(32px)` → `opacity: 1, translateY(0)`, `0.6s ease`.
- Respect `prefers-reduced-motion`: wrap all animation CSS in `@media (prefers-reduced-motion: no-preference)`.
