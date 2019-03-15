export default (dictionary, searchItem) => {
    if (!dictionary) {
        throw new Error('incorrect dictionary type: expected a Buffer instance instead of `null`')
    }
    if (dictionary.length === 0 || searchItem.length === 0) {
        return null;
    }

    if (dictionary[0] === searchItem[0]) {
        return { offset: 0, length: 1 }
    }

    return null;
};
