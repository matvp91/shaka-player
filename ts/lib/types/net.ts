/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { IAbortableOperation } from "./abortable";
import type { DrmInfo } from "./drm_info";

// Forward declarations for types that will be migrated later
// Resolves at Step 3.1
export type RequestType = unknown;
// Resolves at Step 3.1
export type AdvancedRequestType = unknown;
// Resolves at Step 6.4 (media)
export type Stream = unknown;
// Resolves at Step 6.1 (media)
export type SegmentReference = unknown;

/**
 * Parameters for retrying requests.
 */
export interface RetryParameters {
  /**
   * The maximum number of times the request should be attempted.
   * The minimum supported value is 1 (only one request without retries).
   */
  maxAttempts: number;
  /**
   * The delay before the first retry, in milliseconds.
   */
  baseDelay: number;
  /**
   * The multiplier for successive retry delays.
   */
  backoffFactor: number;
  /**
   * The maximum amount of fuzz to apply to each retry delay.
   * For example, 0.5 means "between 50% below and 50% above the retry delay."
   */
  fuzzFactor: number;
  /**
   * The request timeout, in milliseconds.  Zero means "unlimited".
   * <i>Defaults to 30000 milliseconds.</i>
   */
  timeout: number;
  /**
   * The request stall timeout, in milliseconds.  Zero means "unlimited".
   * <i>Defaults to 5000 milliseconds.</i>
   */
  stallTimeout: number;
  /**
   * The request connection timeout, in milliseconds.  Zero means "unlimited".
   * <i>Defaults to 10000 milliseconds.</i>
   */
  connectionTimeout: number;
}

/**
 * Defines a network request.  This is passed to one or more request filters
 * that may alter the request, then it is passed to a scheme plugin which
 * performs the actual operation.
 */
export interface Request {
  /**
   * An array of URIs to attempt.  They will be tried in the order they are
   * given.
   */
  uris: string[];
  /**
   * The HTTP method to use for the request.
   */
  method: string;
  /**
   * The body of the request.
   */
  body: BufferSource | null;
  /**
   * A mapping of headers for the request.  e.g.: {'HEADER': 'VALUE'}
   */
  headers: Record<string, string>;
  /**
   * Make requests with credentials.  This will allow cookies in cross-site
   * requests.  See {@link https://bit.ly/CorsCred}.
   */
  allowCrossSiteCredentials: boolean;
  /**
   * An object used to define how often to make retries.
   */
  retryParameters: RetryParameters;
  /**
   * If this is a LICENSE request, this field contains the type of license
   * request it is (not the type of license).  This is the |messageType| field
   * of the EME message.  For example, this could be 'license-request' or
   * 'license-renewal'.
   */
  licenseRequestType: string | null;
  /**
   * If this is a LICENSE request, this field contains the session ID of the
   * EME session that made the request.
   */
  sessionId: string | null;
  /**
   * If this is a LICENSE request, this field contains the DRM info used to
   * initialize EME.
   */
  drmInfo: DrmInfo | null;
  /**
   * If this is a LICENSE request, this field contains the initData info used
   * to initialize EME.
   */
  initData: Uint8Array | null;
  /**
   * If this is a LICENSE request, this field contains the initDataType info
   * used to initialize EME.
   */
  initDataType: string | null;
  /**
   * A callback function to handle the chunked data of the ReadableStream.
   */
  streamDataCallback: ((chunk: BufferSource) => Promise<void>) | null;
  /**
   * The time that the request started.
   */
  requestStartTime?: number;
  /**
   * The time taken to the first byte.
   */
  timeToFirstByte?: number;
  /**
   * A number representing the order the packet within the request.
   */
  packetNumber?: number;
  /**
   * Content type (e.g. 'video', 'audio' or 'text', 'image')
   */
  contentType?: string;
  /**
   * Current request attempt, 0-based.
   */
  attempt: number;
}

/**
 * Defines a response object.  This includes the response data and header info.
 * This is given back from the scheme plugin.  This is passed to a response
 * filter before being returned from the request call.
 */
export interface Response {
  /**
   * The URI which was loaded.  Request filters and server redirects can cause
   * this to be different from the original request URIs.
   */
  uri: string;
  /**
   * The original URI passed to the browser for networking. This is before any
   * redirects, but after request filters are executed.
   */
  originalUri: string;
  /**
   * The body of the response.
   */
  data: BufferSource;
  /**
   * The response HTTP status code.
   */
  status?: number;
  /**
   * A map of response headers, if supported by the underlying protocol.
   * All keys should be lowercased.
   * For HTTP/HTTPS, may not be available cross-origin.
   */
  headers: Record<string, string>;
  /**
   * Optional.  The time it took to get the response, in milliseconds.  If not
   * given, NetworkingEngine will calculate it using Date.now.
   */
  timeMs?: number;
  /**
   * Optional. If true, this response was from a cache and should be ignored
   * for bandwidth estimation.
   */
  fromCache?: boolean;
  /**
   * The original request that gave rise to this response.
   */
  originalRequest: Request;
}

/**
 * Defines configuration object to use by SchemePlugins.
 */
export interface SchemePluginConfig {
  /**
   * Defines minimum number of bytes that should be use to emit progress event,
   * if possible.
   */
  minBytesForProgressEvents?: number;
}

/**
 * A callback function to handle progress event through networking engine in
 * player.
 * The first argument is a number for duration in milliseconds, that the request
 * took to complete.
 * The second argument is the total number of bytes downloaded during that
 * time.
 * The third argument is the number of bytes remaining to be loaded in a
 * segment.
 */
export type ProgressUpdated = (
  durationMs: number,
  bytesDownloaded: number,
  bytesRemaining: number,
) => void;

/**
 * A callback function to handle headers received events through networking
 * engine in player.
 * The first argument is the headers object of the response.
 */
export type HeadersReceived = (headers: Record<string, string>) => void;

/**
 * Defines a plugin that handles a specific scheme.
 *
 * The functions accepts four parameters, uri string, request, request type,
 * a progressUpdated function, and a headersReceived function.  The
 * progressUpdated and headersReceived functions can be ignored by plugins that
 * do not have this information, but it will always be provided by
 * NetworkingEngine.
 */
export type SchemePlugin = (
  uri: string,
  request: Request,
  requestType: RequestType,
  progressUpdated: ProgressUpdated,
  headersReceived: HeadersReceived,
  config: SchemePluginConfig,
) => IAbortableOperation<Response>;

/**
 * Defines contextual data about a request
 */
export interface RequestContext {
  /**
   * The advanced type
   */
  type?: AdvancedRequestType;
  /**
   * A reference to the Stream object
   */
  stream?: Stream;
  /**
   * The request's segment reference
   */
  segment?: SegmentReference;
  /**
   * Whether the request came from a preload or a normal load.
   */
  isPreload?: boolean;
}

/**
 * Defines a filter for requests.  This filter takes the request and modifies
 * it before it is sent to the scheme plugin.
 * The RequestType describes the basic type of the request (manifest, segment,
 * etc). The optional RequestContext will be provided where applicable to
 * provide additional information about the request. A request filter can run
 * asynchronously by returning a promise; in this case, the request will not be
 * sent until the promise is resolved.
 * If a request is attempted multiple times, this filter will be called for each
 * attempt. You can check the attempt parameter on the request object to see
 * which attempt this filter is being called on.
 */
export type RequestFilter = (
  requestType: RequestType,
  request: Request,
  context?: RequestContext,
) => Promise<void> | void;

/**
 * Defines a filter for responses.  This filter takes the response and modifies
 * it before it is returned.
 * The RequestType describes the basic type of the request (manifest, segment,
 * etc). The optional RequestContext will be provided where applicable to
 * provide additional information about the request. A response filter can run
 * asynchronously by returning a promise.
 */
export type ResponseFilter = (
  requestType: RequestType,
  response: Response,
  context?: RequestContext,
) => Promise<void> | void;
