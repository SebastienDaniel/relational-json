var deepCopy = require("./deepCopy"),
    tableFactory = require("./tableFactory"),
    validateDataType = require("./validateDataType");

/**
 * Makes a copy of the model to avoid future tampering
 * Creates each table in the Graph
 *
 * @param {JSON} graph - JSON schema of the database to build
 * @returns {Object} - Tables from the schema
 */
function buildDatabase(graph) {
    "use strict";
    var db = Object.create(null, {}),
        // store a copy of the model
        fullModel = deepCopy(graph);

    // create db tables
    Object.keys(graph).forEach(function(key) {
        if (!graph[key].primary || !graph[key].fields) {
            throw new Error("Graph table " + key + " has no fields or no primary key");
        } else {
            db[key] = tableFactory(key, fullModel, db);
        }
    });

    return Object.freeze(db);
}

module.exports = function(graph) {
    "use strict";
    return buildDatabase(graph);
};
