/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Explicit initialization data, which override any initialization data in the
 * content. The initDataType values and the formats that they correspond to
 * are specified {@link https://bit.ly/EmeInitTypes here}.
 */
export interface InitDataOverride {
  /**
   * Initialization data in the format indicated by initDataType.
   */
  initData: Uint8Array;
  /**
   * A string to indicate what format initData is in.
   */
  initDataType: string;
  /**
   * The key Id that corresponds to this initData.
   */
  keyId: string | null;
}

/**
 * DRM configuration for a single key system.
 */
export interface DrmInfo {
  /**
   * The key system, e.g., "com.widevine.alpha".
   */
  keySystem: string;
  /**
   * The encryption scheme, e.g., "cenc", "cbcs", "cbcs-1-9".
   */
  encryptionScheme: string;
  /**
   * The key system uri, e.g., "skd://" for fairplay.
   */
  keySystemUris?: Set<string>;
  /**
   * The license server URI.
   */
  licenseServerUri: string;
  /**
   * True if the application requires the key system to support distinctive
   * identifiers.
   */
  distinctiveIdentifierRequired: boolean;
  /**
   * True if the application requires the key system to support persistent
   * state, e.g., for persistent license storage.
   */
  persistentStateRequired: boolean;
  /**
   * A key-system-specific string that specifies a required security level.
   */
  audioRobustness: string;
  /**
   * A key-system-specific string that specifies a required security level.
   */
  videoRobustness: string;
  /**
   * A key-system-specific server certificate used to encrypt license requests.
   * Its use is optional and is meant as an optimization to avoid a round-trip
   * to request a certificate.
   */
  // MIGRATION: Source typed as Uint8Array but docs say "defaults to null".
  // Using Uint8Array | null to match runtime behavior.
  serverCertificate: Uint8Array | null;
  /**
   * Server certificate URI. If serverCertificate is not provided, the
   * certificate will be requested from this URI.
   */
  serverCertificateUri: string;
  /**
   * The session type, e.g., "temporary".
   */
  sessionType: string;
  /**
   * A list of initialization data which override any initialization data found
   * in the content.
   */
  initData: InitDataOverride[];
  /**
   * If not empty, contains the default key IDs for this key system, as
   * lowercase hex strings.
   */
  keyIds: Set<string>;
  /**
   * An optional list specifying each component in a media type included in a
   * data: scheme URI, separated by semicolon.
   */
  mediaTypes?: string[];
}
