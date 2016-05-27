var determineFieldType = require("./determineFieldType");

function verifyExtends(schema, key) {
    "use strict";
    var table = schema[key],
        foreignTable,
        localField,
        foreignField;

    if (table.extends) {
        foreignTable = schema[table.extends.table];
        localField = table.fields[table.extends.localField];
        foreignField = foreignTable ? foreignTable.fields[table.extends.foreignField] : undefined;

        if (!localField) {
            throw new ReferenceError("Table " + key + " extends " + table.extends.table + " with non-existent localField: " + table.extends.localField);
        }

        if (!foreignTable) {
            throw new ReferenceError("Table " + key + " extends non-existent table: " + table.extends.table);
        }

        if (!foreignField) {
            throw new ReferenceError("Table " + key + " extends " + table.extends.table + " with non-existent foreignField: " + table.extends.foreignField);
        }

        if (determineFieldType(localField) !== determineFieldType(foreignField)) {
            throw new TypeError("Table " + key + " extends " + table.extends.table + " with incompatible field types:\nlocalField: " + determineFieldType(localField) + "\nforeignField: " + determineFieldType(foreignField));
        }
    }

    return true;
}

module.exports = verifyExtends;
