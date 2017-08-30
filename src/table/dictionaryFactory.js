const Dictionary = require('../data-structures/dictionary');

module.exports = function dictionaryFactory() {
    const dictionary = new Dictionary();
    let dataContainer = [];
    let hasChanged;

    // add immutable getter method
    dictionary.getAllData = function getAllData() {
        const data = this.getValues();

        // if dataContainer.length !== dictionary data length, re-populate the dataContainer
        if (hasChanged) {
            hasChanged = false;
            // reset contents in-place
            dataContainer = [];

            // add current data
            data.forEach(function(value) {
                dataContainer.push(value);
            });
        }

        return dataContainer;
    };

    dictionary.set = function setExtension(key, value) {
        const result = Object.getPrototypeOf(dictionary).set.call(dictionary, key, value);

        // change dataContainer reference
        hasChanged = true;

        return result;
    };

    dictionary.remove = function removeExtension(key) {
        const result = Object.getPrototypeOf(dictionary).remove.call(dictionary, key);

        // change dataContainer reference
        hasChanged = true;

        return result;
    };

    return dictionary;
};
