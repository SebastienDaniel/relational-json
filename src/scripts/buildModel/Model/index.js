const Field = require("./Field");
const getRequiredFields = require("./getRequiredFields");

/**
 * @typedef model
 * @param {string} primary - primary field name
 * @param {object} fields - field objects
 * @param {string} tableName
 */

/**
 * @param {string} tableName
 * @param {object} tableSchema
 * @constructor
 */
class Model {
    constructor(tableName, tableSchema) {
        const fields = Object.keys(tableSchema.fields);

        this.tableName = tableName;
        this.primary = tableSchema.primary;
        this.fields = fields.reduce((obj, field) => {
            const fieldSchema = tableSchema.fields[field];

            obj[field] = new Field(field, fieldSchema);

            return obj;
        }, {});
    }

    /**
     * @name model#getRequiredFields
     * @function
     * @params {[string=own]} type - all or own required fields
     * @returns {Array}
     */
    getRequiredFields(type) {
        type = type === "all" ? "all" : "own";

        return getRequiredFields(this, type);
    }

    /**
     * @name model#listFields
     * @function
     * @summary returns an array of the models' fields
     * @return {field[]}
     */
    listFields() {
        return Object.keys(this.fields).map((f) => this.fields[f]);
    }
}

module.exports = Model;
