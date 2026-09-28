# Migration Plan

Step-by-step checklist for converting Shaka Player from JavaScript to TypeScript. Each step must pass `tsc --noEmit` before moving to the next.

## Rules

- **Every step must end with a passing `tsc --noEmit`.**
- Complete steps in order — no skipping ahead.
- Commit after each step with a clear message (see RULES.md commit strategy).
- Mark each step `[x]` when done.

---

## Phase 1: Foundation

- [x] **1.1 Project setup** — `package.json`, `tsconfig.json`, `biome.json`, `ts/lib/types/utility.ts` (ValueOf type), `ts/lib/util/assert.ts` (assertion utilities)
- [x] **1.2 Types: standalone** — convert `resolution.ts`, `codecs.ts`, `mp4_parser.ts` (no cross-deps)
- [x] **1.3 Types: error + drm** — convert `error.ts`, `drm_info.ts`, `abortable.ts`
- [ ] **1.4 Types: net** — convert `net.ts` (references DrmInfo)
- [ ] **1.5 Types: manifest** — convert `manifest.ts` (references DrmInfo, media types — use forward declarations)
- [ ] **1.6 Types: text + cea + transmuxer** — convert `text.ts`, `cea.ts`, `transmuxer.ts`
- [ ] **1.7 Types: manager interfaces** — convert `abr_manager.ts`, `manifest_parser.ts`, `adaptation_set_criteria.ts`
- [ ] **1.8 Types: feature types** — convert `ads.ts`, `queue.ts`, `offline.ts`, `offline_compat_v1.ts`, `offline_compat_v2.ts`
- [ ] **1.9 Types: player** — convert `player.ts` (largest type file — all config, track, stats types)
- [ ] **1.10 Types: barrel file** — create `ts/lib/types/index.ts` re-exporting everything

## Phase 2: Core Utilities (52 files)

- [ ] **2.1 Interfaces** — `i_destroyable.ts`, `i_releasable.ts`
- [ ] **2.2 Primitives** — `timer.ts`, `delayed_tick.ts`, `lazy.ts`, `public_promise.ts`, `mutex.ts`
- [ ] **2.3 Data helpers** — `array_utils.ts`, `buffer_utils.ts`, `uint8array_utils.ts`, `string_utils.ts`, `number_utils.ts`, `object_utils.ts`, `map_utils.ts`, `iterables.ts`, `multi_map.ts`
- [ ] **2.4 Functional + Error** — `functional.ts`, `error.ts`, `destroyer.ts`
- [ ] **2.5 Events** — `fake_event.ts`, `fake_event_target.ts`, `event_manager.ts`, `media_element_event.ts`
- [ ] **2.6 Binary parsing** — `data_view_reader.ts`, `data_view_writer.ts`, `exp_golomb.ts`, `text_parser.ts`
- [ ] **2.7 MP4** — `mp4_parser.ts`, `mp4_box_parsers.ts`, `mp4_generator.ts`
- [ ] **2.8 Media utils** — `mime_utils.ts`, `manifest_parser_utils.ts`, `language_utils.ts`, `time_utils.ts`, `media_ready_state_utils.ts`, `dom_utils.ts`
- [ ] **2.9 Networking utils** — `abortable_operation.ts`, `operation_manager.ts`, `content_steering_manager.ts`
- [ ] **2.10 Parsers** — `tXml.ts`, `ts_parser.ts`, `id3_utils.ts`, `pssh.ts`
- [ ] **2.11 Config + Stats** — `config_utils.ts`, `state_history.ts`, `switch_history.ts`, `stats.ts`
- [ ] **2.12 Complex utils** — `stream_utils.ts`, `periods.ts`, `player_configuration.ts`, `cmcd_manager.ts`, `cmsd_manager.ts` (these have cross-module type deps — use `import type`)
- [ ] **2.13 Barrel file** — create `ts/lib/util/index.ts`

## Phase 3: Networking & ABR

- [ ] **3.1 net** — `backoff.ts`, `http_plugin_utils.ts`, `http_fetch_plugin.ts`, `http_xhr_plugin.ts`, `data_uri_plugin.ts`, `networking_utils.ts`, `networking_engine.ts` (7 files)
- [ ] **3.2 abr** — `ewma.ts`, `ewma_bandwidth_estimator.ts`, `simple_abr_manager.ts` (3 files)
- [ ] **3.3 lcevc** — `lcevc_dec.ts` (1 file)

## Phase 4: Device & DRM

- [ ] **4.1 device** — `i_device.ts`, `abstract_device.ts`, `device_factory.ts`, `default_browser.ts`, and all platform files (14 files)
- [ ] **4.2 drm** — `drm_utils.ts`, `content_protection.ts`, `media_key_system_polyfill_manager.ts`, `drm_engine.ts` (4 files)

## Phase 5: Text, Captions & Transmuxing

- [ ] **5.1 cea** — all 12 CEA files
- [ ] **5.2 text** — `cue.ts`, `cue_region.ts`, parsers, displayers, engine (14 files)
- [ ] **5.3 transmuxer** — codec parsers (h264, h265, av1), audio transmuxers, `transmuxer_engine.ts`, worker files (15 files)

## Phase 6: Core Playback

- [ ] **6.1 Segment primitives** — `segment_reference.ts`, `segment_index.ts`, `segment_utils.ts`, `segment_prefetch.ts`
- [ ] **6.2 Timeline + Regions** — `presentation_timeline.ts`, `region_timeline.ts`, `region_observer.ts`
- [ ] **6.3 Playhead** — `playhead.ts`, `playhead_observer.ts`, `play_rate_controller.ts`, `video_wrapper.ts`, `buffering_observer.ts`
- [ ] **6.4 Engine** — `media_source_engine.ts`, `media_source_capabilities.ts`, `streaming_engine.ts`
- [ ] **6.5 Adaptation + Filtering** — `adaptation_set.ts`, `preference_based_criteria.ts`, `manifest_filterer.ts`, `quality_observer.ts`
- [ ] **6.6 Remaining media** — `manifest_parser.ts`, `closed_caption_parser.ts`, `content_workarounds.ts`, `gap_jumping_controller.ts`, `preload_manager.ts`, `time_ranges_utils.ts`

## Phase 7: Protocol Parsers

- [ ] **7.1 dash** — all 11 DASH parser files
- [ ] **7.2 hls** — all 4 HLS parser files
- [ ] **7.3 msf** — all 9 MSF parser files

## Phase 8: Features

- [ ] **8.1 config** — all 4 config enum files
- [ ] **8.2 debug** — all 3 debug/logging files
- [ ] **8.3 deprecate** — all 3 deprecation files
- [ ] **8.4 queue** — `queue.ts` (1 file)
- [ ] **8.5 ads** — all 15 ad files
- [ ] **8.6 polyfill** — all 21 polyfill files

## Phase 9: Integration

- [ ] **9.1 cast** — all 4 Cast files
- [ ] **9.2 offline** — all 20 offline + indexeddb files

## Phase 10: Entry Point

- [ ] **10.1 player.ts** — main Player class (~9,349 lines)
- [ ] **10.2 Final verification** — full `tsc --noEmit` across entire `ts/lib/`
