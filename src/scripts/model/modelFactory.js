"use strict";

var getAliasMap = require("./getAliasMap"),
    Field = require("./Field"),
    getRequiredFields = require("./getRequiredFields");

module.exports = function modelFactory(tn, fullModel) {
    var model = fullModel[tn],
        requiredFields = getRequiredFields(model, fullModel),
        aliasMap = Object.freeze(getAliasMap(tn, fullModel)),
        fields = Object.keys(fullModel[tn].fields).reduce(function(obj, field) {
            obj[field] = new Field(fullModel[tn].fields[field]);

            return obj;
        }, {});

    /**
     * The model is publicly exposed
     * hence, we need a tamper-free interface
     */
    // TODO: simplify interface, it contains much unused crud
    return Object.create(null, {
        primary: {
            get: function() {
                return model.primary;
            },
            enumerable: true
        },
        getField: {
            value: function(f) {
                if (fields[f]) {
                    return Object.freeze(fields[f]);
                }
            },
            enumerable: true
        },
        requiredFields: {
            get: function() {
                // return a copy to avoid tampering
                return requiredFields.slice();
            },
            enumerable: true
        },
        aliasMap: {
            get: function() {
                return aliasMap;
            },
            enumerable: true
        },
        extendedBy: {
            get: function() {
                return model.extendedBy || [];
            },
            enumerable: true
        },
        aggregates: {
            get: function() {
                return model.aggregates || [];
            },
            enumerable: true
        },
        extends: {
            get: function() {
                return model.extends;
            },
            enumerable: true
        },
        fields: {
            get: function() {
                return fields;
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
