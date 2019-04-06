import search from '../../search';

export default request => {
  const { store, lookupKey } = request;
  return search(store.getBufferCopy(), lookupKey);
};
