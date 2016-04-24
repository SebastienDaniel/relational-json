"use strict";

var recursiveDelete = require("./recursiveDelete");

module.exports = function remove(c, id) {
    if (c.rows.has(id)) {
        // jumps from table to table, eliminating youngest child and up
        recursiveDelete(c.rows.get(id), c.model, c.env.db);

        // eliminate self
        return c.rows.remove(id);
    } else {
        throw Error("Cannot delete non existent object id: " + id + "\nin " + c.model.tableName);
    }
};
