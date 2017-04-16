function verifyTablePrimaryField(schema, key) {
    const table = schema[key];

    if (typeof table.primary === "string") {
        const hasPrimaryFieldDefined = table.fields[table.primary];
        
        if (hasPrimaryFieldDefined) {
            return true;
        } else {
            throw new ReferenceError("Primary key '" + table.primary + "' of table '" + key + "' is not present in the table's fields");
        }
    } else {
        throw new SyntaxError("Missing primary key for table " + key + "\nexample:\n{\n  tableName: {\n\tprimary:'id',\n\tfields:{}\n  }\n}" );
    }
}

module.exports = verifyTablePrimaryField;
