import search from '../../src/search/search'

describe('The `search` method', () => {
    describe('when the dictionary is empty', () => {
        describe('when the search term is empty', () => {
            it('Returns null', () => {
                expect(search(Buffer.from([]), Buffer.from([]))).toBe(null);
            });
        });
        describe('when the search term is a thing', () => {
            it('Returns null', () => {
                expect(search(Buffer.from([]), Buffer.from([0x76, 0x65]))).toBe(null);
            });
        });
    });

    describe('when the dictionary has a size of 1', () => {
        const dictionary = Buffer.from([0x76]);
        describe('when the search term is empty', () => {
            it('Returns null', () => {
                expect(search(dictionary, Buffer.from([]))).toBe(null);
            });
        });
        describe('when the search term does not exist', () => {
            it('Returns null', () => {
                expect(search(dictionary, Buffer.from([0x22]))).toBe(null);
            });
        });
        describe('when the search term does exist', () => {
            it('Returns null', () => {
                expect(search(dictionary, dictionary)).toMatchObject({
                    offset: 0,
                    length: 1
                });
            });
        });
    });
});
