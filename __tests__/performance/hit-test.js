import CacheStore from '../../src/cache-store';
import Cache from '../../src/cache';
import fs from 'fs';
import path from 'path';

describe('A spectre haunts Europe, the spectre of communism', () => {
  it.skip('works', () => {
    let store = new CacheStore();
    let cache = new Cache(store);
    let wordCounter = 0;

    const readStream = fs.createReadStream(
      path.join(__dirname, 'the-communist-manifesto.txt')
    );
    let fileWriteStream = fs.createWriteStream('/dev/null');

    let buffer = Buffer.from([]);
    readStream.on('data', chunk => {
      for (let i = 0; i < chunk.length; ++i) {
        if (chunk[i] !== 0x20) {
          buffer = Buffer.concat([buffer, chunk.slice(i, i + 1)]);
          continue;
        }

        const key = buffer.toString();
        if (key.length > 0) {
          cache.append(buffer);
          wordCounter += buffer.length;
          cache.find(buffer);
        }
        buffer = Buffer.from([]);
      }
    });

    fileWriteStream.on('finish', () => {
      console.log('Word count : ', wordCounter);
    })

    fileWriteStream.on('error', error => {
      console.log(error);
    });

    readStream.pipe(fileWriteStream);
  });
});
