import Cache from '../../src/cache';
import CacheStore from '../../src/cache-store';
import search from '../../src/search';

describe('The `Cache` class', () => {
  describe('the constructor is called with zero arguments', () => {
    it('should throw an Error', () => {
      expect(() => new Cache()).toThrow(/no store object was provided/);
    });
  });

  describe('the constructor is called with a valid store object', () => {
    it('should construct and set the internal store', () => {
      const store = new CacheStore();
      const cache = new Cache(store);

      expect(cache.getInternalStore()).toBe(store);
    });
  });

  describe('data is appended to the cache', () => {
    it('should push the new data to the front of the byte stack', () => {
      const expectedAppendData = Buffer.from([0x66]);
      const store = new CacheStore();
      const cache = new Cache(store);

      cache.append(expectedAppendData);

      expect(cache.getInternalStore().getReadOnlyBuffer()).toMatchObject(
        expectedAppendData
      );
    });
  });

  describe('data is appended to the cache twice', () => {
    it('should push the new data to the front of the byte stack', () => {
      const expectedAppendDataOne = Buffer.from([0x66]);
      const expectedAppendDataTwo = Buffer.from([0x66]);
      const store = new CacheStore();
      const cache = new Cache(store);

      cache.append(expectedAppendDataOne);
      cache.append(expectedAppendDataTwo);

      expect(cache.getInternalStore().getReadOnlyBuffer()).toMatchObject(
        Buffer.concat([expectedAppendDataOne, expectedAppendDataTwo])
      );
    });
  });

  describe('the find method is ran with an empty store', () => {
    it('should return null', () => {
      const store = new CacheStore();
      const cache = new Cache(store);

      expect(cache.find(Buffer.from([0x44]))).toBe(null);
    });
  });

  describe('the find method is ran with a single element store', () => {
    const dictionary = Buffer.from([0x55]);

    describe('and the search term does not exist (too long in any case)', () => {
      it('should return null', () => {
        const store = new CacheStore();
        store.put = jest.fn();
        const cache = new Cache(store);

        cache.append(dictionary);

        expect(cache.find(Buffer.from([0x44, 0x67]))).toBe(null);
        expect(store.put).not.toHaveBeenCalled();
      });
    });

    describe('and the search term does not exist (same length as store)', () => {
      it('should return null', () => {
        const store = new CacheStore();
        store.put = jest.fn();
        const cache = new Cache(store);

        cache.append(dictionary);

        expect(cache.find(Buffer.from([0x44]))).toBe(null);
        expect(store.put).not.toHaveBeenCalled();
      });
    });

    describe('and the search term does exist', () => {
      it('should create a cache entry and then return expected offset', () => {
        const expectedSearchTerm = Buffer.from([0x54]);
        const store = new CacheStore();
        const spy = jest.spyOn(store, 'put');
        const cache = new Cache(store);

        cache.append(expectedSearchTerm);

        expect(cache.find(expectedSearchTerm)).toMatchObject(
          search(expectedSearchTerm, expectedSearchTerm)
        );
        expect(spy).toHaveBeenCalledWith(
          expectedSearchTerm,
          search(expectedSearchTerm, expectedSearchTerm).offset
        );
      });
    });

    describe('and the search term is cached (double lookup)', () => {
      it('should hit the cache and return the offset', () => {
        const expectedSearchTerm = Buffer.from([0x54]);
        const store = new CacheStore();
        const spy = jest.spyOn(store, 'read');
        const cache = new Cache(store);

        cache.append(expectedSearchTerm);

        cache.find(expectedSearchTerm);
        cache.find(expectedSearchTerm);
        expect(spy).toHaveBeenCalledWith(expectedSearchTerm);
      });
    });
  });

  describe('the find method is ran with a two element store', () => {});
});
