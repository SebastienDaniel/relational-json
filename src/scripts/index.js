var deepCopy = require("./deepCopy"),
    tableFactory = require("./table/tableFactory");

function compileOptions(options) {
    var o = Object.create(null, {});

    if (options && typeof options.preprocessor === "function") {
        o.preprocessor = options.preprocessor;
    }

    o.db = Object.create(null, {});

    return o;
}

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
    // store a copy of the model
    // TODO: might not be necessary so early, since a copy might be made in the model
     var fullModel = deepCopy(graph);

    // finalize the options object
    options = compileOptions(options);

    // create db tables
    Object.keys(graph).forEach(function(key) {
        if (!graph[key].primary || !graph[key].fields) {
            throw new Error("Unable to create relational-json instance.\nGraph table " + key + " has no fields or no primary key");
        } else {
            options.db[key] = tableFactory(key, fullModel, options);
        }
    });

    return Object.freeze(options.db);
}

module.exports = buildDatabase;
