import ResultSourceEnum from './result-source-enum';

export default request => {
  const { store, lookupKey } = request;
  const result = store.read(lookupKey);

  return result
    ? Object.assign(result, {
        handler_type: ResultSourceEnum.CACHE_LOOKUP_HANDLER
      })
    : null;
};
