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
  /**
   * The key IDs that were missing.
   */
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
