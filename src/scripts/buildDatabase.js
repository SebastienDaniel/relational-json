"use strict";

var tableFactory = require("./table/tableFactory");

/**
 * Makes a copy of the model to avoid future tampering
 * Creates each table in the Graph
 *
 * @param {JSON} modelGraph - JSON-like schema of the database to build
 * @param {object} env - additional options & utilities for the schema
 * @returns {Object} - relational-json instance (Tables)
 */
module.exports = function buildDatabase(modelGraph, env) {
    // create db tables
    Object.keys(modelGraph).forEach(function(key) {
        env.db[key] = tableFactory(modelGraph[key], env);
    });

    return Object.freeze(env.db);
};
