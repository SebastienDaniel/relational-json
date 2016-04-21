"use strict";

var Field = require("./Field"),
    getRequiredFields = require("./getRequiredFields");

module.exports = function modelFactory(tn, schema) {
        var fields = Object.keys(schema.fields).reduce(function(obj, field) {
            obj[field] = new Field(field, schema.fields[field]);

            return obj;
        }, {});

    /**
     * The model is publicly exposed
     * hence, we need a tamper-free interface
     */
    return Object.create(null, {
        primary: {
            value: schema.primary,
            enumerable: true
        },
        getField: {
            value: function(f) {
                if (fields[f]) {
                    return fields[f];
                }
            },
            enumerable: true
        },
        getRequiredFields: {
            value: function(type) {
                type = type === "all" ? "all" : "own";

                return getRequiredFields(this, type);
            },
            enumerable: true
        },
        fields: {
            get: function() {
                return Object.keys(fields).map(function(f) {
                    return fields[f];
                });
            },
            enumerable: true
        },
        tableName: {
            get: function() {
                return tn;
            },
            enumerable: true
        }
    });
};
