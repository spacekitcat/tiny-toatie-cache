import search from '../../search';
import ResultSourceEnum from './result-source-enum';
import HandlerResponseEnum from './handler-response-enum';

export default request => {
  const { store, lookupKey } = request;
  const searchResult = search(store.getInternalBuffer(), lookupKey);

  if (searchResult) {
    store.put(lookupKey, searchResult.offset);
  }

  const result = searchResult ? searchResult : null;

  const responseType = searchResult
    ? HandlerResponseEnum.HANDLED_COMPLETE
    : HandlerResponseEnum.UNHANDLED;

  return {
    result,
    response_type: responseType,
    handler_type: ResultSourceEnum.COLD_LOOKUP_HANDLER
  };
};
