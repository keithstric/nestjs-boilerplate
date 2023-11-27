import { Inject, Injectable } from "@nestjs/common";

export enum CacheErrorTypes {
  MISSING_KEY,
  EXPIRED,
  OTHER,
}

export interface TTLInfo {
  start: number;
  end: number;
  timer: any;
  expired: boolean;
}

/**
 * This is a generic caching service. Instead of creating multiple caches throughout the application
 * this can be used as a global in-memory cache.
 *
 * If you want to do response caching, use the
 * built-in CacheModule and CacheInterceptor provided by nestjs https://docs.nestjs.com/techniques/caching
 */
@Injectable()
export class CachingService {
  private _cacheTTL: Map<string, TTLInfo> = new Map<string, TTLInfo>();

  constructor(@Inject('CACHE_PROVIDER') private readonly _cache: Map<string, any>) {}

  /**
   * An array of keys stored in the cache
   */
  get keys() {
    return Array.from(this._cache.keys());
  }

  /**
   * Get a value from the cache
   * @param key
   */
  get(key: string) {
    if (!this.hasKey(key)) {
      return undefined;
    }
    return this._cache.get(key);
  }

  /**
   * Sets a value in the cache
   * @param key
   * @param value
   * @param ttl - the time in milliseconds for the cache to hold the set value,
   * after which it will be deleted from the cache
   */
  set(key: string, value: any, ttl: number = 0) {
    if (ttl) {
      this._setTTL(key, ttl);
    }
    return this._cache.set(key, value);
  }

  /**
   * Delete an entry in the cache
   * @param key
   * @param clearTTL - true to remove the TTL information as well
   */
  del(key: string, clearTTL: boolean) {
    const isError = this._isKeyError(key, 'Cache');
    if (isError) {
      throw this._handleError(isError, key);
    }
    if (clearTTL && this.ttlHasKey(key)) {
      this.clearTTL(key);
    }
    this._cache.delete(key);
  }

  /**
   * Get a value from the cache and then remove the entry from the cache
   * @param key
   */
  take(key: string) {
    const isError = this._isKeyError(key, 'Cache');
    if (isError) {
      throw this._handleError(isError, key);
    }
    const val = this.get(key);
    this.del(key, true);
    return val;
  }

  /**
   * Milliseconds before entry is removed from the cache
   * @param key
   */
  getTTL(key: string) {
    const isError = this._isKeyError(key, 'TTL');
    if (isError) {
      throw this._handleError(isError, key);
    }
    const ttlInfo = this._cacheTTL.get(key);
    return ttlInfo.end - new Date().getTime();
  }

  /**
   * Remove a TTL for an entry after clearing the function that would have done
   * the removal
   * @param key
   */
  clearTTL(key: string) {
    const isError = this._isKeyError(key, 'TTL');
    if (isError) {
      throw this._handleError(isError, key);
    }
    clearTimeout(this._cacheTTL.get(key).timer);
    this._cacheTTL.delete(key);
  }

  /**
   * Set a TTL entry as expired
   * @param key
   */
  setTTLExpired(key: string) {
    const isError = this._isKeyError(key, 'TTL');
    if (isError) {
      throw this._handleError(isError, key);
    }
    this._cacheTTL.get(key).expired = true;
  }

  /**
   * Check if the cache contains a specific key
   * @param key
   */
  hasKey(key: string) {
    return this._cache.has(key);
  }

  /**
   * Check if the TTL cache contains a specific key
   * @param key
   */
  ttlHasKey(key: string) {
    return this._cacheTTL.has(key);
  }

  /**
   * Clear all entries from the cache and TTL cache
   */
  flushAll() {
    this._cacheTTL.clear();
    this._cache.clear();
  }

  /**
   * Determines if a cached key has some kind of error that will prevent further processing
   * @param key
   * @param keyType
   * @private
   */
  private _isKeyError(key: string, keyType: 'TTL' | 'Cache'): CacheErrorTypes | undefined {
    if (keyType === 'TTL') {
      if (!this._cacheTTL.has(key)) {
        return CacheErrorTypes.MISSING_KEY;
      }
    }else{
      if (!this._cache.has(key) && this._cacheTTL.has('key') && this._cacheTTL.get('key').expired === true) {
        return CacheErrorTypes.EXPIRED;
      }else if (!this._cache.has(key)) {
        return CacheErrorTypes.MISSING_KEY;
      }
    }
    return undefined;
  }

  /**
   * Handles any errors which may occur
   * @param errorType
   * @param key
   * @private
   */
  private _handleError(errorType: CacheErrorTypes, key: string) {
    switch (errorType) {
			case CacheErrorTypes.MISSING_KEY:
        return new Error(`Key ${key} does not exist`);
      case CacheErrorTypes.EXPIRED:
        return new Error(`Key ${key} has expired and is no longer available`);
      case CacheErrorTypes.OTHER:
        return new Error(`An error occurred accessing ${key}`);
      default:
        return new Error();
		}
  }

  /**
   * Add an entry in the cacheTTL map containing the TTL info
   * and a setTimeout function which will run when the TTL end
   * value is met
   * @param key
   * @param ttl
   * @private
   */
  private _setTTL(key: string, ttl: number) {
    const expires = new Date().getTime() + ttl;
    const diff = expires - new Date().getTime();
    this._cacheTTL.set(key, {
      start: new Date().getTime(),
      end: expires,
      expired: false,
      timer: setTimeout(() => {
        this._cacheTTL.get(key).expired = true;
        this.del(key, false);
      }, diff),
    });
  }
}
