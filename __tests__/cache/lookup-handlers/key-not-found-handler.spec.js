import handleKeyNotFound from '../../../src/cache/lookup-handlers/key-not-found-handler';
import CacheStore from '../../../src/cache-store';

const createStoreInstance = contents => {
  const store = new CacheStore();
  store.append(contents);
  return store;
};

describe('The `key-not-found-handler` module', () => {
  it('should work', () => {
    const store = createStoreInstance(Buffer.from([0x22, 0x43, 0x87]));
    const target = Buffer.from([0x43, 0x87]);

    handleKeyNotFound({
      store: store,
      lookupKey: target
    });
  });
});
