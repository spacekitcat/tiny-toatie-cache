import { Proxy } from 'cloakroom-smart-buffer-proxy';

class CacheStore {
  constructor(size = 32000) {
    this.offset = 0;
    this.internalStore = new Proxy(size);
    this.store = {};
  }

  append(list) {
    this.internalStore.append(list);
  }

  getReadOnlyBuffer() {
    return this.internalStore.getReadOnlyBuffer();
  }

  put(key, offset) {
    const ticket = this.internalStore.createTicket(offset);
    this.store[key.toString()] = ticket;
  }

  read(key) {
    const keyStr = key.toString();
    const cacheHit = this.store[keyStr];
    if (!cacheHit) {
      return null;
    }

    const res = this.internalStore.resolveTicket(cacheHit);
    if (!res) {
      delete this.store[keyStr];
      return null;
    }

    return { offset: res.offset, value: Buffer.from(keyStr), length: key.length };
  }

  getStoreSize() {
    return Object.entries(this.store).length;
  }
}

export default CacheStore;
