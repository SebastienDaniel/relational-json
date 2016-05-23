"use strict";

var recursiveDelete = require("./recursiveDelete");

module.exports = function remove(c, id) {
    var val = c.rows.get(id);

    if (val) {
        // jumps from table to table, eliminating youngest child and up
        recursiveDelete(c.rows.get(id), c.model, c.env.db);

        // eliminate self
        c.rows.remove(id);

        return val;
    } else {
        throw Error("Cannot delete non existent object id: " + id + "\nin " + c.model.tableName);
    }
};
