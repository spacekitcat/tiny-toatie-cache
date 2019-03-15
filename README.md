**This project is a work in progress. It might not be very useful to anyone in this state.**

# tiny-toatie-cache

This library is designed to cache search operations against a [Node.js Buffer](https://nodejs.org/api/buffer.html#buffer_buffer). Data can be appended to the underlying Buffer and the cache will keep the size bounded to the limit specified. New data is *appended to the front* and if the upper size limit is hit, the *oldest items will be deleted from the back*.

## Use case
LZ77 is streaming compression algorithm. This means each compression packet can be decompressed in sequential order and the next chunk of cleartext data will be produced. Some compression algorothms have to decompress the entire stream of compression packets before you can get at any of the cleartext data. The LZ77 compression algorithm also doesn't need to be distributed with a static dictionary, it performs search operations against a *sliding window*.

I wrote a [prototype of LZ77](https://github.com/spacekitcat/prototype-libz77) and after finally creating something reliable, I found the performance, both in terms of speed and compression, to be quite horrific. The main problem is that the dictionary buffer needs to be in the region of 2 Megabytes (2048000 Bytes) for good space savings, but that means almost 2048000 comparisons every time it has to find the next RLE. In the worst case scenario, LZ77 could have to perform a full search operation across the entire history buffer for every single byte in its input stream. Without any sort of optimization, my prototype is `O(n^2)`. The dictionary size it uses is much more modest than dictionary size I specified above and it performs frustratingly bad.

I originally spent time looking for a data structure to represent the history buffer. My naive stab at solution would be some sort of tree with an insertion performance of `O(1)` and a lookup performance of `O(log(N))` (`O(N log(N))` in context). The big problem with a tree is the sheer size of the input streams it needs to handle (have a think about how big a file of 2048000 Byte, or 2MB, actually is if you're processing it a byte at a time) which will almost always lead you to hitting the dictionary size. You cannot exceed the dictionary size without both data integrity (the decompressor needs to use the same value as the compressor) and memory issues. With a tree like structure, you'd either need something with a very complex purging mechanism or you have to rebuild the tree constantly.

Caching will hopefully prove simple and fast with low housekeeping overhead, but it's ultimately a research project.

## Technical design
The library uses [cloakroom-smart-buffer-proxy](https://www.npmjs.com/package/cloakroom-smart-buffer-proxy) (create specifically for this library) behind the scenes as a sort of bookeeper.

## Building

```javascript
/iberian-magpie-slide-cache-prototype <master> % yarn install
/iberian-magpie-slide-cache-prototype <master> % yarn build
```

## Unit tests

The unit tests use Jest and the Yarn command below runs them.

```bash
/lz77-nodejs-streams ‹master*› % yarn test
```
