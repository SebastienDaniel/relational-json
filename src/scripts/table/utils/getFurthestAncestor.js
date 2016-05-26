function getFurthestAncestor(model, row) {
    "use strict";
    if (model.extends) {
        return getFurthestAncestor(
            model.extends.model,
            Object.getPrototypeOf(row)
        );
    } else {
        if (Object.getPrototypeOf(row) !== null) {
            throw Error("getFurthestAncestor got a final ancestor, which still has a prototype:\n" + row + "\nfor model:\n" + model);
        }

        return {
            model: model,
            row: row
        };
    }
}

module.exports = getFurthestAncestor;
