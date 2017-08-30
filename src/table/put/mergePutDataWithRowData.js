function mergePutDataWithRowData(row, newO) {
    const o = Object.create(null);
    let k;

    for (k in row) {
        // ignore relations to other tables
        if (row[k] !== undefined && typeof row[k] !== 'object') {
            o[k] = newO[k] !== undefined ? newO[k] : row[k];
        }
    }

    return o;
}

module.exports = mergePutDataWithRowData;
