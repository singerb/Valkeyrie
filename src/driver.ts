import type { Serializer } from './serializers/serializer.ts'

export interface Driver {
  close: () => Promise<void>
  destroy: () => Promise<void>
  clear: () => Promise<void>
  get: (keyHash: string, now: number) => Promise<DriverValue | undefined>
  set: (
    keyHash: string,
    value: unknown,
    versionstamp: string,
    expiresAt?: number,
  ) => Promise<void>
  delete: (keyHash: string) => Promise<void>
  list: (
    startHash: string,
    endHash: string,
    prefixHash: string,
    now: number,
    limit: number,
    reverse?: boolean,
  ) => Promise<DriverValue[]>
  cleanup: (now: number) => Promise<void>
  generateVersionstamp: () => Promise<string>
  withTransaction: <T>(callback: () => Promise<T>) => Promise<T>
  watch: (
    keyHashes: string[],
  ) => ReadableStream<
    (DriverValue | { keyHash: string; value: null; versionstamp: null })[]
  >
  /**
   * The key format of every row in the store, if the driver knows it, for
   * example because no earlier version of Valkeyrie wrote to its stores.
   * Valkeyrie then trusts it: it keeps no key format row in the store and does
   * not check the entries. Leave it out to let Valkeyrie record the key format
   * in the store.
   */
  keyFormat?: number
}

export function defineDriver(
  initDriver:
    | ((path?: string, serializerInit?: () => Serializer) => Promise<Driver>)
    | Driver,
): (path?: string, serializerInit?: () => Serializer) => Promise<Driver> {
  if (initDriver instanceof Function) {
    return initDriver
  }

  return async () => initDriver
}

export interface DriverValue<T = unknown> {
  keyHash: string
  value: T
  versionstamp: string
}
