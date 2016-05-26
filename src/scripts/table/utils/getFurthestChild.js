var getChild = require("./getChild");

function getFurthestChild(model, db, row) {
    "use strict";
    var child = getChild(model, db, row);

    if (child) {
        return getFurthestChild(child.model, db, child.row);
    } else {
        return {
            model: model,
            row: row
        };
    }
}

module.exports = getFurthestChild;
