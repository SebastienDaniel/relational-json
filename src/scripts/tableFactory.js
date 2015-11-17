var getData = require("./getData"),
    getFurthestAncestorField = require("./getFurthestAncestorField"),
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
                console.log(data);
                throw Error("provided " + m.primary + ": " + d[m.primary] + " is already in use in " + name);
            } else {
                obj = makeData(m, d, getFurthestAncestorField(name, fullModel), db);
                // create a new data array
                // immutability
                data = data.concat(obj);
                return obj;
            }
        },
        // UPDATE
        put: function(pkValue, d) {
            // find current object
            var current = getData(data, pkValue, m.primary),
                obj,
                k;

            // throw if unfound
            if (!current) {
                throw Error("Cannot update a non-existent Object, id: " + pkValue);
            }

            // compile new values
            for (k in current) {
                if (d[k] === undefined) {
                    d[k] = current[k];
                }
            }

            // create a new object with makeData
            this.delete(pkValue);
            obj = makeData(m, d, getFurthestAncestorField(name, fullModel), db);

            // inject it into data array at specific place (keep ids in order)
            data.push(obj);

            return obj;
        },
        // DELETE
        delete: function(id) {
            recursiveDelete(id, data, name, fullModel, db);
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
                    return m.aggregates.reduce(function(pV, cV) {
                        pV[cV.alias] = cV.foreignTable;
                        return pV;
                    }, {});
                },
                enumerable: true
            }
        })
    };
};
