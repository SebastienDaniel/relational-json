"use strict";
var Dictionary = require("sebastiendaniel-adt/dictionary");

module.exports = function dictionaryFactory() {
    var d = new Dictionary(),
        dataContainer = [];

    // add immutable getter method
    d.getAllData = function getAllData() {
        var data = this.getValues();

        // if dataContainer.length !== dictionary data length, re-populate the dataContainer
        if (dataContainer.length !== data.length) {
            // reset container length
            dataContainer.splice(0);

            // add current data
            data.forEach(function(value) {
                dataContainer.push(value);
            });
        }

        return dataContainer;
    };

    d.set = function setExtension(key, value) {
        // change dataContainer reference
        dataContainer = [];

        return Object.getPrototypeOf(d).set.call(d, key, value);
    };

    d.remove = function removeExtension(key) {
        // change dataContainer reference
        dataContainer = [];

        return Object.getPrototypeOf(d).remove.call(d, key);
    };

    return d;
};
