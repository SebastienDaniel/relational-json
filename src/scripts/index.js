"use strict";

var buildModel = require("./buildModel"),
    tableFactory = require("./table/tableFactory"),
    schemaValidator = require("./schemaValidator");

module.exports = function(schema) {
    var model;

    if (schemaValidator(schema)) {
        model = buildModel(schema);
        return Object.freeze(
            Object.keys(model).reduce(function(tables, key) {
                tables[key] = tableFactory(model[key], tables);

                return tables;
            }, Object.create(null))
        );
    }
};

