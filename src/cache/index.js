import handleCacheLookup from './lookup-handlers/cache-lookup-handler';
import handleColdLookup from './lookup-handlers/cold-lookup-handler';
import LookupDispatcher from './lookup-dispatcher';

class Cache {
  constructor(store) {
    if (!store) {
      throw new Error('no store object was provided');
    }

    this.store = store;
    this.events = {};
    this.lastTimeSnapshot = 0;
    this.lookupDispatcher = new LookupDispatcher();
    this.lookupDispatcher.registerHandler(handleCacheLookup);
    this.lookupDispatcher.registerHandler(handleColdLookup);
    this.lookupDispatcher.on('complete', this.onCompleteCallback.bind(this));
  }

  onCompleteCallback(handlerId) {
    switch (handlerId) {
      case 0:
        this.callOn('hit', Date.now() - this.lastTimeSnapshot);
        break;
      case 1:
        this.callOn('miss', Date.now() - this.lastTimeSnapshot);
        break;
    }
  }

  append(list) {
    this.store.append(list);
  }

  checkCache(target) {
    const cachedResult = handleCacheLookup({
      store: this.store,
      lookupKey: target
    });

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
    return this.lookupDispatcher.handleLookup({
      store: this.store,
      lookupKey: target
    });
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
