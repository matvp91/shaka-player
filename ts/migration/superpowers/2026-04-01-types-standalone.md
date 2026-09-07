# 1.2 Types: Standalone — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the three standalone extern type files (`resolution.js`, `codecs.js`, `mp4_parser.js`) to TypeScript interfaces in `ts/lib/types/`.

**Architecture:** Each Closure `@typedef` becomes a TypeScript `interface`. These three files have no cross-dependencies with each other. `codecs.js` has internal cross-references (`VideoNalu` used by `MPEG_PES` and `VideoSample`). `mp4_parser.js` references `shaka.util.Mp4Parser` and `shaka.util.DataViewReader` which are not yet converted — these get forward-declared as `unknown` with `// MIGRATION:` comments, to be replaced with proper imports in Phase 2.

**Tech Stack:** TypeScript 6, strict mode, ES modules (`verbatimModuleSyntax`)

---

## File Structure

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `ts/lib/types/resolution.ts` | `Resolution` interface |
| Create | `ts/lib/types/codecs.ts` | `MPEG_PES`, `VideoSample`, `VideoNalu`, `SpatialVideoInfo` interfaces |
| Create | `ts/lib/types/mp4_parser.ts` | `ParsedBox` interface (with forward-declared deps) |

No test files — these are pure type definitions verified by `tsc --noEmit`.

---

### Task 1: Convert `resolution.js`

**Files:**
- Reference: `externs/shaka/resolution.js`
- Create: `ts/lib/types/resolution.ts`

- [ ] **Step 1: Create the file**

```typescript
/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** Width and height in pixels. */
export interface Resolution {
  width: number;
  height: number;
}
```

- [ ] **Step 2: Run `tsc --noEmit`**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx tsc --noEmit`
Expected: exit 0, no errors

- [ ] **Step 3: Run formatter**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx biome check --write --unsafe lib/types/resolution.ts`
Expected: file formatted, no errors

- [ ] **Step 4: Commit**

```bash
git add ts/lib/types/resolution.ts
git commit -m "migrate(types): convert resolution externs to TypeScript interface"
```

---

### Task 2: Convert `codecs.js`

**Files:**
- Reference: `externs/shaka/codecs.js`
- Create: `ts/lib/types/codecs.ts`

The file defines four typedefs. `VideoNalu` must be defined before `MPEG_PES` and `VideoSample` since they reference it. `SpatialVideoInfo` is independent.

- [ ] **Step 1: Create the file**

```typescript
/*! @license
 * Shaka Player
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VideoNalu {
  data: Uint8Array;
  fullData: Uint8Array;
  type: number;
  time: number | null;
}

/** MPEG_PES. */
export interface MPEG_PES {
  data: Uint8Array;
  packetLength: number;
  pts: number | null;
  dts: number | null;
  nalus: VideoNalu[];
}

export interface VideoSample {
  data: Uint8Array;
  frame: boolean;
  isKeyframe: boolean;
  pts: number | null;
  dts: number | null;
  nalus: VideoNalu[];
}

export interface SpatialVideoInfo {
  projection: string | null;
  hfov: number | null;
}
```

- [ ] **Step 2: Run `tsc --noEmit`**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx tsc --noEmit`
Expected: exit 0, no errors

- [ ] **Step 3: Run formatter**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx biome check --write --unsafe lib/types/codecs.ts`
Expected: file formatted, no errors

- [ ] **Step 4: Commit**

```bash
git add ts/lib/types/codecs.ts
git commit -m "migrate(types): convert codecs externs to TypeScript interfaces"
```

---

### Task 3: Convert `mp4_parser.js`

**Files:**
- Reference: `externs/shaka/mp4_parser.js`
- Create: `ts/lib/types/mp4_parser.ts`

`ParsedBox` references `shaka.util.Mp4Parser` and `shaka.util.DataViewReader`, which won't be converted until Phase 2 (steps 2.6–2.7). Forward-declare these as `unknown` with `// MIGRATION:` comments.

- [ ] **Step 1: Create the file**

```typescript
/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// MIGRATION: Forward declarations for classes not yet converted (Phase 2).
// Replace with proper imports when util/mp4_parser.ts and
// util/data_view_reader.ts are converted.
type Mp4Parser = unknown;
type DataViewReader = unknown;

export interface ParsedBox {
  /** The box name, a 4-character string (fourcc). */
  name: string;
  /**
   * The parser that parsed this box. The parser can be used to parse child
   * boxes where the configuration of the current parser is needed to parsed
   * other boxes.
   */
  parser: Mp4Parser;
  /**
   * If true, allows reading partial payloads from some boxes. If the goal is a
   * child box, we can sometimes find it without enough data to find all child
   * boxes. This property allows the partialOkay flag from parse() to be
   * propagated through methods like children().
   */
  partialOkay: boolean;
  /** If true, stop reading if an incomplete box is detected. */
  stopOnPartial: boolean;
  /**
   * The start of this box (before the header) in the original buffer. This
   * start position is the absolute position.
   */
  start: number;
  /** The size of this box (including the header). */
  size: number;
  /** The version for a full box, null for basic boxes. */
  version: number | null;
  /** The flags for a full box, null for basic boxes. */
  flags: number | null;
  /**
   * The reader for this box is only for this box. Reading or not reading to
   * the end will have no affect on the parser reading other sibling boxes.
   */
  reader: DataViewReader;
  /** If true, the box header had a 64-bit size field. This affects the offsets of other fields. */
  has64BitSize: boolean;
}
```

- [ ] **Step 2: Run `tsc --noEmit`**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx tsc --noEmit`
Expected: exit 0, no errors

- [ ] **Step 3: Run formatter**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx biome check --write --unsafe lib/types/mp4_parser.ts`
Expected: file formatted, no errors

- [ ] **Step 4: Commit**

```bash
git add ts/lib/types/mp4_parser.ts
git commit -m "migrate(types): convert mp4_parser externs to TypeScript interface"
```

---

### Task 4: Final verification

- [ ] **Step 1: Full `tsc --noEmit` across `ts/`**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx tsc --noEmit`
Expected: exit 0, no errors

- [ ] **Step 2: Full biome check**

Run: `cd /Users/matvp/Development/shaka-player/ts && npx biome check lib/types/`
Expected: no errors, no warnings

- [ ] **Step 3: Mark step 1.2 complete in PLAN.md**

Change `- [ ] **1.2 Types: standalone**` to `- [x] **1.2 Types: standalone**` in `ts/migration/PLAN.md`.

- [ ] **Step 4: Commit**

```bash
git add ts/migration/PLAN.md
git commit -m "chore(ts): mark step 1.2 types standalone complete"
```
