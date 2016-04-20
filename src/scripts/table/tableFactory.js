var recursiveDelete = require("./recursiveDelete"),
    formatDateString = require("../row/formatDateString"),
    model = require("../model/modelFactory"),
    ImmDictionary = require("./ImmutableDictionary"),
    post = require("./post");

module.exports = function tableFactory(tn, fullModel, env) {
    "use strict";
    var rows = new ImmDictionary(), // table's private data
        m = model(tn, fullModel); // table's model instance

    return Object.freeze({
        get: function() {
            var aL = arguments.length,
                a,
                i;

            if (aL === 0) {
                return rows.all();
            } else if (aL === 1) {
                return rows.get(arguments[0]);
            } else {
                a = [];

                for (i = 0; i < aL; i++) {
                    a.push(rows.get(arguments[i]));
                }

                return a;
            }
        },
        post: function(d) {
            // make sure pk is unique
            if (rows.has(d[m.primary])) {
                throw Error("provided " + m.primary + ": " + d[m.primary] + " is already in use in " + tn);
            } else {
                rows.add(d[m.primary], post(m, d, tn, env));

                return this.get(d[m.primary]);
            }
        },
        put: function(d, pkValue) {
            // find current object
            var current = rows.get(pkValue || d[m.primary]),
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
        delete: function(id) {
            if (rows.has(id)) {
                // jumps from table to table, eliminating youngest child and up
                recursiveDelete(rows.get(id), m, env.db);

                // eliminate self
                return rows.remove(id);
            } else {
                throw Error("Cannot delete non existent object id: " + id + "\nin " + tn);
            }
        },
        meta: m
    });
};
