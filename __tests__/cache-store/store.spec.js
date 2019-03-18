import CacheStore from '../../src/cache-store';

describe('The `Store` class', () => {
  it('append method', () => {
    const sut = new CacheStore();
    const expectedAppendList = [0x45, 0x44, 0x46];
    sut.append(Buffer.from(expectedAppendList));
    expect(sut.getReadOnlyBuffer()).toMatchObject(expectedAppendList);
    expect(sut.getStoreSize()).toBe(0);
  });

  it('append method (alt)', () => {
    const sut = new CacheStore();
    const expectedAppendList = [0x75, 0x64, 0x26];
    sut.append(Buffer.from(expectedAppendList));
    expect(sut.getReadOnlyBuffer()).toMatchObject(expectedAppendList);
    expect(sut.getStoreSize()).toBe(0);
  });

  describe('An existing single-byte key is put and retrieved', () => {
    it('should put and retrieve as expected', () => {
      const sut = new CacheStore();
      const key = Buffer.from([0x26]);
      const expectedAppendList = [0x75, 0x64, 0x26, 0x44, 0x83, 0xff];
      sut.append(Buffer.from(expectedAppendList));

      sut.put(key, 3);

      expect(sut.read(key)).toMatchObject({
        value: key,
        offset: 3,
        length: 1
      });
      expect(sut.getStoreSize()).toBe(1);
    });

    it('should put and retrieve as expected (alt)', () => {
      const sut = new CacheStore();
      const key = Buffer.from([0x23]);
      const expectedAppendList = [0x15, 0x24, 0x36, 0x14, 0x23, 0x5f];
      sut.append(Buffer.from(expectedAppendList));

      sut.put(key, 1);

      expect(sut.read(key)).toMatchObject({
        value: key,
        offset: 1,
        length: 1
      });
      expect(sut.getStoreSize()).toBe(1);
    });

    it('should call the on `hit` handler', () => {
      const sut = new CacheStore();
      const key = Buffer.from([0x26]);
      const expectedAppendList = [0x75, 0x64, 0x26, 0x44, 0x83, 0xff];
      sut.append(Buffer.from(expectedAppendList));

      sut.put(key, 3);

      expect(sut.read(key)).toMatchObject({
        value: key,
        offset: 3,
        length: 1
      });
      expect(sut.getStoreSize()).toBe(1);
    });
  });
  

  describe('An existing multi-byte key is put and retrieved', () => {
    it('should put and retrieve as expected', () => {
      const sut = new CacheStore();
      const key = Buffer.from([0x26, 0x44]);
      const expectedAppendList = [0x75, 0x64, 0x26, 0x44, 0x83, 0xff];
      sut.append(Buffer.from(expectedAppendList));

      sut.put(key, 3);

      expect(sut.read(key)).toMatchObject({
        value: key,
        offset: 3,
        length: 2
      });
      expect(sut.getStoreSize()).toBe(1);
    });

    it('should put and retrieve as expected (alt)', () => {
      const sut = new CacheStore();
      const key = Buffer.from([0x23, 0x5f]);
      const expectedAppendList = [0x15, 0x24, 0x36, 0x14, 0x23, 0x5f];
      sut.append(Buffer.from(expectedAppendList));

      sut.put(key, 1);

      expect(sut.read(key)).toMatchObject({
        value: key,
        offset: 1,
        length: 2
      });
      expect(sut.getStoreSize()).toBe(1);
    });
  });

  describe('A key `length` which check that an object, not an array, is the underlying store', () => {
    it('should put and retrieve as expected', () => {
      const sut = new CacheStore();
      const key = Buffer.from([0x6c, 0x65, 0x6E, 0x67, 0x74, 0x68]);
      sut.append(key);

      sut.put(key, 5);
      
      expect(sut.read(key)).toMatchObject({
        value: key,
        offset: 5,
        length: 6
      });
      expect(sut.getStoreSize()).toBe(1);
    });
  });

  describe('An non-existant key is specified (store-miss)', () => {
    it('should returns `null`', () => {
      const sut = new CacheStore();
      const key = Buffer.from([0xFF, 0xFF]);
      const expectedAppendList = [0x75, 0x64, 0x26, 0x44, 0x83, 0xff];
      sut.append(Buffer.from(expectedAppendList));

      expect(sut.read(key)).toBe(null);
      expect(sut.getStoreSize()).toBe(0);
    });
  });

  describe('An expired key is specified (store-expiry)', () => {
    it('shoud return `null`', () => {
      const sut = new CacheStore(6);
      const key = Buffer.from([0x64]);
      sut.append(Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06]));
      sut.put(key, 1);
      sut.append(Buffer.from([0x23, 0x33, 0x44, 0x55, 0x66, 0x77]));

      expect(sut.read(key)).toBe(null);
      expect(sut.getStoreSize()).toBe(0);
    });
  });
});
