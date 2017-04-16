const r = require("ramda");
const addExtendedByToSchema = require("./addExtendedByToSchema");
const createDynamicModel = require("./createDynamicModel");

/**
 * @private
 * @summary compiles the Model graph based on provided schema
 * @param {JSON} schema - JSON-like notation for the schema
 * @returns {Object} - Model graph
 */
module.exports = r.compose(
	createDynamicModel,
	addExtendedByToSchema
);
