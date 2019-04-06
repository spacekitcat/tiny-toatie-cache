export default request => {
  const { store, lookupKey } = request;
  return store.read(lookupKey);
};
