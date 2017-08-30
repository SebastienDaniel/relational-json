/**
 * @private
 * @summary adds own and ancestor aggregate relations to alias map
 * @param {object} obj - aliasMap object
 * @param {object} model - Model instance to start with
 * @returns {object} - aliasMap object
 */
function mapRelations(obj, model) {
    // add own aggregates
    if (Array.isArray(model.aggregates)) {
        model.aggregates.forEach(function(aggregate) {
            obj[aggregate.alias] = aggregate.model.tableName;
        });
    }

    // continue looping into parents
    if (model.extends) {
        const nextModel = model.extends.model;
        mapRelations(obj, nextModel);
    }

    return obj;
}

/**
 * @private
 * @summary Compiles an alias map (propName:tableName), based on the provided model
 * @param {object} model - Model object used to scan relation alias names
 * @returns {object} map of prop:tableName for each relation
 */
function buildAliasMap(model) {
    const o = {};

    // add immediate parent
    if (model.extends) {
        const parentTableName = model.extends.model.tableName;
        o[parentTableName] = parentTableName;
    }

    // add own children
    if (Array.isArray(model.extendedBy)) {
        model.extendedBy.forEach(function(childTable) {
            const childTableName = childTable.model.tableName;
            o[childTableName] = childTableName;
        });
    }
    return mapRelations(o, model);
}

module.exports = buildAliasMap;
