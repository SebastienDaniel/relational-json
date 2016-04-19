var rowFactory = require("../row/rowFactory");

// TODO: POST is your pre-processor before rowFactory
module.exports = function post(model, d, tn, env) {
    "use strict";
    var missingFields = [];

    // make sure all fields are respected
    Object.keys(model.fields).forEach(function(key) {
        var field = model.fields[key];

        // make sure all required fields are provided
        if (field.isRequired() && d[key] === undefined) {
            missingFields.push(key);
        }

        // make sure all fields respect their datatype
        if (d[key]) {
            // pipe through preprocessor, if available
            if (env.preprocessor) {
                d[key] = env.preprocessor(tn, field, d[key]);
            }

            if (!field.validateData(d[key])) {
                throw Error("Provided data " + d[key] + "\nis not compatible with " + tn + "." + key + "\nexpected datatype: " + field.dataType);
            }
        }
    });

    // throw if any fields are missing
    if (missingFields.length > 0) {
        throw Error("data creation rejected for table " + tn + ", mandatory fields not provided:\n" + missingFields.join(", ") + "\nfrom data: " + JSON.stringify(d));
    }

    return rowFactory(model, d, env.db);
};
