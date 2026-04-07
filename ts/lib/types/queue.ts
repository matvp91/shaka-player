/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Forward declarations
// Resolves at Step 6.6 (adaptation + filtering)
export type PreloadManager = unknown; // MIGRATION: renamed from shaka.media.PreloadManager
// Resolves at Step 1.9 (player types)
export type PlayerConfiguration = unknown;
// Resolves at Step 1.9 (player types)
export type ExtraText = unknown;
// Resolves at Step 1.9 (player types)
export type ExtraChapter = unknown;
// Resolves at Step 10.1 (player)
export type Player = unknown;
// Resolves at Step 1.9 (player types)
export type QueueConfiguration = unknown;
// Resolves at Step 2.1 (core utilities)
// biome-ignore lint/complexity/noBannedTypes: Forward declaration requires an object type
export type IDestroyable = {};

export interface QueueItem {
  manifestUri: string;
  preloadManager: PreloadManager | null;
  startTime: number | Date | null;
  mimeType: string | null;
  config: PlayerConfiguration | null;
  extraText: ExtraText[] | null;
  extraThumbnail: string[] | null;
  extraChapter: ExtraChapter[] | null;
}

/**
 * An object that's responsible for all the queue-related logic
 * in the player.
 */
// MIGRATION: The original extern extends EventTarget and shaka.util.IDestroyable.
export interface IQueueManager extends EventTarget, IDestroyable {
  /**
   * @override
   */
  destroy(): Promise<void>;

  /**
   * Called by the Player to provide an updated configuration any time it
   * changes.
   *
   * @param config
   */
  configure(config: QueueConfiguration): void;

  /**
   * Returns the current configuration.
   *
   * @return
   */
  getConfiguration(): QueueConfiguration | null;

  /**
   * Set a custom player for preloading, event management and autoplay next.
   * This is useful when using a CastProxy.
   *
   * @param player
   */
  setCustomPlayer(player: Player): void;

  /**
   * Returns the current item.
   *
   * @return
   */
  getCurrentItem(): QueueItem | null;

  /**
   * Returns the index of the current playing item.
   *
   * @return
   */
  getCurrentItemIndex(): number;

  /**
   * Returns all items.
   *
   * @return
   */
  getItems(): QueueItem[];

  /**
   * Insert new items in the current queue.
   *
   * @param items
   */
  insertItems(items: QueueItem[]): void;

  /**
   * Remove all items.
   *
   * @return
   */
  removeAllItems(): Promise<void>;

  /**
   * Plays a item number in the queue.
   *
   * @param itemIndex
   * @return
   */
  playItem(itemIndex: number): Promise<void>;
}

/**
 * A factory for creating the queue manager.
 */
// MIGRATION: extracted from shaka.extern.IQueueManager.Factory
export type IQueueManagerFactory = (player: Player) => IQueueManager;
