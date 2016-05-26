function getChild(model, db, row) {
    "use strict";
    var res = {
        row: undefined,
        model: undefined
    };

    if (model.extendedBy) {
        if (model.extendedBy.some(function(ext) {
            if (db[ext.model.tableName].get(row[ext.localField])) {
                res.model = ext.model;
                res.row = db[ext.model.tableName].get(row[ext.localField]);
                return true;
            }
        })) {
            return res;
        }
    }
}

module.exports = getChild;
