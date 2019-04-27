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

      it('should not call the complete event', () => {
        const handler = jest.fn();
        const completionCallBack = jest.fn();
        handler.mockImplementation(() => null);
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handler);
        lookupDispatch.on('complete', completionCallBack);

        lookupDispatch.handleLookup({});
        expect(completionCallBack).not.toHaveBeenCalled();
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

      it('should call the complete event', () => {
        const mockResponse = {
          offset: 1,
          length: 2,
          value: Buffer.from([0x22])
        };

        const handler = jest.fn();
        const completionCallBack = jest.fn();
        handler.mockImplementation(() => mockResponse);
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handler);
        lookupDispatch.on('complete', completionCallBack);

        lookupDispatch.handleLookup({});
        expect(completionCallBack).toHaveBeenCalledWith(0);
      });
    });
  });

  describe('when one handler is registered', () => {
    describe('and the first handler can handle it', () => {
      it('should only call the first handler', () => {
        const event = {
          store: createStoreInstance(Buffer.from([0x22, 0x43, 0x87])),
          lookupKey: Buffer.from([0x43, 0x87])
        };

        const handlerOne = jest.fn();
        handlerOne.mockImplementation(() => 'FAKE');

        const handlerTwo = jest.fn();
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handlerOne);
        lookupDispatch.registerHandler(handlerTwo);

        lookupDispatch.handleLookup(event);

        expect(handlerOne).toHaveBeenCalledWith(event);
        expect(handlerTwo).not.toHaveBeenCalled();
      });
    });

    describe('and the first handler cannot handle it', () => {
      it('should call both handlers', () => {
        const event = {
          store: createStoreInstance(Buffer.from([0x22, 0x43, 0x87])),
          lookupKey: Buffer.from([0x43, 0x87])
        };

        const handlerOne = jest.fn();
        handlerOne.mockImplementation(() => null);

        const handlerTwo = jest.fn();
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handlerOne);
        lookupDispatch.registerHandler(handlerTwo);

        lookupDispatch.handleLookup(event);

        expect(handlerOne).toHaveBeenCalledWith(event);
        expect(handlerTwo).toHaveBeenCalledWith(event);
      });
    });
  });
});
