/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Forward declarations
// Resolves at Step 8.1 (config)
export type AdsConfiguration = unknown;
// Resolves at Step 1.9 (player types)
export type ID3Metadata = unknown;
// Resolves at Step 1.9 (player types)
export type MetadataFrame = unknown;
// Resolves at Step 1.9 (player types)
export type HLSMetadata = unknown;
// Resolves at Step 6.2 (timeline + regions)
export type TimelineRegionInfo = unknown;
// Resolves at Step 10.1 (player)
export type Player = unknown;

/**
 * Contains statistics and information about the current state of the player.
 */
export interface AdsStats {
  /**
   * The set of amounts of time it took to get the final manifest.
   */
  loadTimes: number[]; // MIGRATION: The original type was `number` but the docs say "The set of amounts of time", and array makes more sense.
  /**
   * The average time it took to get the final manifest.
   */
  averageLoadTime: number;
  /**
   * The number of ads started (linear and overlays ads).
   */
  started: number;
  /**
   * The number of overlay ads started.
   */
  overlayAds: number;
  /**
   * The number of ads played completely.
   */
  playedCompletely: number;
  /**
   * The number of ads skipped.
   */
  skipped: number;
  /**
   * The number of ads with errors.
   */
  errors: number;
}

/**
 * Contains the times of a range of an Ad.
 */
export interface AdCuePoint {
  /**
   * The start time of the range, in milliseconds.
   */
  start: number;
  /**
   * The end time of the range, in milliseconds.
   */
  end: number | null;
}

/**
 * Contains the ad interstitial info.
 */
export interface AdInterstitial {
  /**
   * The id of the interstitial.
   */
  id: string | null;
  /**
   * The group id of the interstitial.
   */
  groupId: string | null;
  /**
   * The start time of the interstitial.
   */
  startTime: number;
  /**
   * The end time of the interstitial.
   */
  endTime: number | null;
  /**
   * The uri of the interstitial, can be any type that
   * ShakaPlayer supports (either in MSE or src=)
   */
  uri: string;
  /**
   * The mimeType of the interstitial if known.
   */
  mimeType: string | null;
  /**
   * Indicate if the interstitial is skippable.
   */
  isSkippable: boolean;
  /**
   * Time value that identifies when skip controls are made available to the
   * end user.
   */
  skipOffset: number | null;
  /**
   * The amount of time in seconds a skip button should be displayed for.
   * Note that this value should be >= 0.
   */
  skipFor: number | null;
  /**
   * Indicate if the interstitial is jumpable.
   */
  canJump: boolean;
  /**
   * Indicates where the primary playback will resume after the interstitial
   * plays. It is expressed as a time lag from when interstitial playback was
   * scheduled on the primary player's timeline. For live ad replacement it
   * must be null.
   */
  resumeOffset: number | null;
  /**
   * Indicate a limit for the playout time of the entire interstitial.
   */
  playoutLimit: number | null;
  /**
   * Indicates that the interstitial should only be played once.
   */
  once: boolean;
  /**
   * Indicates that an action is to be triggered before playback of the
   * primary asset begins, regardless of where playback begins in the primary
   * asset.
   */
  pre: boolean;
  /**
   * Indicates that an action is to be triggered after the primary asset has
   * been played to its end without error.
   */
  post: boolean;
  /**
   * Indicates whether the  interstitial should be presented in a timeline UI
   * as a single point or as a range.
   */
  timelineRange: boolean;
  /**
   * Indicates that the interstitials should play in loop.
   * Only applies if the interstitials is an overlay.
   * Only supported when using multiple video elements for interstitials.
   */
  loop: boolean;
  /**
   * Indicates the characteristics of the overlay
   * Only supported when using multiple video elements for interstitials.
   */
  overlay: AdPositionInfo | null;
  /**
   * Indicates if we should display on background, shrinking the current video.
   */
  displayOnBackground: boolean;
  /**
   * Indicates the characteristics of the current video.
   * Only set if any feature changes.
   */
  currentVideo: AdPositionInfo | null;
  /**
   * Specifies the background, the value can be any value of the CSS background
   * property.
   */
  background: string | null;
  /**
   * Indicate the URL when the ad is clicked.
   */
  clickThroughUrl: string | null;
  /**
   * Contains the tracking events that should be sent.
   */
  tracking: AdTrackingEvent | null;
}

/**
 * Contains the coordinates of a position info
 */
export interface AdPositionInfo {
  /**
   * The viewport in pixels.
   */
  viewport: { x: number; y: number };
  /**
   * The topLeft in pixels.
   */
  topLeft: { x: number; y: number };
  /**
   * The size in pixels.
   */
  size: { x: number; y: number };
}

/**
 * Contains the Tracking info.
 */
export interface AdTrackingInfo {
  /**
   * The start time of the tracking info.
   */
  startTime: number;
  /**
   * The end time of the tracking info.
   */
  endTime: number | null;
  /**
   * Contains the tracking events that should be sent.
   */
  tracking: AdTrackingEvent | null;
  /**
   * Returns the position of the tracking.
   */
  position: number;
  /**
   * The total number of trackings.
   */
  sequenceLength: number;
}

/**
 * Contains the Ad tracking events.
 */
export interface AdTrackingEvent {
  /**
   * When the impression of the ad occurs.
   */
  impression: string[] | null;
  /**
   * When the click through component of an ad is activated.
   */
  clickTracking: string[] | null;
  /**
   * When the start of the ad occurs.
   */
  start: string[] | null;
  /**
   * When 25% of the ad was played.
   */
  firstQuartile: string[] | null;
  /**
   * When 50% of the ad was played.
   */
  midpoint: string[] | null;
  /**
   * When 75% of the ad was played.
   */
  thirdQuartile: string[] | null;
  /**
   * When 100% of the ad was played to the end.
   */
  complete: string[] | null;
  /**
   * When a user action has caused the ad to be skipped.
   */
  skip: string[] | null;
  /**
   * When an error has occurred during the presentation of an ad.
   */
  error: string[] | null;
  /**
   * When a user action has caused the ad to begin again after previously being
   * paused or stopped.
   */
  resume: string[] | null;
  /**
   * When a user action has caused the ad to be paused.
   */
  pause: string[] | null;
  /**
   * When a user action has caused the ad to be muted.
   */
  mute: string[] | null;
  /**
   * When a user action has caused the ad to be unmuted.
   */
  unmute: string[] | null;
}

/**
 * An object that's responsible for all the ad-related logic
 * in the player.
 */
// MIGRATION: The original extern extends EventTarget, so we do as well.
export interface IAdManager extends EventTarget {
  /**
   * @param locale
   */
  setLocale(locale: string): void;

  /**
   * @param clientSideAdContainer
   * @param serverSideAdContainer
   */
  setContainers(
    clientSideAdContainer: HTMLElement,
    serverSideAdContainer: HTMLElement,
  ): void;

  /**
   * Called by the Player to provide an updated configuration any time it
   * changes.
   * Must be called at least once before init*().
   *
   * @param config
   */
  configure(config: AdsConfiguration): void;

  release(): void;

  onAssetUnload(): void;

  // IMA SDK Client Side

  /**
   * @param imaRequest
   * @param adsRenderingSettings
   */
  // MIGRATION: Using unknown for google.ima.* types.
  requestClientSideAds(
    imaRequest: unknown,
    adsRenderingSettings: unknown | null,
  ): void;

  /**
   * @param adsRenderingSettings
   */
  updateClientSideAdsRenderingSettings(adsRenderingSettings: unknown): void;

  // IMA DAI SDK Server Side

  /**
   * @param imaRequest
   * @param backupUrl
   * @return
   */
  requestServerSideStream(
    imaRequest: unknown,
    backupUrl?: string,
  ): Promise<string>;

  /**
   * @param adTagParameters
   */
  // biome-ignore lint/suspicious/noExplicitAny: The externs use any for this type
  replaceServerSideAdTagParameters(adTagParameters: any): void;

  // Media Tailor

  /**
   * @param url
   * @param adsParams
   * @param backupUrl
   * @return
   */
  requestMediaTailorStream(
    url: string,
    // biome-ignore lint/suspicious/noExplicitAny: The externs use any for this type
    adsParams: any,
    backupUrl?: string,
  ): Promise<string>;

  /**
   * @param url
   */
  addMediaTailorTrackingUrl(url: string): void;

  // Interstitials

  /**
   * @param interstitial
   */
  addCustomInterstitial(interstitial: AdInterstitial): void;

  /**
   * @param url
   * @return
   */
  addAdUrlInterstitial(url: string): Promise<void>;

  /**
   * @return
   */
  getInterstitialPlayer(): Player;

  // Utils

  /**
   * @return
   */
  getCuePoints(): AdCuePoint[];

  /**
   * Get statistics for the current playback session. If the player is not
   * playing content, this will return an empty stats object.
   */
  getStats(): AdsStats | object; // MIGRATION: Return type not specified in original, assuming AdsStats | object

  /**
   * Fired when the manifest is updated.
   *
   * @param isLive
   */
  onManifestUpdated(isLive: boolean): void;

  /**
   * @param metadata
   * @param timestampOffset
   */
  onHlsTimedMetadata(metadata: ID3Metadata, timestampOffset: number): void;

  /**
   * @param value
   */
  onCueMetadataChange(value: MetadataFrame): void;

  /**
   * @param metadata
   * @return
   */
  onHLSMetadata(metadata: HLSMetadata): Promise<void>;

  /**
   * @param region
   */
  onDASHMetadata(region: TimelineRegionInfo): void;

  /**
   * @return
   */
  getCurrentAd(): IAd | null;
}

/**
 * A factory for creating the ad manager.
 */
// MIGRATION: extracted from shaka.extern.IAdManager.Factory
export type IAdManagerFactory = (player: Player) => IAdManager;

/**
 * Interface for Ad objects.
 */
// MIGRATION: Original extends shaka.util.IReleasable, we define release() method
export interface IAd {
  /**
   * @override
   */
  release(): void;

  /**
   * @return
   */
  needsSkipUI(): boolean;

  /**
   * @return
   */
  isClientRendering(): boolean;

  /**
   * @return
   */
  hasCustomClick(): boolean;

  /**
   * @return
   */
  isUsingAnotherMediaElement(): boolean;

  /**
   * @return
   */
  getDuration(): number;

  /**
   * Gets the minimum suggested duration.  Defaults to being equivalent to
   * getDuration() for server-side ads.
   * @see http://bit.ly/3q3U6hI
   * @return
   */
  getMinSuggestedDuration(): number;

  /**
   * @return
   */
  getRemainingTime(): number;

  /**
   * @return
   */
  getTimeUntilSkippable(): number;

  /**
   * @return
   */
  isPaused(): boolean;

  /**
   * @return
   */
  isSkippable(): boolean;

  /**
   * @return
   */
  canSkipNow(): boolean;

  skip(): void;

  play(): void;

  pause(): void;

  /**
   * @return
   */
  getVolume(): number;

  /**
   * @param volume
   */
  setVolume(volume: number): void;

  /**
   * @return
   */
  isMuted(): boolean;

  /**
   * @param muted
   */
  setMuted(muted: boolean): void;

  /**
   * @return
   */
  isLinear(): boolean;

  /**
   * @param width
   * @param height
   */
  resize(width: number, height: number): void;

  /**
   * @return
   */
  getSequenceLength(): number;

  /**
   * @return
   */
  getPositionInSequence(): number;

  /**
   * @return
   */
  getTitle(): string;

  /**
   * @return
   */
  getDescription(): string;

  /**
   * @return
   */
  getVastMediaBitrate(): number;

  /**
   * @return
   */
  getVastMediaHeight(): number;

  /**
   * @return
   */
  getVastMediaWidth(): number;

  /**
   * @return
   */
  getVastAdId(): string;

  /**
   * @return
   */
  getAdId(): string;

  /**
   * @return
   */
  getCreativeAdId(): string;

  /**
   * @return
   */
  getAdvertiserName(): string;

  /**
   * @return
   */
  getMediaUrl(): string | null;

  /**
   * @return
   */
  getTimeOffset(): number;

  /**
   * @return
   */
  getPodIndex(): number;
}
