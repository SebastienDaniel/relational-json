"use strict";
var Dictionary = require("sebastiendaniel-adt/dictionary");

module.exports = function dictionaryFactory() {
    var d = new Dictionary(),
        dataContainer = [],
        hasChanged;

    // add immutable getter method
    d.getAllData = function getAllData() {
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

    d.set = function setExtension(key, value) {
        var res = Object.getPrototypeOf(d).set.call(d, key, value);

        // change dataContainer reference
        hasChanged = true;

        return res;
    };

    d.remove = function removeExtension(key) {
        var res = Object.getPrototypeOf(d).remove.call(d, key);

        // change dataContainer reference
        hasChanged = true;

        return res;
    };

    return d;
};
