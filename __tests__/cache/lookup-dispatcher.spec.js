import LookupDispatcher from '../../src/cache/lookup-dispatcher';
import CacheStore from '../../src/cache-store';

const createStoreInstance = contents => {
  const store = new CacheStore();
  store.append(contents);
  return store;
};

describe('The `lookupDispatch` module', () => {
  describe('when no handlers are registered', () => {
    it('should return null', () => {
      const event = {
        store: createStoreInstance(Buffer.from([0x22, 0x43, 0x87])),
        lookupKey: Buffer.from([0x43, 0x87])
      };

      const lookupDispatch = new LookupDispatcher();
      expect(lookupDispatch.handleLookup(event)).toBe(null);
    });
  });

  describe('when one handler is registered', () => {
    it('should call the handler', () => {
      const event = {
        store: createStoreInstance(Buffer.from([0x22, 0x43, 0x87])),
        lookupKey: Buffer.from([0x43, 0x87])
      };

      const handler = jest.fn();
      const lookupDispatch = new LookupDispatcher();
      lookupDispatch.registerHandler(handler);

      lookupDispatch.handleLookup(event);

      expect(handler).toHaveBeenCalledWith(event);
    });

    describe('when the event cannot be handled', () => {
      it('should return null', () => {
        const handler = jest.fn();
        handler.mockImplementation(() => null);
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handler);

        expect(lookupDispatch.handleLookup({})).toBe(null);
      });
    });

    describe('when the event can be handled', () => {
      it('should return the handler response', () => {
        const mockResponse = {
          offset: 1,
          length: 2,
          value: Buffer.from([0x22])
        };

        const handler = jest.fn();
        handler.mockImplementation(() => mockResponse);
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handler);

        expect(lookupDispatch.handleLookup({})).toMatchObject(mockResponse);
      });
    });
  });
});
