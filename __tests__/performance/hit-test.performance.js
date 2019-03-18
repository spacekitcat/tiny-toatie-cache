import CacheStore from '../../src/cache-store';
import Cache from '../../src/cache';
import fs from 'fs';
import path from 'path';

const stats = {};
const statTick = key => {
  const stat = stats[key];
  if (!stat) {
    stats[key] = 1;
  } else {
    stats[key] = stat + 1;
  }
};

const printStat = key => {
  console.log(`${key} count: ${stats[key]}`);
};

describe('A spectre haunts Europe, the spectre of communism', () => {
  it('hit/miss efficiency test', () => {
    let store = new CacheStore(13376);
    let cache = new Cache(store);
    let hitTimeAvg = 0;
    let missTimeAvg = 0;
    let wordCounter = 0;
    let start = Date.now();

    cache.on('hit', hitTime => {
      hitTimeAvg += hitTime;
      statTick('hit');
    });

    cache.on('miss', missTime => {
      missTimeAvg += missTime;
      statTick('miss');
    });

    const readStream = fs.createReadStream(
      path.join(__dirname, 'the-communist-manifesto.txt')
    );
    let fileWriteStream = fs.createWriteStream('/dev/null');

    readStream.on('data', chunk => {
      let bufferOffsetStart = 0;
      for (let i = 0; i < chunk.length; ++i) {
        if (chunk[i] !== 0x20) {
          continue;
        }

        const buffer = chunk.slice(bufferOffsetStart, i);
        cache.append(buffer);
        cache.find(buffer);
        cache.find(buffer);
        cache.find(buffer);
        wordCounter += 1;
        bufferOffsetStart = i + 1;
      }
    });

    fileWriteStream.on('finish', () => {
      start = Date.now() - start;
      console.log('Total time:', start / 60 / 60);
      console.log('Word count: ', wordCounter);
      printStat('miss');
      console.log('Miss operation avg. time: ', missTimeAvg / stats['miss']);
      printStat('hit');
      console.log('Hit operation avg. time: ', hitTimeAvg / stats['hit']);
    });

    fileWriteStream.on('error', error => {
      console.log(error);
    });

    readStream.pipe(fileWriteStream);
  });
});
