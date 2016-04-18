/**
 * Looks for an existing DB entry related to new row, based on ID
 * @param model
 * @param d
 * @param db
 */
function getRowPrototype(model, d, db) {
    var parent;

    if (model.extends) {
        // try to fetch the parent
        parent = db[model.extends.table].get(d[model.primary]);

        if (parent) {
            // update parent parent data
            // and use result as prototype (will be new obj or current parent)
            parent = db[model.extends.table].put(d, d[model.extends.local]);
        } else {
            // make sure parent values match row values
            // on their extension point (field)
            d[model.extends.foreign] = d[model.extends.local];

            // create new parent from provided data
            parent = db[model.extends.table].post(d);
        }
        return parent;
    } else {
        return null;
    }
}

// TODO: needs to encapsulate data
function dataFactory(model, d, db) {
    "use strict";
    var row = Object.create(getRowPrototype(model, d, db)),
        data = {}; // private own data

    // generate public row field descriptors
    Object.keys(model.fields).forEach(function(key) {
        if (model.extends && model.extends.local === key) {
            // create field "getter" for extension points
            // i.e. get parent data, don't duplicate data
            Object.defineProperty(row, key, {
                get: function() {
                    return Object.getPrototypeOf(this)[model.extends.foreign];
                },
                enumerable: true
            });
        } else {
            // store own data value
            data[key] = d[key] !== undefined ? d[key] : model.fields[key].defaultValue;

            // add getter for own data
            Object.defineProperty(row, key, {
                get: function() {
                    // should be pre-calculated and shouldn't rely on d
                    return data[key];
                },
                enumerable: true
            });
        }
    });

    // generate child extensions
    model.extendedBy.forEach(function(ext) {
        // add getter for the parent data
        Object.defineProperty(row, ext.foreignTable, {
            get: function() {
                return db[ext.foreignTable].get(this[ext.localField]);
            },
            enumerable: true
        });
    });

    // add aggregates to row
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

    // freeze and return
    return Object.freeze(row);
}

module.exports = dataFactory;
