# Tiny Toatie Cache

This library is designed to cache search operations performed against a [Node.js Buffer](https://nodejs.org/api/buffer.html#buffer_buffer). The maximum size of the underlying storage Buffer is bounded (the upper bound is specified on instantiation). New data is _appended to the front_ and if the upper size limit is hit, the _oldest items will be deleted from the back_.

The search operation is concerned with finding out if a key exists within a `Buffer` and if it does exist, what its offset is. It's primarily designed for algorithms utilizing a sliding window.

## Use case

You interact with this library in the same way you interact with an associative array (such as a hash map). The main feature `Tiny Toatie Cache` offers is a reasonably strict boundary on the amount of memory it can use. The first time you perform a lookup for a specific key, it calls [Buffer.indexOf(key)](https://nodejs.org/api/buffer.html#buffer_buf_indexof_value_byteoffset_encoding), but for each subsequent call, the internal cache will short circuit the need for a repeat call to `indexOf`. The offsets are tracked relative to an internal pointer which means the cache entries still have enough information to tell you a keys' offset within the current internal Buffer (rather than what it _was_ when it was originally cached). Expired cache entries are never returned because it can determine the validity of a cache entry before returning it with negligible overhead.

This is made for an experimental implementation of LZ77, a streaming compression algorithm. It's often called a 'Streaming' because each compression packet can be decompressed in sequential order and the next chunk of clear text data will be produced. Some compression algorithms must decompress the entire stream of compression packets before they can get at any of the clear text data. The LZ77 compression algorithm also doesn't need to be distributed with a static dictionary, it performs search operations against a _sliding window_ which fulfils an equivalent role of a dictionary.

I wrote a [prototype of LZ77](https://github.com/spacekitcat/prototype-libz77) and after finally creating something reliable, I found the performance, both in terms of speed and compression, to be quite horrific. The main problem is that the dictionary buffer needs to be in the region of 2 Megabytes (2048000 Bytes) for good space savings, but that means almost 2048000 comparisons every time it has to find the next RLE. In the worst case scenario, LZ77 could have to perform a full search operation across the entire history buffer for every single byte in its input stream. Without any sort of optimization, my prototype is `O(n^2)`. The dictionary size the lz77 prototype uses is more modest and it performs terribly.

I originally spent time looking for a data structure to represent the history buffer. My naive stab at solution would be some sort of tree with an insertion performance of `O(1)` and a lookup performance of `O(log(N))` (`O(N log(N))` in context). The big problem with a tree is the sheer size of the input streams it needs to handle (have a think about how big a file of 2048000 bytes (or 2MB) actually is if you process it a byte at a time) which will almost always lead you to hitting the dictionary size. You cannot exceed the dictionary size without both data integrity (the decompression process needs to use the same value as the compressor) and memory space issues. With a tree like structure, you'd either need something with a very complex purging mechanism or you have to rebuild the tree constantly.

Caching will hopefully prove simple and fast with low housekeeping overhead, but it's ultimately just a research project.

## Technical design

The library uses [cloakroom-smart-buffer-proxy](https://www.npmjs.com/package/cloakroom-smart-buffer-proxy) (created specifically for this library) behind the scenes as a sort of book keeper.

## Building

```javascript
/tiny-toatie-cache <master> % yarn install
/tiny-toatie-cache <master> % yarn build
```

## Unit tests

The unit tests use Jest and the Yarn command below runs them.

```bash
/tiny-toatie-cache ‹master*› % yarn test
```

## Adding to your project

First, add the dependency to your project like so:

```bash
/your-rad-project ‹master*› % yarn add tiny-toatie-cache
```

And then you just use the library like the example below (use import syntax if you have Babel configured for it):

```javascript
const ToatieCache = require('tiny-toatie-cache');

const cacheStorageSize = 1234456;
const cache = ToatieCache.build(cacheStorageSize);

cache.append(Buffer.from([0x66, 0x84, 0x33, 0x56, 0x11, 0x34, 0x89, 0xff]));
for (let i = 0; i < 64000; ++i) {
  cache.append(Buffer.from([0xff]));
}

cache.on('hit', timeTook => {
  console.log(`Cache hit! Operation time: ${timeTook}ms`);
});

cache.on('miss', timeTook => {
  console.log(`Cache miss! Operation time: ${timeTook}ms`);
});

/** First call, a cold lookup.
 *
 *  response: `{ offset: 64005, value: <Buffer 33 56>, length: 2 }`
 **/
console.log(cache.find(Buffer.from([0x33, 0x56])));

/** Second call, a cache hit
 *
 *  response: `{ offset: 64005, value: <Buffer 33 56>, length: 2 }`
 **/
console.log(cache.find(Buffer.from([0x33, 0x56])));

/** Third call, a cache hit
 *
 *  response: `{ offset: 64005, value: <Buffer 33 56>, length: 2 }`
 **/
console.log(cache.find(Buffer.from([0x33, 0x56])));

for (let i = 0; i < 16; ++i) {
  cache.append(Buffer.from([0xff]));
}

/** Fourth call, after appending data, cache hit
 *
 *  response: `{ offset: 64021, value: <Buffer 33 56>, length: 2 }`
 **/
console.log(cache.find(Buffer.from([0x33, 0x56])));
```

And its output:

```bash
/your-rad-project ‹master*› % node sample.js
Cache miss! Operation time: 20ms
Cache hit! Operation time: 1ms
Cache hit! Operation time: 0ms
```

## Performance

`driving-range-test.js` test scenario by generating a set (the exact number is controlled by `input_key_count`) of random words, appends them to the cache and then, from the generated words, it repeatedly selects a random word and performs a search (The exact number is whatever `number_of_search_attempts` is set to).

It performs one test with the cache off as a control, then it performs another with the cache enabled. Both experiments are timed and the all of the setup displayed.

```bash
tiny-toatie-cache/performance ‹master*› % node driving-range-test.js

Test label: Control experiment (cache disabled)
Cache hits: 0, Cache misses: 1000000
Experiment configuration:
{ input_key_count: 2560,
  dictionary_size: 2560000,
  words_per_key: 3,
  number_of_search_attempts: 1000000,
  cache_bypass: true }
Experiment time taken: 10686.166241


Test label: Cache enabled experiment
Cache hits: 997440, Cache misses: 2560
Experiment configuration:
{ input_key_count: 2560,
  dictionary_size: 2560000,
  words_per_key: 3,
  number_of_search_attempts: 1000000,
  cache_bypass: false }
Experiment time taken: 1001.0715529999998

```
