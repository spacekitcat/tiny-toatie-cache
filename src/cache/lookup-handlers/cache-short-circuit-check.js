import HandlerResponseEnum from './handler-response-enum';

export default request => {
  const { store, lookupKey } = request;
  const result = store.read(Buffer.from([lookupKey[0]])) || null;

  const responseType = result
    ? HandlerResponseEnum.UNHANDLED
    : HandlerResponseEnum.HANDLED_ABORT;
  
  return {
    result,
    response_type: responseType
  };
}
