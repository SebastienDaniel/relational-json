const determineFieldType = require("./determineFieldType");

function verifyExtends(schema, key) {
    const table = schema[key];

    if (table.extends) {
        const foreignTable = schema[table.extends.table];
        const localField = table.fields[table.extends.localField];
        const foreignField = foreignTable ? foreignTable.fields[table.extends.foreignField] : undefined;

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
