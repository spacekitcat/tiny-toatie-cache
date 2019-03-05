import { Proxy } from 'cloakroom-smart-buffer-proxy';

class Cache {
  constructor() {
    this.offset = 0;
    this.internalCache = new Proxy();
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
    const res = this.internalCache.resolveTicket(this.store[key.toString()]);

    const buffer = this.getReadOnlyBuffer();
    let value;
    const from = buffer.length - res.offset - 1;
    value = buffer.slice(from, res.length);

    return { "offset": res.offset, "value": value, length: key.length };
  }
}

export default Cache;
