# iberian-magpie-slice-cache-prototype

A protype cache system for fast text lookups against a dynamic, scoped view of a larger dataset. 
I want to experiment to see if a cache could be smart enough to have in impact on the prefix lookup
times against the sliding window used in LZ77.

## Unit tests

The unit tests use Jest and the Yarn command below runs them.

```bash
/lz77-nodejs-streams ‹master*› % yarn test
```
