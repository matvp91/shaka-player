/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { DrmInfo } from "./drm_info";

// Forward declarations for types that will be migrated later
// Resolves at Step 6.2 (media)
export type PresentationTimeline = unknown;
// Resolves at Step 6.1 (media)
// MIGRATION: Renamed from shaka.media.SegmentIndex to MediaSegmentIndex
// to avoid collision with shaka.extern.SegmentIndex defined in this file.
export type MediaSegmentIndex = unknown;
// Resolves at Step 6.1 (media)
export type SegmentReference = unknown;
// Resolves at Step 6.6 (media)
export type AccessibilityPurpose = unknown;
// Resolves at Step 1.8 (feature types)
export type StreamDB = unknown;

/**
 * <p>
 * A Manifest object describes a collection of streams (segmented audio, video,
 * or text data) that share a common timeline. We call the collection of
 * streams "the presentation" and their timeline "the presentation timeline".
 * A Manifest describes one of two types of presentations: live and
 * video-on-demand.
 * </p>
 *
 * <p>
 * A live presentation begins at some point in time and either continues
 * indefinitely or ends when the presentation stops broadcasting. For a live
 * presentation, wall-clock time maps onto the presentation timeline, and the
 * current wall-clock time maps to the live-edge (AKA "the current presentation
 * time"). In contrast, a video-on-demand presentation exists entirely
 * independent of wall-clock time.
 * </p>
 *
 * <p>
 * A variant is a combination of an audio and a video streams that can be played
 * together.
 * </p>
 *
 * <p>
 * A stream has the same logical content as another stream if the only
 * difference between the two is their quality. For example, an SD video stream
 * and an HD video stream that depict the same scene have the same logical
 * content; whereas an English audio stream and a French audio stream have
 * different logical contents. The player can automatically switch between
 * streams which have the same logical content to adapt to network conditions.
 * </p>
 */
export interface Manifest {
  /**
   * <i>Required.</i> <br>
   * The presentation timeline.
   */
  presentationTimeline: PresentationTimeline;
  /**
   * <i>Required.</i> <br>
   * The presentation's Variants. There must be at least one Variant.
   */
  variants: Variant[];
  /**
   * <i>Required.</i> <br>
   * The presentation's text streams.
   */
  textStreams: Stream[];
  /**
   * <i>Required.</i> <br>
   * The presentation's image streams
   */
  imageStreams: Stream[];
  /**
   * <i>Required.</i> <br>
   * The presentation's chapter streams
   */
  chapterStreams: Stream[];
  /**
   * <i>Defaults to [].</i> <br>
   * An array of EME sessions to load for offline playback.
   */
  offlineSessionIds: string[];
  /**
   * If true, we will append the media segments using sequence mode; that is to
   * say, ignoring any timestamps inside the media files.
   */
  sequenceMode: boolean;
  /**
   * If true, don't adjust the timestamp offset to account for manifest
   * segment durations being out of sync with segment durations. In other
   * words, assume that there are no gaps in the segments when appending
   * to the SourceBuffer, even if the manifest and segment times disagree.
   * Only applies when sequenceMode is <code>false</code>, and only for HLS
   * streams.
   * <i>Defaults to <code>false</code>.</i>
   */
  ignoreManifestTimestampsInSegmentsMode: boolean;
  /**
   * Indicates the type of the manifest. It can be <code>'HLS'</code> or
   * <code>'DASH'</code>.
   */
  type: string;
  /**
   * The service description for the manifest. Used to adapt playbackRate to
   * decrease latency.
   */
  serviceDescription: ServiceDescription | null;
  /**
   * The next url to play.
   */
  nextUrl: string | null;
  /**
   * Number of periods found in a manifest. For DASH, it represents number of
   * Period elements in a manifest. If streaming protocol does not implement
   * period-like structure, it should be set to 1.
   * <i>Defaults to <code>1</code>.</i>
   */
  periodCount: number;
  /**
   * The amount of gaps found in a manifest. For DASH, it represents number of
   * discontinuities found between periods. For HLS, it is a number of EXT-X-GAP
   * and GAP=YES occurrences.
   */
  gapCount: number;
  /**
   * If true, the manifest is Low Latency.
   */
  isLowLatency: boolean;
  /**
   * Indicate the startTime of the playback, when <code>startTime</code> is
   * <code>null</code>, playback will start at the default start time.
   * Note: It only overrides the load startTime when it is not defined.
   */
  startTime: number | null;
}

/**
 * Contains the streams from one DASH period.
 * For use in {@link shaka.util.PeriodCombiner}.
 */
export interface Period {
  /**
   * The Period ID.
   */
  id: string;
  /**
   * The audio streams from one Period.
   */
  audioStreams: Stream[];
  /**
   * The video streams from one Period.
   */
  videoStreams: Stream[];
  /**
   * The text streams from one Period.
   */
  textStreams: Stream[];
  /**
   * The image streams from one Period.
   */
  imageStreams: Stream[];
}

/**
 * Maximum and minimum latency and playback rate for a manifest. When max
 * latency is reached playbackrate is updated to maxPlaybackRate to decrease
 * latency. When min  latency is reached playbackrate is updated to
 * minPlaybackRate to increase  latency.
 * More information {@link https://dashif.org/docs/CR-Low-Latency-Live-r8.pdf here}.
 */
export interface ServiceDescription {
  /**
   * The target latency to aim for.
   */
  targetLatency: number | null;
  /**
   * Maximum latency in seconds.
   */
  maxLatency: number | null;
  /**
   * Maximum playback rate.
   */
  maxPlaybackRate: number | null;
  /**
   * Minimum latency in seconds.
   */
  minLatency: number | null;
  /**
   * Minimum playback rate.
   */
  minPlaybackRate: number | null;
}

/**
 * A Variant describes a combination of an audio and video streams which
 * could be played together. It's possible to have a video/audio only
 * variant.
 */
export interface Variant {
  /**
   * <i>Required.</i> <br>
   * A unique ID among all Variant objects within the same Manifest.
   */
  id: number;
  /**
   * <i>Defaults to '' (i.e., unknown).</i> <br>
   * The Variant's language, specified as a language code. <br>
   * See {@link https://tools.ietf.org/html/rfc5646} <br>
   * See {@link http://www.iso.org/iso/home/standards/language_codes.htm}
   */
  language: string;
  /**
   * <i>Defaults to 0.</i> <br>
   * 0 means the variant is enabled. The Player will set this value to
   * "(Date.now() / 1000) + config.streaming.maxDisabledTime" and once this
   * maxDisabledTime has passed Player will set the value to 0 in order to
   * reenable the variant.
   */
  disabledUntilTime: number;
  /**
   * <i>Defaults to false.</i> <br>
   * True indicates that the player should use this Variant over others if user
   * preferences cannot be met.  The player may still use another Variant to
   * meet user preferences.
   */
  primary: boolean;
  /**
   * The audio stream of the variant.
   */
  audio: Stream | null;
  /**
   * The video stream of the variant.
   */
  video: Stream | null;
  /**
   * The variant's required bandwidth in bits per second.
   */
  bandwidth: number;
  /**
   * <i>Defaults to true.</i><br>
   * Set by the Player to indicate whether the variant is allowed to be played
   * by the application.
   */
  allowedByApplication: boolean;
  /**
   * <i>Defaults to true.</i><br>
   * Set by the Player to indicate whether the variant is allowed to be played
   * by the key system.
   */
  allowedByKeySystem: boolean;
  /**
   * <i>Defaults to [].</i><br>
   * Set by StreamUtils to indicate the results from MediaCapabilities
   * decodingInfo.
   */
  decodingInfos: MediaCapabilitiesDecodingInfo[];
}

/**
 * Creates a SegmentIndex; returns a Promise that resolves after the
 * SegmentIndex has been created.
 */
export type CreateSegmentIndexFunction = () => Promise<void>;

/**
 * AES key and iv info from the manifest.
 */
// MIGRATION: Kept lowercase to match original source.
export interface aesKey {
  /**
   * The number of the bit key (eg: 128, 256).
   */
  bitsKey: number;
  /**
   * The block cipher mode of operation. Possible values: 'CTR', 'CBC' or 'GCM'.
   */
  blockCipherMode: string;
  /**
   * Web crypto key object of the AES key. If unset, the "fetchKey"
   * property should be provided.
   */
  cryptoKey?: CryptoKey;
  /**
   * A function that fetches the key.
   * Should be provided if the "cryptoKey" property is unset.
   * Should update this object in-place, to set "cryptoKey".
   */
  fetchKey?: FetchCryptoKeysFunction;
  /**
   * The IV in the manifest, if defined. For HLS see HLS RFC 8216 Section 5.2
   * for handling undefined IV.
   */
  iv?: Uint8Array;
  /**
   * The starting Media Sequence Number of the playlist, used when IV is
   * undefined.
   */
  firstMediaSequenceNumber: number;
}

/**
 * A function that fetches the crypto keys for AES-128.
 * Returns a promise that resolves when the keys have been fetched.
 */
export type FetchCryptoKeysFunction = () => Promise<void>;

/**
 * SegmentIndex minimal API.
 */
export interface SegmentIndex {
  /**
   * Get number of references.
   */
  getNumReferences(): number;

  /**
   * Finds the position of the segment for the given time, in seconds, relative
   * to the start of the presentation.  Returns the position of the segment
   * with the largest end time if more than one segment is known for the given
   * time.
   *
   * @param time
   * @return The position of the segment, or null if the position of
   *   the segment could not be determined.
   */
  find(time: number): number | null;

  /**
   * Gets the SegmentReference for the segment at the given position.
   *
   * @param position The position of the segment as returned by find().
   * @return The SegmentReference, or null if
   *   no such SegmentReference exists.
   */
  get(position: number): SegmentReference | null;

  /**
   * Gets number of already evicted segments.
   */
  getNumEvicted(): number;
}

/**
 * A Stream object describes a single stream (segmented media data).
 */
export interface Stream {
  /**
   * <i>Required.</i> <br>
   * A unique ID among all Stream objects within the same Manifest.
   */
  id: number;
  /**
   * <i>Optional.</i> <br>
   * The original ID, if any, that appeared in the manifest.  For example, in
   * DASH, this is the "id" attribute of the Representation element.  In HLS,
   * this is the "NAME" attribute.
   */
  originalId: string | null;
  /**
   * <i>Optional.</i> <br>
   * The ID of the stream's parent element. In DASH, this will be a unique
   * ID that represents the representation's parent adaptation element
   */
  groupId: string | null;
  /**
   * <i>Required.</i> <br>
   * Creates the Stream's segmentIndex (asynchronously).
   */
  createSegmentIndex: CreateSegmentIndexFunction;
  /**
   * <i>Optional.</i> <br>
   * Closes the Stream's segmentIndex.
   */
  closeSegmentIndex?: () => void;
  /**
   * <i>Required.</i> <br>
   * May be null until createSegmentIndex() is complete.
   */
  // MIGRATION: Used MediaSegmentIndex for shaka.media.SegmentIndex
  segmentIndex: MediaSegmentIndex;
  /**
   * <i>Required.</i> <br>
   * The Stream's MIME type, e.g., 'audio/mp4', 'video/webm', or 'text/vtt'.
   * In the case of a stream that adapts between different periods with
   * different MIME types, this represents only the first period.
   */
  mimeType: string;
  /**
   * <i>Defaults to '' (i.e., unknown / not needed).</i> <br>
   * The Stream's codecs, e.g., 'avc1.4d4015' or 'vp9', which must be
   * compatible with the Stream's MIME type. <br>
   * In the case of a stream that adapts between different periods with
   * different codecs, this represents only the first period.
   * See {@link https://tools.ietf.org/html/rfc6381}
   */
  codecs: string;
  /**
   * <i>Defaults to '' (i.e., unknown / not needed).</i> <br>
   * The Stream's supplemental codecs, e.g., 'dvhe'.
   */
  supplementalCodecs: string;
  /**
   * <i>Video streams only.</i> <br>
   * The Stream's framerate in frames per second
   */
  frameRate?: number;
  /**
   * <i>Video streams only.</i> <br>
   * The Stream's pixel aspect ratio
   */
  pixelAspectRatio?: string;
  /**
   * <i>Video streams only.</i> <br>
   * The Stream's HDR info
   */
  hdr?: string;
  /**
   * <i>Video streams only.</i> <br>
   * The Stream's color gamut info
   */
  colorGamut?: string;
  /**
   * <i>Video streams only.</i> <br>
   * The Stream's video layout info.
   */
  videoLayout?: string;
  /**
   * <i>Audio and video streams only.</i> <br>
   * The stream's required bandwidth in bits per second.
   */
  bandwidth?: number;
  /**
   * <i>Video streams only.</i> <br>
   * The stream's width in pixels.
   */
  width?: number;
  /**
   * <i>Video streams only.</i> <br>
   * The stream's height in pixels.
   */
  height?: number;
  /**
   * <i>Text streams only.</i> <br>
   * The kind of text stream.  For example, 'caption' or 'subtitle'.
   * @see https://bit.ly/TextKind
   */
  kind?: string;
  /**
   * <i>Defaults to false.</i><br>
   * True if the stream is encrypted.
   * Note: DRM encryption only, so AES encryption is not taken into account.
   */
  encrypted: boolean;
  /**
   * <i>Defaults to [] (i.e., no DRM).</i> <br>
   * An array of DrmInfo objects which describe DRM schemes are compatible with
   * the content.
   */
  drmInfos: DrmInfo[];
  /**
   * <i>Defaults to empty (i.e., unencrypted or key ID unknown).</i> <br>
   * The stream's key IDs as lowercase hex strings. These key IDs identify the
   * encryption keys that the browser (key system) can use to decrypt the
   * stream.
   */
  keyIds: Set<string>;
  /**
   * The Stream's language, specified as a language code. <br>
   * Audio stream's language must be identical to the language of the containing
   * Variant.
   */
  language: string;
  /**
   * <i>Optional.</i> <br>
   * The original language, if any, that appeared in the manifest.
   */
  originalLanguage: string | null;
  /**
   * The Stream's label, unique text that should describe the audio/text track.
   */
  label: string | null;
  /**
   * <i>Required.</i> <br>
   * Content type (e.g. 'video', 'audio' or 'text', 'image')
   */
  type: string;
  /**
   * <i>Defaults to false.</i> <br>
   * True indicates that the player should use this Stream over others if user
   * preferences cannot be met.  The player may still use another Variant to
   * meet user preferences.
   */
  primary: boolean;
  /**
   * <i>Video streams only.</i> <br>
   * An alternate video stream to use for trick mode playback.
   */
  trickModeVideo: Stream | null;
  /**
   * <i>Video streams only.</i> <br>
   * Dependency stream to use for enhance the quality of the base stream.
   */
  dependencyStream: Stream | null;
  /**
   * <i>Defaults to empty.</i><br>
   * Array of registered emsg box scheme_id_uri that should result in
   * Player events.
   */
  emsgSchemeIdUris: string[] | null;
  /**
   * The roles of the stream as they appear on the manifest,
   * e.g. 'main', 'caption', or 'commentary'.
   */
  roles: string[];
  /**
   * The DASH accessibility descriptor, if one was provided for this stream.
   */
  accessibilityPurpose: AccessibilityPurpose | null;
  /**
   * <i>Defaults to false.</i> <br>
   * Whether the stream set was forced
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
   * <i>Defaults to false.</i> <br>
   * Whether the stream set has spatial audio
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
   * <i>Image streams only.</i> <br>
   * The value is a grid-item-dimension consisting of two positive decimal
   * integers in the format: column-x-row ('4x3'). It describes the arrangement
   * of Images in a Grid. The minimum valid LAYOUT is '1x1'.
   */
  tilesLayout?: string;
  /**
   * The streams in all periods which match the stream. Used for Dash.
   */
  matchedStreams?: Stream[] | StreamDB[];
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
   * A set of full MIME types (e.g. MIME types plus codecs information), that
   * represents the types used in each period of the original manifest.
   * Meant for being used by compatibility checking, such as with
   * MediaSource.isTypeSupported.
   */
  fullMimeTypes: Set<string>;
  /**
   * Indicate if the audio of this stream is muxed in the video of other stream.
   */
  isAudioMuxedInVideo: boolean;
  /**
   * <i>Optional.</i> <br>
   * Indicate the original ID of the base stream, if any, that appeared in the
   * manifest. Only populated when the stream is included within another stream
   * using dependencyStream.
   */
  baseOriginalId: string | null;
}

/**
 */
export interface ThumbnailSprite {
  /**
   * The thumbnail height in px.
   */
  height: number;
  /**
   * The thumbnail left position in px.
   */
  positionX: number;
  /**
   * The thumbnail top position in px.
   */
  positionY: number;
  /**
   * The thumbnail width in px.
   */
  width: number;
}
