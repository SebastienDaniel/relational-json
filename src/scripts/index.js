var tableFactory = require("./table/tableFactory"),
    compileModel = require("./model/compileModel");

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
 * @param {JSON} schema - JSON-like schema of the database to build
 * @param {object} [options] - additional options & utilities for the schema
 * @returns {Object} - relational-json instance (Tables)
 */
function buildDatabase(schema, options) {
    "use strict";
    // create graph from schema
     var fullModel = compileModel(schema);

    // finalize the options object
    options = compileOptions(options);

    // create db tables
    Object.keys(schema).forEach(function(key) {
        if (!schema[key].primary || !schema[key].fields) {
            throw new Error("Unable to create relational-json instance.\nGraph table " + key + " has no fields or no primary key");
        } else {
            options.db[key] = tableFactory(fullModel[key], options);
        }
    });

    return Object.freeze(options.db);
}

module.exports = buildDatabase;
