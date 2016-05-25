"use strict";

/**
 * @private
 * @summary compiles an array of all required field names to create a data object
 * for the provided table model
 * @param {object} model - table model to scan
 * @param {object} [type] - "own" or "all"
 * @returns {Array}
 */
function getRequiredFields(model, type) {
    // get models' own required fields
    var req = model.listFields().filter(function(field) {
        return field.isRequired();
    }).map(function(f) {
        return f.name;
    });

    // add ancestors' requirements
    if (type === "all" && model.extends) {
        req = req.concat(getRequiredFields(model.extends.model, "all"));

        // remove the parent<->child extension field,
        // it can be inferred at data creation time
        req.splice(req.indexOf(model.extends.foreignField), 1);
    }

    return req;
}

module.exports = getRequiredFields;
