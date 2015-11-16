/**
 * returns the ultimate ancestor of a given table
 * @param tableName
 * @param fullModel
 * @returns {*}
 */
module.exports = function getFurthestAncestorField(tableName, fullModel) {
    "use strict";
    var p = fullModel[tableName].extends;

    if (p) {
        // peak one step further
        if (getFurthestAncestorField(p.table, fullModel) !== null) {
            return getFurthestAncestorField(p.table, fullModel);
        } else {
            return p.foreign;
        }
    } else {
        return null;
    }
};
