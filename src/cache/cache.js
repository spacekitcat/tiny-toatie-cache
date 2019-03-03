import { Proxy } from 'cloakroom-smart-buffer-proxy';

class Cache {
  constructor() {
    this.offset = 0;
    this.internalCache = new Proxy();
  }
}

export default Cache;
