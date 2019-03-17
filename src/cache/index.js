import search from '../../src/search';

class Cache {
  constructor(store) {
    if (!store) {
      throw new Error('no store object was provided');
    }

    this.store = store;
  }

  append(list) {
    this.store.append(list);
  }

  find(target) {
    // Warn lookup...
    const cachedResult = this.store.read(target);

    if (cachedResult) {
      return cachedResult;
    }

    // Cold lookup...
    const result = search(Buffer.from(this.store.getReadOnlyBuffer()), target);

    if (result) {
      this.store.put(target, result.offset);
    }

    console.log('miss');
    return result;
  }

  getInternalStore() {
    return this.store;
  }
}

export default Cache;
