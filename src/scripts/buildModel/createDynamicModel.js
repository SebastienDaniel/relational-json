const addRelationsToModel = require("./addRelationsToModel");
const Model = require("./Model");

function createDynamicModel(schema) {
	// first pass, create dynamic model data for each table
    let dynamicModel = Object.keys(schema).reduce((dm, key) => {
        dm[key] = new Model(key, schema[key]);

        return dm;
    }, {});

    // second pass, enhance tables with relations
    return addRelationsToModel(schema, dynamicModel);
}

module.exports = createDynamicModel;
