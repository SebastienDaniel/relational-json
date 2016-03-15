var getData = require("./getData"),
    getAliasMap = require("./getAliasMap"),
    getRequiredFields = require("./getRequiredFields"),
    isPrimaryKeyUsed = require("./isPrimaryKeyUsed"),
    recursiveDelete = require("./recursiveDelete"),
    formatDateString = require("./formatDateString"),
    Model = require("./Model"),
    makeData = require("./makeData");

module.exports = function tableFactory(tn, fullModel, db) {
    "use strict";
    var data = [],
        m = new Model(tn, fullModel);

    return {
        // SELECT
        get: function(id) {
            return getData(data, id, m.primary);
        },
        // INSERT, should create new array
        post: function(d) {
            var obj;

            // copy data to avoid mutating argument
            d = Object.keys(d).reduce(function(o, key) {
                o[key] = d[key];
                return o;
            }, {});

            // make sure pk is unique
            if (isPrimaryKeyUsed(data, d[m.primary], m.primary)) {
                throw Error("provided " + m.primary + ": " + d[m.primary] + " is already in use in " + tn);
            } else {
                obj = makeData(m, d, tn, db);

                // create a new data array (for immutability)
                // keep index order
                data = data.concat(obj).sort(function(a, b) {
                    return a[m.primary] - b[m.primary];
                });
                return obj;
            }
        },
        // UPDATE, should create new Array and new Row
        put: function(d, pkValue) {
            // find current object
            var current = getData(data, pkValue || d[m.primary], m.primary),
                differs = false,
                extendedBy,
                k;

            // copy data to avoid mutating argument
            d = Object.keys(d).reduce(function(o, key) {
                o[key] = d[key];
                return o;
            }, {});

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
                        // re-validate if type is datetime
                        if (m.fields[k] && m.fields[k].dataType === "datetime") {
                            differs = formatDateString(d[k]) !== current[k];
                        } else {
                            differs = true;
                        }
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
            recursiveDelete(id, data, tn, fullModel, db);

            // reset data array
            data = data.slice(0, data.length);
        },
        meta: m
    };
};
