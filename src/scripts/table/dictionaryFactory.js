const Dictionary = require("sebastiendaniel-adt/dictionary");

module.exports = function dictionaryFactory() {
    const dictionary = new Dictionary();
    let dataContainer = [];
    let hasChanged;

    // add immutable getter method
    dictionary.getAllData = function getAllData() {
        var data = this.getValues();

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
        var result = Object.getPrototypeOf(dictionary).set.call(dictionary, key, value);

        // change dataContainer reference
        hasChanged = true;

        return result;
    };

    dictionary.remove = function removeExtension(key) {
        var result = Object.getPrototypeOf(dictionary).remove.call(dictionary, key);

        // change dataContainer reference
        hasChanged = true;

        return result;
    };

    return dictionary;
};
