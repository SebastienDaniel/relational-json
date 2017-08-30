const determineFieldType = require('./determineFieldType');

function verifyAggregates(schema, key) {
    const table = schema[key];

    if (table.aggregates) {
        return table.aggregates.every((aggregate) => {
            const foreignTable = schema[aggregate.table];
            const localField = table.fields[aggregate.localField];
            const foreignField = foreignTable ? foreignTable.fields[aggregate.foreignField] : null;

            if (!localField) {
                throw new ReferenceError('Table ' + key + ' aggregates with ' + aggregate.table + ' on non-existent localField: ' + aggregate.localField);
            }

            if (!foreignTable) {
                throw new ReferenceError('Table ' + key + ' aggregates ' + aggregate.table + ' on non-existent table: ' + aggregate.table);
            }

            if (!foreignField) {
                throw new ReferenceError('Table ' + key + ' aggregates with ' + aggregate.table + ' on non-existent foreignField: ' + aggregate.foreignField);
            }

            if (determineFieldType(localField) !== determineFieldType(foreignField)) {
                throw new TypeError('Table ' + key + ' aggregates with ' + aggregate.table + ' on incompatible field types:\nlocalField: ' + determineFieldType(localField) + '\nforeignField: ' + determineFieldType(foreignField));
            }

            if (['single', 'many'].indexOf(aggregate.cardinality) === -1) {
                throw new TypeError('Table ' + key + ' has an invalid aggregation cardinality with ' + aggregate.table + "\nexpected: 'single' or 'many'\nprovided: " + aggregate.cardinality);
            }

            if (Object.keys(table.fields).some(function(fieldName) {
                return fieldName === aggregate.alias;
            })) {
                throw Error('Table ' + key + ' has a conflicting aggregation alias with ' + aggregate.table + '\nalias: ' + aggregate.alias + ' exists as ' + key + ' field');
            }

            return true;
        });
    }

    return true;
}

module.exports = verifyAggregates;
