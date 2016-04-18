var deepCopy = require("./deepCopy"),
    tableFactory = require("./table/tableFactory");

/**
 * Makes a copy of the model to avoid future tampering
 * Creates each table in the Graph
 *
 * @param {JSON} graph - JSON-like schema of the database to build
 * @param {object} [options] - additional options & utilities for the schema
 * @returns {Object} - relational-json instance (Tables)
 */
function buildDatabase(graph, options) {
    "use strict";
    var db = Object.create(null, {}),
        // store a copy of the model
        // TODO: might not be necessary so early, since a copy might be made in the model
        fullModel = deepCopy(graph);

    // create db tables
    Object.keys(graph).forEach(function(key) {
        if (!graph[key].primary || !graph[key].fields) {
            throw new Error("Unable to create relational-json instance.\nGraph table " + key + " has no fields or no primary key");
        } else {
            db[key] = tableFactory(key, fullModel, db);
        }
    });

    return Object.freeze(db);
}

module.exports = buildDatabase;
