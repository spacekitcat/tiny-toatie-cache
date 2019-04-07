import { Proxy } from 'cloakroom-smart-buffer-proxy';
import { metrohash64 } from 'metrohash';

class CacheStore {
  constructor(size = 32000) {
    this.offset = 0;
    this.internalStore = new Proxy(size);
    this.store = {};
  }

  append(list) {
    this.internalStore.append(list);
  }

  getBufferCopy() {
    return this.internalStore.getInternalBuffer();
  }

  getKeyHash(key) {
    return metrohash64(key, 918298938);
  }

  put(key, offset) {
    const ticket = this.internalStore.createTicket(offset);
    this.store[this.getKeyHash(key)] = { ticket };
  }

  read(key) {
    const keyHash = this.getKeyHash(key);
    const cacheHit = this.store[keyHash];
    if (!cacheHit) {
      return null;
    }

    const res = this.internalStore.resolveTicket(cacheHit.ticket);
    if (!res) {
      delete this.store[keyHash];
      return null;
    }

    return {
      offset: res.offset,
      value: key,
      length: key.length
    };
  }

  getStoreSize() {
    return Object.entries(this.store).length;
  }
}

export default CacheStore;
