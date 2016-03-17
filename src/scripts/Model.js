"use strict";

var getAliasMap = require("./getAliasMap"),
    Field = require("./Field"),
    getRequiredFields = require("./getRequiredFields");

function Model(tn, fullModel) {
    var model = fullModel[tn],
        requiredFields = getRequiredFields(model, fullModel),
        aliasMap = Object.freeze(getAliasMap(tn, fullModel)),
        fields = Object.keys(fullModel[tn].fields).reduce(function(obj, field) {
            obj[field] = new Field(fullModel[tn].fields[field]);

            return obj;
        }, {});

    return Object.create(Model, {
        primary: {
            get: function() {
                return model.primary;
            }
        },
        pk: this.primary, // alias
        requiredFields: {
            get: function() {
                return requiredFields;
            }
        },
        aliasMap: {
            get: function() {
                return aliasMap;
            }
        },
        extendedBy: {
            get: function() {
                return model.extendedBy || [];
            }
        },
        aggregates: {
            get: function() {
                return model.aggregates || [];
            }
        },
        extends: {
            get: function() {
                return model.extends;
            }
        },
        fields: {
            get: function() {
                return fields;
            }
        }
    });
}

module.exports = Model;