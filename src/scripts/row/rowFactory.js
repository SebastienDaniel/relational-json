"use strict";

/**
 * @typedef {object} Row
 * @summary Immutable javascript object stored within a Table
 * @property prototype - another Table row, if in a extends relation, otherwise `null`
 */

/**
 * @private
 * Looks for an existing DB entry related to new row,
 * based on ID and extends information
 * @param model
 * @param data
 * @param db
 */
function setRowPrototype(model, db, data) {
    var parent;

    if (model.extends) {
        if (db[model.extends.model.tableName].get(data[model.extends.localField])) {
            // use updated parent (if necessary), otherwise current parent
            parent = db[model.extends.model.tableName].put(data, data[model.extends.localField]);
        } else {
            // make sure parent values match row values on their extension field
            data[model.extends.foreignField] = data[model.extends.localField];

            // create new parent from provided data
            parent = db[model.extends.model.tableName].post(data);
        }
        return parent;
    } else {
        return null;
    }
}

/**
 * @private
 * @summary compiles a row (object) based on its model & relations
 * own data (model.listFields()) are hidden, and a public, read-only interface is created for that data.
 * relations are dynamically mapped and data is requested on-demand.
 * @param model
 * @param data
 * @param db
 * @returns {Row}
 */
function rowFactory(model, db, data) {
    var row = Object.create(setRowPrototype(model, db, data)),
        privateData = {};

    // generate public row field descriptors
    model.listFields().forEach(function(field) {
        var key = field.name;

        if (model.extends && model.extends.localField === key) {
            // create field "getter" for common parent-child data
            // i.e. use parent data
            privateData[key] = Object.getPrototypeOf(row)[model.extends.foreignField];
        } else {
            // set own data value
            privateData[key] = data[key] !== undefined ? data[key] : field.defaultValue;
        }

        // provide read-only access to own data
        Object.defineProperty(row, key, {
            value: privateData[key],
            enumerable: true
        });
    });

    // generate child extensions
    // keep link dynamic (no pre-calculation)
    if (model.extendedBy) {
        model.extendedBy.forEach(function(ext) {
            // add getter for the child row
            Object.defineProperty(row, ext.model.tableName, {
                get: function() {
                    return db[ext.model.tableName].get(privateData[ext.localField]);
                },
                enumerable: true
            });
        });
    }

    // add aggregates to row
    // keep link dynamic (no pre-calculation)
    if (model.aggregates) {
        model.aggregates.forEach(function(agg) {
            // use alias as property name, fallback to foreign table name
            if (agg.cardinality === "many") {
                Object.defineProperty(row, agg.alias || agg.model.tableName, {
                    get: function() {
                        return db[agg.model.tableName].getAllData().filter(function(d) {
                            return d[agg.foreignField] === this[agg.localField];
                        }, this);
                    },
                    enumerable: true
                });
            } else {
                Object.defineProperty(row, agg.alias || agg.model.tableName, {
                    get: function() {
                        return db[agg.model.tableName].get(privateData[agg.localField]) || null;
                    },
                    enumerable: true
                });
            }
        });
    }

    return Object.freeze(row);
}

module.exports = rowFactory;
