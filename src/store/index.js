import { Proxy } from 'cloakroom-smart-buffer-proxy';

class Store {
  constructor(size = 32000) {
    this.offset = 0;
    this.internalStore = new Proxy(size);
    this.store = [];
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
    const cacheHit = this.store[key.toString()];
    if (!cacheHit) {
      return null;
    }

    const res = this.internalStore.resolveTicket(cacheHit);
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

  getStoreSize() {
    return Object.entries(this.store).length;
  }

  on(eventKey, handler) {
    if (eventKey === 'hit') {
      this.hitHandler = handler;
    }
  }
}

export default Store;
