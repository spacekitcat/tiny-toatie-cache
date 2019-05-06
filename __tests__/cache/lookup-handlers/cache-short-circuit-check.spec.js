import doCacheShortCircuitCheck from '../../../src/cache/lookup-handlers/cache-short-circuit-check';
import CacheStore from '../../../src/cache-store';
import search from '../../../src/search';
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
      const target = Buffer.from([0x67]);

      const result = doCacheShortCircuitCheck({
        store: store,
        lookupKey: target
      });

      expect(result).toMatchObject({
        result: null,
        response_type: HandlerResponseEnum.HANDLED_ABORT
      });
    });
  });

  describe('When the cache has content', () => {
    describe('and the target is a match', () => {
      describe('and the target and the dictionary has a length of 1', () => {
        it('should return a positive', () => {
          const store = createStoreInstance(Buffer.from([0x67]));
          const target = Buffer.from([0x67]);

          const result = doCacheShortCircuitCheck({
            store,
            lookupKey: target
          });

          expect(result).toMatchObject({
            result: search(store.getInternalBuffer(), target),
            response_type: HandlerResponseEnum.UNHANDLED
          });
        });
      });

      describe('and the target has a length >1', () => {
        it('should return a positive', () => {
          const store = createStoreInstance(Buffer.from([0x67, 0x45]));
          const target = Buffer.from([0x67, 0x45]);

          const result = doCacheShortCircuitCheck({
            store,
            lookupKey: Buffer.from([0x67])
          });

          expect(result).toMatchObject({
            result: search(store.getInternalBuffer(), Buffer.from([0x67])),
            response_type: HandlerResponseEnum.UNHANDLED
          });
        });
      });
    });

    describe('and the target is not a match', () => {
      describe('and the target and the dictionary has a length of 1', () => {
        it('should return a positive', () => {
          const store = createStoreInstance(Buffer.from([0x67]));
          const target = Buffer.from([0x07]);

          const result = doCacheShortCircuitCheck({
            store,
            lookupKey: target
          });

          expect(result).toMatchObject({
            result: search(store.getInternalBuffer(), target),
            response_type: HandlerResponseEnum.HANDLED_ABORT
          });
        });
      });

      describe('and the target has a length >1', () => {
        it('should return a positive', () => {
          const store = createStoreInstance(Buffer.from([0x67, 0x45]));
          const target = Buffer.from([0x07, 0x45]);

          const result = doCacheShortCircuitCheck({
            store,
            lookupKey: Buffer.from([0x07])
          });

          expect(result).toMatchObject({
            result: search(store.getInternalBuffer(), Buffer.from([0x07])),
            response_type: HandlerResponseEnum.HANDLED_ABORT
          });
        });
      });
    });
  });
});
