# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

This is a TypeScript conversion of the Shaka Player library (`/lib`). The original
uses Google Closure Compiler with `goog.provide`/`goog.require` modules. We are
converting it to strict TypeScript with ES modules in `ts/lib/`.

**Read before working:** `ts/migration/RULES.md`, `ts/migration/PLAN.md`

**Superpowers plans location:** `ts/migration/superpowers/`

Key principles:
- **Translate, don't transform** — 1:1 behavioral mapping, no refactoring, no bug fixes
- **Strict types** — `strict: true`, no `any`, no `@ts-ignore`, no `as` (unless browser API)
- **Bottom-up order** — follow PLAN.md strictly, no skipping ahead
- **`tsc --noEmit` after every step** — nothing merges unless it compiles
- **Small commits** — one logical unit per commit

## Working Guidelines

### Workflow

- Use superpowers (brainstorm → plan → execute) for any non-trivial task
- Non-trivial = 3+ steps or architectural decisions
- If something goes sideways, STOP and re-plan immediately
- Commit between each task during plan execution
- Commit the plan file itself after all tasks are complete
- Before starting any migration step, check `ts/migration/FORWARD_DECLARATIONS.md`
  for forward declarations that should be resolved in that step

### Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis
- For complex problems, throw more compute at it via subagents

### Commands

All commands run from the `ts/` directory:

- `npm run check` — type-check without emitting (`tsc --noEmit`)
- `npm run build` — compile TypeScript (`tsc`)
- `npm run format` — format and lint with Biome (`biome check --write --unsafe .`)

### Code Quality

- Demand elegance: for non-trivial changes, pause and ask "is there a more
  elegant way?"
- Skip for simple, obvious changes — do not over-engineer
- Simplicity first: make every change as simple as possible, impact minimal code
- Find root causes — no temporary fixes, no workarounds
- Senior developer standards at all times
