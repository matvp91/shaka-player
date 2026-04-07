/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { DrmInfo } from "./drm_info";

export interface ManifestDBV2 {
  /**
   * The URI that the manifest was originally loaded from.
   */
  originalManifestUri: string;
  /**
   * The total duration of the media, in seconds.
   */
  duration: number;
  /**
   * The total size of all stored segments, in bytes.
   */
  size: number;
  /**
   * The license expiration, in milliseconds; or Infinity if not applicable.
   * Note that upon JSON serialization, Infinity becomes null, and must be
   * converted back upon loading from storage.
   */
  expiration: number;
  /**
   * The Periods that are stored.
   */
  periods: PeriodDBV2[];
  /**
   * The DRM offline session IDs for the media.
   */
  sessionIds: string[];
  /**
   * The DRM info used to initialize EME.
   */
  drmInfo: DrmInfo | null;
  /**
   * A metadata object passed from the application.
   */
  // biome-ignore lint/suspicious/noExplicitAny: The externs use any for this type
  appMetadata: any;
}

export interface PeriodDBV2 {
  /**
   * The start time of the period, in seconds.
   */
  startTime: number;
  /**
   * The streams that define the Period.
   */
  streams: StreamDBV2[];
}

export interface StreamDBV2 {
  /**
   * The unique id of the stream.
   */
  id: number;
  /**
   * The original ID, if any, that appeared in the manifest.  For example, in
   * DASH, this is the "id" attribute of the Representation element.
   */
  originalId: string | null;
  /**
   * Whether the stream set was primary.
   */
  primary: boolean;
  /**
   * The presentation time offset of the stream, in seconds.  Note that this is
   * the inverse of the timestampOffset as defined in the manifest types.
   */
  presentationTimeOffset: number;
  /**
   * The type of the stream, 'audio', 'text', or 'video'.
   */
  contentType: string;
  /**
   * The MIME type of the stream.
   */
  mimeType: string;
  /**
   * The codecs of the stream.
   */
  codecs: string;
  /**
   * The Stream's framerate in frames per second.
   */
  frameRate?: number;
  /**
   * The Stream's pixel aspect ratio
   */
  pixelAspectRatio?: string;
  /**
   * The kind of text stream; undefined for audio/video.
   */
  kind?: string;
  /**
   * The language of the stream; '' for video.
   */
  language: string;
  /**
   * The label of the stream; '' for video.
   */
  label: string | null;
  /**
   * The width of the stream; null for audio/text.
   */
  width: number | null;
  /**
   * The height of the stream; null for audio/text.
   */
  height: number | null;
  /**
   * The storage key where the init segment is found; null if no init segment.
   */
  initSegmentKey: number | null;
  /**
   * Whether this stream is encrypted.
   */
  encrypted: boolean;
  /**
   * The key ID this stream is encrypted with.
   */
  keyId: string | null;
  /**
   * An array of segments that make up the stream.
   */
  segments: SegmentDBV2[];
  /**
   * An array of ids of variants the stream is a part of.
   */
  variantIds: number[];
}

export interface SegmentDBV2 {
  /**
   * The start time of the segment, in seconds from the start of the Period.
   */
  startTime: number;
  /**
   * The end time of the segment, in seconds from the start of the Period.
   */
  endTime: number;
  /**
   * The key to the data in storage.
   */
  dataKey: number;
}

export interface SegmentDataDBV2 {
  /**
   * The data contents of the segment.
   */
  data: ArrayBuffer;
}
