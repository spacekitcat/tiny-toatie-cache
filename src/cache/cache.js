class Cache {
  constructor() {
    this.offset = 0;
    this.internalCache = [];
  }

  doCachePut(key, frameNumber, record) {
    this.internalCache[key] = record;
  }

  doCacheLookup(bufferToFindMatchFor) {
    const lookupResult = this.internalCache[bufferToFindMatchFor[0]];

    if (lookupResult) {
      return lookupResult;
    } else {
      return null;
    }
  }
}

export default Cache;
