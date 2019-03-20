import Cache from '../../src/cache';
import CacheStore from '../../src/cache-store';
import search from '../../src/search';

const instantiate = (store = new CacheStore()) => new Cache(store);

describe('The `Cache` class', () => {
  describe('the constructor is called with zero arguments', () => {
    it('should throw an Error', () => {
      expect(() => new Cache()).toThrow(/no store object was provided/);
    });
  });

  describe('the constructor is called with a valid store object', () => {
    it('should construct and set the internal store', () => {
      const store = new CacheStore();
      const cache = instantiate(store);

      expect(cache.getInternalStore()).toBe(store);
    });
  });

  describe('data is appended to the cache', () => {
    it('should push the new data to the front of the byte stack', () => {
      const expectedAppendData = Buffer.from([0x66]);
      const cache = instantiate();

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
      const cache = instantiate();

      cache.append(expectedAppendDataOne);
      cache.append(expectedAppendDataTwo);

      expect(cache.getInternalStore().getReadOnlyBuffer()).toMatchObject(
        Buffer.concat([expectedAppendDataOne, expectedAppendDataTwo])
      );
    });
  });

  describe('the find method is ran with an empty store', () => {
    it('should return null', () => {
      const cache = instantiate();

      expect(cache.find(Buffer.from([0x44]))).toBe(null);
    });
  });

  describe('the find method is ran with a single element store', () => {
    const dictionary = Buffer.from([0x55]);

    describe('and the search term does not exist (too long in any case)', () => {
      it('should return null', () => {
        const store = new CacheStore();
        store.put = jest.fn();
        const missMock = jest.fn();
        const cache = instantiate(store);

        cache.append(dictionary);
        cache.on('miss', missMock);

        expect(cache.find(Buffer.from([0x44, 0x67]))).toBe(null);
        expect(store.put).not.toHaveBeenCalled();
        expect(missMock).toHaveBeenCalled();
      });
    });

    describe('and the search term does not exist (same length as store)', () => {
      it('should return null', () => {
        const store = new CacheStore();
        store.put = jest.fn();
        const missMock = jest.fn();
        const cache = instantiate(store);

        cache.append(dictionary);
        cache.on('miss', missMock);

        expect(cache.find(Buffer.from([0x44]))).toBe(null);
        expect(store.put).not.toHaveBeenCalled();
        expect(missMock).toHaveBeenCalled();
      });
    });

    describe('and the search term does exist', () => {
      it('should create a cache entry and then return expected offset', () => {
        const expectedSearchTerm = Buffer.from([0x54]);
        const store = new CacheStore();
        const spy = jest.spyOn(store, 'put');
        const missMock = jest.fn();
        const cache = instantiate(store);

        cache.append(expectedSearchTerm);
        cache.on('miss', missMock);

        expect(cache.find(expectedSearchTerm)).toMatchObject(
          search(expectedSearchTerm, expectedSearchTerm)
        );
        expect(spy).toHaveBeenCalledWith(
          expectedSearchTerm,
          search(expectedSearchTerm, expectedSearchTerm).offset
        );
        expect(missMock).toHaveBeenCalled();
      });
    });

    describe('and the search term is cached (double lookup)', () => {
      it('should hit the cache and return the offset', () => {
        const expectedSearchTerm = Buffer.from([0x54]);
        const store = new CacheStore();
        const hitMock = jest.fn();
        const spy = jest.spyOn(store, 'read');
        const cache = instantiate(store);

        cache.append(expectedSearchTerm);
        cache.on('hit', hitMock);

        expect(cache.find(expectedSearchTerm)).toMatchObject(
          Object.assign(search(expectedSearchTerm, expectedSearchTerm), { value: expectedSearchTerm })
        );
        expect(cache.find(expectedSearchTerm)).toMatchObject(
          Object.assign(search(expectedSearchTerm, expectedSearchTerm), { value: expectedSearchTerm })
        );
        expect(spy).toHaveBeenCalledWith(expectedSearchTerm);
        expect(hitMock).toHaveBeenCalled();
      });
    });
  });

  describe('the find method is ran with a two element store', () => {});

  describe('An unrecognized event is registered via `on`', () => {
    it('should register nothing', () => {
      const expectedSearchTerm = Buffer.from([0x54]);
      const store = new CacheStore();
      const cache = instantiate(store);
      const fakeCallback = jest.fn();

      cache.append(expectedSearchTerm);
      cache.on('fake', fakeCallback);

      cache.find(Buffer.from([0x44]));
      expect(fakeCallback).not.toBeCalled();
    });
  });
});
