import CacheStore from '../../src/cache-store';
import Cache from '../../src/cache';

export default maximumSize => new Cache(new CacheStore(maximumSize));
