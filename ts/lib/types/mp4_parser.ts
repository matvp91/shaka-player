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
  /**
   * The box name, a 4-character string (fourcc).
   */
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
  /**
   * If true, stop reading if an incomplete box is detected.
   */
  stopOnPartial: boolean;
  /**
   * The start of this box (before the header) in the original buffer. This
   * start position is the absolute position.
   */
  start: number;
  /**
   * The size of this box (including the header).
   */
  size: number;
  /**
   * The version for a full box, null for basic boxes.
   */
  version: number | null;
  /**
   * The flags for a full box, null for basic boxes.
   */
  flags: number | null;
  /**
   * The reader for this box is only for this box. Reading or not reading to
   * the end will have no affect on the parser reading other sibling boxes.
   */
  reader: DataViewReader;
  /**
   * If true, the box header had a 64-bit size field. This affects the offsets
   * of other fields.
   */
  has64BitSize: boolean;
}
