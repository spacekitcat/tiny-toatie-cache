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
      if (result) {
        const completeCallback = this.events['complete'];
        if (completeCallback) {
          completeCallback(i);
        }
        return result;
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
}

export default LookupDispatcher;
