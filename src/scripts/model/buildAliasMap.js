"use strict";

/**
 * @private
 * @summary adds own and ancestor aggregate relations to alias map
 * @param {object} obj - aliasMap object
 * @param {object} model - Model instance to start with
 * @returns {object} - aliasMap object
 */
function mapRelations(obj, model) {
    // add own aggregates
    if (model.aggregates) {
        model.aggregates.forEach(function(agg) {
            obj[agg.alias] = agg.table.tableName;
        });
    }

    // continue looping into parents
    if (model.extends) {
        mapRelations(obj, model.extends.table);
    }

    return obj;
}

/**
 * @alias buildAliasMap
 * @private
 * @summary Compiles an alias map (propName:tableName), based on the provided model
 * @param {object} model - Model object used to scan relation alias names
 * @returns {object} map of prop:tableName for each relation
 */
module.exports = function buildAliasMap(model) {
    var o = {};

    // add immediate parent
    if (model.extends) {
        o[model.extends.table.tableName] = model.extends.table.tableName;
    }

    // add own children
    if (model.extendedBy) {
        model.extendedBy.forEach(function(ext) {
            o[ext.table.tableName] = ext.table.tableName;
        });
    }
    return mapRelations(o, model);
};
