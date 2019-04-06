import handleColdLookup from '../../../src/cache/lookup-handlers/cold-lookup-handler';
import CacheStore from '../../../src/cache-store';
import search from '../../../src/search';

const createStoreInstance = contents => {
  const store = new CacheStore();
  store.append(contents);
  return store;
};

describe('The `ColdLookupHandler` function', () => {
  describe("And it's given a request it can handle", () => {
    it('should import okay', () => {
      const store = createStoreInstance(Buffer.from([0x22, 0x43, 0x87]));
      const target = Buffer.from([0x43, 0x87]);

      expect(
        handleColdLookup({
          store: store,
          lookupKey: target
        })
      ).toMatchObject(search(store.getBufferCopy(), target));
    });
  });

  describe("And it's given a request it can't handle", () => {
    it('should import okay', () => {
      const store = createStoreInstance(Buffer.from([0x22, 0x43, 0x22]));
      const target = Buffer.from([0x87, 0x89]);
      expect(
        handleColdLookup({
          store: store,
          lookupKey: target
        })
      ).toBe(null);
    });
  });
});
