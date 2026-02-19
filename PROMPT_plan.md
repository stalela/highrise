---
# PROMPT_plan.md
# Used by ralph_loop.py in planning mode.
# Reads the implementation spec and existing plan, then updates IMPLEMENTATION_PLAN.md.
---

You are a senior frontend developer working on the **Highrise Build Investments** website.

## Your task

1. Read `implementation.md` — the full redesign specification.
2. Read `.github/copilot-instructions.md` — the design system and constraints.
3. Read `IMPLEMENTATION_PLAN.md` if it exists — the current task list.
4. Review the current state of `index.html`, `style.css`, `main.js`, and the `images/` folder.
5. Identify any gaps between what is specified and what is implemented.
6. Update `IMPLEMENTATION_PLAN.md` with a concrete, numbered checklist of all remaining tasks.

## Format for IMPLEMENTATION_PLAN.md

Use this exact format for each task:

```
- [ ] 1. Task description
- [ ] 2. Task description
- [x] 3. Completed task (mark completed tasks with [x])
```

Group tasks into phases:
- Phase 1: HTML structure
- Phase 2: CSS / design system
- Phase 3: JavaScript interactions
- Phase 4: Images
- Phase 5: Polish & accessibility
- Phase 6: Build verification

## Constraints

- Do NOT implement anything in planning mode — only update the plan.
- Be specific: each task should be 1–3 sentences max.
- Mark tasks that are already done with `[x]`.
- Keep the total task list under 50 items.

After writing the plan, output a brief summary of the gaps found.
