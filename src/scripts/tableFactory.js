var getData = require("./getData"),
    getFurthestAncestorField = require("./getFurthestAncestorField"),
    getInheritanceChain = require("./getInheritanceChain"),
    getRequiredFields = require("./getRequiredFields"),
    isPrimaryKeyUsed = require("./isPrimaryKeyUsed"),
    recursiveDelete = require("./recursiveDelete"),
    makeData = require("./makeData");

module.exports = function tableFactory(tn, fullModel, db) {
    "use strict";
    var data = [],          // private object store
        m = fullModel[tn],  // own portion of graph
        name = tn;          // own name

    return {
        // SELECT
        get: function(id) {
            return getData(data, id, m.primary);
        },
        // INSERT, should create new array
        post: function(d) {
            var obj;

            // make sure pk is unique
            if (isPrimaryKeyUsed(data, d[m.primary], m.primary)) {
                throw Error("provided " + m.primary + ": " + d[m.primary] + " is already in use in " + name);
            } else {
                obj = makeData(m, d, tn, db);

                // create a new data array (for immutability)
                // keep index order
                data = data.concat(obj).sort(function(a, b) {
                    a = a[m.primary];
                    b = b[m.primary];

                    return a - b;
                });
                return obj;
            }
        },
        // UPDATE
        put: function(d, pkValue) {
            // find current object
            var current = getData(data, pkValue || d[m.primary], m.primary),
                differs = false,
                extendedBy,
                k;

            // throw if unfound
            if (!current) {
                throw Error("Cannot update a non-existent Object, id: " + pkValue);
            }

            // compile new values, keeping only own values
            // check if the PUT operation will actually change something
            // for in also looks up prototypes
            for (k in current) {
                if (current[k] === null || typeof current[k] !== "object") {
                    if (d[k] === undefined) {
                        d[k] = current[k];
                    } else if (d[k] !== current[k]) {
                        differs = true;
                    }
                }
            }

            // if differences have been detected
            if (differs) {
                if (m.extendedBy && m.extendedBy.some(function(e) {
                        if (!!db[e.foreignTable].get(current[e.localField])) {
                            extendedBy = e;
                            return true;
                        }
                    })) {
                    d[extendedBy.foreignField] = d[extendedBy.localField];
                    return db[extendedBy.foreignTable].put(d);
                } else {
                    // remove existing object
                    this.delete(pkValue || current[m.primary]);

                    // re-create new object
                    return this.post(d);
                }
            } else {
                return current;
            }
        },
        // DELETE
        delete: function(id) {
            recursiveDelete(id, data, name, fullModel, db);

            // reset data array
            data = data.splice(0, data.length);
        },
        // meta-data about the table
        meta: Object.create(null, {
            pk: {
                get: function() {
                    return m.primary;
                },
                enumerable: true
            },
            requiredFields: {
                get: function() {
                    return getRequiredFields(m, fullModel);
                },
                enumerable: true
            },
            /**
             * return a alias:tableName map of aggregate relations
             */
            aliasMap: {
                get: function() {
                    var aliases = getInheritanceChain(name, fullModel).reduce(function(pV, cV) {
                        if (fullModel[cV].aggregates) {
                            return pV.concat(fullModel[cV].aggregates);
                        } else {
                            return pV;
                        }
                    }, []).reduce(function(pV, cV) {
                        pV[cV.alias] = cV.foreignTable;
                        return pV;
                    }, {});

                    if (m.extendedBy) {
                        m.extendedBy.reduce(function(pV, cV) {
                            pV[cV.foreignTable] = cV.foreignTable;
                            return pV;
                        }, aliases);
                    }

                    return aliases;
                },
                enumerable: true
            }
        })
    };
};
