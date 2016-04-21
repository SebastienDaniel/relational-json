/**
 * Looks for an existing DB entry related to new row,
 * based on ID and extends information
 * @param model
 * @param d
 * @param db
 */
function getRowPrototype(model, d, db) {
    var parent;

    if (model.extends) {
        // try to fetch the parent
        if (db[model.extends.table].get(d[model.primary])) {
            // update parent data
            // and use result as prototype (will be new obj or current parent)
            parent = db[model.extends.table].put(d, d[model.extends.localField]);
        } else {
            // make sure parent values match row values
            // on their extension point (field)
            d[model.extends.foreignField] = d[model.extends.localField];

            // create new parent from provided data
            parent = db[model.extends.table].post(d);
        }
        return parent;
    } else {
        return null;
    }
}

/**
 * compiles a row (object) based on its model & relations
 * own data (model.fields) are hidden, and a public, read-only interface is created for that data.
 * relations are dynamically mapped and data is requested on-demand.
 * @param model
 * @param d
 * @param db
 * @returns {Object}
 */
function rowFactory(model, d, db) {
    "use strict";
    var row = Object.create(getRowPrototype(model, d, db)),
        data = {}; // private own data

    // generate public row field descriptors
    model.fields.forEach(function(field) {
        var key = field.name;

        if (model.extends && model.extends.localField === key) {
            // create field "getter" for common parent-child data
            // i.e. use parent data
            data[key] = Object.getPrototypeOf(this)[model.extends.foreignField];
        } else {
            // pre-calculate &  own data value
            data[key] = d[key] !== undefined ? d[key] : field.defaultValue;
        }

        // add getter for own data (isolate)
        Object.defineProperty(row, key, {
            get: function() {
                return data[key];
            },
            enumerable: true
        });
    });

    // generate child extensions
    // keep link dynamic (no pre-calculation)
    if (model.extendedBy) {
        model.extendedBy.forEach(function (ext) {
            // add getter for the child row
            Object.defineProperty(row, ext.table, {
                get: function () {
                    return db[ext.table].get(data[ext.localField]);
                },
                enumerable: true
            });
        });
    }

    // add aggregates to row
    // keep link dynamic (no pre-calculation)
    if (model.aggregates) {
        model.aggregates.forEach(function (agg) {
            // use alias as property name, fallback to foreign table name
            if (agg.cardinality === "many") {
                Object.defineProperty(row, agg.alias || agg.table, {
                    get: function () {
                        return db[agg.table].get().filter(function (d) {
                            return d[agg.foreignField] === this[agg.localField];
                        }, this);
                    },
                    enumerable: true
                });
            } else {
                Object.defineProperty(row, agg.alias || agg.table, {
                    get: function () {
                        return db[agg.table].get(data[agg.localField]);
                    },
                    enumerable: true
                });
            }
        });
    }

    // freeze and return
    return Object.freeze(row);
}

module.exports = rowFactory;