import search from '../../search';

export default request => {
  const { store, lookupKey } = request;
  const searchResult = search(store.getBufferCopy(), lookupKey);

  if (searchResult) {
    store.put(lookupKey, searchResult.offset);
  }

  return searchResult;
};
