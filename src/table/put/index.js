'use strict';

let mergePutDataWithRowData = require('./mergePutDataWithRowData'),
    getFurthestAncestor = require('../utils/getFurthestAncestor'),
    getFurthestChild = require('../utils/getFurthestChild'),
    getChild = require('../utils/getChild'),
    dataDiffers = require('../utils/dataDiffers');

function getChangeRoot(model, db, row, d) {
    let next;

    if (dataDiffers(row, d)) {
        return {
            model: model,
            row: row
        };
    } else {
        next = getChild(model, db, row);

        if (next) {
            return getChangeRoot(next.model, db, next.row, d);
        }
    }
}

module.exports = function put(model, db, row, d) {
    let changeRoot,
        furthestChild,
        furthestAncestor = getFurthestAncestor(model, row);

    d = mergePutDataWithRowData(row, d);
    changeRoot = getChangeRoot(
        furthestAncestor.model,
        db,
        furthestAncestor.row,
        d
    );

    // if differences have been detected
    if (changeRoot) {
        furthestChild = getFurthestChild(changeRoot.model, db, changeRoot.row);

        // update the data bundle to respect child data
        d = mergePutDataWithRowData(furthestChild.row, d);

        // recursively delete from the first change point
        db[changeRoot.model.tableName].delete(changeRoot.row[changeRoot.model.primary]);

        // dispatch post to furthest child in inheritance chain
        return db[furthestChild.model.tableName].post(d);
    } else {
        return row;
    }
};
