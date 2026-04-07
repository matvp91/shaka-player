/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Forward declarations for types not yet converted.
// MIGRATION: renamed from shaka.util.Error to ShakaError to avoid
// collision with global Error class
export type ShakaError = unknown;
export type Resolution = unknown;
export type RetryParameters = unknown;
export type DrmInfo = unknown;
export type CrossBoundaryStrategy = unknown;
export type CodecSwitchingStrategy = unknown;
export type StoredContent = unknown;
export type PositionArea = unknown;
export type RepeatMode = unknown;
export type SegmentReference = unknown;
export type ModifyCueCallback = unknown;
export type AbrManagerFactory = unknown;
export type TextDisplayerFactory = unknown;
export type AccessibilityPurpose = unknown;

export namespace xml {
  export interface Node {
    tagName: string;
    attributes: Record<string, string>;
    children: (xml.Node | string)[];
    parent: xml.Node | null;
  }
}

/**
 *
 */
export interface TrackChoice {
  /** The timestamp the choice was made, in seconds since 1970 (i.e. <code>Date.now() / 1000</code>). */
  timestamp: number;
  /** The id of the track that was chosen. */
  id: number;
  /** The type of track chosen (<code>'variant'</code> or <code>'text'</code>). */
  type: string;
  /** <code>true</code> if the choice was made by AbrManager for adaptation; <code>false</code> if it was made by the application through <code>selectTrack</code>. */
  fromAdaptation: boolean;
  /** The bandwidth of the chosen track (<code>null</code> for text). */
  bandwidth: number | null;
}

/**
 *
 */
export interface StateChange {
  /** The timestamp the state was entered, in seconds since 1970 (i.e. <code>Date.now() / 1000</code>). */
  timestamp: number;
  /** The state the player entered.  This could be <code>'buffering'</code>, <code>'playing'</code>, <code>'paused'</code>, or <code>'ended'</code>. */
  state: string;
  /** The number of seconds the player was in this state.  If this is the last entry in the list, the player is still in this state, so the duration will continue to increase. */
  duration: number;
}

/**
 *
 * Contains statistics and information about the current state of the player.
 * This is meant for applications that want to log quality-of-experience (QoE)
 * or other stats.  These values will reset when <code>load()</code> is called
 * again.
 *
 */
export interface Stats {
  /** The width of the current video track. If nothing is loaded or the content is audio-only, NaN. */
  width: number;
  /** The height of the current video track. If nothing is loaded or the content is audio-only, NaN. */
  height: number;
  /** The bandwidth required for the current streams (total, in bit/sec). It takes into account the playbackrate. If nothing is loaded, NaN. */
  streamBandwidth: number;
  /** The current codec of the current streams. */
  currentCodecs: string;
  /** The total number of frames decoded by the Player. If not reported by the browser, NaN. */
  decodedFrames: number;
  /** The total number of frames dropped by the Player. If not reported by the browser, NaN. */
  droppedFrames: number;
  /** The total number of corrupted frames dropped by the browser. If not reported by the browser, NaN. */
  corruptedFrames: number;
  /** The current estimated network bandwidth (in bit/sec). If no estimate available, NaN. */
  estimatedBandwidth: number;
  /** The total number of playback gaps jumped by the GapJumpingController. If nothing is loaded, NaN. */
  gapsJumped: number;
  /** The total number of playback stalls detected by the StallDetector. If nothing is loaded, NaN. */
  stallsDetected: number;
  /** This is the greatest completion percent that the user has experienced in playback. Also known as the "high water mark". If nothing is loaded, or the stream is live (and therefore indefinite), NaN. */
  completionPercent: number;
  /** This is the number of seconds it took for the video element to have enough data to begin playback.  This is measured from the time load() is called to the time the <code>'loadeddata'</code> event is fired by the media element. If nothing is loaded, NaN. */
  loadLatency: number;
  /** The amount of time it took to download and parse the manifest. If nothing is loaded, NaN. */
  manifestTimeSeconds: number;
  /** The amount of time it took to download the first drm key, and load that key into the drm system. If nothing is loaded or DRM is not in use, NaN. */
  drmTimeSeconds: number;
  /** The total time spent in a playing state in seconds. If nothing is loaded, NaN. */
  playTime: number;
  /** The total time spent in a paused state in seconds. If nothing is loaded, NaN. */
  pauseTime: number;
  /** The total time spent in a buffering state in seconds. If nothing is loaded, NaN. */
  bufferingTime: number;
  /** The time spent on license requests during this session in seconds. If DRM is not in use, NaN. */
  licenseTime: number;
  /** The time between the capturing of a frame and the end user having it displayed on their screen. If nothing is loaded or the content is VOD, NaN. */
  liveLatency: number;
  /** The presentation's max segment duration in seconds. If nothing is loaded, NaN. */
  maxSegmentDuration: number;
  /** Size of the manifest payload. For DASH it will match the latest downloaded manifest. For HLS, it will match the lastly downloaded playlist. If nothing is loaded or in src= mode, NaN. */
  manifestSizeBytes: number;
  /** The bytes downloaded during the playback. If nothing is loaded, NaN. */
  bytesDownloaded: number;
  /** The amount of non fatal errors that occurred.  If nothing is loaded, NaN. */
  nonFatalErrorCount: number;
  /** The amount of periods occurred in the manifest. For DASH it represents number of Period elements in a manifest. For HLS it is always 1. In src= mode or if nothing is loaded, NaN. */
  manifestPeriodCount: number;
  /** The amount of gaps found in a manifest. For DASH, it represents number of discontinuities found between periods. For HLS, it is a number of EXT-X-GAP and GAP=YES occurrences. If in src= mode or nothing is loaded, NaN. */
  manifestGapCount: number;
  /** A history of the stream changes. */
  switchHistory: TrackChoice[];
  /** A history of the state changes. */
  stateHistory: StateChange[];
}

/**
 *
 * Contains the times of a range of buffered content.
 *
 */
export interface BufferedRange {
  /** The start time of the range, in seconds. */
  start: number;
  /** The end time of the range, in seconds. */
  end: number;
}

/**
 *
 * Contains information about the current buffered ranges.
 *
 */
export interface BufferedInfo {
  /** The combined audio/video buffered ranges, reported by <code>video.buffered</code>. */
  total: BufferedRange[];
  /** The buffered ranges for audio content. */
  audio: BufferedRange[];
  /** The buffered ranges for video content. */
  video: BufferedRange[];
  /** The buffered ranges for text content. */
  text: BufferedRange[];
}

/**
 *
 * An object describing a media track.  This object should be treated as
 * read-only as changing any values does not have any effect.  This is the
 * public view of an audio/video paring (variant type).
 *
 */
export interface Track {
  /** The unique ID of the track. */
  id: number;
  /** If true, this is the track being streamed (another track may be visible/audible in the buffer). */
  active: boolean;
  /** The type of track, either <code>'variant'</code> or <code>'text'</code> or <code>'image'</code> or <code>'chapter'</code>. */
  type: string;
  /** The bandwidth required to play the track, in bits/sec. */
  bandwidth: number;
  /** The language of the track, or <code>'und'</code> if not given.  This value is normalized as follows - language part is always lowercase and translated to ISO-639-1 when possible, locale part is always uppercase, i.e. <code>'en-US'</code>. */
  language: string;
  /** The track label, which is unique text that should describe the track. */
  label: string | null;
  /** The video track label, which is unique text that should describe the video track. */
  videoLabel: string | null;
  /** (only for text tracks) The kind of text track, either <code>'caption'</code> or <code>'subtitle'</code>. */
  kind: string | null;
  /** The video width provided in the manifest, if present. */
  width: number | null;
  /** The video height provided in the manifest, if present. */
  height: number | null;
  /** The video framerate provided in the manifest, if present. */
  frameRate: number | null;
  /** The video pixel aspect ratio provided in the manifest, if present. */
  pixelAspectRatio: string | null;
  /** The video HDR provided in the manifest, if present. */
  hdr: string | null;
  /** The video color gamut provided in the manifest, if present. */
  colorGamut: string | null;
  /** The video layout provided in the manifest, if present. */
  videoLayout: string | null;
  /** The MIME type of the content provided in the manifest. */
  mimeType: string | null;
  /** The audio MIME type of the content provided in the manifest. */
  audioMimeType: string | null;
  /** The video MIME type of the content provided in the manifest. */
  videoMimeType: string | null;
  /** The audio/video codecs string provided in the manifest, if present. */
  codecs: string | null;
  /** The audio codecs string provided in the manifest, if present. */
  audioCodec: string | null;
  /** The video codecs string provided in the manifest, if present. */
  videoCodec: string | null;
  /** True indicates that this in the primary language for the content. This flag is based on signals from the manifest. This can be a useful hint about which language should be the default, and indicates which track Shaka will use when the user's language preference cannot be satisfied. */
  primary: boolean;
  /** The roles of the track, e.g. <code>'main'</code>, <code>'caption'</code>, or <code>'commentary'</code>. */
  roles: string[];
  /** The roles of the audio in the track, e.g. <code>'main'</code> or <code>'commentary'</code>. Will be null for text tracks or variant tracks without audio. */
  audioRoles: string[];
  /** The roles of the video in the track, e.g. <code>'main'</code> or <code>'sign'</code>. Will be null for text tracks or variant tracks without video. } accessibilityPurpose The DASH accessibility descriptor, if one was provided for this track. For text tracks, this describes the text; otherwise, this is for the audio. */
  videoRoles: string[];
  /** True indicates that this in the forced text language for the content. This flag is based on signals from the manifest. */
  forced: boolean;
  /** (only for variant tracks) The video stream id. */
  videoId: number | null;
  /** (only for variant tracks) The audio stream id. */
  audioId: number | null;
  /** (only for variant tracks) The ID of the stream's parent element. In DASH, this will be a unique ID that represents the representation's parent adaptation element */
  audioGroupId: string | null;
  /** The count of the audio track channels. */
  channelsCount: number | null;
  /** Specifies the maximum sampling rate of the content. */
  audioSamplingRate: number | null;
  /** The value is a grid-item-dimension consisting of two positive decimal integers in the format: column-x-row ('4x3'). It describes the arrangement of Images in a Grid. The minimum valid LAYOUT is '1x1'. */
  tilesLayout: string | null;
  /** True indicates that the content has spatial audio. This flag is based on signals from the manifest. */
  spatialAudio: boolean;
  /** (only for variant tracks) The audio stream's bandwidth if known. */
  audioBandwidth: number | null;
  /** (only for variant tracks) The video stream's bandwidth if known. */
  videoBandwidth: number | null;
  /** (variant tracks only) The original ID of the video part of the track, if any, as it appeared in the original manifest. */
  originalVideoId: string | null;
  /** (variant tracks only) The original ID of the audio part of the track, if any, as it appeared in the original manifest. */
  originalAudioId: string | null;
  /** (text tracks only) The original ID of the text track, if any, as it appeared in the original manifest. */
  originalTextId: string | null;
  /** (image tracks only) The original ID of the image track, if any, as it appeared in the original manifest. */
  originalImageId: string | null;
  /** The original language of the track, if any, as it appeared in the original manifest.  This is the exact value provided in the manifest; for normalized value use <code>language</code> property. */
  originalLanguage: string | null;
}

/**
 *
 * An object describing a audio track.  This object should be treated as
 * read-only as changing any values does not have any effect.
 *
 */
export interface AudioTrack {
  /** If true, this is the track being streamed (another track may be visible/audible in the buffer). */
  active: boolean;
  /** The language of the track, or <code>'und'</code> if not given.  This value is normalized as follows - language part is always lowercase and translated to ISO-639-1 when possible, locale part is always uppercase, i.e. <code>'en-US'</code>. */
  language: string;
  /** The track label, which is unique text that should describe the track. */
  label: string | null;
  /** The MIME type of the content provided in the manifest. */
  mimeType: string | null;
  /** The audio codecs string provided in the manifest, if present. */
  codecs: string | null;
  /** True indicates that this in the primary language for the content. This flag is based on signals from the manifest. This can be a useful hint about which language should be the default, and indicates which track Shaka will use when the user's language preference cannot be satisfied. */
  primary: boolean;
  /** The roles of the track, e.g. <code>'main'</code>, <code>'caption'</code>, or <code>'commentary'</code>. } accessibilityPurpose The DASH accessibility descriptor, if one was provided for this track. */
  roles: string[];
  /** The count of the audio track channels. */
  channelsCount: number | null;
  /** Specifies the maximum sampling rate of the content. */
  audioSamplingRate: number | null;
  /** True indicates that the content has spatial audio. This flag is based on signals from the manifest. */
  spatialAudio: boolean;
  /** The original language of the track, if any, as it appeared in the original manifest.  This is the exact value provided in the manifest; for normalized value use <code>language</code> property. */
  originalLanguage: string | null;
}

/**
 *
 * An object describing a text track.  This object should be treated as
 * read-only as changing any values does not have any effect.
 *
 */
export interface TextTrack {
  /** The unique ID of the track. */
  id: number;
  /** If true, this is the track being streamed (another track may be visible in the buffer). */
  active: boolean;
  /** The type of track, either <code>'variant'</code> or <code>'text'</code> or <code>'image'</code> or <code>'chapter'</code>. */
  type: string;
  /** The bandwidth required to play the track, in bits/sec. */
  bandwidth: number;
  /** The language of the track, or <code>'und'</code> if not given.  This value is normalized as follows - language part is always lowercase and translated to ISO-639-1 when possible, locale part is always uppercase, i.e. <code>'en-US'</code>. */
  language: string;
  /** The track label, which is unique text that should describe the track. */
  label: string | null;
  /** The kind of text track, either <code>'caption'</code> or <code>'subtitle'</code>. */
  kind: string | null;
  /** The MIME type of the content provided in the manifest. */
  mimeType: string | null;
  /** The codecs string provided in the manifest, if present. */
  codecs: string | null;
  /** True indicates that this in the primary language for the content. This flag is based on signals from the manifest. This can be a useful hint about which language should be the default, and indicates which track Shaka will use when the user's language preference cannot be satisfied. */
  primary: boolean;
  /** The roles of the track, e.g. <code>'main'</code>, <code>'caption'</code>, or <code>'commentary'</code>. } accessibilityPurpose The DASH accessibility descriptor, if one was provided for this track. */
  roles: string[];
  /** True indicates that this in the forced text language for the content. This flag is based on signals from the manifest. */
  forced: boolean;
  /** The original ID of the text track, if any, as it appeared in the original manifest. */
  originalTextId: string | null;
  /** The original language of the track, if any, as it appeared in the original manifest.  This is the exact value provided in the manifest; for normalized value use <code>language</code> property. */
  originalLanguage: string | null;
}

/**
 *
 * An object describing a video track.  This object should be treated as
 * read-only as changing any values does not have any effect.
 *
 */
export interface VideoTrack {
  /** If true, this is the track being streamed (another track may be visible/audible in the buffer). */
  active: boolean;
  /** The bandwidth required to play the track, in bits/sec. */
  bandwidth: number;
  /** The video width provided in the manifest, if present. */
  width: number | null;
  /** The video height provided in the manifest, if present. */
  height: number | null;
  /** The video framerate provided in the manifest, if present. */
  frameRate: number | null;
  /** The video pixel aspect ratio provided in the manifest, if present. */
  pixelAspectRatio: string | null;
  /** The video HDR provided in the manifest, if present. */
  hdr: string | null;
  /** The video color gamut provided in the manifest, if present. */
  colorGamut: string | null;
  /** The video layout provided in the manifest, if present. */
  videoLayout: string | null;
  /** The video MIME type of the content provided in the manifest. */
  mimeType: string | null;
  /** The video codecs string provided in the manifest, if present. */
  codecs: string | null;
  /** The roles of the track, e.g. <code>'main'</code>, <code>'sign'</code>. */
  roles: string[];
  /** The track label, which is unique text that should describe the track. */
  label: string | null;
}

/**
 *
 * An object describing a image track.  This object should be treated as
 * read-only as changing any values does not have any effect.
 *
 */
export interface ImageTrack {
  /** The unique ID of the track. */
  id: number;
  /** The type of track, either <code>'variant'</code> or <code>'text'</code> or <code>'image'</code> or <code>'chapter'</code>. */
  type: string;
  /** The bandwidth required to play the track, in bits/sec. */
  bandwidth: number;
  /** The width provided in the manifest, if present. */
  width: number | null;
  /** The height provided in the manifest, if present. */
  height: number | null;
  /** The MIME type of the content provided in the manifest. */
  mimeType: string | null;
  /** The image codecs string provided in the manifest, if present. */
  codecs: string | null;
  /** The value is a grid-item-dimension consisting of two positive decimal integers in the format: column-x-row ('4x3'). It describes the arrangement of Images in a Grid. The minimum valid LAYOUT is '1x1'. */
  tilesLayout: string | null;
  /** The original ID of the image track, if any, as it appeared in the original manifest. */
  originalImageId: string | null;
}

/**
 *
 * An object describing a chapter track.  This object should be treated as
 * read-only as changing any values does not have any effect.
 *
 */
export interface ChapterTrack {
  /** The unique ID of the track. */
  id: number;
  /** The type of track, either <code>'variant'</code> or <code>'text'</code> or <code>'image'</code> or <code>'chapter'</code>. */
  type: string;
  /** The bandwidth required to play the track, in bits/sec. */
  bandwidth: number;
  /** The language of the track, or <code>'und'</code> if not given.  This value is normalized as follows - language part is always lowercase and translated to ISO-639-1 when possible, locale part is always uppercase, i.e. <code>'en-US'</code>. */
  language: string;
}

/**
 *
 */
export type TrackList = Track[];

/**
 *
 * An object describing application restrictions on what tracks can play.  All
 * restrictions must be fulfilled for a track to be playable/selectable.
 * The restrictions system behaves somewhat differently at the ABR level and the
 * player level, so please refer to the documentation for those specific
 * settings.
 *
 */
export interface Restrictions {
  /** The minimum width of a video track, in pixels.  Defaults to <code>0</code>. */
  minWidth: number;
  /** The maximum width of a video track, in pixels.  Defaults to <code>Infinity</code>. */
  maxWidth: number;
  /** The minimum height of a video track, in pixels.  Defaults to <code>0</code>. */
  minHeight: number;
  /** The maximum height of a video track, in pixels.  Defaults to <code>Infinity</code>. */
  maxHeight: number;
  /** The minimum number of total pixels in a video track (i.e. <code>width * height</code>).  Defaults to <code>0</code>. */
  minPixels: number;
  /** The maximum number of total pixels in a video track (i.e. <code>width * height</code>).  Defaults to <code>Infinity</code>. */
  maxPixels: number;
  /** The minimum framerate of a variant track.  Defaults to <code>0</code>. */
  minFrameRate: number;
  /** The maximum framerate of a variant track.  Defaults to <code>Infinity</code>. */
  maxFrameRate: number;
  /** The minimum bandwidth of a variant track, in bit/sec.  Defaults to <code>0</code>. */
  minBandwidth: number;
  /** The maximum bandwidth of a variant track, in bit/sec.  Defaults to <code>Infinity</code>. */
  maxBandwidth: number;
  /** The minimum channels count of a variant track.  Defaults to <code>0</code>. */
  minChannelsCount: number;
  /** The maximum channels count of a variant track.  Defaults to <code>Infinity</code>. */
  maxChannelsCount: number;
}

/**
 *
 */
export interface DrmSupportType {
  /** Whether this key system supports persistent state. */
  persistentState: boolean;
  /** An array of encryption schemes that are reported to work, through either EME or MCap APIs. An empty array indicates that encryptionScheme queries are not supported. This should not happen if our polyfills are installed. */
  encryptionSchemes: (string | null)[];
  /** An array of video robustness levels that are reported to work. An empty array indicates that none were tested. Not all key systems have a list of known robustness levels built into probeSupport(). */
  videoRobustnessLevels: string[];
  /** An array of audio robustness levels that are reported to work. An empty array indicates that none were tested. Not all key systems have a list of known robustness levels built into probeSupport(). */
  audioRobustnessLevels: string[];
  /** An array of min HDCP levels that are reported to work. An empty array indicates that none were tested. Not all key systems have support to check min HDCP levels. */
  minHdcpVersions: string[];
}

/**
 *
 * An object detailing browser support for various features.
 *
 */
export interface SupportType {
  /** A map of supported manifest types. The keys are manifest MIME types and file extensions. */
  manifest: Record<string, boolean>;
  /** A map of supported media types. The keys are media MIME types. */
  media: Record<string, boolean>;
  /** A map of supported key systems. The keys are the key system names.  The value is <code>null</code> if it is not supported.  Key systems not probed will not be in this dictionary. */
  drm: Record<string, DrmSupportType | null>;
  /** The maximum detected hardware resolution, which may have height==width==Infinity for devices without a maximum resolution or without a way to detect the maximum. */
  hardwareResolution: Resolution;
}

/**
 *
 * ID3 metadata in format defined by
 * https://id3.org/id3v2.3.0#Declared_ID3v2_frames
 * The content of the field.
 *
 */
export interface ID3Metadata {
  cueTime: number | null;
  data: Uint8Array;
  frames: MetadataFrame[];
  dts: number | null;
  pts: number | null;
}

/**
 * metadata raw frame.
 */
export interface MetadataRawFrame {
  type: string;
  size: number;
  data: Uint8Array;
}

/**
 * metadata frame parsed.
 */
export interface MetadataFrame {
  key: string;
  data: ArrayBuffer | string | number;
  description: string;
  mimeType: string | null;
  pictureType: number | null;
}

/**
 * Represents the state of the current variant and text.
 */
export interface PlaybackInfo {
  video: PlaybackStreamInfo | null;
  audio: PlaybackStreamInfo | null;
  text: PlaybackStreamInfo | null;
}

/**
 * Represents the state of the given stream.
 */
export interface PlaybackStreamInfo {
  codecs: string;
  mimeType: string;
  bandwidth: number;
  width: number | null;
  height: number | null;
}

/**
 *
 */
export interface HLSMetadata {
  type: string;
  startTime: number;
  endTime: number | null;
  values: MetadataFrame[];
}

/**
 *
 * Contains information about a region of the timeline that will cause an event
 * to be raised when the playhead enters or exits it.  In DASH this is the
 * EventStream element.
 *
 */
export interface TimelineRegionInfo {
  /** Identifies the message scheme. */
  schemeIdUri: string;
  /** Specifies the value for the region. */
  value: string;
  /** The presentation time (in seconds) that the region should start. */
  startTime: number;
  /** The presentation time (in seconds) that the region should end. */
  endTime: number;
  /** Specifies an identifier for this instance of the region. */
  id: string;
  /** Provides the timescale, in ticks per second. */
  timescale: number;
  /** The XML element that defines the Event. */
  eventNode: xml.Node | null;
}

/**
 *
 * Contains information about a region of the timeline that will cause an event
 * to be raised when the playhead enters or exits it.
 *
 */
export interface EmsgTimelineRegionInfo {
  /** Identifies the metadata type. */
  schemeIdUri: string;
  /** The presentation time (in seconds) that the region should start. */
  startTime: number;
  /** The presentation time (in seconds) that the region should end. */
  endTime: number;
  /** Specifies an identifier for this instance of the region. */
  id: string;
  /** Specifies the EMSG info. */
  emsg: EmsgInfo;
}

/**
 *
 * Contains information about a region of the timeline that will cause an event
 * to be raised when the playhead enters or exits it.
 *
 */
export interface MetadataTimelineRegionInfo {
  /** Identifies the metadata type. */
  schemeIdUri: string;
  /** The presentation time (in seconds) that the region should start. */
  startTime: number;
  /** The presentation time (in seconds) that the region should end. */
  endTime: number;
  /** Specifies an identifier for this instance of the region. */
  id: string;
  /** Specifies the metadata frame. */
  payload: MetadataFrame;
}

/**
 *
 * Contains information about the quality of an audio or video media stream.
 *
 */
export interface MediaQualityInfo {
  /** Specifies the maximum sampling rate of the content. */
  audioSamplingRate: number | null;
  /** The bandwidth in bits per second. */
  bandwidth: number;
  /** The Stream's codecs, e.g., 'avc1.4d4015' or 'vp9', which must be compatible with the Stream's MIME type. */
  codecs: string;
  /** The type of content, which may be "video" or "audio". */
  contentType: string;
  /** The video frame rate. */
  frameRate: number | null;
  /** The video height in pixels. */
  height: number | null;
  /** The MIME type. */
  mimeType: string;
  /** The stream's label, when available. */
  label: string | null;
  /** The stream's role, when available. */
  roles: string[] | null;
  /** The stream's language, when available. */
  language: string | null;
  /** The number of audio channels, or null if unknown. */
  channelsCount: number | null;
  /** The pixel aspect ratio value; e.g. "1:1". */
  pixelAspectRatio: string | null;
  /** The video width in pixels. */
  width: number | null;
}

/**
 *
 * Contains information about an EMSG MP4 box.
 *
 */
export interface EmsgInfo {
  /** Identifies the message scheme. */
  schemeIdUri: string;
  /** Specifies the value for the event. */
  value: string;
  /** The time that the event starts (in presentation time). */
  startTime: number;
  /** The time that the event ends (in presentation time). */
  endTime: number;
  /** Provides the timescale, in ticks per second. */
  timescale: number;
  /** The offset that the event starts, relative to the start of the segment this is contained in (in units of timescale). */
  presentationTimeDelta: number;
  /** The duration of the event (in units of timescale). */
  eventDuration: number;
  /** A field identifying this instance of the message. */
  id: number;
  /** Body of the message. */
  messageData: Uint8Array;
}

/**
 *
 * Contains information about an PRFT MP4 box.
 *
 */
export interface ProducerReferenceTime {
  /** A UTC timestamp corresponding to decoding time in milliseconds. */
  wallClockTime: number;
  /** The derived start date of the program. */
  programStartDate: Date;
}

/**
 *
 */
export interface AdvancedDrmConfiguration {
  /** True if the application requires the key system to support distinctive identifiers.  Defaults to <code>false</code>. */
  distinctiveIdentifierRequired: boolean;
  /** True if the application requires the key system to support persistent state, e.g., for persistent license storage.  Defaults to <code>false</code>. */
  persistentStateRequired: boolean;
  /** A key-system-specific Array of strings that specifies a required security level for video. For multiple robustness levels, list items in priority order.  Defaults to <code>[]</code>, i.e., no specific robustness required. */
  videoRobustness: string[];
  /** A key-system-specific Array of strings that specifies a required security level for audio. For multiple robustness levels, list items in priority order.  Defaults to <code>[]</code>, i.e., no specific robustness required. */
  audioRobustness: string[];
  /** <i>An empty certificate (<code>byteLength==0</code>) will be treated as <code>null</code>.</i>  <i>A certificate will be requested from the license server if required.</i>  A key-system-specific server certificate used to encrypt license requests. Its use is optional and is meant as an optimization to avoid a round-trip to request a certificate.  Defaults to <code>null</code>. */
  serverCertificate: Uint8Array;
  /** If given, will make a request to the given URI to get the server certificate. This is ignored if <code>serverCertificate</code> is set.  Defaults to <code>''</code>. */
  serverCertificateUri: string;
  /** The server that handles an <code>'individualization-request'</code>. If the server isn't given, it will default to the license server.  Defaults to <code>''</code>. */
  individualizationServer: string;
  /** The MediaKey session type to create streaming licenses with.  This doesn't affect offline storage.  Defaults to <code>'temporary'</code>. */
  sessionType: string;
  /** The headers to use in the license request.  Defaults to <code>{}</code>. */
  headers: Record<string, string>;
}

/**
 *
 * DRM Session Metadata for an active session
 *
 */
export interface DrmSessionMetadata {
  /** Session id */
  sessionId: string;
  /** Session type */
  sessionType: string;
  /** Initialization data in the format indicated by initDataType. */
  initData: Uint8Array | null;
  /** A string to indicate what format initData is in. */
  initDataType: string;
}

/**
 *
 * DRM Session Metadata for saved persistent session
 *
 */
export interface PersistentSessionMetadata {
  /** Session id */
  sessionId: string;
  /** Initialization data in the format indicated by initDataType. */
  initData: Uint8Array | null;
  /** A string to indicate what format initData is in. */
  initDataType: string | null;
}

/**
 *
 */
export interface DrmConfiguration {
  /** Retry parameters for license requests. */
  retryParameters: RetryParameters;
  /** <i>Required for all but the clear key CDM.</i>  A dictionary which maps key system IDs to their license servers. For example, <code>{'com.widevine.alpha': 'https://example.com/drm'}</code>.  Defaults to <code>{}</code>. */
  servers: Record<string, string>;
  /** <i>Forces the use of the Clear Key CDM.</i> A map of key IDs (hex or base64) to keys (hex or base64).  Defaults to <code>{}</code>. */
  clearKeys: Record<string, string>;
  /** True to configure drm to delay sending a license request until a user actually starts playing content.  Defaults to <code>false</code>. */
  delayLicenseRequestUntilPlayed: boolean;
  /** True to configure drm to try playback with given persistent session ids before requesting a license. Also prevents the session removal at playback stop, as-to be able to re-use it later.  Defaults to <code>false</code>. */
  persistentSessionOnlinePlayback: boolean;
  /** Persistent sessions metadata to load before starting playback.  Defaults to <code>[]</code>. */
  persistentSessionsMetadata: PersistentSessionMetadata[];
  /** <i>Optional.</i>  A dictionary which maps key system IDs to advanced DRM configuration for those key systems.  Defaults to <code>[]</code>. */
  advanced: Record<string, AdvancedDrmConfiguration>;
  /** <i>Optional.</i> If given, this function is called with the init data from the manifest/media and should return the (possibly transformed) init data to pass to the browser. */
  initDataTransform: InitDataTransform | undefined;
  /** <i>Optional.</i> If set to <code>true</code>, prints logs containing the license exchange. This includes the init data, request, and response data, printed as base64 strings.  Don't use in production, for debugging only; has no affect in release builds as logging is removed.  Defaults to <code>false</code>. */
  logLicenseExchange: boolean;
  /** The frequency in seconds with which to check the expiration of a session.  Defaults to <code>1</code>. */
  updateExpirationTime: number;
  /** Specifies the priorities of available DRM key systems.  Defaults <code>['com.microsoft.playready']</code> on Xbox One and PlayStation 4, and <code>[]</code> for all other browsers. */
  preferredKeySystems: string[];
  /** A map of key system name to key system name.  Defaults to <code>{}</code>. */
  keySystemsMapping: Record<string, string>;
  /** When true parse DRM init data from pssh boxes in media and init segments and ignore 'encrypted' events. This is required when using in-band key rotation on Xbox One.  Defaults to <code>true</code> on Xbox One, and <code>false</code> for all other browsers. */
  parseInbandPsshEnabled: boolean;
  /** Indicates the minimum version of HDCP to start the playback of encrypted streams. <b>May be ignored if not supported by the device.</b>  Defaults to <code>''</code>, do not check the HDCP version. */
  minHdcpVersion: string;
  /** When true indicate that the player doesn't ignore duplicate init data. Note: Tizen 2015 and 2016 models will send multiple webkitneedkey events with the same init data. If the duplicates are suppressed, playback will stall without errors.  Defaults to <code>false</code> on Tizen 2, and <code>true</code> for all other browsers. */
  ignoreDuplicateInitData: boolean;
  /** Specify the default audio security level for Widevine when audio robustness is not specified.  Defaults to <code>'SW_SECURE_CRYPTO'</code> except on Android where the default value <code>''</code>. */
  defaultAudioRobustnessForWidevine: string;
  /** Specify the default video security level for Widevine when video robustness is not specified.  Defaults to <code>'SW_SECURE_DECODE'</code> except on Android where the default value <code>''</code>. */
  defaultVideoRobustnessForWidevine: string;
  /** The interval in seconds at which the player will attempt to renew licenses automatically. Set to 0 to disable automatic renewal.  Note: Only supported for PlayReady and FairPlay. Other key systems (e.g., Widevine) are not supported.  Defaults to <code>0</code>. */
  renewalIntervalSec: number;
  /** A callback function that is called when a DRM error occurs, such as LICENSE_REQUEST_FAILED. The callback receives a shaka.util.Error object. Set error.handled to true in the callback to prevent the error from being propagated as a fatal error. This allows the application to handle the error and retry licensing manually using retryLicensing().  Defaults to a no-op function. */
  failureCallback: (arg0: ShakaError) => void;
}

/**
 *
 * A callback function to handle custom content ID signaling for FairPlay
 * content.
 *
 */
export type InitDataTransform = (
  arg0: Uint8Array,
  arg1: string,
  arg2: DrmInfo | null,
) => Uint8Array;

/**
 *
 */
export interface DashManifestConfiguration {
  /** A default clock sync URI to be used with live streams which do not contain any clock sync information.  The <code>Date</code> header from this URI will be used to determine the current time.  Defaults to <code>''</code>. */
  clockSyncUri: string;
  /** If true, xlink-related errors will result in a fallback to the tag's existing contents. If false, xlink-related errors will be propagated to the application and will result in a playback failure.  Defaults to <code>false</code>. */
  xlinkFailGracefully: boolean;
  /** If true will cause DASH parser to ignore <code>minBufferTime</code> from manifest.  Defaults to <code>false</code>. */
  ignoreMinBufferTime: boolean;
  /** If <code>true</code>, ignore the <code>availabilityStartTime</code> in the manifest and instead use the segments to determine the live edge.  This allows us to play streams that have a lot of drift.  If <code>false</code>, we can't play content where the manifest specifies segments in the future.  Defaults to <code>true</code>. */
  autoCorrectDrift: boolean;
  /** The maximum number of initial segments to generate for <code>SegmentTemplate</code> with fixed-duration segments.  This is limited to avoid excessive memory consumption with very large <code>timeShiftBufferDepth</code> values.  Defaults to <code>1000</code>. */
  initialSegmentLimit: number;
  /** If true will cause DASH parser to ignore <code>suggestedPresentationDelay</code> from manifest.  Defaults to <code>false</code>. */
  ignoreSuggestedPresentationDelay: boolean;
  /** If true will cause DASH parser to ignore empty <code>AdaptationSet</code> from manifest.  Defaults to <code>false</code>. */
  ignoreEmptyAdaptationSet: boolean;
  /** If true will cause DASH parser to ignore <code>maxSegmentDuration</code> from manifest.  Defaults to <code>false</code>. */
  ignoreMaxSegmentDuration: boolean;
  /** A map of scheme URI to key system name. Defaults to default key systems mapping handled by Shaka. */
  keySystemsByURI: Record<string, string>;
  /** Called immediately after the DASH manifest has been parsed into an XMLDocument. Provides a way for applications to perform efficient preprocessing of the manifest. */
  manifestPreprocessorTXml: (arg0: xml.Node) => void;
  /** If true, the media segments are appended to the SourceBuffer in "sequence mode" (ignoring their internal timestamps).  Defaults to <code>false</code>. */
  sequenceMode: boolean;
  /** If period combiner is used, this option ensures every stream is used only once in period flattening. It speeds up underlying algorithm but may raise issues if manifest does not have stream consistency between periods.  Defaults to <code>false</code>. */
  useStreamOnceInPeriodFlattening: boolean;
  /** If false, disables fast switching track recognition.  Defaults to <code>true</code>. */
  enableFastSwitching: boolean;
}

/**
 *
 */
export interface HlsManifestConfiguration {
  /** If <code>true</code>, ignore any errors in a text stream and filter out those streams.  Defaults to <code>false</code>. */
  ignoreTextStreamFailures: boolean;
  /** If <code>true</code>, ignore any errors in a image stream and filter out those streams.  Defaults to <code>false</code>. */
  ignoreImageStreamFailures: boolean;
  /** The default audio codec if it is not specified in the HLS playlist.  Defaults to <code>'mp4a.40.2'</code>. */
  defaultAudioCodec: string;
  /** The default video codec if it is not specified in the HLS playlist.  Defaults to <code>'avc1.42E01E'</code>. */
  defaultVideoCodec: string;
  /** If <code>true</code>, the HLS parser will ignore the <code>EXT-X-PROGRAM-DATE-TIME</code> tags in the manifest and use media sequence numbers instead. It also causes EXT-X-DATERANGE tags to be ignored.  Meant for streams where <code>EXT-X-PROGRAM-DATE-TIME</code> is incorrect or malformed.  Defaults to <code>false</code>. */
  ignoreManifestProgramDateTime: boolean;
  /** An array of strings representing types for which <code>EXT-X-PROGRAM-DATE-TIME</code> should be ignored. Only used if the the main ignoreManifestProgramDateTime is set to false. For example, setting this to ['text', 'video'] will cause the PDT values text and video streams to be ignored, while still using the PDT values for audio.  Defaults to <code>[]</code>. */
  ignoreManifestProgramDateTimeForTypes: string[];
  /** A string containing a full mime type, including both the basic mime type and also the codecs. Used when the HLS parser parses a media playlist directly, required since all of the mime type and codecs information is contained within the master playlist. You can use the <code>shaka.util.MimeUtils.getFullType()</code> utility to format this value.  Defaults to <code>'video/mp2t; codecs="avc1.42E01E, mp4a.40.2"'</code>. */
  mediaPlaylistFullMimeType: string;
  /** The default presentation delay will be calculated as a number of segments. This is the number of segments for this calculation.  Defaults to <code>3</code>. */
  liveSegmentsDelay: number;
  /** If true, the media segments are appended to the SourceBuffer in "sequence mode" (ignoring their internal timestamps).  Defaults to <code>true</code> except on WebOS 3, Tizen 2, Tizen 3 and PlayStation 4 whose default value is <code>false</code>. */
  sequenceMode: boolean;
  /** If true, don't adjust the timestamp offset to account for manifest segment durations being out of sync with segment durations. In other words, assume that there are no gaps in the segments when appending to the SourceBuffer, even if the manifest and segment times disagree. Only applies when sequenceMode is <code>false</code>.  Defaults to <code>false</code>. */
  ignoreManifestTimestampsInSegmentsMode: boolean;
  /** If set to true, the HLS parser won't automatically guess or assume default codec for playlists with no "CODECS" attribute. Instead, it will attempt to extract the missing information from the media segment. As a consequence, lazy-loading media playlists won't be possible for this use case, which may result in longer video startup times.  Defaults to <code>false</code>. */
  disableCodecGuessing: boolean;
  /** If true, disables the automatic detection of closed captions. Otherwise, in the absence of a EXT-X-MEDIA tag with TYPE="CLOSED-CAPTIONS", Shaka Player will attempt to detect captions based on the media data.  Defaults to <code>false</code>. */
  disableClosedCaptionsDetection: boolean;
  /** If set to true, the HLS parser will optimize operation with LL and partial byte range segments. More info in https://www.akamai.com/blog/performance/-using-ll-hls-with-byte-range-addressing-to-achieve-interoperabi  Defaults to <code>true</code>. */
  allowLowLatencyByteRangeOptimization: boolean;
  /** If set to true, the HLS parser will use range request (only first byte) to guess the mime type.  Defaults to <code>false</code>. */
  allowRangeRequestsToGuessMimeType: boolean;
  /** A URI pointing to a JSON resource that defines media chapters for HLS playback.  When provided, Shaka Player will fetch and process this resource to extract chapter metadata and expose it as timeline chapters during playback. The JSON document must follow Apple’s HLS JSON Chapters specification,  as described in Providing JSON Chapters for HTTP Live Streaming. More info in https://developer.apple.com/documentation/http-live-streaming/providing-javascript-object-notation-json-chapters  Defaults to <code>''</code>. */
  chaptersUri: string;
}

/**
 *
 */
export interface MsfManifestConfiguration {
  /** A fingerprint URI. If set, the server fingerprint will be fetched from this URL. This is required to use self-signed certificates with Chromium.  Defaults to <code>''</code>. */
  fingerprintUri: string;
  /** List of namespaces to use for playback. If empty, namespaces are discovered via PublishNamespace messages.  Defaults to <code>[]</code>. */
  namespaces: string;
}

/**
 *
 */
export interface ManifestConfiguration {
  /** Retry parameters for manifest requests. */
  retryParameters: RetryParameters;
  /** A number, in seconds, that overrides the availability window in the manifest, or <code>NaN</code> if the default value should be used.  This is enforced by the manifest parser, so custom manifest parsers should take care to honor this parameter.  Defaults to <code>NaN</code>. */
  availabilityWindowOverride: number;
  /** If <code>true</code>, the audio tracks are ignored.  Defaults to <code>false</code>. */
  disableAudio: boolean;
  /** If <code>true</code>, the video tracks are ignored.  Defaults to <code>false</code>. */
  disableVideo: boolean;
  /** If <code>true</code>, the text tracks are ignored.  Defaults to <code>false</code>. */
  disableText: boolean;
  /** If <code>true</code>, the image tracks are ignored.  Defaults to <code>false</code>. */
  disableThumbnails: boolean;
  /** If <code>true</code>, the I-Frames tracks are ignored.  Defaults to <code>false</code>. */
  disableIFrames: boolean;
  /** If <code>true</code>, the chapter tracks are ignored.  Defaults to <code>false</code>. */
  disableChapters: boolean;
  /** For DASH, it's a default <code>presentationDelay</code> value if <code>suggestedPresentationDelay</code> is missing in the MPEG DASH manifest. The default value is the lower of <code>1.5 * minBufferTime</code> and <code>segmentAvailabilityDuration</code> if not configured or set as 0. For HLS, the default value is 3 segments duration if not configured or set as 0.  Defaults to <code>0</code>. */
  defaultPresentationDelay: number;
  /** Option to calculate VTT text timings relative to the segment start instead of relative to the period start (which is the default).  Defaults to <code>false</code>. */
  segmentRelativeVttTiming: boolean;
  /** Advanced parameters used by the DASH manifest parser. */
  dash: DashManifestConfiguration;
  /** Advanced parameters used by the HLS manifest parser. */
  hls: HlsManifestConfiguration;
  /** Advanced parameters used by the MSF. */
  msf: MsfManifestConfiguration;
  /** If true, manifest update request failures will cause a fatal error.  Defaults to <code>false</code>. */
  raiseFatalErrorOnManifestUpdateRequestFailure: boolean;
  /** If true, live manifest will be updated with the regular intervals even if the video is paused.  Defaults to <code>true</code>. */
  continueLoadingWhenPaused: boolean;
  /** If true, ignores supplemental codecs.  Defaults to <code>false</code>. */
  ignoreSupplementalCodecs: boolean;
  /** For DASH: Override the minimumUpdatePeriod of the manifest. The value is in seconds. If the value is greater than the minimumUpdatePeriod, it will update the manifest less frequently. If you update the value during for a dynamic manifest, it will directly trigger a new download of the manifest.  For HLS: Override the update period of the playlist. The value is in seconds. If the value is less than 0, the period will be determined based on the segment length.  If the value is greater than 0, it will update the target duration.  If you update the value during the live, it will directly trigger a new download of the manifest.  Defaults to <code>-1</code>. */
  updatePeriod: number;
  /** If true will cause DASH/HLS parser to ignore DRM information specified by the manifest and treat it as if it signaled no particular key system and contained no init data.  Defaults to <code>false</code>. */
  ignoreDrmInfo: boolean;
  /** If set, audio streams will be grouped and filtered by their parent adaptation set ID.  Defaults to <code>true</code>. */
  enableAudioGroups: boolean;
}

/**
 *
 * Dynamic Target Latency configuration options.
 *
 */
export interface DynamicTargetLatencyConfiguration {
  /** If <code>true</code>, dynamic latency for live sync is enabled. When enabled, the target latency will be adjusted closer to the min latency when playback is stable (see <code>stabilityThreshold</code>). If there are rebuffering events, then the target latency will move towards the max latency value in increments of <code>rebufferIncrement</code>.  Defaults to <code>false</code> */
  enabled: boolean;
  /** The value, in seconds, to increment the target latency towards <code>maxLatency</code> after a rebuffering event.  Defaults to <code>0.5</code> */
  rebufferIncrement: number;
  /** Number of seconds after a rebuffering before we are considered stable and will move the target latency towards <code>minLatency</code> value.  Defaults to <code>60</code>. */
  stabilityThreshold: number;
  /** Number of times that dynamic target latency will back off to <code>maxLatency</code> and attempt to adjust it closer to <code>minLatency</code>.  Defaults to <code>10</code>. */
  maxAttempts: number;
  /** The latency to use when a rebuffering event causes us to back off from the live edge.  Defaults to <code>4</code>. */
  maxLatency: number;
  /** The latency to work towards when the network is stable and we want to get closer to the live edge.  Defaults to <code>1</code>. */
  minLatency: number;
}

/**
 *
 * LiveSync configuration options.
 *
 */
export interface LiveSyncConfiguration {
  /** Enable the live stream sync against the live edge by changing the playback rate. Note: on some SmartTVs, if this is activated, it may not work or the sound may be lost when activated.  Defaults to <code>false</code>. */
  enabled: boolean;
  /** Preferred latency, in seconds. Effective only if liveSync is true.  Defaults to <code>0.5</code>. */
  targetLatency: number;
  /** Latency tolerance for target latency, in seconds. Effective only if liveSync is enabled.  Defaults to <code>0.5</code>. */
  targetLatencyTolerance: number;
  /** Max playback rate used for latency chasing. It is recommended to use a value between 1 and 2. Effective only if liveSync is enabled.  Defaults to <code>1.1</code>. */
  maxPlaybackRate: number;
  /** Minimum playback rate used for latency chasing. It is recommended to use a value between 0 and 1. Effective only if liveSync is enabled.  Defaults to <code>0.95</code>. */
  minPlaybackRate: number;
  /** If <code>true</code>, panic mode for live sync is enabled. When enabled, will set the playback rate to the <code>minPlaybackRate</code> until playback has continued past a rebuffering for longer than the <code>panicThreshold</code>.  Defaults to <code>false</code>. */
  panicMode: boolean;
  /** Number of seconds that playback stays in panic mode after a rebuffering.  Defaults to <code>60</code>. } dynamicTargetLatency The dynamic target latency config for dynamically adjusting the target latency to be closer to edge when network conditions are good and to back off when network conditions are bad. */
  panicThreshold: number;
}

/**
 *
 * Speech to text configuration options.
 *
 */
export interface SpeechToTextConfiguration {
  /** If true, creates a new text track that allows speech to text if supported by the browser.  This can be useful if your stream doesn't have subtitles and you want them.  This feature creates a text track that works like any other, but only renders when a <code>videoContainer</code> is provided to the player. You can recognize this track by its originalLanguage which is 'speech-to-text'.  This functionality might work with SW DRM, but it will never work with HW DRM.  This feature is experimental and may not work properly.  Defaults to <code>false</code>. */
  enabled: boolean;
  /** Indicates the limit of characters in the text rendered, ensuring that only complete words are included. If a word is cut at the limit, it is included in text rendered. Adds '...' at the start if truncation occurs.  Defaults to <code>140</code>. */
  maxTextLength: number;
  /** When set to true, indicates a requirement that the speech recognition process MUST be performed locally on the user’s device. If set to false, the user agent can choose between local and remote processing. Note: remote processing is done by the browser and we have no control over what 3rd parties are involved.  Defaults to <code>false</code>. */
  processLocally: boolean;
  /** List of languages to translate into if the browser supports translation APIs.  Each language in this list will create a new track.  Defaults to <code>[]</code>. */
  languagesToTranslate: string[];
}

/**
 *
 * The StreamingEngine's configuration options.
 *
 */
export interface StreamingConfiguration {
  /** Retry parameters for segment requests. */
  retryParameters: RetryParameters;
  /** A callback to decide what to do on a streaming failure.  Default behavior is to retry on live streams and not on VOD. */
  failureCallback: (arg0: ShakaError) => void;
  /** The minimum number of seconds of content that the StreamingEngine must buffer before it can begin playback or can continue playback after it has entered into a buffering state (i.e., after it has depleted one more more of its buffers). When the value is 0, the playback rate is not used to control the buffer.  Defaults to <code>0</code>. */
  rebufferingGoal: number;
  /** The number of seconds of content that the StreamingEngine will attempt to buffer ahead of the playhead. This value must be greater than or equal to the rebuffering goal.  Defaults to <code>10</code>. */
  bufferingGoal: number;
  /** The maximum number of seconds of content that the StreamingEngine will keep in buffer behind the playhead when it appends a new media segment. The StreamingEngine will evict content to meet this limit.  Defaults to <code>30</code>. */
  bufferBehind: number;
  /** The minimum duration in seconds of buffer overflow the StreamingEngine requires to start removing content from the buffer. Values less than <code>1.0</code> are not recommended.  Defaults to <code>1.0</code>. */
  evictionGoal: number;
  /** If <code>true</code>, the player will ignore text stream failures and continue playing other streams.  Defaults to <code>false</code>. */
  ignoreTextStreamFailures: boolean;
  /** If <code>true</code>, adjust the start time backwards so it is at the start of a segment. This affects both explicit start times and calculated start time for live streams. This can put us further from the live edge.  Defaults to <code>false</code>. */
  startAtSegmentBoundary: boolean;
  /** The maximum distance (in seconds) before a gap when we'll automatically jump.  Defaults to <code>0.5</code>. */
  gapDetectionThreshold: number;
  /** Padding added only for Xbox, Legacy Edge and Tizen. Based on our research (specific to Tizen), the gapPadding value must be greater than your GOP length. It’s crucial to verify this value according to your actual stream.  Defaults to <code>0.01</code> for Xbox and Legacy Edge, Tizen at 2. */
  gapPadding: number;
  /** The polling time in seconds to check for gaps in the media.  Defaults to <code>0.25</code>. */
  gapJumpTimerTime: number;
  /** By default, we will not allow seeking to exactly the duration of a presentation.  This field is the number of seconds before duration we will seek to when the user tries to seek to or start playback at the duration. To disable this behavior, the config can be set to 0.  We recommend using the default value unless you have a good reason not to.  Defaults to <code>1</code>. */
  durationBackoff: number;
  /** The amount of seconds that should be added when repositioning the playhead after falling out of the availability window or seek. This gives the player more time to buffer before falling outside again, but increases the forward jump in the stream skipping more content. This is helpful for lower bandwidth scenarios.  Defaults to <code>5</code>. */
  safeSeekOffset: number;
  /** The amount of seconds that should be added when repositioning the playhead after falling out of the seekable end range. This is helpful for live stream with a lot of GAP. This will reposition the playback in the past and avoid to be block at the edge and buffer at the next GAP  Defaults to <code>0</code>. */
  safeSeekEndOffset: number;
  /** When set to <code>true</code>, the stall detector logic will run.  If the playhead stops moving for <code>stallThreshold</code> seconds, the player will either seek or pause/play to resolve the stall, depending on the value of <code>stallSkip</code>.  Defaults to <code>true</code>. */
  stallEnabled: boolean;
  /** The maximum number of seconds that may elapse without the playhead moving (when playback is expected) before it will be labeled as a stall.  Defaults to <code>1</code>. */
  stallThreshold: number;
  /** The number of seconds that the player will skip forward when a stall has been detected.  If 0, the player will pause and immediately play instead of seeking.  A value of 0 is recommended and provided as default on TV platforms (WebOS, Tizen, Chromecast, etc).  Defaults to <code>0.1</code>  except on Tizen, WebOS, Chromecast, Hisense whose default value is <code>0</code>. */
  stallSkip: number;
  /** Desktop Safari has both MediaSource and their native HLS implementation. Depending on the application's needs, it may prefer one over the other. Warning when disabled: Where single-key DRM streams work fine, multi-keys streams is showing unexpected behaviours (stall, audio playing with video freezes, ...). Use with care.  Defaults to <code>true</code>. */
  useNativeHlsForFairPlay: boolean;
  /** The maximum difference, in seconds, between the times in the manifest and the times in the segments.  Larger values allow us to compensate for more drift (up to one segment duration).  Smaller values reduce the incidence of extra segment requests necessary to compensate for drift.  Defaults to <code>2</code>. */
  inaccurateManifestTolerance: number;
  /** If <code>true</code>, low latency streaming mode is enabled. If lowLatencyMode is set to true, it changes the default config values for other things, only on streams that supports low latency, see: docs/tutorials/config.md  Defaults to <code>true</code>. */
  lowLatencyMode: boolean;
  /** If true, prefer native DASH playback when possible, regardless of platform.  Defaults to <code>false</code>. */
  preferNativeDash: boolean;
  /** If true, prefer native HLS playback when possible, regardless of platform.  Defaults to <code>false</code>. */
  preferNativeHls: boolean;
  /** The minimum number of seconds to see if the manifest has changes.  Defaults to <code>1</code>. */
  updateIntervalSeconds: number;
  /** If true, monitor media quality changes and emit <code>shaka.Player.MediaQualityChangedEvent</code>.  Defaults to <code>false</code>. */
  observeQualityChanges: boolean;
  /** The maximum time a variant can be disabled when NETWORK HTTP_ERROR is reached, in seconds. If all variants are disabled this way, NETWORK HTTP_ERROR will be thrown.  Defaults to <code>30</code>. */
  maxDisabledTime: number;
  /** The maximum number of segments for each active stream to be prefetched ahead of playhead in parallel. This value will be multiplied by the playback rate if it is different from 1. If <code>0</code>, the segments will be fetched sequentially.  Defaults to <code>1</code>. */
  segmentPrefetchLimit: number;
  /** The audio languages to prefetch.  Defaults to <code>[]</code>. */
  prefetchAudioLanguages: string[];
  /** If set and prefetch limit is defined, it will prevent from prefetching data for audio.  Defaults to <code>false</code>. */
  disableAudioPrefetch: boolean;
  /** If set and prefetch limit is defined, it will prevent from prefetching data for text.  Defaults to <code>false</code>. */
  disableTextPrefetch: boolean;
  /** If set and prefetch limit is defined, it will prevent from prefetching data for video.  Defaults to <code>false</code>. */
  disableVideoPrefetch: boolean;
  /** The live sync configuration for keeping near the live edge. */
  liveSync: LiveSyncConfiguration;
  /** Indicate if we should recover from VIDEO_ERROR resetting Media Source.  Defaults to <code>true</code>. */
  allowMediaSourceRecoveries: boolean;
  /** The minimum time between recoveries when VIDEO_ERROR is reached, in seconds.  Defaults to <code>5</code>. */
  minTimeBetweenRecoveries: number;
  /** Adapt the playback rate of the player to keep the buffer full.  Defaults to <code>false</code>. */
  vodDynamicPlaybackRate: boolean;
  /** Playback rate to use if the buffer is too small.  Defaults to <code>0.95</code>. */
  vodDynamicPlaybackRateLowBufferRate: number;
  /** Ratio of the <code>bufferingGoal</code> as the low threshold for setting the playback rate to <code>vodDynamicPlaybackRateLowBufferRate</code>.  Defaults to <code>0.5</code>. */
  vodDynamicPlaybackRateBufferRatio: number;
  /** The window of time at the end of the presentation to begin preloading the next URL, such as one specified by a urn:mpeg:dash:chaining:2016 element in DASH. Measured in seconds. If the value is 0, the next URL will not be preloaded at all.  Defaults to <code>30</code>. */
  preloadNextUrlWindow: number;
  /** The maximum timeout to reject the load when using src= in case the content does not work correctly.  Measured in seconds.  Defaults to <code>30</code>. */
  loadTimeout: number;
  /** Clears decodingInfo and MediaKeySystemAccess cache during player unload as these objects may become corrupt and cause issues during subsequent playbacks on some platforms.  Defaults to <code>true</code> on PlayStation devices and to <code>false</code> on other devices. */
  clearDecodingCache: boolean;
  /** If true, we don't choose codecs in the player, and keep all the variants.  Defaults to <code>false</code>. */
  dontChooseCodecs: boolean;
  /** If true, we will try to fix problems when the timestampOffset is less than the baseMediaDecodeTime. This only works when the manifest is DASH with MP4 segments.  Defaults to <code>false</code> except on Tizen, WebOS whose default value is <code>true</code>. */
  shouldFixTimestampOffset: boolean;
  /** Avoid evict content on QuotaExceededError.  Defaults to <code>false</code>. */
  avoidEvictionOnQuotaExceededError: boolean;
  /** Allows MSE to be reset when crossing a boundary. Optionally, we can stop resetting MSE when MSE passed an encrypted boundary. Defaults to <code>KEEP</code> except on Tizen 3 where the default value is <code>RESET_TO_ENCRYPTED</code> and WebOS 3 where the default value is <code>RESET</code>. */
  crossBoundaryStrategy: CrossBoundaryStrategy;
  /** If true, when the playhead is behind the start of the live window, it will be moved to the end of the live window, instead of the start.  Defaults to <code>false</code>. */
  returnToEndOfLiveWindowWhenOutside: boolean;
  /** If true, stop fetching new segments on pause. This applies as long as there is something in the buffer; if there is nothing, we will allow the loading of the current segment.  Defaults to <code>false</code>. */
  stopFetchingOnPause: boolean;
  /** If true, limit the buffer to the presentation duration (cap append window at it) so the buffer never extends past it (e.g. HLS when one track is longer). Otherwise MediaSource.duration can grow and video never reaches "ended" when seeking to end.  Defaults to <code>false</code>. */
  clampAppendWindowToDuration: boolean;
}

/**
 *
 * The Networking's configuration options.
 *
 */
export interface NetworkingConfiguration {
  /** If true, if the protocol is HTTPs change it to HTTP. If both forceHTTP and forceHTTPS are set, forceHTTPS wins.  Defaults to <code>false</code>. */
  forceHTTP: boolean;
  /** If true, if the protocol is HTTP change it to HTTPs. If both forceHTTP and forceHTTPS are set, forceHTTPS wins.  Defaults to <code>false</code>. */
  forceHTTPS: boolean;
  /** Defines minimum number of bytes that should be used to emit progress event, if possible. To avoid issues around feeding ABR with request history, this value should be greater than or equal to `abr.advanced.minBytes`. By default equals 16e3 (the same value as `abr.advanced.minBytes`). */
  minBytesForProgressEvents: number;
}

/**
 *
 * Media source configuration.
 *
 */
export interface MediaSourceConfiguration {
  /** Allow codec switching strategy. SMOOTH loading uses SourceBuffer.changeType. RELOAD uses cycling of MediaSource.  Defaults to SMOOTH if SMOOTH codec switching is supported, RELOAD overwise. */
  codecSwitchingStrategy: CodecSwitchingStrategy;
  /** Callback to generate extra features string based on used MIME type. Some platforms may need to pass features when initializing the sourceBuffer. This string is ultimately appended to a MIME type in addSourceBuffer() & changeType(). */
  addExtraFeaturesToSourceBuffer: (arg0: string) => string;
  /** If this is <code>true</code>, we will transmux AAC and TS content even if not strictly necessary for the assets to be played.  Defaults to <code>false</code>. */
  forceTransmux: boolean;
  /** If true, will apply a work-around for non-encrypted init segments on encrypted content for some platforms.  See https://github.com/shaka-project/shaka-player/issues/2759.  If you know you don't need this, you can set this value to <code>false</code> to gain a few milliseconds on loading time and seek time.   Defaults to <code>true</code>. */
  insertFakeEncryptionInInit: boolean;
  /** If true, will apply a work-around for Audio init segments signaling EC-3 codec with protection. This will force the ChannelCount field of the 'enca' box to be set to 2, which is required via the dolby spec.  This value defaults to <code>false</code>. */
  correctEc3Enca: boolean;
  /** A callback called for each cue after it is parsed, but right before it is appended to the presentation. Gives a chance for client-side editing of cue text, cue timing, etc. This works for MSE always and for src= only when you use UITextDisplayer. */
  modifyCueCallback: ModifyCueCallback;
  /** If true, all emsg boxes are parsed and dispatched.  Defaults to <code>false</code>. */
  dispatchAllEmsgBoxes: boolean;
  /** If true, uses <source> element. Otherwise, sets the mediaSource url blob to src attribute. Disabling it will prevent using AirPlay on MSE.  Defaults to <code>true</code>. */
  useSourceElements: boolean;
  /** https://www.w3.org/TR/media-source-2/#duration-change-algorithm "Duration reductions that would truncate currently buffered media are disallowed. When truncation is necessary, use remove() to reduce the buffered range before updating duration." When set indicates media source duration change can truncate buffer, hence updateend event is expected on setDuration operation if new duration is smaller than existing value.  Defaults to <code>true</code>. */
  durationReductionEmitsUpdateEnd: boolean;
}

/**
 *
 * Accessibility configuration.
 *
 */
export interface AccessibilityConfiguration {
  /** If true, a forced text track will be chosen as a fallback if no other track is chosen, in two scenarios:  - In the initial selection, if the regular preference filters match no text tracks, a text track will be chosen based on the initial audio track.  - When changing the audio language, if the previous subtitle is either not present or is forced from the previous language.  Defaults to <code>true</code>. */
  handleForcedSubtitlesAutomatically: boolean;
  /** The speech to text configuration. */
  speechToText: SpeechToTextConfiguration;
}

/**
 *
 * Ads configuration.
 *
 */
export interface AdsConfiguration {
  /** If this is <code>true</code>, we create a custom playhead tracker for IMA Client Side. This is useful because it allows you to implement the use of IMA on platforms that do not support multiple video elements.  Defaults to <code>false</code> except on Tizen, WebOS, Chromecast, Hisense, PlayStation 4, PlayStation5, Xbox, Vizio whose default value is <code>true</code>. */
  customPlayheadTracker: boolean;
  /** If this is true, we will load IMA Client Side ads without waiting for a play event.  Defaults to <code>false</code> except on Tizen, WebOS, Chromecast, Hisense, PlayStation 4, PlayStation5, Xbox, Vizio whose default value is <code>true</code>. */
  skipPlayDetection: boolean;
  /** If this is true, the browser supports multiple media elements, the ad manager will use another video element to render the ad.  Defaults to <code>true</code> except on Tizen, WebOS, Chromecast, Hisense, PlayStation 4, PlayStation5, Xbox, Vizio whose default value is <code>false</code>. */
  supportsMultipleMediaElements: boolean;
  /** If this is true, we ignore HLS interstitial events.  Defaults to <code>false</code>. */
  disableHLSInterstitial: boolean;
  /** If this is true, we ignore DASH interstitial events.  Defaults to <code>false</code>. */
  disableDASHInterstitial: boolean;
  /** If this is true, we will use HTMLLinkElement to preload some resources.  Defaults to <code>true</code>. */
  allowPreloadOnDomElements: boolean;
  /** If this is true, we will allow start in the middle of an interstitial.  Defaults to <code>true</code>. */
  allowStartInMiddleOfInterstitial: boolean;
  /** If this is true, we disable tracking events except when using IMA SDK.  Defaults to <code>false</code>. */
  disableTrackingEvents: boolean;
  /** If true, disables snapback behavior when seeking over ad breaks. Normally, if a user seeks past an unplayed ad break, playback will automatically return to the start of the ad break to ensure ads are shown. When this flag is set, the player will not rewind to show skipped ads, and playback will continue from the user's seek position.  Defaults to <code>false</code>. */
  disableSnapback: boolean;
  /** Interstitial preload ahead time, in seconds.  Defaults to <code>10</code>. */
  interstitialPreloadAheadTime: number;
}

/**
 *
 */
export interface AbrConfiguration {
  /** If true, enable adaptation by the current AbrManager.  Defaults to <code>true</code>. */
  enabled: boolean;
  /** If true, use the Network Information API in the current AbrManager, if it is available in the browser environment.  If the Network Information API is used, Shaka Player will ignore the defaultBandwidthEstimate config.  Defaults to <code>true</code>. */
  useNetworkInformation: boolean;
  /** The default bandwidth estimate to use if there is not enough data, in bit/sec.  Only used if useNetworkInformation is false, or if the Network Information API is not available.  Defaults to <code>1e6</code>. */
  defaultBandwidthEstimate: number;
  /** The restrictions to apply to ABR decisions.  These are "soft" restrictions. Any track that fails to meet these restrictions will not be selected automatically, but will still appear in the track list and can still be selected via <code>selectVariantTrack()</code>.  If no tracks meet these restrictions, AbrManager should not fail, but choose a low-res or low-bandwidth variant instead.  It is the responsibility of AbrManager implementations to follow these rules and implement this behavior. */
  restrictions: Restrictions;
  /** The minimum amount of time that must pass between switches, in seconds. This keeps us from changing too often and annoying the user.  Defaults to <code>8</code>. */
  switchInterval: number;
  /** The fraction of the estimated bandwidth which we should try to use when upgrading.  Defaults to <code>0.85</code>. */
  bandwidthUpgradeTarget: number;
  /** The largest fraction of the estimated bandwidth we should use. We should downgrade to avoid this.  Defaults to <code>0.95</code>. */
  bandwidthDowngradeTarget: number;
  /** Advanced ABR configuration */
  advanced: AdvancedAbrConfiguration;
  /** If true, restrict the quality to media element size. Note: The use of ResizeObserver is required for it to work properly. If true without ResizeObserver, it behaves as false.  Defaults to <code>false</code>. */
  restrictToElementSize: boolean;
  /** If true, restrict the quality to screen size.  Defaults to <code>false</code>. */
  restrictToScreenSize: boolean;
  /** If true,device pixel ratio is ignored when restricting the quality to media element size or screen size.  Defaults to <code>false</code>. */
  ignoreDevicePixelRatio: boolean;
  /** If true, the buffer will be cleared during the switch. The default automatic behavior is false to have a smoother transition. On some device it's better to clear buffer.  Defaults to <code>false</code>. */
  clearBufferSwitch: boolean;
  /** Optional amount of buffer (in seconds) to retain when clearing the buffer during the automatic switch. Useful for switching variant quickly without causing a buffering event. Ignored if clearBuffer is false. Can cause hiccups on some browsers if chosen too small, e.g. The amount of two segments is a fair minimum to consider as safeMargin value.  Defaults to <code>o</code>. */
  safeMarginSwitch: number;
  /** Indicates the value in milliseconds from which a request is not considered cached.  Defaults to <code>5</code>. */
  cacheLoadThreshold: number;
  /** Indicates the minimum time to change quality once the real bandwidth is available, in seconds. This time is only used on the first load.  Defaults to <code>0</code> seconds except in Apple browsers whose default value  is <code>0.5</code> seconds. */
  minTimeToSwitch: number;
  /** If true, use the Network Information API bandwidth estimation in the current AbrManager, if it is available in the browser environment. This way Shaka Player will never estimate the bandwidth and we will always trust the information provided by the browser.  Defaults to <code>false</code>. */
  preferNetworkInformationBandwidth: boolean;
}

/**
 *
 */
export interface AdvancedAbrConfiguration {
  /** Minimum number of bytes sampled before we trust the estimate.  If we have not sampled much data, our estimate may not be accurate enough to trust.  Defaults to <code>128e3</code>. */
  minTotalBytes: number;
  /** Minimum number of bytes, under which samples are discarded.  Our models do not include latency information, so connection startup time (time to first byte) is considered part of the download time.  Because of this, we should ignore very small downloads which would cause our estimate to be too low.  Defaults to <code>16e3</code>. */
  minBytes: number;
  /** The quantity of prior samples (by weight) used when creating a new estimate, in seconds.  Those prior samples make up half of the new estimate.  Defaults to <code>2</code>. */
  fastHalfLife: number;
  /** The quantity of prior samples (by weight) used when creating a new estimate, in seconds.  Those prior samples make up half of the new estimate.  Defaults to <code>5</code>. */
  slowHalfLife: number;
}

/**
 *
 * Common Media Client Data (CMCD) Target Configuration
 *
 */
export interface CmcdTarget {
  /** Specifies the transmission strategy for the CMCD data.  Possible values are: <ul><li><b>'response'</b>: This mode reports data to one or more alternate destinations after either the full response or an error has been received to a media object request, using one of the Data Transmission Modes (header, query parameters, json object) </li></ul> */
  mode: string;
  /** If <code>true</code>, enable CMCD data to be sent with media requests.  Defaults to <code>false</code>. */
  enabled: boolean;
  /** If <code>true</code>, the CMCD data is sent as HTTP request headers. If <code>false</code>, it is sent as query parameters in the URL.  Defaults to <code>false</code>. */
  useHeaders: boolean;
  /** A specific URL to which the CMCD data will be sent. */
  url: string;
  /** An array of keys to include in the CMCD data. If not provided, all keys will be included.  Defaults to <code>[]</code>. */
  includeKeys: string[];
  /** An array of events to include as part of ps and sta in the CMCD data. If not provided, all events will be included.  Defaults to <code>[]</code>. */
  events: string[];
  /** Time Interval config in seconds  Defaults to <code>10</code>. */
  timeInterval: number;
}

/**
 *
 * Common Media Client Data (CMCD) configuration.
 *
 */
export interface CmcdConfiguration {
  /** If <code>true</code>, enable CMCD data to be sent with media requests.  Defaults to <code>false</code>. */
  enabled: boolean;
  /** If <code>true</code>, send CMCD data using the header transmission mode instead of query args.  Defaults to <code>false</code>. */
  useHeaders: boolean;
  /** A GUID identifying the current playback session. A playback session typically ties together segments belonging to a single media asset. Maximum length is 64 characters. It is RECOMMENDED to conform to the UUID specification.  By default the sessionId is automatically generated on each <code>load()</code> call. */
  sessionId: string;
  /** A unique string identifying the current content. Maximum length is 64 characters. This value is consistent across multiple different sessions and devices and is defined and updated at the discretion of the service provider.  Defaults to <code>'false'</code>. */
  contentId: string;
  /** RTP safety factor.  Defaults to <code>5</code>. */
  rtpSafetyFactor: number;
  /** An array of keys to include in the CMCD data. If not provided, all keys will be included.  Defaults to <code>[]</code>. */
  includeKeys: string[];
  /** The CMCD version. CMCD version 1 is fully supported. CMCD version 2 is an unfinished, work-in-progress draft, with features being added as the specification evolves towards finalization. Use v2 at your own risk. Valid values are <code>1</code> or <code>2</code>, corresponding to CMCD v1 and CMCD v2 specifications, respectively.  Defaults to <code>1</code>. */
  version: number;
  /** The event/response mode targets. */
  targets: CmcdTarget[];
}

/**
 *
 * Common Media Server Data (CMSD) configuration.
 *
 */
export interface CmsdConfiguration {
  /** If <code>true</code>, enables reading CMSD data in media requests.  Defaults to <code>true</code>. */
  enabled: boolean;
  /** If true, we must apply the maximum suggested bitrate. If false, we ignore this.  Defaults to <code>true</code>. */
  applyMaximumSuggestedBitrate: boolean;
  /** How much the estimatedThroughput of the CMSD data should be weighted against the default estimate, between 0 and 1.  Defaults to <code>0.5</code>. */
  estimatedThroughputWeightRatio: number;
}

/**
 *
 * Decoding for MPEG-5 Part2 LCEVC.
 *
 */
export interface LcevcConfiguration {
  /** If <code>true</code>, enable LCEVC. Defaults to <code>false</code>. */
  enabled: boolean;
  /** If <code>true</code>, LCEVC Dynamic Performance Scaling or dps is enabled to be triggered, when the system is not able to decode frames within a specific tolerance of the fps of the video and disables LCEVC decoding for some time. The base video will be shown upscaled to target resolution. If it is triggered again within a short period of time, the disabled time will be higher and if it is triggered three times in a row the LCEVC decoding will be disabled for that playback session. If dynamicPerformanceScaling is false, LCEVC decode will be forced and will drop frames appropriately if performance is sub optimal.  Defaults to <code>true</code>. */
  dynamicPerformanceScaling: boolean;
  /** Loglevel 0-5 for logging. NONE = 0 ERROR = 1 WARNING = 2 INFO = 3 DEBUG = 4 VERBOSE = 5  Defaults to <code>0</code>. */
  logLevel: number;
  /** If <code>true</code>, LCEVC Logo is placed on the top left hand corner which only appears when the LCEVC enhanced frames are being rendered. Defaults to true for the lib but is forced to false in this integration unless explicitly set to true through config.  Defaults to <code>false</code>. */
  drawLogo: boolean;
  /** If <code>true</code>, render a poster frame before the video is started. Defaults to true for the lib and set to true in the integration.  Defaults to <code>true</code>. */
  poster: boolean;
}

/**
 *
 */
export interface OfflineConfiguration {
  /** Called inside <code>store()</code> to determine if the content can be downloaded due to its estimated size. The estimated size of the download is passed and it must return if the download is allowed or not. */
  downloadSizeCallback: (arg0: number) => Promise<boolean>;
  /** Called inside <code>store()</code> to give progress info back to the app. It is given the current manifest being stored and the progress of it being stored. */
  progressCallback: (arg0: StoredContent, arg1: number) => void;
  /** If <code>true</code>, store protected content with a persistent license so that no network is required to view. If <code>false</code>, store protected content without a persistent license.  A network will be required to retrieve a temporary license to view.  Defaults to <code>true</code>. */
  usePersistentLicense: boolean;
  /** Number of parallel downloads. If the value is 0, downloads will be sequential for each stream. Note: normally browsers limit to 5 request in parallel, so putting a number higher than this will not help it download faster.  Defaults to <code>5</code>. */
  numberOfParallelDownloads: number;
}

/**
 *
 * Text displayer configuration.
 *
 */
export interface TextDisplayerConfiguration {
  /** The number of seconds to see if the captions should be updated.  Defaults to <code>0.25</code>. */
  captionsUpdatePeriod: number;
  /** The font scale factor used to increase or decrease the font size.  Defaults to <code>1</code>. */
  fontScaleFactor: number;
  /** The region within the viewing area where the subtitles are to be positioned. The default value indicates that they are positioned where the subtitle defines it, otherwise they are overwritten with the given position.  Defaults to <code>''</code>. */
  positionArea: PositionArea;
}

/**
 *
 */
export interface AudioPreference {
  /** The preferred language for audio tracks. An IETF language tag like 'en', 'en-US', 'fr', etc.  Defaults to <code>''</code>. */
  language: string;
  /** The preferred role for audio tracks.  Defaults to <code>''</code>. */
  role: string;
  /** The preferred label for audio tracks.  Defaults to <code>''</code>. */
  label: string;
  /** The preferred number of audio channels. A value of 0 means no preference.  Defaults to <code>0</code>. */
  channelCount: number;
  /** The preferred audio codec, e.g. 'opus', 'mp4a.40.2'.  Defaults to <code>''</code>. */
  codec: string;
  /** Whether spatial audio is preferred.  Defaults to <code>false</code>. */
  spatialAudio: boolean;
}

/**
 *
 */
export interface TextPreference {
  /** The preferred language for text tracks. An IETF language tag like 'en', 'en-US', 'fr', etc.  Defaults to <code>''</code>. */
  language: string;
  /** The preferred role for text tracks.  Defaults to <code>''</code>. */
  role: string;
  /** The preferred text format, e.g. 'vtt', 'ttml', 'text/vtt', 'application/ttml+xml'.  Defaults to <code>''</code>. */
  format: string;
  /** Whether forced subtitles are preferred.  Defaults to <code>false</code>. */
  forced: boolean;
}

/**
 *
 */
export interface VideoPreference {
  /** The preferred label for video tracks.  Defaults to <code>''</code>. */
  label: string;
  /** The preferred role for video tracks.  Defaults to <code>''</code>. */
  role: string;
  /** The preferred video codec, e.g. 'hvc1', 'avc1'.  Defaults to <code>''</code>. */
  codec: string;
  /** The preferred HDR level. Can be 'SDR', 'PQ', 'HLG', 'AUTO' for auto-detect, or '' for no preference.  Defaults to <code>''</code>. */
  hdrLevel: string;
  /** The preferred video layout. Can be 'CH-STEREO', 'CH-MONO', or '' for no preference.  Defaults to <code>''</code>. */
  layout: string;
}

/**
 *
 */
export interface PlayerConfiguration {
  /** Accessibility configuration and settings. */
  accessibility: AccessibilityConfiguration;
  /** Ads configuration and settings. */
  ads: AdsConfiguration;
  /** DRM configuration and settings. */
  drm: DrmConfiguration;
  /** Manifest configuration and settings. */
  manifest: ManifestConfiguration;
  /** Streaming configuration and settings. */
  streaming: StreamingConfiguration;
  /** Networking configuration and settings. */
  networking: NetworkingConfiguration;
  /** Media source configuration and settings. */
  mediaSource: MediaSourceConfiguration;
  /** A factory to construct an abr manager. } adaptationSetCriteriaFactory A factory to construct an adaptation set criteria. */
  abrFactory: AbrManagerFactory;
  /** ABR configuration and settings. */
  abr: AbrConfiguration;
  /** CMCD configuration and settings. (Common Media Client Data) */
  cmcd: CmcdConfiguration;
  /** CMSD configuration and settings. (Common Media Server Data) */
  cmsd: CmsdConfiguration;
  /** MPEG-5 LCEVC configuration and settings. (Low Complexity Enhancement Video Codec) */
  lcevc: LcevcConfiguration;
  /** Offline configuration and settings. */
  offline: OfflineConfiguration;
  /** Do not detect the hardware resolution.  For some niche cases where content is only available at resolutions beyond the device's native resolution, and you are confident it can be decoded and downscaled, this flag can allow playback when it would otherwise fail. */
  ignoreHardwareResolution: boolean;
  /** An ordered list of audio track preferences. Each entry specifies a combination of desired audio properties. Entries are tried in order; the first entry that matches available tracks is used. Within an entry, all specified (non-empty/non-zero) fields must match (AND logic). Unspecified fields (empty string, 0, or undefined) are ignored (match anything).  Defaults to <code>[]</code>. */
  preferredAudio: AudioPreference[];
  /** An ordered list of text track preferences. Each entry specifies a combination of desired text properties. Entries are tried in order; the first entry that matches available tracks is used.  Defaults to <code>[]</code>. */
  preferredText: TextPreference[];
  /** An ordered list of video track preferences. Each entry specifies a combination of desired video properties. Entries are tried in order; the first entry that matches available tracks is used.  Defaults to <code>[{hdrLevel: 'AUTO'}]</code>. */
  preferredVideo: VideoPreference[];
  /** The list of preferred attributes of decodingInfo, in the order of their priorities. This is used to do a filtering of the variants available for the player.  Defaults to <code>[]</code>. */
  preferredDecodingAttributes: string[];
  /** Queue manager configuration and settings. */
  queue: QueueConfiguration;
  /** The application restrictions to apply to the tracks.  These are "hard" restrictions.  Any track that fails to meet these restrictions will not appear in the track list.  If no tracks meet these restrictions, playback will fail. */
  restrictions: Restrictions;
  /** Optional playback and seek start time in seconds. Defaults to 0 if not provided.  Defaults to <code>0</code>. */
  playRangeStart: number;
  /** Optional playback and seek end time in seconds. Defaults to the end of the presentation if not provided.  Defaults to <code>Infinity</code>. */
  playRangeEnd: number;
  /** Text displayer configuration and settings. */
  textDisplayer: TextDisplayerConfiguration;
  /** A factory to construct a text displayer. If this is changed during playback, it will cause the text tracks to be reloaded. During playback it may be called automatically if a change in <code>webkitPresentationMode</code> is detected and <code>setVideoContainer</code> has been called. */
  textDisplayFactory: TextDisplayerFactory;
}

/**
 *
 * The Queue Manager's configuration options.
 *
 */
export interface QueueConfiguration {
  /** The window of time at the end of the presentation to begin preloading the next item. Measured in seconds. If the value is 0, the next URL will not be preloaded at all.  Defaults to <code>Infinity</code>. */
  preloadNextUrlWindow: number;
  /** Defaults to <code>true</code>. */
  preloadPrevItem: boolean;
  /** Controls behavior of the queue when all items have been played.  Defaults to {@link shaka.config.RepeatMode#OFF}. */
  repeatMode: RepeatMode;
}

/**
 *
 */
export interface LanguageRole {
  /** The language code for the stream. */
  language: string;
  /** The role name for the stream. If the stream has no role, <code>role</code> will be <code>''</code>. */
  role: string;
  /** The label of the audio stream, if it has one. */
  label: string | null;
}

/**
 *
 */
export interface Thumbnail {
  /** The segment of this thumbnail. */
  segment: SegmentReference;
  /** The image height in px. The image height could be different to height if the layout is different to 1x1. */
  imageHeight: number;
  /** The image width in px. The image width could be different to width if the layout is different to 1x1. */
  imageWidth: number;
  /** The thumbnail height in px. */
  height: number;
  /** The thumbnail left position in px. */
  positionX: number;
  /** The thumbnail top position in px. */
  positionY: number;
  /** The start time of the thumbnail in the presentation timeline, in seconds. */
  startTime: number;
  /** The duration of the thumbnail, in seconds. */
  duration: number;
  /** An array of URIs to attempt.  They will be tried in the order they are given. */
  uris: string[];
  /** The offset from the start of the uri resource. */
  startByte: number;
  /** The offset from the start of the resource to the end of the segment, inclusive.  A value of null indicates that the segment extends to the end of the resource. */
  endByte: number | null;
  /** The thumbnail width in px. */
  width: number;
  /** Indicate if the thumbnail is a sprite. */
  sprite: boolean;
  /** The thumbnail MIME type, if present. */
  mimeType: string | null;
  /** The thumbnail codecs, if present. */
  codecs: string | null;
}

/**
 *
 */
export interface Chapter {
  /** The id of the chapter. */
  id: string;
  /** The title of the chapter. */
  title: string;
  /** The time that describes the beginning of the range of the chapter. */
  startTime: number;
  /** The time that describes the end of the range of chapter. */
  endTime: number;
  /** The list of images associated with the chapter. */
  images: ImageInfo[];
}

/**
 *
 */
export interface ImageInfo {
  /** The image type. Eg: 'thumbnail', 'poster', etc. */
  type: string;
  /** The image width. */
  width: string;
  /** The image height. */
  height: number;
  /** The image url. */
  url: string;
}

/**
 *
 */
export interface ExtraText {
  /** The URI of the text. */
  uri: string;
  /** The language of the text (e.g. 'en'). */
  language: string;
  /** The kind of text (e.g. 'subtitles'). */
  kind: string;
  /** The MIME type of the text (e.g. 'text/vtt') */
  mime: string | null;
  /** The codecs string, if needed to refine the MIME type. */
  codecs: string | null;
}

/**
 *
 */
export interface ExtraChapter {
  /** The URI of the chapter. */
  uri: string;
  /** The language of the chapter (e.g. 'en'). */
  language: string;
  /** The MIME type of the chapter (e.g. 'text/vtt') */
  mime: string;
}
