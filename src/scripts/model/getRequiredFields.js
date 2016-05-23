"use strict";

/**
 * @alias getRequiredFields
 * @private
 * @summary compiles an array of all required field names to create a data object
 * for the provided table model
 * @param {object} model - table model to scan
 * @param {object} [type] - "own" or "all"
 * @returns {Array}
 */
module.exports = function getRequiredFields(model, type) {
    // get models' own required fields
    var req = model.listFields().filter(function(field) {
        return field.isRequired();
    }).map(function(f) {
        return f.name;
    });

    // check for ancestor requirements
    if (type === "all" && model.extends) {
        // recursively get required fields of ancestor(s)
        req = req.concat(getRequiredFields(model.extends.table, type));

        // remove the ancestor extension field requirement,
        // it can be inferred at data creation time
        req.splice(req.indexOf(model.extends.foreignField), 1);
    }

    return req;
};
