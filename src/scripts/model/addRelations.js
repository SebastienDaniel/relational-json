module.exports = function addRelations(schema, dynamicModel, model) {
    schema = schema[model.tableName];

    // add link to parent
    if (schema.extends) {
        Object.defineProperty(model, "extends", {
            value: {
                table: dynamicModel[schema.extends.table],
                local: schema.extends.local,
                foreign: schema.extends.foreign
            },
            enumerable: true
        });
    }
    
    // add links to children
    if (schema.extendedBy) {
        Object.defineProperty(model, "extendedBy", {
            value: schema.extendedBy.map(function(ext) {
                return {
                    table: dynamicModel[ext.foreignTable],
                    localField: ext.localField,
                    foreignField: ext.foreignField
                };
            }),
            enumerable: true
        });
    }

    // add links to aggregates
    if (schema.aggregates) {
        Object.defineProperty(model, "aggregates", {
            value: schema.aggregates.map(function (agg) {
                return {
                    table: dynamicModel[agg.foreignTable],
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
