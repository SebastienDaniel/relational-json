var post = require("./post");

module.exports = function put(d, pkValue, c) {
    // find current object
    var current = c.rows.get(pkValue || d[c.model.primary]),
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
                if (env.preprocessor) {
                    differs = !differs ? env.preprocessor(d[k]) !== current[k] : true;
                } else {
                    differs = true;
                }
            }
        }
    }

    // if differences have been detected
    if (differs) {
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
