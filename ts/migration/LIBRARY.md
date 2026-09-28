# Shaka Player Library Structure

Reference document for the TypeScript migration. Describes the original JavaScript library in `/lib`, its modules, dependencies, and the conversion order.

## Overview

- **234 JavaScript files** across 21 modules plus root `player.js`
- **~102,000 lines of code**
- Google Closure module system (`goog.provide` / `goog.require`)
- Closure Compiler JSDoc type annotations
- ES6 class syntax throughout

## Module Inventory

### config (4 files, ~108 lines)
Codec switching strategy enums and configuration constants.

| File | Provides | Description |
|------|----------|-------------|
| auto_show_text.js | shaka.config.AutoShowText | Auto-show text track strategy enum |
| codec_switching_strategy.js | shaka.config.CodecSwitchingStrategy | Codec switching strategy enum |
| spatial_audio.js | shaka.config.SpatialAudio | Spatial audio mode enum |
| vp_profile.js | shaka.config.VpProfile | VP9/VP8 profile enum |

**Dependencies:** None

---

### debug (3 files, ~254 lines)
Logging and debug assertion utilities.

| File | Provides | Description |
|------|----------|-------------|
| asserts.js | shaka.debug.Asserts | Debug assertion helpers |
| log.js | shaka.debug.Log | Logging with configurable levels |
| log_utils.js | shaka.debug.LogUtils | Log formatting utilities |

**Dependencies:** None

---

### deprecate (3 files, ~275 lines)
Deprecation tracking and warning utilities.

| File | Provides | Description |
|------|----------|-------------|
| enforcer.js | shaka.deprecate.Enforcer | Enforces deprecation deadlines |
| version.js | shaka.deprecate.Version | Version comparison for deprecation |
| deprecate.js | shaka.Deprecate | Public deprecation API |

**Dependencies:** None

---

### util (52 files, ~20,879 lines)
Core utility classes used throughout the entire library. This is the largest module.

| File | Provides | Description |
|------|----------|-------------|
| abortable_operation.js | shaka.util.AbortableOperation | Abortable async operations (implements IAbortableOperation) |
| array_utils.js | shaka.util.ArrayUtils | Array helper functions |
| buffer_utils.js | shaka.util.BufferUtils | ArrayBuffer manipulation |
| cmcd_manager.js | shaka.util.CmcdManager | Common Media Client Data manager |
| cmsd_manager.js | shaka.util.CmsdManager | Common Media Server Data manager |
| config_utils.js | shaka.util.ConfigUtils | Configuration merge/clone utilities |
| content_steering_manager.js | shaka.util.ContentSteeringManager | Content steering for CDN selection |
| data_view_reader.js | shaka.util.DataViewReader | Binary data reader |
| data_view_writer.js | shaka.util.DataViewWriter | Binary data writer |
| delayed_tick.js | shaka.util.DelayedTick | Delayed callback execution |
| destroyer.js | shaka.util.Destroyer | Resource cleanup helper |
| dom_utils.js | shaka.util.Dom | DOM manipulation utilities |
| error.js | shaka.util.Error | Custom error class with categories/codes |
| event_manager.js | shaka.util.EventManager | Event listener management |
| exp_golomb.js | shaka.util.ExpGolomb | Exponential-Golomb decoder |
| fake_event.js | shaka.util.FakeEvent | Synthetic event implementation |
| fake_event_target.js | shaka.util.FakeEventTarget | EventTarget implementation |
| functional.js | shaka.util.Functional | Functional programming helpers |
| i_destroyable.js | shaka.util.IDestroyable | Destroyable interface |
| i_releasable.js | shaka.util.IReleasable | Releasable interface |
| id3_utils.js | shaka.util.Id3Utils | ID3 tag parsing |
| iterables.js | shaka.util.Iterables | Iterable utilities |
| language_utils.js | shaka.util.LanguageUtils | Language/locale matching |
| lazy.js | shaka.util.Lazy | Lazy initialization wrapper |
| manifest_parser_utils.js | shaka.util.ManifestParserUtils | Shared manifest parsing helpers |
| map_utils.js | shaka.util.MapUtils | Map/object utilities |
| media_element_event.js | shaka.util.MediaElementEvent | Media element event types |
| media_ready_state_utils.js | shaka.util.MediaReadyState | Media ready state helpers |
| mime_utils.js | shaka.util.MimeUtils | MIME type parsing/matching |
| mp4_box_parsers.js | shaka.util.Mp4BoxParsers | MP4 box field parsers |
| mp4_generator.js | shaka.util.Mp4Generator | MP4 segment generator |
| mp4_parser.js | shaka.util.Mp4Parser | MP4 box-level parser |
| multi_map.js | shaka.util.MultiMap | Multi-value map |
| mutex.js | shaka.util.Mutex | Async mutex lock |
| number_utils.js | shaka.util.NumberUtils | Numeric utilities |
| object_utils.js | shaka.util.ObjectUtils | Object manipulation utilities |
| operation_manager.js | shaka.util.OperationManager | Manages concurrent operations |
| periods.js | shaka.util.PeriodCombiner | Combines multi-period manifests |
| player_configuration.js | shaka.util.PlayerConfiguration | Default configuration builder |
| pssh.js | shaka.util.Pssh | PSSH (DRM init data) parser |
| public_promise.js | shaka.util.PublicPromise | Externally-resolvable promise |
| state_history.js | shaka.util.StateHistory | State transition history |
| stats.js | shaka.util.Stats | Playback statistics tracker |
| stream_utils.js | shaka.util.StreamUtils | Stream selection/filtering |
| string_utils.js | shaka.util.StringUtils | String encoding/decoding |
| switch_history.js | shaka.util.SwitchHistory | Track switch history |
| tXml.js | shaka.util.TXml | XML parser (lightweight) |
| text_parser.js | shaka.util.TextParser | Text stream parser base |
| time_utils.js | shaka.util.TimeUtils | Time conversion utilities |
| timer.js | shaka.util.Timer | Repeating/one-shot timer |
| ts_parser.js | shaka.util.TsParser | MPEG-TS parser |
| uint8array_utils.js | shaka.util.Uint8ArrayUtils | Uint8Array helpers |

**Dependencies:** abr, config, device, drm, lcevc, media, text, transmuxer (note: some util files reference other modules — these circular deps need careful handling during conversion)

---

### net (7 files, ~2,172 lines)
HTTP networking, request/response pipeline, and scheme plugins.

| File | Provides | Description |
|------|----------|-------------|
| backoff.js | shaka.net.Backoff | Retry backoff logic |
| data_uri_plugin.js | shaka.net.DataUriPlugin | data: URI scheme handler |
| http_fetch_plugin.js | shaka.net.HttpFetchPlugin | Fetch API HTTP handler |
| http_plugin_utils.js | shaka.net.HttpPluginUtils | Shared HTTP utilities |
| http_xhr_plugin.js | shaka.net.HttpXHRPlugin | XMLHttpRequest HTTP handler |
| networking_engine.js | shaka.net.NetworkingEngine | Request pipeline with filters |
| networking_utils.js | shaka.net.NetworkingUtils | Network helper functions |

**Dependencies:** util

---

### abr (3 files, ~842 lines)
Adaptive bitrate estimation and switching.

| File | Provides | Description |
|------|----------|-------------|
| ewma.js | shaka.abr.Ewma | Exponentially weighted moving average |
| ewma_bandwidth_estimator.js | shaka.abr.EwmaBandwidthEstimator | Bandwidth estimation |
| simple_abr_manager.js | shaka.abr.SimpleAbrManager | Default ABR implementation |

**Dependencies:** util

---

### lcevc (1 file, ~244 lines)
Low Complexity Enhancement Video Codec integration.

| File | Provides | Description |
|------|----------|-------------|
| lcevc_dec.js | shaka.lcevc.Dec | LCEVC decoder wrapper |

**Dependencies:** util

---

### device (14 files, ~2,560 lines)
Device detection and platform-specific configuration.

| File | Provides | Description |
|------|----------|-------------|
| abstract_device.js | shaka.device.AbstractDevice | Base device implementation |
| default_browser.js | shaka.device.DefaultBrowser | Default browser device |
| device_factory.js | shaka.device.DeviceFactory | Device detection factory |
| i_device.js | shaka.device.IDevice | Device interface |
| apple_browser.js | shaka.device.AppleBrowser | Safari/WebKit device |
| chromecast.js | shaka.device.Chromecast | Chromecast device |
| e_browser.js | shaka.device.EBrowser | Edge browser device |
| hisense.js | shaka.device.Hisense | Hisense TV device |
| ms_edge.js | shaka.device.MsEdge | Legacy Edge device |
| playstation.js | shaka.device.PlayStation | PlayStation device |
| tizen.js | shaka.device.Tizen | Samsung Tizen TV device |
| titan_os.js | shaka.device.TitanOs | TitanOS device |
| webos.js | shaka.device.WebOs | LG webOS TV device |
| xbox.js | shaka.device.Xbox | Xbox device |

**Dependencies:** config, debug, drm, util

---

### drm (4 files, ~4,002 lines)
DRM/EME (Encrypted Media Extensions) management.

| File | Provides | Description |
|------|----------|-------------|
| content_protection.js | shaka.drm.ContentProtection | DRM content protection parsing |
| drm_engine.js | shaka.drm.DrmEngine | Core DRM session management |
| drm_utils.js | shaka.drm.DrmUtils | DRM helper functions |
| media_key_system_polyfill_manager.js | shaka.drm.MediaKeySystemPolyfillManager | MediaKeySystem polyfills |

**Dependencies:** device, net, util

---

### cea (12 files, ~4,148 lines)
CEA-608/708 closed caption parsing and decoding.

| File | Provides | Description |
|------|----------|-------------|
| cea608_data_channel.js | shaka.cea.Cea608DataChannel | CEA-608 data channel |
| cea608_memory.js | shaka.cea.Cea608Memory | CEA-608 display memory |
| cea708_service.js | shaka.cea.Cea708Service | CEA-708 service handler |
| cea708_window.js | shaka.cea.Cea708Window | CEA-708 caption window |
| cea_decoder.js | shaka.cea.CeaDecoder | Combined CEA decoder |
| cea_utils.js | shaka.cea.CeaUtils | CEA utilities and StyledChar |
| dtvcc_packet_builder.js | shaka.cea.DtvccPacketBuilder, shaka.cea.DtvccPacket | DTVCC packet construction |
| dummy_caption_decoder.js | shaka.cea.DummyCaptionDecoder | No-op caption decoder |
| dummy_cea_parser.js | shaka.cea.DummyCeaParser | No-op CEA parser |
| mp4_cea_parser.js | shaka.cea.Mp4CeaParser | MP4 CEA caption parser |
| sei_processor.js | shaka.cea.SeiProcessor | SEI NAL unit processor |
| ts_cea_parser.js | shaka.cea.TsCeaParser | MPEG-TS CEA parser |

**Dependencies:** media, text, util

---

### text (14 files, ~7,641 lines)
Subtitle/caption parsing and rendering.

| File | Provides | Description |
|------|----------|-------------|
| cue.js | shaka.text.Cue | Text cue data structure |
| cue_region.js | shaka.text.CueRegion | Cue region positioning |
| mp4_ttml_parser.js | shaka.text.Mp4TtmlParser | TTML in MP4 parser |
| mp4_vtt_parser.js | shaka.text.Mp4VttParser | WebVTT in MP4 parser |
| native_text_displayer.js | shaka.text.NativeTextDisplayer | Native browser text display |
| speech_to_text.js | shaka.text.SpeechToText | Speech-to-text integration |
| srt_text_parser.js | shaka.text.SrtTextParser | SRT subtitle parser |
| stub_text_displayer.js | shaka.text.StubTextDisplayer | No-op text displayer stub |
| text_engine.js | shaka.text.TextEngine | Text stream engine |
| text_utils.js | shaka.text.Utils | Text utility functions |
| ttml_text_parser.js | shaka.text.TtmlTextParser | TTML subtitle parser |
| ui_text_displayer.js | shaka.text.UITextDisplayer | DOM-based cue renderer |
| vtt_text_parser.js | shaka.text.VttTextParser | WebVTT subtitle parser |
| web_vtt_generator.js | shaka.text.WebVttGenerator | WebVTT output generator |

**Dependencies:** config, device, media, util

---

### transmuxer (15 files, ~4,388 lines)
Container format conversion (transmuxing).

| File | Provides | Description |
|------|----------|-------------|
| aac_transmuxer.js | shaka.transmuxer.AacTransmuxer | AAC to MP4 transmuxer |
| ac3_transmuxer.js | shaka.transmuxer.Ac3Transmuxer | AC-3 to MP4 transmuxer |
| adts_transmuxer.js | shaka.transmuxer.AdtsTransmuxer | ADTS to MP4 transmuxer |
| ec3_transmuxer.js | shaka.transmuxer.Ec3Transmuxer | E-AC-3 to MP4 transmuxer |
| mp3_transmuxer.js | shaka.transmuxer.Mp3Transmuxer | MP3 to MP4 transmuxer |
| mss_transmuxer.js | shaka.transmuxer.MssTransmuxer | MSS to MP4 transmuxer |
| opus_transmuxer.js | shaka.transmuxer.OpusTransmuxer | Opus to MP4 transmuxer |
| ts_transmuxer.js | shaka.transmuxer.TsTransmuxer | MPEG-TS to MP4 transmuxer |
| transmuxer_engine.js | shaka.transmuxer.TransmuxerEngine | Transmuxer plugin registry |
| codec_worker.js | shaka.transmuxer.CodecWorker | Web Worker codec processing |
| codec_worker_main.js | shaka.transmuxer.CodecWorkerMain | Worker entry point |
| h264.js | shaka.transmuxer.H264 | H.264 NAL unit parsing |
| h265.js | shaka.transmuxer.H265 | H.265 NAL unit parsing |
| av1.js | shaka.transmuxer.Av1 | AV1 OBU parsing |
| flac_transmuxer.js | shaka.transmuxer.FlacTransmuxer | FLAC to MP4 transmuxer |

**Dependencies:** media, util

---

### media (25 files, ~16,880 lines)
Core playback engine, buffering, adaptation, and segment management.

| File | Provides | Description |
|------|----------|-------------|
| adaptation_set.js | shaka.media.AdaptationSet | Variant grouping for ABR |
| buffering_observer.js | shaka.media.BufferingObserver | Buffer state monitoring |
| closed_caption_parser.js | shaka.media.ClosedCaptionParser | In-band caption extraction |
| content_workarounds.js | shaka.media.ContentWorkarounds | Content-specific fixes |
| gap_jumping_controller.js | shaka.media.GapJumpingController, shaka.media.StallDetector | Gap detection/skipping and stall detection |
| manifest_filterer.js | shaka.media.ManifestFilterer | Manifest stream filtering |
| manifest_parser.js | shaka.media.ManifestParser | Manifest parser registry |
| media_source_capabilities.js | shaka.media.Capabilities | MSE capability detection |
| media_source_engine.js | shaka.media.MediaSourceEngine | MediaSource API wrapper |
| play_rate_controller.js | shaka.media.PlayRateController | Playback rate management |
| playhead.js | shaka.media.Playhead, shaka.media.MediaSourcePlayhead, shaka.media.SrcEqualsPlayhead | Playhead position management |
| playhead_observer.js | shaka.media.IPlayheadObserver, shaka.media.PlayheadObserverManager | Playhead change monitoring |
| preference_based_criteria.js | shaka.media.PreferenceBasedCriteria | Preference-based track selection |
| preload_manager.js | shaka.media.PreloadManager | Content preloading |
| presentation_timeline.js | shaka.media.PresentationTimeline | Live/VOD timeline |
| quality_observer.js | shaka.media.QualityObserver | Quality change detection |
| region_observer.js | shaka.media.RegionObserver | Timeline region monitoring |
| region_timeline.js | shaka.media.RegionTimeline | Region metadata storage |
| segment_index.js | shaka.media.SegmentIndex, shaka.media.SegmentIterator, shaka.media.MetaSegmentIndex | Segment lookup structure |
| segment_prefetch.js | shaka.media.SegmentPrefetch | Segment prefetching |
| segment_reference.js | shaka.media.InitSegmentReference, shaka.media.SegmentReference | Segment metadata |
| segment_utils.js | shaka.media.SegmentUtils | Segment utility functions |
| streaming_engine.js | shaka.media.StreamingEngine | Core segment download engine |
| time_ranges_utils.js | shaka.media.TimeRangesUtils | TimeRanges utilities |
| video_wrapper.js | shaka.media.VideoWrapper | Video element wrapper |

**Dependencies:** cea, config, device, drm, net, text, transmuxer, util

---

### queue (1 file, ~447 lines)
Playlist queue management.

| File | Provides | Description |
|------|----------|-------------|
| queue.js | shaka.queue.Queue | Playlist queue implementation |

**Dependencies:** config, util, Player

---

### dash (11 files, ~8,597 lines)
DASH manifest parsing and playback.

| File | Provides | Description |
|------|----------|-------------|
| content_protection.js | shaka.dash.ContentProtection | DASH DRM parsing |
| dash_parser.js | shaka.dash.DashParser | Main DASH parser |
| mpd_utils.js | shaka.dash.MpdUtils | MPD XML utilities |
| segment_base.js | shaka.dash.SegmentBase | SegmentBase parsing |
| segment_list.js | shaka.dash.SegmentList | SegmentList parsing |
| segment_template.js | shaka.dash.SegmentTemplate | SegmentTemplate parsing |
| segment_template_xlink.js | shaka.dash.SegmentTemplateXlink | XLink resolution |
| timeline.js | shaka.dash.Timeline | SegmentTimeline parsing |
| webm_segment_index_parser.js | shaka.dash.WebmSegmentIndexParser | WebM index parsing |
| segment_template_index.js | shaka.dash.SegmentTemplateIndex | Template-based index |
| patch_utils.js | shaka.dash.PatchUtils | MPD patch parsing |

**Dependencies:** abr, drm, media, net, text, util

---

### hls (4 files, ~6,609 lines)
HLS playlist parsing and playback.

| File | Provides | Description |
|------|----------|-------------|
| hls_classes.js | shaka.hls.HlsClasses | HLS data structures |
| hls_parser.js | shaka.hls.HlsParser | Main HLS parser |
| hls_tag.js | shaka.hls.HlsTag | HLS tag representation |
| hls_utils.js | shaka.hls.HlsUtils | HLS utility functions |

**Dependencies:** abr, drm, media, net, util

---

### msf (9 files, ~3,766 lines)
Multi-Stream Format support.

| File | Provides | Description |
|------|----------|-------------|
| control_stream.js | shaka.msf.ControlStream | MSF control stream |
| msf_parser.js | shaka.msf.MsfParser | MSF manifest parser |
| msf_transport.js | shaka.msf.MsfTransport | MSF transport layer |
| msf_utils.js | shaka.msf.MsfUtils | MSF utilities |
| reader.js | shaka.msf.Reader | MSF data reader |
| writer.js | shaka.msf.Writer | MSF data writer |
| isobmff_parser.js | shaka.msf.IsobmffParser | ISO BMFF parser for MSF |
| subscribe_namespace_handler.js | shaka.msf.SubscribeNamespaceHandler | Namespace subscription |
| track_selection.js | shaka.msf.TrackSelection | MSF track selection |

**Dependencies:** drm, media, net, util

---

### ads (15 files, ~8,299 lines)
Advertisement system integration.

| File | Provides | Description |
|------|----------|-------------|
| abstract_ad.js | shaka.ads.AbstractAd | Base ad class |
| ad_manager.js | shaka.ads.AdManager | Main ad manager |
| ad_utils.js | shaka.ads.Utils | Ad helper functions |
| ads_stats.js | shaka.ads.AdsStats | Ad statistics |
| client_side_ad.js | shaka.ads.ClientSideAd | Client-side ad wrapper |
| client_side_ad_manager.js | shaka.ads.ClientSideAdManager | IMA SDK integration |
| interstitial_ad.js | shaka.ads.InterstitialAd | Interstitial ad handler |
| interstitial_ad_manager.js | shaka.ads.InterstitialAdManager | Interstitial management |
| interstitial_static_ad.js | shaka.ads.InterstitialStaticAd | Static interstitial |
| media_tailor_ad.js | shaka.ads.MediaTailorAd | AWS MediaTailor ad |
| media_tailor_ad_manager.js | shaka.ads.MediaTailorAdManager | MediaTailor integration |
| server_side_ad.js | shaka.ads.ServerSideAd | Server-side ad wrapper |
| server_side_ad_manager.js | shaka.ads.ServerSideAdManager | DAI integration |
| svta_ad.js | shaka.ads.SvtaAd | SVTA ad handler |
| svta_ad_manager.js | shaka.ads.SvtaAdManager | SVTA integration |

**Dependencies:** device, media, net, util, Player

---

### polyfill (21 files, ~4,385 lines)
Browser API polyfills and compatibility shims.

| File | Provides | Description |
|------|----------|-------------|
| all.js | shaka.polyfill | Polyfill registry |
| aria.js | shaka.polyfill.Aria | ARIA attribute polyfill |
| encryption_scheme.js | shaka.polyfill.EncryptionScheme | Encryption scheme polyfill |
| fullscreen.js | shaka.polyfill.Fullscreen | Fullscreen API polyfill |
| indexeddb.js | shaka.polyfill.IndexedDB | IndexedDB polyfill |
| input_event.js | shaka.polyfill.InputEvent | InputEvent polyfill |
| languages.js | shaka.polyfill.Languages | Language API polyfill |
| math_round.js | shaka.polyfill.MathRound | Math.round polyfill |
| media_capabilities.js | shaka.polyfill.MediaCapabilities | MediaCapabilities polyfill |
| media_source.js | shaka.polyfill.MediaSource | MediaSource polyfill |
| orientation.js | shaka.polyfill.Orientation | Screen orientation polyfill |
| patchedmediakeys_apple.js | shaka.polyfill.PatchedMediaKeysApple | Apple EME polyfill |
| patchedmediakeys_ms.js | shaka.polyfill.PatchedMediaKeysMs | MS EME polyfill |
| patchedmediakeys_nop.js | shaka.polyfill.PatchedMediaKeysNop | No-op EME polyfill |
| patchedmediakeys_webkit.js | shaka.polyfill.PatchedMediaKeysWebkit | WebKit EME polyfill |
| pip.js | shaka.polyfill.PiP | Picture-in-Picture polyfill |
| symbol.js | shaka.polyfill.Symbol | Symbol polyfill |
| transmuxer.js | shaka.polyfill.Transmuxer | Transmuxer registration |
| video_track.js | shaka.polyfill.VideoTrack | VideoTrack polyfill |
| vtt_cue.js | shaka.polyfill.VTTCue | VTTCue polyfill |
| abort_controller.js | shaka.polyfill.AbortController | AbortController polyfill |

**Dependencies:** device, drm, media, util

---

### cast (4 files, ~3,597 lines)
Chromecast/Cast support.

| File | Provides | Description |
|------|----------|-------------|
| cast_proxy.js | shaka.cast.CastProxy | Cast session proxy |
| cast_receiver.js | shaka.cast.CastReceiver | Cast receiver handler |
| cast_sender.js | shaka.cast.CastSender | Cast sender handler |
| cast_utils.js | shaka.cast.CastUtils | Cast utilities |

**Dependencies:** ads, device, media, util, Player

---

### offline (20 files, ~5,655 lines)
Offline storage and playback.

| File | Provides | Description |
|------|----------|-------------|
| download_manager.js | shaka.offline.DownloadManager | Segment download management |
| download_progress_estimator.js | shaka.offline.DownloadProgressEstimator | Download progress tracking |
| indexeddb/ | | IndexedDB storage implementations |
| indexeddb/base_storage_cell.js | shaka.offline.indexeddb.BaseStorageCell | Base storage cell |
| indexeddb/eme_session_storage_cell.js | shaka.offline.indexeddb.EmeSessionStorageCell | EME session storage |
| indexeddb/v1_storage_cell.js | shaka.offline.indexeddb.V1StorageCell | V1 format storage |
| indexeddb/v2_storage_cell.js | shaka.offline.indexeddb.V2StorageCell | V2 format storage |
| indexeddb/v5_storage_cell.js | shaka.offline.indexeddb.V5StorageCell | V5 format storage |
| manifest_converter.js | shaka.offline.ManifestConverter | Offline manifest conversion |
| offline_manifest_parser.js | shaka.offline.OfflineManifestParser | Offline manifest parser |
| offline_scheme.js | shaka.offline.OfflineScheme | offline: URI scheme |
| offline_uri.js | shaka.offline.OfflineUri | Offline URI handling |
| session_deleter.js | shaka.offline.SessionDeleter | DRM session cleanup |
| storage.js | shaka.offline.Storage | Main offline storage API |
| storage_muxer.js | shaka.offline.StorageMuxer | Storage backend multiplexer |
| stored_content_utils.js | shaka.offline.StoredContentUtils | Stored content helpers |
| stream_bandwidth_estimator.js | shaka.offline.StreamBandwidthEstimator | Bandwidth estimation |
| task_processor.js | shaka.offline.TaskProcessor | Async task processing |
| indexeddb/db_connection.js | shaka.offline.indexeddb.DBConnection | IndexedDB connection |
| indexeddb/db_operation.js | shaka.offline.indexeddb.DBOperation | IndexedDB operation wrapper |

**Dependencies:** device, drm, media, net, text, util, Player

---

### player.js (1 file, ~9,349 lines)
Main Player class — the public API entry point and orchestrator.

**Dependencies:** deprecate, device, drm, lcevc, media, net, text, util

---

## Dependency Graph

```
Layer 0 (no deps):     config, debug, deprecate
Layer 1 (util only):   util*, net, abr, lcevc
Layer 2 (infra):       device → [config, debug, drm]
                        drm → [device, net]
Layer 3 (core):        cea → [media, text]
                        text → [config, device, media]
                        transmuxer → [media]
                        media → [cea, config, device, drm, net, text, transmuxer]
Layer 4 (features):    dash → [abr, drm, media, net, text]
                        hls → [abr, drm, media, net]
                        msf → [drm, media, net]
                        queue → [config, Player]
                        ads → [device, media, net, Player]
                        polyfill → [device, drm, media]
Layer 5 (top):         cast → [ads, device, media, Player]
                        offline → [device, drm, media, net, text, Player]
                        player.js → [deprecate, device, drm, lcevc, media, net, text]
```

*Note: `util` has reverse dependencies on some modules (abr, config, device, drm, lcevc, media, text, transmuxer) in specific files like `PlayerConfiguration`, `StreamUtils`, and `PeriodCombiner`. These circular dependencies must be resolved during conversion — likely by splitting those util files or using late imports.*

## Conversion Order

Strict bottom-up. No module starts until all its dependencies are converted.

### Phase 1: Foundation
1. `ts/lib/types/` — convert all externs to TS interfaces/types
2. `ts/lib/config/` — pure enums, no deps
3. `ts/lib/debug/` — logging, no deps
4. `ts/lib/deprecate/` — deprecation utils, no deps

### Phase 2: Core Utilities
5. `ts/lib/util/` — 52 files, largest module. Start with leaf utilities (Timer, Lazy, PublicPromise, etc.), work toward complex ones (PeriodCombiner, StreamUtils, PlayerConfiguration). Circular deps with other modules need resolution here.

### Phase 3: Networking & ABR
6. `ts/lib/net/` — networking pipeline
7. `ts/lib/abr/` — bandwidth estimation
8. `ts/lib/lcevc/` — LCEVC decoder wrapper

### Phase 4: Device & DRM
9. `ts/lib/device/` — platform detection (14 device files)
10. `ts/lib/drm/` — DRM/EME engine

### Phase 5: Text, Captions & Transmuxing
11. `ts/lib/cea/` — closed caption parsing
12. `ts/lib/text/` — subtitle parsing and rendering
13. `ts/lib/transmuxer/` — container format conversion

### Phase 6: Core Playback
14. `ts/lib/media/` — streaming engine, segment management, playback (25 files, ~17K lines — the hardest phase)

### Phase 7: Protocol Parsers
15. `ts/lib/dash/` — DASH parser
16. `ts/lib/hls/` — HLS parser
17. `ts/lib/msf/` — MSF parser

### Phase 8: Features
18. `ts/lib/queue/` — playlist queue
19. `ts/lib/ads/` — advertisement integration
20. `ts/lib/polyfill/` — browser polyfills

### Phase 9: Integration
21. `ts/lib/cast/` — Chromecast support
22. `ts/lib/offline/` — offline storage

### Phase 10: Entry Point
23. `ts/lib/player.ts` — main Player class

## Circular Dependency Notes

The `util` module has files that depend on other modules:

- `shaka.util.PlayerConfiguration` → references types from media, drm, abr, text, ads, offline, etc.
- `shaka.util.StreamUtils` → references media, drm, text types
- `shaka.util.PeriodCombiner` → references media types
- `shaka.util.CmcdManager` / `shaka.util.CmsdManager` → references media, net types

**Resolution strategy:** These files should use `import type` for type-only dependencies on unconverted modules during early phases. The runtime dependencies may require splitting these files or deferring their full conversion to when their dependencies are available.
