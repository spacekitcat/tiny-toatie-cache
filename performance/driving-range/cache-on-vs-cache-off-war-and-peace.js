const fs = require('fs');
const ToatieCache = require('../../lib/index');
const Stopwatch = require('statman-stopwatch');

const data = fs.readFileSync(`${__dirname}/../data/war-and-peace.txt`);

const cache = ToatieCache.build(1024);
cache.append(data);

const stopwatch = new Stopwatch();

stopwatch.start();
for (let i = 0; i < 1000024; ++i) {
  const offset = Math.floor(Math.random() * cache.getLength() - 1);
  const length = Math.floor(Math.random() * (cache.getLength() - offset));
  const key = data.slice(offset, offset + length); 

  cache.find(key, false);
}
stopwatch.stop();
console.log(`Experiment time taken: ${stopwatch.read()}`);
console.log();
stopwatch.reset();

