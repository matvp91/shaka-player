/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Variant } from "./manifest";

// Forward declarations
// Resolves at Step 6.5 (adaptation + filtering)
export type AdaptationSet = unknown;
// Resolves at Step 1.9 (player types)
export type AudioPreference = unknown;
// Resolves at Step 1.9 (player types)
export type VideoPreference = unknown;
// Resolves at Step 8.1 (config)
export type CodecSwitchingStrategy = unknown;

/**
 * An adaptation set criteria is a unit of logic that can take a set of
 * variants and return a subset of variants that should (and can) be
 * adapted between.
 */
export interface AdaptationSetCriteria {
  /**
   * Take a set of variants, and return a subset of variants that can be
   * adapted between.
   *
   * @param variants
   * @return
   */
  create(variants: Variant[]): AdaptationSet;

  /**
   * Sets the AdaptationSetCriteria configuration.
   *
   * @param config
   */
  configure(config: AdaptationSetCriteriaConfiguration): void;

  /**
   * Gets the current AdaptationSetCriteria configuration.
   *
   * @return
   */
  getConfiguration(): AdaptationSetCriteriaConfiguration | null;

  /**
   * Return the result of last create call.
   *
   * @return
   */
  getLastAdaptationSet(): AdaptationSet | null;
}

/**
 * A factory for creating the AdaptationSetCriteria.
 */
// MIGRATION: extracted from shaka.extern.AdaptationSetCriteria.Factory
export type AdaptationSetCriteriaFactory = () => AdaptationSetCriteria;

/**
 */
// MIGRATION: extracted from shaka.extern.AdaptationSetCriteria.Configuration
export interface AdaptationSetCriteriaConfiguration {
  /**
   * An ordered list of audio preferences used to filter variants.
   */
  preferredAudio: AudioPreference[];
  /**
   * An ordered list of video preferences used to filter variants.
   */
  preferredVideo: VideoPreference[];
  /**
   * Deprecated. Use preferredAudio instead.
   * The language used to filter variants. Populated from
   * preferredAudio[0].language.
   */
  language: string;
  /**
   * Deprecated. Use preferredAudio instead.
   * The adaptation audio role used to filter variants. Populated from
   * preferredAudio[0].role.
   */
  role: string;
  /**
   * Deprecated. Use preferredVideo instead.
   * The adaptation video role used to filter variants. Populated from
   * preferredVideo[0].role.
   */
  videoRole: string;
  /**
   * Deprecated. Use preferredAudio instead.
   * The audio channel count used to filter variants. Populated from
   * preferredAudio[0].channelCount.
   */
  channelCount: number;
  /**
   * Deprecated. Use preferredVideo instead.
   * The HDR level used to filter variants. Populated from
   * preferredVideo[0].hdrLevel.
   */
  hdrLevel: string;
  /**
   * Deprecated. Use preferredAudio instead.
   * Whether should prefer audio tracks with spatial audio. Populated from
   * preferredAudio[0].spatialAudio.
   */
  spatialAudio: boolean;
  /**
   * Deprecated. Use preferredVideo instead.
   * The video layout used to filter variants. Populated from
   * preferredVideo[0].layout.
   */
  videoLayout: string;
  /**
   * Deprecated. Use preferredAudio instead.
   * The audio label used to filter variants. Populated from
   * preferredAudio[0].label.
   */
  audioLabel: string;
  /**
   * Deprecated. Use preferredVideo instead.
   * The video label used to filter variants. Populated from
   * preferredVideo[0].label.
   */
  videoLabel: string;
  /**
   * Deprecated. Use preferredAudio instead.
   * The ordered list of audio codecs to filter variants. Populated from
   * preferredAudio[*].codec.
   */
  preferredAudioCodecs: string[];
  /**
   * Deprecated. Use preferredAudio instead.
   * The preferred audio channel count to filter variants. Populated from
   * preferredAudio[0].channelCount.
   */
  preferredAudioChannelCount: number;
  /**
   * The codec switching strategy used to filter variants.
   */
  codecSwitchingStrategy: CodecSwitchingStrategy;
  /**
   * The audio codec used to filter variants.
   */
  audioCodec: string;
  /**
   * The active audio codec used to filter variants.
   */
  activeAudioCodec: string;
  /**
   * The active audio channel count used to filter variants.
   */
  activeAudioChannelCount: number;
  /**
   * Current used key system or empty if not used.
   */
  keySystem: string;
}
