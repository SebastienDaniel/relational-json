/**
 * returns the sequence of inheritance, from child to ultimate parent
 * @param {string} tableName - table inheritance to scan
 * @param {object} fullModel - full graph model
 * @returns {Array}
 */
module.exports = function getInheritanceChain(tableName, fullModel) {
    var chain = [],
        ext,
        stopLoop = false;

    while (stopLoop === false) {
        // push currentTable name
        chain.push(tableName);

        // get extension info
        ext = fullModel[tableName].extends;

        // if extends, keep looping
        if (ext) {
            tableName = ext.table;
        } else {
            stopLoop = true;
        }
    }

    return chain;
};
