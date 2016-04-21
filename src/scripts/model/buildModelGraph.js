var Model = require("./Model"),
    addRelations = require("./addRelations");

module.exports = function buildModelGraph(schema) {
    // first pass, create model instances
    var dynamicModel = Object.create(null, {});

    Object.keys(schema).forEach(function(key) {
        dynamicModel[key] = new Model(key, schema[key]);
    });

    // second pass, enhance models with relations
    Object.keys(dynamicModel).forEach(function(key) {
        addRelations(schema, dynamicModel, dynamicModel[key]);
    });

    return Object.freeze(dynamicModel);
};
