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

    getInternalStore() {
        return this.store;
    }
}

export default Cache;
