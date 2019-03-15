import search from '../../src/search/search';

describe('The `search` method', () => {
  describe('when the dictionary is `null`', () => {
    it('should throw an exception', () => {
      expect(() => search(null, Buffer.from([]))).toThrow(
        /incorrect dictionary type: expected a Buffer instance instead of `null`/
      );
    });
  });

  describe('when the search item is null', () => {
    it('should return `null`', () => {
      expect(search(Buffer.from([]), null)).toBe(null);
    });
  });

  describe('when the dictionary is empty', () => {
    describe('when the search term is empty', () => {
      it('should return `null`', () => {
        expect(search(Buffer.from([]), Buffer.from([]))).toBe(null);
      });
    });
    describe('when the search term has a non-empty value', () => {
      it('should return `null`', () => {
        expect(search(Buffer.from([]), Buffer.from([0x76, 0x65]))).toBe(null);
      });
    });
  });

  describe('when the dictionary has a size of 1', () => {
    const dictionary = Buffer.from([0x76]);
    describe('when the search term is empty', () => {
      it('should return `null`', () => {
        expect(search(dictionary, Buffer.from([]))).toBe(null);
      });
    });

    describe('when the search term has a length of 1', () => {
      describe('when the search term does not exist', () => {
        it('should return `null`', () => {
          expect(search(dictionary, Buffer.from([0x22]))).toBe(null);
        });
      });
      describe('when the search term has exist', () => {
        it('should return the expected location', () => {
          expect(search(dictionary, dictionary)).toMatchObject({
            offset: 0,
            length: 1
          });
        });
      });
    });

    describe('when the search term has a length of 2', () => {
      it('should return `null`', () => {
        expect(search(dictionary, Buffer.from([0x22, 0x22]))).toBe(null);
      });
    });
  });

  describe('when the dictionary has a size of 2', () => {
    const dictionary = Buffer.from([0x56, 0x66]);

    describe('when the search term has a size of 1', () => {
      describe('when the search term does not exist', () => {
        it('should return `null`', () => {
          expect(search(dictionary, Buffer.from([0x22]))).toBe(null);
        });
      });

      describe('when the search term exists', () => {
        it('should return the expected location (front of Buffer)', () => {
          expect(search(dictionary, Buffer.from([0x66]))).toMatchObject({
            offset: 0,
            length: 1
          });
        });

        it('should return the expected location (back of Buffer)', () => {
          expect(search(dictionary, Buffer.from([0x56]))).toMatchObject({
            offset: 1,
            length: 1
          });
        });
      });
    });

    describe('when the search term has a size of 2', () => {
      describe('when the search term does not exist', () => {
        it('should return `null`', () => {
          expect(search(dictionary, Buffer.from([0x33, 0x33]))).toBe(null);
        });
      });

      describe('when the search term exists', () => {
        it('should return the expected location', () => {
          expect(search(dictionary, dictionary)).toMatchObject({
            offset: 1,
            length: 2
          });
        });
      });
    });
  });
});
