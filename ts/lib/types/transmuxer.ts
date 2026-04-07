/*! @license
 * Shaka Player
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Stream } from "./manifest";

// Forward declarations
// Resolves at Step 6.1 (media)
export type SegmentReference = unknown;

/**
 */
export interface TransmuxerOutput {
  /**
   * Segment data.
   */
  data: Uint8Array;
  /**
   * Init segment data.
   */
  init: Uint8Array | null;
}

/**
 * An interface for transmuxer plugins.
 */
export interface Transmuxer {
  /**
   * Destroy
   */
  destroy(): void;

  /**
   * Check if the mime type and the content type is supported.
   * @param mimeType
   * @param contentType
   * @return
   */
  isSupported(mimeType: string, contentType?: string): boolean;

  /**
   * For any stream, convert its codecs to MP4 codecs.
   * @param contentType
   * @param mimeType
   * @return
   */
  convertCodecs(contentType: string, mimeType: string): string;

  /**
   * Returns the original mimetype of the transmuxer.
   * @return
   */
  getOriginalMimeType(): string;

  /**
   * Transmux a input data to MP4.
   * @param data
   * @param stream
   * @param reference The segment reference, or
   *   null for init segments
   * @param duration
   * @param contentType
   * @return If you
   * only want to return the result, use Uint8Array, if you want to separate
   * the initialization segment and the data segment, you have to use
   * shaka.extern.TransmuxerOutput
   */
  transmux(
    data: BufferSource,
    stream: Stream,
    reference: SegmentReference | null,
    duration: number,
    contentType: string,
  ): Promise<Uint8Array | TransmuxerOutput>;
}

/**
 */
export type TransmuxerPlugin = () => Transmuxer;
