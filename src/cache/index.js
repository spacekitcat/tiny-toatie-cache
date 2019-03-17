import search from '../../src/search';

class Cache {
    constructor(store) {
        if (!store) {
            throw new Error('no store object was provided');
        }

        this.store = store;
    }

    append(list) {
        this.store.append(list);
    }

    find(target) {
        return search(Buffer.from(this.store.getReadOnlyBuffer()), target);
    }

    getInternalStore() {
        return this.store;
    }
}

export default Cache;
