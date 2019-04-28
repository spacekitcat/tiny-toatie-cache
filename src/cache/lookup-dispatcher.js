import HandlerResponseType from './lookup-handlers/handler-response-enum';

class LookupDispatcher {
  constructor() {
    this.handlers = [];
    this.events = {};
  }

  handleLookup(event) {
    if (this.handlers.length < 1) {
      return null;
    }

    for (let i = 0; i < this.handlers.length; ++i) {
      const result = this.handlers[i](event);
      switch (result['response_type']) {
        case HandlerResponseType.HANDLED_COMPLETE:
          this.callOn('complete', i);
          return result.result;

        case HandlerResponseType.HANDLED_ABORT:
          return null;

        case HandlerResponseType.UNHANDLED:
          continue;
      }
    }

    return null;
  }

  registerHandler(handlerFn) {
    this.handlers.push(handlerFn);
  }

  on(eventKey, callbackFn) {
    this.events[eventKey] = callbackFn;
  }

  callOn(eventKey, param) {
    const callback = this.events[eventKey];
    if (callback) {
      callback(param);
    }
  }
}

export default LookupDispatcher;
