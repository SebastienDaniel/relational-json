function getFurthestAncestor(model, row) {
    if (model.extends) {
        const parentModel = model.extends.model;
        const parentRow = Object.getPrototypeOf(row);

        return getFurthestAncestor(
            parentModel,
            parentRow
        );
    } else {
        if (Object.getPrototypeOf(row) !== null) {
            throw Error('getFurthestAncestor got a final ancestor, which still has a prototype:\n' + row + '\nfor model:\n' + model);
        }

        return {
            model: model,
            row: row
        };
    }
}

module.exports = getFurthestAncestor;
