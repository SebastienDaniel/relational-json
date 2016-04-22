function mergeRows(row, newO) {
    var o = Object.create(null, {}),
        k;

    for (k in row) {
        o[k] = newO[k] || row[k];
    }

    return o;
}

/**
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
    return Object.keys(oldO).some(function(key) {
        return oldO[key] !== (c.preprocessor ? preprocessor(c.model.tableName, c.model.fields[key], newO[key]) : newO);
    });
}

/*function valuesDiffer(o1, o2, env) {
    var k,
        tempVal,
        differs = {
            self: false,
            parent: false,
            data: {}
        };

    // check own props
    Object.keys(o1).forEach(function(k) {
        if (o1[k] === null || typeof o1[k] !== "object") {
            // set true value based on preprocessor (or not)
            tempVal = env.preprocessor ? env.preprocessor(env.model.tableName, env.model.getField(k), o2[k]) : o2[k];

            // set test result
            differs.self = !differs.self ? o2[k] !== tempVal : true;

            // assign final value for key
            differs.data[k] = differs.self ? tempVal : o1[k];
        }
    });

    // check ancestor props for differences
    for (k in o1.prototype) {
        // ignore non-primitives (object, array)
        if (o1[k] === null || typeof o1[k] !== "object") {
            // set true value based on preprocessor (or not)
            // TODO: can't apply preprocessor because I don't have ancestor model data
            tempVal = env.preprocessor ? env.preprocessor(env.model.tableName, env.model.getField(k), o2[k]) : o2[k];

            // set change test result
            differs.parent = !differs.parent ? o2[k] !== tempVal : true;

            // assign final value for key
            differs.data[k] = differs.parent ? tempVal : o1[k];
        }
    }

    return differs;
}
*/

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
                current = current.prototype;
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
        c.env.db[model.tableName].delete(current[c.model.primary]);

        // dispatch post to proper table
        return c.env.db[model.tableName].post(d);
    } else {
        return current;
    }
};
