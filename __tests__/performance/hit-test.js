import CacheStore from '../../src/cache-store';
import Cache from '../../src/cache';
import fs from 'fs';
import path from 'path';

describe('A spectre haunts Europe, the spectre of communism', () => {
  it('hit/miss efficiency test', () => {
    let store = new CacheStore(128000);
    let cache = new Cache(store);
    let hitCount = 0;
    let hitTimeAvg = 0;
    let missCount = 0;
    let missTimeAvg = 0;
    let wordCounter = 0;
    let words = [];

    cache.on('hit', (hitTime) => {
      hitCount += 1;
      hitTimeAvg += hitTime;
    });

    cache.on('miss', (missTime) => {
      missCount += 1;
      missTimeAvg += missTime;
    });

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
          words.push(buffer);
          cache.find(buffer);
          wordCounter += 1;
        }
        buffer = Buffer.from([]);
      }
    });

    fileWriteStream.on('finish', () => {
      console.log('Word count: ', wordCounter);
      console.log('Miss count: ', missCount);
      console.log('Miss operation avg. time: ',  missTimeAvg / missCount);
      console.log('Hit count: ', hitCount);
      console.log('Hit operation avg. time: ', hitTimeAvg / hitCount);

    })

    fileWriteStream.on('error', error => {
      console.log(error);
    });

    readStream.pipe(fileWriteStream);
  });
});
