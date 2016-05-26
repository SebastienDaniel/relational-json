"use strict";

var mergePutDataWithRowData = require("./mergePutDataWithRowData"),
    getFurthestAncestor = require("../utils/getFurthestAncestor"),
    getFurthestChild = require("../utils/getFurthestChild"),
    getChild = require("../utils/getChild"),
    dataDiffers = require("../utils/dataDiffers");

function getChangeRoot(model, db, row, d) {
    var next;

    if (dataDiffers(row, d)) {
        return {
            model: model,
            row: row
        };
    } else {
        next = getChild(db, model, row);

        if (next) {
            return getChangeRoot(next.model, next.row, d);
        }
    }
}

module.exports = function put(model, db, row, d) {
    var changeRoot,
        furthestChild;

    d = mergePutDataWithRowData(row, d);
    changeRoot = getChangeRoot(
        db,
        model,
        getFurthestAncestor(model, row).row,
        d
    );

    // if differences have been detected
    if (changeRoot) {
        furthestChild = getFurthestChild(changeRoot.model, db, changeRoot.row);

        // recursively delete from the first change point
        db[changeRoot.model.tableName].delete(changeRoot.row[changeRoot.model.primary]);

        // dispatch post to furthest child in inheritance chain
        return db[furthestChild.model.tableName].post(d);
    } else {
        return row;
    }
};
