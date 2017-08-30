const determineFieldType = require('./determineFieldType');

function verifyTableFields(schema, key) {
    const table = schema[key];

    if (!table.hasOwnProperty('fields')) {
        throw new SyntaxError('Table ' + key + ' does not have fields');
    }

    const fields = Object.keys(table.fields);
    return fields.every(function(k) {
        const field = table.fields[k];
        const type = determineFieldType(field);

        if (typeof type === 'string') {
            if (['string', 'integer', 'float', 'date', 'datetime', 'time', 'boolean'].indexOf(type) !== -1) {
                return true;
            } else {
                throw new TypeError(key + '.' + k + ' is of unsupported type: ' + type + "\nmust be one of: ['string', 'integer', 'float', 'date', 'datetime', 'time', 'boolean']");
            }
        }
    });
}

module.exports = verifyTableFields;
