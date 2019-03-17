import Store from '../../src/store';
import Cache from '../../src/cache';
import fs from 'fs';
import path from 'path';

describe('A spectre haunts Europe, the spectre of communism', () => {
  it('works', () => {
    let store = new Store();
    let cache = new Cache(store);

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
          // Hmm. It go crash, it go bang, it go wallop.
          //cache.find(key);
        }
        buffer = Buffer.from([]);
      }
    });

    readStream.on('error', error => {
      console.log(error);
    });

    readStream.pipe(fileWriteStream);
  });
});
