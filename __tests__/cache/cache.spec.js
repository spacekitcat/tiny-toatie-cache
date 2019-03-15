import Cache from '../../src/cache';
import Store from '../../src/store';

describe('The `Cache` class', () => {
    describe('the constructor is called with zero arguments', () => {
        it('should ...', () => {
            expect(() => new Cache()).toThrow(/no store object was provided/);
        });
    });

    describe('the constructor is called with a valid store object', () => {
        it('should construct and set the internal store', () => {
            const store = new Store();
            const cache = new Cache(store);

            expect(cache.getInternalStore()).toBe(store);
        });
    });
});
