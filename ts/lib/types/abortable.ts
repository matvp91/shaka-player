/*! @license
 * Shaka Player
 * Copyright 2016 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A representation of an abortable operation.  Note that these are not
 * cancelable.  Cancellation implies undoing what has been done so far,
 * whereas aborting only means that further work is stopped.
 */
export interface IAbortableOperation<T> {
  /**
   * A Promise which represents the underlying operation.  It is resolved when
   * the operation is complete, and rejected if the operation fails or is
   * aborted.  Aborted operations should be rejected with a shaka.util.Error
   * object using the error code OPERATION_ABORTED.
   */
  readonly promise: Promise<T>;

  /**
   * Can be called by anyone holding this object to abort the underlying
   * operation.  This is not cancellation, and will not necessarily result in
   * any work being undone.  abort() should return a Promise which is resolved
   * when the underlying operation has been aborted.  The returned Promise
   * should never be rejected.
   */
  abort(): Promise<void>;

  /**
   * A callback to be invoked after the operation succeeds or fails.  The
   * boolean argument is true if the operation succeeded and false if it
   * failed.
   */
  finally(onFinal: (success: boolean) => void): IAbortableOperation<T>;
}
