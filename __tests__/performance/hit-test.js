import Cache from '../../src/cache/cache';
import fs from 'fs';
import path from 'path';

describe('A spectre haunts Europe, the spectre of communism', () => {
  it('works', () => {
    let cache = new Cache();

    const readStream = fs.createReadStream(
      path.join(__dirname, 'the-communist-manifesto.txt')
    );
    let fileWriteStream = fs.createWriteStream('/dev/null');

      let buffer = Buffer.from([]);
    readStream.on('data', chunk => {
      for (let i = 0; i < chunk.length; ++i) {
        if (chunk[i] === 0x20) {
          cache.put(buffer.toString(), 5);
          buffer = Buffer.from([]);
          continue;
        }

        buffer = Buffer.concat([buffer, chunk.slice(i, i + 1)]);
      }
    });

    readStream.on('error', error => {
      console.log(error);
    });

    readStream.pipe(fileWriteStream);
  });
});
