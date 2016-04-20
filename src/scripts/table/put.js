var post = require("./post");

function valuesDiffer(o1, o2, env) {
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

            // set change test result
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

module.exports = function put(c, pkValue, d) {
    // find current object
    var current = c.rows.get(pkValue || d[c.model.primary]),
        differs,
        extendedBy;

    // throw if unfound
    if (!current) {
        throw Error("Cannot update a non-existent Object, id: " + pkValue);
    }

    differs = valuesDiffer(current, d, c);

    // if differences have been detected
    if (differs.parent) {
        if (c.model.extendedBy && c.model.extendedBy.some(function(e) {
                if (!!db[e.foreignTable].get(current[e.localField])) {
                    extendedBy = e;
                    return true;
                }
            })) {
            d[extendedBy.foreignField] = d[extendedBy.localField];
            return db[extendedBy.foreignTable].put(d);
        } else {
            // remove existing object
            this.delete(pkValue || current[c.model.primary]);

            // re-create new object
            return post(d, c);
        }
    } else {
        return current;
    }
};
