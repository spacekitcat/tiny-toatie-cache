import doCacheShortCircuitCheck from '../../../src/cache/lookup-handlers/cache-short-circuit-check';
import CacheStore from '../../../src/cache-store';
import HandlerResponseEnum from '../../../src/cache/lookup-handlers/handler-response-enum';

const createStoreInstance = contents => {
  const store = new CacheStore();
  store.append(contents);
  return store;
};

describe('The `doCacheShortCircuitCheck` module', () => {
  describe('When the cache is empty', () => {
    it('should return `UNHANDLED`', () => {
      const store = createStoreInstance(Buffer.from([]));
      const target = Buffer.from([0x67, 0x65]);

      const result = doCacheShortCircuitCheck({
        store: store,
        lookupKey: target
      });

      expect(result).toMatchObject({
        result: null,
        response_type: HandlerResponseEnum.UNHANDLED
      });
    });
  });
});
