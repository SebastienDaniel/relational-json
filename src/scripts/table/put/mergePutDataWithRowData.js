function mergePutDataWithRowData(row, newO) {
    "use strict";
    var o = Object.create(null),
        k;

    for (k in row) {
        // ignore relations to other tables
        if (row[k] !== undefined && typeof row[k] !== "object") {
            o[k] = newO[k] !== undefined ? newO[k] : row[k];
        }
    }

    return o;
}

module.exports = mergePutDataWithRowData;
