// TODO: could be a linked list to schema tables

/**
 * returns the sequence of inheritance, by table name,
 * from child to ultimate ancestor
 * @param {string} tableName - table inheritance to scan
 * @param {object} fullModel - full graph model
 * @returns {Array}
 */
module.exports = function getInheritanceChain(tableName, fullModel) {
    "use strict";
    var chain = [];

    do {
        // push currentTable name
        chain.push(tableName);

        // if extends, keep looping
        tableName = fullModel[tableName].extends ? fullModel[tableName].extends.table : false;
    } while (tableName);

    return chain;
};
