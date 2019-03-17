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
    const result = search(Buffer.from(this.store.getReadOnlyBuffer()), target);

    this.store.put(target, result);

    return result;
  }

  getInternalStore() {
    return this.store;
  }
}

export default Cache;
