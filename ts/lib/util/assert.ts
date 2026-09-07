export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message ?? "Assertion failed");
  }
}

export function assertInstanceof<T>(
  value: unknown,
  ctor: new (...args: unknown[]) => T,
  message?: string,
): asserts value is T {
  if (!(value instanceof ctor)) {
    throw new Error(message ?? `Expected instance of ${ctor.name}`);
  }
}

export function assertNonNull<T>(
  value: T | null | undefined,
  message?: string,
): asserts value is T {
  if (value == null) {
    throw new Error(message ?? "Expected non-null value");
  }
}
