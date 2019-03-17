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

    describe('data is appended to the cache', () => {
        it('should push the new data to the front of the byte stack', () => {
            const expectedAppendData = Buffer.from([0x66]);
            const store = new Store();
            const cache = new Cache(store);

            cache.append(expectedAppendData);

            expect(cache.getInternalStore().getReadOnlyBuffer()).toMatchObject(expectedAppendData);
        });
    });

    describe('data is appended to the cache twice', () => {
        it('should push the new data to the front of the byte stack', () => {
            const expectedAppendDataOne = Buffer.from([0x66]);
            const expectedAppendDataTwo = Buffer.from([0x66]);
            const store = new Store();
            const cache = new Cache(store);

            cache.append(expectedAppendDataOne);
            cache.append(expectedAppendDataTwo);

            expect(cache.getInternalStore().getReadOnlyBuffer()).toMatchObject(Buffer.concat([expectedAppendDataOne, expectedAppendDataTwo]));
        });
    });

    describe('the find method is ran with an empty store', () => {
        it('should return null', () => {
            const store = new Store();
            const cache = new Cache(store);

            expect(cache.find(Buffer.from([0x44]))).toBe(null);
        });
    });
});
