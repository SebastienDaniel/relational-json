// generate all graph tables to allow early references
module.exports = (function() {
    "use strict";
    /*jshint validthis: true */
    // allows cloning of primitive value objects & arrays
    // TODO: should be an external dependency that is required
    function deepCopy(o) {
        var newO,
            i;

        if (typeof o !== "object" || !o) {
            return o;
        } else if (Object.prototype.toString.apply(o) === "[object Array]") {
            newO = [];
            for (i = 0; i < o.length; i += 1) {
                newO[i] = deepCopy(o[i]);
            }
            return newO;
        } else {
            newO = {};
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    newO[i] = deepCopy(o[i]);
                }
            }
            return newO;
        }
    }

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

    function getData(id, pk, data) {
        var o,
            i;

        if (id !== null && id !== undefined) { // return specific data object
            i = data.length;
            while (i) {
                i--;
                if (data[i][pk] === id) {
                    o = data[i];
                    i = 0;
                }
            }
            return o;
        } else if (id === undefined) { // return all data objects
            return data;
        } else if (id === null) {
            return null;
        }
    }

    function makeData(model, d, ancestorField) {
        // aggregates should be non-enumerable (simplifies updating own data)
        var o,
            missingFields = [];

        // validate that all necessary fields are provided
        if (!Object.keys(model.fields).every(function(key) {
                if (!model.fields[key].allowNull && !model.fields[key].hasOwnProperty("defaultValue")) {
                    if (!d[key]) {
                        if (model.extends && model.extends.local === key && d[ancestorField]) {
                            return true;
                        } else {
                            missingFields.push(key);
                            return false;
                        }
                    }
                }

                return true;
            })) {
            console.log("THROWING ERROR");
            throw Error ("data creation rejected, mandatory fields not provided:\n" + missingFields);
        }

        //data.push(o);
        return dataFactory.call(this, model, d);
    }

    function getRequiredFields(model) {
        var req = [];

        // get models' own required fields
        Object.keys(model.fields).forEach(function(key) {
            if (!model.fields[key].allowNull && model.fields[key].defaultValue === undefined) {
                req.push(key);
            }
        });

        // what about "extends" relations
        if (model.extends) {
            // remove the local field that is the extension point
            req = req.filter(function(r) {
                return r !== model.extends.local;
            });

            // recursively get required fields
            req = req.concat(this[model.extends.table].getRequiredFields());
        }

        return req;
    }

    function validateDataType(field, value) {
        // expected types: string, integer, float, date, time, datetime, boolean
        var trueType = Object.prototype.toString.call(value),
            res = false;

        // if allow null and value === null, return true
        if (field.allowNull === true && value === null) {
            return true;
        }

        switch (field.dataType) {
            case "string": {
                res = trueType === "[object String]";
                break;
            }

            case "integer": {
                res = trueType === "[object Number]" && /^[-+]?\d{1,20}$/.test(value.toString());
                break;
            }

            case "float": {
                res = trueType === "[object Number]" && /^[-+]?\d{1,20}(?:\.\d{1,20})?$/.test(value.toString());
                break;
            }

            case "boolean": {
                res = trueType === "[object Boolean]" && (value === true || value === false) || (value === 1 || value === 0);
                break;
            }

            case "date": {
                // validates iso format: yyyy-mm-dd
                res = trueType === "[object String]" && /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/.test(value);
                break;
            }

            case "datetime": {
                res = trueType === "[object String]" && /^(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))(T| )(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){1,2}(\.[0-9]{1,3})?\Z?$/.test(value);
                break;
            }

            case "time": {
                res = trueType === "[object String]" && /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){1,2}(\.[0-9]{1,3})?$/.test(value);
                break;
            }

            default: {
                throw new Error("Incompatible dataType:" + type);
            }
        }

        return res;
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

    function tableFactory(m, tableName) {
        var data = [],
            db = this,
            model = deepCopy(m);

        return {
            get: function(id) {
                return getData(id, model.primary, data);
            },
            post: function(d) {
                var obj;

                // make sure pk is unique
                if (data.some(function(existing) {
                        return existing[model.primary] === d[model.primary];
                    })) {
                    throw Error("provided " + model.primary + ": " + d[model.primary] + " is already in use");
                } else {
                    obj = makeData.call(db, model, d, getFurthestAncestorField.call(db, tableName));
                    data.push(obj);
                    return obj;
                }
            },
            getExtensionInfo: function() {
                if (model.extends) {
                    return model.extends;
                } else {
                    return null;
                }
            },
            getAggregateInfo: function(tableName) {
                var i = model.aggregates.length,
                    match = false;

                while (match === false && i) {
                    i--;
                    match = model.aggregates[i].foreignTable === tableName;
                }

                if (match) {
                    return model.aggregates[i];
                } else {
                    return undefined;
                }
            },
            getRequiredFields: function() {
                return getRequiredFields.call(db, model);
            },
            getPrimaryField: function() {
                return model.primary;
            },
            getInheritanceChain: function() {
                return getInheritanceChain.call(db, tableName);
            }
        };
    }

    // builds the relational JSON database
    function buildDatabase(graph) {
        var db = {};

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

    return function(graph) {
        return buildDatabase(graph);
    };
}());
