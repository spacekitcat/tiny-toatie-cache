import search from '../../search';
import ResultSourceEnum from './result-source-enum';

export default request => {
  const { store, lookupKey } = request;
  const searchResult = search(store.getInternalBuffer(), lookupKey);

  if (searchResult) {
    store.put(lookupKey, searchResult.offset);
    for (let i = 0; i < lookupKey.length - 1; ++i) {
      store.put(
        lookupKey.slice(0, lookupKey.length - 1 - i),
        searchResult.offset
      );
      //cache.find(buffer.slice(0, i));
      //cache.find(buffer.slice(buffer.length - i - 1, buffer.length - 1));
    }
  }

  return searchResult
    ? Object.assign(searchResult, {
        handler_type: ResultSourceEnum.COLD_LOOKUP_HANDLER
      })
    : null;
};
