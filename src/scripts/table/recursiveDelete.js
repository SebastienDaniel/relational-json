"use strict";

// should delete CHILDREN, not PARENTS
function recursiveDelete(target, model, db) {
    // for each child match
    // delete child from its table
    if (model.extendedBy) {
        model.extendedBy.forEach(function(ext) {
            var t = db[ext.model.tableName].get(target[ext.localField]);

            if (t) {
                db[ext.model.tableName].delete(t[ext.foreignField] || target[ext.localField]);
            }
        });
    }
}

module.exports = recursiveDelete;
