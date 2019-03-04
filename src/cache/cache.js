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
    console.log(key.toString());
    this.store[key.toString()] = ticket;
  }

  read(key) {
    console.log(key.toString());
    console.log(this.internalCache.resolveTicket(this.store[key.toString()]));
    const res = this.internalCache.resolveTicket(this.store[key.toString()]);

    return { "offset": res.offset, "value": Buffer.from( [ res.value ] ), length: 1 };
  }
}

export default Cache;
