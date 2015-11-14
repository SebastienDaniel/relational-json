"use strict";
/*jshint validthis: true */
var deepCopy = require("./deepCopy"),
    getData = require("./getData"),
    getRequiredFields = require("./getRequiredFields"),
    validateDataType = require("./validateDataType"),
    fullModel;

function getFurthestAncestorField(tableName) {
    var p = this[tableName].getExtensionInfo();

    if (p) {
        // peak one step further
        if (getFurthestAncestorField.call(this, p.table) !== null) {
            return getFurthestAncestorField.call(this, p.table);
        } else {
            return p.foreign;
        }
    } else {
        return null;
    }
}

function getInheritanceChain(tableName) {
    var chain = [],
        ext,
        stopLoop = false;

    while (stopLoop === false) {
        // push currentTable name
        chain.push(tableName);

        // get extension info
        ext = this[tableName].getExtensionInfo();

        // if extends, keep looping
        if (ext) {
            tableName = ext.table;
        } else {
            stopLoop = true;
        }
    }

    return chain;
}

function makeData(model, d, ancestorField) {
    // aggregates should be non-enumerable (simplifies updating own data)
    var missingFields = [];

    Object.keys(model.fields).forEach(function(key) {
        if (!model.fields[key].allowNull && !model.fields[key].hasOwnProperty("defaultValue")) {
            if (d[key] === undefined) {
                if (model.extends && model.extends.local === key && d[ancestorField]) {
                    return;
                } else {
                    missingFields.push(key);
                }
            }
        }
    });

    // validate that all necessary fields are provided
    try {
        if (missingFields.length > 0) {
            throw Error("data creation rejected, mandatory fields not provided:\n" + missingFields);
        }
    } catch (msg) {
        console.log(msg);
        console.log(missingFields);
    }

    //data.push(o);
    return dataFactory.call(this, model, d);
}

function dataFactory(model, d) {
    var data = {},
        db = this,
        face;

    // generate public face and its prototype
    if (model.extends) {
        // make sure prototype has required data with proper key names
        //d[model.extends.foreign] = d[model.extends.local];

        // create the prototype
        face = Object.create(db[model.extends.table].post(d));
    } else {
        face = Object.create(null);
    }

    // generate public face field descriptors
    Object.keys(model.fields).forEach(function(key) {
        var field = model.fields[key];

        // create initial property
        Object.defineProperty(face, key, {
            enumerable: true,
            configurable: true
        });

        // creating field "getter"
        if (model.extends && model.extends.local === key) {
            // add getter for the parent data
            Object.defineProperty(face, key, {
                get: function() {
                    return Object.getPrototypeOf(this)[model.extends.foreign];
                },
                enumerable: true
            });
        } else {
            // add getter for own data
            Object.defineProperty(face, key, {
                get: function() {
                    return data[key];
                }
            });
        }

        // creating field "setter"
        // usually only auto-increment fields are read-only
        if (field.writable) {
            Object.defineProperty(face, key, {
                set: function(v) {
                    var type = field.dataType,
                        fieldModel = model.fields[key];

                    if (validateDataType(fieldModel, v)) {
                        data[key] = v;
                    }
                }
            });
        } else {
            Object.defineProperty(face, key, {
                set: function() {} // empty setter to avoid ERROR in strict mode
            });
        }
    });

    // set initial data
    Object.keys(face).forEach(function(key) {
        var value;

        // completely ignore extended fields
        if (model.extends && key === model.extends.local) {
            return;
        }

        // we already filtered for mandatory fields, so we can assume defaultValues
        if (d[key] === undefined) {
            value = model.fields[key].defaultValue;
        } else {
            value = d[key];
        }

        if (Object.getOwnPropertyDescriptor(face, key).writable) {
            face[key] = value;
        } else {
            // set data directly since "set" is blocking on face
            // validate dataType first
            if (validateDataType(model.fields[key], value)) {
                data[key] = value;
            } else {
                console.log(value);
                throw Error("\n" + key + " expects " + model.fields[key].dataType + " data type.\nProvided: " + Object.prototype.toString.call(value));
            }
        }
    });

    // add aggregates to face
    if (model.aggregates) {
        model.aggregates.forEach(function(agg) {
            // add alias as property
            if (agg.cardinality === "many") {
                Object.defineProperty(face, agg.alias, {
                    get: function() {
                        return db[agg.foreignTable].get().filter(function(d) {
                            return d[agg.foreignField] === this[agg.localField];
                        }, this);
                    },
                    configurable: true,
                    enumerable: true
                });
            } else {
                Object.defineProperty(face, agg.alias, {
                    get: function() {
                        return db[agg.foreignTable].get(this[agg.localField]);
                    },
                    configurable: true,
                    enumerable: true
                });
            }
        });
    }

    // freeze and return
    return Object.freeze(face);
}

function tableFactory(m, tn) {
    var data = [],
        db = this,
        name = tn,
        model = deepCopy(m);

    return {
        get: function(id) {
            return getData(id, model.primary, data);
        },
        post: function(d) {
            var obj;

            // make sure pk is unique
            try {
                if (data.some(function(existing) {
                        return existing[model.primary] === d[model.primary];
                    })) {
                    throw Error("provided " + model.primary + ": " + d[model.primary] + " is already in use");
                } else {
                    obj = makeData.call(db, model, d, getFurthestAncestorField.call(db, name));
                    data.push(obj);
                    return obj;
                }
            } catch (msg) {
                console.log(msg);
            }
        },
        getExtensionInfo: function() {
            if (model.extends) {
                return deepCopy(model.extends);
            } else {
                return null;
            }
        },
        getAggregateInfo: function(tableName) {
            var i,
                match;

            if (model.aggregates) {
                i = model.aggregates.length;
                match = false;
            } else {
                return undefined;
            }

            while (match === false && i) {
                i--;
                match = (model.aggregates[i].foreignTable === tableName) || (model.aggregates[i].alias === tableName);
            }

            if (match) {
                return model.aggregates[i];
            } else {
                return undefined;
            }
        },
        getAggregateTableFromField: function(fieldName) {
            var i = model.aggregates.length,
                match = false;

            while (match === false && i) {
                i--;
                match = model.aggregates[i].localField === fieldName;
            }

            if (match) {
                return db[model.aggregates[i].foreignTable];
            } else {
                return undefined;
            }
        },
        getRequiredFields: function() {
            return getRequiredFields(model, fullModel);
        },
        getPrimaryField: function() {
            return model.primary;
        },
        getInheritanceChain: function() {
            return getInheritanceChain.call(db, name);
        },
        getName: function() {
            return name;
        }
    };
}

// builds the relational JSON database
function buildDatabase(graph) {
    var db = {};

    // store a copy of the model
    fullModel = deepCopy(graph);

    // create db tables
    Object.keys(graph).forEach(function(key) {
        if (!graph[key].primary || !graph[key].fields) {
            throw new Error("Graph table " + key + " has no fields or no primary key");
        } else {
            db[key] = tableFactory.call(db, graph[key], key);
        }
    });

    return db;
}

module.exports = function(graph) {
    return buildDatabase(graph);
};
