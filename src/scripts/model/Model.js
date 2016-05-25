"use strict";

var Field = require("./Field"),
    getRequiredFields = require("./getRequiredFields");

/**
 * @typedef model
 * @param {string} primary - primary field name
 * @param {object} fields - field objects
 * @param {string} tableName
 */


function Model(tn, schema) {
    Object.defineProperty(this, "primary", {
        value: schema.primary,
        enumerable: true
    });

    Object.defineProperty(this, "fields", {
        value: Object.keys(schema.fields).reduce(function(obj, field) {
            obj[field] = new Field(field, schema.fields[field]);

            return obj;
        }, {}),
        enumerable: true
    });

    Object.defineProperty(this, "tableName", {
        value: tn,
        enumerable: true
    });
}

Model.prototype = Object.create(Object, {
    /**
     * @name model#getRequiredFields
     * @function
     * @params {[string=own]} type - all or own required fields
     * @returns {array}
     */
    getRequiredFields: {
        value: function(type) {
            type = type === "all" ? "all" : "own";

            return getRequiredFields(this, type);
        },
        enumerable: true
    },

    /**
     * @name model#listFields
     * @function
     * @summary returns an array of the models' fields
     * @return {field[]}
     */
    listFields: {
        value: function() {
            return Object.keys(this.fields).map(function(f) {
                return this.fields[f];
            }, this);
        },
        enumerable: true
    }
});

module.exports = Model;
