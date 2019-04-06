class LookupDispatcher {
  constructor() {
    this.handlers = [];
  }

  handleLookup(event) {
    if (this.handlers.length < 1) {
      return null;
    }

    for (let i = 0; i < this.handlers.length; ++i) {
      const handlerFn = this.handlers[i];
      const result = handlerFn(event);
      if (result) {
        return result;
      }
    }

    return null;
  }

  registerHandler(handlerFn) {
    this.handlers.push(handlerFn);
  }
}

export default LookupDispatcher;
