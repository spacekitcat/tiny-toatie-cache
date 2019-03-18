import search from '../../src/search';

class Cache {
  constructor(store) {
    if (!store) {
      throw new Error('no store object was provided');
    }

    this.store = store;
    this.events = {};
    this.lastTimeSnapshot = 0;
  }

  append(list) {
    this.store.append(list);
  }

  find(target) {
    this.lastTimeSnapshot = Date.now();
    // Warn lookup...
    const cachedResult = this.store.read(target);

    if (cachedResult) {
      this.callOn('hit', Date.now() - this.lastTimeSnapshot);
      return cachedResult;
    }

    // Cold lookup...
    const result = search(Buffer.from(this.store.getReadOnlyBuffer()), target);

    if (result) {
      this.store.put(target, result.offset);
    }

    this.callOn('miss', Date.now() - this.lastTimeSnapshot);
    return result;
  }

  getInternalStore() {
    return this.store;
  }

  on(eventKey, eventFn) {
    this.events[eventKey] = eventFn;
  }

  callOn(eventKey, timeTook) {
    const callback = this.events[eventKey];
    if (callback) {
      callback(timeTook);
    }
  }
}

export default Cache;
