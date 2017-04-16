const getFurthestChild = require("./utils/getFurthestChild");
const getParent = require("./utils/getParent");

/**
 * @private
 * @summary deletes from furthestChild, all the way up to self
 * @param model
 * @param db
 * @param target
 */
function recursiveDelete(model, db, target) {
    let nextRow = getFurthestChild(model, db, target);

    // delete rows from child upwards until target has been deleted
    while (nextRow.model !== model) {
        const nextTable = db[nextRow.model.tableName];

        nextRow = getParent(
            nextRow.model,
            nextTable.delete(nextRow.row[nextRow.model.primary])
        );
    }

    return target;
}

module.exports = recursiveDelete;
