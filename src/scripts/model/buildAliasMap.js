function mapRelations(obj, model) {
    // add own aggregates
    if (model.aggregates) {
        model.aggregates.forEach(function (agg) {
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
 * The alias map is a alias:tableName hash-map, where
 * a given alias, in the context of the current table,
 * points to another table in the schema
 * In other words, it is a map for nested data (Object or Array)
 */
module.exports = function buildAliasMap(model) {
    "use strict";
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
    return mapRelations(o, model)
};
