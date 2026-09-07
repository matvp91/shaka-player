# Extern-to-TypeScript Type Conversion Guide

This document maps every type definition in `/externs/shaka/` to its TypeScript equivalent in `ts/lib/types/`. These types form the foundation of the migration — they must be converted first, before any module.

## Source Files

The externs are split across 21 files containing ~153 type definitions:

| Extern File | Types | Target TS File |
|-------------|-------|----------------|
| namespace.js | 2 namespaces | (not needed — replaced by ES modules) |
| resolution.js | 1 typedef | resolution.ts |
| codecs.js | 4 typedefs | codecs.ts |
| error.js | 1 typedef + 1 interface | error.ts |
| drm_info.js | 2 typedefs | drm_info.ts |
| net.js | 10 typedefs/functions | net.ts |
| manifest.js | 10 typedefs/interfaces | manifest.ts |
| text.js | 6 interfaces/typedefs/functions | text.ts |
| cea.js | 6 interfaces/typedefs/functions | cea.ts |
| transmuxer.js | 3 interfaces/typedefs/functions | transmuxer.ts |
| abortable.js | 1 interface (generic) | abortable.ts |
| abr_manager.js | 3 interfaces/typedefs/functions | abr_manager.ts |
| manifest_parser.js | 3 interfaces/typedefs/functions | manifest_parser.ts |
| adaptation_set_criteria.js | 3 interfaces/typedefs/functions | adaptation_set_criteria.ts |
| mp4_parser.js | 1 typedef | mp4_parser.ts |
| ads.js | 11 typedefs/interfaces/functions | ads.ts |
| queue.js | 3 typedefs/interfaces/functions | queue.ts |
| offline.js | 11 typedefs/interfaces | offline.ts |
| offline_compat_v1.js | 5 typedefs | offline_compat_v1.ts |
| offline_compat_v2.js | 5 typedefs | offline_compat_v2.ts |
| player.js | 46+ typedefs | player.ts |

## Conversion Rules

### Typedefs → TypeScript Interfaces

Closure `@typedef` with object properties becomes a TypeScript `interface`:

```javascript
// Original (externs/shaka/resolution.js)
/**
 * @typedef {{
 *   width: number,
 *   height: number
 * }}
 */
shaka.extern.Resolution;
```

```typescript
// Converted (ts/lib/types/resolution.ts)
export interface Resolution {
  width: number;
  height: number;
}
```

### Nullable Properties

Preserve nullability exactly as defined in the externs:

```javascript
// Original
/**
 * @typedef {{
 *   uri: string,
 *   data: ?ArrayBuffer
 * }}
 */
```

```typescript
// Converted
export interface Example {
  uri: string;
  data: ArrayBuffer | null;
}
```

### Optional Properties

Closure uses `(type|undefined)` for optional fields:

```javascript
// Original
/**
 * @typedef {{
 *   width: number,
 *   height: (number|undefined)
 * }}
 */
```

```typescript
// Converted
export interface Example {
  width: number;
  height?: number;
}
```

### Interfaces → TypeScript Interfaces

Closure `@interface` maps directly:

```javascript
// Original (externs/shaka/abortable.js)
/**
 * @interface
 * @template T
 */
shaka.extern.IAbortableOperation = class {
  /** @return {!Promise} */
  abort() {}
  /** @param {function(*)=} onFinal */
  finally(onFinal) {}
};
/** @const {!Promise.<T>} */
shaka.extern.IAbortableOperation.prototype.promise;
```

```typescript
// Converted (ts/lib/types/abortable.ts)
export interface IAbortableOperation<T> {
  readonly promise: Promise<T>;
  abort(): Promise<void>;
  finally(onFinal?: (value: unknown) => void): void;
}
```

### Function Typedefs → TypeScript Type Aliases

Closure function typedefs become type aliases:

```javascript
// Original
/**
 * @typedef {function():!shaka.extern.AbrManager}
 */
shaka.extern.AbrManager.Factory;
```

```typescript
// Converted
export type AbrManagerFactory = () => AbrManager;
```

### Factory Pattern

Many externs follow the Factory pattern. Keep them as type aliases nested in the same file as their interface:

```typescript
// ts/lib/types/abr_manager.ts
export interface AbrManager {
  init(switchCallback: AbrManagerSwitchCallback): void;
  stop(): void;
  // ...
}

export type AbrManagerSwitchCallback = (variant: Variant) => void;
export type AbrManagerFactory = () => AbrManager;
```

## Type Cross-Dependencies

Types reference each other. The conversion order within `ts/lib/types/` matters:

### Tier 1: No Dependencies
- `resolution.ts` — standalone
- `codecs.ts` — standalone
- `mp4_parser.ts` — standalone (references util types by name only)

### Tier 2: Minimal Dependencies
- `error.ts` — references util.Error enums
- `drm_info.ts` — standalone typedef
- `abortable.ts` — references util.Error
- `net.ts` — references DrmInfo

### Tier 3: Core Types
- `manifest.ts` — references DrmInfo, media types (PresentationTimeline, SegmentIndex, SegmentReference)
- `text.ts` — references text.Cue, util.IDestroyable
- `cea.ts` — references text.Cue
- `transmuxer.ts` — references Stream, media.SegmentReference

### Tier 4: Manager Interfaces
- `abr_manager.ts` — references Variant, Request, RequestContext
- `manifest_parser.ts` — references Manifest, Stream, NetworkingEngine
- `adaptation_set_criteria.ts` — references Variant, AudioPreference, VideoPreference

### Tier 5: Feature Types
- `ads.ts` — references ID3Metadata, MetadataFrame, TimelineRegionInfo
- `queue.ts` — references PlayerConfiguration, ExtraText, ExtraChapter
- `offline.ts` — references DrmInfo, Stream, ThumbnailSprite
- `offline_compat_v1.ts` — references DrmInfo
- `offline_compat_v2.ts` — references DrmInfo

### Tier 6: Configuration (largest file)
- `player.ts` — references nearly all other types. Contains all configuration interfaces, track types, stats, metadata types. This file should be converted last within types/.

## Detailed Type Inventory

### resolution.ts
```
Resolution { width, height }
```

### codecs.ts
```
VideoCodec { codec, profiles, levels, bitDepths }
AudioCodec { codec, profiles }
ImageCodec { codec }
TextCodec { codec }
```

### error.ts
```
RestrictionInfo { hasAppRestrictions, missingKeys, restrictedKeyStatuses }
Error (interface) { severity, category, code, data, handled }
```

### drm_info.ts
```
InitDataOverride { initData, initDataType, keyId }
DrmInfo { keySystem, encryptionScheme, licenseServerUri, distinctiveIdentifierRequired,
          persistentStateRequired, audioRobustness, videoRobustness, serverCertificate,
          serverCertificateUri, sessionType, initData, keyIds, mediaTypes }
```

### net.ts
```
RetryParameters { maxAttempts, baseDelay, backoffFactor, fuzzFactor, timeout,
                  stallTimeout, connectionTimeout }
Request { uris, method, body, headers, allowCrossSiteCredentials, retryParameters,
          licenseRequestType, sessionId, drmInfo, initData, initDataType,
          streamDataCallback }
Response { uri, originalUri, data, status, headers, timeMs, fromCache }
SchemePlugin (function type)
SchemePluginConfig { progressUpdated, headersReceived }
ProgressUpdated (callback type)
HeadersReceived (callback type)
RequestContext { type, stream, segment }
RequestFilter (function type)
ResponseFilter (function type)
```

### manifest.ts
```
Manifest { presentationTimeline, minBufferTime, offlineSessionIds, variants,
           textStreams, imageStreams, nextUrl, serviceDescription, sequenceMode,
           ignoreDrmInfo, type, isLowLatency, startTime }
Period { id, audioStreams, videoStreams, textStreams, imageStreams }
ServiceDescription { targetLatency, maxLatency, maxPlaybackRate, minLatency,
                     minPlaybackRate }
Variant { id, language, disabledUntilTime, primary, audio, video, bandwidth,
          allowedByApplication, allowedByKeySystem, decodingInfos }
CreateSegmentIndexFunction (function type)
aesKey { bitsKey, blockCipherMode, iv, firstMediaSequenceNumber }
FetchCryptoKeysFunction (function type)
SegmentIndex (interface) { find, get, offset, merge, evict, fit, updateEvery, release }
Stream { id, originalId, groupId, createSegmentIndex, segmentIndex, mimeType, codecs,
         frameRate, pixelAspectRatio, hdr, colorGamut, videoLayout, bandwidth, width,
         height, kind, encrypted, drmInfos, keyIds, language, originalLanguage, label,
         type, primary, trickModeVideo, dependencyStream, emsgSchemeIdUris, roles,
         forced, channelsCount, audioSamplingRate, spatialAudio, closedCaptions,
         tilesLayout, accessibilityPurpose, external, fastSwitching, fullMimeTypes,
         isAudioMuxedInVideo, baseOriginalId }
ThumbnailSprite { height, positionX, positionY, width }
```

### text.ts
```
TextParser (interface) { parseInit, parseMedia, setSequenceMode, setManifestType }
TextParser.TimeContext { periodStart, segmentStart, segmentEnd, vttOffset }
TextParser.ModifyCueCallback (function type)
TextParserPlugin (function type)
TextDisplayer (interface) { configure, remove, append, destroy, isTextVisible,
                            setTextVisibility, setTextLanguage, enableTextDisplayer }
TextDisplayer.Factory (function type)
```

### cea.ts
```
ICeaParser (interface) { init, parse }
ICeaParser.CaptionPacket { pts, type, ccData0, ccData1, order }
ICaptionDecoder (interface) { extract, extractRaw608, decode, clear, getStreams }
ICaptionDecoder.ClosedCaption { stream, cue }
CeaParserPlugin (function type)
CaptionDecoderPlugin (function type)
```

### transmuxer.ts
```
Transmuxer (interface) { destroy, isSupported, convertCodecs, getOriginalMimeType,
                         transmux }
TransmuxerOutput { data, captions, metadata }
TransmuxerPlugin (function type)
```

### abortable.ts
```
IAbortableOperation<T> (interface) { promise, abort, finally }
```

### abr_manager.ts
```
AbrManager (interface) { init, stop, release, enable, disable, segmentDownloaded,
                         trySuggestStreams, getBandwidthEstimate, setVariants,
                         playbackRateChanged, chooseVariant, configure, setMediaElement,
                         setCmsdManager }
AbrManager.SwitchCallback (function type)
AbrManager.Factory (function type)
```

### manifest_parser.ts
```
ManifestParser (interface) { configure, start, stop, update, onExpirationUpdated,
                             onInitialVariantChosen, banLocation, setMediaElement }
ManifestParser.PlayerInterface { networkingEngine, modifyManifestRequest, modifySegmentRequest,
                                  filter, makeTextStreamsForClosedCaptions, onTimelineRegionAdded,
                                  onEvent, onError, isLowLatencyMode, updateDuration,
                                  newDrmInfo, onManifestUpdated, getBandwidthEstimate,
                                  onMetadata, disableStream, addFont, getConfiguration }
ManifestParser.Factory (function type)
```

### adaptation_set_criteria.ts
```
AdaptationSetCriteria (interface) { create, configure }
AdaptationSetCriteria.Factory (function type)
AdaptationSetCriteria.Configuration { preferredAudio, preferredVideo, language, role,
                                       channelCount, hdrLevel, spatialAudio, videoLayout,
                                       audioLabel, videoLabel, codecSwitchingStrategy, keySystem }
```

### mp4_parser.ts
```
ParsedBox { name, parser, partialOkay, stopOnPartial, start, size, version, flags,
            reader, has64BitSize }
```

### ads.ts
```
AdsStats { loadTimes, started, playedCompletely, skipped }
AdCuePoint { start, end }
AdInterstitial { id, groupId, startTime, endTime, uri, mimeType, isSkippable,
                  skipOffset, skipFor, canJump, resumeOffset, playoutLimit,
                  once, pre, post, timelineRange, loop, overlay, displayOnBackground,
                  currentVideo }
AdPositionInfo { totalAds, adPosition, podIndex, position, isBumper }
AdTrackingInfo { uri, bitrate, width, height, mimeType }
AdTrackingEvent { uri, startTime, endTime }
IAdManager (interface) { configure, requestClientSideAds, requestServerSideStream,
                          replaceServerSideAdTagParameters, getServerSideCuePoints,
                          getCuePoints, getStats, onDASHInterstitialSupport,
                          onHLSInterstitialSupport, addCustomInterstitial,
                          getInterstitialPlayer, onCueMetadataChange, onHlsTimedMetadata }
IAdManager.Factory (function type)
IAd (interface) { needsSkipUI, isClientRendering, getDuration, getMinSuggestedDuration,
                   getRemainingTime, isPaused, isSkippable, getTimeUntilSkippable,
                   canSkipNow, skip, pause, play, getVolume, setVolume, isMuted,
                   isLinear, resize, setMuted, getSequenceLength, getPositionInSequence,
                   getTitle, getDescription, getVastMediaBitrate, getVastMediaWidth,
                   getVastMediaHeight, getAdId, getCreativeAdId, getAdvertiserName,
                   getMediaUrl, getTimeOffset, getPodIndex, release }
```

### queue.ts
```
QueueItem { url, mimeType, startTime, config, extraText, extraChapter }
IQueueManager (interface) { configure, getCurrentItem, getCurrentItemIndex, getItems,
                             insertItems, removeAllItems, moveItem, playItem,
                             playPrevious, playNext, onCurrentItemChanged,
                             getCurrentPlayer }
IQueueManager.Factory (function type)
```

### offline.ts
```
OfflineSupport (map type)
StoredContent { offlineUri, originalManifestUri, duration, size, tracks, appMetadata,
                isIncomplete }
ManifestDB { creationTime, originalManifestUri, duration, size, expiration, streams,
              sessionIds, drmInfo, appMetadata, isIncomplete, sequenceMode }
StreamDB { id, originalId, groupId, primary, type, mimeType, codecs, frameRate,
            pixelAspectRatio, hdr, colorGamut, videoLayout, kind, language,
            originalLanguage, label, width, height, encrypted, keyIds, segments,
            variantIds, roles, forced, channelsCount, audioSamplingRate,
            spatialAudio, closedCaptions, tilesLayout, external, fastSwitching,
            isAudioMuxedInVideo, baseOriginalId }
SegmentDB { initSegmentKey, startTime, endTime, appendWindowStart, appendWindowEnd,
             timestampOffset, tilesLayout, pendingSegmentRefId, pendingInitSegmentRefId,
             dataKey, mimeType, codecs, thumbnailSprite }
SegmentDataDB { data }
EmeSessionDB { sessionId, keySystem, licenseUri, serverCertificate, audioCapabilities,
                videoCapabilities }
StorageCell (interface) { destroy, hasFixedKeySpace, addSegments, removeSegments,
                          getSegments, addManifests, updateManifest, removeManifests,
                          getManifests, getAllManifests }
EmeSessionStorageCell (interface) { destroy, getAll, add, remove }
StorageCellHandle { cell, path }
```

### offline_compat_v1.ts
```
ManifestDBV1 { key, originalManifestUri, duration, size, expiration, periods,
                sessionIds, drmInfo, appMetadata }
PeriodDBV1 { startTime, streams }
StreamDBV1 { id, primary, presentationTimeOffset, contentType, mimeType, codecs,
              frameRate, kind, language, label, width, height, initSegmentUri, encrypted,
              keyId, segments, variantIds }
SegmentDBV1 { startTime, endTime, uri }
SegmentDataDBV1 { key, data }
```

### offline_compat_v2.ts
```
ManifestDBV2 { originalManifestUri, duration, size, expiration, periods,
                sessionIds, drmInfo, appMetadata }
PeriodDBV2 { startTime, streams }
StreamDBV2 { id, primary, presentationTimeOffset, contentType, mimeType, codecs,
              frameRate, kind, language, label, width, height, initSegmentKey, encrypted,
              keyId, segments, variantIds }
SegmentDBV2 { startTime, endTime, dataKey }
SegmentDataDBV2 { data }
```

### player.ts (46+ types)

This is the largest extern file. Types are grouped by category:

**Track & Playback Info:**
```
TrackChoice { timestamp, id, type, fromAdaptation, bandwidth }
StateChange { timestamp, state, duration }
Stats { width, height, streamBandwidth, decodedFrames, droppedFrames, corruptedFrames,
        estimatedBandwidth, completionPercent, loadLatency, manifestTimeSeconds,
        drmTimeSeconds, playTime, pauseTime, bufferingTime, licenseTime,
        liveLatency, maxSegmentDuration, manifestSizeBytes, bytesDownloaded,
        nonFatalErrorCount, manifestPeriodCount, manifestGapCount, stateHistory,
        switchHistory, gapsJumped, stallsDetected }
BufferedRange { start, end }
BufferedInfo { total, audio, video, text }
Track { id, active, type, bandwidth, language, label, kind, width, height, frameRate,
        pixelAspectRatio, hdr, colorGamut, videoLayout, mimeType, audioMimeType,
        videoMimeType, codecs, audioCodec, videoCodec, primary, roles, audioRoles,
        forced, videoId, audioId, channelsCount, audioSamplingRate, spatialAudio,
        tilesLayout, audioBandwidth, videoBandwidth, originalVideoId, originalAudioId,
        originalTextId, originalImageId, accessibilityPurpose, originalLanguage,
        originalImageMimeType }
AudioTrack, TextTrack, VideoTrack, ImageTrack, ChapterTrack (variants of Track)
TrackList (array type)
```

**Restrictions & DRM Support:**
```
Restrictions { minWidth, maxWidth, minHeight, maxHeight, minPixels, maxPixels,
               minFrameRate, maxFrameRate, minBandwidth, maxBandwidth,
               minChannelsCount, maxChannelsCount }
DrmSupportType { persistentState }
SupportType { manifest, media, drm }
```

**Metadata:**
```
ID3Metadata { cueTime, data, frames, durationTime }
MetadataRawFrame { type, size, data }
MetadataFrame { key, data, description, mimeType, pictureType }
PlaybackInfo, PlaybackStreamInfo
HLSMetadata { type, id3Data }
```

**Timeline & Regions:**
```
TimelineRegionInfo { schemeIdUri, id, value, startTime, endTime, eventElement,
                      eventNode, message, data }
EmsgTimelineRegionInfo (extends TimelineRegionInfo)
MetadataTimelineRegionInfo (extends TimelineRegionInfo)
MediaQualityInfo { bandwidth, audioSamplingRate, codecs, contentType, frameRate,
                    height, mimeType, channelsCount, pixelAspectRatio, width, label,
                    roles, language }
EmsgInfo { startTime, endTime, schemeIdUri, value, timescale, presentationTimeDelta,
            eventDuration, id, messageData }
ProducerReferenceTime { id, wallClockTime, presentationTime }
```

**DRM Configuration:**
```
AdvancedDrmConfiguration { distinctiveIdentifierRequired, persistentStateRequired,
                            videoRobustness, audioRobustness, sessionType,
                            serverCertificate, serverCertificateUri,
                            individualizationServer, headers }
DrmSessionMetadata { sessionId, sessionType, initData, isLoaded }
PersistentSessionMetadata { sessionId, initData }
DrmConfiguration { retryParameters, servers, clearKeys, advanced, delayLicenseRequestUntilPlayed,
                    initDataTransform, logLicenseExchange, updateExpirationTime,
                    preferredKeySystems, keySystemsMapping, parseInbandPsshEnabled,
                    minHdcpVersion, ignoreDuplicateInitData, defaultAudioRobustnessForWidevine,
                    defaultVideoRobustnessForWidevine }
InitDataTransform (function type)
```

**Manifest Configuration:**
```
xml.Node { tagName, attributes, children, parent, textContent }
DashManifestConfiguration { clockSyncUri, disableXlinkProcessing, xlinkFailGracefully,
                             ignoreMinBufferTime, autoCorrectDrift, initialSegmentLimit,
                             ignoreSuggestedPresentationDelay, ignoreEmptyAdaptationSet,
                             ignoreMaxSegmentDuration, keySystemsByURI, manifestPreprocessor,
                             manifestPreprocessorTXml, sequenceMode, multiTypeVariantsAllowed,
                             useStreamOnceInPeriodFlattening, updatePeriod, enableAudioGroups,
                             ignoreSupplementalCodecs }
HlsManifestConfiguration { ignoreTextStreamFailures, ignoreImageStreamFailures,
                             defaultAudioCodec, defaultVideoCodec, ignoreManifestProgramDateTime,
                             ignoreManifestProgramDateTimeForTypes, mediaPlaylistFullMimeType,
                             useSafariBehaviorForLive, liveSegmentsDelay,
                             sequenceMode, ignoreManifestTimestampsInSegmentsMode,
                             disableCodecGuessing, disableClosedCaptionsDetection,
                             allowLowLatencyByteRangeOptimization, allowMediaPlaylistRetryOnLiveStreams }
MsfManifestConfiguration { retryParameters }
ManifestConfiguration { retryParameters, availabilityWindowOverride, disableAudio,
                          disableVideo, disableText, disableThumbnails, defaultPresentationDelay,
                          segmentRelativeVttTiming, raiseFatalErrorOnManifestUpdateRequestFailure,
                          continueLoadingWhenPaused, dash, hls, msf }
```

**Streaming & Playback Configuration:**
```
DynamicTargetLatencyConfiguration { enabled, stabilityThreshold, rebufferIncrement,
                                      maxLatency, maxAttempts, minLatency, maxLatencyChange }
LiveSyncConfiguration { enabled, targetLatency, targetLatencyTolerance, maxPlaybackRate,
                          minPlaybackRate, panicMode, panicThreshold, dynamicTargetLatency }
SpeechToTextConfiguration { enabled, language, apiKey, provider, detectLanguage }
StreamingConfiguration { retryParameters, failureCallback, rebufferingGoal, bufferingGoal,
                          bufferBehind, evictionGoal, ignoreTextStreamFailures,
                          alwaysStreamText, startAtSegmentBoundary, gapDetectionThreshold,
                          gapJumpTimerTime, gapPadding, durationBackoff, safeSeekOffset,
                          stallEnabled, stallThreshold, stallSkip, useNativeHlsForFairPlay,
                          inaccurateManifestTolerance, lowLatencyMode, autoLowLatencyMode,
                          forceHTTP, forceHTTPS, preferNativeHls, updateIntervalSeconds,
                          dispatchAllEmsgBoxes, observeQualityChanges, maxDisabledTime,
                          parsePrftBox, segmentPrefetchLimit, prefetchAudioLanguages,
                          disableAudioPrefetch, disableVideoPrefetch, disableTextPrefetch,
                          liveSync, allowMediaSourceRecoveries, minTimeBetweenRecoveries,
                          vodDynamicPlaybackRate, vodDynamicPlaybackRateBufferRatio,
                          infiniteLiveStreamDuration, preloadNextUrlWindow,
                          loadTimeout, clearDecodingCache, dontChooseCodecs,
                          shouldFixTimestampOffset, avoidEvictionOnQuotaExceededError,
                          crossBoundaryStrategy, retryOnMissingSegment }
```

**Other Configuration:**
```
NetworkingConfiguration { forceHTTP, forceHTTPS }
MediaSourceConfiguration { sourceBufferExtraFeatures, forceTransmux, insertFakeEncryptionInInit,
                            modifyCueCallback, dispatchAllEmsgBoxes }
AccessibilityConfiguration { enableVisualFeedback, enableSpeechToText, speechToText }
AdsConfiguration { supportsMultipleMediaElements, customPlayheadTracker, skipPlayDetection,
                    supportsServerSideAdInsertion }
AbrConfiguration { enabled, useNetworkInformation, defaultBandwidthEstimate,
                    switchInterval, bandwidthUpgradeTarget, bandwidthDowngradeTarget,
                    restrictions, advanced, cacheLoadThreshold }
AdvancedAbrConfiguration { minTotalBytes, minBytes, fastHalfLife, slowHalfLife,
                            minTimeForSwitch }
CmcdTarget { name, uuid, version, isBehindLiveEdge }
CmcdConfiguration { enabled, sessionId, contentId, rtpSafetyFactor, useHeaders, target }
CmsdConfiguration { enabled, applyMaximumSuggestedBitrate, estimatedThroughputWeightRatio }
LcevcConfiguration { enabled, dynamicPerformanceScaling, logLevel, drawLogo }
OfflineConfiguration { usePersistentLicense, numberOfParallelDownloads, progressCallback,
                        trackSelectionCallback }
TextDisplayerConfiguration { captionsUpdatePeriod }
AudioPreference { language, role, channelsCount, label, codecSwitchingStrategy,
                   spatialAudio, preferredCodecs }
TextPreference { language, role, forced, label, preferredCodecs }
VideoPreference { width, height, frameRate, hdrLevel, videoLayout, label, codecSwitchingStrategy,
                   preferredCodecs }
PlayerConfiguration { drm, manifest, streaming, mediaSource, accessibility, ads, abr,
                       autoShowText, cmcd, cmsd, lcevc, offline, playRangeStart, playRangeEnd,
                       preferredAudioLanguage, preferredAudioLabel, preferredTextLanguage,
                       preferredVariantRole, preferredTextRole, preferredAudioChannelCount,
                       preferredVideoHdrLevel, preferredVideoLayout, preferredVideoLabel,
                       preferredVideoCodecs, preferredAudioCodecs, preferForcedSubs,
                       preferSpatialAudio, preferredDecodingAttributes, restrictions,
                       textDisplayer, adaptationSetCriteria, queue }
QueueConfiguration { retryParameters }
LanguageRole { language, role, label }
Thumbnail { startTime, duration, height, positionX, positionY, width, uris,
             sprite, imageHeight, imageWidth }
Chapter { id, title, startTime, endTime }
ImageInfo { height, width, imageHeight, imageWidth }
ExtraText { uri, language, kind, mime, codecs, label }
ExtraChapter { uri, mime, language }
```

## Utility Type Required

All type files should import from a shared utility file:

```typescript
// ts/lib/types/utility.ts
export type ValueOf<T> = T[keyof T];
```

## Barrel File

After all type files are created, a barrel re-exports everything:

```typescript
// ts/lib/types/index.ts
export * from './utility';
export * from './resolution';
export * from './codecs';
export * from './error';
export * from './drm_info';
export * from './net';
export * from './manifest';
export * from './text';
export * from './cea';
export * from './transmuxer';
export * from './abortable';
export * from './abr_manager';
export * from './manifest_parser';
export * from './adaptation_set_criteria';
export * from './mp4_parser';
export * from './ads';
export * from './queue';
export * from './offline';
export * from './offline_compat_v1';
export * from './offline_compat_v2';
export * from './player';
```

## External API Type Dependencies

Some extern types reference classes from the library itself (not other externs). These create a dependency from `ts/lib/types/` back into `ts/lib/`:

- `shaka.media.PresentationTimeline` — referenced by Manifest
- `shaka.media.SegmentIndex` — referenced by SegmentIndex interface
- `shaka.media.SegmentReference` — referenced by Stream, Transmuxer
- `shaka.media.InitSegmentReference` — referenced by offline types
- `shaka.media.ManifestParser.AccessibilityPurpose` — referenced by Stream
- `shaka.media.AdaptationSet` — referenced by AdaptationSetCriteria
- `shaka.media.PreloadManager` — referenced by QueueItem
- `shaka.text.Cue` — referenced by TextParser, ICaptionDecoder
- `shaka.net.NetworkingEngine` — referenced by ManifestParser.PlayerInterface
- `shaka.util.Error` — referenced by Error interface, IAbortableOperation
- `shaka.util.DataViewReader` — referenced by ParsedBox
- `shaka.util.Mp4Parser` — referenced by ParsedBox
- `shaka.util.CmsdManager` — referenced by AbrManager
- `shaka.util.IDestroyable` — referenced by TextDisplayer, StorageCell

**Resolution strategy:** For these references, use `import type` from the respective module. During early conversion phases (before the referenced modules exist), use forward-declared interfaces or type placeholders that get replaced when the real module is converted.
