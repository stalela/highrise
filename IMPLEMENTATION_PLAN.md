# IMPLEMENTATION_PLAN.md — Highrise Build Investments
# Updated by: Ralph Loop (planning mode) or manually
# Format: - [x] completed  /  - [ ] pending

---

## Phase 1: HTML Structure

- [x] 1. Create skip-to-content link (`<a href="#main-content" class="sr-only">`)
- [x] 2. Rewrite `<head>` with new meta tags, Space Grotesk + Inter fonts, OG tags
- [x] 3. Rewrite navbar: brand logo, nav links, "Get a Quote" CTA, hamburger button, mobile menu
- [x] 4. Write hero section: hero-bg image, overlay, logo, h1, tagline, sub-tagline, two CTA buttons, scroll indicator
- [x] 5. Write about section: two-column grid (text + image), blockquote pull-quote
- [x] 6. Write stats bar: 4 stat items with `data-target` and `data-suffix` attributes
- [x] 7. Write services section: 6 `<article>` cards with image wrappers and body
- [x] 8. Write projects section: 4 project cards with overlay (type badge + name), CTA button
- [x] 9. Write why-us section: 4 cards with inline SVG icons (no emoji)
- [x] 10. Write testimonials section: 3 `<blockquote>` cards
- [x] 11. Write contact section: contact list (phone/email/address with SVG icons), Google Maps iframe, contact form with all fields
- [x] 12. Write footer: 3-column (brand, quick links, contact), footer-bottom copyright
- [x] 13. WhatsApp floating button with SVG icon
- [x] 14. `<script type="module" src="main.js"></script>`

## Phase 2: CSS / Design System

- [x] 15. Define all `:root` CSS custom property tokens (stone palette, copper accents, fonts, layout, transitions)
- [x] 16. Reset, base styles, `body`, `a`, `img`, `h1–h4`
- [x] 17. Accessibility utilities: `.sr-only`, `:focus-visible`, `[data-animate]` animation base
- [x] 18. `prefers-reduced-motion` media query block
- [x] 19. Button styles: `.btn-primary`, `.btn-outline`, `.btn-nav-cta`, `.btn-submit`
- [x] 20. Navbar: fixed, glassmorphism blur, brand, nav links with underline animation, hamburger, mobile menu
- [x] 21. Hero: full-viewport, hero-bg image, overlay gradient, logo pulse animation, scroll indicator bounce
- [x] 22. About: two-column grid, pull-quote border-left, image with copper border glow
- [x] 23. Stats bar: copper band background, 4-column grid, stat number count-up styling
- [x] 24. Services: 3-column card grid, image hover zoom, card border hover copper
- [x] 25. Projects: 2-column card grid, overlay gradient, project-type badge, hover animation
- [x] 26. Why Us: 4-column grid, SVG icon wrapper, card hover border-copper
- [x] 27. Testimonials: 3-column grid, quote-mark decoration, card hover
- [x] 28. Contact: 2-column grid, contact list with SVG icons, map iframe dark filter, form styling
- [x] 29. Footer: 3-column grid, footer-bottom border
- [x] 30. WhatsApp float button
- [x] 31. Responsive breakpoints: 1024px, 900px, 768px, 600px, 360px

## Phase 3: JavaScript Interactions

- [x] 32. Hamburger toggle with `aria-expanded` / `aria-hidden` management, Escape key close
- [x] 33. Mobile menu links close menu on click
- [x] 34. Scroll-spy: IntersectionObserver updating `.active` on nav links
- [x] 35. `[data-animate]` IntersectionObserver — adds `.visible` class for CSS transitions
- [x] 36. Staggered animation delays on `[data-animate]` children
- [x] 37. Count-up animation for `.stat-number[data-target]` using `requestAnimationFrame`
- [x] 38. Navbar scroll state — darken `background` on scroll

## Phase 4: Images

- [ ] 39. Run `npx ts-node scripts/generate-highrise-images.ts` to generate all 12 images
- [ ] 40. Verify `hero-bg.png` renders correctly in hero section (check opacity/contrast)
- [ ] 41. Verify all 6 service images display at correct aspect ratio (4:3)
- [ ] 42. Verify all 4 project images display correctly with overlay

## Phase 5: Polish & Accessibility

- [ ] 43. Audit colour contrast — all text must meet WCAG AA (4.5:1 for body, 3:1 for large)
- [ ] 44. Test keyboard navigation: tab order, focus rings, skip link, hamburger, form
- [ ] 45. Test at 320px viewport width (reflow, no horizontal scroll)
- [ ] 46. Add `lang="en"` on `<html>` (already done) — verify
- [ ] 47. Verify all `<img>` have descriptive `alt` text
- [ ] 48. Verify form: labels linked to inputs, `required` + `aria-required`, no placeholder-as-label

## Phase 6: Build Verification

- [ ] 49. Run `npm install` — verify no errors
- [ ] 50. Run `npm run build` — verify `dist/` output, no console errors
- [ ] 51. Run `npm run preview` — verify site renders at http://localhost:4173
- [ ] 52. Test all nav anchor links scroll to correct sections
- [ ] 53. Test WhatsApp button opens `wa.me/263775202451`
- [ ] 54. Test contact form opens mailto client with correct email
- [ ] 55. Test responsive layout at mobile (375px), tablet (768px), desktop (1280px)
