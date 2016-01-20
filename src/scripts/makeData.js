var dataFactory = require("./dataFactory"),
    validateDataType = require("./validateDataType");

module.exports = function makeData(model, d, tn, db) {
    "use strict";
    var missingFields = [];

    // make sure all fields are respected
    Object.keys(model.fields).forEach(function(key) {
        // make sure all required fields are provided
        if (!model.fields[key].allowNull && !model.fields[key].hasOwnProperty("defaultValue")) {
            if (d[key] === undefined) {
                missingFields.push(key);
            }
        }

        // make sure all fields respect their datatype
        if (d[key]) {
            // tolerance for datetime formats
            if (model.fields[key].dataType === "datetime") {
                // add the time "T"
                if (/\d {1}/.test(d[key])) {
                    d[key] = d[key].replace(" ", "T");
                }

                // assume UTC if not timezone
                if (/T/.test(d[key]) && !/(Z|\-\d\d:|\+){1}/.test(d[key])) {
                    d[key] += "Z";
                }
            }
            if (!validateDataType(model.fields[key], d[key])) {
                throw Error("Provided data " + d[key] + "\nis not compatible with " + tn + "." + key + "\nexpected datatype: " + model.fields[key].dataType);
            }
        }
    });

    // throw if any fields are missing
    if (missingFields.length > 0) {
        throw Error("data creation rejected, mandatory fields not provided:\n" + missingFields);
    }

    //data.push(o);
    return dataFactory(model, d, db);
};
