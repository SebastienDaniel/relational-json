"use strict";

var addExtendedByToSchema = require("./addExtendedByToSchema"),
    createDynamicModel = require("./createDynamicModel");

/**
 * @private
 * @summary compiles the Model graph based on provided schema
 * @param {JSON} schema - JSON-like notation for the schema
 * @returns {Object} - Model graph
 */
function buildModelGraph(schema) {
    // first pass, extend schema
    addExtendedByToSchema(schema);

    // second pass, create model instances
    return createDynamicModel(schema);
}

module.exports = buildModelGraph;
