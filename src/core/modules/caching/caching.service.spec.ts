import { CachingService } from "@core/modules/caching/caching.service";
import { cacheProvider } from "@core/modules/caching/providers/cache.provider";
import { Test, TestingModule } from "@nestjs/testing";
import spyOn = jest.spyOn;

describe('CachingService', () => {
  let cachingService: CachingService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CachingService, cacheProvider],
    }).compile();
    cachingService = module.get<CachingService>(CachingService);
  });

  it('should be defined', () => {
    expect(cachingService).toBeDefined();
  });

  describe('Cache Functionality', () => {

    beforeEach(() => {
      cachingService.set('test', {
        foo: 'bar',
        bar: {baz: 'boom'},
      });
      cachingService.set('foo', 'bar');
    });

    it('should get a value from the cache', () => {
      expect(cachingService.get('test')).toBeTruthy();
    });

    it('should set a value in the cache', () => {
      const setTTLSpy = spyOn(cachingService as any, '_setTTL');
      cachingService.set('foo', 'bar');
      expect(setTTLSpy).not.toHaveBeenCalled();
      expect(cachingService.get('foo')).toBe('bar');
    });

    it('should delete an item from the cache', () => {
      expect(cachingService.get('foo')).toBe('bar');
      cachingService.del('foo', true);
      expect(cachingService.get('foo')).toBeUndefined();
    });

    it('should determine if a key exists in the cache', () => {
      expect(cachingService.get('foo')).toBe('bar');
      expect(cachingService.hasKey('foo')).toBe(true);
      expect(cachingService.hasKey('not-there')).toBe(false);
    });

    it('should return an array of keys', () => {
      const keys: string[] = cachingService.keys;
      expect(keys.includes('foo')).toBe(true);
      expect(keys.includes('test')).toBe(true);
    });

    it('should clear all the values in the cache', () => {
      cachingService.flushAll();
      const keys = cachingService.keys;
      expect(keys.length).toBe(0);
    });

    it('should get a value and then remove that entry', () => {
      const foo = cachingService.take('foo');
      expect(foo).toEqual('bar');
      const keys = cachingService.keys;
      expect(keys.includes('foo')).toBe(false);
    });
  });

  /*describe('TTL Functionality', () => {

    beforeEach(() => {
     cachingService.set('foo', 'bar', 500);
    });

    it('should determine if a key exists in the TTL cache', () => {
      expect(cachingService.ttlHasKey('foo')).toBe(true);
      expect(cachingService.ttlHasKey('bar')).toBe(false);
    });

    it('should set a TTL for a value', () => {
      const setTTLSpy = spyOn(cachingService as any, '_setTTL');
      cachingService.set('bar', 'baz', 10000);
      expect(setTTLSpy).toHaveBeenCalledWith('bar', 10000);
      expect((cachingService as any)._cacheTTL.has('bar')).toBe(true);
      const { start, end, timer } = (cachingService as any)._cacheTTL.get('bar');
      expect(start).toBeLessThan(end);
      expect(end - 10000).toEqual(start);
      expect(timer).toBeTruthy();
    });

    it('should expire an entry with a TTL', (done) => {
      const delSpy = spyOn(cachingService, 'del');
      cachingService.set('bar', 'baz', 500);

      setTimeout(() => {
        expect(delSpy).toHaveBeenCalledWith('foo', false);
        expect(cachingService.hasKey('bar')).toBe(false);
        expect((cachingService as any)._cacheTTL.get('foo').expired).toBe(true);
        done();
      }, 505)
    });

    it('should get the TTL Information', () => {
      cachingService.set('bar', 'baz', 10000);
      const ttlInfo = cachingService.getTTL('bar');
      expect(ttlInfo).toBeTruthy();
      expect(ttlInfo).toBeCloseTo(10000);
    });

    it('should clear the TTL info', () => {
      cachingService.clearTTL('foo');
      expect((cachingService as any)._cacheTTL.has('foo')).toBe(false);
    });

    it('should set the TTL entry as expired', () => {
      expect((cachingService as any)._cacheTTL.get('foo').expired).toBe(false);
      cachingService.setTTLExpired('foo');
      expect((cachingService as any)._cacheTTL.get('foo').expired).toBe(true);
    });
  });*/
});
