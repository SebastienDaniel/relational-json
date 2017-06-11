const r = require('ramda');

/**
 * @function
 * @private
 *
 * Uses schema "extends" information to add "extendedBy" information
 * which is needed by the Model parser
 *
 * @param {object} schema
 * @return {object}
 */
module.exports = function addExtendedByToSchema(schema) {
	const tableName = Object.keys(schema);

	tableName.forEach((tableName) => {
		const table = schema[tableName];

        // if the table extend another table
		if (r.type(table.extends) === 'Object') {
			const extendsInfo = table.extends;
			const extendedTable = schema[extendsInfo.table];

            // ensure that we have an extendedBy object
            // on the extended table
			if (r.type(extendedTable.extendedBy) !== 'Object') {
				extendedTable.extendedBy = {};
			}

            // inject the reversed extends relation information
			extendedTable.extendedBy[tableName] = {
				localField: extendsInfo.foreignField,
				foreignField: extendsInfo.localField
			};
		}
	});

	return schema;
};
