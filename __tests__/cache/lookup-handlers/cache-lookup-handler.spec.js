import handleCacheLookup from '../../../src/cache/lookup-handlers/cache-lookup-handler';
import CacheStore from '../../../src/cache-store';
import search from '../../../src/search';

const createStoreInstance = contents => {
  const store = new CacheStore();
  store.append(contents);
  return store;
};

describe('The `cache-lookup-handler` module', () => {
  describe("And it's given a request it can handle", () => {
    it('should return a positive result the cache', () => {
      const store = createStoreInstance(Buffer.from([0x22, 0x43, 0x87]));
      const target = Buffer.from([0x43, 0x87]);

      store.put(target, 1);

      expect(
        handleCacheLookup({
          store: store,
          lookupKey: target
        })
      ).toMatchObject(search(store.getInternalBuffer(), target));
    });

    it('should have called `read` to lookup the key', () => {
      const storeContents = Buffer.from([0x22, 0x43, 0x87]);
      const store = createStoreInstance(storeContents);
      const target = Buffer.from([0x43, 0x87]);

      const readSpy = jest.spyOn(store, 'read');

      handleCacheLookup({
        store: store,
        lookupKey: target
      });

      expect(readSpy).toHaveBeenCalledWith(target);
    });
  });

  describe("And it's given a request it can't handle", () => {
    it('should return a negative result from the cache', () => {
      const store = createStoreInstance(Buffer.from([0x22, 0x43, 0x22]));
      const target = Buffer.from([0x87, 0x89]);

      expect(
        handleCacheLookup({
          store: store,
          lookupKey: target
        })
      ).toBe(null);
    });

    it('should have called `read` to lookup the key', () => {
      const store = createStoreInstance(Buffer.from([0x22, 0x43, 0x22]));
      const target = Buffer.from([0x87, 0x89]);

      const readSpy = jest.spyOn(store, 'read');

      handleCacheLookup({
        store: store,
        lookupKey: target
      });

      expect(readSpy).toHaveBeenCalledWith(target);
    });
  });
});
