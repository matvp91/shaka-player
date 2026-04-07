/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Forward declarations
// Resolves at Step 5.2 (text)
export type Cue = unknown;

/**
 * Parsed Caption Packet.
 */
export interface CaptionPacket {
  /**
   * The raw caption bytes. Depending on the source, it can be:
   *   - A "User data registered by Recommendation ITU-T T.35 SEI message"
   *     (sections D.1.6 and D.2.6 of Rec. ITU-T H.264, 06/2019), when
   *     `format` is `sei`.
   *   - Raw CEA-608 byte pairs from a dedicated 'c608' MP4 track sample,
   *     when `format` is `raw608`. In this case, the data does **not**
   *     include NAL units, length prefixes, or SEI headers.
   */
  packet: Uint8Array;
  /**
   * The presentation timestamp (PTS) of this caption packet in seconds.
   * For SEI-based captions, this corresponds to the PTS of the containing
   * video sample. For raw CEA-608 track samples, it corresponds to the PTS
   * of the 'c608' sample.
   */
  pts: number;
  /**
   * The origin format of the caption packet:
   *   - `sei` for ITU-T T.35 SEI messages embedded in video samples.
   *   - `raw608` for raw CEA-608 samples from a dedicated MP4 track.
   */
  format: string;
}

/**
 * Interface for parsing inband closed caption data from MP4 streams.
 */
export interface ICeaParser {
  /**
   * Initializes the parser with init segment data.
   * @param initSegment init segment to parse.
   */
  init(initSegment: BufferSource): void;

  /**
   * Parses the stream and extracts closed captions packets.
   * @param mediaSegment media segment to parse.
   * @return
   */
  parse(mediaSegment: BufferSource): CaptionPacket[];
}

/**
 * Parsed Cue.
 */
export interface ClosedCaption {
  cue: Cue;
  stream: string;
}

/**
 * Interface for decoding inband closed captions from packets.
 */
export interface ICaptionDecoder {
  /**
   * Extracts packets and prepares them for decoding. In a given media fragment,
   * all the caption packets found in its SEI messages should be extracted by
   * successive calls to extract(), followed by a single call to decode().
   *
   * @param userDataSeiMessage
   * This is a User Data registered by Rec.ITU-T T.35 SEI message.
   * It is described in sections D.1.6 and D.2.6 of Rec. ITU-T H.264 (06/2019).
   * @param pts PTS when this packet was received, in seconds.
   */
  extract(userDataSeiMessage: Uint8Array, pts: number): void;

  /**
   * Extracts raw CEA-608 caption bytes from a dedicated MP4 'c608' track
   * and prepares them for decoding. In a given media fragment, all the
   * CEA-608 samples found in the track should be extracted by successive
   * calls to extractRaw608(), followed by a single call to decode().
   *
   * Unlike extract(), this method does not process SEI messages or
   * ITU-T T.35 user data. The input is raw CEA-608 byte pairs as stored
   * directly in the MP4 sample payload of a 'c608' track (Apple-style
   * fragmented MP4).
   *
   * Each call provides the full sample payload for a single caption
   * sample. The payload typically consists of one or more CEA-608
   * cc_data byte pairs.
   *
   * @param raw608Data
   * Raw CEA-608 data bytes from a 'c608' MP4 track sample.
   * @param pts PTS when this sample was received, in seconds.
   */
  extractRaw608(raw608Data: Uint8Array, pts: number): void;

  /**
   * Decodes all currently extracted packets and then clears them.
   * This should be called once for a set of extracts (see comment on extract).
   * @return
   */
  decode(): ClosedCaption[];

  /**
   * Clears the decoder state completely.
   * Should be used when an action renders the decoder state invalid,
   * e.g. unbuffered seeks.
   */
  clear(): void;

  /**
   * Returns the streams that the CEA decoder found.
   * @return
   */
  getStreams(): string[];
}

/**
 */
export type CeaParserPlugin = () => ICeaParser;

/**
 */
export type CaptionDecoderPlugin = () => ICaptionDecoder;
