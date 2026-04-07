/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { DrmInfo } from "./drm_info";
import type { ThumbnailSprite } from "./manifest";

// Forward declarations
// Resolves at Step 1.9 (player types)
export type Track = unknown;

export interface OfflineSupport {
  /**
   * True if offline is usable at all.
   */
  basic: boolean;
  /**
   * A map of key system name to whether it supports offline playback.
   */
  encrypted: Record<string, boolean>;
}

export interface StoredContent {
  /**
   * An offline URI to access the content. This can be passed directly to
   * Player. If the uri is null, it means that the content has not finished
   * downloading and is not ready to play.
   */
  offlineUri: string | null;
  /**
   * The original manifest URI of the content stored.
   */
  originalManifestUri: string;
  /**
   * The duration of the content, in seconds.
   */
  duration: number;
  /**
   * The size of the content, in bytes.
   */
  size: number;
  /**
   * The time that the encrypted license expires, in milliseconds.  If the media
   * is clear or the license never expires, this will equal Infinity.
   */
  expiration: number;
  /**
   * The tracks that are stored.
   */
  tracks: Track[];
  /**
   * The metadata passed to store().
   */
  // biome-ignore lint/suspicious/noExplicitAny: The externs use any for this type
  appMetadata: any;
  /**
   * If true, the content is still downloading.  Manifests with this set cannot
   * be played yet.
   */
  isIncomplete: boolean;
}

export interface ManifestDB {
  /**
   * The date time when the asset was created.
   */
  creationTime: number;
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
   * The Streams that are stored.
   */
  streams: StreamDB[];
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
  /**
   * If true, the content is still downloading.
   */
  isIncomplete?: boolean;
  /**
   * If true, we will append the media segments using sequence mode; that is to
   * say, ignoring any timestamps inside the media files.
   */
  sequenceMode?: boolean;
  /**
   * Indicates the type of the manifest. It can be <code>'HLS'</code> or
   * <code>'DASH'</code>.
   */
  type?: string;
}

export interface StreamDB {
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
   * The ID of the stream's parent element. In DASH, this will be a unique
   * ID that represents the representation's parent adaptation element
   */
  groupId: string | null;
  /**
   * Whether the stream set was primary.
   */
  primary: boolean;
  /**
   * The type of the stream, 'audio', 'text', or 'video'.
   */
  type: string;
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
   * The Stream's HDR info
   */
  hdr?: string;
  /**
   * The Stream's color gamut info
   */
  colorGamut?: string;
  /**
   * The Stream's video layout info.
   */
  videoLayout?: string;
  /**
   * The kind of text stream; undefined for audio/video.
   */
  kind?: string;
  /**
   * The language of the stream; '' for video.
   */
  language: string;
  /**
   * The original language, if any, that appeared in the manifest.
   */
  originalLanguage?: string;
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
   * Whether this stream is encrypted.
   */
  encrypted: boolean;
  /**
   * The key IDs this stream is encrypted with.
   */
  keyIds: Set<string>;
  /**
   * An array of segments that make up the stream.
   */
  segments: SegmentDB[];
  /**
   * An array of ids of variants the stream is a part of.
   */
  variantIds: number[];
  /**
   * The roles of the stream as they appear on the manifest,
   * e.g. 'main', 'caption', or 'commentary'.
   */
  roles: string[];
  /**
   * Whether the stream set was forced.
   */
  forced: boolean;
  /**
   * The channel count information for the audio stream.
   */
  channelsCount: number | null;
  /**
   * Specifies the maximum sampling rate of the content.
   */
  audioSamplingRate: number | null;
  /**
   * Whether the stream set has spatial audio.
   */
  spatialAudio: boolean;
  /**
   * A map containing the description of closed captions, with the caption
   * channel number (CC1 | CC2 | CC3 | CC4) as the key and the language code
   * as the value. If the channel number is not provided by the description,
   * we'll set a 0-based index as the key. If the language code is not
   * provided by the description we'll set the same value as channel number.
   * Example: {'CC1': 'eng'; 'CC3': 'swe'}, or {'1', 'eng'; '2': 'swe'}, etc.
   */
  closedCaptions: Map<string, string>;
  /**
   * The value is a grid-item-dimension consisting of two positive decimal
   * integers in the format: column-x-row ('4x3'). It describes the arrangement
   * of Images in a Grid. The minimum valid LAYOUT is '1x1'.
   */
  tilesLayout?: string;
  /**
   * Indicate if the stream was added externally.
   * Eg: external text tracks.
   */
  external: boolean;
  /**
   * Indicate if the stream should be used for fast switching.
   */
  fastSwitching: boolean;
  /**
   * Indicate if the audio of this stream is muxed in the video of other stream.
   */
  isAudioMuxedInVideo: boolean;
}

export interface SegmentDB {
  /**
   * The storage key where the init segment is found; null if no init segment.
   */
  initSegmentKey: number | null;
  /**
   * The start time of the segment in the presentation timeline.
   */
  startTime: number;
  /**
   * The end time of the segment in the presentation timeline.
   */
  endTime: number;
  /**
   * A start timestamp before which media samples will be truncated.
   */
  appendWindowStart: number;
  /**
   * An end timestamp beyond which media samples will be truncated.
   */
  appendWindowEnd: number;
  /**
   * An offset which MediaSource will add to the segment's media timestamps
   * during ingestion, to align to the presentation timeline.
   */
  timestampOffset: number;
  /**
   * The value is a grid-item-dimension consisting of two positive decimal
   * integers in the format: column-x-row ('4x3'). It describes the
   * arrangement of Images in a Grid. The minimum valid LAYOUT is '1x1'.
   */
  tilesLayout: string | null;
  /**
   * Contains an id that identifies what the segment was, originally. Used to
   * coordinate where segments are stored, during the downloading process.
   * If this field is non-null, it's assumed that the segment is not fully
   * downloaded.
   */
  pendingSegmentRefId?: string;
  /**
   * Contains an id that identifies what the init segment was, originally.
   * Used to coordinate where init segments are stored, during the downloading
   * process.
   * If this field is non-null, it's assumed that the init segment is not fully
   * downloaded.
   */
  pendingInitSegmentRefId?: string;
  /**
   * The key to the data in storage.
   */
  dataKey: number;
  /**
   * The mimeType of the segment.
   */
  mimeType: string | null;
  /**
   * The codecs of the segment.
   */
  codecs: string | null;
  /**
   * The segment's thumbnail sprite.
   */
  thumbnailSprite: ThumbnailSprite | null;
  /**
   * The chapter title.
   */
  chapterTitle: string | null;
}

export interface SegmentDataDB {
  /**
   * The data contents of the segment.
   */
  data: ArrayBuffer;
}

export interface EmeSessionDB {
  /**
   * The EME session ID.
   */
  sessionId: string;
  /**
   * The EME key system string the session belongs to.
   */
  keySystem: string;
  /**
   * The URI for the license server.
   */
  licenseUri: string;
  /**
   * A key-system-specific server certificate used to encrypt license requests.
   * Its use is optional and is meant as an optimization to avoid a round-trip
   * to request a certificate.
   */
  serverCertificate: Uint8Array;
  /**
   * The EME audio capabilities used to create the session.
   */
  audioCapabilities: MediaKeySystemMediaCapability[];
  /**
   * The EME video capabilities used to create the session.
   */
  videoCapabilities: MediaKeySystemMediaCapability[];
}

/**
 * An interface that defines access to collection of segments and manifests. All
 * methods are designed to be batched operations allowing the implementations to
 * optimize their operations based on how they store data.
 *
 * The storage cell is one of two exposed APIs used to control where and how
 * offline content is saved. The storage cell is responsible for converting
 * information between its internal structures and the external (library)
 * structures.
 */
export interface StorageCell {
  /**
   * Free all resources used by this cell. This should not affect the stored
   * content.
   *
   * @return
   */
  destroy(): Promise<void>;

  /**
   * Check if the cell can support new keys. If a cell has a fixed key space,
   * then all add-operations will fail as no new keys can be added. All
   * remove-operations and update-operations should still work.
   *
   * @return
   */
  hasFixedKeySpace(): boolean;

  /**
   * Add a group of segments. Will return a promise that resolves with a list
   * of keys for each segment. If one segment fails to be added, all segments
   * should fail to be added.
   *
   * @param segments
   * @return
   */
  addSegments(segments: SegmentDataDB[]): Promise<number[]>;

  /**
   * Remove a group of segments using their keys to identify them. If a key
   * is not found, then that removal should be considered successful.
   *
   * @param keys
   * @param onRemove A callback for when a segment is removed
   *                                    from the cell. The key of the segment
   *                                    will be passed to the callback.
   * @return
   */
  removeSegments(
    keys: number[],
    onRemove: (key: number) => void,
  ): Promise<void>;

  /**
   * Get a group of segments using their keys to identify them. If any key is
   * not found, the promise chain will be rejected.
   *
   * @param keys
   * @return
   */
  getSegments(keys: number[]): Promise<SegmentDataDB[]>;

  /**
   * Add a group of manifests. Will return a promise that resolves with a list
   * of keys for each manifest. If one manifest fails to be added, all manifests
   * should fail to be added.
   *
   * @param manifests
   * @return keys
   */
  addManifests(manifests: ManifestDB[]): Promise<number[]>;

  /**
   * Updates the given manifest, stored at the given key.
   *
   * @param key
   * @param manifest
   * @return
   */
  updateManifest(key: number, manifest: ManifestDB): Promise<void>;

  /**
   * Replace the expiration time of the manifest stored under |key| with
   * |newExpiration|. If no manifest is found under |key| then this should
   * act as a no-op.
   *
   * @param key
   * @param expiration
   * @return
   */
  updateManifestExpiration(key: number, expiration: number): Promise<void>;

  /**
   * Remove a group of manifests using their keys to identify them. If a key
   * is not found, then that removal should be considered successful.
   *
   * @param keys
   * @param onRemove A callback for when a manifest is
   *                                    removed from the cell. The key of the
   *                                    manifest will be passed to the callback.
   * @return
   */
  removeManifests(
    keys: number[],
    onRemove: (key: number) => void,
  ): Promise<void>;

  /**
   * Get a group of manifests using their keys to identify them. If any key is
   * not found, the promise chain will be rejected.
   *
   * @param keys
   * @return
   */
  getManifests(keys: number[]): Promise<ManifestDB[]>;

  /**
   * Get all manifests stored in this cell. Since manifests are small compared
   * to the asset they describe, it is assumed that it is feasible to have them
   * all in main memory at one time.
   *
   * @return
   */
  getAllManifests(): Promise<Map<number, ManifestDB>>;
}

/**
 * Similar to storage cells (shaka.extern.StorageCell), an EmeSessionStorageCell
 * stores data persistently.  This only stores the license's session info, not
 * the license itself.  The license itself is stored using EME.
 */
export interface EmeSessionStorageCell {
  /**
   * Free all resources used by this cell. This won't affect the stored content.
   * @return
   */
  destroy(): Promise<void>;

  /**
   * Gets the currently stored sessions.
   * @return
   */
  getAll(): Promise<EmeSessionDB[]>;

  /**
   * Adds the given sessions to the store.
   * @param sessions
   * @return
   */
  add(sessions: EmeSessionDB[]): Promise<void>;

  /**
   * Removes the given session IDs from the store.
   * @param sessionIds
   * @return
   */
  remove(sessionIds: string[]): Promise<void>;
}

/**
 * Storage mechanisms are one of two exported storage APIs. Storage mechanisms
 * are groups of storage cells (shaka.extern.StorageCell). Storage mechanisms
 * are responsible for managing the life cycle of resources shared between
 * storage cells in the same block.
 *
 * For example, a storage mechanism may manage a single database connection
 * while each cell would manage different tables in the database via the same
 * connection.
 */
export interface StorageMechanism {
  /**
   * Initialize the storage mechanism for first use. This should only be called
   * once. Calling |init| multiple times has an undefined behaviour.
   *
   * @return
   */
  init(): Promise<void>;

  /**
   * Free all resources used by the storage mechanism and its cells. This should
   * not affect the stored content.
   *
   * @return
   */
  destroy(): Promise<void>;

  /**
   * Get a map of all the cells managed by the storage mechanism. Editing the
   * map should have no effect on the storage mechanism. The map key is the
   * cell's address in the mechanism and should be consistent between calls to
   * |getCells|.
   *
   * @return
   */
  getCells(): Map<string, StorageCell>;

  /**
   * Get the current EME session storage cell.
   * @return
   */
  getEmeSessionCell(): EmeSessionStorageCell;

  /**
   * Erase all content from storage and leave storage in an empty state. Erase
   * may be called with or without |init|.  This allows for storage to be wiped
   * in case of a version mismatch.
   *
   * After calling |erase|, the mechanism will be in an initialized state.
   *
   * @return
   */
  erase(): Promise<void>;
}
