
// should delete CHILDREN, not PARENTS
function recursiveDelete(target, model, db) {
    "use strict";

    // for each child match
    // delete child from its table
    model.extendedBy.forEach(function(ext) {
        var t = db[ext.table].get(target[ext.localField]);

        if (t) {
            db[ext.table].delete(t[ext.foreignField] || target[ext.localField]);
        }
    });
}

module.exports = recursiveDelete;