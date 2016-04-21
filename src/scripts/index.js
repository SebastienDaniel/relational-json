var tableFactory = require("./table/tableFactory"),
    buildModelGraph = require("./model/buildModelGraph"),
    compileEnvironment = require("./compileEnvironment");

/**
 * Makes a copy of the model to avoid future tampering
 * Creates each table in the Graph
 *
 * @param {JSON} schema - JSON-like schema of the database to build
 * @param {object} [options] - additional options & utilities for the schema
 * @returns {Object} - relational-json instance (Tables)
 */
function buildDatabase(schema, options) {
    "use strict";
    // create graph from schema
     var fullModel = buildModelGraph(schema),
        env = compileEnvironment(options);

    // create db tables
    Object.keys(schema).forEach(function(key) {
        if (!schema[key].primary || !schema[key].fields) {
            throw new Error("Unable to create relational-json instance.\nGraph table " + key + " has no fields or no primary key");
        } else {
            env.db[key] = tableFactory(fullModel[key], env);
        }
    });

    return Object.freeze(env.db);
}

module.exports = buildDatabase;
