function getChild(model, db, row) {
    const res = {
        row: undefined,
        model: undefined
    };

    if (model.extendedBy) {
        if (model.extendedBy.some(function(childModel) {
            const childTable = db[childModel.model.tableName];
            const localFieldName = childModel.localField;
            const child = childTable.get(row[localFieldName]);

            if (child) {
                res.model = childModel.model;
                res.row = child;
                return true;
            }
        })) {
            return res;
        }
    }
}

module.exports = getChild;
