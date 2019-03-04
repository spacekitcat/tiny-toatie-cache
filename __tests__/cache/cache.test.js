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
    
    it('put method', () => {
        const sut = new Cache();
        const key = Buffer.from([0x26]);
        const expectedAppendList = [0x75, 0x64, 0x26, 0x44, 0x83, 0xFF];
        sut.append(Buffer.from(expectedAppendList));
        
        sut.getReadOnlyBuffer();
        sut.put(key, 3);

        expect(sut.read(key)).toMatchObject({
            value: key,
            offset: 3,
            length: 1
        })
    });

    it('put method (alt)', () => {
        const sut = new Cache();
        const key = Buffer.from([0x23]);
        const expectedAppendList = [0x15, 0x24, 0x36, 0x14, 0x23, 0x5F];
        sut.append(Buffer.from(expectedAppendList));
        
        sut.getReadOnlyBuffer();
        sut.put(key, 1);

        expect(sut.read(key)).toMatchObject({
            value: key,
            offset: 1,
            length: 1
        })
    });
});
