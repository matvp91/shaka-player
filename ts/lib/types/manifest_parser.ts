/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Manifest, Stream, Variant } from "./manifest";
import type { RetryParameters } from "./net";

// Forward declarations
// Resolves at Step 1.9 (player types)
export type ManifestConfiguration = unknown;
// Resolves at Step 3.1 (net)
export type NetworkingEngine = unknown;
// Resolves at Step 6.2 (timeline + regions)
export type TimelineRegionInfo = unknown;
// Resolves at Step 2.4 (error)
export type ShakaError = unknown; // MIGRATION: renamed from shaka.util.Error
// Resolves at Step 6.2 (timeline + regions) - or 1.9? Actually wait, MetadataFrame is an extern. Let's make it unknown for now.
// Resolves at Step 1.9 (player types)
export type MetadataFrame = unknown;

/**
 * Parses media manifests and handles manifest updates.
 *
 * Given a URI where the initial manifest is found, a parser will request the
 * manifest, parse it, and return the resulting Manifest object.
 *
 * If the manifest requires updates (e.g. for live media), the parser will use
 * background timers to update the same Manifest object.
 *
 * There are many ways for |start| and |stop| to be called. Implementations
 * should support all cases:
 *
 *  BASIC
 *    await parser.start(uri, playerInterface);
 *    await parser.stop();
 *
 *  INTERRUPTING
 *    const p = parser.start(uri, playerInterface);
 *    await parser.stop();
 *    await p;
 *
 *    |p| should be rejected with an OPERATION_ABORTED error.
 *
 *  STOPPED BEFORE STARTING
 *    await parser.stop();
 */
export interface ManifestParser {
  /**
   * Called by the Player to provide an updated configuration any time the
   * configuration changes.  Will be called at least once before start().
   *
   * @param config
   * @param isPreloadFn
   */
  configure(config: ManifestConfiguration, isPreloadFn?: () => boolean): void;

  /**
   * Initialize and start the parser. When |start| resolves, it should return
   * the initial version of the manifest. |start| will only be called once. If
   * |stop| is called while |start| is pending, |start| should reject.
   *
   * @param uri The URI of the manifest.
   * @param playerInterface
   *    The player interface contains the callbacks and members that the parser
   *    can use to communicate with the player and outside world.
   * @return
   */
  start(
    uri: string,
    playerInterface: ManifestParserPlayerInterface,
  ): Promise<Manifest>;

  /**
   * Tell the parser that it must stop and free all internal resources as soon
   * as possible. Only once all internal resources are stopped and freed will
   * the promise resolve. Once stopped a parser will not be started again.
   *
   * The parser should support having |stop| called multiple times and the
   * promise should always resolve.
   *
   * @return
   */
  stop(): Promise<void>;

  /**
   * Tells the parser to do a manual manifest update.  Implementing this is
   * optional.  This is only called when 'emsg' boxes are present.
   */
  update(): void;

  /**
   * Tells the parser that the expiration time of an EME session has changed.
   * Implementing this is optional.
   *
   * @param sessionId
   * @param expiration
   */
  onExpirationUpdated(sessionId: string, expiration: number): void;

  /**
   * Tells the parser that the initial variant has been chosen.
   *
   * @param variant
   */
  onInitialVariantChosen(variant: Variant): void;

  /**
   * Tells the parser that a location should be banned. This is called on
   * retry.
   *
   * @param uri
   */
  banLocation(uri: string): void;

  /**
   * Set media element.
   *
   * @param mediaElement
   */
  setMediaElement(mediaElement: HTMLMediaElement): void;
}

/**
 * Defines the interface of the Player to the manifest parser.  This defines
 * fields and callback methods that the parser will use to interact with the
 * Player.  The callback methods do not need to be called as member functions
 * (i.e. they can be called as "free" functions).
 */
// MIGRATION: extracted from shaka.extern.ManifestParser.PlayerInterface
export interface ManifestParserPlayerInterface {
  /**
   * The networking engine to use for network requests.
   */
  networkingEngine: NetworkingEngine;

  /**
   * Should be called when new variants or text streams are added to the
   * Manifest.  Note that this operation is asynchronous.
   * @param manifest
   * @return
   */
  filter(manifest: Manifest): Promise<void>;

  /**
   * A callback that adds text streams to represent the closed captions of the
   * video streams in the Manifest.  Should be called whenever new video streams
   * are added to the Manifest.
   * @param manifest
   */
  makeTextStreamsForClosedCaptions(manifest: Manifest): void;

  /**
   * Should be called when a new timeline region is added.
   * @param regionInfo
   */
  onTimelineRegionAdded(regionInfo: TimelineRegionInfo): void;

  /**
   * Should be called to raise events.
   * @param event
   */
  onEvent(event: Event): void;

  /**
   * Should be called when an error occurs.
   * @param error
   */
  onError(error: ShakaError): void;

  /**
   * Return true if low latency streaming mode is enabled.
   * @return
   */
  isLowLatencyMode(): boolean;

  /**
   * Update the presentation duration based on PresentationTimeline.
   */
  updateDuration(): void;

  /**
   * Inform the player of new DRM info that needs to be processed for the given
   * stream.
   * @param stream
   */
  newDrmInfo(stream: Stream): void;

  /**
   * Should be called when the manifest is updated.
   */
  onManifestUpdated(): void;

  /**
   * Get the estimated bandwidth in bits per second.
   * @return
   */
  getBandwidthEstimate(): number;

  /**
   * Called when an metadata is found in the manifest.
   * @param time
   * @param pts
   * @param endPts
   * @param frames
   * @return
   */
  onMetadata(
    time: string,
    pts: number,
    endPts: number | null,
    frames: MetadataFrame[],
  ): Promise<void>;

  /**
   * Called to temporarily disable a stream i.e. disabling all variant
   * containing said stream.
   * @param stream
   */
  disableStream(stream: Stream): void;

  /**
   * Called when a new font needs to be added.
   * @param name
   * @param url
   */
  addFont(name: string, url: string): void;

  /**
   * Return RetryParameters for streaming.
   * @return
   */
  getStreamingRetryParameters(): RetryParameters;
}

/**
 * A factory for creating the manifest parser.  This function is registered with
 * shaka.media.ManifestParser to create parser instances.
 */
// MIGRATION: extracted from shaka.extern.ManifestParser.Factory
export type ManifestParserFactory = () => ManifestParser;
