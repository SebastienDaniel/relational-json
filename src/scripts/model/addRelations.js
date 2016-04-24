"use strict";

/**
 * @private
 * @alias addRelations
 * @summary Adds relations to other tables in the rJSON db
 *
 * @param {JSON} schema - schema used to build rJSON db
 * @param {object} dynamicModel - hashmap of Models
 * @param {object} model - Model object to add relations to
 * @returns {object} Model object, enhanced with relations
 */
module.exports = function addRelations(schema, dynamicModel, model) {
    schema = schema[model.tableName];

    // add link to parent model
    if (schema.extends) {
        Object.defineProperty(model, "extends", {
            value: {
                table: dynamicModel[schema.extends.table],
                localField: schema.extends.localField,
                foreignField: schema.extends.foreignField
            },
            enumerable: true
        });
    }

    // add links to children models
    if (schema.extendedBy) {
        Object.defineProperty(model, "extendedBy", {
            value: Object.keys(schema.extendedBy).map(function(key) {
                var ext = schema.extendedBy[key];

                return {
                    table: dynamicModel[key],
                    localField: ext.localField,
                    foreignField: ext.foreignField
                };
            }),
            enumerable: true
        });
    }

    // add links to aggregate models
    if (schema.aggregates) {
        Object.defineProperty(model, "aggregates", {
            value: schema.aggregates.map(function(agg) {
                return {
                    table: dynamicModel[agg.table],
                    alias: agg.alias,
                    cardinality: agg.cardinality,
                    localField: agg.localField,
                    foreignField: agg.foreignField
                };
            }),
            enumerable: true
        });
    }

    return model;
};
