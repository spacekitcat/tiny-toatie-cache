export default (dictionary, searchItem) => {
    if (dictionary.length === 0 || searchItem.length === 0) {
        return null;
    }

    if (dictionary[0] === searchItem[0]) {
        return { offset: 0, length: 1 }
    }

    return null;
};
