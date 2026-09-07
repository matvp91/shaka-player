# 1.3 Types: error + drm + abortable — Design Spec

**Goal:** Convert the three extern type files (`error.js`, `drm_info.js`, `abortable.js`)
to TypeScript interfaces in `ts/lib/types/`, and introduce a forward-declaration
tracking system.

**Context:** These types are foundational — steps 1.4 (`net.ts`), 1.5 (`manifest.ts`),
and 1.9 (`player.ts`) all depend on them.

---

## Files to Create

### 1. `ts/lib/types/error.ts`

**Source:** `externs/shaka/error.js`

Two interfaces:

**`RestrictionInfo`** — simple typedef, 3 properties:
- `hasAppRestrictions: boolean`
- `missingKeys: string[]`
- `restrictedKeyStatuses: string[]`

**`Error`** — interface with 5 properties:
- `severity: Severity` (forward-declared)
- `category: Category` (forward-declared, readonly)
- `code: Code` (forward-declared, readonly)
- `data: unknown[]` (`Array<*>` → `unknown[]`)
- `handled: boolean`

**Forward declarations** (resolved at step 2.4):
```typescript
// MIGRATION: Forward declarations for shaka.util.Error enums (Phase 2.4).
// Replace with proper imports when util/error.ts is converted.
type Severity = number;
type Category = number;
type Code = number;
```

Rationale for `number` over `unknown`: Closure enums are numeric. Using `number`
is truthful and keeps the Error interface usable by downstream types, unlike
`unknown` which would poison every consumer.

### 2. `ts/lib/types/drm_info.ts`

**Source:** `externs/shaka/drm_info.js`

Two interfaces:

**`InitDataOverride`** — 3 properties:
- `initData: Uint8Array`
- `initDataType: string`
- `keyId: string | null` (`?string` → `string | null`)

**`DrmInfo`** — 14 properties:
- `keySystem: string`
- `encryptionScheme: string`
- `keySystemUris?: Set<string>` (`Set<string>|undefined` → optional)
- `licenseServerUri: string`
- `distinctiveIdentifierRequired: boolean`
- `persistentStateRequired: boolean`
- `audioRobustness: string`
- `videoRobustness: string`
- `serverCertificate: Uint8Array | null` (source typed as `Uint8Array` but docs say "defaults to null")
- `serverCertificateUri: string`
- `sessionType: string`
- `initData: InitDataOverride[]`
- `keyIds: Set<string>`
- `mediaTypes?: string[]` (`!Array<string>|undefined` → optional)

No forward declarations needed — all types are self-contained or reference
`InitDataOverride` from the same file.

### 3. `ts/lib/types/abortable.ts`

**Source:** `externs/shaka/abortable.js`

One generic interface:

**`IAbortableOperation<T>`** — 1 property + 2 methods:
- `readonly promise: Promise<T>`
- `abort(): Promise<void>`
- `finally(onFinal: (success: boolean) => void): IAbortableOperation<T>`

No forward declarations needed.

---

## Forward Declaration Tracking

### New file: `ts/migration/FORWARD_DECLARATIONS.md`

A centralized table tracking all forward declarations across the project.
Each row maps a declaration to its location and the step that resolves it.
Rows are removed as they're resolved.

Initial contents (including existing step 1.2 declarations):

| Declaration | Location | Resolves at | Notes |
|---|---|---|---|
| `type Mp4Parser = unknown` | `ts/lib/types/mp4_parser.ts` | Step 2.7 | Replace with import from util |
| `type DataViewReader = unknown` | `ts/lib/types/mp4_parser.ts` | Step 2.6 | Replace with import from util |
| `type Severity = number` | `ts/lib/types/error.ts` | Step 2.4 | Replace with real enum type |
| `type Category = number` | `ts/lib/types/error.ts` | Step 2.4 | Replace with real enum type |
| `type Code = number` | `ts/lib/types/error.ts` | Step 2.4 | Replace with real enum type |

### CLAUDE.md update

Add to the Workflow section:
> Before starting any migration step, check `ts/migration/FORWARD_DECLARATIONS.md`
> for forward declarations that should be resolved in that step.

---

## Conventions (same as 1.2)

- License header on every file
- Descriptive comments kept, Closure annotations removed (`@type`, `@param`,
  `@return`, `@const`, `@exportDoc`, `@property`, `@typedef`, `@interface`, `@template`)
- `@const` properties → `readonly`
- No `any`, no `as`, strict types
- Forward declarations with `// MIGRATION:` comments

## Verification

- `tsc --noEmit` must pass after all files are added
