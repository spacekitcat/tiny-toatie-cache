import LookupDispatcher from '../../src/cache/lookup-dispatcher';

describe('The `lookupDispatch` module', () => {
  it('should be able to instantiate', () => {
    const lookupDispatch = new LookupDispatcher();
    expect(lookupDispatch).not.toBe(null);
  });
});
