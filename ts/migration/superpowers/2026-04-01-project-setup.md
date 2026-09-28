# 1.1 Project Setup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the foundational TypeScript files (`utility.ts`, `assert.ts`) that every subsequent migration step depends on.

**Architecture:** Two leaf-node files with zero cross-dependencies. `utility.ts` exports the `ValueOf` utility type used by the `as const` enum pattern. `assert.ts` exports runtime assertion functions that provide TypeScript control-flow narrowing, replacing `goog.asserts.*`.

**Tech Stack:** TypeScript 6, strict mode, ES modules (`verbatimModuleSyntax`)

**Pre-existing (already done):** `ts/package.json`, `ts/tsconfig.json`, `ts/biome.json`

---

## File Structure

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `ts/lib/types/utility.ts` | `ValueOf<T>` utility type for `as const` enum pattern |
| Create | `ts/lib/util/assert.ts` | `assert`, `assertInstanceof`, `assertNonNull` — runtime checks with TS narrowing |

No test files — these are foundational primitives verified by `tsc --noEmit`. Assertion functions will be exercised extensively by every subsequent migration step.

---

### Task 1: Create `ValueOf` utility type

**Files:**
- Create: `ts/lib/types/utility.ts`

- [ ] **Step 1: Create the file**

```typescript
/**
 * Extracts the union of values from an `as const` object.
 *
 * Used by every enum conversion in the migration:
 *   export const Foo = { A: 0, B: 1 } as const;
 *   export type Foo = ValueOf<typeof Foo>;  // 0 | 1
 */
export type ValueOf<T> = T[keyof T];
```

- [ ] **Step 2: Run `tsc --noEmit`**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx tsc --noEmit`
Expected: exit 0, no errors

- [ ] **Step 3: Run formatter**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx biome check --write --unsafe lib/types/utility.ts`
Expected: file formatted, no errors

- [ ] **Step 4: Commit**

```bash
git add ts/lib/types/utility.ts
git commit -m "migrate(types): add ValueOf utility type for as-const enum pattern"
```

---

### Task 2: Create assertion utilities

**Files:**
- Create: `ts/lib/util/assert.ts`
- Reference: `ts/migration/RULES.md` lines 122–159 (exact signatures)

- [ ] **Step 1: Create the file**

```typescript
/** Runtime check + TS type narrowing. Replaces goog.asserts.assert. */
export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message ?? "Assertion failed");
  }
}

/** Runtime instanceof check + TS type narrowing. Replaces goog.asserts.assertInstanceof. */
export function assertInstanceof<T>(
  value: unknown,
  constructor: new (...args: unknown[]) => T,
  message?: string,
): asserts value is T {
  if (!(value instanceof constructor)) {
    throw new Error(message ?? `Expected instance of ${constructor.name}`);
  }
}

/** Runtime non-null check + TS type narrowing. Replaces goog.asserts.assertNonNull. */
export function assertNonNull<T>(
  value: T | null | undefined,
  message?: string,
): asserts value is T {
  if (value == null) {
    throw new Error(message ?? "Expected non-null value");
  }
}
```

- [ ] **Step 2: Run `tsc --noEmit`**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx tsc --noEmit`
Expected: exit 0, no errors

- [ ] **Step 3: Run formatter**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx biome check --write --unsafe lib/util/assert.ts`
Expected: file formatted, no errors

- [ ] **Step 4: Commit**

```bash
git add ts/lib/util/assert.ts
git commit -m "migrate(util): add typed assertion utilities replacing goog.asserts"
```

---

### Task 3: Final verification

- [ ] **Step 1: Full `tsc --noEmit` across `ts/`**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx tsc --noEmit`
Expected: exit 0, no errors

- [ ] **Step 2: Full biome check**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx biome check lib/`
Expected: no errors, no warnings

- [ ] **Step 3: Mark step 1.1 complete in PLAN.md**

Change `- [ ] **1.1 Project setup**` to `- [x] **1.1 Project setup**` in `ts/migration/PLAN.md`.

- [ ] **Step 4: Commit**

```bash
git add ts/migration/PLAN.md
git commit -m "chore(ts): mark step 1.1 project setup complete"
```
