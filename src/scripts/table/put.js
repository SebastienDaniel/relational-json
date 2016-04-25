"use strict";

function mergeRows(row, newO) {
    var o = Object.create(null, {}),
        k;

    for (k in row) {
        o[k] = newO[k] || row[k];
    }

    return o;
}

/**
 * @private
 * assumes that ALL possible fields are ALWAYS present on a row
 * scans based on current row, to find applicable keys
 * @param c
 * @param oldO
 * @param newO
 * @returns {boolean}
 */
function shouldUpdate(c, oldO, newO) {
    /**
     * check if any OWN values from oldO differ from those of newO
     */
    console.log(oldO);
    return Object.keys(oldO).some(function(key) {
        console.log(key);
        if (c.preprocessor) {
            console.log(oldO[key] !== c.preprocessor(c.model.tableName, c.model.fields[key], newO[key]));
            return oldO[key] !== c.preprocessor(c.model.tableName, c.model.fields[key], newO[key]);
        } else {
            console.log(oldO[key] !== newO[key]);
            return oldO[key] !== newO[key];
        }
    });
}

module.exports = function put(c, pkValue, d) {
    // find current object
    var current = c.rows.get(pkValue || d[c.model.primary]),
        update = false,
        model = c.model;

    // throw if unfound
    if (!current) {
        throw Error("Cannot update a non-existent Object, id: " + pkValue);
    } else {
        d = mergeRows(current, d);
    }

    while (!update && model) {
        // no change detected
        if (!shouldUpdate(c, current, d)) {
            // can we lookup to parent?
            if (model.extends) {
                current = Object.getPrototypeOf(current);
                model = model.extends;
            } else {
                // break loop
                model = false;
            }
        } else {
            update = true;
        }
    }

    // if differences have been detected
    if (update) {
        // dispatch delete to proper table
        c.env.db[c.model.tableName].delete(current[c.model.primary]);

        // dispatch post to proper table
        return c.env.db[c.model.tableName].post(d);
    } else {
        return current;
    }
};
