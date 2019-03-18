const ToatieCache = require('./lib');

const cacheStorageSize = 1234456;
const cache = ToatieCache.build(cacheStorageSize);

cache.append(Buffer.from([0x66, 0x84, 0x33, 0x56, 0x11, 0x34, 0x89, 0xff]));
for (let i = 0; i < 64000; ++i) {
    cache.append(Buffer.from([0xFF]));
}

cache.on('hit', timeTook => { console.log(`Cache hit! Operation time: ${timeTook}ms`); });

cache.on('miss', timeTook => { console.log(`Cache miss! Operation time: ${timeTook}ms`); });

/* First call, a cold lookup */
cache.find(Buffer.from([0x33, 0x56]));

/* Second call, a cache hit */
cache.find(Buffer.from([0x33, 0x56]));

/* Third call, a cache hit */
cache.find(Buffer.from([0x33, 0x56]));
