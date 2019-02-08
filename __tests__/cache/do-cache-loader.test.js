import doCacheLookup from '../../src/cache/do-cache-lookup';

describe('The `doCacheLookup` function', () => {
    describe('when the specified read buffer contains a single byte', () => {
        describe('and an empty dictionary is specified', () => {
            it('should return the expected result', () => {
                const specifiedDictionary = Buffer.from([]);
                const specifiedReadBuffer = Buffer.from([0x61]);

               expect(doCacheLookup(specifiedDictionary, specifiedReadBuffer)).toMatchObject({
                    token: specifiedReadBuffer,
                    prefix: null 
                });
            });

            it('should return the expected result (variation of the test data)', () => {
                const specifiedDictionary = Buffer.from([]);
                const specifiedReadBuffer = Buffer.from([0x45]);

                expect(doCacheLookup(specifiedDictionary, specifiedReadBuffer)).toMatchObject({
                    token: specifiedReadBuffer,
                    prefix: null
                });
            });
        }); 
    });
});
