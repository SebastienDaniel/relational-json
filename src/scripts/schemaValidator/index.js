const verifyPrimaryField = require('./verifyTablePrimaryField');
const verifyFields = require('./verifyTableFields');
const verifyAggregates = require('./verifyAggregateRelations');
const verifyExtends = require('./verifyExtendsRelations');
const r = require('ramda');

function scanSchemaTables(schema) {
	return Object.keys(schema)
		.every((key) => {
		return verifyPrimaryField(schema, key) &&
               verifyFields(schema, key) &&
               verifyExtends(schema, key) &&
               verifyAggregates(schema, key);
		});
}

module.exports = scanSchemaTables;
