var getChild = require("./getChild");

function getFurthestChild(db, model, row) {
    "use strict";
    var child = getChild(db, model, row);

    if (child) {
        return getFurthestChild(db, child.model, child.row);
    } else {
        return {
            model: model,
            row: row
        };
    }
}

module.exports = getFurthestChild;
