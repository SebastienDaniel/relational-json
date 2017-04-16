"use strict";

var rowFactory = require("./rowFactory");

function throwFieldError(tableName, missing, invalid) {
    throw new Error("Unable to create row in " + tableName + ", the following errors were found:\n" + missing.reduce(function(str, field) {
            str += "\nmissing field: " + field.name;

            return str;
        }, "") + invalid.reduce(function(str, field) {
            str += "\ninvalid data: " + field.name + " expected: " + field.dataType;

            return str;
        }, "")
    );
}

function reportMissingMandatoryFields(model, d) {
    var missingFields = [],
        invalidFields = [];

    model.listFields().forEach(function(field) {
        if (field.isRequired && d[field.name] === undefined) {
            missingFields.push(field);
        }

        if (d[field.name] !== undefined) {
            if (!field.validateData(d[field.name])) {
                invalidFields.push(field);
            }
        }
    });

    if (missingFields.length > 0 || invalidFields.length > 0) {
        throwFieldError(model.tableName, missingFields, invalidFields);
    }
}

/**
 * POST only validates that everything is in order.
 * The row creation is actually done by the rowFactory
 * @param model
 * @param db
 * @param d
 * @returns {Row|*}
 */
module.exports = function post(model, db, d) {
    reportMissingMandatoryFields(model, d);

    //db[model.tableName].set(d[model.primary], row);

    return rowFactory(model, db, d);
};
