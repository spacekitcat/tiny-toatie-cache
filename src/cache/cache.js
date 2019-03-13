import { Proxy } from 'cloakroom-smart-buffer-proxy';

class Cache {
  constructor(size = 32000) {
    this.offset = 0;
    this.internalCache = new Proxy(size);
    this.store = [];
  }

  append(list) {
    this.internalCache.append(list);
  }

  getReadOnlyBuffer() {
    return this.internalCache.getReadOnlyBuffer();
  }

  put(key, offset) {
    const ticket = this.internalCache.createTicket(offset);
    this.store[key.toString()] = ticket;
  }

  read(key) {
    const cacheed = this.store[key.toString()];
    if (!cacheed) {
      return null;
    }

    const res = this.internalCache.resolveTicket(cacheed);
    if (!res) {
      delete this.store[key.toString()];
      return null;
    }

    if (this.hitHandler) {
      this.hitHandler(key.toString());
    }

    const buffer = this.getReadOnlyBuffer();
    let value;
    const from = buffer.length - res.offset - 1;
    value = buffer.slice(from, res.length);

    return { offset: res.offset, value: value, length: key.length };
  }

  getCacheSize() {
    return Object.entries(this.store).length;
  }

  on(eventKey, handler) {
    if (eventKey === 'hit') {
      this.hitHandler = handler;
    }
  }
}

export default Cache;
