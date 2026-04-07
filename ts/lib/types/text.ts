/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Forward declarations
// Resolves at Step 5.2 (text)
export type Cue = unknown;
// Resolves at Step 10.1 (player)
export type Player = unknown;
// Resolves at Step 2.1 (core utilities)
// biome-ignore lint/complexity/noBannedTypes: Forward declaration requires an object type
export type IDestroyable = {};
// Resolves at Step 1.9 (player types)
export type TextDisplayerConfiguration = unknown;

/**
 * A collection of time offsets used to adjust text cue times.
 */
export interface TimeContext {
  /**
   * The absolute start time of the period in seconds.
   */
  periodStart: number;
  /**
   * The absolute start time of the segment in seconds.
   */
  segmentStart: number;
  /**
   * The absolute end time of the segment in seconds.
   */
  segmentEnd: number;
  /**
   * The start time relative to either segment or period start depending
   * on <code>segmentRelativeVttTiming</code> configuration.
   */
  vttOffset: number;
}

/**
 * An interface for plugins that parse text tracks.
 */
export interface TextParser {
  /**
   * Parse an initialization segment. Some formats do not have init
   * segments so this won't always be called.
   *
   * @param data
   *    The data that makes up the init segment.
   */
  parseInit(data: Uint8Array): void;

  /**
   * Parse a media segment and return the cues that make up the segment.
   *
   * @param data
   *    The next section of buffer.
   * @param timeContext
   *    The time information that should be used to adjust the times values
   *    for each cue.
   * @param uri
   *    The media uri.
   * @param images
   * @return
   */
  parseMedia(
    data: Uint8Array,
    timeContext: TimeContext,
    uri: string | null | undefined,
    images: string[],
  ): Cue[];

  /**
   * Notifies the manifest type.
   *
   * @param manifestType
   */
  setManifestType(manifestType: string): void;
}

/**
 * A callback used for editing cues before appending.
 * Provides the cue, the URI of the captions file the cue was parsed from, and
 * the time context that was used when generating that cue.
 * You can edit the cue object passed in.
 */
export type ModifyCueCallback = (
  cue: Cue,
  uri: string | null,
  timeContext: TimeContext,
) => void;

/**
 */
export type TextParserPlugin = () => TextParser;

/**
 * An interface for plugins that display text.
 *
 * This should handle displaying the text cues on the page.  This is given the
 * cues to display and told when to start and stop displaying.  This should only
 * display the cues it is given and remove cues when told to.
 *
 * <p>
 * This should only change whether it is displaying the cues through the
 * <code>setTextVisibility</code> function; the app should not change the text
 * visibility outside the top-level Player methods.
 */
export interface TextDisplayer extends IDestroyable {
  /**
   * Sets the TextDisplayer configuration.
   *
   * @param config
   */
  configure(config: TextDisplayerConfiguration): void;

  /**
   * Append given text cues to the list of cues to be displayed.
   *
   * @param cues
   *    Text cues to be appended.
   */
  append(cues: Cue[]): void;

  /**
   * Remove all cues that are fully contained by the given time range (relative
   * to the presentation). <code>endTime</code> will be greater to equal to
   * <code>startTime</code>.  <code>remove</code> should only return
   * <code>false</code> if the displayer has been destroyed. If the displayer
   * has not been destroyed <code>remove</code> should return <code>true</code>.
   *
   * @param startTime
   * @param endTime
   *
   * @return
   */
  remove(startTime: number, endTime: number): boolean;

  /**
   * Returns true if text is currently visible.
   *
   * @return
   */
  isTextVisible(): boolean;

  /**
   * Set text visibility.
   *
   * @param on
   */
  setTextVisibility(on: boolean): void;

  /**
   * Set the current language.
   *
   * @param language
   */
  setTextLanguage(language: string): void;
}

/**
 * A factory for creating a TextDisplayer.
 */
// MIGRATION: renamed from shaka.extern.TextDisplayer.Factory
export type TextDisplayerFactory = (player: Player) => TextDisplayer;
