const r = require('ramda');
const validateDataType = require('./validateDataType');

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
class Field {
    constructor(fieldName, fieldSchema) {
        this.name = fieldName;
        this.allowNull = !!fieldSchema.allowNull;

        // allow shorthand field types (i.e. field:type )
        this.dataType = r.type(fieldSchema) === 'String'
            ? fieldSchema
            : fieldSchema.dataType;

        if (fieldSchema.hasOwnProperty('defaultValue')) {
            this.defaultValue = fieldSchema.defaultValue;
        } else if (this.allowNull) {
            this.defaultValue = null;
        }

        this.isRequired = !this.allowNull && !this.hasOwnProperty('defaultValue');
    }

    /**
     * @name field#validateData
     * @function
     * @summary validates the provided value against the field's dataType
     * @param {*} value
     * @returns {boolean}
     */
    validateData(value) {
        return validateDataType(this, value);
    }
}

module.exports = Field;
