var determineFieldType = require("./determineFieldType");

function verifyTableFields(schema, key) {
    "use strict";
    var table = schema[key];

    if (!table.hasOwnProperty("fields")) {
        throw new SyntaxError("Table " + key + " does not have fields");
    }

    return Object.keys(table.fields).every(function(k) {
        var field = table.fields[k],
            // fields can be declared in shorthand (field:'dataType')
            // or regular form (field: {dataType: ''})
            type = determineFieldType(field);

        if (typeof type === "string") {
            if (["string", "integer", "float", "date", "datetime", "time", "boolean"].indexOf(type) !== -1) {
                return true;
            } else {
                throw new TypeError(key + "." + k + " is of unsupported type: " + type + "\nmust be one of: ['string', 'integer', 'float', 'date', 'datetime', 'time', 'boolean']");
            }
        }
    });
}

module.exports = verifyTableFields;
