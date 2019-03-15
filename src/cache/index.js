class Cache {
    constructor(store) {
        if (!store) {
            throw new Error('no store object was provided');
        }

        this.store = store;
    }

    getInternalStore() {
        return this.store;
    }
}

export default Cache;
