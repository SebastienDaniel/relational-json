var rowFactory = require("../row/rowFactory");

module.exports = function post(d, c) {
    "use strict";
    var missingFields = [];

    // make sure all fields are respected
    c.model.fields.forEach(function(field) {
        var key = field.name;

        // make sure all required fields are provided
        if (field.isRequired() && d[key] === undefined) {
            missingFields.push(key);
        }

        // make sure all fields respect their datatype
        if (d[key]) {
            // pipe through preprocessor, if available
            if (c.env.preprocessor) {
                d[key] = c.env.preprocessor(c.model.tableName, field, d[key]);
            }

            if (!field.validateData(d[key])) {
                throw Error("Provided data " + d[key] + "\nis not compatible with " + c.model.tableName + "." + key + "\nexpected datatype: " + field.dataType);
            }
        }
    });

    // throw if any fields are missing
    if (missingFields.length > 0) {
        throw Error("data creation rejected for table " + c.model.tableName + ", mandatory fields not provided:\n" + missingFields.map(function(f) {
                return f.name;
            }).join(", ") + "\nfrom data: " + JSON.stringify(d));
    }

    return rowFactory(c.model, d, c.env.db);
};
