import LookupDispatcher from '../../src/cache/lookup-dispatcher';
import CacheStore from '../../src/cache-store';
import HandlerResponseType from '../../src/cache/lookup-handlers/handler-response-enum';

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
      handler.mockImplementation(() => ({
        result: {},
        response_type: HandlerResponseType.HANDLED_COMPLETE
      }));
      const lookupDispatch = new LookupDispatcher();
      lookupDispatch.registerHandler(handler);

      lookupDispatch.handleLookup(event);

      expect(handler).toHaveBeenCalledWith(event);
    });

    describe('when the event is `UNHANDLED`', () => {
      it('should return null', () => {
        const handler = jest.fn();
        handler.mockImplementation(() => ({
          result: null,
          response_type: HandlerResponseType.UNHANDLED
        }));
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handler);

        expect(lookupDispatch.handleLookup({})).toBe(null);
      });

      it('should not call the complete event', () => {
        const handler = jest.fn();
        const completionCallBack = jest.fn();
        handler.mockImplementation(() => ({
          result: null,
          response_type: HandlerResponseType.UNHANDLED
        }));
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handler);
        lookupDispatch.on('complete', completionCallBack);

        lookupDispatch.handleLookup({});
        expect(completionCallBack).not.toHaveBeenCalled();
      });
    });

    describe('when the event is `HANDLED_COMPLETE`', () => {
      it('should return the handler response', () => {
        const mockResponse = {
          response_type: HandlerResponseType.HANDLED_COMPLETE,
          result: {
            offset: 1,
            length: 2,
            value: Buffer.from([0x22])
          }
        };

        const handler = jest.fn();
        handler.mockImplementation(() => mockResponse);
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handler);

        expect(lookupDispatch.handleLookup({})).toMatchObject(
          mockResponse.result
        );
      });

      it('should call the complete event', () => {
        const mockResponse = {
          result: {
            offset: 1,
            length: 2,
            value: Buffer.from([0x22])
          },
          response_type: HandlerResponseType.HANDLED_COMPLETE
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

    describe('when the event is `HANDLED_ABORT`', () => {
      it('should return the handler response', () => {
        const mockResponse = {
          response_type: HandlerResponseType.HANDLED_ABORT,
          result: null
        };

        const handler = jest.fn();
        handler.mockImplementation(() => mockResponse);
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handler);

        expect(lookupDispatch.handleLookup({})).toBe(mockResponse.result);
      });
    });
  });

  describe('when two handlers are registered', () => {
    describe('and the first handler is `HANDLED_COMPLETE`', () => {
      it('should only call the first handler', () => {
        const event = {
          store: createStoreInstance(Buffer.from([0x22, 0x43, 0x87])),
          lookupKey: Buffer.from([0x43, 0x87])
        };

        const handlerOne = jest.fn();
        const expectedResult = 'FAKE';
        handlerOne.mockImplementation(() => ({
          result: expectedResult,
          response_type: HandlerResponseType.HANDLED_COMPLETE
        }));

        const handlerTwo = jest.fn();
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handlerOne);
        lookupDispatch.registerHandler(handlerTwo);

        const result = lookupDispatch.handleLookup(event);

        expect(result).toBe(expectedResult);
        expect(handlerOne).toHaveBeenCalledWith(event);
        expect(handlerTwo).not.toHaveBeenCalled();
      });
    });

    describe('and the first handler is `UNHANDLED`', () => {
      it('should call both handlers', () => {
        const event = {
          store: createStoreInstance(Buffer.from([0x22, 0x43, 0x87])),
          lookupKey: Buffer.from([0x43, 0x87])
        };

        const handlerOne = jest.fn();
        handlerOne.mockImplementation(() => ({
          result: null,
          response_type: HandlerResponseType.UNHANDLED
        }));

        const handlerTwo = jest.fn();
        const expectedResult = 'hello.';
        handlerTwo.mockImplementation(() => ({
          result: expectedResult,
          response_type: HandlerResponseType.HANDLED_COMPLETE
        }));

        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handlerOne);
        lookupDispatch.registerHandler(handlerTwo);

        const result = lookupDispatch.handleLookup(event);

        expect(result).toBe(expectedResult);
        expect(handlerOne).toHaveBeenCalledWith(event);
        expect(handlerTwo).toHaveBeenCalledWith(event);
      });
    });

    describe('and the first handler is `HANDLED_ABORT`', () => {
      it('should only call the first handler', () => {
        const event = {
          store: createStoreInstance(Buffer.from([0x22, 0x43, 0x87])),
          lookupKey: Buffer.from([0x43, 0x87])
        };

        const handlerOne = jest.fn();
        handlerOne.mockImplementation(() => ({
          result: null,
          response_type: HandlerResponseType.HANDLED_ABORT
        }));

        const handlerTwo = jest.fn();
        const lookupDispatch = new LookupDispatcher();
        lookupDispatch.registerHandler(handlerOne);
        lookupDispatch.registerHandler(handlerTwo);

        const result = lookupDispatch.handleLookup(event);

        expect(result).toBe(null);
        expect(handlerOne).toHaveBeenCalledWith(event);
        expect(handlerTwo).not.toHaveBeenCalled();
      });
    });
  });
});
