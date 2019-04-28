import handleColdLookup from '../../../src/cache/lookup-handlers/cold-lookup-handler';
import CacheStore from '../../../src/cache-store';
import search from '../../../src/search';
import ResultSourceEnum from '../../../src/cache/lookup-handlers/result-source-enum';
import HandlerResponseEnum from '../../../src/cache/lookup-handlers/handler-response-enum';

const createStoreInstance = contents => {
  const store = new CacheStore();
  store.append(contents);
  return store;
};

describe('The `ColdLookupHandler` function', () => {
  describe("And it's given a request it can handle", () => {
    it('should return a positive result from the `search` function (null would fail the assert)', () => {
      const store = createStoreInstance(Buffer.from([0x22, 0x43, 0x87]));
      const target = Buffer.from([0x43, 0x87]);

      expect(
        handleColdLookup({
          store: store,
          lookupKey: target
        })
      ).toMatchObject({
        result: search(store.getInternalBuffer(), target),
        handler_type: ResultSourceEnum.COLD_LOOKUP_HANDLER,
        response_type: HandlerResponseEnum.HANDLED_COMPLETE
      });
    });

    it('should add the positive result to the dictionary', () => {
      const storeContents = Buffer.from([0x22, 0x43, 0x87]);
      const store = createStoreInstance(storeContents);
      const target = Buffer.from([0x43, 0x87]);

      const putSpy = jest.spyOn(store, 'put');

      handleColdLookup({
        store: store,
        lookupKey: target
      });

      expect(putSpy).toHaveBeenCalledWith(
        target,
        search(store.getInternalBuffer(), target).offset
      );
    });
  });

  describe("And it's given a request it can't handle", () => {
    it('should return a negative result from the `search` function', () => {
      const store = createStoreInstance(Buffer.from([0x22, 0x43, 0x22]));
      const target = Buffer.from([0x87, 0x89]);
      expect(
        handleColdLookup({
          store: store,
          lookupKey: target
        })
      ).toMatchObject({
        result: null,
        response_type: HandlerResponseEnum.UNHANDLED
      });
    });
  });
});
