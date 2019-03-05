import Cache from '../../src/cache/cache';

describe('The `Cache` class', () => {
  it('append method', () => {
    const sut = new Cache();
    const expectedAppendList = [0x45, 0x44, 0x46];
    sut.append(Buffer.from(expectedAppendList));
    expect(sut.getReadOnlyBuffer()).toMatchObject(expectedAppendList);
  });

  it('append method (alt)', () => {
    const sut = new Cache();
    const expectedAppendList = [0x75, 0x64, 0x26];
    sut.append(Buffer.from(expectedAppendList));
    expect(sut.getReadOnlyBuffer()).toMatchObject(expectedAppendList);
  });

  describe('An existing single-byte key is put and retrieved', () => {
    it('puts and retrieves as expected', () => {
      const sut = new Cache();
      const key = Buffer.from([0x26]);
      const expectedAppendList = [0x75, 0x64, 0x26, 0x44, 0x83, 0xff];
      sut.append(Buffer.from(expectedAppendList));

      sut.put(key, 3);

      expect(sut.read(key)).toMatchObject({
        value: key,
        offset: 3,
        length: 1
      });
    });

    it('puts and retrieves as expected (alt)', () => {
      const sut = new Cache();
      const key = Buffer.from([0x23]);
      const expectedAppendList = [0x15, 0x24, 0x36, 0x14, 0x23, 0x5f];
      sut.append(Buffer.from(expectedAppendList));

      sut.put(key, 1);

      expect(sut.read(key)).toMatchObject({
        value: key,
        offset: 1,
        length: 1
      });
    });
  });

  describe('An existing multi-byte key is put and retrieved', () => {
    it('puts and retrieves as expected', () => {
      const sut = new Cache();
      const key = Buffer.from([0x26, 0x44]);
      const expectedAppendList = [0x75, 0x64, 0x26, 0x44, 0x83, 0xff];
      sut.append(Buffer.from(expectedAppendList));

      sut.put(key, 3);

      expect(sut.read(key)).toMatchObject({
        value: key,
        offset: 3,
        length: 2
      });
    });

    it('puts and retrieves as expected (alt)', () => {
      const sut = new Cache();
      const key = Buffer.from([0x23, 0x5f]);
      const expectedAppendList = [0x15, 0x24, 0x36, 0x14, 0x23, 0x5f];
      sut.append(Buffer.from(expectedAppendList));

      sut.put(key, 1);

      expect(sut.read(key)).toMatchObject({
        value: key,
        offset: 1,
        length: 2
      });
    });
  });

  describe('An non-existant key is specified', () => {
    it('returns null', () => {
      const sut = new Cache();
      const key = Buffer.from([0xFF, 0xFF]);
      const expectedAppendList = [0x75, 0x64, 0x26, 0x44, 0x83, 0xff];
      sut.append(Buffer.from(expectedAppendList));

      expect(sut.read(key)).toBe(null);
    });
  });

  describe('An expired key is specified', () => {
    it('returns null', () => {
      const sut = new Cache(6);
      const key = Buffer.from([0x64]);
      sut.append(Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06]));
      sut.put(key, 1);
      sut.append(Buffer.from([0x23, 0x33, 0x44, 0x55, 0x66, 0x77]));

      expect(sut.read(key)).toBe(null);
    });
  });
});
