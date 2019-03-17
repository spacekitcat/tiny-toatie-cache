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
    console.log('warm bit');
    // Warn lookup...
    const cachedResult = this.store.read(target);

    if (cachedResult) {
      return cachedResult;
    }

    console.log('cold bit');
    // Cold lookup...
    const result = search(Buffer.from(this.store.getReadOnlyBuffer()), target);

    console.log('cache do');
    if (result) {
      this.store.put(target, result);
    }

    console.log('return');
    return result;
  }

  getInternalStore() {
    return this.store;
  }
}

export default Cache;
