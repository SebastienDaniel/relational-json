var getData = require("./getData");

function recursiveDelete(id, data, tableName, fullModel, db) {
    "use strict";
    var target = getData(data, id, fullModel[tableName].primary);

    if (!target) {
        throw Error("Cannot delete non existent object id: " + id);
    }

    // check for parent
    if (fullModel[tableName].extends) {
        // delete parent
        db[fullModel[tableName].extends.table].delete(id);
    }

    data.splice(data.indexOf(target), 1);
}

module.exports = recursiveDelete;
