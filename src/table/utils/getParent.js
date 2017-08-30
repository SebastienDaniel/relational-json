function getParent(model, row) {
    if (model.extends) {
    	const parentModel = model.extends.model;
    	const parentRow = Object.getPrototypeOf(row);

        return {
            model: parentModel,
            row: parentRow
        };
    }
}

module.exports = getParent;
