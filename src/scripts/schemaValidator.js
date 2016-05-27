/**
 * verifies that each table has a primary field
 * and that the primary field exists in fields
 * @param {JSON} schema - json schema
 */
function verifyPrimaryField(schema) {
    return Object.keys(schema).every(function(tableName) {
        return schema[tableName].primary && schema[tableName].fields[schema[tableName].primary];
    });
}

function verifyFields(schema) {
    return Object.keys(schema).every(function(tableName) {
        return schema[tableName].fields.every(function (field) {
            // has dataType
            return typeof field.dataType === "string";
        });
    });
}

function verifyExtends(schema) {
    return Object.keys(schema).every(function(tableName) {
        var relation = schema[tableName].extends;

        if (relation) {
            return schema[relation.table] && // table exists in schema
                schema[relation.table].fields[relation.foreignField] && // foreign table has field
                schema[tableName].fields[relation.localField] && // localField exists in own table
                schema[tableName].fields[relation.table] === undefined; // localFields don't have same name as table
        } else {
            return true;
        }
    });
}

function verifyAggregates(schema) {
    return Object.keys(schema).every(function(tableName) {
        var aggregates = schema[tableName].aggregates || [];

        return aggregates.every(function(agg) {
            return schema[agg.table] && // table exists in schema
                schema[agg.table].fields[agg.foreignField] && // foreign table has field
                schema[tableName].fields[agg.localField] && // localField exists in own table
                schema[tableName].fields[agg.table] === undefined && // localFields don't have same name as table
                schema[tableName].fields[agg.alias] === undefined; // localFields don't have same name as table
        });
    });
}

function verifyExtendedBy(schema) {

}
// scan each TABLE
// primary //
// fields //
// scan each field //
// extends tables //
// aggregates tables //
// extendedBy tables