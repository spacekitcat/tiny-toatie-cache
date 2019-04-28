import ResultSourceEnum from './result-source-enum';
import HandlerResponseEnum from './handler-response-enum';

export default request => {
  const { store, lookupKey } = request;
  const cacheResult = store.read(lookupKey);

  const result = cacheResult || null;

  const responseType = result
    ? HandlerResponseEnum.HANDLED_COMPLETE
    : HandlerResponseEnum.UNHANDLED;

  return {
    result,
    handler_type: ResultSourceEnum.CACHE_LOOKUP_HANDLER,
    response_type: responseType
  };
};
