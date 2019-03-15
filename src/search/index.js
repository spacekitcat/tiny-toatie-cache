export default (dictionary, searchItem) => {
    if (!dictionary) {
        throw new Error('incorrect dictionary type: expected a Buffer instance instead of `null`')
    }
    if (dictionary.length === 0 || searchItem.length === 0) {
        return null;
    }

    const indexOf = dictionary.indexOf(searchItem)
    if (indexOf >= 0) {
        const invertedIndex = (dictionary.length - 1) - indexOf;
        return { offset: invertedIndex, length: searchItem.length }
    }

    return null;
};
