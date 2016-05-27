"use strict";

var validateDataType = require("./validateDataType");

/**
 * @typedef {object} field
 * @param {string} name
 * @param {string} dataType
 * @param {boolean} allowNull
 * @param {boolean|string|number|null} [defaultValue]
 */

/**
 * @param {string} fieldName
 * @param {object} fieldSchema
 * @returns {field}
 * @constructor
 */
function Field(fieldName, fieldSchema) {
    this.name = fieldName;

    if (typeof fieldSchema === "string") {
        this.dataType = fieldSchema;
    } else {
        this.dataType = fieldSchema.dataType;
    }

    this.allowNull = fieldSchema.allowNull || false;

    if (fieldSchema.defaultValue !== undefined) {
        this.defaultValue = fieldSchema.defaultValue;
    } else if (fieldSchema.allowNull === true) {
        this.defaultValue = null;
    }

    return Object.freeze(this);
}

Field.prototype = {
    /**
     * @name field#isRequired
     * @function
     * @summary tests if the field is required when creating a row
     * @returns {boolean}
     */
    isRequired: function() {
        return !this.allowNull && !this.hasOwnProperty("defaultValue");
    },

    /**
     * @name field#validateData
     * @function
     * @summary validates the provided value against the field's dataType
     * @param {*} value
     * @returns {boolean}
     */
    validateData: function(value) {
        return validateDataType(this, value);
    }
};

module.exports = Field;
