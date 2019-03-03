import { Proxy } from 'cloakroom-smart-buffer-proxy';

class Cache {
  constructor() {
    this.offset = 0;
    this.internalCache = new Proxy();
  }

  append(list) {
    this.internalCache.append(list);
  }

  getReadOnlyBuffer() {
    return this.internalCache.getReadOnlyBuffer();
  }

  put() {
  }

  read() {
    return {
      value: Buffer.from([0x26]),
      offset: 2,
      length: 1
    };
  }
}

export default Cache;
