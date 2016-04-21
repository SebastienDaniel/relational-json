function mapRelations(obj, model) {
    // add own aggregates
    if (model.aggregates) {
        model.aggregates.forEach(function (agg) {
            obj[agg.alias] = agg.table.tableName;
        });
    }

    // add own extendedBy
    if (model.extendedBy) {
        model.extendedBy.forEach(function (ext) {
            obj[ext.table.tableName] = ext.table.tableName;
        });
    }

    // loop into extends
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
    return mapRelations({}, model)
};
