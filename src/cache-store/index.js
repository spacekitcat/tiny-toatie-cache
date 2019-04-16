import { Proxy } from 'cloakroom-smart-buffer-proxy';
import { metrohash64 } from 'metrohash';
import RecordTypeEnum from '../cache/lookup-handlers/result-source-enum';

class CacheStore {
  constructor(size = 32000) {
    this.internalStore = new Proxy(size);
    this.store = {};
  }

  append(list) {
    this.internalStore.append(list);
  }

  getInternalBuffer() {
    return this.internalStore.getInternalBuffer();
  }

  getKeyHash(key) {
    return metrohash64(key, 918298938);
  }

  put(key, offset, metadata) {
    const ticket = this.internalStore.createTicket(offset);
    this.store[this.getKeyHash(key)] = { ticket, metadata };
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

    const { metadata } = cacheHit;
    return {
      offset: res.offset,
      value: key,
      length: key.length,
      metadata
    };
  }

  getStoreSize() {
    return Object.entries(this.store).length;
  }
}

export default CacheStore;
