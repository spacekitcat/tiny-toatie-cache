import handleColdLookup from './lookup-handlers/cold-lookup-handler';

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

  checkCache(target) {
    const cachedResult = this.store.read(target);
    if (cachedResult) {
      this.callOn('hit', Date.now() - this.lastTimeSnapshot);
    }
    return cachedResult;
  }

  coldSearch(target) {
    const result = handleColdLookup({ store: this.store, lookupKey: target });

    this.callOn('miss', Date.now() - this.lastTimeSnapshot);

    return result;
  }

  find(target) {
    this.lastTimeSnapshot = Date.now();
    const cacheResult = this.checkCache(target);
    if (cacheResult) {
      return cacheResult;
    }

    return this.coldSearch(target);
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
