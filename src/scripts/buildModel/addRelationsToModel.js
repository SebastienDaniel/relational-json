/**
 * @private
 * @typedef {object} extensionRelation
 * @property {Table} table
 * @property {string} localField
 * @property {string} foreignField
 */

/**
 * @private
 * @typedef {object} aggregationRelation
 * @property {Table} table
 * @property {string} alias
 * @property {string} cardinality=single|many
 * @property {string} localField
 * @property {string} foreignField
 */

/**
 * @private
 * @summary Adds relations to other tables in the rJSON db
 *
 * @param {JSON} schema - schema used to build rJSON db
 * @param {object} dynamicModel - hashmap of Models
 * @returns {object} Model object, enhanced with relations
 */
function addRelationsToModel(schema, dynamicModel) {
	const tableNames = Object.keys(schema);

	tableNames.forEach((tableName) => {
		const staticModel = schema[tableName];
		const model = dynamicModel[tableName];

		// add dynamic link to parent model
		if (staticModel.extends) {
			const parentTable = staticModel.extends;

			/**
			 * @name model#extends
			 * @type extensionRelation
			 * @summary adds a relation from the child model to its parent model
			 */
			model.extends = {
				model: dynamicModel[parentTable.table],
				localField: parentTable.localField,
				foreignField: parentTable.foreignField
			};
		}

		// add links to children models
		if (staticModel.extendedBy) {
			const childTableNames = staticModel.extendedBy;
			/**
			* @name model#extendedBy
			* @type extensionRelation[]
			* @summary adds dynamic link to the models' child models
			*/
			model.extendedBy = Object.keys(childTableNames)
				.map((tableName) => {
					const childTable = staticModel.extendedBy[tableName];

					return {
						model: dynamicModel[tableName],
						localField: childTable.localField,
						foreignField: childTable.foreignField
					};
				});
		}

		// add links to aggregate models
		if (staticModel.aggregates) {
			/**
			 * @name model#aggregates
			 * @type aggregationRelation[]
			 * @summary adds dynamic link to the models' aggregate models
			 */
			model.aggregates = staticModel.aggregates
				.map((aggregate) => ({
					model: dynamicModel[aggregate.table],
					alias: aggregate.alias,
					cardinality: aggregate.cardinality,
					localField: aggregate.localField,
					foreignField: aggregate.foreignField
				}));
		}
	});

	return dynamicModel;
}

module.exports = addRelationsToModel;
