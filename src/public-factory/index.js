import CacheStore from '../cache-store';
import Cache from '../cache';

export default maximumSize => new Cache(new CacheStore(maximumSize));
