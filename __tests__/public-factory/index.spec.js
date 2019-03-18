import publicFactory from '../../src/public-factory';

describe('The `publicFactory`', () => {
  describe('When no arguments are provided', () => {
    it('should construct with the expected defaults', () => {
      expect(publicFactory().getInternalStore().internalStore.maximumSize).toBe(
        32000
      );
    });
  });

  describe('When no arguments are provided', () => {
    it('should construct with the expected defaults', () => {
      const expectedMaxSize = 128000;
      expect(
        publicFactory(expectedMaxSize).getInternalStore().internalStore
          .maximumSize
      ).toBe(expectedMaxSize);
    });
  });
});
