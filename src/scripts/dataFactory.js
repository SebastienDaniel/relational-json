var validateDataType = require("./validateDataType");

module.exports = function dataFactory(model, d, db) {
    var row;

    // generate row and its prototype
    if (model.extends) {
        // make sure prototype has required data with proper key names
        d[model.extends.foreign] = d[model.extends.local];

        // create the prototype
        row = Object.create(db[model.extends.table].post(d));
    } else {
        row = Object.create(null);
    }

    // generate public row field descriptors
    Object.keys(model.fields).forEach(function(key) {
        // create field "getter" for extension points
        if (model.extends && model.extends.local === key) {
            // add getter for the parent data
            Object.defineProperty(row, key, {
                get: function() {
                    return Object.getPrototypeOf(this)[model.extends.foreign];
                },
                set: function() {},
                enumerable: true
            });
        } else {
            // add getter for own data
            Object.defineProperty(row, key, {
                get: function() {
                    return d[key] !== undefined ? d[key] : model.fields[key].defaultValue;
                },
                set: function() {},
                enumerable: true
            });
        }
    });

    // add aggregates to row
    if (model.aggregates) {
        model.aggregates.forEach(function(agg) {
            // add alias as property
            if (agg.cardinality === "many") {
                Object.defineProperty(row, agg.alias, {
                    get: function() {
                        return db[agg.foreignTable].get().filter(function(d) {
                            return d[agg.foreignField] === this[agg.localField];
                        }, this);
                    },
                    enumerable: true
                });
            } else {
                Object.defineProperty(row, agg.alias, {
                    get: function() {
                        return db[agg.foreignTable].get(this[agg.localField]);
                    },
                    enumerable: true
                });
            }
        });
    }

    // freeze and return
    return Object.freeze(row);
};
