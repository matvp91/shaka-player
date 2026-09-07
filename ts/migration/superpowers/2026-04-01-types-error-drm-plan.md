# 1.3 Types: error + drm + abortable — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `externs/shaka/error.js`, `drm_info.js`, and `abortable.js` to TypeScript interfaces in `ts/lib/types/`, add a forward-declaration tracking file, and update CLAUDE.md workflow.

**Architecture:** Each Closure `@typedef` / `@interface` becomes a TypeScript `interface`. Forward declarations use `type X = number` for enums (truthful — Closure enums are numeric). A centralized `FORWARD_DECLARATIONS.md` tracks all forward declarations and their resolution steps.

**Tech Stack:** TypeScript 6, strict mode, ES modules (`verbatimModuleSyntax`)

---

## File Structure

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `ts/lib/types/error.ts` | `RestrictionInfo`, `Error` interfaces + enum forward declarations |
| Create | `ts/lib/types/drm_info.ts` | `InitDataOverride`, `DrmInfo` interfaces |
| Create | `ts/lib/types/abortable.ts` | `IAbortableOperation<T>` interface |
| Create | `ts/migration/FORWARD_DECLARATIONS.md` | Track all forward declarations project-wide |
| Modify | `ts/CLAUDE.md` | Add forward-declaration check to workflow |

No test files — these are pure type definitions verified by `tsc --noEmit`.

---

### Task 1: Convert `error.js`

**Files:**
- Reference: `externs/shaka/error.js`
- Create: `ts/lib/types/error.ts`

- [ ] **Step 1: Create the file**

```typescript
/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// MIGRATION: Forward declarations for shaka.util.Error enums (Phase 2.4).
// Replace with proper imports when util/error.ts is converted.
type Severity = number;
type Category = number;
type Code = number;

export interface RestrictionInfo {
  /**
   * Whether there are streams that are restricted due to app-provided
   * restrictions.
   */
  hasAppRestrictions: boolean;
  /** The key IDs that were missing. */
  missingKeys: string[];
  /**
   * The restricted EME key statuses that the streams had.  For example,
   * 'output-restricted' would mean streams couldn't play due to restrictions
   * on the output device (e.g. HDCP).
   */
  restrictedKeyStatuses: string[];
}

export interface Error {
  severity: Severity;
  readonly category: Category;
  readonly code: Code;
  readonly data: unknown[];
  handled: boolean;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add ts/lib/types/error.ts
git commit -m "migrate(types): convert error externs to TypeScript interfaces"
```

---

### Task 2: Convert `drm_info.js`

**Files:**
- Reference: `externs/shaka/drm_info.js`
- Create: `ts/lib/types/drm_info.ts`

- [ ] **Step 1: Create the file**

```typescript
/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Explicit initialization data, which override any initialization data in the
 * content. The initDataType values and the formats that they correspond to
 * are specified {@link https://bit.ly/EmeInitTypes here}.
 */
export interface InitDataOverride {
  /** Initialization data in the format indicated by initDataType. */
  initData: Uint8Array;
  /** A string to indicate what format initData is in. */
  initDataType: string;
  /** The key Id that corresponds to this initData. */
  keyId: string | null;
}

/** DRM configuration for a single key system. */
export interface DrmInfo {
  /** The key system, e.g., "com.widevine.alpha". */
  keySystem: string;
  /** The encryption scheme, e.g., "cenc", "cbcs", "cbcs-1-9". */
  encryptionScheme: string;
  /** The key system uri, e.g., "skd://" for fairplay. */
  keySystemUris?: Set<string>;
  /** The license server URI. */
  licenseServerUri: string;
  /**
   * True if the application requires the key system to support distinctive
   * identifiers.
   */
  distinctiveIdentifierRequired: boolean;
  /**
   * True if the application requires the key system to support persistent
   * state, e.g., for persistent license storage.
   */
  persistentStateRequired: boolean;
  /** A key-system-specific string that specifies a required security level. */
  audioRobustness: string;
  /** A key-system-specific string that specifies a required security level. */
  videoRobustness: string;
  /**
   * A key-system-specific server certificate used to encrypt license requests.
   * Its use is optional and is meant as an optimization to avoid a round-trip
   * to request a certificate.
   */
  // MIGRATION: Source typed as Uint8Array but docs say "defaults to null".
  // Using Uint8Array | null to match runtime behavior.
  serverCertificate: Uint8Array | null;
  /**
   * Server certificate URI. If serverCertificate is not provided, the
   * certificate will be requested from this URI.
   */
  serverCertificateUri: string;
  /** The session type, e.g., "temporary". */
  sessionType: string;
  /**
   * A list of initialization data which override any initialization data found
   * in the content.
   */
  initData: InitDataOverride[];
  /**
   * If not empty, contains the default key IDs for this key system, as
   * lowercase hex strings.
   */
  keyIds: Set<string>;
  /**
   * An optional list specifying each component in a media type included in a
   * data: scheme URI, separated by semicolon.
   */
  mediaTypes?: string[];
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add ts/lib/types/drm_info.ts
git commit -m "migrate(types): convert drm_info externs to TypeScript interfaces"
```

---

### Task 3: Convert `abortable.js`

**Files:**
- Reference: `externs/shaka/abortable.js`
- Create: `ts/lib/types/abortable.ts`

- [ ] **Step 1: Create the file**

```typescript
/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A representation of an abortable operation.  Note that these are not
 * cancelable.  Cancellation implies undoing what has been done so far,
 * whereas aborting only means that further work is stopped.
 */
export interface IAbortableOperation<T> {
  /**
   * A Promise which represents the underlying operation.  It is resolved when
   * the operation is complete, and rejected if the operation fails or is
   * aborted.  Aborted operations should be rejected with a shaka.util.Error
   * object using the error code OPERATION_ABORTED.
   */
  readonly promise: Promise<T>;

  /**
   * Can be called by anyone holding this object to abort the underlying
   * operation.  This is not cancellation, and will not necessarily result in
   * any work being undone.  abort() should return a Promise which is resolved
   * when the underlying operation has been aborted.  The returned Promise
   * should never be rejected.
   */
  abort(): Promise<void>;

  /**
   * A callback to be invoked after the operation succeeds or fails.  The
   * boolean argument is true if the operation succeeded and false if it
   * failed.
   */
  finally(onFinal: (success: boolean) => void): IAbortableOperation<T>;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add ts/lib/types/abortable.ts
git commit -m "migrate(types): convert abortable externs to TypeScript interface"
```

---

### Task 4: Create forward-declaration tracking file

**Files:**
- Create: `ts/migration/FORWARD_DECLARATIONS.md`

- [ ] **Step 1: Create the file**

```markdown
# Forward Declarations

Track all forward declarations that need to be replaced with real imports.
Check this file before starting any migration step.

| Declaration | Location | Resolves at | Notes |
|---|---|---|---|
| `type Mp4Parser = unknown` | `ts/lib/types/mp4_parser.ts` | Step 2.7 | Replace with import from util |
| `type DataViewReader = unknown` | `ts/lib/types/mp4_parser.ts` | Step 2.6 | Replace with import from util |
| `type Severity = number` | `ts/lib/types/error.ts` | Step 2.4 | Replace with real enum type |
| `type Category = number` | `ts/lib/types/error.ts` | Step 2.4 | Replace with real enum type |
| `type Code = number` | `ts/lib/types/error.ts` | Step 2.4 | Replace with real enum type |
```

- [ ] **Step 2: Commit**

```bash
git add ts/migration/FORWARD_DECLARATIONS.md
git commit -m "chore(ts): add forward-declaration tracking file"
```

---

### Task 5: Update CLAUDE.md workflow

**Files:**
- Modify: `ts/CLAUDE.md`

- [ ] **Step 1: Add forward-declaration check to the Workflow section**

After the line `- Commit between each task during plan execution`, add:

```markdown
- Before starting any migration step, check `ts/migration/FORWARD_DECLARATIONS.md`
  for forward declarations that should be resolved in that step
```

- [ ] **Step 2: Commit**

```bash
git add ts/CLAUDE.md
git commit -m "chore(ts): add forward-declaration check to workflow guidelines"
```

---

### Task 6: Update PLAN.md and final verification

**Files:**
- Modify: `ts/migration/PLAN.md`

- [ ] **Step 1: Full compilation check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 2: Mark step 1.3 complete in PLAN.md**

Change:
```markdown
- [ ] **1.3 Types: error + drm** — convert `error.ts`, `drm_info.ts`, `abortable.ts`
```
To:
```markdown
- [x] **1.3 Types: error + drm** — convert `error.ts`, `drm_info.ts`, `abortable.ts`
```

- [ ] **Step 3: Commit**

```bash
git add ts/migration/PLAN.md
git commit -m "chore(ts): mark step 1.3 complete"
```
