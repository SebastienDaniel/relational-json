/**
 * compiles an array of all required field names to create a data object
 * for the provided table model
 * @param {object} model - table model to scan
 * @param {object} fullModel - full graph, necessary to scan extensions
 * @returns {Array}
 */
module.exports = function getRequiredFields(model, fullModel) {
    "use strict";
    var req = [];

    // get models' own required fields
    Object.keys(model.fields).forEach(function(key) {
        if (!model.fields[key].allowNull && model.fields[key].defaultValue === undefined) {
            req.push(key);
        }
    });

    // what about "extends" relations
    if (model.extends) {
        // remove the local field that is the extension point
        // req.splice(req.indexOf(model.extends.local), 1);

        // recursively get required fields
        req = req.concat(getRequiredFields(fullModel[model.extends.table], fullModel));
    }

    return req;
};
