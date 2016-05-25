"use strict";

var validateDataType = require("../row/validateDataType");

/**
 * @typedef {object} field
 * @param {string} name
 * @param {string} dataType
 * @param {boolean} allowNull
 * @param {boolean|string|number|null} [defaultValue]
 */


function Field(n, f) {
    // basics
    this.name = n;
    this.dataType = f.dataType;
    this.allowNull = f.allowNull || false;
    if (f.defaultValue !== undefined) {
        this.defaultValue = f.defaultValue;
    } else if (f.allowNull) {
        // TODO: should warn user about this case during schema validation
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
     * @summary validates the provided value against the fields dataType
     * @param {*} value
     * @returns {boolean}
     */
    validateData: function(value) {
        return validateDataType(this, value);
    }
};

module.exports = Field;
