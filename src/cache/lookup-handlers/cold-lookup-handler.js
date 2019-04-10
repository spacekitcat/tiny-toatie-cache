import search from '../../search';
import ResultSourceEnum from './result-source-enum';

export default request => {
  const { store, lookupKey } = request;
  const searchResult = search(store.getInternalBuffer(), lookupKey);

  if (searchResult) {
    store.put(lookupKey, searchResult.offset);
  }

  return searchResult
    ? Object.assign(searchResult, {
        handler_type: ResultSourceEnum.COLD_LOOKUP_HANDLER
      })
    : null;
};
