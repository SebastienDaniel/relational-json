"use strict";

/**
 * @typedef {object} extensionRelation
 * @property {Table} table
 * @property {string} localField
 * @property {string} foreignField
 */

/**
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
 * @param {object} model - Model object to add relations to
 * @returns {object} Model object, enhanced with relations
 */
function addRelations(schema, dynamicModel, model) {
    schema = schema[model.tableName];

    // add dynamic link to parent model
    if (schema.extends) {
        /**
         * @name model#extends
         * @type extensionRelation
         * @summary adds a relation from the child model to its parent model
         */
        Object.defineProperty(model, "extends", {
            value: {
                model: dynamicModel[schema.extends.table],
                localField: schema.extends.localField,
                foreignField: schema.extends.foreignField
            },
            enumerable: true
        });
    }

    // add links to children models
    if (schema.extendedBy) {
        /**
         * @name model#extendedBy
         * @type extensionRelation[]
         * @summary adds dynamic link to the models' child models
         */
        Object.defineProperty(model, "extendedBy", {
            value: Object.keys(schema.extendedBy).map(function(key) {
                var ext = schema.extendedBy[key];

                return {
                    model: dynamicModel[key],
                    localField: ext.localField,
                    foreignField: ext.foreignField
                };
            }),
            enumerable: true
        });
    }

    // add links to aggregate models
    if (schema.aggregates) {
        /**
         * @name model#aggregates
         * @type aggregationRelation[]
         * @summary adds dynamic link to the models' aggregate models
         */
        Object.defineProperty(model, "aggregates", {
            value: schema.aggregates.map(function(agg) {
                return {
                    model: dynamicModel[agg.table],
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
}

module.exports = addRelations;
