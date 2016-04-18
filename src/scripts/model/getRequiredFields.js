/**
 * tests if a field's metadata makes it a mandatory field
 * @param {object} f - field metadata
 * @returns {boolean}
 */
function fieldIsRequired(f) {
    return !f.allowNull && !f.hasOwnProperty("defaultValue");
}

/**
 * compiles an array of all required field names to create a data object
 * for the provided table model
 * @param {object} model - table model to scan
 * @param {object} fullModel - full graph, necessary to scan extensions
 * @returns {Array}
 */
module.exports = function getRequiredFields(model, fullModel) {
    "use strict";

    // get models' own required fields
    var req = Object.keys(model.fields).filter(function(key) {
        return fieldIsRequired(model.fields[key]);
    });

    // check for ancestor requirements
    if (model.extends) {
        // recursively get required fields of ancestor(s)
        req = req.concat(getRequiredFields(fullModel[model.extends.table], fullModel));

        // remove the ancestor extension field requirement,
        // it can be inferred at data creation time
        req.splice(req.indexOf(model.extends.foreign), 1);
    }

    return req;
};
