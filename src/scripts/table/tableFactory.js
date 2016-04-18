var get = require("./get"),
    recursiveDelete = require("./recursiveDelete"),
    formatDateString = require("../row/formatDateString"),
    model = require("../model/modelFactory"),
    post = require("./post");

function hashToList(obj) {
    return Object.keys(obj).map(function(key) {
        return obj[key];
    });
}

function copyHashMap(obj) {
    return Object.keys(obj).reduce(function(o, key) {
        o[key] = obj[key];
        return o;
    }, {});
}

module.exports = function tableFactory(tn, fullModel, db) {
    "use strict";
    // TODO: data should be a hash-map, because each PK value is unique
    var rows = {}, // table's private data
        m = model(tn, fullModel); // table's model instance

    return {
        // SELECT
        get: function(id) {
            return id ? rows[id] : hashToList(rows);
        },
        // INSERT, should create new array
        post: function(d) {
            var obj;

            // make sure pk is unique
            if (rows[d[m.primary]]) {
                throw Error("provided " + m.primary + ": " + d[m.primary] + " is already in use in " + tn);
            } else {
                obj = post(m, d, tn, db);

                // create a new data array (for immutability)
                // keep index order
                rows = copyHashMap(rows);
                rows[obj[m.primary]] = obj;

                return obj;
            }
        },
        // UPDATE, should create new Array and new Row
        put: function(d, pkValue) {
            // find current object
            var current = rows[pkValue || d[m.primary]],
                differs = false,
                extendedBy,
                k;

            // copy data to avoid mutating argument
            // TODO: overzealous?
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
                            differs = !differs ? formatDateString(d[k]) !== current[k] : true;
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
        // TODO: NOT ADAPTED to HASHMAP structure
        delete: function(id) {
            recursiveDelete(id, rows, tn, fullModel, db);

            // reset data array
            rows = rows.slice(0, rows.length);
        },
        meta: m
    };
};
