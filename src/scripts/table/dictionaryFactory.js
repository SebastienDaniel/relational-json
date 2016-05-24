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
            // reset contents in-place
            dataContainer.splice(0);

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
        dataContainer = dataContainer.concat();

        return res;
    };

    d.remove = function removeExtension(key) {
        var res = Object.getPrototypeOf(d).remove.call(d, key);

        // change dataContainer reference
        dataContainer = dataContainer.concat();

        return res;
    };

    return d;
};
