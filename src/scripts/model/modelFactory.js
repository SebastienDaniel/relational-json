"use strict";

var Field = require("./Field"),
    getRequiredFields = require("./getRequiredFields");

module.exports = function modelFactory(tn, model) {
        var fields = Object.keys(model.fields).reduce(function(obj, field) {
            obj[field] = new Field(field, model.fields[field]);

            return obj;
        }, {});

    /**
     * The model is publicly exposed
     * hence, we need a tamper-free interface
     */
    return Object.create(null, {
        primary: {
            value: model.primary,
            enumerable: true
        },
        // TODO: might need fix, not sure freeze is doing what we want it to do
        getField: {
            value: function(f) {
                if (fields[f]) {
                    return Object.freeze(fields[f]);
                }
            },
            enumerable: true
        },
        getRequiredFields: {
            value: function(type) {
                type = type === "all" ? "all" : "own";

                return getRequiredFields(type, this);
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
