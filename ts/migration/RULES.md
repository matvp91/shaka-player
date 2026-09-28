# Migration Rules

Strict rules governing the JavaScript-to-TypeScript conversion of Shaka Player. Every contributor and AI assistant must follow these without exception.

## Rule #0: Translate, Don't Transform

**This is the most important rule.** The migration is a mechanical translation from JavaScript to TypeScript. Nothing else.

- Do NOT fix bugs
- Do NOT refactor code
- Do NOT optimize logic
- Do NOT improve naming
- Do NOT reorganize code structure within a file
- Do NOT add features or abstractions
- Do NOT clean up surrounding code
- Do NOT add comments beyond what is required by these rules

The only changes permitted are those mechanically required by the JS → TS switch: type annotations, import/export syntax, and `goog.*` replacement. If a change is not on this list, it does not belong in this migration.

---

## Type Safety

### Strict Mode
TypeScript strict mode must be enabled (`"strict": true` in tsconfig). This includes:
- `noImplicitAny`
- `strictNullChecks`
- `strictFunctionTypes`
- `strictBindCallApply`
- `strictPropertyInitialization`
- `noImplicitThis`
- `alwaysStrict`

### No `any`
Never use `any` as a type. If a type is truly unknown, use `unknown` and narrow it with type guards or assertions.

### No `@ts-ignore` / `@ts-expect-error`
If the types don't work, fix them. These directives hide real problems.

### No Type Assertions (`as`)
Do not use `as` for type casting unless interfacing with untyped browser APIs (e.g., `document.createElement('video') as HTMLVideoElement`). Every use of `as` must have a `// MIGRATION:` comment explaining why it's necessary.

---

## Preserving Original Intent

### 1:1 Behavioral Mapping
Every converted file must produce the exact same logic as the original. The TypeScript version is a translation, not a rewrite.

### Same Names
Keep the same class, method, and property names. Rename only what the module system requires (e.g., `shaka.util.Error` may need to become `ShakaError` to avoid collision with the global `Error`). Document any such renames with a `// MIGRATION:` comment.

### Preserve All Code Paths
Do not simplify conditionals, remove branches, or collapse switch cases. If the original has it, the conversion has it.

### Same Method Signatures
Parameter order, optional parameters, and default values must match exactly.

### Private Convention
Fields with `_` suffix become TypeScript `private` and keep the underscore:
```typescript
// Original: /** @private {number} */ this.count_ = 0;
// Converted:
private count_: number = 0;
```

### No Added Abstractions
Do not introduce generics, utility types, or helper classes that did not exist in the original. The one exception is the shared `ValueOf` utility type for enum conversion.

### Side-by-Side Reference
When converting a file, always have the original open. Line-by-line comparison is the standard.

### Comment Deviations
If any deviation from the original is unavoidable (e.g., Closure-specific patterns with no TS equivalent), add a `// MIGRATION:` comment explaining what changed and why.

---

## Enum Convention

All Closure `@enum` types become `as const` objects with a companion `ValueOf` type:

```typescript
import type { ValueOf } from '../types/utility';

export const CodecSwitchingStrategy = {
  RELOAD: 0,
  SMOOTH: 1,
} as const;

export type CodecSwitchingStrategy = ValueOf<typeof CodecSwitchingStrategy>;
```

**Never use the TypeScript `enum` keyword.** Always use the `as const` + `ValueOf` pattern.

Preserve the original values exactly (numbers, strings) as defined in the Closure source.

---

## Nullability Mapping

Closure uses `?Type` (nullable) and `!Type` (non-null). Map carefully:

| Closure | TypeScript |
|---------|-----------|
| `?Type` | `Type \| null` |
| `!Type` | `Type` |
| Bare `Type` (no prefix) | `Type` (non-null) unless usage shows otherwise |

**When in doubt, keep it nullable.** It is safer to be overly nullable and narrow later than to silently drop a null check the original code relies on.

---

## `goog.*` Replacement

### Module System
| Closure | TypeScript |
|---------|-----------|
| `goog.provide('shaka.foo.Bar')` | `export class Bar { ... }` |
| `goog.require('shaka.foo.Bar')` | `import { Bar } from '../foo/bar';` |
| `goog.requireType('shaka.foo.Bar')` | `import type { Bar } from '../foo/bar';` |

### Assertions (with TypeScript Type Narrowing)

Replace `goog.asserts` with typed assertion functions that provide both runtime checks and TypeScript control-flow narrowing:

```typescript
// ts/lib/util/assert.ts

/** Runtime check + TS type narrowing */
export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Assertion failed');
  }
}

/** Runtime instanceof check + TS type narrowing */
export function assertInstanceof<T>(
  value: unknown,
  ctor: new (...args: unknown[]) => T,
  message?: string
): asserts value is T {
  if (!(value instanceof ctor)) {
    throw new Error(message ?? `Expected instance of ${ctor.name}`);
  }
}

/** Runtime non-null check + TS type narrowing */
export function assertNonNull<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T {
  if (value == null) {
    throw new Error(message ?? 'Expected non-null value');
  }
}
```

Mapping:
| Closure | TypeScript |
|---------|-----------|
| `goog.asserts.assert(x)` | `assert(x)` |
| `goog.asserts.assert(x != null)` | `assertNonNull(x)` |
| `goog.asserts.assertInstanceof(x, Foo)` | `assertInstanceof(x, Foo)` (uses `ctor` param) |
| `goog.asserts.assertString(x)` | `assert(typeof x === 'string')` |
| `goog.asserts.assertNumber(x)` | `assert(typeof x === 'number')` |

### Other `goog.*` Usage
No other `goog.*` runtime calls should exist in the codebase. If any are found during conversion, create a minimal replacement in `ts/lib/util/` and document it.

---

## Export Strategy

### One Class Per File
Mirrors the original 1-file-1-class pattern. One major export per file.

### Named Exports Only
No default exports, ever.

### Barrel Files
Each module directory has an `index.ts` that re-exports all public classes:
```typescript
// ts/lib/util/index.ts
export { Timer } from './timer';
export { Lazy } from './lazy';
export { PublicPromise } from './public_promise';
// ...
```

### Namespace Mapping
The original `shaka.util.Timer` becomes:
- File: `ts/lib/util/timer.ts`
- Export: `export class Timer { ... }`
- Import: `import { Timer } from '../util';` or `import { Timer } from '../util/timer';`

---

## Interface and Abstract Class Mapping

| Closure | TypeScript |
|---------|-----------|
| `@interface` (no method bodies) | `interface` |
| `@interface` (with method bodies) | `abstract class` |
| `@implements {Foo}` | `implements Foo` |
| `@extends {Foo}` | `extends Foo` |
| `@template T` | `<T>` generic |
| `@final` | `// @final` comment (no TS enforcement) |

---

## Comments Format

### Comment Philosophy
Migrate all descriptive comments from the source. If the original has a comment, the conversion has it. This is part of Rule #0 — translate, don't transform.

**Do not add** comments that don't exist in the source. Do not invent new descriptions.

**Do remove** comments that only restate the declaration name with no additional information (`/** Timer. */ export class Timer`, `/** MPEG_PES. */ export interface MPEG_PES`).

### Multi-line JSDoc Comments
Use `/** ... */` for function, class, and property descriptions migrated from the source. Max 80 characters per line. **JSDoc comments must never be on a single line** — always use multi-line format, even for short descriptions:

```typescript
// Bad:
/** The name of the thing. */

// Good:
/**
 * The name of the thing.
 */
export function assert(condition: unknown): asserts condition { ... }
```

### Single-line Comments
Use `//` for implementation details:

```typescript
// Implementation note
if (condition) { ... }
```

---

## JSDoc Comment Removal

Remove all Closure type-system annotations that TypeScript makes redundant:

**Remove:**
- `@type` — type is in the TS annotation
- `@private` — replaced by `private` keyword
- `@protected` — replaced by `protected` keyword
- `@public` — replaced by `public` keyword
- `@const` — replaced by `const` / `readonly`
- `@return` / `@returns` — return type is in the signature
- `@param` — parameter types are in the signature
- `@template` — replaced by `<T>` syntax
- `@implements` — replaced by `implements` keyword
- `@extends` — replaced by `extends` keyword
- `@export` — replaced by `export` keyword
- `@enum` — replaced by `as const` pattern
- `@typedef` — replaced by `interface` or `type`
- `@interface` — replaced by `interface` keyword
- `@override` — replaced by `override` keyword

**Keep:**
- `@final` — as `// @final` comment
- `// MIGRATION:` comments for deviations
- Descriptive comments that explain *why* or *what* (summaries, descriptions, plain `//` comments)
- License headers

---

## Closure-to-TypeScript Type Syntax Reference

| Closure | TypeScript |
|---------|-----------|
| `{string}` | `string` |
| `{?string}` | `string \| null` |
| `{string\|undefined}` | `string \| undefined` |
| `{!Array<string>}` | `string[]` |
| `{!Array<!Array<string>>}` | `string[][]` |
| `{!Object<string, number>}` | `Record<string, number>` |
| `{function(string): boolean}` | `(arg: string) => boolean` |
| `{function(new:Foo)}` | `new () => Foo` |
| `{function(...string)}` | `(...args: string[]) => void` |
| `{*}` | `unknown` |
| `{undefined}` | `undefined` |
| `{void}` | `void` |
| `{!Promise<T>}` | `Promise<T>` |
| `{!Map<K,V>}` | `Map<K, V>` |
| `{!Set<T>}` | `Set<T>` |
| `{!IThenable<T>}` | `PromiseLike<T>` |
| `{number\|string}` | `number \| string` |

---

## Conversion Process Per File

1. **Read** the original JS file completely before starting
2. **Convert module system**: `goog.provide` / `goog.require` → ES `import` / `export`
3. **Convert type annotations**: Closure JSDoc → TypeScript inline types
4. **Convert enums**: `@enum` → `as const` + `ValueOf`
5. **Convert assertions**: `goog.asserts.*` → typed assertion utilities
6. **Remove redundant JSDoc**: Strip type-system annotations, keep descriptive comments
7. **Preserve all logic**: Do not change any runtime behavior
8. **Verify**: Run `tsc --noEmit` on the converted file

---

## Commit Strategy

### Small and Logical
Each commit should be a single logical unit of work. Examples of good commit boundaries:
- One type file converted (e.g., "convert externs/shaka/net.js to ts/lib/types/net.ts")
- One source file converted (e.g., "convert lib/util/timer.js to ts/lib/util/timer.ts")
- A small group of tightly coupled files (e.g., "convert lib/config/ module to ts/lib/config/")
- Infrastructure setup (e.g., "add tsconfig.json and assert utilities")

### Clear Messages
Commit messages must describe what was converted:
```
migrate(types): convert net externs to TypeScript interfaces

migrate(util): convert Timer class to TypeScript

migrate(config): convert all config enums to as-const pattern

chore(ts): add tsconfig.json and project setup
```

### Never Bundle Unrelated Changes
A commit that converts `timer.ts` must not also convert `lazy.ts` unless they are tightly coupled. Keep the diff reviewable.

---

## `// MIGRATION:` Comment Convention

Any deviation from the original source must be documented with a `// MIGRATION:` comment:

```typescript
// MIGRATION: renamed from shaka.util.Error to ShakaError to avoid
// collision with global Error class
export class ShakaError extends Error { ... }

// MIGRATION: Closure @final has no TypeScript equivalent
// @final
export class AdaptationSet { ... }

// MIGRATION: goog.asserts.assert replaced with typed assertion
assert(googUri != null);
```

These comments serve as an audit trail. They make it possible to review the conversion and verify that no behavioral changes were introduced.
