var determineFieldType = require("./determineFieldType");

function verifyAggregates(schema, key) {
    "use strict";
    var table = schema[key];

    if (table.aggregates) {
        return table.aggregates.every(function(agg) {
            var foreignTable = schema[agg.table],
                localField = table.fields[agg.localField],
                foreignField = foreignTable ? foreignTable.fields[agg.foreignField] : undefined;

            if (!localField) {
                throw new ReferenceError("Table " + key + " aggregates with " + agg.table + " on non-existent localField: " + agg.localField);
            }

            if (!foreignTable) {
                throw new ReferenceError("Table " + key + " aggregates " + agg.table + " on non-existent table: " + agg.table);
            }

            if (!foreignField) {
                throw new ReferenceError("Table " + key + " aggregates with " + agg.table + " on non-existent foreignField: " + agg.foreignField);
            }

            if (determineFieldType(localField) !== determineFieldType(foreignField)) {
                throw new TypeError("Table " + key + " aggregates with " + agg.table + " on incompatible field types:\nlocalField: " + determineFieldType(localField) + "\nforeignField: " + determineFieldType(foreignField));
            }

            if (["single", "many"].indexOf(agg.cardinality) === -1) {
                throw new TypeError("Table " + key + " has an invalid aggregation cardinality with " + agg.table + "\nexpected: 'single' or 'many'\nprovided: " + agg.cardinality);
            }

            if (Object.keys(table.fields).some(function(fieldName) {
                    return fieldName === agg.alias;
                })) {
                throw Error("Table " + key + " has a conflicting aggregation alias with " + agg.table + "\nalias: " + agg.alias + " exists as " + key + " field");
            }

            return true;
        });
    }

    return true;
}

module.exports = verifyAggregates;
