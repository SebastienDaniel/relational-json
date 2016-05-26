var addRelationsToModel = require("./addRelationsToModel"),
    Model = require("./Model");

function createDynamicModel(schema) {
    "use strict";

    var dynamicModel = Object.keys(schema).reduce(function(dm, key) {
        dm[key] = new Model(key, schema[key]);

        return dm;
    }, Object.create(null, {}));

    // second pass, enhance dynamicModel with relations
    return addRelationsToModel(schema, dynamicModel);
}

module.exports = createDynamicModel;
