"use strict";

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
    Object.keys(schema).forEach(function(key) {
        var staticModel = schema[key],
            model = dynamicModel[key];

        // add dynamic link to parent model
        if (staticModel.extends) {
            /**
             * @name model#extends
             * @type extensionRelation
             * @summary adds a relation from the child model to its parent model
             */
            Object.defineProperty(model, "extends", {
                value: {
                    model: dynamicModel[staticModel.extends.table],
                    localField: staticModel.extends.localField,
                    foreignField: staticModel.extends.foreignField
                },
                enumerable: true
            });
        }

        // add links to children models
        if (staticModel.extendedBy) {
            /**
             * @name model#extendedBy
             * @type extensionRelation[]
             * @summary adds dynamic link to the models' child models
             */
            Object.defineProperty(model, "extendedBy", {
                value: Object.keys(staticModel.extendedBy).map(function(key) {
                    var ext = staticModel.extendedBy[key];

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
        if (staticModel.aggregates) {
            /**
             * @name model#aggregates
             * @type aggregationRelation[]
             * @summary adds dynamic link to the models' aggregate models
             */
            Object.defineProperty(model, "aggregates", {
                value: staticModel.aggregates.map(function(agg) {
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
    });

    return dynamicModel;
}

module.exports = addRelationsToModel;
