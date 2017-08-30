const buildModel = require('./buildModel');
const tableFactory = require('./table/tableFactory');
const schemaValidator = require('./schemaValidator');

module.exports = function createRelationalJSONDB(schema) {
    let model;

    if (schemaValidator(schema)) {
        model = buildModel(schema);

        return Object.freeze(
            Object.keys(model).reduce((db, key) => {
                db[key] = tableFactory(model[key], db);

                return db;
            }, Object.create(null))
        );
    }
};
