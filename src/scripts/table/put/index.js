"use strict";

var mergePutDataWithRowData = require("./mergePutDataWithRowData"),
    getFurthestAncestor = require("./getFurthestAncestor"),
    getFurthestChild = require("./getFurthestChild"),
    getChild = require("./getChild"),
    dataDiffers = require("./dataDiffers");

function getChangeRoot(c, model, row, d) {
    var next;

    if (dataDiffers(c, row, d)) {
        return {
            model: model,
            row: row
        };
    } else {
        next = getChild(c.env.db, model, row);

        if (next) {
            return getChangeRoot(next.model, next.row, d);
        }
    }
}

module.exports = function put(c, pkValue, d) {
    var current = c.rows.get(pkValue || d[c.model.primary]),
        changeRoot,
        furthestChild;

    if (!current) {
        throw Error("Cannot update a non-existent Object, id: " + pkValue);
    } else {
        d = mergePutDataWithRowData(current, d);
        changeRoot = getChangeRoot(
            c,
            c.model,
            getFurthestAncestor(c.model, current).row,
            d
        );
    }

    // if differences have been detected
    if (changeRoot) {
        console.log("changeRoot");
        console.log(changeRoot.row);
        furthestChild = getFurthestChild(c.env.db, changeRoot.model, changeRoot.row);

        // recursively delete from the first change point
        c.env.db[changeRoot.model.tableName].delete(changeRoot.row[changeRoot.model.primary]);

        // dispatch post to furthest child in inheritance chain
        return c.env.db[furthestChild.model.tableName].post(d);
    } else {
        return c.rows.get(pkValue || d[c.model.primary]);
    }
};
