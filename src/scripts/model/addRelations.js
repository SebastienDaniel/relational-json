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
            value: schema.extendedBy.map(function(ext) {
                return {
                    table: dynamicModel[ext.table],
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
            value: schema.aggregates.map(function (agg) {
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
