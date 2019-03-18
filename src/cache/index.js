import search from '../../src/search';

class Cache {
  constructor(store) {
    if (!store) {
      throw new Error('no store object was provided');
    }

    this.store = store;
    this.events = {};
  }

  append(list) {
    this.store.append(list);
  }

  find(target) {
    // Warn lookup...
    const cachedResult = this.store.read(target);

    if (cachedResult) {
      this.callOn('hit');
      return cachedResult;
    }

    // Cold lookup...
    const result = search(Buffer.from(this.store.getReadOnlyBuffer()), target);

    if (result) {
      this.store.put(target, result.offset);
    }

    this.callOn('miss');
    return result;
  }

  getInternalStore() {
    return this.store;
  }

  on(eventKey, eventFn) {
    this.events[eventKey] = eventFn;
  }

  callOn(eventKey) {
    const callback = this.events[eventKey];
    if (callback) {
      callback();
    }
  }
}

export default Cache;
