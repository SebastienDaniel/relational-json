var dataFactory = require("./dataFactory"),
    validateDataType = require("./validateDataType");

module.exports = function makeData(model, d, ancestorField, db) {
    // aggregates should be non-enumerable (simplifies updating own data)
    var missingFields = [];

    Object.keys(model.fields).forEach(function(key) {
        if (!model.fields[key].allowNull && !model.fields[key].hasOwnProperty("defaultValue")) {
            if (d[key] === undefined) {
                if (model.extends && model.extends.local === key && d[ancestorField]) {
                    return;
                } else {
                    missingFields.push(key);
                }
            }
        }

        if (d[key]) {
            if (!validateDataType(model.fields[key], d[key])) {
                throw Error("Provided data " + d[key] + "\nis not compatible with field " + key + "\nexpected datatype: " + model.fields[key].dataType);
            }
        }
    });

    // validate that all necessary fields are provided
    if (missingFields.length > 0) {
        throw Error("data creation rejected, mandatory fields not provided:\n" + missingFields);
    }

    //data.push(o);
    return dataFactory(model, d, db);
};
