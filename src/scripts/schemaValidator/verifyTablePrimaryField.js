function verifyTablePrimaryField(schema, key) {
    "use strict";
    var table = schema[key];

    if (table.primary && typeof table.primary === "string") {
        if (table.fields[table.primary]) {
            return true;
        } else {
            throw new ReferenceError("Primary key '" + table.primary + "' of table '" + key + "' is not present in the table's fields");
        }
    } else {
        throw new SyntaxError("Missing primary key for table " + key + "\nexample:\n{\n  tableName: {\n\tprimary:'id',\n\tfields:{}\n  }\n}" );
    }
}

module.exports = verifyTablePrimaryField;
