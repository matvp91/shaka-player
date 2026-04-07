/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Variant } from "./manifest";
import type { Request, RequestContext } from "./net";

// Forward declarations
// Resolves at Step 2.12 (complex utils)
export type CmsdManager = unknown;
// Resolves at Step 1.9 (player types)
export type AbrConfiguration = unknown;

/**
 * An object which selects Streams from a set of possible choices.  This also
 * watches for system changes to automatically adapt for the current streaming
 * requirements.  For example, when the network slows down, this class is in
 * charge of telling the Player which streams to switch to in order to reduce
 * the required bandwidth.
 *
 * This class is given a set of streams to choose from when the Player starts
 * up.  This class should store these and use them to make future decisions
 * about ABR.  It is up to this class how those decisions are made.  All the
 * Player will do is tell this class what streams to choose from.
 */
export interface AbrManager {
  /**
   * Initializes the AbrManager.
   *
   * @param switchCallback
   */
  init(switchCallback: AbrManagerSwitchCallback): void;

  /**
   * Stops any background timers and frees any objects held by this instance.
   * This will only be called after a call to init.
   */
  stop(): void;

  /**
   * Request that this object release all internal references.
   */
  release(): void;

  /**
   * Updates manager's variants collection.
   * Returns true if the variants are updated. Returns false if the variants
   * are equal.
   *
   * @param variants
   * @return
   */
  setVariants(variants: Variant[]): boolean;

  /**
   * Chooses one variant to switch to.  Called by the Player.
   *
   * @param preferFastSwitching If not provided meant "avoid fast
   * switching if possible".
   * @return
   */
  chooseVariant(preferFastSwitching?: boolean): Variant;

  /**
   * Enables automatic Variant choices from the last ones passed to setVariants.
   * After this, the AbrManager may call switchCallback() at any time.
   */
  enable(): void;

  /**
   * Disables automatic Stream suggestions. After this, the AbrManager may not
   * call switchCallback().
   */
  disable(): void;

  /**
   * Notifies the AbrManager that a segment has been downloaded (includes MP4
   * SIDX data, WebM Cues data, initialization segments, and media segments).
   *
   * @param deltaTimeMs The duration, in milliseconds, that the request
   *     took to complete.
   * @param numBytes The total number of bytes transferred.
   * @param allowSwitch Indicate if the segment is allowed to switch
   *     to another stream.
   * @param request
   *     A reference to the request
   * @param context
   *     A reference to the request context
   */
  segmentDownloaded(
    deltaTimeMs: number,
    numBytes: number,
    allowSwitch: boolean,
    request?: Request,
    context?: RequestContext,
  ): void;

  /**
   * Notifies the ABR that it is a time to suggest new streams. This is used by
   * the Player when it finishes adding the last partial segment of a fast
   * switching stream.
   */
  trySuggestStreams(): void;

  /**
   * Gets an estimate of the current bandwidth in bit/sec.  This is used by the
   * Player to generate stats.
   *
   * @return
   */
  getBandwidthEstimate(): number;

  /**
   * Updates manager playback rate.
   *
   * @param rate
   */
  playbackRateChanged(rate: number): void;

  /**
   * Set media element.
   *
   * @param mediaElement
   */
  setMediaElement(mediaElement: HTMLMediaElement): void;

  /**
   * Set CMSD manager.
   *
   * @param cmsdManager
   */
  setCmsdManager(cmsdManager: CmsdManager): void;

  /**
   * Sets the ABR configuration.
   *
   * It is the responsibility of the AbrManager implementation to implement the
   * restrictions behavior described in shaka.extern.AbrConfiguration.
   *
   * @param config
   */
  configure(config: AbrConfiguration): void;
}

/**
 * A callback into the Player that should be called when the AbrManager decides
 * it's time to change to a different variant.
 *
 * The first argument is a variant to switch to.
 *
 * The second argument is an optional boolean. If true, all data will be removed
 * from the buffer, which will result in a buffering event. Unless a third
 * argument is passed.
 *
 * The third argument in an optional number that specifies how much data (in
 * seconds) should be retained when clearing the buffer. This can help achieve
 * a fast switch that doesn't involve a buffering event. A minimum of two video
 * segments should always be kept buffered to avoid temporary hiccups.
 */
// MIGRATION: extracted from shaka.extern.AbrManager.SwitchCallback
export type AbrManagerSwitchCallback = (
  variant: Variant,
  clearBuffer?: boolean,
  safeMargin?: number,
) => void;

/**
 * A factory for creating the abr manager.
 */
// MIGRATION: extracted from shaka.extern.AbrManager.Factory
export type AbrManagerFactory = () => AbrManager;
