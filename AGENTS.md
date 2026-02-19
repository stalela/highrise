# AGENTS.md — Highrise Build Investments

## Environment setup

```bash
npm install
```

## Development server

```bash
npm run dev
# Opens http://localhost:5173
```

## Production build

```bash
npm run build
# Output in dist/
```

## Preview production build

```bash
npm run preview
# Opens http://localhost:4173
```

## Generate AI images

Requires `DASHSCOPE_API_KEY` in `.env.local`:

```bash
npx ts-node scripts/generate-highrise-images.ts
```

Generate a single image by key:

```bash
npx ts-node scripts/generate-highrise-images.ts --only hero-bg
```

All 12 image keys:
- `hero-bg` (1664×928) — hero background
- `about-image` (928×928) — about section
- `service-construction` (928×928)
- `service-property` (928×928)
- `service-renovation` (928×928)
- `service-consultancy` (928×928)
- `service-investments` (928×928)
- `service-equipment` (928×928)
- `project-1` (1024×768)
- `project-2` (1024×768)
- `project-3` (1024×768)
- `project-4` (1024×768)

## Run Ralph Loop (autonomous build agent)

Requires the `copilot` Python SDK installed.

```bash
# Planning mode — generates/updates IMPLEMENTATION_PLAN.md
python scripts/ralph_loop.py plan

# Build mode — implements unchecked tasks, 50 iterations
python scripts/ralph_loop.py

# Build mode, custom iteration count
python scripts/ralph_loop.py 10
```

## Key files

| File | Purpose |
|------|---------|
| `index.html` | Main single-page site |
| `style.css` | All styling (CSS custom properties) |
| `main.js` | Interactions: hamburger, scroll-spy, animations, count-up |
| `.github/copilot-instructions.md` | Design system reference for Copilot |
| `implementation.md` | Full redesign specification |
| `IMPLEMENTATION_PLAN.md` | Task checklist (updated by Ralph Loop) |
| `PROMPT_plan.md` | Ralph Loop planning prompt |
| `PROMPT_build.md` | Ralph Loop build prompt |
