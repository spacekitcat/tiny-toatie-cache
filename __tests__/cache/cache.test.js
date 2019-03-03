import Cache from '../../src/cache/cache';

describe('The `doCacheLookup` function', () => {
    describe('when the specified read buffer contains a single byte', () => {
        describe('and the lookup item is not cached', () => {
            it('should return the expected result', () => {
                const sut = new Cache();
                expect(sut.doCacheLookup(Buffer.from([0x61]))).toBeNull();
            });
        });

        describe('and the lookup item is cached', () => {
            it('should return the expected result', () => {
                const expectedCacheKey = 0x61;
                const expectedCacheEntry = {
                    token: Buffer.from([expectedCacheKey]),
                    prefix: null
                }
                const bufferToLookFor = Buffer.from([expectedCacheKey]);

                const sut = new Cache();
                sut.doCachePut(expectedCacheKey, 0, expectedCacheEntry);
                expect(sut.doCacheLookup(bufferToLookFor)).toMatchObject(expectedCacheEntry);
            });
        });
    });

    describe('when the specified read buffer contains multiple bytes', () => {
        it('should return the expected result', () => {
            const expectedCacheKey = 0x61;
            const expectedCacheEntry = {
                token: Buffer.from([expectedCacheKey]),
                prefix: null
            }
            const bufferToLookFor = Buffer.from([expectedCacheKey]);

            const sut = new Cache();
            sut.doCachePut(expectedCacheKey, 0, expectedCacheEntry);
            expect(sut.doCacheLookup(bufferToLookFor)).toMatchObject(expectedCacheEntry);
        });
    });

});
