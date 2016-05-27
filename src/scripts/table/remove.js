"use strict";

var getFurthestChild = require("./utils/getFurthestChild"),
    getParent = require("./utils/getParent");

/**
 * @private
 * @summary deletes from furthestChild, all the way up to self
 * @param model
 * @param db
 * @param target
 */
function recursiveDelete(model, db, target) {
    var next = getFurthestChild(model, db, target);

    // delete rows from child upwards until target has been deleted
    while (next.model !== model) {
        next = getParent(
            next.model,
            db[next.model.tableName].delete(next.row[next.model.primary])
        );
    }

    return target;
}

module.exports = recursiveDelete;
