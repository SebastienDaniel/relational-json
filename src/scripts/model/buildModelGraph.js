"use strict";

var Model = require("./Model"),
    addRelations = require("./addRelations");

/**
 * @private
 * @summary compiles the Model graph based on provided schema
 * @param {JSON} schema - JSON-like notation for the schema
 * @returns {Object} - Model graph
 */
function buildModelGraph(schema) {
    // first pass, create model instances
    var dynamicModel = Object.keys(schema).reduce(function(obj, key) {
        obj[key] = new Model(key, schema[key]);

        return obj;
    }, Object.create(null, {}));

    // second pass, enhance models with relations
    Object.keys(dynamicModel).forEach(function(key) {
        addRelations(schema, dynamicModel, dynamicModel[key]);
    });

    return Object.freeze(dynamicModel);
}

module.exports = buildModelGraph;
